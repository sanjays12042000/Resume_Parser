import { Analysis } from "../src/models/Analysis.js";
import { analyzeUploadedResume } from "../services/analysisService.js";

export async function analyzeResumeController(req, res, next) {
  try {
    const result = await analyzeUploadedResume({
      file: req.file,
      jobDescription: req.body.jobDescription
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getAnalysesController(_req, res, next) {
  try {
    const analyses = await Analysis.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select({
        _id: 1,
        score: 1,
        band: 1,
        engine: 1,
        createdAt: 1,
        fileName: 1,
        matchedSkills: 1,
        missingSkills: 1,
        education: 1,
        experience: 1,
        strengths: 1,
        weaknesses: 1,
        improvementSuggestions: 1
      });

    return res.json({ analyses });
  } catch (error) {
    return next(error);
  }
}

export async function getAnalysisController(req, res, next) {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found." });
    }
    return res.json({ analysis });
  } catch (error) {
    return next(error);
  }
}

export default analyzeResumeController;
