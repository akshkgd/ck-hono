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
