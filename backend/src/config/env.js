import "dotenv/config";

/**
 * All environment reads happen here, once, so the rest of the app never
 * touches process.env. Defaults are for local development.
 */
export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/resumeiq",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  corsOrigin: (
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN ||
    "http://localhost:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};
