import mongoose from "mongoose";

/**
 * One saved run: the job description that was compared against, the resume
 * text that was read, and the resulting score. The resume text is kept so an
 * analysis can be re-run later when the AI ranker replaces keyword matching.
 */
const analysisSchema = new mongoose.Schema(
  {
    jobDescription: { type: String, required: true },
    resumeText: { type: String, required: true },
    fileName: { type: String, default: "" },
    score: { type: Number, required: true },
    band: { type: String, required: true },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    education: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvementSuggestions: { type: [String], default: [] },
    engine: { type: String, default: "keyword-v1" }
  },
  { timestamps: true }
);

export const Analysis = mongoose.model("Analysis", analysisSchema);
