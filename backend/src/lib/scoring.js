import { DEFAULT_SKILLS, aliasRegex, findSkill } from "./skills.js";
import { extractJobSkills } from "./jobSkills.js";

/* ---------- structural checks ---------- */

// Six structural things real screeners look for, independent of any role.
export function healthChecks(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const has = (re) => re.test(text);

  return [
    {
      pass: has(/\b[\w.+-]+@[\w-]+\.[\w.]+\b/),
      label: "Contact email found",
      hint: "Add an email address near the top."
    },
    {
      pass: has(/(\+?\d[\d\s().-]{7,}\d)/),
      label: "Phone number found",
      hint: "Add a phone number recruiters can call."
    },
    {
      pass: has(/\b(linkedin|github|portfolio|https?:\/\/)\b/i),
      label: "Links found (GitHub / LinkedIn / portfolio)",
      hint: "Link a GitHub, LinkedIn or portfolio URL."
    },
    {
      pass: words >= 300,
      label: `Length is substantial (${words} words)`,
      hint: "Under 300 words usually reads as thin. Aim for one full page."
    },
    {
      pass: has(/\b(experience|employment|work history|projects)\b/i),
      label: "Experience or projects section present",
      hint: "Add an Experience or Projects section with headers."
    },
    {
      pass: has(/\b(education|b\.?tech|bachelor|master|degree|university|college)\b/i),
      label: "Education section present",
      hint: "Add an Education section — ATS parsers look for it."
    }
  ];
}

/* ---------- scoring maths ---------- */

// Blend: the skills the posting asked for are 80%, resume structure is 20%.
export function computeScore(skillPct, passedChecks, totalChecks) {
  return Math.round(skillPct * 80 + (passedChecks / totalChecks) * 20);
}

export function bandFor(score) {
  if (score >= 80) return { band: "Strong match", sub: "Your resume shows most of what this posting asks for." };
  if (score >= 60) return { band: "Solid start", sub: "Close — a few gaps are holding the score down." };
  if (score >= 40) return { band: "Needs work", sub: "Several of the posting's core skills aren't showing yet." };
  return { band: "Low match", sub: "This resume doesn't read as a fit for this posting yet." };
}

// The "fix this first" line: worst structural failure, else heaviest missing skill.
export function nextStepFor({ checks, missing, usingFallback }) {
  const worstCheck = checks?.find((c) => !c.pass);
  const heaviestGap = missing?.find((s) => s.weight >= 2) || missing?.[0];
  const fallbackNote = usingFallback
    ? " The posting didn't name specific skills, so this is checked against a general list — paste a fuller job description for a sharper score."
    : "";

  if (worstCheck) {
    return `${worstCheck.hint} After that, ${
      heaviestGap
        ? `work "${heaviestGap.name}" into your bullets if you've used it.`
        : "keep the skill list as it is."
    }${fallbackNote}`;
  }
  if (heaviestGap) {
    return `Structure is clean. The biggest gap is "${heaviestGap.name}", which this posting asks for. If you've used it, name it in a bullet; if not, that's your next thing to learn.${fallbackNote}`;
  }
  return "No gaps left against this posting. Tailor your top three bullets to it and apply.";
}

/* ---------- the pipeline ---------- */

/**
 * Score a resume against a job description.
 *
 * Steps: pull the skills out of the posting -> check which of them the resume
 * shows -> add the structural checks -> blend into one 0-100 score.
 *
 * The AI ranking step will slot in where `extractJobSkills` and `findSkill`
 * are called; everything downstream of them stays the same.
 */
export function summarizeResumeAnalysis(resumeText, present = [], missing = []) {
  const text = resumeText || "";
  const education = [...new Set(
    (text.split(/\n|\r\n|\.|;/)
      .map((line) => line.trim())
      .filter((line) => /\b(b\.?tech|bachelor|master|degree|diploma|university|college|education|school)\b/i.test(line)))
      .slice(0, 5)
  )];

  const experience = [...new Set(
    (text.split(/\n|\r\n|\.|;/)
      .map((line) => line.trim())
      .filter((line) => /\b(experience|developer|engineer|analyst|manager|intern|lead|worked|building|created|delivered|collaborated)\b/i.test(line)))
      .slice(0, 5)
  )];

  const strengths = [];
  if (present.length) {
    strengths.push(...present.slice(0, 4).map((skill) => `${skill.name} is clearly reflected in the resume.`));
  }
  if (/\b(build|develop|improve|optimize|reduce|increase|deliver|lead|design|ship|create)\b/i.test(text)) {
    strengths.push("The resume shows measurable, action-oriented impact statements.");
  }
  if (!strengths.length) {
    strengths.push("The resume includes concrete technical and professional details.");
  }

  const weaknesses = [];
  if (missing.length) {
    weaknesses.push(`Missing skills: ${missing.slice(0, 3).map((skill) => skill.name).join(", ")}.`);
  }
  const checks = healthChecks(text);
  const failedChecks = checks.filter((check) => !check.pass).map((check) => check.label);
  if (failedChecks.length) {
    weaknesses.push(`Resume structure could improve: ${failedChecks.slice(0, 3).join(", ")}.`);
  }
  if (!weaknesses.length) {
    weaknesses.push("No major gaps were detected in the submission.");
  }

  const improvementSuggestions = [];
  if (missing.length) {
    improvementSuggestions.push(`Add concrete examples for ${missing.slice(0, 3).map((skill) => skill.name).join(", ")}.`);
  }
  if (!/\b(linkedin|github|portfolio|https?:\/\/)/i.test(text)) {
    improvementSuggestions.push("Include a GitHub, LinkedIn, or portfolio link near the top of the resume.");
  }
  if (!/\b(education|b\.?tech|bachelor|master|degree|university|college)\b/i.test(text)) {
    improvementSuggestions.push("Add a visible education section with degrees, institutions, and years.");
  }
  if (!improvementSuggestions.length) {
    improvementSuggestions.push("Highlight your strongest project impact in a few concise bullet points for the target role.");
  }

  return {
    education,
    experience,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    improvementSuggestions: improvementSuggestions.slice(0, 5)
  };
}

export function analyzeResume(resumeText, jobDescription) {
  const resume = resumeText || "";
  const jd = jobDescription || "";

  const jobSkills = extractJobSkills(jd);
  const usingFallback = jobSkills.length === 0;
  const skills = usingFallback ? DEFAULT_SKILLS : jobSkills;

  const present = [];
  const missing = [];
  let earned = 0;
  let total = 0;

  for (const skill of skills) {
    total += skill.weight;
    const hit = findSkill(resume, skill);
    if (hit) {
      earned += skill.weight;
      present.push(skill);
    } else {
      missing.push(skill);
    }
  }

  missing.sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));

  const skillPct = total ? earned / total : 0;
  const checks = healthChecks(resume);
  const passed = checks.filter((c) => c.pass).length;
  const score = computeScore(skillPct, passed, checks.length);

  return {
    score,
    ...bandFor(score),
    present,
    missing,
    checks,
    passed,
    totalChecks: checks.length,
    matchedWeight: earned,
    totalWeight: total,
    skillPct,
    totalSkills: skills.length,
    usingFallback,
    nextStep: nextStepFor({ checks, missing, usingFallback }),
    engine: "keyword-v1",
    analyzedAt: new Date().toISOString(),
    ...summarizeResumeAnalysis(resume, present, missing)
  };
}

export { aliasRegex, findSkill, DEFAULT_SKILLS };
