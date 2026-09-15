import { describe, it, expect, vi } from 'vitest';
import app from '../../app.js';
import { HealthService } from './health.service.js';
import { HealthController } from './health.controller.js';

describe('Health Module Integration Tests', () => {
  it('GET /health/server should return 200 and backend server health metrics', async () => {
    const res = await app.request('/health/server');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('operational');
    expect(body.service).toBe('backend');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('uptime');
    expect(typeof body.uptime).toBe('number');
    expect(body).toHaveProperty('system');
    expect(body.system).toHaveProperty('nodeVersion');
    expect(body.system).toHaveProperty('platform');
    expect(body.system).toHaveProperty('memory');
  });

  it('GET /health/db should return 200/503 and database status metrics', async () => {
    const res = await app.request('/health/db');
    expect([200, 503]).toContain(res.status);

    const body = await res.json();
    expect(['operational', 'down']).toContain(body.status);
    expect(body.service).toBe('database');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('latencyMs');
    expect(typeof body.latencyMs).toBe('number');
  });

  it('GET /health/bunny should return 200/503 and bunny CDN status metrics', async () => {
    const res = await app.request('/health/bunny');
    expect([200, 503]).toContain(res.status);

    const body = await res.json();
    expect(['operational', 'down']).toContain(body.status);
    expect(body.service).toBe('bunny');
    expect(body.endpoint).toBe('vz-09b5be34-aef.b-cdn.net');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('latencyMs');
    expect(typeof body.latencyMs).toBe('number');
  });

  it('GET /health should return overall health overview combining server, db, and bunny', async () => {
    const res = await app.request('/health');
    expect([200, 503]).toContain(res.status);

    const body = await res.json();
    expect(['operational', 'degraded', 'down']).toContain(body.status);
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('services');

    const { server, database, bunny } = body.services;
    expect(server).toHaveProperty('status');
    expect(database).toHaveProperty('status');
    expect(bunny).toHaveProperty('status');
  });

  it('GET /v1/health should also respond under /v1 versioned prefix', async () => {
    const res = await app.request('/v1/health');
    expect([200, 503]).toContain(res.status);

    const body = await res.json();
    expect(body).toHaveProperty('services');
  });
});

describe('HealthService Unit Tests', () => {
  it('should handle database errors gracefully and mark db status as down', async () => {
    const mockRepo = {
      pingDatabase: vi.fn().mockResolvedValue({ healthy: false, latencyMs: 12.5 }),
    };

    const service = new HealthService(mockRepo as any);
    const result = await service.getDbHealth();

    expect(result.status).toBe('down');
    expect(result.service).toBe('database');
    expect(result.latencyMs).toBe(12.5);
  });

  it('should calculate degraded overall status when one service is down', async () => {
    const mockRepo = {
      pingDatabase: vi.fn().mockResolvedValue({ healthy: false, latencyMs: 5.0 }),
    };

    const service = new HealthService(mockRepo as any);
    // Mock getBunnyHealth to be operational
    vi.spyOn(service, 'getBunnyHealth').mockResolvedValue({
      status: 'operational',
      service: 'bunny',
      endpoint: 'test-endpoint',
      timestamp: new Date().toISOString(),
      latencyMs: 25,
    });

    const result = await service.getOverallHealth();
    expect(result.status).toBe('degraded');
    expect(result.services.database.status).toBe('down');
    expect(result.services.server.status).toBe('operational');
    expect(result.services.bunny.status).toBe('operational');
  });
});
