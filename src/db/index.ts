import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

function getSslConfig(): boolean | pg.PoolConfig['ssl'] {
  const dbUrl = process.env.DATABASE_URL || '';
  if (dbUrl.includes('sslmode=disable')) {
    return false;
  }

  // 1. Check if CA Certificate contents are in environment variable DB_CA_CERT
  if (process.env.DB_CA_CERT) {
    return {
      rejectUnauthorized: true,
      ca: process.env.DB_CA_CERT,
    };
  }

  // 2. Check if certificate file exists at specified path or root directory
  const certPath = process.env.DB_CERT_PATH || path.join(process.cwd(), 'ca-certificate.crt');
  if (fs.existsSync(certPath)) {
    return {
      rejectUnauthorized: true,
      ca: fs.readFileSync(certPath, 'utf8'),
    };
  }

  // 3. Fallback: allow SSL connection if no certificate file is supplied
  return { rejectUnauthorized: false };
}

// For Node-postgres pool setup
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: getSslConfig(),
});

// Force node-postgres to parse TIMESTAMP (without timezone) as UTC
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (val) => {
  return new Date(val + 'Z');
});

export const db = drizzle(pool);
export { pool };
