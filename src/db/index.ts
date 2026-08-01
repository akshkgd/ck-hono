import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const hasSslOption = process.env.DATABASE_URL?.includes('sslmode=') || process.env.DATABASE_URL?.includes('ssl=');
const isLocalhost = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1');

const useSsl = hasSslOption
  ? !process.env.DATABASE_URL?.includes('sslmode=disable')
  : (process.env.NODE_ENV === 'production' && !isLocalhost);

// For Node-postgres pool setup
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

// Force node-postgres to parse TIMESTAMP (without timezone) as UTC
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (val) => {
  return new Date(val + 'Z');
});

export const db = drizzle(pool);
export { pool };
