const { Client } = await import("pg");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const maxAttempts = Number(process.env.DB_WAIT_ATTEMPTS || 30);
const delayMs = Number(process.env.DB_WAIT_DELAY_MS || 1000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    await client.end();
    console.log("Database is ready.");
    process.exit(0);
  } catch (error) {
    console.log(
      `Waiting for database... (${attempt}/${maxAttempts}) ${error.message}`,
    );
  } finally {
    await client.end().catch(() => {});
  }

  await sleep(delayMs);
}

console.error("Database did not become ready in time.");
process.exit(1);
