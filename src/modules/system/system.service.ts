import os from 'os';
import { db } from '../../db/index.js';
import { sql } from 'drizzle-orm';

export class SystemService {
  public async getStatus() {
    const memoryUsage = process.memoryUsage();
    
    let dbStatus = 'unhealthy';
    try {
      await db.execute(sql`SELECT 1`);
      dbStatus = 'healthy';
    } catch (err) {
      console.error('Database health check failed:', err);
    }

    const isSystemHealthy = dbStatus === 'healthy';
    
    return {
      status: isSystemHealthy ? 'UP' : 'DEGRADED',
      message: isSystemHealthy ? 'all systems running good' : 'database connection error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        cpuLoad: os.loadavg(),
        memory: {
          rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
          heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
        }
      },
      checks: {
        database: dbStatus
      }
    };
  }
}
