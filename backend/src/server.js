import cors from "cors";
import express from "express";
import multer from "multer";

import { connectDb, dbStatus } from "./config/db.js";
import { config } from "./config/env.js";
import { Analysis } from "./models/Analysis.js";
import { analyzeResume } from "./lib/scoring.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, callback) {
    const isPdf = file.mimetype === "application/pdf" || /\.pdf$/i.test(file.originalname);
    callback(isPdf ? null : httpError("Upload a PDF resume.", 400), isPdf);
  }
});

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", database: dbStatus() });
});

app.post("/api/analyze", upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw httpError("Upload a PDF resume to analyze.", 400);
    }

    const jobDescription =
      typeof req.body.jobDescription === "string" ? req.body.jobDescription.trim() : "";
    if (!jobDescription) {
      throw httpError("Paste a job description before starting the analysis.", 400);
    }
    if (jobDescription.length > 20000) {
      throw httpError("The job description must be 20,000 characters or fewer.", 413);
    }
    if (req.file.buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
      throw httpError("The uploaded file is not a valid PDF.", 400);
    }

    const resumeText = await extractPdfText(req.file.buffer);
    if (!resumeText.trim()) {
      throw httpError(
        "No selectable text was found in this PDF. Scanned or image-only resumes are not supported yet.",
        422
      );
    }

    const analysis = analyzeResume(resumeText, jobDescription);
    let saved = false;
    if (dbStatus() === "connected") {
      const record = await Analysis.create({
        jobDescription,
        resumeText,
        fileName: req.file.originalname,
        score: analysis.score,
        band: analysis.band,
        matchedSkills: analysis.present.map((skill) => skill.name),
        missingSkills: analysis.missing.map((skill) => skill.name),
        engine: analysis.engine
      });
      analysis.analysisId = record.id;
      saved = true;
    }

    res.json({ ...analysis, saved });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(status).json({
      error: error.code === "LIMIT_FILE_SIZE"
        ? "The PDF must be 10 MB or smaller."
        : "Upload exactly one PDF resume."
    });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error("[api] request failed:", error);
  return res.status(500).json({ error: "The analysis could not be completed." });
});

async function extractPdfText(buffer) {
  let pdf;
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdf = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      standardFontDataUrl: new URL(
        "../node_modules/pdfjs-dist/standard_fonts/",
        import.meta.url
      ).href
    }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(" "));
    }
    return pages.join("\n");
  } catch {
    throw httpError("The uploaded PDF could not be read.", 422);
  } finally {
    if (pdf) await pdf.destroy();
  }
}

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function start() {
  await connectDb();
  app.listen(config.port, () => {
    console.log(`[api] listening on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("[api] failed to start:", error);
  process.exitCode = 1;
});
