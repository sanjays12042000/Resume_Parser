import { describeError, errorsAreDetailed } from "./diagnostics.js";

export function errorHandler(error, _req, res, _next) {
  if (error instanceof Error && error.name === "MulterError") {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(status).json({
      error: error.code === "LIMIT_FILE_SIZE"
        ? "The PDF must be 10 MB or smaller."
        : "Upload exactly one PDF resume."
    });
  }

  // Errors we raised on purpose carry a message meant for the learner.
  if (error?.statusCode) {
    const body = { error: error.message };
    // A 500 means something unexpected broke, so include the cause to make it
    // diagnosable without log access. Outside production only.
    if (error.statusCode >= 500 && errorsAreDetailed()) {
      body.details = describeError(error.cause || error);
    }
    return res.status(error.statusCode).json(body);
  }

  console.error("[api] request failed:", error);
  const body = { error: "The analysis could not be completed." };
  if (errorsAreDetailed()) body.details = describeError(error);
  return res.status(500).json(body);
}
