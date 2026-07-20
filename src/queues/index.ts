import { Queue } from 'bullmq';
import { redisConnection } from './config.js';

// Default options: Remove completed & failed jobs to conserve Redis RAM on Droplets
const defaultJobOptions = {
  removeOnComplete: { age: 86400, count: 1000 },  // Keep completed jobs for 24h (max 1k)
  removeOnFail: { age: 604800, count: 5000 },     // Keep failed jobs for 7 days (max 5k)
};

// 1. Email Queue: Fast retries, high concurrency potential, exponential backoff
export const emailQueue = new Queue('email-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// 2. Crawler Queue: RAM & CPU guarded, domain rate limits, long timeouts
export const crawlerQueue = new Queue('crawler-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    attempts: 3,
    backoff: {
      type: 'fixed',
      delay: 10000,
    },
  },
});

// 3. Migration Queue: Strict FIFO (single worker), manual/careful retries
export const migrationQueue = new Queue('migration-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    attempts: 1, // Avoid unexpected automated retries for database migrations
  },
});

// Helper type definitions
export interface EmailJobData {
  to: string;
  subject: string;
  body?: string;
  html?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface CrawlerJobData {
  url: string;
  depth?: number;
  selectors?: string[];
  maxPages?: number;
  metadata?: Record<string, any>;
}

export interface MigrationJobData {
  migrationName: string;
  batchSize?: number;
  dryRun?: boolean;
  metadata?: Record<string, any>;
}

// Queue Helper Functions
export const addEmailJob = async (name: string, data: EmailJobData, opts?: any) => {
  return emailQueue.add(name, data, opts);
};

export const addCrawlerJob = async (name: string, data: CrawlerJobData, opts?: any) => {
  return crawlerQueue.add(name, data, opts);
};

export const addMigrationJob = async (name: string, data: MigrationJobData, opts?: any) => {
  return migrationQueue.add(name, data, opts);
};
