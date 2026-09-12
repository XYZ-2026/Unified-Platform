// Net Price Calculator Engine
// Uses a heuristic model based on family income brackets and university data

import { University, getStickerPrice } from './data-service';

export interface CalculationProfileOptions {
  residency?: 'in-state' | 'out-of-state' | 'international';
  housing?: 'on-campus' | 'off-campus' | 'with-family';
  firstGen?: boolean;
  multipleInCollege?: boolean;
}

export interface CalculationResult {
  stickerPrice: number;
  tuition: number;
  livingCosts: number;
  estimatedNeedBasedAid: number;
  estimatedMeritAid: number;
  firstGenGrant?: number;
  inStateSavings?: number;
  housingSavings?: number;
  netPrice: number;
  needCoveragePercent: number;
  meritLevel: 'high' | 'moderate' | 'low' | 'none';
  breakdown: CostBreakdownItem[];
  profileApplied?: {
    residency: 'in-state' | 'out-of-state' | 'international';
    housing: 'on-campus' | 'off-campus' | 'with-family';
    firstGen: boolean;
    multipleInCollege: boolean;
  };
}

export interface CostBreakdownItem {
  label: string;
  amount: number;
  type: 'cost' | 'aid' | 'net';
}

// Income bracket → estimated percentage of demonstrated need covered
interface IncomeBracket {
  min: number;
  max: number;
  coverageMin: number;
  coverageMax: number;
  label: string;
}

const INCOME_BRACKETS: IncomeBracket[] = [
  { min: 0, max: 30000, coverageMin: 0.90, coverageMax: 1.00, label: 'Under $30K' },
  { min: 30000, max: 48000, coverageMin: 0.75, coverageMax: 0.90, label: '$30K – $48K' },
  { min: 48000, max: 75000, coverageMin: 0.50, coverageMax: 0.75, label: '$48K – $75K' },
  { min: 75000, max: 110000, coverageMin: 0.30, coverageMax: 0.50, label: '$75K – $110K' },
  { min: 110000, max: 150000, coverageMin: 0.15, coverageMax: 0.30, label: '$110K – $150K' },
  { min: 150000, max: Infinity, coverageMin: 0.00, coverageMax: 0.15, label: 'Over $150K' },
];

// Estimate EFC (Expected Family Contribution / SAI) based on income
function estimateEFC(familyIncome: number, multipleInCollege: boolean = false): number {
  let baseEFC = 0;
  if (familyIncome <= 30000) baseEFC = familyIncome * 0.08;
  else if (familyIncome <= 48000) baseEFC = 2400 + (familyIncome - 30000) * 0.14;
  else if (familyIncome <= 75000) baseEFC = 4920 + (familyIncome - 48000) * 0.20;
  else if (familyIncome <= 110000) baseEFC = 10320 + (familyIncome - 75000) * 0.28;
  else if (familyIncome <= 150000) baseEFC = 20120 + (familyIncome - 110000) * 0.36;
  else baseEFC = 34520 + (familyIncome - 150000) * 0.44;

  // Having 2+ children in college concurrently significantly reduces parent contribution per student
  if (multipleInCollege) {
    baseEFC = Math.round(baseEFC / 1.75);
  }
  return baseEFC;
}

function getIncomeBracket(income: number): IncomeBracket {
  return (
    INCOME_BRACKETS.find((b) => income >= b.min && income < b.max) ||
    INCOME_BRACKETS[INCOME_BRACKETS.length - 1]
  );
}

function getNeedCoverage(income: number): number {
  const bracket = getIncomeBracket(income);
  // Linear interpolation within bracket
  const position = (income - bracket.min) / (bracket.max === Infinity ? 100000 : bracket.max - bracket.min);
  // Higher income within bracket = lower coverage
  return bracket.coverageMax - position * (bracket.coverageMax - bracket.coverageMin);
}

