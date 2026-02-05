 import pg from "pg";
 import "dotenv/config";

 const { Pool } = pg;
import { readFile } from "fs/promises";

async function applyMigration() {
  try {
     const pool = new Pool({
       connectionString: process.env.DATABASE_URL,
       ssl: { rejectUnauthorized: false }
     });

     const client = await pool.connect();
    
    const sql = await readFile("./migrations/0001_normalize_schema.sql", "utf-8");
    
    console.log("🔄 Starting database migration...");
    await client.query(sql);
    console.log("✅ Migration completed successfully!");
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

applyMigration();
