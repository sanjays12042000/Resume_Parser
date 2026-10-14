import "dotenv/config";

/**
 * All environment reads happen here, once, so the rest of the app never
 * touches process.env. Defaults are for local development.
 */
export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/resumeiq",
  labdApiKey: process.env.LABD_API_KEY || "",
  corsOrigin: (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};
