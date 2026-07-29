import 'dotenv/config';
import { db } from '../src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Clearing migration tables (batches, enrollments, payments)...');
  
  // Truncate payments table and restart sequences to instantly reclaim index disk space
  await db.execute(sql`TRUNCATE TABLE batch_enrollment_payments RESTART IDENTITY CASCADE`);
  console.log('✓ Cleared and shrunk batch_enrollment_payments table and reset indexes to 0 bytes.');

  console.log('✓ Database cleared successfully! You can now rerun your migrations.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to clear migration tables:', err);
    process.exit(1);
  });
