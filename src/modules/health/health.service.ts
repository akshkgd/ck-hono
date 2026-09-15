import os from 'os';
import { HealthRepository } from './health.repository.js';
import { TARGET_BUNNY_PULL_ZONE_HOST } from '../../utils/bunny-token.util.js';

export interface HealthCheckResult {
  status: 'operational' | 'degraded' | 'down';
  service: string;
  timestamp: string;
  latencyMs?: number;
  [key: string]: any;
}

export interface OverallHealthResult {
  status: 'operational' | 'degraded' | 'down';
  timestamp: string;
  services: {
    server: HealthCheckResult;
    database: HealthCheckResult;
    bunny: HealthCheckResult;
  };
}

export class HealthService {
  private healthRepository: HealthRepository;

  constructor(healthRepository = new HealthRepository()) {
    this.healthRepository = healthRepository;
  }

  /**
   * Health check for backend server application instance.
   */
  public async getServerHealth(): Promise<HealthCheckResult> {
    const memoryUsage = process.memoryUsage();
    return {
      status: 'operational',
      service: 'backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
          rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        },
      },
    };
  }

  /**
   * Health check for PostgreSQL Database connection and query execution.
   */
  public async getDbHealth(): Promise<HealthCheckResult> {
    const { healthy, latencyMs } = await this.healthRepository.pingDatabase();
    return {
      status: healthy ? 'operational' : 'down',
      service: 'database',
      timestamp: new Date().toISOString(),
      latencyMs,
    };
  }

  /**
   * Health check for Bunny CDN / Video player edge infrastructure.
   * Sends a lightweight HTTP HEAD request with a 5-second timeout.
   */
  public async getBunnyHealth(): Promise<HealthCheckResult> {
    const endpoint = TARGET_BUNNY_PULL_ZONE_HOST;
    const startTime = performance.now();

    try {
      const response = await fetch(`https://${endpoint}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });

      const latencyMs = Number((performance.now() - startTime).toFixed(2));
      // HTTP response status < 500 confirms Bunny edge network is responsive
      const healthy = response.status < 500;

      return {
        status: healthy ? 'operational' : 'down',
        service: 'bunny',
        endpoint,
        timestamp: new Date().toISOString(),
        latencyMs,
        statusCode: response.status,
      };
    } catch (err: any) {
      const latencyMs = Number((performance.now() - startTime).toFixed(2));
      return {
        status: 'down',
        service: 'bunny',
        endpoint,
        timestamp: new Date().toISOString(),
        latencyMs,
        error: err.message || 'Connection failed or timed out',
      };
    }
  }

  /**
   * Consolidated health check for status page monitoring.
   * Runs server, database, and Bunny CDN checks concurrently.
   */
  public async getOverallHealth(): Promise<OverallHealthResult> {
    const [server, database, bunny] = await Promise.all([
      this.getServerHealth(),
      this.getDbHealth(),
      this.getBunnyHealth(),
    ]);

    const isAllOperational =
      server.status === 'operational' &&
      database.status === 'operational' &&
      bunny.status === 'operational';

    const isAnyOperational =
      server.status === 'operational' ||
      database.status === 'operational' ||
      bunny.status === 'operational';

    let overallStatus: 'operational' | 'degraded' | 'down' = 'operational';
    if (!isAllOperational) {
      overallStatus = isAnyOperational ? 'degraded' : 'down';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        server,
        database,
        bunny,
      },
    };
  }
}
