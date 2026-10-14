import { Router } from "express";

import analyzeResumeController from "../controllers/analysisController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/analyze", upload.single("resume"), analyzeResumeController);

export default router;
