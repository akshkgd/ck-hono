export interface DateRange {
  from: Date;
  to: Date;
}

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'thisMonth'
  | 'this_month'
  | 'lastMonth'
  | 'last_month'
  | 'last7Days'
  | 'thisYear'
  | 'custom';

export const APP_TIMEZONE = process.env.TIMEZONE || 'Asia/Kolkata';

export function getTimezoneOffsetMinutes(timeZone: string, date: Date = new Date()): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName')?.value || '';
    // tzPart is e.g. "GMT+5:30", "GMT-7", "UTC", "GMT"
    const match = tzPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!match) return 0;
    const sign = match[1] === '-' ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours * 60 + minutes);
  } catch (e) {
    // fallback to Asia/Kolkata default of +5:30
    return 330;
  }
}

export function calculateDateRange(
  preset: DateRangePreset,
  customStart?: string,
  customEnd?: string
): DateRange {
  const tzOffset = getTimezoneOffsetMinutes(APP_TIMEZONE) * 60 * 1000;
  const nowShifted = new Date(Date.now() + tzOffset);
  let fromShifted = new Date(nowShifted);
  let toShifted = new Date(nowShifted);

  switch (preset) {
    case 'today':
      fromShifted.setUTCHours(0, 0, 0, 0);
      toShifted.setUTCHours(23, 59, 59, 999);
      break;

    case 'yesterday':
      fromShifted.setUTCDate(nowShifted.getUTCDate() - 1);
      fromShifted.setUTCHours(0, 0, 0, 0);
      toShifted.setUTCDate(nowShifted.getUTCDate() - 1);
      toShifted.setUTCHours(23, 59, 59, 999);
      break;

    case 'this_week': {
      const day = nowShifted.getUTCDay();
      const diff = nowShifted.getUTCDate() - day + (day === 0 ? -6 : 1);
      fromShifted = new Date(nowShifted.getTime());
      fromShifted.setUTCDate(diff);
      fromShifted.setUTCHours(0, 0, 0, 0);
      toShifted.setUTCHours(23, 59, 59, 999);
      break;
    }

    case 'last_week': {
      const day = nowShifted.getUTCDay();
      const diff = nowShifted.getUTCDate() - day + (day === 0 ? -6 : 1) - 7;
      fromShifted = new Date(nowShifted.getTime());
      fromShifted.setUTCDate(diff);
      fromShifted.setUTCHours(0, 0, 0, 0);
      toShifted = new Date(fromShifted.getTime());
      toShifted.setUTCDate(fromShifted.getUTCDate() + 6);
      toShifted.setUTCHours(23, 59, 59, 999);
      break;
    }

    case 'last7Days':
      fromShifted.setUTCDate(nowShifted.getUTCDate() - 7);
      fromShifted.setUTCHours(0, 0, 0, 0);
      toShifted.setUTCHours(23, 59, 59, 999);
      break;

    case 'thisMonth':
    case 'this_month':
      fromShifted = new Date(Date.UTC(nowShifted.getUTCFullYear(), nowShifted.getUTCMonth(), 1, 0, 0, 0, 0));
      toShifted.setUTCHours(23, 59, 59, 999);
      break;

    case 'lastMonth':
    case 'last_month':
      fromShifted = new Date(Date.UTC(nowShifted.getUTCFullYear(), nowShifted.getUTCMonth() - 1, 1, 0, 0, 0, 0));
      toShifted = new Date(Date.UTC(nowShifted.getUTCFullYear(), nowShifted.getUTCMonth(), 0, 23, 59, 59, 999));
      break;

    case 'thisYear':
      fromShifted = new Date(Date.UTC(nowShifted.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
      toShifted.setUTCHours(23, 59, 59, 999);
      break;

    case 'custom': {
      let from: Date;
      let to: Date;
      if (customStart) {
        const [y, m, d] = customStart.split('-').map(Number);
        const startShifted = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
        from = new Date(startShifted.getTime() - tzOffset);
      } else {
        fromShifted.setUTCDate(nowShifted.getUTCDate() - 7);
        fromShifted.setUTCHours(0, 0, 0, 0);
        from = new Date(fromShifted.getTime() - tzOffset);
      }
      if (customEnd) {
        const [y, m, d] = customEnd.split('-').map(Number);
        const endShifted = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
        to = new Date(endShifted.getTime() - tzOffset);
      } else {
        toShifted.setUTCHours(23, 59, 59, 999);
        to = new Date(toShifted.getTime() - tzOffset);
      }
      return { from, to };
    }

    default:
      fromShifted.setUTCDate(nowShifted.getUTCDate() - 7);
      fromShifted.setUTCHours(0, 0, 0, 0);
      toShifted.setUTCHours(23, 59, 59, 999);
      break;
  }

  const from = new Date(fromShifted.getTime() - tzOffset);
  const to = new Date(toShifted.getTime() - tzOffset);
  return { from, to };
}

export function shiftMonthSafe(date: Date, months: number): Date {
  const tzOffset = getTimezoneOffsetMinutes(APP_TIMEZONE) * 60 * 1000;
  const dShifted = new Date(date.getTime() + tzOffset);
  const targetMonth = (dShifted.getUTCMonth() + months + 12) % 12;
  dShifted.setUTCMonth(dShifted.getUTCMonth() + months);
  if (dShifted.getUTCMonth() !== targetMonth) {
    dShifted.setUTCDate(0);
  }
  return new Date(dShifted.getTime() - tzOffset);
}

export function calculatePreviousDateRange(
  preset: DateRangePreset,
  current: DateRange
): DateRange {
  const tzOffset = getTimezoneOffsetMinutes(APP_TIMEZONE) * 60 * 1000;
  
  // Shift current dates to local time
  const currentFromShifted = new Date(current.from.getTime() + tzOffset);
  const currentToShifted = new Date(current.to.getTime() + tzOffset);

  const previousFromShifted = new Date(currentFromShifted);
  const previousToShifted = new Date(currentToShifted);

  switch (preset) {
    case 'today':
    case 'yesterday':
      previousFromShifted.setUTCDate(previousFromShifted.getUTCDate() - 1);
      previousToShifted.setUTCDate(previousToShifted.getUTCDate() - 1);
      break;

    case 'last7Days':
      previousFromShifted.setUTCDate(previousFromShifted.getUTCDate() - 7);
      previousToShifted.setUTCDate(previousToShifted.getUTCDate() - 7);
      break;

    case 'thisMonth':
      return {
        from: shiftMonthSafe(current.from, -1),
        to: shiftMonthSafe(current.to, -1)
      };

    case 'lastMonth': {
      const year = currentFromShifted.getUTCFullYear();
      const month = currentFromShifted.getUTCMonth();
      const prevFromShifted = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
      const prevToShifted = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
      return {
        from: new Date(prevFromShifted.getTime() - tzOffset),
        to: new Date(prevToShifted.getTime() - tzOffset)
      };
    }

    case 'thisYear':
      previousFromShifted.setUTCFullYear(previousFromShifted.getUTCFullYear() - 1);
      previousToShifted.setUTCFullYear(previousToShifted.getUTCFullYear() - 1);
      break;

    case 'custom':
    default: {
      const diff = current.to.getTime() - current.from.getTime();
      const previousFrom = new Date(current.from.getTime() - diff - 1);
      const previousTo = new Date(current.from.getTime() - 1);
      return { from: previousFrom, to: previousTo };
    }
  }

  return {
    from: new Date(previousFromShifted.getTime() - tzOffset),
    to: new Date(previousToShifted.getTime() - tzOffset)
  };
}

export type GroupInterval = 'hour' | 'day' | 'month';

export function getGroupInterval(preset: DateRangePreset, from: Date, to: Date): GroupInterval {
  if (preset === 'today' || preset === 'yesterday') {
    return 'hour';
  }
  if (preset === 'thisMonth' || preset === 'lastMonth' || preset === 'last7Days') {
    return 'day';
  }
  if (preset === 'thisYear') {
    return 'month';
  }
  const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 2) {
    return 'hour';
  }
  if (diffDays <= 60) {
    return 'day';
  }
  return 'month';
}

export interface TrendPoint {
  label: string;
  value: number;
}

export function generateTrendBuckets(
  from: Date,
  to: Date,
  interval: GroupInterval
): { buckets: TrendPoint[]; keyMap: Map<string, number> } {
  const buckets: TrendPoint[] = [];
  const keyMap = new Map<string, number>();

  const tzOffset = getTimezoneOffsetMinutes(APP_TIMEZONE) * 60 * 1000;
  const current = new Date(from.getTime() + tzOffset);
  const end = new Date(to.getTime() + tzOffset);

  if (interval === 'hour') {
    current.setUTCMinutes(0, 0, 0);
    while (current <= end) {
      const year = current.getUTCFullYear();
      const month = String(current.getUTCMonth() + 1).padStart(2, '0');
      const date = String(current.getUTCDate()).padStart(2, '0');
      const hour = String(current.getUTCHours()).padStart(2, '0');
      const key = `${year}-${month}-${date} ${hour}:00`;
      
      const label = `${hour}:00`;
      
      buckets.push({ label, value: 0 });
      keyMap.set(key, buckets.length - 1);
      
      current.setUTCHours(current.getUTCHours() + 1);
    }
  } else if (interval === 'day') {
    current.setUTCHours(0, 0, 0, 0);
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    while (current <= end) {
      const year = current.getUTCFullYear();
      const month = String(current.getUTCMonth() + 1).padStart(2, '0');
      const date = String(current.getUTCDate()).padStart(2, '0');
      const key = `${year}-${month}-${date}`;
      
      const label = `${monthsShort[current.getUTCMonth()]} ${date}`;
      
      buckets.push({ label, value: 0 });
      keyMap.set(key, buckets.length - 1);
      
      current.setUTCDate(current.getUTCDate() + 1);
    }
  } else {
    current.setUTCDate(1);
    current.setUTCHours(0, 0, 0, 0);
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    while (current <= end) {
      const year = current.getUTCFullYear();
      const month = String(current.getUTCMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;
      
      const label = `${monthsShort[current.getUTCMonth()]} ${year}`;
      
      buckets.push({ label, value: 0 });
      keyMap.set(key, buckets.length - 1);
      
      current.setUTCMonth(current.getUTCMonth() + 1);
    }
  }

  return { buckets, keyMap };
}
