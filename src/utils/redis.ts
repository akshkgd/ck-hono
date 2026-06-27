import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: Redis | null = null;

try {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1, // Fail fast on request when connection is down
    connectTimeout: 2000,    // Time out connection attempt quickly
    lazyConnect: true,
  });

  redis.on('error', (err: any) => {
    // Only log warning, prevent crash
    console.warn('[Redis] Connection warning:', err.message);
  });
} catch (err) {
  console.error('[Redis] Failed to initialize client:', err);
}

export const isRedisReady = (): boolean => {
  if (!redis) return false;
  const status = redis.status;
  return status === 'ready' || status === 'wait' || status === 'connecting';
};

export { redis };
