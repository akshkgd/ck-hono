import 'dotenv/config';
import { db } from '../src/db/index.js';
import { batches, batchEnrollments, batchEnrollmentPayments } from '../src/db/schema.js';

async function main() {
  console.log('Clearing migration tables (batches, enrollments, payments)...');
  
  // Cascade order: Payments -> Enrollments -> Batches
  await db.delete(batchEnrollmentPayments);
  console.log('✓ Cleared all batch enrollment payments.');
  
  await db.delete(batchEnrollments);
  console.log('✓ Cleared all batch enrollments.');
  
  await db.delete(batches);
  console.log('✓ Cleared all batches.');

  console.log('✓ Database cleared successfully! You can now rerun your migrations.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to clear migration tables:', err);
    process.exit(1);
  });
