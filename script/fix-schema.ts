import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(
      path.join(process.cwd(), "fix-schema.sql"),
      "utf-8"
    );
    console.log("Executing schema fix...");
    await client.query(sql);
    console.log("✓ Schema fixed successfully!");
  } catch (error) {
    console.error("✗ Failed to fix schema:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
