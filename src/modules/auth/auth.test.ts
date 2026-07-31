import { describe, it, expect } from 'vitest';
import app from '../../app.js';

describe('Magic Link Auth & 30-Day Session Module', () => {
  const uniqueId = Date.now();
  const testEmail = `magic.user.${uniqueId}@example.com`;
  let sessionToken = '';

  it('should request a magic link successfully', async () => {
    const res = await app.request('/v1/auth/magic-link/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        name: 'Magic User',
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data.message).toContain('Magic link sent to');
  });

  it('should fail magic link request for invalid email', async () => {
    const res = await app.request('/v1/auth/magic-link/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'not-an-email',
      }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.status).toBe('error');
  });

  it('should fail verification for non-existent token', async () => {
    const res = await app.request('/v1/auth/magic-link/verify?token=invalid_token_xyz_123', {
      method: 'GET',
    });

    expect([400, 500]).toContain(res.status);
  });

  it('should reject access to GET /auth/me without session token', async () => {
    const res = await app.request('/v1/auth/me', {
      method: 'GET',
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.status).toBe('error');
    expect(body.message).toContain('Unauthorized');
  });

  it('should successfully get profile with streak and xp fields on GET /auth/me', async () => {
    const loginRes = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ananya.verma1@example.com',
        password: 'Password123!'
      })
    });
    
    expect(loginRes.status).toBe(200);
    const loginBody = await loginRes.json();
    const token = loginBody.data.token;
    
    const res = await app.request('/v1/auth/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data.user).toHaveProperty('currentStreak');
    expect(body.data.user).toHaveProperty('longestStreak');
    expect(body.data.user).toHaveProperty('xp');
    expect(body.data.user).toHaveProperty('lastActiveAt');
  });
});
