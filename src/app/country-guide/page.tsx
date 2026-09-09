'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Search,
  ArrowRight,
  Sparkles,
  ChevronDown,
  DollarSign,
  Briefcase,
  GraduationCap,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  FileCheck2,
  BookOpen,
  Award,
  Layers,
  Landmark,
  CheckCircle2,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { COUNTRY_GUIDES, CountryGuideData } from '@/data/countryGuides';
import { useAuth } from '@/context/AuthContext';

// ─── ALL 50 COUNTRIES DIRECTORY ──────────────────────────────────────────────

interface CountryEntry {
  slug: string;
  name: string;
  flag: string;
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Other';
  tuition: string;
  living: string;
  visa: string;
  psw: string;
  work: string;
  featured?: boolean;
}

const ALL_50_COUNTRIES: CountryEntry[] = [
  // Top 6 Featured
  {
    slug: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    region: 'North America',
    tuition: '$20,000–$55,000 / yr',
    living: '$1,000–$2,500 / mo',
    visa: 'F-1 Student Visa',
    psw: '1–3 Yrs (STEM OPT)',
    work: '20 hrs/wk on-campus',
    featured: true,
  },
  {
    slug: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    tuition: '£12,000–£35,000 / yr',
    living: '£1,000–£1,600 / mo',
    visa: 'Student Visa (Tier 4)',
    psw: '2 Yrs (Graduate Route)',
    work: '20 hrs/wk term-time',
    featured: true,
  },
  {
    slug: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    region: 'North America',
    tuition: 'CAD $18,000–$40,000 / yr',
    living: 'CAD $1,200–$2,200 / mo',
    visa: 'Study Permit + TRV',
    psw: 'Up to 3 Yrs (PGWP)',
    work: '20 hrs/wk off-campus',
    featured: true,
  },
  {
    slug: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Europe',
    tuition: '€0 (Tuition-Free Public)',
    living: '€850–€1,350 / mo',
    visa: 'National Visa Type D',
    psw: '18 Months Job Seeker',
    work: '140 full days / yr',
    featured: true,
  },
  {
    slug: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Asia-Pacific',
    tuition: 'AUD $25,000–$45,000 / yr',
    living: 'AUD $1,400–$2,500 / mo',
    visa: 'Subclass 500 Visa',
    psw: '2–4 Yrs (Subclass 485)',
    work: '48 hrs / fortnight',
    featured: true,
  },
  {
    slug: 'ireland',
    name: 'Ireland',
    flag: '🇮🇪',
    region: 'Europe',
    tuition: '€10,000–€25,000 / yr',
    living: '€800–€1,500 / mo',
    visa: 'Stamp 2 Study Visa',
    psw: '2 Yrs (Stamp 1G)',
    work: '20 hrs/wk (40 in hol)',
    featured: true,
  },

  // Europe
  { slug: 'france', name: 'France', flag: '🇫🇷', region: 'Europe', tuition: '€2,770–€15,000 / yr', living: '€700–€1,400 / mo', visa: 'VLS-TS Long-Stay', psw: '2 Yrs (RECE/APS)', work: '20 hrs/wk' },
  { slug: 'netherlands', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', tuition: '€8,000–€20,000 / yr', living: '€900–€1,600 / mo', visa: 'VVR Residence Permit', psw: '1 Yr (Zoekjaar)', work: '16 hrs/wk' },
  { slug: 'italy', name: 'Italy', flag: '🇮🇹', region: 'Europe', tuition: '€1,000–€4,000 / yr', living: '€600–€1,200 / mo', visa: 'Type D National', psw: '12 Months Job Search', work: '20 hrs/wk' },
  { slug: 'spain', name: 'Spain', flag: '🇪🇸', region: 'Europe', tuition: '€1,500–€8,000 / yr', living: '€650–€1,100 / mo', visa: 'Type D Student', psw: '1 Yr Job Search', work: '30 hrs/wk' },
  { slug: 'switzerland', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', tuition: 'CHF 1,000–€4,000 / yr', living: 'CHF 1,500–2,500 / mo', visa: 'Swiss Study Visa', psw: '6 Months Job Search', work: '15 hrs/wk' },
  { slug: 'sweden', name: 'Sweden', flag: '🇸🇪', region: 'Europe', tuition: 'SEK 80,000–140,000 / yr', living: 'SEK 9,000–14,000 / mo', visa: 'Residence Permit', psw: '1 Yr Job Search', work: 'No hourly limit' },
  { slug: 'denmark', name: 'Denmark', flag: '🇩🇰', region: 'Europe', tuition: '€6,000–€16,000 / yr', living: 'DKK 6,500–10,000 / mo', visa: 'ST1 Residence', psw: '3 Yrs Establishment', work: '20 hrs/wk' },
  { slug: 'norway', name: 'Norway', flag: '🇳🇴', region: 'Europe', tuition: 'NOK 130,000–250,000 / yr', living: 'NOK 11,000–15,000 / mo', visa: 'Study Permit', psw: '1 Yr Job Search', work: '20 hrs/wk' },
  { slug: 'finland', name: 'Finland', flag: '🇫🇮', region: 'Europe', tuition: '€6,000–€18,000 / yr', living: '€700–€1,200 / mo', visa: 'Continuous Permit A', psw: '2 Yrs Job Search', work: '30 hrs/wk' },
  { slug: 'austria', name: 'Austria', flag: '🇦🇹', region: 'Europe', tuition: '€1,500 / yr (Public)', living: '€850–€1,300 / mo', visa: 'Aufenthaltsbewilligung', psw: '12 Months Search', work: '20 hrs/wk' },
  { slug: 'belgium', name: 'Belgium', flag: '🇧🇪', region: 'Europe', tuition: '€1,000–€6,000 / yr', living: '€850–€1,300 / mo', visa: 'Type D Visa', psw: '12 Months Search', work: '20 hrs/wk' },
  { slug: 'poland', name: 'Poland', flag: '🇵🇱', region: 'Europe', tuition: '€2,000–€5,000 / yr', living: '€450–€800 / mo', visa: 'National D Visa', psw: '9 Months Search', work: 'Full-time permitted' },
  { slug: 'portugal', name: 'Portugal', flag: '🇵🇹', region: 'Europe', tuition: '€1,500–€6,000 / yr', living: '€600–€1,000 / mo', visa: 'D4 Study Visa', psw: '1 Yr Job Search', work: '20 hrs/wk' },
  { slug: 'czech-republic', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe', tuition: '€2,000–€8,000 / yr', living: '€500–€900 / mo', visa: 'Long-Stay D Visa', psw: '9 Months Search', work: 'No hourly limit' },
  { slug: 'hungary', name: 'Hungary', flag: '🇭🇺', region: 'Europe', tuition: '€2,500–€7,000 / yr', living: '€450–€750 / mo', visa: 'Study Residence', psw: '9 Months Search', work: '24 hrs/wk' },
  { slug: 'greece', name: 'Greece', flag: '🇬🇷', region: 'Europe', tuition: '€1,500–€6,000 / yr', living: '€500–€850 / mo', visa: 'Type D National', psw: 'Job Search Route', work: '20 hrs/wk' },
  { slug: 'cyprus', name: 'Cyprus', flag: '🇨🇾', region: 'Europe', tuition: '€3,000–€8,000 / yr', living: '€500–€800 / mo', visa: 'Entry Permit', psw: 'Employment Permit', work: '20 hrs/wk' },
  { slug: 'lithuania', name: 'Lithuania', flag: '🇱🇹', region: 'Europe', tuition: '€2,000–€6,000 / yr', living: '€450–€750 / mo', visa: 'National D Visa', psw: '12 Months Search', work: '20 hrs/wk' },
  { slug: 'latvia', name: 'Latvia', flag: '🇱🇻', region: 'Europe', tuition: '€2,500–€6,000 / yr', living: '€450–€750 / mo', visa: 'Residence Permit', psw: '9 Months Search', work: '20 hrs/wk' },
  { slug: 'estonia', name: 'Estonia', flag: '🇪🇪', region: 'Europe', tuition: '€3,000–€8,000 / yr', living: '€500–€850 / mo', visa: 'D-Visa / TRP', psw: '9 Months Search', work: 'No hourly limit' },
  { slug: 'malta', name: 'Malta', flag: '🇲🇹', region: 'Europe', tuition: '€4,000–€10,000 / yr', living: '€650–€1,000 / mo', visa: 'National D Visa', psw: '6 Months Search', work: '20 hrs/wk' },
  { slug: 'iceland', name: 'Iceland', flag: '🇮🇸', region: 'Europe', tuition: 'ISK 75,000 / yr (Reg)', living: 'ISK 180,000 / mo', visa: 'Residence Permit', psw: '6 Months Search', work: '15 hrs/wk' },
  { slug: 'luxembourg', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe', tuition: '€400–€1,600 / yr', living: '€1,000–€1,600 / mo', visa: 'Temporary Authorisation', psw: '9 Months Search', work: '15 hrs/wk' },

  // Asia-Pacific
  { slug: 'singapore', name: 'Singapore', flag: '🇸🇬', region: 'Asia-Pacific', tuition: 'SGD $18,000–$42,000 / yr', living: 'SGD $1,200–$2,500 / mo', visa: 'Student Pass (STP)', psw: '1 Yr LTVP / 3-Yr Bond', work: '16 hrs/wk' },
  { slug: 'new-zealand', name: 'New Zealand', flag: '🇳🇿', region: 'Asia-Pacific', tuition: 'NZD $22,000–$38,000 / yr', living: 'NZD $1,250–$2,000 / mo', visa: 'Fee Paying Visa', psw: 'Up to 3 Yrs (PSWV)', work: '20 hrs/wk' },
  { slug: 'japan', name: 'Japan', flag: '🇯🇵', region: 'Asia-Pacific', tuition: '¥535,800–¥900,000 / yr', living: '¥80,000–¥140,000 / mo', visa: 'Student Residence', psw: '1–2 Yrs Designated', work: '28 hrs/wk' },
  { slug: 'south-korea', name: 'South Korea', flag: '🇰🇷', region: 'Asia-Pacific', tuition: 'KRW 4M–9M / yr', living: 'KRW 700k–1.2M / mo', visa: 'D-2 Student Visa', psw: 'Up to 2 Yrs (D-10)', work: '20–25 hrs/wk' },
  { slug: 'hong-kong', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia-Pacific', tuition: 'HKD $140,000–$180,000 / yr', living: 'HKD $6,000–$12,000 / mo', visa: 'Student Visa', psw: '2 Yrs (IANG Scheme)', work: 'On-campus study' },
  { slug: 'china', name: 'China', flag: '🇨🇳', region: 'Asia-Pacific', tuition: 'RMB 18,000–45,000 / yr', living: 'RMB 2,500–5,000 / mo', visa: 'X1 Study Visa', psw: '2 Yrs Work Permit', work: 'Internship permit' },
  { slug: 'malaysia', name: 'Malaysia', flag: '🇲🇾', region: 'Asia-Pacific', tuition: 'MYR 15,000–35,000 / yr', living: 'MYR 1,500–2,800 / mo', visa: 'Student Pass (VAL)', psw: 'Employment Pass', work: '20 hrs/wk holidays' },
  { slug: 'taiwan', name: 'Taiwan', flag: '🇹🇼', region: 'Asia-Pacific', tuition: 'NT$ 50,000–120,000 / yr', living: 'NT$ 10,000–18,000 / mo', visa: 'Resident Visa', psw: '1–2 Yrs Job Search', work: '20 hrs/wk' },
  { slug: 'thailand', name: 'Thailand', flag: '🇹🇭', region: 'Asia-Pacific', tuition: 'THB 100,000–250,000 / yr', living: 'THB 15,000–28,000 / mo', visa: 'Non-Immigrant ED', psw: 'Non-B Work Visa', work: 'Permit required' },
  { slug: 'vietnam', name: 'Vietnam', flag: '🇻🇳', region: 'Asia-Pacific', tuition: 'VND 60M–150M / yr', living: 'VND 8M–15M / mo', visa: 'DH Student Visa', psw: 'Work Permit', work: 'Campus allowed' },
  { slug: 'philippines', name: 'Philippines', flag: '🇵🇭', region: 'Asia-Pacific', tuition: 'PHP 80,000–180,000 / yr', living: 'PHP 15,000–28,000 / mo', visa: '9(f) Student Visa', psw: 'AEP Work Permit', work: 'Restricted' },

  // Other Destinations
  { slug: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Other', tuition: 'AED 35,000–80,000 / yr', living: 'AED 2,500–5,000 / mo', visa: 'Student Residence', psw: 'Green / Golden Visa', work: 'Part-time allowed' },
  { slug: 'qatar', name: 'Qatar', flag: '🇶🇦', region: 'Other', tuition: 'QAR 30,000–75,000 / yr', living: 'QAR 3,000–5,500 / mo', visa: 'Student RP', psw: 'Sponsorship Route', work: 'Campus allowed' },
  { slug: 'saudi-arabia', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Other', tuition: 'SAR 0–40,000 / yr', living: 'SAR 2,000–4,000 / mo', visa: 'Study Visa', psw: 'Iqama Transfer', work: 'Scholarship grant' },
  { slug: 'turkey', name: 'Turkey', flag: '🇹🇷', region: 'Other', tuition: '$1,000–$6,000 / yr', living: '$350–$650 / mo', visa: 'Student Ikamet', psw: '1 Yr Work Search', work: '24 hrs/wk (PG)' },
  { slug: 'mexico', name: 'Mexico', flag: '🇲🇽', region: 'North America', tuition: '$2,000–$7,000 / yr', living: '$400–$800 / mo', visa: 'Residente Temporal', psw: 'Work Visa Transfer', work: '20 hrs/wk' },
  { slug: 'brazil', name: 'Brazil', flag: '🇧🇷', region: 'Other', tuition: 'R$ 0–25,000 / yr', living: 'R$ 2,000–4,000 / mo', visa: 'VITEM IV', psw: '1 Yr Job Search', work: 'Formal contract' },
  { slug: 'argentina', name: 'Argentina', flag: '🇦🇷', region: 'Other', tuition: '$0 (Public) / yr', living: '$300–$600 / mo', visa: 'Student Visa', psw: 'Residence Route', work: 'Part-time allowed' },
  { slug: 'chile', name: 'Chile', flag: '🇨🇱', region: 'Other', tuition: '$3,000–$8,000 / yr', living: '$500–$900 / mo', visa: 'Student Visa', psw: 'Post-study Permit', work: '20 hrs/wk' },
  { slug: 'colombia', name: 'Colombia', flag: '🇨🇴', region: 'Other', tuition: '$2,000–$6,000 / yr', living: '$350–$650 / mo', visa: 'Visa V Estudiante', psw: 'Migrant Visa', work: '20 hrs/wk' },
  { slug: 'south-africa', name: 'South Africa', flag: '🇿🇦', region: 'Other', tuition: 'ZAR 45,000–90,000 / yr', living: 'ZAR 6,000–12,000 / mo', visa: 'Study Visa', psw: 'Critical Skills', work: '20 hrs/wk' },
];

export default function CountryGuidesHubPage() {
  const router = useRouter();
  const { user } = useAuth();
  const authTarget = user ? '/dashboard' : '/login';

  const featuredGuides = useMemo(() => {
    return ALL_50_COUNTRIES.filter((c) => c.featured).map((entry) => {
      const guideData: CountryGuideData =
        COUNTRY_GUIDES[entry.slug] || COUNTRY_GUIDES.usa;
      return { entry, guide: guideData };
    });
  }, []);

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(`/country-guide/${val}`);
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#111111] font-[Poppins] font-normal min-h-screen flex flex-col antialiased">
      {/* ═══════════════════════════════════════════════════════════
         1. CLEAN NAVBAR
         ═══════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E2DE]">
        <div className="max-w-6xl mx-auto h-[64px] px-4 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-[36px] h-[36px] rounded-[10px] shadow-[0_4px_16px_rgba(105,11,27,0.12)] overflow-hidden shrink-0">
              <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[16px] font-bold tracking-[-0.03em] text-[#111]">
                Abroad Simplified
              </div>
              <div className="text-[9px] uppercase tracking-[0.16em] text-[#888] font-semibold">
                Destination Hub
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-[#555]">
            <Link href="/country-guide" className="text-[#690B1B] font-bold">
              Country Guides
            </Link>
            <Link href="/dashboard/schools" className="hover:text-[#690B1B] transition-colors">
              University Finder
            </Link>
            <Link href="/dashboard/chance-me" className="hover:text-[#690B1B] transition-colors">
              AI Chance-Me
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={authTarget}
              className="h-[38px] px-5 rounded-full bg-[#690B1B] text-white text-[12.5px] font-bold hover:bg-[#7A1022] transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>{user ? 'Dashboard' : 'Get Started'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
         2. MAIN CONTAINER WRAPPER
         ═══════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14 flex-1 w-full">

        {/* ─── 1. ENHANCED LUXURY HERO CONTAINER ────────────────── */}
        <header className="relative rounded-[28px] p-7 sm:p-12 text-white shadow-[0_20px_60px_rgba(75,7,18,0.3)] border border-[#C9A55D]/25 overflow-hidden space-y-8 bg-gradient-to-br from-[#3D050E] via-[#5C0A18] to-[#2E030B]">
          {/* Ambient Glow Orbs */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#C9A55D]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-[#8B1227]/30 rounded-full blur-3xl -mb-32 pointer-events-none" />
          <div className="absolute left-0 top-1/2 w-64 h-64 bg-black/20 rounded-full blur-2xl -ml-20 pointer-events-none" />

          {/* Top Row: Eyebrow + Heading + Quick Jump */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-[660px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C9A55D]/40 text-[#F5DEB3] text-[11.5px] font-bold shadow-xs">
                <Sparkles size={14} className="text-[#C9A55D]" />
                <span className="tracking-wide">50 GLOBAL STUDY DESTINATIONS · 2026 EDITION</span>
              </div>

              <h1 className="text-[32px] sm:text-[46px] lg:text-[50px] font-extrabold tracking-[-0.03em] leading-[1.08]">
                Explore Top Global <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0D4] via-[#F0CB7E] to-[#C9A55D]">
                  Study Destinations
                </span>
              </h1>

              <p className="text-[14px] sm:text-[15.5px] text-white/85 leading-relaxed max-w-[580px]">
                Compare verified tuition fees, living costs, stay-back work permits, and admission benchmarks across 50 top countries.
              </p>
            </div>

            {/* Quick 50 Countries Glassmorphic Navigator Card */}
            <div className="w-full lg:w-[320px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[20px] p-5 space-y-3 shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#F0CB7E] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe size={14} />
                  <span>Quick Destination Jump</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9.5px] text-white/90">50 Countries</span>
              </div>

              <div className="relative">
                <select
                  onChange={handleDropdownSelect}
                  defaultValue=""
                  className="w-full h-[44px] px-3.5 pr-10 rounded-[12px] bg-[#2A0309]/80 border border-[#C9A55D]/40 text-[13px] font-semibold text-white outline-none cursor-pointer appearance-none shadow-inner hover:border-[#C9A55D] transition-colors"
                >
                  <option value="" disabled className="bg-[#2A0309] text-white/70">
                    ⚡ Select any country...
                  </option>
                  {ALL_50_COUNTRIES.map((c) => (
                    <option key={c.slug} value={c.slug} className="bg-[#2A0309] text-white py-1">
                      {c.flag} {c.name} ({c.region})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F0CB7E] pointer-events-none"
                />
              </div>

              <div className="text-[11px] text-white/60 text-center">
                1-click access to complete visa &amp; tuition guides
              </div>
            </div>
          </div>

          {/* 4 Enhanced Glassmorphic Metric Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/15 relative z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[16px] p-3.5 flex items-center gap-3 hover:bg-white/15 transition-all">
              <div className="w-10 h-10 rounded-[12px] bg-[#C9A55D]/20 text-[#F0CB7E] flex items-center justify-center shrink-0 text-[18px]">
                🌍
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-[13.5px] truncate">50 Countries</div>
                <div className="text-[11px] text-white/75 truncate">Comprehensive data</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[16px] p-3.5 flex items-center gap-3 hover:bg-white/15 transition-all">
              <div className="w-10 h-10 rounded-[12px] bg-[#C9A55D]/20 text-[#F0CB7E] flex items-center justify-center shrink-0 text-[18px]">
                🎓
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-[13.5px] truncate">Tuition &amp; Fees</div>
                <div className="text-[11px] text-white/75 truncate">Verified benchmarks</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[16px] p-3.5 flex items-center gap-3 hover:bg-white/15 transition-all">
              <div className="w-10 h-10 rounded-[12px] bg-[#C9A55D]/20 text-[#F0CB7E] flex items-center justify-center shrink-0 text-[18px]">
                🛂
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-[13.5px] truncate">Visa Pathways</div>
                <div className="text-[11px] text-white/75 truncate">Step-by-step guides</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[16px] p-3.5 flex items-center gap-3 hover:bg-white/15 transition-all">
              <div className="w-10 h-10 rounded-[12px] bg-[#C9A55D]/20 text-[#F0CB7E] flex items-center justify-center shrink-0 text-[18px]">
                💼
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-[13.5px] truncate">Post-Study Work</div>
                <div className="text-[11px] text-white/75 truncate">Stay-back permits</div>
              </div>
            </div>
          </div>
        </header>

        {/* ─── 2. 6 FEATURED COUNTRY CARDS CONTAINER ───────────── */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] sm:text-[24px] font-extrabold tracking-[-0.02em] text-[#111]">
              Featured Study Destinations
            </h2>
            <span className="text-[12px] text-[#777] font-medium">Top 6 International Hubs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredGuides.map(({ entry, guide }) => (
              <div
                key={entry.slug}
                className="bg-white border border-[#E7E2DE] rounded-[20px] overflow-hidden shadow-xs hover:shadow-md hover:border-[#690B1B]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Banner Image */}
                  <div className="h-[160px] relative overflow-hidden bg-gray-100">
                    <img
                      src={guide.heroImage}
                      alt={`Study in ${entry.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[20px] drop-shadow-sm">{entry.flag}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-[10.5px] font-bold text-[#111] shadow-2xs">
                        {entry.region}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="text-[19px] font-bold leading-tight drop-shadow-sm">
                        {entry.name}
                      </h3>
                    </div>
                  </div>

                  {/* 4 Crisp Metrics (Minimal Text) */}
                  <div className="p-4 sm:p-5 space-y-3.5">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[10px] p-2.5">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-[#888]">Tuition</div>
                        <div className="text-[12px] font-bold text-[#111] mt-0.5 truncate">
                          {guide.heroFacts.tuition}
                        </div>
                      </div>
                      <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[10px] p-2.5">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-[#888]">Living Cost</div>
                        <div className="text-[12px] font-bold text-[#111] mt-0.5 truncate">
                          {guide.heroFacts.livingCost}
                        </div>
                      </div>
                      <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[10px] p-2.5">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-[#888]">English Req</div>
                        <div className="text-[12px] font-bold text-[#111] mt-0.5 truncate">
                          {guide.heroFacts.englishBenchmark}
                        </div>
                      </div>
                      <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[10px] p-2.5">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-[#888]">Visa / Stay-Back</div>
                        <div className="text-[12px] font-bold text-[#690B1B] mt-0.5 truncate">
                          {entry.psw}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 sm:p-5 pt-0 border-t border-[#F0EBE6] mt-1">
                  <Link
                    href={`/country-guide/${entry.slug}`}
                    className="w-full h-[38px] rounded-full bg-[#FAF0F2] hover:bg-[#690B1B] text-[#690B1B] hover:text-white text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 group/btn active:scale-95 cursor-pointer"
                  >
                    <span>View Full Guide</span>
                    <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Explore Other Countries Container Dropdown */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#FAF0F2] text-[#690B1B] flex items-center justify-center shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#111]">
                  Explore 44 Other Global Destinations
                </div>
                <div className="text-[12px] text-[#666]">
                  Select any country across Europe, Asia-Pacific, and Americas for complete guidelines.
                </div>
              </div>
            </div>

            <div className="w-full sm:w-[280px] shrink-0 relative">
              <select
                onChange={handleDropdownSelect}
                defaultValue=""
                className="w-full h-[42px] px-3.5 pr-10 rounded-[10px] bg-[#FDFCFB] border border-[#E7E2DE] text-[12.5px] font-semibold text-[#111] outline-none focus:border-[#690B1B] cursor-pointer appearance-none transition-all shadow-2xs"
              >
                <option value="" disabled>
                  Select destination (44 more)...
                </option>
                {ALL_50_COUNTRIES.filter((c) => !c.featured).map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777] pointer-events-none"
              />
            </div>
          </div>
        </section>

        {/* ─── 3. GLOBAL INTAKE SEASONS CONTAINER ──────────────── */}
        <section className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">
                Global Admissions Calendar
              </h2>
              <p className="text-[12px] text-[#777] mt-0.5">
                Key intake windows &amp; application timelines across top countries
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#690B1B] bg-[#FAF0F2] px-2.5 py-0.5 rounded-full">
                  Primary Intake
                </span>
                <Clock size={16} className="text-[#690B1B]" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#111]">Fall Intake</h3>
                <div className="text-[12px] font-semibold text-[#666]">August – October</div>
              </div>
              <p className="text-[12px] text-[#555] leading-relaxed">
                Largest admission cycle with 100% course availability and highest departmental scholarship quotas.
              </p>
              <div className="text-[11px] font-bold text-[#111] pt-1 border-t border-[#E7E2DE]/60 flex justify-between">
                <span className="text-[#888]">Apply by:</span>
                <span className="text-[#690B1B]">Nov – Feb (Previous Year)</span>
              </div>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#16a34a] bg-[#F0FFF4] px-2.5 py-0.5 rounded-full">
                  Secondary Intake
                </span>
                <Clock size={16} className="text-[#16a34a]" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#111]">Spring Intake</h3>
                <div className="text-[12px] font-semibold text-[#666]">January – March</div>
              </div>
              <p className="text-[12px] text-[#555] leading-relaxed">
                Ideal for students needing extra time for exams, score improvements, or financial arrangements.
              </p>
              <div className="text-[11px] font-bold text-[#111] pt-1 border-t border-[#E7E2DE]/60 flex justify-between">
                <span className="text-[#888]">Apply by:</span>
                <span className="text-[#16a34a]">June – October</span>
              </div>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E731A] bg-[#FFF8EB] px-2.5 py-0.5 rounded-full">
                  Regional Intake
                </span>
                <Clock size={16} className="text-[#9E731A]" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#111]">Summer Intake</h3>
                <div className="text-[12px] font-semibold text-[#666]">May – July</div>
              </div>
              <p className="text-[12px] text-[#555] leading-relaxed">
                Primary cycle for Australia &amp; New Zealand (Semester 2), plus select European &amp; Canadian diplomas.
              </p>
              <div className="text-[11px] font-bold text-[#111] pt-1 border-t border-[#E7E2DE]/60 flex justify-between">
                <span className="text-[#888]">Apply by:</span>
                <span className="text-[#9E731A]">November – February</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. PROOF OF FUNDS BENCHMARKS CONTAINER ──────────── */}
        <section className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">
                Proof of Living Funds by Destination
              </h2>
              <p className="text-[12px] text-[#777] mt-0.5">
                Official statutory living benchmarks required for student visa approval
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">🇩🇪</span>
                <span className="font-bold text-[14px] text-[#111]">Germany</span>
              </div>
              <div className="text-[18px] font-extrabold text-[#690B1B]">€11,208 / yr</div>
              <div className="text-[11.5px] text-[#555] leading-snug">
                Held in certified Blocked Account (Sperrkonto) releasing €934/mo.
              </div>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">🇨🇦</span>
                <span className="font-bold text-[14px] text-[#111]">Canada</span>
              </div>
              <div className="text-[18px] font-extrabold text-[#690B1B]">CAD $20,635 / yr</div>
              <div className="text-[11.5px] text-[#555] leading-snug">
                Deposited into Guaranteed Investment Certificate (GIC) + 1st yr tuition.
              </div>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">🇬🇧</span>
                <span className="font-bold text-[14px] text-[#111]">UK</span>
              </div>
              <div className="text-[18px] font-extrabold text-[#690B1B]">£9,207–£12,006</div>
              <div className="text-[11.5px] text-[#555] leading-snug">
                9 months living funds held unbroken in bank account for 28 consecutive days.
              </div>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">🇦🇺</span>
                <span className="font-bold text-[14px] text-[#111]">Australia</span>
              </div>
              <div className="text-[18px] font-extrabold text-[#690B1B]">AUD $29,710 / yr</div>
              <div className="text-[11.5px] text-[#555] leading-snug">
                Official living cost requirement + travel allowance + 1st yr tuition balance.
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. SIDE-BY-SIDE KEY METRICS COMPARISON CONTAINER ─── */}
        <section className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">
                Top Destinations Comparison
              </h2>
              <p className="text-[12px] text-[#777] mt-0.5">
                Key benchmarks compared side by side
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px] min-w-[650px]">
              <thead>
                <tr className="bg-[#FDFCFB] border-b border-[#E7E2DE] text-[#888] text-[10.5px] uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3.5 text-[#111]">Destination</th>
                  <th className="py-2.5 px-3.5">Tuition / Year</th>
                  <th className="py-2.5 px-3.5">Living / Month</th>
                  <th className="py-2.5 px-3.5">Post-Study Work</th>
                  <th className="py-2.5 px-3.5">Part-Time Work</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE6]">
                {ALL_50_COUNTRIES.slice(0, 6).map((row) => (
                  <tr key={row.slug} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-[#111] flex items-center gap-2">
                      <span className="text-[16px]">{row.flag}</span>
                      <span>{row.name}</span>
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-[#333]">{row.tuition.split('/')[0]}</td>
                    <td className="py-2.5 px-3.5 text-[#666]">{row.living.split('/')[0]}</td>
                    <td className="py-2.5 px-3.5 font-semibold text-[#0E7044]">{row.psw}</td>
                    <td className="py-2.5 px-3.5 text-[#666]">{row.work}</td>
                    <td className="py-2.5 px-3.5 text-right">
                      <Link
                        href={`/country-guide/${row.slug}`}
                        className="text-[11.5px] font-bold text-[#690B1B] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Guide</span>
                        <ArrowRight size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── 6. APPLICATION DOCUMENT CHECKLIST CONTAINER ─────── */}
        <section className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">
                Standard Application Checklist
              </h2>
              <p className="text-[12px] text-[#777] mt-0.5">
                Core documents required across almost all international university applications
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-3.5 space-y-2 flex flex-col items-center justify-center">
              <span className="text-[24px]">🛂</span>
              <div className="text-[12px] font-bold text-[#111]">Valid Passport</div>
              <div className="text-[10px] text-[#888]">6+ mos validity</div>
            </div>
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-3.5 space-y-2 flex flex-col items-center justify-center">
              <span className="text-[24px]">📜</span>
              <div className="text-[12px] font-bold text-[#111]">Transcripts</div>
              <div className="text-[10px] text-[#888]">Official records</div>
            </div>
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-3.5 space-y-2 flex flex-col items-center justify-center">
              <span className="text-[24px]">✍️</span>
              <div className="text-[12px] font-bold text-[#111]">Statement (SOP)</div>
              <div className="text-[10px] text-[#888]">Academic essay</div>
            </div>
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-3.5 space-y-2 flex flex-col items-center justify-center">
              <span className="text-[24px]">✉️</span>
              <div className="text-[12px] font-bold text-[#111]">2–3 LORs</div>
              <div className="text-[10px] text-[#888]">Academic/Work</div>
            </div>
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-3.5 space-y-2 flex flex-col items-center justify-center">
              <span className="text-[24px]">🗣️</span>
              <div className="text-[12px] font-bold text-[#111]">English Scores</div>
              <div className="text-[10px] text-[#888]">IELTS / PTE / DET</div>
            </div>
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-3.5 space-y-2 flex flex-col items-center justify-center">
              <span className="text-[24px]">💼</span>
              <div className="text-[12px] font-bold text-[#111]">Updated CV</div>
              <div className="text-[10px] text-[#888]">1–2 pages</div>
            </div>
          </div>
        </section>

        {/* ─── 7. 4 DECISION PILLARS CONTAINER ─────────────────── */}
        <section className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">
              How to Select Your Destination
            </h2>
            <p className="text-[12px] text-[#777] mt-0.5">
              4 key factors to evaluate before applying
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                step: '01',
                title: 'Budget & ROI',
                desc: 'Compare tuition-free options (Germany) vs high-wage English markets (USA, UK, Canada).',
                icon: DollarSign,
              },
              {
                step: '02',
                title: 'Stay-Back Visas',
                desc: 'Assess post-study work permits: 3-yr PGWP, 3-yr STEM OPT, or 2-yr Graduate Route.',
                icon: Briefcase,
              },
              {
                step: '03',
                title: 'Language & Exams',
                desc: 'Check IELTS, TOEFL, or Duolingo score benchmarks and English Medium waivers.',
                icon: GraduationCap,
              },
              {
                step: '04',
                title: 'Intake Timelines',
                desc: 'Plan 10–14 months ahead for Fall (August/September) or Spring (January/February).',
                icon: Calendar,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2 hover:border-[#690B1B]/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-[10px] bg-[#FAF0F2] text-[#690B1B] flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                    <span className="text-[14px] font-black text-[#CCC]">{card.step}</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#111]">{card.title}</h3>
                  <p className="text-[11.5px] text-[#666] leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 8. MINIMAL BOTTOM CTA BANNER ────────────────────── */}
        <section className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[20px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-[20px] sm:text-[22px] font-bold leading-tight">
              Ready to find matching universities?
            </h2>
            <p className="text-[12.5px] text-white/80 max-w-[500px]">
              Explore verified universities synced from our database or calculate your admit chances with AI.
            </p>
          </div>

          <Link
            href="/dashboard/schools"
            className="h-[40px] px-6 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[12.5px] transition-all flex items-center gap-1.5 shadow-xs active:scale-95 shrink-0 cursor-pointer"
          >
            <span>University Finder</span>
            <ArrowRight size={13} />
          </Link>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════
         3. CLEAN FOOTER
         ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#E7E2DE] bg-white py-6 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#777]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111]">Abroad Simplified</span>
            <span>•</span>
            <span>© 2026 All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <Link href="/country-guide" className="hover:text-[#690B1B] transition-colors">
              Country Guides
            </Link>
            <Link href="/dashboard/schools" className="hover:text-[#690B1B] transition-colors">
              University Finder
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
