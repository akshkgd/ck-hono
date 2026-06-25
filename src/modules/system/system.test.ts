import { describe, it, expect } from 'vitest';
import app from '../../app.js';

describe('System Module', () => {
  it('should return 200 and health check message on GET /', async () => {
    const res = await app.request('/');
    
    expect(res.status).toBe(200);
    
    const body = await res.json();
    expect(body).toHaveProperty('status', 'UP');
    expect(body).toHaveProperty('message', 'all systems running good');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('uptime');
    expect(typeof body.uptime).toBe('number');
    expect(body).toHaveProperty('system');
    expect(body.system).toHaveProperty('platform');
    expect(body.system).toHaveProperty('nodeVersion');
    expect(body.system).toHaveProperty('cpuLoad');
    expect(body.system).toHaveProperty('memory');
    expect(body).toHaveProperty('checks');
    expect(body.checks).toHaveProperty('database');
  });
});
