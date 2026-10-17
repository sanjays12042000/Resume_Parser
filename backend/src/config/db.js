import mongoose from "mongoose";
import { config } from "./env.js";

/**
 * Connect to MongoDB. Deliberately non-fatal: if the database is not running
 * the API still serves /api/analyze, and saving history is skipped. That keeps
 * the app usable while you are setting Mongo up.
 */
export async function connectDb() {
  mongoose.connection.on("connected", () => console.log("[db] connected to MongoDB"));
  mongoose.connection.on("disconnected", () => console.warn("[db] disconnected"));
  mongoose.connection.on("error", (err) => console.error("[db] error:", err.message));

  try {
    const connection = mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });

    await Promise.race([
      connection,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("MongoDB connection timed out.")), 4000);
      })
    ]);

    return true;
  } catch (err) {
    console.warn("[db] could not connect to MongoDB:", err.message);
    console.warn("[db] analyses will not be saved until it is available");
    return false;
  }
}

/** "connected" when Mongo is up, anything else otherwise. */
export function dbStatus() {
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
}
