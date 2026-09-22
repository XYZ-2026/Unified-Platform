/**
 * Academic utility functions for international GPA and Percentage conversions.
 * Calibrated against standard WES and US admissions benchmarks:
 * - 95% - 100% -> 4.00 GPA
 * - 90% - 94.9% -> 3.80 - 3.99 GPA
 * - 80% - 89.9% -> 3.30 - 3.79 GPA
 * - 70% - 79.9% -> 2.70 - 3.29 GPA
 * - 60% - 69.9% -> 2.00 - 2.69 GPA
 * - 50% - 59.9% -> 1.00 - 1.99 GPA
 * - < 50% -> 0.00 - 0.99 GPA
 */

export function cleanNumericValue(val: string | number | undefined | null): number {
  if (val === undefined || val === null) return NaN;
  if (typeof val === 'number') return val;
  const cleaned = val.toString().replace(/[^0-9.]/g, '').trim();
  return parseFloat(cleaned);
}

export function convertPercentageToGpa(percentageInput: number | string): string {
  const p = typeof percentageInput === 'number' ? percentageInput : cleanNumericValue(percentageInput);
  if (isNaN(p) || p <= 0) return '';
  const clamped = Math.min(100, Math.max(0, p));

  let gpa: number;
  if (clamped >= 95) {
    gpa = 4.0;
  } else if (clamped >= 90) {
    // 90 -> 3.80, 95 -> 4.00
    gpa = 3.8 + ((clamped - 90) / 5) * 0.2;
  } else if (clamped >= 80) {
    // 80 -> 3.30, 90 -> 3.80
    gpa = 3.3 + ((clamped - 80) / 10) * 0.5;
  } else if (clamped >= 70) {
    // 70 -> 2.70, 80 -> 3.30
    gpa = 2.7 + ((clamped - 70) / 10) * 0.6;
  } else if (clamped >= 60) {
    // 60 -> 2.00, 70 -> 2.70
    gpa = 2.0 + ((clamped - 60) / 10) * 0.7;
  } else if (clamped >= 50) {
    // 50 -> 1.00, 60 -> 2.00
    gpa = 1.0 + ((clamped - 50) / 10) * 1.0;
  } else {
    gpa = Math.max(0, (clamped / 50) * 1.0);
  }

  // Format to 2 decimal places, removing unnecessary trailing zero if integer
  const formatted = gpa.toFixed(2);
  return formatted.endsWith('.00') ? gpa.toFixed(1) : formatted;
}

export function convertGpaToPercentage(gpaInput: number | string): string {
  const g = typeof gpaInput === 'number' ? gpaInput : cleanNumericValue(gpaInput);
  if (isNaN(g) || g <= 0) return '';
  const clamped = Math.min(4.0, Math.max(0, g));

  let p: number;
  if (clamped >= 4.0) {
    p = 95;
  } else if (clamped >= 3.8) {
    p = 90 + ((clamped - 3.8) / 0.2) * 5;
  } else if (clamped >= 3.3) {
    p = 80 + ((clamped - 3.3) / 0.5) * 10;
  } else if (clamped >= 2.7) {
    p = 70 + ((clamped - 2.7) / 0.6) * 10;
  } else if (clamped >= 2.0) {
    p = 60 + ((clamped - 2.0) / 0.7) * 10;
  } else if (clamped >= 1.0) {
    p = 50 + ((clamped - 1.0) / 1.0) * 10;
  } else {
    p = clamped * 50;
  }

  return Math.round(p).toString();
}

export function formatAcademicScoreDisplay(gpa?: string, percentage?: string): string {
  const cleanGpa = gpa ? gpa.trim() : '';
  const cleanPct = percentage ? percentage.toString().replace(/[^0-9.]/g, '').trim() : '';

  if (cleanGpa && cleanPct) {
    return `GPA: ${cleanGpa} (${cleanPct}%)`;
  }
  if (cleanGpa) {
    const derivedPct = convertGpaToPercentage(cleanGpa);
    return derivedPct ? `GPA: ${cleanGpa} (${derivedPct}%)` : `GPA: ${cleanGpa}`;
  }
  if (cleanPct) {
    const derivedGpa = convertPercentageToGpa(cleanPct);
    return derivedGpa ? `GPA: ${derivedGpa} (${cleanPct}%)` : `Score: ${cleanPct}%`;
  }
  return 'GPA Unspecified';
}
