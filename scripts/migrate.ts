import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../src/db/index.js';

async function main() {
  console.log("Running database migrations from src/db/migrations...");
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log("Migrations applied successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

main();
