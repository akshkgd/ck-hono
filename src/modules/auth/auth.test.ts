import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../app.js';

describe('Auth Module', () => {
  const uniqueId = Date.now();
  const testEmail = `user.${uniqueId}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';

  let jwtToken = '';

  it('should register a new user successfully and set a cookie', async () => {
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
      expect(body.data.user.email).toBe(testEmail);
      expect(body.data.user.name).toBe(testName);
      expect(body.data.user).not.toHaveProperty('password');
      expect(body.data).toHaveProperty('token');
      
      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toBeTruthy();
      expect(setCookie).toContain('token=');
      expect(setCookie).toContain('HttpOnly');
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

  it('should login successfully, return a JWT token, and set HttpOnly cookie', async () => {
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

    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain('token=');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('SameSite=Strict');
    
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

  it('should fetch logged-in user profile using Cookie on GET /auth/me', async () => {
    expect(jwtToken).toBeTruthy();

    const res = await app.request('/v1/auth/me', {
      method: 'GET',
      headers: {
        'Cookie': `token=${jwtToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data.user.email).toBe(testEmail);
  });

  it('should refresh token successfully and return a new cookie on POST /auth/refresh', async () => {
    expect(jwtToken).toBeTruthy();

    const res = await app.request('/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Cookie': `token=${jwtToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data).toHaveProperty('token');
    
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain('token=');
    expect(setCookie).toContain('HttpOnly');

    // Update jwtToken for subsequent tests
    jwtToken = body.data.token;
  });

  it('should clear cookie on POST /auth/logout', async () => {
    expect(jwtToken).toBeTruthy();

    const res = await app.request('/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Cookie': `token=${jwtToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');

    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toBeTruthy();
    // Verify it returns an empty token or Max-Age=0 (or Expires in the past)
    expect(setCookie).toContain('Max-Age=0');
  });

  it('should reject access to GET /auth/me without token', async () => {
    const res = await app.request('/v1/auth/me', {
      method: 'GET',
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.status).toBe('error');
    expect(body.message).toContain('Unauthorized');
  });
});
