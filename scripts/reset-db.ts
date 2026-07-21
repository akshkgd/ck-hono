import pg from 'pg';
import 'dotenv/config';

async function resetDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL environment variable is not defined");
    process.exit(1);
  }

  console.log("Connecting to PostgreSQL to reset public schema...");
  const pool = new pg.Pool({ connectionString: dbUrl });

  try {
    const client = await pool.connect();
    console.log("Dropping existing public schema...");
    await client.query("DROP SCHEMA public CASCADE;");
    console.log("Re-creating fresh public schema...");
    await client.query("CREATE SCHEMA public;");
    console.log("Public schema reset completed successfully!");
    client.release();
  } catch (err) {
    console.error("Failed to reset database schema:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDb();
