/**
 * Pure helpers for video heartbeat accounting.
 *
 * The server never trusts the client's `timeSpent` blindly. Every heartbeat is
 * credited at most:
 *   - what the client claims (legacy `timeSpent` hint, if sent),
 *   - the wall-clock time since the previous heartbeat (so pings can never
 *     overlap: multiple tabs, retries and pause/resume bursts are all bounded),
 *   - what the playback position makes plausible (a paused video does not
 *     advance, so it earns ~0 even if a timer-based ping fires),
 *   - a hard per-ping ceiling.
 */

/** Hard ceiling for a single heartbeat, in seconds. */
export const MAX_CREDIT_PER_PING_SECONDS = 180;
/** Slack for network jitter / timer drift, in seconds. */
export const WALL_CLOCK_TOLERANCE_SECONDS = 5;
/** Slowest supported playback rate; bounds how much real time a position advance can represent. */
export const MIN_PLAYBACK_RATE = 0.25;
/** Progress (%) at or above which content counts as completed. */
export const COMPLETION_PROGRESS_THRESHOLD = 75;

export type ProgressStatus = 'not_started' | 'learning' | 'completed';

/**
 * `content_library.video_duration` is NOT stored consistently: most rows are in seconds, but some
 * were entered in minutes. A value under 100 is treated as minutes (a real video under 100 seconds is
 * rare), anything else as seconds. This was added in b1d6f33 after a 1 minute watch showed 50% progress.
 * Remove it only after every row has been normalised to seconds (see the cleanup query in the PR notes).
 */
export function normalizeVideoDurationSeconds(videoDuration?: number | null): number | null {
  if (!videoDuration || videoDuration <= 0) return null;
  return videoDuration < 100 ? videoDuration * 60 : videoDuration;
}

export interface TimeCreditInput {
  /** Legacy client-reported delta in seconds. Undefined when the client no longer sends it. */
  claimedSeconds?: number;
  now: Date;
  /** Server timestamp of the previous heartbeat, null for the first one / legacy rows. */
  lastPingAt: Date | null;
  /** Playback position reported by this heartbeat, in seconds. */
  position?: number;
  /** Position stored by the previous heartbeat, null when no row existed yet. */
  lastPosition: number | null;
}

/** Seconds of watch time to credit for one heartbeat. Always a non-negative integer. */
export function computeTimeCredit(input: TimeCreditInput): number {
  const wallGap = input.lastPingAt
    ? Math.max(0, (input.now.getTime() - input.lastPingAt.getTime()) / 1000)
    : null;
  const posDelta =
    input.position !== undefined && input.lastPosition !== null
      ? input.position - input.lastPosition
      : null;
  const advancedForward = posDelta !== null && posDelta >= 0;

  let credit: number;
  if (input.claimedSeconds !== undefined) {
    credit = input.claimedSeconds;
  } else if (wallGap !== null && advancedForward) {
    credit = Math.min(wallGap, posDelta as number);
  } else {
    credit = 0;
  }

  credit = Math.min(credit, MAX_CREDIT_PER_PING_SECONDS);
  if (wallGap !== null) {
    credit = Math.min(credit, wallGap + WALL_CLOCK_TOLERANCE_SECONDS);
  }
  if (advancedForward) {
    // A paused video (posDelta ~ 0) earns ~0. Rewinds (posDelta < 0) are real
    // re-watching, so they are only bounded by the wall clock / claim above.
    credit = Math.min(credit, (posDelta as number) / MIN_PLAYBACK_RATE + WALL_CLOCK_TOLERANCE_SECONDS);
  }

  return Math.max(0, Math.floor(credit));
}

export interface ProgressStateInput {
  prevTimeSpent: number;
  prevProgress: number;
  prevStatus: ProgressStatus | null;
  creditedSeconds: number;
  inputProgress: number;
  inputStatus: ProgressStatus;
  durationSeconds: number | null;
}

export interface ProgressState {
  timeSpent: number;
  progress: number;
  status: ProgressStatus;
}

/** Monotonic progress/status for a content row after applying one heartbeat. */
export function computeProgressState(input: ProgressStateInput): ProgressState {
  const timeSpent = input.prevTimeSpent + input.creditedSeconds;
  const progressFromTime = input.durationSeconds
    ? Math.min(100, Math.round((timeSpent * 100) / input.durationSeconds))
    : 0;
  const reported = Math.max(input.prevProgress, input.inputProgress);

  const completed =
    input.prevStatus === 'completed' ||
    input.inputStatus === 'completed' ||
    reported >= COMPLETION_PROGRESS_THRESHOLD ||
    progressFromTime >= COMPLETION_PROGRESS_THRESHOLD ||
    (input.durationSeconds ? timeSpent >= input.durationSeconds * 0.75 : false);

  return {
    timeSpent,
    progress: completed ? 100 : Math.max(reported, progressFromTime),
    status: completed ? 'completed' : 'learning',
  };
}

export type AssignmentStatus = 'pending' | 'submitted' | 'under review' | 'approved' | 'rejected';

/**
 * The assignment status a student should see/use.
 *
 * An assignment becomes `pending` when its video is completed (completion is reported by the client,
 * since playback speed varies). `assignment_status` is normally saved at that moment, but if
 * `canSubmitAssignment` was switched on AFTER the student completed the video, the row would keep a
 * null status forever. A completed video with submissions enabled is therefore treated as `pending`.
 */
export function deriveAssignmentStatus(input: {
  canSubmitAssignment?: boolean | null;
  assignmentStatus?: AssignmentStatus | null;
  status?: ProgressStatus | null;
}): AssignmentStatus | null {
  if (input.assignmentStatus) return input.assignmentStatus;
  if (input.canSubmitAssignment !== true) return null;
  return input.status === 'completed' ? 'pending' : null;
}
