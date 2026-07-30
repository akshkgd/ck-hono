import { MigrationJobData } from '../queues/index.js';
import { logger } from '../utils/logger.js';
import { db } from '../db/index.js';
import { users, batches, batchEnrollments, batchEnrollmentPayments } from '../db/schema.js';
import { Job } from 'bullmq';
import { sql, eq, inArray } from 'drizzle-orm';

function parseBatchStatus(status: any): 'active' | 'private' | 'completed' {
  if (status === undefined || status === null) return 'private';
  const sStr = String(status).trim().toLowerCase();
  const sNum = Number(status);
  if (sNum === 0 || sStr === '0' || sStr === 'private') return 'private';
  if (sNum === 1 || sStr === '1' || sNum === 2 || sStr === '2' || sStr === 'active') return 'active';
  if (sNum === 3 || sStr === '3' || sStr === 'completed') return 'completed';
  return 'private';
}

function parseBatchType(type: any): 'cohort' | 'live' | 'webinar' | 'callBooking' | 'mentorship' {
  if (type === undefined || type === null) return 'cohort';
  const tStr = String(type).trim().toLowerCase();
  const tNum = Number(type);
  if (tNum === 1 || tStr === '1' || tStr === 'cohort') return 'cohort';
  if (tNum === 2 || tStr === '2' || tStr === 'webinar') return 'webinar';
  if (tStr === 'live') return 'live';
  if (tStr === 'callbooking') return 'callBooking';
  if (tStr === 'mentorship') return 'mentorship';
  return 'cohort';
}

function parsePaymentStatus(status: any): 'captured' | 'failed' | 'created' | 'refunded' {
  if (status === undefined || status === null) return 'created';
  const sStr = String(status).trim().toLowerCase();
  if (['captured', 'success', 'paid', 'approved'].includes(sStr)) return 'captured';
  if (['failed', 'declined', 'rejected'].includes(sStr)) return 'failed';
  if (['refunded', 'reversed'].includes(sStr)) return 'refunded';
  return 'created';
}

function parseEnrollmentType(type: any): 'oneTime' | 'Subscription' | 'free' {
  if (type === undefined || type === null) return 'oneTime';
  const tStr = String(type).trim().toLowerCase();
  if (tStr === 'subscription' || tStr === 'recurring' || tStr === '1') return 'Subscription';
  if (tStr === 'free' || tStr === '2') return 'free';
  return 'oneTime';
}

