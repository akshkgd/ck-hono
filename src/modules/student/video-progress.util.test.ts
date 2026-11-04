import { describe, it, expect } from 'vitest';
import {
  computeTimeCredit,
  computeProgressState,
  normalizeVideoDurationSeconds,
  MAX_CREDIT_PER_PING_SECONDS,
} from './video-progress.util.js';

const t0 = new Date('2026-11-04T18:32:00.000Z');
const after = (s: number) => new Date(t0.getTime() + s * 1000);

describe('computeTimeCredit', () => {
  it('credits the claimed time on the first ping (no baseline) - the "20s pause ping" case', () => {
    expect(computeTimeCredit({ claimedSeconds: 20, now: t0, lastPingAt: null, position: 20, lastPosition: null })).toBe(20);
  });

  it('credits a normal 60s tick', () => {
    expect(computeTimeCredit({ claimedSeconds: 60, now: after(60), lastPingAt: t0, position: 80, lastPosition: 20 })).toBe(60);
  });

  it('credits ~0 when the video is paused but a timer ping still fires', () => {
    // 60s of wall clock, claimed 60s, but position did not move.
    expect(computeTimeCredit({ claimedSeconds: 60, now: after(60), lastPingAt: t0, position: 20, lastPosition: 20 })).toBeLessThanOrEqual(5);
  });

  it('never credits more than the wall-clock gap (duplicate / multi-tab pings)', () => {
    expect(computeTimeCredit({ claimedSeconds: 60, now: after(1), lastPingAt: t0, position: 61, lastPosition: 1 })).toBeLessThanOrEqual(6);
  });

  it('caps absurd claims (cumulative total sent as delta, laptop sleep)', () => {
    expect(computeTimeCredit({ claimedSeconds: 7200, now: after(7200), lastPingAt: t0, position: 7000, lastPosition: 0 })).toBe(MAX_CREDIT_PER_PING_SECONDS);
    expect(computeTimeCredit({ claimedSeconds: 7200, now: t0, lastPingAt: null, position: 10, lastPosition: null })).toBe(MAX_CREDIT_PER_PING_SECONDS);
  });

  it('allows 2x playback (position advances faster than time)', () => {
    expect(computeTimeCredit({ claimedSeconds: 60, now: after(60), lastPingAt: t0, position: 120, lastPosition: 0 })).toBe(60);
  });

  it('does not penalise rewinds (re-watching is real time)', () => {
    expect(computeTimeCredit({ claimedSeconds: 60, now: after(60), lastPingAt: t0, position: 40, lastPosition: 100 })).toBe(60);
  });

  it('works without a client claim, derived from position and wall clock', () => {
    expect(computeTimeCredit({ now: after(60), lastPingAt: t0, position: 70, lastPosition: 10 })).toBe(60);
    expect(computeTimeCredit({ now: after(300), lastPingAt: t0, position: 40, lastPosition: 10 })).toBe(30); // paused for a while, then played 30s
    expect(computeTimeCredit({ now: after(60), lastPingAt: null, position: 70, lastPosition: null })).toBe(0);
  });

  it('never returns negative or fractional values', () => {
    const v = computeTimeCredit({ claimedSeconds: 0, now: after(10.7), lastPingAt: t0, position: 5, lastPosition: 5 });
    expect(Number.isInteger(v)).toBe(true);
    expect(v).toBeGreaterThanOrEqual(0);
  });
});

describe('computeProgressState', () => {
  const base = { prevTimeSpent: 0, prevProgress: 0, prevStatus: null, inputProgress: 0, inputStatus: 'learning' as const, durationSeconds: 600 };

  it('creates a learning row with time-derived progress', () => {
    const s = computeProgressState({ ...base, creditedSeconds: 60 });
    expect(s).toEqual({ timeSpent: 60, progress: 10, status: 'learning' });
  });

  it('completes at 75% of duration by watch time', () => {
    const s = computeProgressState({ ...base, prevTimeSpent: 400, prevProgress: 67, prevStatus: 'learning', creditedSeconds: 60 });
    expect(s.status).toBe('completed');
    expect(s.progress).toBe(100);
  });

  it('is monotonic: completed stays completed and progress never drops', () => {
    const done = computeProgressState({ ...base, prevTimeSpent: 600, prevProgress: 100, prevStatus: 'completed', creditedSeconds: 0 });
    expect(done).toMatchObject({ progress: 100, status: 'completed' });
    const keep = computeProgressState({ ...base, prevTimeSpent: 100, prevProgress: 40, prevStatus: 'learning', creditedSeconds: 0, inputProgress: 10 });
    expect(keep.progress).toBe(40);
  });

  it('works without a known duration', () => {
    expect(computeProgressState({ ...base, durationSeconds: null, creditedSeconds: 60, inputProgress: 30 })).toMatchObject({ progress: 30, status: 'learning' });
    expect(computeProgressState({ ...base, durationSeconds: null, creditedSeconds: 60, inputProgress: 80 })).toMatchObject({ progress: 100, status: 'completed' });
  });
});

describe('normalizeVideoDurationSeconds', () => {
  it('treats values under 100 as minutes (mixed legacy data) and the rest as seconds', () => {
    expect(normalizeVideoDurationSeconds(null)).toBeNull();
    expect(normalizeVideoDurationSeconds(0)).toBeNull();
    expect(normalizeVideoDurationSeconds(30)).toBe(1800);
    expect(normalizeVideoDurationSeconds(2277)).toBe(2277);
  });

  it('does not complete a minutes-valued video after a short watch', () => {
    const durationSeconds = normalizeVideoDurationSeconds(30); // stored as 30 minutes
    const s = computeProgressState({ prevTimeSpent: 40, prevProgress: 2, prevStatus: 'learning', creditedSeconds: 20, inputProgress: 0, inputStatus: 'learning', durationSeconds });
    expect(s.status).toBe('learning');
  });
});
