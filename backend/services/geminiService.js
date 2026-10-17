import { config } from "../src/config/env.js";
import { bandFor, computeScore, healthChecks, summarizeResumeAnalysis } from "../src/lib/scoring.js";
import { httpError } from "../utils.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const REQUEST_TIMEOUT_MS = 45_000;

export async function analyzeWithGemini(resumeText, jobDescription) {
  if (!config.geminiApiKey) {
    throw httpError("The Gemini API key is not configured on the backend.", 503);
  }

  const prompt = [
    "You are a resume-to-job matcher.",
    "Compare the resume against the job description and return only valid JSON with this exact shape:",
    '{"skills":[{"name":"React","weight":3,"present":true}],"nextStep":"One concise practical improvement suggestion."}',
    "Consider only evidence present in the resume; do not invent experience.",
    "Use weights 1, 2, or 3 for skill importance: 3 for essential, 2 for important, and 1 for nice-to-have.",
    "Limit the skills array to 1-30 concise entries and ensure there are no duplicates.",
    "JOB DESCRIPTION:",
    jobDescription,
    "RESUME:",
    resumeText
  ].join("\n\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${config.geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      if (response.status === 400) {
        throw httpError("The Gemini request was rejected. Check the prompt or API key configuration.", 400);
      }
      if (response.status === 401 || response.status === 403) {
        throw httpError("The Gemini API key is invalid or not authorized for this project.", 401);
      }
      if (response.status === 429) {
        throw httpError("The Gemini API rate limit has been reached. Please try again later.", 429);
      }
      throw httpError(errorText || "The Gemini AI service could not complete the request.", response.status || 502);
    }

    const payload = await response.json();
    const content = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") || "";

    if (!content) {
      throw httpError("The Gemini AI service returned an empty response.", 502);
    }

    let result;
    try {
      result = JSON.parse(content.trim().replace(/^```(?:json)?\s*|\s*```$/gi, ""));
    } catch {
      throw httpError("The Gemini AI service returned invalid JSON.", 502);
    }

    return buildGeminiAnalysis(result, resumeText);
  } catch (error) {
    if (error?.name === "AbortError") {
      throw httpError("The Gemini AI analysis timed out. Please try again.", 504);
    }
    if (error?.statusCode) {
      throw error;
    }
    throw httpError("Could not reach the Gemini AI service. Please try again.", 502);
  } finally {
    clearTimeout(timeout);
  }
}

function buildGeminiAnalysis(result, resumeText) {
  if (!Array.isArray(result?.skills) || result.skills.length === 0 || result.skills.length > 30) {
    throw httpError("The Gemini AI service returned an invalid skills list.", 502);
  }

  const seen = new Set();
  const present = [];
  const missing = [];

  for (const skill of result.skills) {
    if (
      typeof skill?.name !== "string" ||
      !skill.name.trim() ||
      skill.name.trim().length > 80 ||
      ![1, 2, 3].includes(skill.weight) ||
      typeof skill.present !== "boolean"
    ) {
      throw httpError("The Gemini AI service returned invalid skill data.", 502);
    }

    const name = skill.name.trim();
    const normalizedName = name.toLowerCase();
    if (seen.has(normalizedName)) {
      throw httpError("The Gemini AI service returned duplicate skills.", 502);
    }
    seen.add(normalizedName);

    (skill.present ? present : missing).push({ name, weight: skill.weight });
  }

  missing.sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));

  const totalWeight = [...present, ...missing].reduce((total, skill) => total + skill.weight, 0);
  const matchedWeight = present.reduce((total, skill) => total + skill.weight, 0);
  const skillPct = totalWeight ? matchedWeight / totalWeight : 0;
  const checks = healthChecks(resumeText);
  const passed = checks.filter((check) => check.pass).length;
  const score = computeScore(skillPct, passed, checks.length);
  const nextStep =
    typeof result.nextStep === "string" && result.nextStep.trim().length > 0
      ? result.nextStep.trim().slice(0, 1000)
      : "Review the missing skills and add relevant evidence to your resume where appropriate.";

  const summary = summarizeResumeAnalysis(resumeText, present, missing);

  return {
    score,
    ...bandFor(score),
    present,
    missing,
    checks,
    passed,
    totalChecks: checks.length,
    matchedWeight,
    totalWeight,
    skillPct,
    totalSkills: present.length + missing.length,
    usingFallback: false,
    nextStep,
    engine: "gemini-ai-v1",
    analyzedAt: new Date().toISOString(),
    ...summary
  };
}
