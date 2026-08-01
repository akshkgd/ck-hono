import { describe, it, expect, vi } from 'vitest';
import { calculateDateRange, APP_TIMEZONE, getTimezoneOffsetMinutes } from './date-range.js';

describe('Date Range Utilities Timezone shifting', () => {
  it('should correctly calculate timezone offset minutes', () => {
    const kolkataOffset = getTimezoneOffsetMinutes('Asia/Kolkata');
    expect(kolkataOffset).toBe(330); // IST is UTC+5:30 (330 minutes)
    
    const utcOffset = getTimezoneOffsetMinutes('UTC');
    expect(utcOffset).toBe(0);
  });

  it('should calculate today preset in Asia/Kolkata timezone context', () => {
    // Mock system time to August 1st, 2026 12:00:00 UTC (which is August 1st, 2026 5:30 PM IST)
    const mockTime = new Date('2026-08-01T12:00:00.000Z');
    vi.setSystemTime(mockTime);

    const range = calculateDateRange('today');
    
    // In Asia/Kolkata (IST), "today" starts at August 1st, 2026 00:00:00+05:30
    // which is July 31st, 2026 18:30:00 UTC.
    expect(range.from.toISOString()).toBe('2026-07-31T18:30:00.000Z');

    // And "today" ends at August 1st, 2026 23:59:59.999+05:30
    // which is August 1st, 2026 18:29:59.999 UTC.
    expect(range.to.toISOString()).toBe('2026-08-01T18:29:59.999Z');

    vi.useRealTimers();
  });

  it('should calculate yesterday preset in Asia/Kolkata timezone context', () => {
    const mockTime = new Date('2026-08-01T12:00:00.000Z'); // 5:30 PM IST on Aug 1st
    vi.setSystemTime(mockTime);

    const range = calculateDateRange('yesterday');
    
    // "yesterday" (July 31st local time) starts at July 31st 00:00:00+05:30
    // which is July 30th 18:30:00 UTC
    expect(range.from.toISOString()).toBe('2026-07-30T18:30:00.000Z');

    // "yesterday" ends at July 31st 23:59:59.999+05:30
    // which is July 31st 18:29:59.999 UTC
    expect(range.to.toISOString()).toBe('2026-07-31T18:29:59.999Z');

    vi.useRealTimers();
  });
});
