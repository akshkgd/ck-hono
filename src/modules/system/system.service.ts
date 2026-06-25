import os from 'os';

export class SystemService {
  public getStatus() {
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'UP',
      message: 'all systems running good',
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
        database: 'unconfigured'
      }
    };
  }
}
