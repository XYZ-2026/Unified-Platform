'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */
interface WhyReason { icon: string; stat: string; title: string; desc: string; }
interface University {
  name: string; location: string; ranking: string; acceptance: string;
  tuition: string; type: 'Public' | 'Private'; programs: string[];
  subject: string; website: string;
}
interface Course { field: string; icon: string; universities: number; avgTuition: string; duration: string; careers: string[]; }
interface StudyCostLevel { range: string; notes: string; }
interface StudyCosts { bachelor: StudyCostLevel; master: StudyCostLevel; mba: StudyCostLevel; phd: StudyCostLevel; livingCost: string; }
interface Scholarship {
  name: string; amount: string; eligibility: string; deadline: string;
  type: string; funder: string; degreeLevel: string;
  fundingType: 'Full' | 'Partial'; applyUrl: string;
}
interface LangReq { university: string; ielts: string; toefl: string; pte: string; duolingo: string; }
interface CountryInfo {
  slug: string; name: string; flag: string; code: string; tagline: string; heroGradient: string;
  stats: { label: string; value: string }[];
  whyStudyHere: WhyReason[];
  universities: University[];
  courses: Course[];
  studyCosts: StudyCosts;
  scholarships: Scholarship[];
  languageRequirements: LangReq[];
  langNote: string;
  visaSteps: { step: string; title: string; desc: string }[];
  cities: { city: string; rent: string; food: string; transport: string; total: string }[];
}

