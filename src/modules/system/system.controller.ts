import type { Context } from 'hono';
import { SystemService } from './system.service.js';

export class SystemController {
  private systemService: SystemService;

  constructor() {
    this.systemService = new SystemService();
  }

  public getStatus = async (c: Context) => {
    const status = await this.systemService.getStatus();
    return c.json(status, status.status === 'UP' ? 200 : 503);
  };
}
