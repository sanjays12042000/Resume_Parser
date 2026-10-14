import cors from "cors";
import express from "express";

import { connectDb, dbStatus } from "./src/config/db.js";
import { config } from "./src/config/env.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", database: dbStatus() });
});

app.use("/api", analyzeRoutes);
app.use(errorHandler);

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