// Determine merit scholarship level by comparing student stats to university averages
export function getMeritLevel(
  studentGPA: number,
  studentSAT: number,
  uni: University
): 'high' | 'moderate' | 'low' | 'none' {
  const satMid = (uni.satScore.min + uni.satScore.max) / 2;
  const gpaAbove = studentGPA - uni.avgGPA;
  const satAbove = studentSAT - satMid;

  // Strong candidate: significantly above averages
  if (gpaAbove >= 0.3 && satAbove >= 100) return 'high';
  if (gpaAbove >= 0.3 || satAbove >= 150) return 'high';

  // Moderate: at or slightly above averages
  if (gpaAbove >= 0.1 && satAbove >= 0) return 'moderate';
  if (gpaAbove >= 0 || satAbove >= 50) return 'moderate';

  // Low: slightly below averages
  if (gpaAbove >= -0.2 && satAbove >= -50) return 'low';

  return 'none';
}

// Estimate merit scholarship amount
function estimateMeritAid(
  meritLevel: 'high' | 'moderate' | 'low' | 'none',
  tuition: number
): number {
  switch (meritLevel) {
    case 'high':
      return Math.round(tuition * 0.35); // ~35% of tuition
    case 'moderate':
      return Math.round(tuition * 0.20); // ~20% of tuition
    case 'low':
      return Math.round(tuition * 0.08); // ~8% of tuition
    case 'none':
      return 0;
  }
}

// Check if a university is likely public vs private based on tuition and name
function isLikelyPublicUniversity(uni: University): boolean {
  if (uni.name.includes('State University') || uni.name.includes('Community College') || uni.name.startsWith('University of ') || uni.name.endsWith(' Institute of Technology')) {
    if (!uni.name.includes('Southern California') && !uni.name.includes('Pennsylvania') && !uni.name.includes('Miami') && !uni.name.includes('Chicago')) {
      return true;
    }
  }
  return uni.tuition < 38000;
}

