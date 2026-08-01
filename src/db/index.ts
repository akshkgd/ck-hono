import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const dbUrl = process.env.DATABASE_URL || '';
const isLocalhost = !dbUrl || 
  dbUrl.includes('localhost') || 
  dbUrl.includes('127.0.0.1') ||
  dbUrl.includes('0.0.0.0');

const useSsl = !isLocalhost && !dbUrl.includes('sslmode=disable');

// For Node-postgres pool setup
const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

// Force node-postgres to parse TIMESTAMP (without timezone) as UTC
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (val) => {
  return new Date(val + 'Z');
});

export const db = drizzle(pool);
export { pool };
