import { connectDb } from "../src/config/db.js";
import app from "../server.js";

const databaseConnection = connectDb();

export default async function handler(req, res) {
  await databaseConnection;
  return app(req, res);
}
