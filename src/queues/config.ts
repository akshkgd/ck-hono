import { ConnectionOptions } from 'bullmq';

export const getRedisConnection = (): ConnectionOptions => {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const parsed = new URL(redisUrl);
      return {
        host: parsed.hostname || '127.0.0.1',
        port: parseInt(parsed.port || '6379', 10),
        password: parsed.password || undefined,
        username: parsed.username || undefined,
        maxRetriesPerRequest: null, // Critical requirement for BullMQ
        enableReadyCheck: false,
      };
    } catch {
      // Fallback
    }
  }

  return {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // Critical requirement for BullMQ
    enableReadyCheck: false,
  };
};

export const redisConnection = getRedisConnection();
