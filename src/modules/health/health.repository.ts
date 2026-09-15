import { sql } from 'drizzle-orm';
import { db } from '../../db/index.js';

export class HealthRepository {
  /**
   * Pings the PostgreSQL database with a lightweight SELECT 1 query
   * and measures round-trip latency.
   */
  public async pingDatabase(): Promise<{ healthy: boolean; latencyMs: number }> {
    const startTime = performance.now();
    try {
      await db.execute(sql`SELECT 1`);
      const latencyMs = Number((performance.now() - startTime).toFixed(2));
      return { healthy: true, latencyMs };
    } catch (err) {
      const latencyMs = Number((performance.now() - startTime).toFixed(2));
      return { healthy: false, latencyMs };
    }
  }
}