/* ══════════════════════════════════════════════════════════════
   VECTOR SVG ICON RENDERER (No Raw Emojis)
══════════════════════════════════════════════════════════════ */
function CategoryIcon({ name, className = "w-6 h-6" }: { name?: string; className?: string }) {
  const iconName = (name || '').toLowerCase();

  // University / Graduation / Trophy / Academic
  if (iconName.includes('trophy') || iconName.includes('🏆') || iconName.includes('rank') || iconName.includes('elite')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4a5 5 0 005 5h4a5 5 0 005-5V3M5 3h14M5 3H3v2a4 4 0 004 4h1M19 3h2v2a4 4 0 01-4 4h-1M12 12v6m-4 3h8" />
      </svg>
    );
  }
  if (iconName.includes('grad') || iconName.includes('🎓') || iconName.includes('uni') || iconName.includes('bachelor') || iconName.includes('master')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-5.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    );
  }

  // Work / Briefcase / Visa
  if (iconName.includes('work') || iconName.includes('💼') || iconName.includes('🛂') || iconName.includes('visa') || iconName.includes('job') || iconName.includes('opt') || iconName.includes('psw')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }

  // Science / Research / Lab / Bio
  if (iconName.includes('micro') || iconName.includes('🔬') || iconName.includes('flask') || iconName.includes('atom') || iconName.includes('⚛️') || iconName.includes('🧬') || iconName.includes('research')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.602 15.12a2 2 0 00-1.406.402L3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2l-1.572-1.572zM9 11V3m6 8V3M9 3h6" />
      </svg>
    );
  }

  // Money / Finance / Scholarship
  if (iconName.includes('money') || iconName.includes('💰') || iconName.includes('💸') || iconName.includes('cost') || iconName.includes('fund') || iconName.includes('tuition')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  // Salary / Tech / Growth / Trend
  if (iconName.includes('trend') || iconName.includes('📈') || iconName.includes('salary') || iconName.includes('growth')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    );
  }

  // Time / Duration / Clock
  if (iconName.includes('time') || iconName.includes('⏱️') || iconName.includes('clock') || iconName.includes('duration') || iconName.includes('year')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  // Building / Landmark / Architecture / City
  if (iconName.includes('build') || iconName.includes('🏛️') || iconName.includes('city') || iconName.includes('🏙️') || iconName.includes('tradition')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h2m0 0h2m-4-11h.01M10 10h.01M10 14h.01M14 10h.01M14 14h.01M14 18h.01M10 18h.01" />
      </svg>
    );
  }

  // Globe / World / Travel
  if (iconName.includes('globe') || iconName.includes('🌍') || iconName.includes('world') || iconName.includes('schengen') || iconName.includes('ocean') || iconName.includes('🌊') || iconName.includes('country')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    );
  }

  // Computer / Tech / CS
  if (iconName.includes('computer') || iconName.includes('💻') || iconName.includes('code') || iconName.includes('tech')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }

  // Business / MBA / Analytics
  if (iconName.includes('chart') || iconName.includes('📊') || iconName.includes('business') || iconName.includes('mba')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  }

  // Engineering / Energy / Bolt
  if (iconName.includes('bolt') || iconName.includes('⚡') || iconName.includes('engine') || iconName.includes('⚙️')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }

  // Law / Policy / Scale
  if (iconName.includes('scale') || iconName.includes('⚖️') || iconName.includes('law')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l9-4 9 4M3 6v10c0 5.25 9 5.25 9 5.25s9 0 9-5.25V6M3 6l9 4 9-4" />
      </svg>
    );
  }

  // Automotive / Vehicle / Transport
  if (iconName.includes('car') || iconName.includes('🚗')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zM3 9l2-4h14l2 4M3 9h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
      </svg>
    );
  }

  // Sun / Weather / Lifestyle
  if (iconName.includes('sun') || iconName.includes('☀️')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }

  // Industry / Factory
  if (iconName.includes('factory') || iconName.includes('🏭') || iconName.includes('industry')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h2m0 0h2" />
      </svg>
    );
  }

  // Calendar / Deadline
  if (iconName.includes('calendar') || iconName.includes('🗓️') || iconName.includes('date')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }

  // Lightbulb / Tip / Info
  if (iconName.includes('light') || iconName.includes('💡') || iconName.includes('idea')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    );
  }

  // Default Star / Award
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   COUNTRY DATA
══════════════════════════════════════════════════════════════ */
const COUNTRY_DATA: Record<string, CountryInfo> = {
  usa: {
    slug: 'usa', name: 'United States', flag: '🇺🇸', code: 'USA',
    tagline: 'World-class research, Ivy League prestige, and limitless opportunity.',
    heroGradient: 'from-[#3D040F] via-[#690B1B] to-[#4A0612]',
    stats: [
      { label: 'Universities', value: '180+' }, { label: 'Avg. Tuition / yr', value: '$28,000' },
      { label: 'Visa Approval Rate', value: '82%' }, { label: 'Post-Study OPT', value: '3 Years' },
    ],
    whyStudyHere: [
      { icon: '🏆', stat: '8 of Top 10', title: 'World-Class Universities', desc: 'MIT, Harvard, Stanford, and 5 more QS top-10 universities — an unmatched concentration of academic prestige.' },
      { icon: '💼', stat: '3 Years', title: 'Post-Study Work (OPT)', desc: 'Work legally for up to 3 years post-graduation via STEM OPT. No employer sponsorship needed initially.' },
      { icon: '🔬', stat: '$70B+', title: 'Research Funding', desc: 'The world\'s largest research university system. PhD students get full tuition waiver + stipends.' },
      { icon: '🎓', stat: '1M+', title: 'International Students', desc: 'Over 1 million international students create the world\'s most diverse academic environment.' },
      { icon: '💰', stat: '500+', title: 'Scholarship Programs', desc: 'From Fulbright to university-specific aid — abundant funding opportunities for international students.' },
      { icon: '📈', stat: '$145K', title: 'Avg. Tech Starting Salary', desc: 'US tech salaries lead globally. Silicon Valley, NYC, and Seattle offer unmatched compensation packages.' },
    ],
    universities: [
      { name: 'Massachusetts Institute of Technology', location: 'Cambridge, MA', ranking: '#1 QS', acceptance: '4%', tuition: '$57,986/yr', type: 'Private', programs: ['Computer Science', 'Engineering', 'Physics', 'Economics'], subject: 'STEM', website: 'https://web.mit.edu' },
      { name: 'Stanford University', location: 'Stanford, CA', ranking: '#2 QS', acceptance: '4%', tuition: '$56,169/yr', type: 'Private', programs: ['CS & AI', 'Business (GSB)', 'Medicine', 'Law'], subject: 'Multi-disciplinary', website: 'https://stanford.edu' },
      { name: 'Harvard University', location: 'Cambridge, MA', ranking: '#4 QS', acceptance: '4%', tuition: '$54,768/yr', type: 'Private', programs: ['MBA (HBS)', 'Law', 'Medicine', 'Public Policy'], subject: 'Multi-disciplinary', website: 'https://harvard.edu' },
      { name: 'Carnegie Mellon University', location: 'Pittsburgh, PA', ranking: '#65 QS', acceptance: '15%', tuition: '$58,924/yr', type: 'Private', programs: ['Computer Science', 'AI & Robotics', 'Fine Arts', 'Business'], subject: 'STEM', website: 'https://cmu.edu' },
      { name: 'UC Berkeley', location: 'Berkeley, CA', ranking: '#12 QS', acceptance: '14%', tuition: '$44,066/yr', type: 'Public', programs: ['Engineering', 'Computer Science', 'Business (Haas)', 'Law'], subject: 'Multi-disciplinary', website: 'https://berkeley.edu' },
      { name: 'UIUC', location: 'Champaign, IL', ranking: '#82 QS', acceptance: '45%', tuition: '$32,000/yr', type: 'Public', programs: ['Computer Science', 'Engineering', 'Business', 'Agriculture'], subject: 'STEM', website: 'https://illinois.edu' },
    ],
    courses: [
      { field: 'Computer Science & AI', icon: '💻', universities: 180, avgTuition: '$28,000/yr', duration: '2 years', careers: ['Software Engineer', 'AI Researcher', 'Data Scientist', 'ML Engineer'] },
      { field: 'Business Administration (MBA)', icon: '📊', universities: 95, avgTuition: '$55,000/yr', duration: '2 years', careers: ['Management Consultant', 'Investment Banker', 'Product Manager', 'Entrepreneur'] },
      { field: 'Electrical Engineering', icon: '⚡', universities: 120, avgTuition: '$26,000/yr', duration: '2 years', careers: ['Embedded Systems', 'Circuit Design', 'Power Systems', 'Robotics'] },
      { field: 'Data Science & Analytics', icon: '📈', universities: 140, avgTuition: '$25,000/yr', duration: '1.5–2 years', careers: ['Data Analyst', 'Business Intelligence', 'Quantitative Analyst', 'Data Engineer'] },
      { field: 'Biomedical Sciences', icon: '🧬', universities: 80, avgTuition: '$32,000/yr', duration: '2 years', careers: ['Medical Researcher', 'Pharmaceutical', 'Biotech', 'Clinical Research'] },
      { field: 'Public Policy & Law (LLM)', icon: '⚖️', universities: 55, avgTuition: '$38,000/yr', duration: '1 year', careers: ['Government Policy', 'International Law', 'NGO Sector', 'Human Rights'] },
    ],
    studyCosts: {
      bachelor: { range: '$20,000 – $55,000/yr', notes: 'Private universities can reach $60K+. Public state universities are cheaper for out-of-state students. Budget ~$35K as a realistic average.' },
      master: { range: '$22,000 – $50,000/yr', notes: 'STEM programs at top schools are on the higher end. CS and Engineering average $30–45K. Many programs offer assistantships.' },
      mba: { range: '$35,000 – $75,000/yr', notes: 'Top MBA programs (Harvard, Wharton, Booth) exceed $70K/yr. Merit scholarships and GA positions can substantially reduce costs.' },
      phd: { range: 'Fully Funded (typically)', notes: 'Most US PhD programs include full tuition waiver + stipend of $20,000–$35,000/yr. Apply early — competition is fierce.' },
      livingCost: '$1,600 – $3,500/month',
    },
    scholarships: [
      { name: 'Fulbright Foreign Student Program', amount: 'Full Funding', eligibility: 'Post-graduate students from 160+ countries worldwide', deadline: 'Oct 15, annually', type: 'Government', funder: 'U.S. Department of State', degreeLevel: "Master's / PhD", fundingType: 'Full', applyUrl: 'https://foreign.fulbrightonline.org' },
      { name: 'Hubert H. Humphrey Fellowship', amount: 'Full Funding', eligibility: 'Mid-career professionals from developing nations', deadline: 'Sep 1, annually', type: 'Government', funder: 'U.S. Department of State', degreeLevel: 'Professional / Non-degree', fundingType: 'Full', applyUrl: 'https://www.humphreyfellowship.org' },
      { name: 'NSF Graduate Research Fellowship', amount: '$37,000/yr stipend + tuition', eligibility: 'STEM graduate students — US citizens & nationals', deadline: 'Oct 15, annually', type: 'Research', funder: 'National Science Foundation', degreeLevel: "Master's / PhD", fundingType: 'Partial', applyUrl: 'https://www.nsfgrfp.org' },
      { name: 'Stanford Knight-Hennessy Scholars', amount: 'Full Funding + Stipend', eligibility: 'Outstanding individuals at any Stanford graduate program', deadline: 'Oct 12, annually', type: 'University', funder: 'Stanford University', degreeLevel: "Master's / PhD / Professional", fundingType: 'Full', applyUrl: 'https://knight-hennessy.stanford.edu' },
    ],
    languageRequirements: [
      { university: 'MIT', ielts: '7.0+', toefl: '100+', pte: '70+', duolingo: '120+' },
      { university: 'Harvard University', ielts: '7.0+', toefl: '100+', pte: '75+', duolingo: '120+' },
      { university: 'Stanford University', ielts: '7.0+', toefl: '100+', pte: 'N/A', duolingo: '120+' },
      { university: 'Carnegie Mellon', ielts: '7.0+', toefl: '100+', pte: '65+', duolingo: '115+' },
      { university: 'UC Berkeley', ielts: '7.0+', toefl: '90+', pte: '68+', duolingo: '115+' },
    ],
    langNote: 'Most US universities require IELTS 6.5–7.0 or TOEFL 80–100. Students from recognized English-medium schools, or native English-speaking countries, are typically exempt from language tests.',
    visaSteps: [
      { step: '01', title: 'Receive I-20 / DS-2019', desc: 'Your university issues this document after admission. Required to apply for your F-1 student visa.' },
      { step: '02', title: 'Pay SEVIS Fee', desc: 'Pay the $350 SEVIS I-901 fee online at FMJfee.com before your visa interview appointment.' },
      { step: '03', title: 'Complete DS-160 Form', desc: 'Fill the non-immigrant visa application form online at ceac.state.gov. Save your confirmation number.' },
      { step: '04', title: 'Schedule Visa Interview', desc: 'Book your F-1 student visa appointment at the nearest US Embassy or Consulate in your country.' },
      { step: '05', title: 'Attend the Interview', desc: 'Bring: I-20, financial documents, admission letter, passport, DS-160 confirmation, and SEVIS fee receipt.' },
      { step: '06', title: 'Receive Visa & Travel', desc: 'Typical processing: 3–5 business days. You may enter the US up to 30 days before your program starts.' },
    ],
    cities: [
      { city: 'New York, NY', rent: '$2,200', food: '$500', transport: '$130', total: '$2,900' },
      { city: 'Boston, MA', rent: '$1,900', food: '$450', transport: '$90', total: '$2,500' },
      { city: 'San Francisco, CA', rent: '$2,800', food: '$550', transport: '$120', total: '$3,500' },
      { city: 'Chicago, IL', rent: '$1,500', food: '$400', transport: '$105', total: '$2,050' },
      { city: 'Pittsburgh, PA', rent: '$1,100', food: '$350', transport: '$85', total: '$1,600' },
    ],
  },

  uk: {
    slug: 'uk', name: 'United Kingdom', flag: '🇬🇧', code: 'UK',
    tagline: 'Russell Group excellence, 1-year Masters, and a post-study work visa.',
    heroGradient: 'from-[#3D040F] via-[#690B1B] to-[#4A0612]',
    stats: [
      { label: 'Universities', value: '120+' }, { label: 'Avg. Tuition / yr', value: '£18,000' },
      { label: 'PSW Visa', value: '2 Years' }, { label: 'Program Duration', value: '1 Year (MS)' },
    ],
    whyStudyHere: [
      { icon: '⏱️', stat: '1 Year', title: 'Shorter Masters Programs', desc: 'Complete a world-recognized MSc in 12 months. Save a full year of tuition and living costs vs 2-year programs.' },
      { icon: '🎓', stat: '24 Elite', title: 'Russell Group Universities', desc: 'Oxford, Cambridge, Imperial, UCL and 20 more world-leading research universities.' },
      { icon: '🛂', stat: '2 Years', title: 'Graduate Route Visa', desc: 'Stay and work in the UK for 2 years after graduation (3 for PhD) — no job offer required upfront.' },
      { icon: '🏛️', stat: '800+ yrs', title: 'Academic Tradition', desc: 'Oxford was founded in 1096. Study at institutions with centuries of academic excellence and legacy.' },
      { icon: '💰', stat: 'Chevening+', title: 'Prestigious Scholarships', desc: 'Chevening, Commonwealth, Rhodes, and Gates Cambridge fund thousands of international scholars.' },
      { icon: '🌍', stat: '26 Countries', title: 'European Access', desc: 'Vibrant multicultural campuses in world-class cities. Easy travel to Europe for research and culture.' },
    ],
    universities: [
      { name: 'University of Oxford', location: 'Oxford, England', ranking: '#3 QS', acceptance: '18%', tuition: '£26,770/yr', type: 'Public', programs: ['PPE', 'Medicine', 'Law', 'Computer Science'], subject: 'Multi-disciplinary', website: 'https://ox.ac.uk' },
      { name: 'University of Cambridge', location: 'Cambridge, England', ranking: '#5 QS', acceptance: '21%', tuition: '£25,860/yr', type: 'Public', programs: ['Natural Sciences', 'Engineering', 'Mathematics', 'Law'], subject: 'Multi-disciplinary', website: 'https://cam.ac.uk' },
      { name: 'Imperial College London', location: 'London, England', ranking: '#8 QS', acceptance: '14%', tuition: '£32,000/yr', type: 'Public', programs: ['Engineering', 'Medicine', 'Business', 'Computing'], subject: 'STEM', website: 'https://imperial.ac.uk' },
      { name: 'UCL', location: 'London, England', ranking: '#9 QS', acceptance: '63%', tuition: '£21,000/yr', type: 'Public', programs: ['Architecture', 'Law', 'Life Sciences', 'Computer Science'], subject: 'Multi-disciplinary', website: 'https://ucl.ac.uk' },
      { name: 'University of Edinburgh', location: 'Edinburgh, Scotland', ranking: '#22 QS', acceptance: '52%', tuition: '£18,900/yr', type: 'Public', programs: ['Medicine', 'Informatics', 'Business', 'Law'], subject: 'Multi-disciplinary', website: 'https://ed.ac.uk' },
      { name: 'University of Manchester', location: 'Manchester, England', ranking: '#32 QS', acceptance: '56%', tuition: '£17,000/yr', type: 'Public', programs: ['Business', 'Engineering', 'Medicine', 'Physics'], subject: 'Multi-disciplinary', website: 'https://manchester.ac.uk' },
    ],
    courses: [
      { field: 'Finance & Banking', icon: '💰', universities: 85, avgTuition: '£18,000/yr', duration: '1 year', careers: ['Investment Banking', 'Risk Management', 'Trading', 'Fintech'] },
      { field: 'Computer Science', icon: '💻', universities: 100, avgTuition: '£20,000/yr', duration: '1 year', careers: ['Software Engineer', 'DevOps', 'Cybersecurity', 'AI Research'] },
      { field: 'MBA', icon: '📊', universities: 60, avgTuition: '£35,000/yr', duration: '1 year', careers: ['Strategy Consultant', 'Operations Manager', 'Entrepreneur', 'VC/PE'] },
      { field: 'International Relations', icon: '🌍', universities: 70, avgTuition: '£16,000/yr', duration: '1 year', careers: ['Diplomat', 'NGO Manager', 'Policy Analyst', 'UN Officer'] },
      { field: 'Data Science & ML', icon: '📈', universities: 90, avgTuition: '£19,000/yr', duration: '1 year', careers: ['Data Scientist', 'NLP Engineer', 'Research Analyst', 'Quant'] },
      { field: 'Architecture & Design', icon: '🏛️', universities: 45, avgTuition: '£17,000/yr', duration: '1–2 years', careers: ['Architect', 'Urban Planner', 'Interior Designer', 'Civil Designer'] },
    ],
    studyCosts: {
      bachelor: { range: '£10,000 – £26,000/yr', notes: '3-year bachelor\'s programs at most UK universities. Russell Group institutions charge £20,000–£26,000/yr for international students.' },
      master: { range: '£14,000 – £35,000/yr', notes: '1-year MSc programs — great value versus 2-year alternatives. Business and finance at London schools tend to be on the higher end.' },
      mba: { range: '£25,000 – £60,000/yr', notes: 'London Business School MBA is globally top-ranked. Substantial merit scholarships available for strong candidates.' },
      phd: { range: '£14,000 – £20,000/yr', notes: 'Many UK PhD programs offer full or partial funding through UKRI Research Council studentships and university bursaries.' },
      livingCost: '£1,100 – £2,200/month',
    },
    scholarships: [
      { name: 'Chevening Scholarship', amount: 'Full Funding', eligibility: 'International students with 2+ years work experience', deadline: 'Nov 5, annually', type: 'Government', funder: 'UK Foreign Commonwealth & Development Office', degreeLevel: "Master's", fundingType: 'Full', applyUrl: 'https://www.chevening.org' },
      { name: 'Commonwealth Scholarships', amount: 'Full Funding', eligibility: 'Citizens of Commonwealth developing countries', deadline: 'Dec 16, annually', type: 'Government', funder: 'Commonwealth Scholarship Commission', degreeLevel: "Master's / PhD", fundingType: 'Full', applyUrl: 'https://cscuk.fcdo.gov.uk' },
      { name: 'Rhodes Scholarship', amount: 'Full Funding + Stipend', eligibility: 'High-achieving graduates from around the world', deadline: 'Aug–Oct (varies by country)', type: 'Private', funder: 'Rhodes Trust', degreeLevel: "Master's / PhD", fundingType: 'Full', applyUrl: 'https://www.rhodeshouse.ox.ac.uk' },
      { name: 'Gates Cambridge Scholarship', amount: 'Full Funding', eligibility: 'Non-UK citizens applying to the University of Cambridge', deadline: 'Oct 14, annually', type: 'Private', funder: 'Bill & Melinda Gates Foundation', degreeLevel: "Master's / PhD", fundingType: 'Full', applyUrl: 'https://www.gatescambridge.org' },
    ],
    languageRequirements: [
      { university: 'University of Oxford', ielts: '7.5', toefl: '110', pte: '76', duolingo: '135' },
      { university: 'University of Cambridge', ielts: '7.5', toefl: '110', pte: '76', duolingo: '135' },
      { university: 'Imperial College London', ielts: '7.0', toefl: '100', pte: '67', duolingo: '120' },
      { university: 'UCL', ielts: '6.5', toefl: '96', pte: '62', duolingo: '115' },
      { university: 'University of Edinburgh', ielts: '6.5', toefl: '92', pte: '62', duolingo: '110' },
    ],
    langNote: 'Most UK universities require IELTS 6.5–7.5. Universities commonly exempt students from countries where English is the primary language, or those with prior English-medium qualifications.',
    visaSteps: [
      { step: '01', title: 'Receive CAS Number', desc: 'Your university sends a Confirmation of Acceptance for Studies (CAS) after you meet all admission conditions.' },
      { step: '02', title: 'Apply for Student Visa Online', desc: 'Apply via gov.uk at least 3 months before your course starts. Visa application fee: £363.' },
      { step: '03', title: 'Prove Financial Means', desc: 'Show £1,334/month for London (£1,023 outside London) for up to 9 months in bank statements.' },
      { step: '04', title: 'Pay Immigration Health Surcharge', desc: 'Pay £776/year for NHS access. Mandatory, paid during the online visa application.' },
      { step: '05', title: 'Biometric Appointment', desc: 'Visit a UKVI visa application centre in your country to provide fingerprints and a photo.' },
      { step: '06', title: 'Collect BRP on Arrival', desc: 'Collect your Biometric Residence Permit (BRP) at your university within 10 days of arrival in the UK.' },
    ],
    cities: [
      { city: 'London', rent: '£1,600', food: '£350', transport: '£165', total: '£2,200' },
      { city: 'Edinburgh', rent: '£950', food: '£280', transport: '£60', total: '£1,350' },
      { city: 'Manchester', rent: '£800', food: '£270', transport: '£75', total: '£1,200' },
      { city: 'Birmingham', rent: '£750', food: '£250', transport: '£70', total: '£1,130' },
      { city: 'Bristol', rent: '£900', food: '£280', transport: '£80', total: '£1,320' },
    ],
  },

  canada: {
    slug: 'canada', name: 'Canada', flag: '🇨🇦', code: 'CA',
    tagline: 'Post-study work permits, PR pathways, and world-class quality of life.',
    heroGradient: 'from-[#3D040F] via-[#690B1B] to-[#4A0612]',
    stats: [
      { label: 'Universities', value: '85+' }, { label: 'Avg. Tuition / yr', value: 'CA$22,000' },
      { label: 'PGWP Duration', value: 'Up to 3 yrs' }, { label: 'PR Eligibility', value: 'After PGWP' },
    ],
    whyStudyHere: [
      { icon: '🛂', stat: '3 Years', title: 'Post-Grad Work Permit', desc: 'Work anywhere in Canada for up to 3 years after graduation. No employer or location restrictions.' },
      { icon: '🏡', stat: 'Express Entry', title: 'Clear PR Pathway', desc: 'Canadian education and work experience earn high CRS points, making permanent residency achievable.' },
      { icon: '💰', stat: '30–40%', title: 'Lower Cost Than USA', desc: 'World-class education at significantly lower tuition. Strong scholarship programs supplement aid.' },
      { icon: '🤝', stat: '#2 World', title: 'Best Country to Immigrate', desc: 'Canada consistently ranks as the most welcoming country for immigrants and international students.' },
      { icon: '🔬', stat: 'Global Top 5', title: 'AI Research Leader', desc: 'Toronto, Montreal, and Vancouver are global deep learning and AI research hubs with thriving tech ecosystems.' },
      { icon: '🎓', stat: '640,000+', title: 'International Students', desc: 'Bilingual (English + French) environment attracting students from 200+ countries.' },
    ],
    universities: [
      { name: 'University of Toronto', location: 'Toronto, ON', ranking: '#25 QS', acceptance: '43%', tuition: 'CA$38,000/yr', type: 'Public', programs: ['Computer Science', 'Engineering', 'Business (Rotman)', 'Medicine'], subject: 'Multi-disciplinary', website: 'https://utoronto.ca' },
      { name: 'McGill University', location: 'Montreal, QC', ranking: '#30 QS', acceptance: '46%', tuition: 'CA$22,000/yr', type: 'Public', programs: ['Medicine', 'Law', 'Engineering', 'Music'], subject: 'Multi-disciplinary', website: 'https://mcgill.ca' },
      { name: 'University of British Columbia', location: 'Vancouver, BC', ranking: '#38 QS', acceptance: '52%', tuition: 'CA$35,000/yr', type: 'Public', programs: ['Forestry', 'Computer Science', 'Business (Sauder)', 'Environmental Science'], subject: 'Multi-disciplinary', website: 'https://ubc.ca' },
      { name: 'University of Waterloo', location: 'Waterloo, ON', ranking: '#112 QS', acceptance: '53%', tuition: 'CA$27,000/yr', type: 'Public', programs: ['Computer Science', 'Software Engineering', 'Mathematics', 'Mechatronics'], subject: 'STEM', website: 'https://uwaterloo.ca' },
      { name: 'University of Alberta', location: 'Edmonton, AB', ranking: '#111 QS', acceptance: '58%', tuition: 'CA$24,000/yr', type: 'Public', programs: ['Engineering', 'Medicine', 'Law', 'Education'], subject: 'Multi-disciplinary', website: 'https://ualberta.ca' },
      { name: 'Simon Fraser University', location: 'Burnaby, BC', ranking: '#280 QS', acceptance: '61%', tuition: 'CA$20,000/yr', type: 'Public', programs: ['Computing Science', 'Business', 'Health Sciences', 'Education'], subject: 'Multi-disciplinary', website: 'https://sfu.ca' },
    ],
    courses: [
      { field: 'Computer Science & AI', icon: '💻', universities: 60, avgTuition: 'CA$25,000/yr', duration: '2 years', careers: ['Software Engineer', 'AI Researcher', 'Data Scientist', 'Systems Analyst'] },
      { field: 'Business & MBA', icon: '📊', universities: 45, avgTuition: 'CA$40,000/yr', duration: '2 years', careers: ['Business Development', 'Finance Manager', 'Marketing Director', 'Entrepreneur'] },
      { field: 'Engineering', icon: '⚙️', universities: 55, avgTuition: 'CA$22,000/yr', duration: '2 years', careers: ['Project Engineer', 'Structural Engineer', 'Environmental Engineer', 'Product Designer'] },
      { field: 'Healthcare & Nursing', icon: '🏥', universities: 35, avgTuition: 'CA$18,000/yr', duration: '2 years', careers: ['Registered Nurse', 'Healthcare Admin', 'Clinical Researcher', 'Public Health Officer'] },
      { field: 'Environmental Science', icon: '🌱', universities: 40, avgTuition: 'CA$20,000/yr', duration: '2 years', careers: ['Environmental Consultant', 'Conservation Officer', 'Policy Advisor', 'Climate Researcher'] },
      { field: 'Finance & Accounting', icon: '💰', universities: 50, avgTuition: 'CA$28,000/yr', duration: '1–2 years', careers: ['CPA', 'Financial Analyst', 'Portfolio Manager', 'CFO'] },
    ],
    studyCosts: {
      bachelor: { range: 'CA$18,000 – CA$35,000/yr', notes: '4-year programs. Quebec universities are significantly cheaper. Engineering and business programs cost more. Budget CA$25K as an average.' },
      master: { range: 'CA$14,000 – CA$35,000/yr', notes: '2-year programs standard. Top programs at U of T and UBC cost more but offer strong funding and assistantship options.' },
      mba: { range: 'CA$28,000 – CA$95,000/yr', notes: 'Rotman (U of T), Ivey (UWO), and Schulich are Canada\'s top MBA programs. Merit scholarships widely available.' },
      phd: { range: 'CA$7,000 – CA$15,000/yr', notes: 'Many PhD programs substantially funded through NSERC/SSHRC grants and supervisor-funded positions with monthly stipends.' },
      livingCost: 'CA$1,500 – CA$2,500/month',
    },
    scholarships: [
      { name: 'Vanier Canada Graduate Scholarship', amount: 'CA$50,000/yr (3 years)', eligibility: 'PhD students with academic excellence and leadership', deadline: 'Nov 1, annually', type: 'Government', funder: 'Government of Canada (Tri-agency)', degreeLevel: 'PhD', fundingType: 'Partial', applyUrl: 'https://vanier.gc.ca' },
      { name: 'Lester B. Pearson Scholarship', amount: 'Full Tuition + Living Expenses', eligibility: 'International undergrads nominated by their high school', deadline: 'Nov 30, annually', type: 'University', funder: 'University of Toronto', degreeLevel: "Bachelor's", fundingType: 'Full', applyUrl: 'https://future.utoronto.ca/pearson' },
      { name: 'Ontario Graduate Scholarship (OGS)', amount: 'CA$15,000/yr', eligibility: 'Graduate students at Ontario universities by merit', deadline: 'Varies by university', type: 'Provincial', funder: 'Government of Ontario', degreeLevel: "Master's / PhD", fundingType: 'Partial', applyUrl: 'https://osap.gov.on.ca' },
      { name: 'Banting Postdoctoral Fellowship', amount: 'CA$70,000/yr (2 years)', eligibility: 'Postdoctoral researchers (Canadian & international)', deadline: 'Sep 22, annually', type: 'Government', funder: 'Government of Canada', degreeLevel: 'Postdoctoral', fundingType: 'Partial', applyUrl: 'https://banting.fellowships-bourses.gc.ca' },
    ],
    languageRequirements: [
      { university: 'University of Toronto', ielts: '6.5', toefl: '100', pte: '65', duolingo: '120' },
      { university: 'McGill University', ielts: '6.5', toefl: '90', pte: '65', duolingo: '115' },
      { university: 'University of British Columbia', ielts: '6.5', toefl: '90', pte: '65', duolingo: '120' },
      { university: 'University of Waterloo', ielts: '7.0', toefl: '90', pte: '63', duolingo: '115' },
      { university: 'University of Alberta', ielts: '6.5', toefl: '88', pte: '59', duolingo: '105' },
    ],
    langNote: 'Most Canadian universities require IELTS 6.5 or TOEFL 90. Exemptions apply for students from recognized English-speaking countries or those with prior English-medium education. Always verify with individual programs.',
    visaSteps: [
      { step: '01', title: 'Receive Letter of Acceptance', desc: 'Obtain your official offer letter from a Designated Learning Institution (DLI) in Canada.' },
      { step: '02', title: 'Create IRCC Account', desc: 'Create a profile on ircc.canada.ca to apply for your Study Permit online. This is mandatory.' },
      { step: '03', title: 'Submit Biometrics', desc: 'Pay CA$85 biometric fee and visit a Visa Application Centre (VAC) to provide fingerprints and photo.' },
      { step: '04', title: 'Provide Financial Proof', desc: 'Show tuition amount + CA$10,000 for the first year\'s living expenses in accessible bank statements.' },
      { step: '05', title: 'Medical Exam (if required)', desc: 'Some nationalities require an upfront medical examination by an IRCC-approved physician.' },
      { step: '06', title: 'Receive Study Permit', desc: 'Average processing: 8 weeks online. A Port of Entry (POE) letter is issued if approved before your travel date.' },
    ],
    cities: [
      { city: 'Toronto, ON', rent: 'CA$1,800', food: 'CA$450', transport: 'CA$156', total: 'CA$2,500' },
      { city: 'Vancouver, BC', rent: 'CA$1,900', food: 'CA$430', transport: 'CA$100', total: 'CA$2,500' },
      { city: 'Montreal, QC', rent: 'CA$1,100', food: 'CA$380', transport: 'CA$90', total: 'CA$1,650' },
      { city: 'Ottawa, ON', rent: 'CA$1,400', food: 'CA$400', transport: 'CA$125', total: 'CA$2,000' },
      { city: 'Calgary, AB', rent: 'CA$1,300', food: 'CA$410', transport: 'CA$115', total: 'CA$1,900' },
    ],
  },

  australia: {
    slug: 'australia', name: 'Australia', flag: '🇦🇺', code: 'AU',
    tagline: 'Group of Eight universities, high quality of life, and a Temporary Graduate Visa.',
    heroGradient: 'from-[#3D040F] via-[#690B1B] to-[#4A0612]',
    stats: [
      { label: 'Universities', value: '60+' }, { label: 'Avg. Tuition / yr', value: 'AUD$30,000' },
      { label: 'Post-Study Visa', value: '2–4 Years' }, { label: 'Work Rights', value: '48 hrs/fortnight' },
    ],
    whyStudyHere: [
      { icon: '🌊', stat: 'Top 10', title: 'Most Liveable Cities', desc: 'Melbourne, Sydney, and Brisbane consistently rank among the world\'s most liveable cities year after year.' },
      { icon: '🎓', stat: '6 in Top 100', title: 'Group of Eight', desc: 'Australia\'s eight elite research universities — 6 ranked in the global top 100 by QS.' },
      { icon: '💼', stat: '4 Years', title: 'Post-Study Work Visa', desc: 'Temporary Graduate Visa grants up to 4 years of work rights depending on your qualification and location.' },
      { icon: '☀️', stat: '300+ Days', title: 'Sunshine & Quality of Life', desc: 'Excellent outdoor lifestyle, low crime, stunning nature, and a famously welcoming multicultural culture.' },
      { icon: '🔬', stat: 'World Leader', title: 'Marine & Environmental Research', desc: 'Global expertise in marine biology, environmental science, and Great Barrier Reef conservation.' },
      { icon: '💰', stat: '48 hrs/fn', title: 'Work During Studies', desc: 'Work up to 48 hours per fortnight during semesters and unlimited hours during university breaks.' },
    ],
    universities: [
      { name: 'Australian National University', location: 'Canberra, ACT', ranking: '#30 QS', acceptance: '35%', tuition: 'AUD$42,000/yr', type: 'Public', programs: ['International Relations', 'Science', 'Law', 'Business'], subject: 'Multi-disciplinary', website: 'https://anu.edu.au' },
      { name: 'University of Melbourne', location: 'Melbourne, VIC', ranking: '#33 QS', acceptance: '70%', tuition: 'AUD$38,000/yr', type: 'Public', programs: ['Medicine', 'Law', 'Business', 'Engineering'], subject: 'Multi-disciplinary', website: 'https://unimelb.edu.au' },
      { name: 'University of Sydney', location: 'Sydney, NSW', ranking: '#40 QS', acceptance: '30%', tuition: 'AUD$41,000/yr', type: 'Public', programs: ['Architecture', 'Medicine', 'Law', 'Business'], subject: 'Multi-disciplinary', website: 'https://sydney.edu.au' },
      { name: 'University of Queensland', location: 'Brisbane, QLD', ranking: '#40 QS', acceptance: '50%', tuition: 'AUD$34,000/yr', type: 'Public', programs: ['Biological Sciences', 'Engineering', 'Business', 'Medicine'], subject: 'Multi-disciplinary', website: 'https://uq.edu.au' },
      { name: 'UNSW Sydney', location: 'Sydney, NSW', ranking: '#45 QS', acceptance: '35%', tuition: 'AUD$40,000/yr', type: 'Public', programs: ['Engineering', 'Business (AGSM)', 'Medicine', 'Law'], subject: 'Multi-disciplinary', website: 'https://unsw.edu.au' },
      { name: 'Monash University', location: 'Melbourne, VIC', ranking: '#57 QS', acceptance: '55%', tuition: 'AUD$32,000/yr', type: 'Public', programs: ['Engineering', 'Pharmacy', 'Business', 'IT'], subject: 'Multi-disciplinary', website: 'https://monash.edu' },
    ],
    courses: [
      { field: 'Mining & Resources Engineering', icon: '⛏️', universities: 20, avgTuition: 'AUD$36,000/yr', duration: '2 years', careers: ['Mining Engineer', 'Geologist', 'Resource Manager', 'Safety Officer'] },
      { field: 'Computer Science', icon: '💻', universities: 45, avgTuition: 'AUD$34,000/yr', duration: '2 years', careers: ['Software Developer', 'Systems Architect', 'Cybersecurity Analyst', 'DevOps'] },
      { field: 'MBA', icon: '📊', universities: 30, avgTuition: 'AUD$45,000/yr', duration: '1.5 years', careers: ['Executive Manager', 'Entrepreneur', 'Business Consultant', 'Finance Director'] },
      { field: 'Marine & Environmental Science', icon: '🌊', universities: 25, avgTuition: 'AUD$30,000/yr', duration: '2 years', careers: ['Marine Biologist', 'Climate Researcher', 'Conservation Scientist', 'Environmental Consultant'] },
      { field: 'Medicine & Health Sciences', icon: '🏥', universities: 15, avgTuition: 'AUD$55,000/yr', duration: '4 years', careers: ['Doctor (GP)', 'Specialist', 'Surgeon', 'Medical Researcher'] },
      { field: 'Nursing', icon: '💊', universities: 35, avgTuition: 'AUD$25,000/yr', duration: '2 years', careers: ['Registered Nurse', 'Midwife', 'ICU Nurse', 'Nurse Practitioner'] },
    ],
    studyCosts: {
      bachelor: { range: 'AUD$20,000 – AUD$45,000/yr', notes: '3–4 year programs. Medicine and Dentistry are significantly higher. Engineering and Commerce sit in the mid-range.' },
      master: { range: 'AUD$24,000 – AUD$50,000/yr', notes: '1.5–2 year programs. Group of Eight schools on the higher end. Strong research infrastructure and industry connections.' },
      mba: { range: 'AUD$35,000 – AUD$60,000/yr', notes: 'Melbourne Business School, UNSW (AGSM), and Monash are internationally accredited and highly regarded.' },
      phd: { range: 'AUD$20,000 – AUD$42,000/yr', notes: 'RTP scholarships cover tuition + AUD$32,192 living allowance/yr. Funded spots available for international students.' },
      livingCost: 'AUD$1,500 – AUD$3,000/month',
    },
    scholarships: [
      { name: 'Australia Awards Scholarship', amount: 'Full Funding', eligibility: 'Students from developing countries in Indo-Pacific region', deadline: 'Apr–May, annually', type: 'Government', funder: 'Australian Government (DFAT)', degreeLevel: "Master's / PhD", fundingType: 'Full', applyUrl: 'https://www.australiaawards.gov.au' },
      { name: 'Research Training Program (RTP)', amount: 'Full tuition + AUD$32,192 stipend/yr', eligibility: 'Domestic & international HDR (higher degree research) students', deadline: 'Varies by university', type: 'Government', funder: 'Australian Government', degreeLevel: "PhD / Master's by Research", fundingType: 'Full', applyUrl: 'https://www.education.gov.au' },
      { name: 'University of Melbourne Graduate Award', amount: 'AUD$7,500 – AUD$10,000', eligibility: 'International graduate students based on academic merit', deadline: 'October, annually', type: 'University', funder: 'University of Melbourne', degreeLevel: "Master's", fundingType: 'Partial', applyUrl: 'https://scholarships.unimelb.edu.au' },
      { name: 'Endeavour Leadership Program', amount: 'Up to AUD$272,500', eligibility: 'High-achieving students and researchers worldwide', deadline: 'June 30, annually', type: 'Government', funder: 'Australian Government', degreeLevel: "Bachelor's / Master's / PhD", fundingType: 'Partial', applyUrl: 'https://internationaleducation.gov.au' },
    ],
    languageRequirements: [
      { university: 'Australian National University', ielts: '6.5', toefl: '80', pte: '58', duolingo: '105' },
      { university: 'University of Melbourne', ielts: '6.5', toefl: '79', pte: '58', duolingo: '102' },
      { university: 'University of Sydney', ielts: '6.5', toefl: '85', pte: '58', duolingo: '105' },
      { university: 'UNSW Sydney', ielts: '6.5', toefl: '90', pte: '64', duolingo: '110' },
      { university: 'Monash University', ielts: '6.5', toefl: '79', pte: '58', duolingo: '102' },
    ],
    langNote: 'Most Australian universities require IELTS 6.5 overall with no band below 6.0. Students from English-speaking countries or with English-medium prior qualifications are typically exempt.',
    visaSteps: [
      { step: '01', title: 'Receive CoE (Confirmation of Enrolment)', desc: 'Your Australian university issues a CoE after you accept the offer and pay the required deposit.' },
      { step: '02', title: 'Purchase OSHC', desc: 'Buy Overseas Student Health Cover (OSHC) — mandatory for the full visa duration. ~AUD$600–700/year.' },
      { step: '03', title: 'Apply for Subclass 500', desc: 'Apply online via ImmiAccount on homeaffairs.gov.au. Application fee: AUD$710.' },
      { step: '04', title: 'Provide Financial Evidence', desc: 'Show AUD$21,041/year for living expenses, plus tuition fees and travel costs in bank statements.' },
      { step: '05', title: 'Health & Character Check', desc: 'May require a medical examination and a police clearance certificate from your home country.' },
      { step: '06', title: 'Receive Visa Grant', desc: 'Average processing: 4–6 weeks. Your visa is linked electronically to your passport — no physical stamp.' },
    ],
    cities: [
      { city: 'Sydney, NSW', rent: 'AUD$2,200', food: 'AUD$500', transport: 'AUD$170', total: 'AUD$2,950' },
      { city: 'Melbourne, VIC', rent: 'AUD$1,700', food: 'AUD$450', transport: 'AUD$150', total: 'AUD$2,350' },
      { city: 'Brisbane, QLD', rent: 'AUD$1,500', food: 'AUD$420', transport: 'AUD$130', total: 'AUD$2,100' },
      { city: 'Canberra, ACT', rent: 'AUD$1,400', food: 'AUD$400', transport: 'AUD$120', total: 'AUD$2,000' },
      { city: 'Adelaide, SA', rent: 'AUD$1,100', food: 'AUD$380', transport: 'AUD$100', total: 'AUD$1,650' },
    ],
  },

  germany: {
    slug: 'germany', name: 'Germany', flag: '🇩🇪', code: 'DE',
    tagline: 'Tuition-free public universities, STEM excellence, and an 18-month job-seeker visa.',
    heroGradient: 'from-[#3D040F] via-[#690B1B] to-[#4A0612]',
    stats: [
      { label: 'Universities', value: '55+' }, { label: 'Tuition / yr', value: '€0–€3,000' },
      { label: 'Job Seeker Visa', value: '18 Months' }, { label: 'Semester Fee', value: '€200–€350' },
    ],
    whyStudyHere: [
      { icon: '💸', stat: '€0 Tuition', title: 'Free at Public Universities', desc: 'Most German public universities charge zero tuition. Pay only a semester fee of ~€250 including transport.' },
      { icon: '🏭', stat: '2,000+', title: 'Industry Partnerships', desc: 'Direct hiring pipelines with BMW, Siemens, SAP, Bosch, and Volkswagen from campus career fairs.' },
      { icon: '🛂', stat: '18 Months', title: 'Job Seeker Visa', desc: 'Stay 18 months after graduation to find work. Once employed, fast-track to permanent residency.' },
      { icon: '🌍', stat: 'Schengen', title: 'Travel 26 Countries', desc: 'German residence permit allows free travel across all 26 Schengen member states for study and leisure.' },
      { icon: '🔬', stat: '#1 EU', title: 'Engineering Research', desc: 'Germany leads Europe in mechanical engineering, automotive, and manufacturing R&D output and patents.' },
      { icon: '📈', stat: '€55K+', title: 'Avg. Engineer Starting Salary', desc: 'Strong engineering economy with excellent starting salaries, job security, and clear career progression.' },
    ],
    universities: [
      { name: 'Technical University of Munich (TUM)', location: 'Munich, Bavaria', ranking: '#37 QS', acceptance: '8%', tuition: '€0 + €135/sem', type: 'Public', programs: ['Computer Science', 'Mechanical Engineering', 'Aerospace', 'Business'], subject: 'STEM', website: 'https://tum.de' },
      { name: 'LMU Munich', location: 'Munich, Bavaria', ranking: '#54 QS', acceptance: '10%', tuition: '€0 + €148/sem', type: 'Public', programs: ['Medicine', 'Law', 'Physics', 'Business Administration'], subject: 'Multi-disciplinary', website: 'https://lmu.de' },
      { name: 'Heidelberg University', location: 'Heidelberg, B-W', ranking: '#65 QS', acceptance: '12%', tuition: '€0 + €173/sem', type: 'Public', programs: ['Medicine', 'Natural Sciences', 'Law', 'Social Sciences'], subject: 'Multi-disciplinary', website: 'https://uni-heidelberg.de' },
      { name: 'RWTH Aachen University', location: 'Aachen, NRW', ranking: '#106 QS', acceptance: '35%', tuition: '€0 + €270/sem', type: 'Public', programs: ['Mechanical Engineering', 'Electrical Engineering', 'Computer Science', 'Materials Science'], subject: 'STEM', website: 'https://rwth-aachen.de' },
      { name: 'Humboldt University Berlin', location: 'Berlin', ranking: '#120 QS', acceptance: '15%', tuition: '€0 + €314/sem', type: 'Public', programs: ['Social Sciences', 'Humanities', 'Medicine', 'Natural Sciences'], subject: 'Multi-disciplinary', website: 'https://hu-berlin.de' },
      { name: 'KIT Karlsruhe', location: 'Karlsruhe, B-W', ranking: '#119 QS', acceptance: '20%', tuition: '€0 + €170/sem', type: 'Public', programs: ['Engineering', 'Physics', 'Computer Science', 'Mathematics'], subject: 'STEM', website: 'https://kit.edu' },
    ],
    courses: [
      { field: 'Mechanical Engineering', icon: '⚙️', universities: 40, avgTuition: '€0 (+ semester fee)', duration: '2 years', careers: ['Automotive Engineer', 'Product Designer', 'Manufacturing Manager', 'R&D Engineer'] },
      { field: 'Computer Science', icon: '💻', universities: 45, avgTuition: '€0 (+ semester fee)', duration: '2 years', careers: ['Software Engineer', 'AI Developer', 'Systems Architect', 'DevOps'] },
      { field: 'Automotive Engineering', icon: '🚗', universities: 20, avgTuition: '€0 (+ semester fee)', duration: '2 years', careers: ['Vehicle Dynamics', 'Powertrain', 'Autonomous Vehicles', 'ADAS Engineer'] },
      { field: 'Data Science & AI', icon: '📈', universities: 35, avgTuition: '€0 (+ semester fee)', duration: '2 years', careers: ['ML Engineer', 'Data Analyst', 'Computer Vision', 'NLP Researcher'] },
      { field: 'Physics & Materials Science', icon: '⚛️', universities: 30, avgTuition: '€0 (+ semester fee)', duration: '2 years', careers: ['R&D Scientist', 'Materials Engineer', 'Nanotechnology', 'Research Physicist'] },
      { field: 'MBA (Private Universities)', icon: '📊', universities: 15, avgTuition: '€15,000 – €35,000/yr', duration: '1 year', careers: ['Management Consultant', 'Finance Manager', 'Entrepreneur', 'Business Development'] },
    ],
    studyCosts: {
      bachelor: { range: '€0 (public) / €5,000–€20,000 (private)', notes: 'Public universities charge only semester fees (~€250–€350), which typically include a local transit pass. World-class education at virtually zero cost.' },
      master: { range: '€0 (public) / €8,000–€30,000 (private)', notes: 'Tuition-free at all public universities. Private universities cater to international business programs. Only semester fee at public institutions.' },
      mba: { range: '€8,000 – €40,000/yr', notes: 'ESMT Berlin and Frankfurt School of Finance offer globally accredited MBAs at significantly lower cost than US/UK equivalents.' },
      phd: { range: '€0 (employment-based)', notes: 'PhD positions in Germany are typically employment contracts (wissenschaftlicher Mitarbeiter) paying €2,000–€3,000/month with full health benefits.' },
      livingCost: '€800 – €1,500/month',
    },
    scholarships: [
      { name: 'DAAD Scholarship', amount: '€934/month + travel + health', eligibility: 'International graduates and researchers worldwide applying to German institutions', deadline: 'Oct 15 – Nov 15, annually', type: 'Government', funder: 'DAAD (German Academic Exchange Service)', degreeLevel: "Master's / PhD / Postdoc", fundingType: 'Partial', applyUrl: 'https://www.daad.de/en' },
      { name: 'Deutschlandstipendium', amount: '€300/month', eligibility: 'High-achieving students enrolled at German universities — merit-based', deadline: 'May–June (varies by university)', type: 'Government', funder: 'Federal Government + Private Sponsors', degreeLevel: "Bachelor's / Master's", fundingType: 'Partial', applyUrl: 'https://www.deutschlandstipendium.de' },
      { name: 'Heinrich Böll Foundation Scholarship', amount: '€861/month + research allowance', eligibility: 'Students committed to ecology, democracy, and sustainability', deadline: 'Mar 1 / Sep 1, annually', type: 'Foundation', funder: 'Heinrich Böll Foundation', degreeLevel: "Bachelor's / Master's / PhD", fundingType: 'Partial', applyUrl: 'https://www.boell.de/en' },
      { name: 'Konrad-Adenauer-Stiftung (KAS)', amount: '€752/month + benefits', eligibility: 'Students with strong academic record and proven civic engagement', deadline: 'Jan 15 / Jul 15, annually', type: 'Foundation', funder: 'Konrad-Adenauer-Stiftung', degreeLevel: "Bachelor's / Master's / PhD", fundingType: 'Partial', applyUrl: 'https://www.kas.de/en' },
    ],
    languageRequirements: [
      { university: 'TU Munich (English programs)', ielts: '6.5', toefl: '88', pte: '62', duolingo: '110' },
      { university: 'LMU Munich', ielts: '6.5', toefl: '88', pte: '62', duolingo: '110' },
      { university: 'RWTH Aachen', ielts: '6.0', toefl: '80', pte: '54', duolingo: '100' },
      { university: 'Heidelberg University', ielts: '6.5', toefl: '90', pte: '62', duolingo: '110' },
      { university: 'KIT Karlsruhe', ielts: '6.0', toefl: '80', pte: '54', duolingo: '100' },
    ],
    langNote: 'Many English-taught master\'s programs require IELTS 6.0–6.5 or TOEFL 80–90. German-taught programs additionally require TestDaF TDN 4 or DSH-2 German proficiency certification.',
    visaSteps: [
      { step: '01', title: 'Apply to a German University', desc: 'Apply via uni-assist.de or directly to the university portal. Many top programs are fully taught in English.' },
      { step: '02', title: 'Open a Blocked Account (Sperrkonto)', desc: 'Deposit €11,208 into a Sperrkonto (Expatrio, Fintiba). This proves you have sufficient financial resources.' },
      { step: '03', title: 'Apply for National Visa (Type D)', desc: 'Book appointment at the German Embassy/Consulate in your country. Fee: €75. Apply 3–6 months early.' },
      { step: '04', title: 'Prepare Your Documents', desc: 'Admission letter, blocked account confirmation, health insurance, language certificate (if required), and passport.' },
      { step: '05', title: 'Attend the Visa Appointment', desc: 'Processing time: 4–12 weeks. Some countries have long queues — book your appointment well in advance.' },
      { step: '06', title: 'Anmeldung After Arrival', desc: 'Register at the local Einwohnermeldeamt within 14 days of arrival, then enroll at your university.' },
    ],
    cities: [
      { city: 'Munich', rent: '€1,200', food: '€320', transport: '€57', total: '€1,650' },
      { city: 'Berlin', rent: '€950', food: '€300', transport: '€86', total: '€1,400' },
      { city: 'Hamburg', rent: '€1,000', food: '€310', transport: '€83', total: '€1,450' },
      { city: 'Frankfurt', rent: '€1,100', food: '€315', transport: '€80', total: '€1,550' },
      { city: 'Aachen / Karlsruhe', rent: '€650', food: '€280', transport: '€60', total: '€1,050' },
    ],
  },
};

