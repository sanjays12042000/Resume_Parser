export function errorHandler(error, _req, res, _next) {
  if (error instanceof Error && error.name === "MulterError") {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(status).json({
      error: error.code === "LIMIT_FILE_SIZE"
        ? "The PDF must be 10 MB or smaller."
        : "Upload exactly one PDF resume."
    });
  }

  if (error?.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error("[api] request failed:", error);
  return res.status(500).json({ error: "The analysis could not be completed." });
}
