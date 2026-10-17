import { Router } from "express";

import {
  analyzeResumeController,
  getAnalysisController,
  getAnalysesController
} from "../controllers/analysisController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/analyses", getAnalysesController);
router.get("/analyses/:id", getAnalysisController);
router.post("/analyze", upload.single("resume"), analyzeResumeController);

export default router;
