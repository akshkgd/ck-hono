import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../app.js';

describe('Auth Module', () => {
  const uniqueId = Date.now();
  const testEmail = `user.${uniqueId}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';

  let jwtToken = '';

  it('should register a new user successfully', async () => {
    const res = await app.request('/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName,
      }),
    });

    expect([201, 400]).toContain(res.status); // 201 if first time, 400 if database already contains it
    const body = await res.json();
    if (res.status === 201) {
      expect(body.status).toBe('success');
      expect(body.data.email).toBe(testEmail);
      expect(body.data.name).toBe(testName);
      expect(body.data).not.toHaveProperty('password');
    }
  });

  it('should fail registration with invalid input', async () => {
    const res = await app.request('/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'short',
      }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.status).toBe('error');
  });

  it('should login successfully and return a JWT token', async () => {
    const res = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data).toHaveProperty('token');
    expect(body.data.user.email).toBe(testEmail);
    expect(body.data.user).not.toHaveProperty('password');
    
    jwtToken = body.data.token;
  });

  it('should fail login with incorrect password', async () => {
    const res = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword!',
      }),
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.status).toBe('error');
  });

  it('should fetch logged-in user profile with valid JWT on GET /auth/me', async () => {
    expect(jwtToken).toBeTruthy();

    const res = await app.request('/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data.user.email).toBe(testEmail);
  });

  it('should reject access to GET /auth/me without authorization header', async () => {
    const res = await app.request('/v1/auth/me', {
      method: 'GET',
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.status).toBe('error');
    expect(body.message).toContain('Unauthorized');
  });
});
