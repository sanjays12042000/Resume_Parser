import { dbStatus } from "../src/config/db.js";
import { analyzeResume } from "../src/lib/scoring.js";
import { Analysis } from "../src/models/Analysis.js";
import { extractPdfText, httpError } from "../utils.js";

export async function analyzeUploadedResume({ file, jobDescription }) {
  if (!file) {
    throw httpError("Upload a PDF resume to analyze.", 400);
  }

  const normalizedJobDescription =
    typeof jobDescription === "string" ? jobDescription.trim() : "";

  if (!normalizedJobDescription) {
    throw httpError("Paste a job description before starting the analysis.", 400);
  }

  if (normalizedJobDescription.length > 20000) {
    throw httpError("The job description must be 20,000 characters or fewer.", 413);
  }

  if (file.buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw httpError("The uploaded file is not a valid PDF.", 400);
  }

  const resumeText = await extractPdfText(file.buffer);
  if (!resumeText.trim()) {
    throw httpError(
      "No selectable text was found in this PDF. Scanned or image-only resumes are not supported yet.",
      422
    );
  }

  const analysis = analyzeResume(resumeText, normalizedJobDescription);
  let saved = false;

  if (dbStatus() === "connected") {
    const record = await Analysis.create({
      jobDescription: normalizedJobDescription,
      resumeText,
      fileName: file.originalname,
      score: analysis.score,
      band: analysis.band,
      matchedSkills: analysis.present.map((skill) => skill.name),
      missingSkills: analysis.missing.map((skill) => skill.name),
      engine: analysis.engine
    });

    analysis.analysisId = record.id;
    saved = true;
  }

  return { ...analysis, saved };
}
