import cors from "cors";
import express from "express";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

export default app;

async function start() {
  await connectDb();
  app.listen(config.port, () => {
    console.log(`[api] listening on http://localhost:${config.port}`);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  start().catch((error) => {
    console.error("[api] failed to start:", error);
    process.exitCode = 1;
  });
}
