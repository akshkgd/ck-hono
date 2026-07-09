export interface DateRange {
  from: Date;
  to: Date;
}

export type DateRangePreset = 'today' | 'yesterday' | 'thisMonth' | 'lastMonth' | 'last7Days' | 'thisYear' | 'custom';

export function calculateDateRange(
  preset: DateRangePreset,
  customStart?: string,
  customEnd?: string
): DateRange {
  const now = new Date();
  let from = new Date();
  let to = new Date();

  switch (preset) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case 'yesterday':
      from.setDate(now.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      to.setDate(now.getDate() - 1);
      to.setHours(23, 59, 59, 999);
      break;

    case 'last7Days':
      from.setDate(now.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case 'thisMonth':
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case 'lastMonth':
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;

    case 'thisYear':
      from = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;

    case 'custom':
      if (customStart) {
        from = new Date(customStart);
        from.setHours(0, 0, 0, 0);
      } else {
        from.setDate(now.getDate() - 7);
        from.setHours(0, 0, 0, 0);
      }
      if (customEnd) {
        to = new Date(customEnd);
        to.setHours(23, 59, 59, 999);
      } else {
        to.setHours(23, 59, 59, 999);
      }
      break;

    default:
      // Fallback to last 7 days
      from.setDate(now.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
  }

  return { from, to };
}

export function shiftMonthSafe(date: Date, months: number): Date {
  const d = new Date(date);
  const targetMonth = (d.getMonth() + months + 12) % 12;
  d.setMonth(d.getMonth() + months);
  if (d.getMonth() !== targetMonth) {
    d.setDate(0);
  }
  return d;
}

export function calculatePreviousDateRange(
  preset: DateRangePreset,
  current: DateRange
): DateRange {
  const previousFrom = new Date(current.from);
  const previousTo = new Date(current.to);

  switch (preset) {
    case 'today':
    case 'yesterday':
      previousFrom.setDate(previousFrom.getDate() - 1);
      previousTo.setDate(previousTo.getDate() - 1);
      break;

    case 'last7Days':
      previousFrom.setDate(previousFrom.getDate() - 7);
      previousTo.setDate(previousTo.getDate() - 7);
      break;

    case 'thisMonth':
      return {
        from: shiftMonthSafe(current.from, -1),
        to: shiftMonthSafe(current.to, -1)
      };

    case 'lastMonth': {
      const year = current.from.getFullYear();
      const month = current.from.getMonth();
      const prevFrom = new Date(year, month - 1, 1, 0, 0, 0, 0);
      const prevTo = new Date(year, month, 0, 23, 59, 59, 999);
      return { from: prevFrom, to: prevTo };
    }

    case 'thisYear':
      previousFrom.setFullYear(previousFrom.getFullYear() - 1);
      previousTo.setFullYear(previousTo.getFullYear() - 1);
      break;

    case 'custom':
    default: {
      const diff = current.to.getTime() - current.from.getTime();
      previousFrom.setTime(current.from.getTime() - diff - 1);
      previousTo.setTime(current.from.getTime() - 1);
      break;
    }
  }

  return { from: previousFrom, to: previousTo };
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

  const current = new Date(from);
  const end = new Date(to);

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
