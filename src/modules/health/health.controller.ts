import type { Context } from 'hono';
import { HealthService } from './health.service.js';

export class HealthController {
  private healthService: HealthService;

  constructor(healthService = new HealthService()) {
    this.healthService = healthService;
  }

  public getServerHealth = async (c: Context) => {
    const result = await this.healthService.getServerHealth();
    return c.json(result, result.status === 'operational' ? 200 : 503);
  };

  public getDbHealth = async (c: Context) => {
    const result = await this.healthService.getDbHealth();
    return c.json(result, result.status === 'operational' ? 200 : 503);
  };

  public getBunnyHealth = async (c: Context) => {
    const result = await this.healthService.getBunnyHealth();
    return c.json(result, result.status === 'operational' ? 200 : 503);
  };

  public getOverallHealth = async (c: Context) => {
    const result = await this.healthService.getOverallHealth();
    return c.json(result, result.status === 'operational' ? 200 : 503);
  };
}
