// Scholarship Matching & Opportunity Suggestions
// Analyzes student profile against university requirements

import { University, formatCurrency } from './data-service';
import { getMeritLevel } from './calculator';

export interface ScholarshipOpportunity {
  type: 'merit' | 'need' | 'academic' | 'diversity';
  title: string;
  description: string;
  estimatedAmount: string;
  likelihood: 'high' | 'moderate' | 'low';
}

export interface ScholarshipAnalysis {
  overallMatch: 'excellent' | 'good' | 'fair' | 'challenging';
  opportunities: ScholarshipOpportunity[];
  tips: string[];
  admissionChance: 'safety' | 'target' | 'reach' | 'far-reach';
}

function getAdmissionChance(
  studentGPA: number,
  studentSAT: number,
  uni: University
): 'safety' | 'target' | 'reach' | 'far-reach' {
  const gpaAbove = studentGPA - uni.avgGPA;
  const satMid = (uni.satScore.min + uni.satScore.max) / 2;
  const satAbove = studentSAT - satMid;

  if (gpaAbove >= 0.2 && satAbove >= 50 && uni.acceptanceRate >= 50) return 'safety';
  if (gpaAbove >= 0 && satAbove >= 0) return 'target';
  if (gpaAbove >= -0.3 && satAbove >= -100) return 'reach';
  return 'far-reach';
}

export function analyzeScholarships(
  uni: University,
  familyIncome: number,
  studentGPA: number,
  studentSAT: number
): ScholarshipAnalysis {
  const meritLevel = getMeritLevel(studentGPA, studentSAT, uni);
  const admissionChance = getAdmissionChance(studentGPA, studentSAT, uni);

  const opportunities: ScholarshipOpportunity[] = [];
  const tips: string[] = [];

  // Use genuine scholarships directly from the data sheet if available
  if (uni.scholarships && uni.scholarships.length > 0) {
    for (const s of uni.scholarships) {
      const titleLower = s.title.toLowerCase();
      const isNeed = titleLower.includes('need') || titleLower.includes('pell') || titleLower.includes('income') || titleLower.includes('grant') || titleLower.includes('guarantee') || titleLower.includes('promise');
      const isMerit = titleLower.includes('merit') || titleLower.includes('presidential') || titleLower.includes('dean') || titleLower.includes('excellence') || titleLower.includes('fellows') || titleLower.includes('scholars') || titleLower.includes('achievement') || titleLower.includes('regents');

      let likelihood: 'high' | 'moderate' | 'low' = 'moderate';
      if (isNeed) {
        likelihood = familyIncome < 65000 ? 'high' : familyIncome < 110000 ? 'moderate' : 'low';
      } else if (isMerit) {
        likelihood = meritLevel === 'high' ? 'high' : meritLevel === 'moderate' ? 'moderate' : 'low';
      } else {
        likelihood = studentGPA >= 3.5 ? 'high' : 'moderate';
      }

      opportunities.push({
        type: isNeed ? 'need' : isMerit ? 'merit' : 'academic',
        title: s.title,
        description: s.description || `Official institutional award at ${uni.name}.`,
        estimatedAmount: s.amount || 'Varies',
        likelihood,
      });
    }
  } else {
    // Fallback: Need-based opportunities
    if (familyIncome < 75000) {
      opportunities.push({
        type: 'need',
        title: 'Federal Pell Grant',
        description: 'Need-based federal grant for undergraduate students with demonstrated financial need.',
        estimatedAmount: familyIncome < 30000 ? 'Up to $7,395' : familyIncome < 48000 ? '$2,000 – $5,000' : '$1,000 – $3,000',
        likelihood: familyIncome < 48000 ? 'high' : 'moderate',
      });

      opportunities.push({
        type: 'need',
        title: 'Institutional Need-Based Grant',
        description: `${uni.name} awards an average of ${formatCurrency(uni.avgNeedBasedGrant)} in need-based aid.`,
        estimatedAmount: `Up to ${formatCurrency(uni.avgNeedBasedGrant)}`,
        likelihood: familyIncome < 48000 ? 'high' : 'moderate',
      });
    }

    if (familyIncome < 110000 && uni.avgNeedBasedGrant > 20000) {
      opportunities.push({
        type: 'need',
        title: 'Federal SEOG Grant',
        description: 'Supplemental Educational Opportunity Grant for students with exceptional financial need.',
        estimatedAmount: '$100 – $4,000',
        likelihood: familyIncome < 48000 ? 'moderate' : 'low',
      });
    }

    // Fallback: Merit-based opportunities
    if (meritLevel === 'high') {
      opportunities.push({
        type: 'merit',
        title: 'Institutional Academic Excellence Award',
        description: `Your GPA (${studentGPA}) and SAT (${studentSAT}) exceed ${uni.name}'s averages.`,
        estimatedAmount: `${formatCurrency(uni.tuition * 0.25)} – ${formatCurrency(uni.tuition * 0.50)}`,
        likelihood: 'high',
      });
    } else if (meritLevel === 'moderate') {
      opportunities.push({
        type: 'merit',
        title: 'Institutional Merit Scholarship',
        description: `Your academic profile is competitive for ${uni.name}. Partial merit awards are likely.`,
        estimatedAmount: `${formatCurrency(uni.tuition * 0.10)} – ${formatCurrency(uni.tuition * 0.25)}`,
        likelihood: 'moderate',
      });
    }
  }

  // Tips
  if (meritLevel === 'high' || meritLevel === 'moderate') {
    tips.push('Apply early — many merit scholarships are awarded on a first-come, first-served basis.');
  }
  if (familyIncome < 110000) {
    tips.push('Complete the FAFSA as early as possible to maximize your need-based aid.');
  }
  if (familyIncome < 75000 && uni.avgNeedBasedGrant > 30000) {
    tips.push(`${uni.name} is generous with need-based aid. You may qualify for significant grants.`);
  }
  if (admissionChance === 'safety' && meritLevel !== 'none') {
    tips.push('As a strong candidate, negotiate your financial aid package — you have leverage.');
  }
  tips.push('Search for external scholarships on Fastweb, Scholarships.com, and your state\'s scholarship portal.');
  if (studentSAT < (uni.satScore.min + uni.satScore.max) / 2) {
    tips.push('Consider retaking the SAT to improve your merit scholarship chances.');
  }

  // Overall match
  let overallMatch: ScholarshipAnalysis['overallMatch'];
  if (meritLevel === 'high' && familyIncome < 75000) overallMatch = 'excellent';
  else if (meritLevel === 'high' || (meritLevel === 'moderate' && familyIncome < 75000))
    overallMatch = 'good';
  else if (meritLevel === 'moderate' || familyIncome < 110000) overallMatch = 'fair';
  else overallMatch = 'challenging';

  return {
    overallMatch,
    opportunities,
    tips,
    admissionChance,
  };
}
