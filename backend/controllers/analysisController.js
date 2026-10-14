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

export default analyzeResumeController;
