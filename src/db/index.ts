import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

// For Node-postgres pool setup
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Force node-postgres to parse TIMESTAMP (without timezone) as UTC
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (val) => {
  return new Date(val + 'Z');
});

export const db = drizzle(pool);
export { pool };
