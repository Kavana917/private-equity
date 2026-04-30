import fs from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is required in environment variables.");
}
export const pool = new Pool({ connectionString });
export async function executeSqlFile(relativePath) {
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const sql = await fs.readFile(absolutePath, "utf8");
    await pool.query(sql);
}
