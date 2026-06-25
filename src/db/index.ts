import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

// For Node-postgres pool setup
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
export { pool };
