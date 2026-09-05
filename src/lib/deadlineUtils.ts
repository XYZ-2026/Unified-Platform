export const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

export interface DeadlineInfo {
  dueIn: string;
  group: 'NEXT 30 DAYS' | 'LATER THIS CYCLE' | 'OVERDUE';
  diffDays: number;
}

/**
 * Dynamically calculates the human-readable due date ('in 7 days', 'in 2 months', 'overdue')
 * and cycle group based on the current actual date (new Date()).
 */
export function calculateDeadlineInfo(dateStr: string): DeadlineInfo {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length < 2) {
    return { dueIn: dateStr, group: 'LATER THIS CYCLE', diffDays: 999 };
  }

  const monthKey = parts[0].slice(0, 3).toLowerCase();
  const day = parseInt(parts[1], 10);
  const month = MONTH_MAP[monthKey] !== undefined ? MONTH_MAP[monthKey] : now.getMonth();

  let year = now.getFullYear();
  // Admissions cycle spans Aug -> May:
  // If current month is Fall (Aug-Dec: index 7-11) and deadline is Spring (Jan-Jul: index 0-6), target is next calendar year.
  if (now.getMonth() >= 7 && month < 7) {
    year += 1;
  } else if (now.getMonth() < 7 && month >= 7) {
    // If current month is Spring (Jan-Jul) and deadline was Fall (Aug-Dec), it was last year.
    year -= 1;
  }

  const targetDate = new Date(year, month, isNaN(day) ? 1 : day);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let dueIn = '';
  let group: 'NEXT 30 DAYS' | 'LATER THIS CYCLE' | 'OVERDUE' = 'LATER THIS CYCLE';

  if (diffDays < 0) {
    const abs = Math.abs(diffDays);
    dueIn = abs === 1 ? '1 day overdue' : `${abs} days overdue`;
    group = 'OVERDUE';
  } else if (diffDays === 0) {
    dueIn = 'Due today';
    group = 'NEXT 30 DAYS';
  } else if (diffDays === 1) {
    dueIn = 'Tomorrow';
    group = 'NEXT 30 DAYS';
  } else if (diffDays <= 30) {
    dueIn = `in ${diffDays} days`;
    group = 'NEXT 30 DAYS';
  } else if (diffDays <= 60) {
    dueIn = `in ${diffDays} days`;
    group = 'LATER THIS CYCLE';
  } else {
    const months = Math.round(diffDays / 30);
    dueIn = months <= 1 ? 'in 1 month' : `in ${months} months`;
    group = 'LATER THIS CYCLE';
  }

  return { dueIn, group, diffDays };
}
