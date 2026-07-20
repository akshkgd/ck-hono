import 'dotenv/config';
import { emailWorker } from './email.worker.js';
import { crawlerWorker } from './crawler.worker.js';
import { migrationWorker } from './migration.worker.js';
import { logger } from '../utils/logger.js';

logger.info('[Worker Process] Initializing background queue workers...');

const workers = [
  { name: 'EmailWorker', worker: emailWorker },
  { name: 'CrawlerWorker', worker: crawlerWorker },
  { name: 'MigrationWorker', worker: migrationWorker },
];

workers.forEach(({ name, worker }) => {
  worker.on('ready', () => {
    logger.info(`[Worker Process] ${name} is ready and listening for jobs.`);
  });

  worker.on('active', (job) => {
    logger.info(`[${name}] Started processing job #${job.id} (${job.name})`);
  });

  worker.on('completed', (job, returnvalue) => {
    logger.info(`[${name}] Job #${job.id} (${job.name}) completed successfully.`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`[${name}] Job #${job?.id} (${job?.name}) failed: ${err.message}`);
  });

  worker.on('error', (err) => {
    logger.error(`[${name}] Worker error: ${err.message}`);
  });
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  logger.info(`[Worker Process] Received ${signal}. Closing queue workers gracefully...`);
  await Promise.all(workers.map(({ worker }) => worker.close()));
  logger.info('[Worker Process] All workers shut down cleanly.');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