function parseDateString(val: any): string | null {
  if (!val) return null;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

function addOneYear(dateVal: any): string | null {
  if (!dateVal) return null;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

function parseSubscriptionStatus(status: any): 'active' | 'expired' | 'pending' | null {
  if (status === undefined || status === null) return null;
  const sStr = String(status).trim().toLowerCase();
  if (sStr === 'active' || sStr === '1') return 'active';
  if (sStr === 'expired' || sStr === '2') return 'expired';
  if (sStr === 'pending' || sStr === '0') return 'pending';
  return null;
}

function parseAmount(val: any): number | null {
  if (val === undefined || val === null) return null;
  const parsed = parseInt(String(val), 10);
  if (isNaN(parsed)) return null;
  return Math.floor(parsed / 100);
}

function parseBatchTopic(topicId: any): string {
  if (topicId === undefined || topicId === null) return 'frontend';
  const tid = Number(topicId);
  if (isNaN(tid)) {
    const tStr = String(topicId).trim().toLowerCase();
    return tStr ? tStr : 'frontend';
  }
  switch (tid) {
    case 100: return 'css';
    case 101: return 'js';
    case 500: return 'fsd';
    case 501: return 'genAiD';
    case 1:
    case 5:
    case 10: return 'fullstack';
    case 11: return 'react';
    case 12: return 'node';
    case 15: return 'python';
    case 700: return 'frontend';
    case 701: return 'backend';
    case 705: return 'genAi';
    default: return 'frontend';
  }
}

function isValidEmail(email: any): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  if (clean.length < 5 || clean.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
}

function parseRole(role: any): 'student' | 'admin' | 'user' | 'moderator' {
  if (role === undefined || role === null) return 'student';
  const roleStr = String(role).trim().toLowerCase();
  const roleNum = Number(role);

  if (roleNum === 100 || roleStr === '100' || roleStr === 'admin') {
    return 'admin';
  }
  if (roleStr === 'moderator') {
    return 'moderator';
  }
  return 'student';
}

function parseStatus(status: any): 'active' | 'inactive' | 'suspended' {
  if (status === undefined || status === null) return 'active';
  const statusStr = String(status).trim().toLowerCase();
  const statusNum = Number(status);

  if (statusNum === 0 || statusStr === '0' || statusStr === 'inactive' || statusStr === 'deactivated') {
    return 'inactive';
  }
  if (statusStr === 'suspended' || statusStr === 'banned') {
    return 'suspended';
  }
  return 'active';
}

export async function processMigrationJob(data: MigrationJobData, job?: Job): Promise<Record<string, any>> {
  const startTime = Date.now();
  const batchSize = data.batchSize || 2000;
  const isDryRun = !!data.dryRun;

  logger.info(`[MigrationJob] Starting task: "${data.migrationName}" (Dry run: ${isDryRun}, Batch size: ${batchSize})`);

  // Ensure JSONB legacy ID fields are indexed in the database for O(1) lookups
  try {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS users_legacy_id_idx ON users ((metadata->>'legacyId'))`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS batches_legacy_id_idx ON batches ((metadata->>'legacyId'))`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS batch_enrollments_legacy_id_idx ON batch_enrollments ((metadata->>'legacyId'))`);
  } catch (err: any) {
    logger.warn(`[MigrationJob] Index creation optimization failed (non-critical): ${err.message}`);
  }

  if (data.migrationName === 'BULK_USER_MIGRATION' && data.metadata?.users) {
    const userList: any[] = data.metadata.users;
    const totalRecords = userList.length;
    let successCount = 0;
    let failedCount = 0;

    if (isDryRun) {
      logger.info(`[MigrationJob] Dry run completed for ${totalRecords} user records.`);
      return {
        migrationName: data.migrationName,
        status: 'DRY_RUN_COMPLETED',
        totalRecords,
        processedItems: totalRecords,
        dryRun: true,
        durationMs: Date.now() - startTime,
      };
    }

    // Process in chunks of batchSize
    for (let i = 0; i < totalRecords; i += batchSize) {
      const chunk = userList.slice(i, i + batchSize);
      
      try {
        const recordsToInsert: any[] = [];

        // Filter and transform legacy PHP payload rows
        for (const u of chunk) {
          // Skip users with invalid/missing emails
          if (!isValidEmail(u.email)) {
            logger.warn(`[MigrationJob] Skipping user record with invalid email: "${u.email}" (Legacy ID: ${u.id || 'N/A'})`);
            failedCount++;
            continue;
          }

          const cleanEmail = String(u.email).toLowerCase().trim();

          // 1. Robust Role Parsing (100 / "100" / "admin" -> 'admin')
          const legacyRole = u.role !== undefined && u.role !== null
            ? u.role
            : (u.role_id !== undefined && u.role_id !== null ? u.role_id : u.roleId);
          const roleValue = parseRole(legacyRole);

          // 2. Robust Status Parsing (0 / "0" / "inactive" -> 'inactive')
          const statusValue = parseStatus(u.status);

          // 3. Normalize email verification (1 -> true)
          const isVerified = u.is_verified === 1 || u.is_verified === '1' || u.is_verified === true || u.emailVerified === true;

          // 4. Occupation Mapping Logic:
          const organizationValue = u.college || u.organization || null;
          const validOccupationTypes = ['student', 'professional', 'academic', 'other'];
          let occType: 'student' | 'professional' | 'academic' | 'other' = 'student';

          if (u.occupationType && validOccupationTypes.includes(u.occupationType)) {
            occType = u.occupationType;
          } else {
            occType = 'student';
          }

          const occTitle = occType === 'student' ? null : (u.course || u.occupationTitle || null);

          // 5. Clean metadata object (only legacyId and explicit metadata)
          const extraMetadata = {
            legacyId: u.id || null,
            ...(u.metadata || {}),
          };

          recordsToInsert.push({
            email: cleanEmail,
            name: u.name || u.user_name || cleanEmail.split('@')[0],
            mobile: u.mobile || null,
            googleId: u.google_id || u.googleId || null,
            avatarUrl: u.avatar || u.avatarUrl || u.avatar_url || null,
            bio: u.bio || null,
            role: roleValue,
            status: statusValue,
            emailVerified: isVerified,
            xp: typeof u.xp === 'number' ? u.xp : (Number(u.xp) || 0),
            currentStreak: typeof u.current_streak === 'number' ? u.current_streak : (Number(u.current_streak) || 0),
            longestStreak: typeof u.longest_streak === 'number' ? u.longest_streak : (Number(u.longest_streak) || 0),
            organization: organizationValue,
            occupationTitle: occTitle,
            occupationType: occType,
            metadata: extraMetadata,
            createdAt: u.created_at ? new Date(u.created_at) : new Date(),
            updatedAt: u.updated_at ? new Date(u.updated_at) : new Date(),
            lastActiveAt: u.lastActivity ? new Date(u.lastActivity) : (u.last_activity_date ? new Date(u.last_activity_date) : new Date()),
          });
        }

        // High-Performance Batch Upsert (Updates role, status, and name if email already exists)
        if (recordsToInsert.length > 0) {
          await db.insert(users).values(recordsToInsert).onConflictDoUpdate({
            target: users.email,
            set: {
              role: sql`EXCLUDED.role`,
              status: sql`EXCLUDED.status`,
              name: sql`EXCLUDED.name`,
              updatedAt: new Date(),
            },
          });
          successCount += recordsToInsert.length;
        }
      } catch (err: any) {
        logger.error(`[MigrationJob] Batch insert failed at index ${i}: ${err.message}`);
        failedCount += chunk.length;
      }

      // Update BullMQ Job Progress for live status tracking
      if (job) {
        const processed = Math.min(i + batchSize, totalRecords);
        await job.updateProgress({
          processed,
          total: totalRecords,
          successCount,
          failedCount,
        });
      }
    }

    const durationMs = Date.now() - startTime;
    logger.info(`[MigrationJob] Bulk User Migration Completed: ${successCount} inserted, ${failedCount} failed/skipped in ${durationMs}ms`);

    return {
      migrationName: data.migrationName,
      status: 'COMPLETED',
      totalRecords,
      successCount,
      failedCount,
      durationMs,
      executedAt: new Date().toISOString(),
    };
  }

  if (data.migrationName === 'BULK_BATCH_MIGRATION' && data.metadata?.batches) {
    const batchList: any[] = data.metadata.batches;
    const totalRecords = batchList.length;
    let successCount = 0;
    let failedCount = 0;

    if (isDryRun) {
      logger.info(`[MigrationJob] Dry run completed for ${totalRecords} batch records.`);
      return {
        migrationName: data.migrationName,
        status: 'DRY_RUN_COMPLETED',
        totalRecords,
        processedItems: totalRecords,
        dryRun: true,
        durationMs: Date.now() - startTime,
      };
    }

    for (let i = 0; i < totalRecords; i += batchSize) {
      const chunk = batchList.slice(i, i + batchSize);
      try {
        const batchSlugsInChunk = chunk.map(b => b.slug).filter(Boolean).map(s => String(s).toLowerCase().trim());
        const existingBatchesMap = new Map<string, string>();

        if (batchSlugsInChunk.length > 0) {
          const matchedExistingBatches = await db.select({
            id: batches.id,
            slug: batches.slug
          })
          .from(batches)
          .where(inArray(batches.slug, batchSlugsInChunk));

          for (const eb of matchedExistingBatches) {
            if (eb.slug) {
              existingBatchesMap.set(eb.slug.toLowerCase().trim(), eb.id);
            }
          }
        }

        const teacherLegacyIds = Array.from(new Set(
          chunk.map(b => b.teacherId || b.teacher_id).filter(id => id !== undefined && id !== null).map(String)
        ));

        const teacherMap = new Map<string, string>();
        if (teacherLegacyIds.length > 0) {
          const matchedTeachers = await db.select({
            id: users.id,
            legacyId: sql<string>`metadata->>'legacyId'`
          })
          .from(users)
          .where(sql`metadata->>'legacyId' IN (${sql.join(teacherLegacyIds.map(id => sql`${id}`), sql.raw(', '))})`);

          for (const t of matchedTeachers) {
            if (t.legacyId) {
              teacherMap.set(String(t.legacyId), t.id);
            }
          }
        }

        const recordsToInsert: any[] = [];
        const recordsToUpdate: { id: string; data: any }[] = [];

        for (const b of chunk) {
          const typeValue = parseBatchType(b.type);
          const statusValue = parseBatchStatus(b.status);
          const legacyTeacherId = b.teacherId !== undefined && b.teacherId !== null ? String(b.teacherId) : (b.teacher_id !== undefined && b.teacher_id !== null ? String(b.teacher_id) : null);
          const resolvedTeacherId = legacyTeacherId ? (teacherMap.get(legacyTeacherId) || null) : null;

          const {
            topicId, topic_id,
            payable,
            offerId, offer_id,
            schedule,
            about,
            learn,
            benefits,
            groupLink2,
            field1, field2, field3, field4, field5,
            ...otherMetadata
          } = b.metadata || {};

          const extraMetadata = {
            legacyId: b.id || null,
            ...otherMetadata,
          };

          const parsePrice = (val: any) => {
            if (val === undefined || val === null) return null;
            const parsed = parseInt(String(val), 10);
            return isNaN(parsed) ? null : parsed;
          };

          const parseLimit = (val: any) => {
            if (val === undefined || val === null) return 0;
            const parsed = parseInt(String(val), 10);
            return isNaN(parsed) ? 0 : parsed;
          };

          const batchRecord = {
            topic: parseBatchTopic(b.topicId !== undefined && b.topicId !== null ? b.topicId : (b.topic_id !== undefined && b.topic_id !== null ? b.topic_id : null)),
            name: b.name || 'Unnamed Batch',
            description: b.description || null,
            slug: b.slug || `batch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            price: parsePrice(b.price),
            certificateFee: parsePrice(b.certificateFee !== undefined ? b.certificateFee : b.certificate_fee) || 0,
            limit: parseLimit(b.limit),
            img: b.img || b.image || null,
            association: b.association || null,
            logo: b.logo || null,
            type: typeValue,
            startDate: b.startDate || b.start_date ? new Date(b.startDate || b.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            endDate: b.endDate || b.end_date ? new Date(b.endDate || b.end_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            whatsAppLink: b.groupLink || b.whatsAppLink || b.whatsapp_link || null,
            telegramLink: b.groupLink1 || b.telegramLink || b.telegram_link || null,
            telegramBroadcast: b.telegramBroadcast || null,
            teacherId: resolvedTeacherId,
            teacherPayment: b.teacherPayment === 1 || b.teacherPayment === '1' || b.teacherPayment === true || b.TeacherPayment === true || false,
            meetingLink: b.meetingLink || b.meeting_link || null,
            nextClassTopic: b.nextClassTopic || b.next_class_topic || null,
            desc: b.desc || null,
            nextClass: b.nextClass || b.next_class ? new Date(b.nextClass || b.next_class) : null,
            status: statusValue,
            metadata: extraMetadata,
            accessTillDate: b.accessTillDate || b.access_till_date ? new Date(b.accessTillDate || b.access_till_date).toISOString().split('T')[0] : null,
            accessTillYear: parseLimit(b.accessTillYear !== undefined ? b.accessTillYear : b.access_till_year) || 1,
            createdAt: b.created_at ? new Date(b.created_at) : new Date(),
            updatedAt: b.updated_at ? new Date(b.updated_at) : new Date(),
          };

          const slugKey = b.slug ? String(b.slug).toLowerCase().trim() : null;
          const existingId = slugKey ? existingBatchesMap.get(slugKey) : null;

          if (existingId) {
            recordsToUpdate.push({ id: existingId, data: batchRecord });
          } else {
            recordsToInsert.push(batchRecord);
          }
        }

        if (recordsToInsert.length > 0) {
          await db.insert(batches).values(recordsToInsert);
          successCount += recordsToInsert.length;
        }

        if (recordsToUpdate.length > 0) {
          for (const item of recordsToUpdate) {
            await db.update(batches).set({
              name: item.data.name,
              description: item.data.description,
              price: item.data.price,
              status: item.data.status,
              updatedAt: new Date(),
            }).where(eq(batches.id, item.id));
          }
          successCount += recordsToUpdate.length;
        }
      } catch (err: any) {
        logger.error(`[MigrationJob] Batches batch insert failed at index ${i}: ${err.message}`);
        failedCount += chunk.length;
      }

      if (job) {
        const processed = Math.min(i + batchSize, totalRecords);
        await job.updateProgress({
          processed,
          total: totalRecords,
          successCount,
          failedCount,
        });
      }
    }

    const durationMs = Date.now() - startTime;
    logger.info(`[MigrationJob] Bulk Batch Migration Completed: ${successCount} inserted, ${failedCount} failed/skipped in ${durationMs}ms`);

    return {
      migrationName: data.migrationName,
      status: 'COMPLETED',
      totalRecords,
      successCount,
      failedCount,
      durationMs,
      executedAt: new Date().toISOString(),
    };
  }

  if (data.migrationName === 'BULK_ENROLLMENT_MIGRATION' && data.metadata?.enrollments) {
    const enrollmentList: any[] = data.metadata.enrollments;
    const totalRecords = enrollmentList.length;
    let successCount = 0;
    let failedCount = 0;

    if (isDryRun) {
      logger.info(`[MigrationJob] Dry run completed for ${totalRecords} enrollment records.`);
      return {
        migrationName: data.migrationName,
        status: 'DRY_RUN_COMPLETED',
        totalRecords,
        processedItems: totalRecords,
        dryRun: true,
        durationMs: Date.now() - startTime,
      };
    }

    for (let i = 0; i < totalRecords; i += batchSize) {
      const chunk = enrollmentList.slice(i, i + batchSize);
      try {
        const userEmails = Array.from(new Set(chunk.map(e => e.email).filter(Boolean).map(e => String(e).toLowerCase().trim())));
        const userLegacyIds = Array.from(new Set(chunk.map(e => e.userId || e.user_id).filter(id => id !== undefined && id !== null).map(String)));

        const userMapByEmail = new Map<string, string>();
        const userMapByLegacyId = new Map<string, string>();

        if (userEmails.length > 0 || userLegacyIds.length > 0) {
          const emailFilter = userEmails.length > 0 ? inArray(users.email, userEmails) : null;
          const legacyIdFilter = userLegacyIds.length > 0 ? sql`metadata->>'legacyId' IN (${sql.join(userLegacyIds.map(id => sql`${id}`), sql.raw(', '))})` : null;

          const query = db.select({
            id: users.id,
            email: users.email,
            legacyId: sql<string>`metadata->>'legacyId'`
          })
          .from(users);

          let matchedUsers: any[] = [];
          if (emailFilter && legacyIdFilter) {
            matchedUsers = await query.where(sql`${emailFilter} OR ${legacyIdFilter}`);
          } else if (emailFilter) {
            matchedUsers = await query.where(emailFilter);
          } else if (legacyIdFilter) {
            matchedUsers = await query.where(legacyIdFilter);
          }

          for (const u of matchedUsers) {
            userMapByEmail.set(u.email.toLowerCase().trim(), u.id);
            if (u.legacyId) {
              userMapByLegacyId.set(String(u.legacyId), u.id);
            }
          }
        }

        const batchSlugs = Array.from(new Set(chunk.map(e => e.slug).filter(Boolean).map(s => String(s).toLowerCase().trim())));
        const batchLegacyIds = Array.from(new Set(chunk.map(e => e.batchId || e.batch_id).filter(id => id !== undefined && id !== null).map(String)));

        const batchMapBySlug = new Map<string, string>();
        const batchMapByLegacyId = new Map<string, string>();

        if (batchSlugs.length > 0 || batchLegacyIds.length > 0) {
          const slugFilter = batchSlugs.length > 0 ? inArray(batches.slug, batchSlugs) : null;
          const legacyIdFilter = batchLegacyIds.length > 0 ? sql`metadata->>'legacyId' IN (${sql.join(batchLegacyIds.map(id => sql`${id}`), sql.raw(', '))})` : null;

          const query = db.select({
            id: batches.id,
            slug: batches.slug,
            legacyId: sql<string>`metadata->>'legacyId'`
          })
          .from(batches);

          let matchedBatches: any[] = [];
          if (slugFilter && legacyIdFilter) {
            matchedBatches = await query.where(sql`${slugFilter} OR ${legacyIdFilter}`);
          } else if (slugFilter) {
            matchedBatches = await query.where(slugFilter);
          } else if (legacyIdFilter) {
            matchedBatches = await query.where(legacyIdFilter);
          }

          for (const b of matchedBatches) {
            if (b.slug) {
              batchMapBySlug.set(b.slug.toLowerCase().trim(), b.id);
            }
            if (b.legacyId) {
              batchMapByLegacyId.set(String(b.legacyId), b.id);
            }
          }
        }

        const recordsToInsert: any[] = [];

        for (const e of chunk) {
          const hasPaidVal = e.hasPaid !== undefined ? e.hasPaid : e.has_paid;
          const isPaid = hasPaidVal === 1 || hasPaidVal === true || String(hasPaidVal) === '1' || String(hasPaidVal) === 'true';

          if (!isPaid) {
            logger.warn(`[MigrationJob] Skipping enrollment: not paid (hasPaid = ${hasPaidVal}, Legacy ID: ${e.id || 'N/A'})`);
            failedCount++;
            continue;
          }

          const emailKey = e.email ? String(e.email).toLowerCase().trim() : null;
          const legacyUserId = e.userId !== undefined && e.userId !== null ? String(e.userId) : (e.user_id !== undefined && e.user_id !== null ? String(e.user_id) : null);
          const resolvedUserId = (legacyUserId ? userMapByLegacyId.get(legacyUserId) : null) || (emailKey ? userMapByEmail.get(emailKey) : null);

          const slugKey = e.slug ? String(e.slug).toLowerCase().trim() : null;
          const legacyBatchId = e.batchId !== undefined && e.batchId !== null ? String(e.batchId) : (e.batch_id !== undefined && e.batch_id !== null ? String(e.batch_id) : null);
          const resolvedBatchId = (legacyBatchId ? batchMapByLegacyId.get(legacyBatchId) : null) || (slugKey ? batchMapBySlug.get(slugKey) : null);

          if (!resolvedUserId || !resolvedBatchId) {
            logger.warn(`[MigrationJob] Skipping enrollment: User resolved = ${!!resolvedUserId}, Batch resolved = ${!!resolvedBatchId} (Legacy ID: ${e.id || 'N/A'})`);
            failedCount++;
            continue;
          }

          const typeValue = parseEnrollmentType(
            e.enrollmentType !== undefined ? e.enrollmentType : (e.enrollment_type !== undefined ? e.enrollment_type : e.type)
          );
          
          const paymentStatusValue = isPaid ? 'captured' : 'created';

          const parseNumber = (val: any) => {
            if (val === undefined || val === null) return null;
            const parsed = parseInt(String(val), 10);
            return isNaN(parsed) ? null : parsed;
          };

          const parseStatus = (val: any) => {
            if (val === undefined || val === null) return 0;
            const parsed = parseInt(String(val), 10);
            return isNaN(parsed) ? 0 : parsed;
          };

          let accessTillValue = parseDateString(e.accessTill || e.access_till);
          if (!accessTillValue) {
            const baseDate = e.startedAt || e.started_at || e.startFrom || e.start_from || e.paidAt || e.paid_at;
            if (baseDate) {
              accessTillValue = addOneYear(baseDate);
            }
          }

          const extraMetadata = {
            legacyId: e.id || null,
            ...(e.metadata || {}),
          };

          let timeSpentSecondsValue = 0;
          if (e.timeSpentSeconds !== undefined && e.timeSpentSeconds !== null) {
            timeSpentSecondsValue = parseStatus(e.timeSpentSeconds);
          } else if (e.time_spent_seconds !== undefined && e.time_spent_seconds !== null) {
            timeSpentSecondsValue = parseStatus(e.time_spent_seconds);
          } else if (e.time_spent !== undefined && e.time_spent !== null) {
            timeSpentSecondsValue = parseStatus(e.time_spent) * 60;
          }

          recordsToInsert.push({
            userId: resolvedUserId,
            batchId: resolvedBatchId,
            amountPayable: parseAmount(e.amountPayable || e.amount_payable),
            enrollmentType: typeValue,
            status: parseStatus(e.status),
            progress: parseStatus(e.progress),
            timeSpentSeconds: timeSpentSecondsValue,
            amountPaid: parseAmount(e.amountPaid || e.amount_paid) || 0,
            certificateFee: parseAmount(e.certificateFee || e.certificate_fee),
            paymentStatus: paymentStatusValue,
            paymentMethod: e.paymentMethod || e.payment_method || null,
            couponCode: e.couponCode || e.coupon_code || e.coupanCode || null,
            transactionId: e.transactionId || e.transaction_id || null,
            invoiceId: e.invoiceId || e.invoice_id || null,
            subscriptionId: e.subscriptionId || e.subscription_id || null,
            subscriptionStatus: parseSubscriptionStatus(
              e.subscriptionStatus !== undefined ? e.subscriptionStatus : e.subscription_status
            ),
            subscriptionActiveOn: parseDateString(e.subscriptionActiveOn || e.subscription_active_on),
            subscriptionExpiresOn: parseDateString(e.subscriptionExpiresOn || e.subscription_expires_on),
            paidAt: e.paidAt || e.paid_at ? new Date(e.paidAt || e.paid_at) : null,
            certificateId: e.certificateId || e.certificate_id || null,
            certificateGeneratedAt: e.certificateGeneratedAt || e.certificate_generated_at ? new Date(e.certificateGeneratedAt || e.certificate_generated_at) : null,
            startedAt: e.startedAt || e.started_at || e.startFrom || e.start_from ? new Date(e.startedAt || e.started_at || e.startFrom || e.start_from) : null,
            accessTill: accessTillValue,
            overrideAccessDays: parseNumber(e.overrideAccessDays || e.override_access_days),
            utmSource: e.utmSource || e.utm_source || null,
            utmMedium: e.utmMedium || e.utm_medium || null,
            utmCampaign: e.utmCampaign || e.utm_campaign || null,
            remark: e.remark || null,
            sequentialLearning: e.sequentialLearning === 1 || e.sequentialLearning === true || e.sequential_learning === 1 || false,
            sequentialLearningWithAssignments: e.sequentialLearningWithAssignments === 1 || e.sequentialLearningWithAssignments === true || e.sequential_learning_with_assignments === 1 || false,
            metadata: extraMetadata,
            createdAt: e.created_at ? new Date(e.created_at) : new Date(),
            updatedAt: e.updated_at ? new Date(e.updated_at) : new Date(),
          });
        }

        if (recordsToInsert.length > 0) {
          await db.insert(batchEnrollments).values(recordsToInsert);
          successCount += recordsToInsert.length;
        }
      } catch (err: any) {
        logger.error(`[MigrationJob] Enrollments batch insert failed at index ${i}: ${err.message}`);
        failedCount += chunk.length;
      }

      if (job) {
        const processed = Math.min(i + batchSize, totalRecords);
        await job.updateProgress({
          processed,
          total: totalRecords,
          successCount,
          failedCount,
        });
      }
    }

    const durationMs = Date.now() - startTime;
    logger.info(`[MigrationJob] Bulk Enrollment Migration Completed: ${successCount} inserted, ${failedCount} failed/skipped in ${durationMs}ms`);

    return {
      migrationName: data.migrationName,
      status: 'COMPLETED',
      totalRecords,
      successCount,
      failedCount,
      durationMs,
      executedAt: new Date().toISOString(),
    };
  }

  if (data.migrationName === 'BULK_PAYMENT_MIGRATION' && data.metadata?.payments) {
    const paymentList: any[] = data.metadata.payments;
    const totalRecords = paymentList.length;
    let successCount = 0;
    let failedCount = 0;

    if (isDryRun) {
      logger.info(`[MigrationJob] Dry run completed for ${totalRecords} payment records.`);
      return {
        migrationName: data.migrationName,
        status: 'DRY_RUN_COMPLETED',
        totalRecords,
        processedItems: totalRecords,
        dryRun: true,
        durationMs: Date.now() - startTime,
      };
    }

    for (let i = 0; i < totalRecords; i += batchSize) {
      const chunk = paymentList.slice(i, i + batchSize);
      try {
        const legacyEnrollmentIds = Array.from(new Set(chunk.map(p => p.enrollmentId || p.enrollment_id || p.course_enrollment_id).filter(id => id !== undefined && id !== null).map(String)));
        const enrollmentMap = new Map<string, string>();

        if (legacyEnrollmentIds.length > 0) {
          const matchedEnrollments = await db.select({
            id: batchEnrollments.id,
            legacyId: sql<string>`metadata->>'legacyId'`
          })
          .from(batchEnrollments)
          .where(sql`metadata->>'legacyId' IN (${sql.join(legacyEnrollmentIds.map(id => sql`${id}`), sql.raw(', '))})`);

          for (const me of matchedEnrollments) {
            if (me.legacyId) {
              enrollmentMap.set(String(me.legacyId), me.id);
            }
          }
        }

        // Fetch existing transaction IDs for the chunk to detect conflicts in database
        const txnIdsInChunk = Array.from(new Set(chunk.map(p => p.transactionId || p.transaction_id).filter(Boolean).map(String)));
        const existingTxnIds = new Set<string>();

        if (txnIdsInChunk.length > 0) {
          const matchedTxns = await db.select({
            transactionId: batchEnrollmentPayments.transactionId
          })
          .from(batchEnrollmentPayments)
          .where(inArray(batchEnrollmentPayments.transactionId, txnIdsInChunk));

          for (const mt of matchedTxns) {
            if (mt.transactionId) {
              existingTxnIds.add(mt.transactionId);
            }
          }
        }

        const seenTxnIdsInChunk = new Set<string>();
        const recordsToInsert: any[] = [];

        for (const p of chunk) {
          const legacyEnrollmentId = p.enrollmentId !== undefined && p.enrollmentId !== null 
            ? String(p.enrollmentId) 
            : (p.enrollment_id !== undefined && p.enrollment_id !== null 
              ? String(p.enrollment_id) 
              : (p.course_enrollment_id !== undefined && p.course_enrollment_id !== null 
                ? String(p.course_enrollment_id) 
                : null));
          const resolvedEnrollmentId = legacyEnrollmentId ? enrollmentMap.get(legacyEnrollmentId) : null;

          if (!resolvedEnrollmentId) {
            logger.warn(`[MigrationJob] Skipping payment: Enrollment not resolved (Legacy Enrollment ID: ${legacyEnrollmentId || 'N/A'})`);
            failedCount++;
            continue;
          }

          let txnId = p.transactionId || p.transaction_id || null;
          if (txnId) {
            const cleanTxnId = String(txnId).trim();
            if (seenTxnIdsInChunk.has(cleanTxnId) || existingTxnIds.has(cleanTxnId)) {
              txnId = `${cleanTxnId}-dup-${p.id || Math.floor(Math.random() * 100000)}`;
            } else {
              seenTxnIdsInChunk.add(cleanTxnId);
            }
          }

          const extraMetadata = {
            legacyId: p.id || null,
            ...(p.metadata || {}),
          };

          recordsToInsert.push({
            batchEnrollmentId: resolvedEnrollmentId,
            amount: parseAmount(p.amount) || 0,
            paidAt: p.paidAt || p.paid_at ? new Date(p.paidAt || p.paid_at) : new Date(),
            paymentMethod: p.paymentMethod || p.payment_method || null,
            transactionId: txnId,
            invoiceId: p.invoiceId || p.invoice_id || null,
            purpose: p.purpose || 'enrollment',
            isGstApplicable: p.isGstApplicable === 1 || p.isGstApplicable === true || p.is_gst_applicable === 1 || false,
            remarks: p.remarks || null,
            metadata: extraMetadata,
            createdAt: p.created_at ? new Date(p.created_at) : new Date(),
            updatedAt: p.updated_at ? new Date(p.updated_at) : new Date(),
          });
        }

        if (recordsToInsert.length > 0) {
          await db.insert(batchEnrollmentPayments).values(recordsToInsert).onConflictDoUpdate({
            target: batchEnrollmentPayments.transactionId,
            set: {
              amount: sql`EXCLUDED.amount`,
              paidAt: sql`EXCLUDED.paid_at`,
              updatedAt: new Date(),
            },
          });
          successCount += recordsToInsert.length;
        }
      } catch (err: any) {
        logger.error(`[MigrationJob] Payments batch insert failed at index ${i}: ${err.message}`);
        failedCount += chunk.length;
      }

      if (job) {
        const processed = Math.min(i + batchSize, totalRecords);
        await job.updateProgress({
          processed,
          total: totalRecords,
          successCount,
          failedCount,
        });
      }
    }

    const durationMs = Date.now() - startTime;
    logger.info(`[MigrationJob] Bulk Payment Migration Completed: ${successCount} inserted, ${failedCount} failed/skipped in ${durationMs}ms`);

    return {
      migrationName: data.migrationName,
      status: 'COMPLETED',
      totalRecords,
      successCount,
      failedCount,
      durationMs,
      executedAt: new Date().toISOString(),
    };
  }

  // Fallback for general migration tasks
  const durationMs = Date.now() - startTime;
  return {
    migrationName: data.migrationName,
    status: 'COMPLETED',
    processedItems: batchSize,
    dryRun: isDryRun,
    durationMs,
    executedAt: new Date().toISOString(),
  };
}
