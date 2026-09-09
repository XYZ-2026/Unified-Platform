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
  FileText,
  BadgePercent,
  Check,
} from 'lucide-react';
import { COUNTRY_GUIDES, CountryGuideData } from '@/data/countryGuides';
import { useAuth } from '@/context/AuthContext';

// ─── ALL 50 COUNTRIES LIST FOR DROPDOWN ──────────────────────────────────────

const ALL_50_COUNTRIES = [
  // Featured Top 6
  { slug: 'usa', name: 'United States', flag: '🇺🇸', region: 'North America', featured: true },
  { slug: 'uk', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', featured: true },
  { slug: 'canada', name: 'Canada', flag: '🇨🇦', region: 'North America', featured: true },
  { slug: 'germany', name: 'Germany', flag: '🇩🇪', region: 'Europe', featured: true },
  { slug: 'australia', name: 'Australia', flag: '🇦🇺', region: 'Asia-Pacific', featured: true },
  { slug: 'ireland', name: 'Ireland', flag: '🇮🇪', region: 'Europe', featured: true },

  // Europe
  { slug: 'france', name: 'France', flag: '🇫🇷', region: 'Europe' },
  { slug: 'netherlands', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
  { slug: 'italy', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { slug: 'spain', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
  { slug: 'switzerland', name: 'Switzerland', flag: '🇨🇭', region: 'Europe' },
  { slug: 'sweden', name: 'Sweden', flag: '🇸🇪', region: 'Europe' },
  { slug: 'denmark', name: 'Denmark', flag: '🇩🇰', region: 'Europe' },
  { slug: 'norway', name: 'Norway', flag: '🇳🇴', region: 'Europe' },
  { slug: 'finland', name: 'Finland', flag: '🇫🇮', region: 'Europe' },
  { slug: 'austria', name: 'Austria', flag: '🇦🇹', region: 'Europe' },
  { slug: 'belgium', name: 'Belgium', flag: '🇧🇪', region: 'Europe' },
  { slug: 'poland', name: 'Poland', flag: '🇵🇱', region: 'Europe' },
  { slug: 'portugal', name: 'Portugal', flag: '🇵🇹', region: 'Europe' },
  { slug: 'czech-republic', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe' },
  { slug: 'hungary', name: 'Hungary', flag: '🇭🇺', region: 'Europe' },
  { slug: 'greece', name: 'Greece', flag: '🇬🇷', region: 'Europe' },
  { slug: 'cyprus', name: 'Cyprus', flag: '🇨🇾', region: 'Europe' },
  { slug: 'lithuania', name: 'Lithuania', flag: '🇱🇹', region: 'Europe' },
  { slug: 'latvia', name: 'Latvia', flag: '🇱🇻', region: 'Europe' },
  { slug: 'estonia', name: 'Estonia', flag: '🇪🇪', region: 'Europe' },
  { slug: 'malta', name: 'Malta', flag: '🇲🇹', region: 'Europe' },
  { slug: 'iceland', name: 'Iceland', flag: '🇮🇸', region: 'Europe' },
  { slug: 'luxembourg', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe' },

  // Asia-Pacific
  { slug: 'singapore', name: 'Singapore', flag: '🇸🇬', region: 'Asia-Pacific' },
  { slug: 'new-zealand', name: 'New Zealand', flag: '🇳🇿', region: 'Asia-Pacific' },
  { slug: 'japan', name: 'Japan', flag: '🇯🇵', region: 'Asia-Pacific' },
  { slug: 'south-korea', name: 'South Korea', flag: '🇰🇷', region: 'Asia-Pacific' },
  { slug: 'hong-kong', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia-Pacific' },
  { slug: 'china', name: 'China', flag: '🇨🇳', region: 'Asia-Pacific' },
  { slug: 'malaysia', name: 'Malaysia', flag: '🇲🇾', region: 'Asia-Pacific' },
  { slug: 'taiwan', name: 'Taiwan', flag: '🇹🇼', region: 'Asia-Pacific' },
  { slug: 'thailand', name: 'Thailand', flag: '🇹🇭', region: 'Asia-Pacific' },
  { slug: 'vietnam', name: 'Vietnam', flag: '🇻🇳', region: 'Asia-Pacific' },
  { slug: 'philippines', name: 'Philippines', flag: '🇵🇭', region: 'Asia-Pacific' },

  // Other Destinations
  { slug: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East' },
  { slug: 'qatar', name: 'Qatar', flag: '🇶🇦', region: 'Middle East' },
  { slug: 'saudi-arabia', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East' },
  { slug: 'turkey', name: 'Turkey', flag: '🇹🇷', region: 'Middle East' },
  { slug: 'mexico', name: 'Mexico', flag: '🇲🇽', region: 'Americas' },
  { slug: 'brazil', name: 'Brazil', flag: '🇧🇷', region: 'Americas' },
  { slug: 'argentina', name: 'Argentina', flag: '🇦🇷', region: 'Americas' },
  { slug: 'chile', name: 'Chile', flag: '🇨🇱', region: 'Americas' },
  { slug: 'colombia', name: 'Colombia', flag: '🇨🇴', region: 'Americas' },
  { slug: 'south-africa', name: 'South Africa', flag: '🇿🇦', region: 'Africa' },
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
         1. CLEAN TOP NAVBAR
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

        {/* ─── 1. HERO BANNER CONTAINER ─────────────────────────── */}
        <header className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-10 text-white shadow-sm border border-white/10 relative overflow-hidden space-y-6">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-white/3 rounded-full blur-2xl -mb-32 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-[640px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[11.5px] font-bold">
                <Sparkles size={13} />
                <span>Global Admissions Directory · 2026 Edition</span>
              </div>

              <h1 className="text-[30px] sm:text-[42px] font-extrabold tracking-[-0.03em] leading-tight">
                Study Abroad Hub &amp; Country Guides
              </h1>

              <p className="text-[13.5px] sm:text-[14.5px] text-white/80 leading-relaxed max-w-[560px]">
                Comprehensive guidelines on global university admissions, tuition benchmarks, student visa requirements, scholarships, and post-study work authorization.
              </p>
            </div>

            {/* Quick 50 Countries Dropdown in Hero */}
            <div className="w-full md:w-[290px] bg-white/10 backdrop-blur-md border border-white/15 rounded-[16px] p-3.5 space-y-2 shrink-0">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#C9A55D] flex items-center gap-1.5">
                <Globe size={13} />
                <span>Jump to Any Destination</span>
              </div>
              <div className="relative">
                <select
                  onChange={handleDropdownSelect}
                  defaultValue=""
                  className="w-full h-[40px] px-3 pr-8 rounded-[10px] bg-white text-[12.5px] font-semibold text-[#111] outline-none cursor-pointer appearance-none shadow-xs"
                >
                  <option value="" disabled>
                    Select country (50 available)...
                  </option>
                  {ALL_50_COUNTRIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* 4 Micro Stat Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/10 relative z-10 text-[12px]">
            <div className="bg-white/10 rounded-[12px] p-3 flex items-center gap-2.5">
              <span className="text-[18px]">🌍</span>
              <div>
                <div className="font-bold text-white text-[13px]">50 Destinations</div>
                <div className="text-[10.5px] text-white/70">Verified guidelines</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-[12px] p-3 flex items-center gap-2.5">
              <span className="text-[18px]">🎓</span>
              <div>
                <div className="font-bold text-white text-[13px]">Tuition &amp; Aid</div>
                <div className="text-[10.5px] text-white/70">Standard benchmarks</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-[12px] p-3 flex items-center gap-2.5">
              <span className="text-[18px]">🛂</span>
              <div>
                <div className="font-bold text-white text-[13px]">Visa Procedures</div>
                <div className="text-[10.5px] text-white/70">Step-by-step documentation</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-[12px] p-3 flex items-center gap-2.5">
              <span className="text-[18px]">💼</span>
              <div>
                <div className="font-bold text-white text-[13px]">Post-Study Work</div>
                <div className="text-[10.5px] text-white/70">Stay-back permits</div>
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

                  {/* 4 Crisp Metrics */}
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
                          {guide.heroFacts.studentVisa}
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

        {/* ─── 3. SCHOLARSHIP & FINANCIAL AID TYPES CONTAINER ──── */}
        <section className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">
                Funding &amp; Scholarship Pathways
              </h2>
              <p className="text-[12px] text-[#777] mt-0.5">
                Overview of primary financial aid channels available to international students
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <div className="w-8 h-8 rounded-[10px] bg-[#FAF0F2] text-[#690B1B] flex items-center justify-center">
                <Award size={16} />
              </div>
              <h3 className="text-[14px] font-bold text-[#111]">Merit Scholarships</h3>
              <p className="text-[11.5px] text-[#666] leading-relaxed">
                Awarded directly by universities based on high GPA, test scores, or outstanding portfolio achievements (10% to 100% tuition waiver).
              </p>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <div className="w-8 h-8 rounded-[10px] bg-[#F0FFF4] text-[#16a34a] flex items-center justify-center">
                <Landmark size={16} />
              </div>
              <h3 className="text-[14px] font-bold text-[#111]">Government Grants</h3>
              <p className="text-[11.5px] text-[#666] leading-relaxed">
                Prestige fellowships such as Fulbright (USA), Chevening (UK), DAAD (Germany), and Australia Awards covering full tuition and living expenses.
              </p>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <div className="w-8 h-8 rounded-[10px] bg-[#FFF8EB] text-[#9E731A] flex items-center justify-center">
                <Briefcase size={16} />
              </div>
              <h3 className="text-[14px] font-bold text-[#111]">Assistantships (TA / RA)</h3>
              <p className="text-[11.5px] text-[#666] leading-relaxed">
                Graduate Teaching or Research Assistantships offering full or partial tuition remission plus a monthly departmental stipend.
              </p>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <div className="w-8 h-8 rounded-[10px] bg-[#FAF8F5] text-[#555] flex items-center justify-center">
                <DollarSign size={16} />
              </div>
              <h3 className="text-[14px] font-bold text-[#111]">Need-Based &amp; Loans</h3>
              <p className="text-[11.5px] text-[#666] leading-relaxed">
                Institutional financial aid and collateral-free international student education loans to fulfill embassy proof of funds requirements.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 4. STANDARDIZED EXAMS & BENCHMARKS CONTAINER ─────── */}
        <section className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">
                Standardized Tests &amp; Benchmarks
              </h2>
              <p className="text-[12px] text-[#777] mt-0.5">
                Common examination requirements across global admissions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#690B1B] bg-[#FAF0F2] px-2 py-0.5 rounded-md">
                Language
              </span>
              <h3 className="text-[14px] font-bold text-[#111] pt-1">IELTS / TOEFL / PTE</h3>
              <div className="text-[12px] font-bold text-[#690B1B]">Benchmark: IELTS 6.5+ / TOEFL 85+</div>
              <p className="text-[11px] text-[#666] leading-relaxed">
                Accepted by 99% of global institutions. PTE (58+) and Duolingo (115+) accepted widely across UK, USA, and Ireland.
              </p>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16a34a] bg-[#F0FFF4] px-2 py-0.5 rounded-md">
                Graduate STEM
              </span>
              <h3 className="text-[14px] font-bold text-[#111] pt-1">GRE General Test</h3>
              <div className="text-[12px] font-bold text-[#16a34a]">Benchmark: 310–325+ (Quant 160+)</div>
              <p className="text-[11px] text-[#666] leading-relaxed">
                Required for competitive engineering, data science, and CS programs in the US and select German/European master’s degrees.
              </p>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E731A] bg-[#FFF8EB] px-2 py-0.5 rounded-md">
                Business &amp; MBA
              </span>
              <h3 className="text-[14px] font-bold text-[#111] pt-1">GMAT Exam</h3>
              <div className="text-[12px] font-bold text-[#9E731A]">Benchmark: 650–720+ Score</div>
              <p className="text-[11px] text-[#666] leading-relaxed">
                Standard evaluation for international business schools, management degrees, and top global MBA cohorts.
              </p>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#555] bg-[#F1EFEA] px-2 py-0.5 rounded-md">
                Exemptions
              </span>
              <h3 className="text-[14px] font-bold text-[#111] pt-1">Language Waivers (MOI)</h3>
              <div className="text-[12px] font-bold text-[#555]">Medium of Instruction</div>
              <p className="text-[11px] text-[#666] leading-relaxed">
                Available at select European and UK universities if your undergraduate degree was fully instructed and assessed in English.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 5. 5-STAGE ADMISSIONS ROADMAP CONTAINER ─────────── */}
        <section className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">
                The 5-Stage Study Abroad Roadmap
              </h2>
              <p className="text-[12px] text-[#777] mt-0.5">
                Standard progression from initial research to campus arrival
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                step: '01',
                title: 'Profile & Shortlist',
                desc: 'Assess GPA, shortlist target destinations, and verify admission prerequisites.',
              },
              {
                step: '02',
                title: 'Exams & SOP',
                desc: 'Complete IELTS/GRE tests and draft tailored Statements of Purpose (SOP).',
              },
              {
                step: '03',
                title: 'Apply & Offers',
                desc: 'Submit university portal applications, track status, and secure unconditional offers.',
              },
              {
                step: '04',
                title: 'Visa & Solvency',
                desc: 'Arrange proof of living funds, pay tuition deposit, and file student visa.',
              },
              {
                step: '05',
                title: 'Fly & Enroll',
                desc: 'Book travel tickets, secure housing, and attend university orientation.',
              },
            ].map((stage) => (
              <div
                key={stage.step}
                className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-3.5 space-y-1.5"
              >
                <div className="text-[11px] font-extrabold text-[#690B1B]">STAGE {stage.step}</div>
                <h4 className="text-[13.5px] font-bold text-[#111]">{stage.title}</h4>
                <p className="text-[11.5px] text-[#666] leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 6. WORK RIGHTS & POST-STUDY PERMITS CONTAINER ──── */}
        <section className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">
                Employment &amp; Post-Study Work Rights
              </h2>
              <p className="text-[12px] text-[#777] mt-0.5">
                Standard work regulations during and after academic studies
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-4.5 space-y-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[#FAF0F2] text-[#690B1B] flex items-center justify-center">
                <Clock size={16} />
              </div>
              <h3 className="text-[15px] font-bold text-[#111]">Part-Time Work Rights</h3>
              <div className="text-[12px] font-bold text-[#690B1B]">16–20 Hours / Week</div>
              <p className="text-[11.5px] text-[#666] leading-relaxed">
                Most destinations permit up to 20 hours per week of employment during academic semesters, and full-time hours during official holiday breaks.
              </p>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-4.5 space-y-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[#F0FFF4] text-[#16a34a] flex items-center justify-center">
                <Briefcase size={16} />
              </div>
              <h3 className="text-[15px] font-bold text-[#111]">Post-Study Stay-Back</h3>
              <div className="text-[12px] font-bold text-[#16a34a]">1 to 3 Years Open Permit</div>
              <p className="text-[11.5px] text-[#666] leading-relaxed">
                Graduates can remain to seek full-time employment without sponsorship: 3-yr STEM OPT (USA), 3-yr PGWP (Canada), 2-yr Graduate Route (UK), 18-mo (Germany).
              </p>
            </div>

            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-4.5 space-y-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[#FFF8EB] text-[#9E731A] flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <h3 className="text-[15px] font-bold text-[#111]">Career Transition</h3>
              <div className="text-[12px] font-bold text-[#9E731A]">Long-Term Settlement</div>
              <p className="text-[11.5px] text-[#666] leading-relaxed">
                Direct conversion opportunities to employer-sponsored work visas (H-1B, Skilled Worker, EU Blue Card) and points-based economic residency pathways.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 7. MINIMAL BOTTOM CTA BANNER ────────────────────── */}
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