// Main calculation function
export function calculateNetPrice(
  uni: University,
  familyIncome: number,
  studentGPA: number,
  studentSAT: number,
  options?: CalculationProfileOptions
): CalculationResult {
  const residency = options?.residency || 'in-state';
  const housing = options?.housing || 'on-campus';
  const firstGen = !!options?.firstGen;
  const multipleInCollege = !!options?.multipleInCollege;

  // 1. Calculate Tuition with In-State vs Out-of-State vs International
  let effectiveTuition = uni.tuition;
  let inStateSavings = 0;

  const isPublic = isLikelyPublicUniversity(uni);

  if (residency === 'in-state') {
    if (isPublic && uni.tuition > 10000) {
      // Public universities offer major in-state discounts (typically 40-50% of out-of-state published)
      effectiveTuition = Math.max(4500, Math.round(uni.tuition * 0.44));
      inStateSavings = uni.tuition - effectiveTuition;
    }
  } else if (residency === 'international') {
    // International processing, health insurance, and administrative fees
    effectiveTuition = Math.round(uni.tuition * 1.05);
  }

  // 2. Calculate Housing & Living Expenses
  let effectiveLivingCosts = uni.livingCosts;
  let housingSavings = 0;

  if (housing === 'with-family') {
    // Living at home slashes room and board! Keep only books, transit, and incidental fees
    effectiveLivingCosts = Math.min(uni.livingCosts, 3200);
    housingSavings = uni.livingCosts - effectiveLivingCosts;
  } else if (housing === 'off-campus') {
    // Slight discount off on-campus mandatory room & board meal plans
    effectiveLivingCosts = Math.round(uni.livingCosts * 0.90);
    housingSavings = uni.livingCosts - effectiveLivingCosts;
  }

  const stickerPrice = effectiveTuition + effectiveLivingCosts;
  const efc = estimateEFC(familyIncome, multipleInCollege);
  const demonstratedNeed = Math.max(0, stickerPrice - efc);

  // 3. Need-based aid calculation
  const needCoverage = getNeedCoverage(familyIncome);
  let rawNeedAid = demonstratedNeed * needCoverage;

  if (residency === 'international') {
    // International students are not eligible for US federal Pell grants
    // Aid is primarily institutional endowment aid
    const isEliteEndowed = uni.tuition >= 55000 && uni.avgNeedBasedGrant >= 40000;
    rawNeedAid = isEliteEndowed ? rawNeedAid * 0.85 : rawNeedAid * 0.35;
  }

  // Cap at the university's average need-based grant (with flexibility)
  const estimatedNeedBasedAid = Math.min(
    rawNeedAid,
    Math.max(uni.avgNeedBasedGrant * 1.25, 4000)
  );

  // 4. Merit-based aid calculation
  const meritLevel = getMeritLevel(studentGPA, studentSAT, uni);
  const estimatedMeritAid = estimateMeritAid(meritLevel, effectiveTuition);

  // 5. First-Generation College Grant (if applicable)
  let firstGenGrant = 0;
  if (firstGen) {
    // First gen awards range from $2,000 to $4,500 depending on demonstrated need
    firstGenGrant = familyIncome < 100000 ? Math.round(Math.min(4000, effectiveTuition * 0.15)) : 1500;
  }

  // Total aid should not exceed sticker price
  const totalAid = Math.min(
    estimatedNeedBasedAid + estimatedMeritAid + firstGenGrant,
    stickerPrice
  );
  const netPrice = Math.max(0, stickerPrice - totalAid);

  // Itemized breakdown
  const breakdown: CostBreakdownItem[] = [
    { label: residency === 'in-state' && inStateSavings > 0 ? 'In-State Tuition & Fees' : 'Tuition & Fees', amount: effectiveTuition, type: 'cost' },
    { label: housing === 'with-family' ? 'Living Costs (With Family - Room/Board $0)' : (housing === 'off-campus' ? 'Off-Campus Living Expenses' : 'Room & Board / Living'), amount: effectiveLivingCosts, type: 'cost' },
  ];

  if (inStateSavings > 0) {
    breakdown.push({ label: 'In-State Tuition Savings', amount: -inStateSavings, type: 'aid' });
  }
  if (housingSavings > 0) {
    breakdown.push({ label: 'Housing Cost Reduction', amount: -housingSavings, type: 'aid' });
  }
  if (estimatedNeedBasedAid > 0) {
    breakdown.push({
      label: multipleInCollege ? 'Need-Based Aid (Boosted: Siblings in College)' : 'Need-Based Aid Grant',
      amount: -Math.round(estimatedNeedBasedAid),
      type: 'aid',
    });
  }
  if (estimatedMeritAid > 0) {
    breakdown.push({ label: 'Academic Merit Scholarship', amount: -Math.round(estimatedMeritAid), type: 'aid' });
  }
  if (firstGenGrant > 0) {
    breakdown.push({ label: 'First-Gen Opportunity Grant', amount: -Math.round(firstGenGrant), type: 'aid' });
  }

  breakdown.push({ label: 'Estimated Net Out-of-Pocket Price', amount: Math.round(netPrice), type: 'net' });

  return {
    stickerPrice,
    tuition: effectiveTuition,
    livingCosts: effectiveLivingCosts,
    estimatedNeedBasedAid: Math.round(estimatedNeedBasedAid),
    estimatedMeritAid: Math.round(estimatedMeritAid),
    firstGenGrant,
    inStateSavings,
    housingSavings,
    netPrice: Math.round(netPrice),
    needCoveragePercent: Math.round(needCoverage * 100),
    meritLevel,
    breakdown,
    profileApplied: {
      residency,
      housing,
      firstGen,
      multipleInCollege,
    },
  };
}

// Get merit level description
export function getMeritLevelLabel(level: 'high' | 'moderate' | 'low' | 'none'): string {
  switch (level) {
    case 'high':
      return 'Strong Candidate';
    case 'moderate':
      return 'Competitive';
    case 'low':
      return 'Possible';
    case 'none':
      return 'Unlikely';
  }
}

export function getMeritLevelDescription(level: 'high' | 'moderate' | 'low' | 'none'): string {
  switch (level) {
    case 'high':
      return 'Your academic profile significantly exceeds this university\'s averages. Strong candidate for merit-based scholarships.';
    case 'moderate':
      return 'Your profile meets or slightly exceeds this university\'s averages. You may qualify for partial merit aid.';
    case 'low':
      return 'Your profile is slightly below this university\'s averages. Limited merit scholarship opportunities.';
    case 'none':
      return 'Focus on need-based aid opportunities and strengthening your application.';
  }
}