/* ══════════════════════════════════════════════════════════════
   SECTION NAV
══════════════════════════════════════════════════════════════ */
const SECTIONS = [
  { id: 'why', label: 'Why Study Here' },
  { id: 'universities', label: 'Universities' },
  { id: 'courses', label: 'Courses' },
  { id: 'costs', label: 'Study Costs' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'language', label: 'Language' },
  { id: 'visa', label: 'Visa Guide' },
  { id: 'living', label: 'Cost of Living' },
];

const DEGREE_TABS = ["Bachelor's", "Master's", 'MBA', 'PhD'];

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
export default function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const country = COUNTRY_DATA[slug];
  const { user } = useAuth();
  const [uniFilter, setUniFilter] = useState<'All' | 'Public' | 'Private'>('All');
  const [costsTab, setCostsTab] = useState(0);

  if (!country) notFound();

  const authTarget = user ? '/dashboard' : '/login';
  const filteredUnis = country.universities.filter(u => uniFilter === 'All' || u.type === uniFilter);
  const degCosts = [country.studyCosts.bachelor, country.studyCosts.master, country.studyCosts.mba, country.studyCosts.phd];

  return (
    <div className="bg-[#F6F4F2] text-[#111111] font-[Poppins] font-normal min-h-screen">

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 w-full bg-[#F6F4F2]/95 backdrop-blur-xl border-b border-[#E7E2DE]">
        <div className="max-w-7xl mx-auto h-[64px] sm:h-[84px] px-4 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 hover:opacity-90 transition-opacity shrink-0">
            <div className="w-[38px] h-[38px] sm:w-[46px] sm:h-[46px] rounded-[11px] sm:rounded-[14px] shadow-[0_4px_16px_rgba(105,11,27,0.2)] overflow-hidden shrink-0">
              <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[15px] sm:text-[19px] font-bold tracking-[-0.04em] text-[#111]">Abroad Simplified</div>
              <div className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-[#A3A3A3] mt-0.5">AI Admissions Platform</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/#universities" className="hidden md:flex text-[13px] sm:text-[14px] font-medium text-[#5B5B5B] hover:text-[#690B1B] transition-colors items-center gap-1.5">
              ← All Destinations
            </Link>
            <Link href={authTarget} className="h-[38px] sm:h-[46px] px-4 sm:px-7 rounded-full bg-[#690B1B] text-white text-[12px] sm:text-[14px] font-bold hover:bg-[#7A1022] transition-all shadow-[0_6px_20px_rgba(105,11,27,0.22)] flex items-center gap-1.5 shrink-0">
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative bg-[#FAF8F5] pt-6 sm:pt-12 pb-10 sm:pb-16 overflow-hidden border-b border-[#EAE5DF]">

        {/* Ambient background lighting and geometric grid */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#690B1B]/5 via-[#C9A55D]/10 to-transparent blur-[80px] sm:blur-[120px]" />
          <div className="absolute -bottom-20 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[#690B1B]/5 blur-[80px] sm:blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#690B1B 1px, transparent 1px), linear-gradient(to right, #690B1B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] text-[#888] mb-6 sm:mb-8 font-medium overflow-x-auto scrollbar-hide py-1">
            <Link href="/" className="hover:text-[#690B1B] transition-colors shrink-0">Home</Link>
            <span className="text-[#CCC] shrink-0">/</span>
            <Link href="/#universities" className="hover:text-[#690B1B] transition-colors shrink-0">Destinations</Link>
            <span className="text-[#CCC] shrink-0">/</span>
            <span className="text-[#690B1B] font-semibold shrink-0">{country.name}</span>
          </div>

          {/* Main Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center mb-8 sm:mb-12">

            {/* Left Column - 7 Cols */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-white border border-[#E7E2DE] shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 mb-5 sm:mb-6 max-w-full">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#690B1B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#690B1B]"></span>
                </span>
                <span className="text-[11px] sm:text-[12px] font-bold text-[#690B1B] tracking-[0.03em] sm:tracking-[0.05em] uppercase truncate">2026 Student Admissions Open</span>
                <span className="text-[10px] sm:text-[11px] bg-[#F7F0F1] text-[#690B1B] font-bold px-2 py-0.5 rounded-full shrink-0">{country.code}</span>
              </div>

              {/* Title */}
              <h1 className="text-[32px] sm:text-[52px] md:text-[60px] font-bold text-[#111111] tracking-[-0.04em] leading-[1.08] mb-4 sm:mb-6">
                Study in{' '}
                <span className="bg-gradient-to-r from-[#690B1B] via-[#8B1020] to-[#C9A55D] bg-clip-text text-transparent">
                  {country.name}
                </span>{' '}
                <span className="inline-block text-[34px] sm:text-[50px] align-middle">{country.flag}</span>
              </h1>

              {/* Tagline */}
              <p className="text-[14px] sm:text-[17px] text-[#555555] leading-relaxed max-w-[580px] mb-6 sm:mb-8">
                {country.tagline} Discover top universities, scholarship programs, visa guidelines, and post-study career opportunities.
              </p>

              {/* CTAs & Quick Info */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Link
                  href={authTarget}
                  className="h-[48px] sm:h-[52px] px-6 sm:px-8 rounded-[14px] bg-[#690B1B] text-white text-[14px] sm:text-[15px] font-bold hover:bg-[#7A1022] hover:shadow-[0_10px_25px_rgba(105,11,27,0.25)] transition-all duration-200 flex items-center justify-center gap-2 group w-full sm:w-auto"
                >
                  Apply Now Free
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <a
                  href="#universities"
                  className="h-[48px] sm:h-[52px] px-6 sm:px-7 rounded-[14px] bg-white border border-[#E0DCD7] text-[#333333] text-[14px] sm:text-[15px] font-semibold hover:border-[#690B1B] hover:text-[#690B1B] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Explore Top Universities
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-5 sm:pt-6 border-t border-[#EAE5DF] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#690B1B] flex items-center justify-center text-white ring-2 ring-white">
                      <CategoryIcon name="grad" className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-white ring-2 ring-white">
                      <CategoryIcon name="globe" className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#C9A55D] flex items-center justify-center text-white ring-2 ring-white">
                      <CategoryIcon name="trophy" className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#111]">10,000+ Students Placed</div>
                    <div className="text-[11px] text-[#777]">98.4% Visa Success Rate</div>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-[#E5E0D9] hidden sm:block" />
                <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-[#444]">
                  <span className="text-[#C9A55D]">★★★★★</span>
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Right Column - 5 Cols (Interactive Card Visual) */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              {/* Main Feature Showcase Card */}
              <div className="bg-white border border-[#E5E0D9] rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-10 backdrop-blur-md">
                
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-[#F0ECE7]">
                  <div className="flex items-center gap-3">
                    <span className="text-[26px] sm:text-[32px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-xl border border-[#E8C4CC] shrink-0">{country.code}</span>
                    <div>
                      <h2 className="text-[16px] sm:text-[18px] font-bold text-[#111]">{country.name} Overview</h2>
                      <p className="text-[11px] sm:text-[12px] text-[#777]">Destination Snapshot</p>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#F7F0F1] text-[#690B1B] px-2.5 sm:px-3 py-1 rounded-full border border-[#E8C4CC] shrink-0">
                    Verified
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 my-4 sm:my-5">
                  <div className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[12px] sm:rounded-[14px] p-3 sm:p-3.5">
                    <div className="text-[10px] sm:text-[11px] text-[#888] uppercase tracking-wider font-semibold">Institutions</div>
                    <div className="text-[18px] sm:text-[20px] font-bold text-[#690B1B] mt-0.5">{country.stats[0]?.value || '100+'}</div>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[12px] sm:rounded-[14px] p-3 sm:p-3.5">
                    <div className="text-[10px] sm:text-[11px] text-[#888] uppercase tracking-wider font-semibold">Avg Tuition</div>
                    <div className="text-[18px] sm:text-[20px] font-bold text-[#111] mt-0.5">{country.stats[1]?.value || '$20k'}</div>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[12px] sm:rounded-[14px] p-3 sm:p-3.5">
                    <div className="text-[10px] sm:text-[11px] text-[#888] uppercase tracking-wider font-semibold">Work Permit</div>
                    <div className="text-[18px] sm:text-[20px] font-bold text-[#111] mt-0.5">{country.stats[3]?.value || '2-3 Yrs'}</div>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[12px] sm:rounded-[14px] p-3 sm:p-3.5">
                    <div className="text-[10px] sm:text-[11px] text-[#888] uppercase tracking-wider font-semibold">Visa Approval</div>
                    <div className="text-[18px] sm:text-[20px] font-bold text-[#2E7D32] mt-0.5">{country.stats[2]?.value || '90%'}</div>
                  </div>
                </div>

                {/* Card Feature Callout */}
                <div className="bg-gradient-to-r from-[#690B1B] to-[#8B1020] text-white rounded-[14px] sm:rounded-[16px] p-3.5 sm:p-4 flex items-center justify-between gap-2 shadow-md">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                      <CategoryIcon name="light" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] sm:text-[13px] font-bold truncate">Free AI Chance Estimator</div>
                      <div className="text-[10px] sm:text-[11px] text-white/80 truncate">Check your admission odds</div>
                    </div>
                  </div>
                  <Link href={authTarget} className="text-[11px] sm:text-[12px] font-bold bg-white text-[#690B1B] px-3 sm:px-3.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] transition-colors shrink-0">
                    Check
                  </Link>
                </div>
              </div>

              {/* Floating Badge 1 (Top Right) */}
              <div className="absolute -top-3 -right-3 bg-white border border-[#E2DDD7] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-lg flex items-center gap-2.5 z-20 hidden md:flex">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFF8E6] text-[#E65100] flex items-center justify-center shrink-0">
                  <CategoryIcon name="trophy" className="w-4 h-4 sm:w-5 sm:h-5 text-[#E65100]" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-[12px] font-bold text-[#111]">Global Top Universities</div>
                  <div className="text-[10px] text-[#777]">QS World Rankings</div>
                </div>
              </div>

              {/* Floating Badge 2 (Bottom Left) */}
              <div className="absolute -bottom-4 -left-3 bg-white border border-[#E2DDD7] rounded-[14px] sm:rounded-[16px] px-3.5 py-2 shadow-lg flex items-center gap-2 z-20 hidden md:flex">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] shrink-0"></span>
                <span className="text-[11px] sm:text-[12px] font-bold text-[#111]">Scholarships Available</span>
              </div>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-4 border-t border-[#EAE5DF]">
            {country.stats.map((s, i) => (
              <div key={i} className="bg-white border border-[#E8E3DD] rounded-[14px] sm:rounded-[16px] p-3.5 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 transition-colors">
                <div className="text-[18px] sm:text-[22px] md:text-[26px] font-bold text-[#690B1B] leading-tight mb-1">{s.value}</div>
                <div className="text-[10px] sm:text-[12px] text-[#666666] font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ══ STICKY SECTION NAV ══════════════════════════════════════ */}
      <div className="sticky top-[64px] sm:top-[84px] z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E2DE] overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 h-[44px] sm:h-[48px] px-3.5 sm:px-5 flex items-center text-[12px] sm:text-[13px] font-semibold text-[#666] hover:text-[#690B1B] border-b-2 border-transparent hover:border-[#690B1B] transition-all whitespace-nowrap"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* ══ WHY STUDY HERE ══════════════════════════════════════════ */}
      <section id="why" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F6F4F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Why {country.name}?</div>
          <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-6 sm:mb-10">
            Top reasons to choose {country.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {country.whyStudyHere.map((item, i) => (
              <div key={i} className="bg-white border border-[#E7E2DE] rounded-[16px] p-5 sm:p-7 hover:border-[#690B1B]/40 hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className="flex items-start gap-3.5 sm:gap-4 mb-4 sm:mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F7F0F1] text-[#690B1B] border border-[#E8C4CC] flex items-center justify-center shrink-0 shadow-sm">
                    <CategoryIcon name={item.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-[20px] sm:text-[26px] font-bold text-[#690B1B] leading-tight">{item.stat}</div>
                </div>
                <h3 className="text-[15px] sm:text-[17px] font-bold text-[#111] mb-1.5 sm:mb-2">{item.title}</h3>
                <p className="text-[12px] sm:text-[13px] text-[#777] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TOP UNIVERSITIES ════════════════════════════════════════ */}
      <section id="universities" className="px-4 sm:px-8 py-10 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Top Institutions</div>
              <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111]">
                Top Universities in {country.name}
              </h2>
            </div>
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide shrink-0">
              {(['All', 'Public', 'Private'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setUniFilter(f)}
                  className={`h-[36px] px-4 sm:px-5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all border shrink-0 ${
                    uniFilter === f
                      ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-sm'
                      : 'bg-white text-[#555] border-[#E7E2DE] hover:border-[#690B1B]/40'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredUnis.length === 0 ? (
            <div className="text-center py-12 text-[#999] text-[14px]">No {uniFilter.toLowerCase()} universities listed for {country.name}.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredUnis.map((uni) => (
                <div key={uni.name} className="bg-[#F7F5F3] border border-[#E7E2DE] rounded-[16px] p-5 sm:p-6 hover:border-[#690B1B]/40 hover:shadow-md transition-all flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] rounded-[12px] bg-white border border-[#E7E2DE] flex items-center justify-center text-[#690B1B] shrink-0 shadow-sm">
                      <CategoryIcon name="grad" className="w-5 h-5 sm:w-6 sm:h-6 text-[#690B1B]" />
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-2.5 py-1 rounded-full border border-[#E8C4CC]/50">{uni.ranking}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${uni.type === 'Public' ? 'bg-[#EFF5FF] text-[#1565C0]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>{uni.type}</span>
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold text-[#111] mb-1 leading-snug">{uni.name}</h3>
                  <div className="text-[12px] text-[#888] mb-3.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#690B1B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{uni.location}</span>
                  </div>

                  {/* Stats grid (2 cols) */}
                  <div className="grid grid-cols-2 gap-2 mb-3.5">
                    <div className="bg-white rounded-[10px] px-3 py-2 text-center border border-[#E7E2DE]">
                      <div className="font-bold text-[#111] text-[12px]">{uni.acceptance}</div>
                      <div className="text-[#999] text-[10px] mt-0.5">Acceptance</div>
                    </div>
                    <div className="bg-white rounded-[10px] px-3 py-2 text-center border border-[#E7E2DE]">
                      <div className="font-bold text-[#111] text-[11px] leading-tight truncate">{uni.tuition}</div>
                      <div className="text-[#999] text-[10px] mt-0.5">Tuition</div>
                    </div>
                  </div>

                  {/* Popular Programs */}
                  <div className="mb-4">
                    <div className="text-[10px] text-[#999] uppercase tracking-[0.1em] font-semibold mb-1.5">Popular Programs</div>
                    <div className="flex flex-wrap gap-1.5">
                      {uni.programs.slice(0, 3).map((p) => (
                        <span key={p} className="text-[11px] bg-white border border-[#E7E2DE] text-[#444] px-2 py-0.5 rounded-full">{p}</span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-1">
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-[38px] rounded-[10px] border border-[#690B1B] text-[#690B1B] text-[13px] font-semibold hover:bg-[#690B1B] hover:text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      View University ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ POPULAR COURSES ═════════════════════════════════════════ */}
      <section id="courses" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F7F5F3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Academic Opportunities</div>
          <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-6 sm:mb-10">
            Popular Courses in {country.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {country.courses.map((c, i) => (
              <div key={c.field} className="bg-white border border-[#E7E2DE] rounded-[16px] p-5 sm:p-6 hover:border-[#690B1B]/40 hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F7F0F1] text-[#690B1B] border border-[#E8C4CC] flex items-center justify-center shrink-0">
                    <CategoryIcon name={c.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-[#D8C1C6] text-[13px] font-bold">0{i + 1}</span>
                </div>
                <h3 className="text-[15px] sm:text-[17px] font-bold text-[#111] mb-3 sm:mb-4 leading-snug">{c.field}</h3>
                <div className="grid grid-cols-2 gap-2 mb-3.5">
                  <div className="bg-[#F6F4F2] rounded-[10px] p-2.5 sm:p-3">
                    <div className="text-[10px] text-[#999] uppercase tracking-[0.08em] font-semibold mb-0.5">Universities</div>
                    <div className="text-[15px] sm:text-[16px] font-bold text-[#690B1B]">{c.universities}</div>
                  </div>
                  <div className="bg-[#F6F4F2] rounded-[10px] p-2.5 sm:p-3">
                    <div className="text-[10px] text-[#999] uppercase tracking-[0.08em] font-semibold mb-0.5">Duration</div>
                    <div className="text-[12px] sm:text-[13px] font-bold text-[#111]">{c.duration}</div>
                  </div>
                  <div className="bg-[#F6F4F2] rounded-[10px] p-2.5 sm:p-3 col-span-2">
                    <div className="text-[10px] text-[#999] uppercase tracking-[0.08em] font-semibold mb-0.5">Avg. Tuition</div>
                    <div className="text-[12px] sm:text-[13px] font-bold text-[#111]">{c.avgTuition}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#999] uppercase tracking-[0.08em] font-semibold mb-1.5">Career Paths</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.careers.map((career) => (
                      <span key={career} className="text-[11px] bg-[#F7F0F1] text-[#690B1B] px-2 py-0.5 rounded-full font-medium">{career}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STUDY COSTS ═════════════════════════════════════════════ */}
      <section id="costs" className="px-4 sm:px-8 py-10 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Financial Planning</div>
          <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-2">
            Study Costs in {country.name}
          </h2>
          <p className="text-[#727272] text-[13px] sm:text-[14px] mb-6 sm:mb-8">Get the full financial picture before you apply. Select your degree level below.</p>

          {/* Degree Tabs (scrollable on mobile) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6 sm:mb-8">
            {DEGREE_TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setCostsTab(i)}
                className={`h-[38px] sm:h-[40px] px-5 sm:px-6 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all border shrink-0 ${
                  costsTab === i
                    ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-sm'
                    : 'bg-white text-[#555] border-[#E7E2DE] hover:border-[#690B1B]/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {/* Tuition Card */}
            <div className="bg-[#F7F5F3] border border-[#E7E2DE] rounded-[16px] p-5 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#F7F0F1] text-[#690B1B] border border-[#E8C4CC] flex items-center justify-center shrink-0">
                  <CategoryIcon name="grad" className="w-4 h-4" />
                </div>
                <div className="text-[11px] text-[#999] uppercase tracking-[0.1em] font-semibold">{DEGREE_TABS[costsTab]} — Tuition Range</div>
              </div>
              <div className="text-[20px] sm:text-[28px] font-bold text-[#690B1B] mb-3 sm:mb-4 leading-snug">{degCosts[costsTab].range}</div>
              <p className="text-[13px] sm:text-[14px] text-[#666] leading-relaxed">{degCosts[costsTab].notes}</p>
            </div>

            {/* Living Cost Card with top 3 city breakdown */}
            <div className="bg-[#F7F5F3] border border-[#E7E2DE] rounded-[16px] p-5 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#F7F0F1] text-[#690B1B] border border-[#E8C4CC] flex items-center justify-center shrink-0">
                  <CategoryIcon name="city" className="w-4 h-4" />
                </div>
                <div className="text-[11px] text-[#999] uppercase tracking-[0.1em] font-semibold">Monthly Living Cost</div>
              </div>
              <div className="text-[20px] sm:text-[28px] font-bold text-[#111] mb-4 sm:mb-5">{country.studyCosts.livingCost}</div>
              <div className="space-y-2.5 sm:space-y-3">
                {country.cities.slice(0, 3).map((c) => (
                  <div key={c.city} className="flex justify-between items-center py-1.5 sm:py-2 border-b border-[#E7E2DE] last:border-b-0">
                    <span className="text-[12px] sm:text-[13px] text-[#555] font-medium">{c.city}</span>
                    <span className="text-[12px] sm:text-[13px] font-bold text-[#690B1B]">{c.total}/mo</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SCHOLARSHIPS ════════════════════════════════════════════ */}
      <section id="scholarships" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F7F5F3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Funding Your Education</div>
          <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-6 sm:mb-10">
            Scholarships for {country.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {country.scholarships.map((s) => (
              <div key={s.name} className="bg-white border border-[#E7E2DE] rounded-[16px] p-5 sm:p-6 hover:border-[#690B1B]/40 hover:shadow-md transition-all flex flex-col">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3.5">
                  <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full ${s.fundingType === 'Full' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
                    {s.fundingType === 'Full' ? '✓ Fully Funded' : '◐ Partially Funded'}
                  </span>
                  <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    s.type === 'Government' ? 'bg-[#EFF5FF] text-[#1565C0]' :
                    s.type === 'University' ? 'bg-[#F3E5F5] text-[#6A1B9A]' :
                    s.type === 'Foundation' ? 'bg-[#FFF8E6] text-[#E65100]' :
                    'bg-[#F7F0F1] text-[#690B1B]'
                  }`}>{s.type}</span>
                  <span className="text-[10px] font-medium text-[#888] bg-[#F6F4F2] px-2.5 py-1 rounded-full ml-auto">{s.degreeLevel}</span>
                </div>

                <h3 className="text-[15px] sm:text-[17px] font-bold text-[#111] mb-1">{s.name}</h3>
                <div className="text-[11px] sm:text-[12px] text-[#999] mb-3">{s.funder}</div>

                <div className="bg-[#F7F0F1] rounded-[10px] px-3.5 py-2.5 mb-3.5">
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#690B1B]">{s.amount}</span>
                </div>

                <p className="text-[12px] sm:text-[13px] text-[#666] leading-relaxed flex-1 mb-4">{s.eligibility}</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto pt-3 border-t border-[#F0EDED]">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[#999]">
                    <CategoryIcon name="calendar" className="w-4 h-4 text-[#999] shrink-0" />
                    <span>Deadline: <strong className="text-[#555]">{s.deadline}</strong></span>
                  </div>
                  <a
                    href={s.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[36px] sm:h-[34px] px-5 rounded-[8px] bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#7A1022] transition-all flex items-center justify-center gap-1.5 shadow-sm w-full sm:w-auto"
                  >
                    Apply ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LANGUAGE REQUIREMENTS ═══════════════════════════════════ */}
      <section id="language" className="px-4 sm:px-8 py-10 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">English Proficiency</div>
          <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-2 sm:mb-3">
            Language Requirements
          </h2>
          <p className="text-[#727272] text-[13px] sm:text-[14px] mb-6 sm:mb-8 max-w-[640px]">{country.langNote}</p>

          <div className="flex items-center gap-1.5 text-[11px] text-[#888] font-semibold mb-2 sm:hidden">
            <span>← Scroll table horizontally to view test scores →</span>
          </div>

          <div className="overflow-x-auto rounded-[16px] border border-[#E7E2DE] mb-5 scrollbar-hide shadow-2xs">
            <table className="w-full text-[12px] sm:text-[14px] min-w-[500px]">
              <thead>
                <tr className="bg-[#F7F5F3] border-b border-[#E7E2DE]">
                  {['University', 'IELTS', 'TOEFL iBT', 'PTE', 'Duolingo'].map((h, i) => (
                    <th key={h} className={`py-3.5 font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.08em] text-[#444] ${i === 0 ? 'text-left px-4 sm:px-5' : 'text-center px-3 sm:px-4'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {country.languageRequirements.map((row, i) => (
                  <tr key={row.university} className={`hover:bg-[#FAF8F8] transition-colors ${i < country.languageRequirements.length - 1 ? 'border-b border-[#F0EDED]' : ''}`}>
                    <td className="px-4 sm:px-5 py-3.5 font-semibold text-[#111]">{row.university}</td>
                    <td className="px-3 sm:px-4 py-3.5 text-center font-bold text-[#690B1B]">{row.ielts}</td>
                    <td className="px-3 sm:px-4 py-3.5 text-center text-[#555]">{row.toefl}</td>
                    <td className="px-3 sm:px-4 py-3.5 text-center text-[#555]">{row.pte}</td>
                    <td className="px-3 sm:px-4 py-3.5 text-center text-[#555]">{row.duolingo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exemption note */}
          <div className="p-4 sm:p-5 bg-[#F7F0F1] rounded-[14px] border border-[#E8C4CC]">
            <p className="text-[12px] sm:text-[13px] text-[#690B1B] leading-relaxed flex items-start sm:items-center gap-2">
              <CategoryIcon name="light" className="w-4 h-4 sm:w-5 sm:h-5 text-[#690B1B] shrink-0 mt-0.5 sm:mt-0" />
              <span><strong>Exemption Notice:</strong> Many universities waive English language requirements for students who completed prior education entirely in English, or for citizens of recognized English-speaking countries (e.g., USA, UK, Canada, Australia, New Zealand). Always confirm directly with each university and program.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ══ VISA GUIDE (dark) ════════════════════════════════════════ */}
      <section id="visa" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#111217]">
        <div className="max-w-7xl mx-auto">
          <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Immigration Guide</div>
          <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-white mb-6 sm:mb-10">
            Student Visa — Step by Step
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {country.visaSteps.map((step, i) => (
              <div
                key={step.step}
                className={`rounded-[16px] p-5 sm:p-6 border transition-all ${
                  i === 0
                    ? 'bg-[#690B1B] border-[#690B1B]'
                    : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <div className={`text-[28px] sm:text-[34px] font-bold mb-3 sm:mb-4 leading-none ${i === 0 ? 'text-white/20' : 'text-white/10'}`}>{step.step}</div>
                <h3 className="text-[15px] sm:text-[16px] font-bold text-white mb-1.5 sm:mb-2">{step.title}</h3>
                <p className={`text-[12px] sm:text-[13px] leading-relaxed ${i === 0 ? 'text-white/75' : 'text-[#6E7380]'}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COST OF LIVING ══════════════════════════════════════════ */}
      <section id="living" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F7F5F3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Living Costs</div>
          <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-2 sm:mb-3">
            Cost of Living by City
          </h2>
          <p className="text-[#727272] text-[13px] sm:text-[14px] mb-6 sm:mb-8">Monthly estimates in local currency. Actual costs vary with lifestyle and accommodation choices.</p>
          
          <div className="flex items-center gap-1.5 text-[11px] text-[#888] font-semibold mb-2 sm:hidden">
            <span>← Scroll table horizontally to view all cities →</span>
          </div>

          <div className="overflow-x-auto rounded-[16px] border border-[#E7E2DE] scrollbar-hide shadow-2xs">
            <table className="w-full text-[12px] sm:text-[14px] min-w-[500px]">
              <thead>
                <tr className="bg-white border-b border-[#E7E2DE]">
                  {[{ h: 'City', center: false }, { h: 'Rent', center: true }, { h: 'Food', center: true }, { h: 'Transport', center: true }, { h: 'Total / Month', center: true }].map(({ h, center }) => (
                    <th key={h} className={`py-3.5 font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.08em] ${center ? `text-center px-3 sm:px-4 ${h === 'Total / Month' ? 'text-[#690B1B]' : 'text-[#444]'}` : 'text-left px-4 sm:px-5 text-[#444]'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {country.cities.map((c, i) => (
                  <tr key={c.city} className={`hover:bg-[#FAF8F8] transition-colors ${i < country.cities.length - 1 ? 'border-b border-[#F0EDED]' : ''}`}>
                    <td className="px-4 sm:px-5 py-3.5 font-semibold text-[#111]">{c.city}</td>
                    <td className="px-3 sm:px-4 py-3.5 text-center text-[#555]">{c.rent}</td>
                    <td className="px-3 sm:px-4 py-3.5 text-center text-[#555]">{c.food}</td>
                    <td className="px-3 sm:px-4 py-3.5 text-center text-[#555]">{c.transport}</td>
                    <td className="px-3 sm:px-4 py-3.5 text-center font-bold text-[#690B1B]">{c.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════ */}
      <section className="bg-[#73061C] px-4 sm:px-8 py-12 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] uppercase font-bold mb-3 sm:mb-5">Ready to Begin?</div>
          <h2 className="text-white font-bold tracking-[-0.05em] leading-[1.08] text-[26px] sm:text-[46px] md:text-[56px] mb-4 sm:mb-6">
            Start your journey to{' '}
            <span className="text-[#C8A15D] italic">{country.name}</span>
          </h2>
          <p className="text-[#D6AEB7] text-[13px] sm:text-[16px] leading-[1.8] sm:leading-[1.9] max-w-[580px] mx-auto mb-8 sm:mb-10">
            Use our AI Chance-Me predictor, build your university shortlist, find scholarships, and get your SOP reviewed — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={authTarget}
              className="h-[48px] sm:h-[58px] px-7 sm:px-10 rounded-[14px] bg-white text-[#5B0819] text-[14px] sm:text-[17px] font-bold hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg w-full sm:w-auto"
            >
              Get Started Free →
            </Link>
            <Link
              href="/#universities"
              className="h-[48px] sm:h-[58px] px-7 sm:px-10 rounded-[14px] border border-white/20 text-white text-[14px] sm:text-[17px] font-semibold hover:bg-white/10 transition-all flex items-center justify-center w-full sm:w-auto"
            >
              ← Other Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="bg-[#030303] px-4 sm:px-8 py-10 text-center">
        <Link href="/" className="text-white text-[18px] sm:text-[20px] font-bold hover:opacity-80 transition-opacity">
          Abroad Simplified
        </Link>
        <p className="mt-2.5 text-[#5E6168] text-[12px] sm:text-[13px]">© 2026 Abroad Simplified. All rights reserved.</p>
      </footer>
    </div>
  );
}
