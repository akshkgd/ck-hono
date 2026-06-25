import type { Context } from 'hono';
import { SystemService } from './system.service.js';

export class SystemController {
  private systemService: SystemService;

  constructor() {
    this.systemService = new SystemService();
  }

  public getStatus = (c: Context) => {
    const status = this.systemService.getStatus();
    return c.json(status, 200);
  };
}
