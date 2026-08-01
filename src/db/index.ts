import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

function getSslConfig(): boolean | pg.PoolConfig['ssl'] {
  const dbUrl = process.env.DATABASE_URL || '';
  if (dbUrl.includes('sslmode=disable')) {
    return false;
  }

  const rejectUnauthorized = process.env.DB_REJECT_UNAUTHORIZED === 'true';

  // If strict validation is explicitly requested via env, supply the CA certificate
  if (rejectUnauthorized) {
    if (process.env.DB_CA_CERT) {
      return {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT,
      };
    }

    const certPath = process.env.DB_CERT_PATH || path.join(process.cwd(), 'ca-certificate.crt');
    if (fs.existsSync(certPath)) {
      return {
        rejectUnauthorized: true,
        ca: fs.readFileSync(certPath, 'utf8'),
      };
    }
  }

  // Standard Managed DB SSL (DigitalOcean, Heroku, Render):
  // Enables full TLS encryption without strict CA chain rejection
  return { rejectUnauthorized: false };
}

function getConnectionString(): string {
  const dbUrl = process.env.DATABASE_URL || '';
  // Strip sslmode query parameter so pg-connection-string doesn't override pool SSL options with verify-full (rejectUnauthorized: true)
  return dbUrl.replace(/([?&])sslmode=[^&]*&?/, '$1').replace(/[?&]$/, '');
}

// For Node-postgres pool setup
const pool = new pg.Pool({
  connectionString: getConnectionString(),
  ssl: getSslConfig(),
});

// Force node-postgres to parse TIMESTAMP (without timezone) as UTC
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (val) => {
  return new Date(val + 'Z');
});

export const db = drizzle(pool);
export { pool };
