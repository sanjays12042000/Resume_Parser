import multer from "multer";

import { httpError } from "../utils.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, callback) {
    const isPdf = file.mimetype === "application/pdf" || /\.pdf$/i.test(file.originalname);
    callback(isPdf ? null : httpError("Upload a PDF resume.", 400), isPdf);
  }
});

export default upload;
