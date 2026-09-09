'use client';

import React, { useState } from 'react';
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
  Compass,
} from 'lucide-react';
import { COUNTRY_GUIDES, CountryGuideData } from '@/data/countryGuides';
import { useAuth } from '@/context/AuthContext';

// ─── ALL 50 COUNTRIES LIST FOR QUICK JUMP DROPDOWN ──────────────────────────

const ALL_50_COUNTRIES = [
  // Top 6 Featured
  { slug: 'usa', name: 'United States', flag: '🇺🇸', region: 'North America' },
  { slug: 'uk', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { slug: 'canada', name: 'Canada', flag: '🇨🇦', region: 'North America' },
  { slug: 'germany', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
  { slug: 'australia', name: 'Australia', flag: '🇦🇺', region: 'Asia-Pacific' },
  { slug: 'ireland', name: 'Ireland', flag: '🇮🇪', region: 'Europe' },

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

const FEATURED_SLUGS = ['usa', 'uk', 'canada', 'germany', 'australia', 'ireland'];

export default function CountryGuidesHubPage() {
  const router = useRouter();
  const { user } = useAuth();
  const authTarget = user ? '/dashboard' : '/login';

  const [selectedDropdown, setSelectedDropdown] = useState('');

  const handleCountrySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(`/country-guide/${val}`);
    }
  };

  const featuredGuides = FEATURED_SLUGS.map((slug) => {
    const meta = ALL_50_COUNTRIES.find((c) => c.slug === slug)!;
    const guide: CountryGuideData = COUNTRY_GUIDES[slug] || COUNTRY_GUIDES.usa;
    return { meta, guide };
  });

  return (
    <div className="bg-[#FAF8F5] text-[#111111] font-[Poppins] font-normal min-h-screen flex flex-col">
      {/* ═══════════════════════════════════════════════════════════
         1. MINIMAL TOP NAVBAR
         ═══════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DF]">
        <div className="max-w-6xl mx-auto h-[64px] px-4 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-[36px] h-[36px] rounded-[10px] shadow-[0_4px_16px_rgba(105,11,27,0.15)] overflow-hidden shrink-0">
              <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[16px] font-bold tracking-[-0.03em] text-[#111]">
                Abroad Simplified
              </div>
              <div className="text-[9px] uppercase tracking-[0.16em] text-[#888] font-semibold">
                Destination Guides
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
              className="h-[38px] px-5 rounded-full bg-[#690B1B] text-white text-[12.5px] font-bold hover:bg-[#7A1022] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span>{user ? 'Dashboard' : 'Get Started'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
         2. MINIMAL HERO SECTION
         ═══════════════════════════════════════════════════════════ */}
      <header className="py-10 sm:py-14 px-4 sm:px-8 border-b border-[#EAE5DF] bg-gradient-to-b from-[#F5F0EB] to-[#FAF8F5]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-[620px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#F3D5DC] text-[11px] font-bold text-[#690B1B]">
              <Sparkles size={13} className="text-[#C9A55D]" />
              <span>STUDY ABROAD DESTINATION GUIDES · 2026</span>
            </div>

            <h1 className="text-[32px] sm:text-[44px] font-extrabold tracking-[-0.035em] text-[#111] leading-[1.1]">
              Explore Global <br className="hidden sm:inline" />
              <span className="text-[#690B1B]">Study Destinations</span>
            </h1>

            <p className="text-[14px] sm:text-[15px] text-[#555] leading-relaxed">
              Explore admission requirements, tuition fees, cost of living, visa procedures, and stay-back work rights across top international destinations.
            </p>
          </div>

          {/* Quick Dropdown Menu for All 50 Countries */}
          <div className="w-full md:w-[320px] bg-white border border-[#EAE5DF] rounded-[18px] p-4 shadow-sm space-y-2 shrink-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#888] flex items-center gap-1.5">
              <Globe size={13} className="text-[#690B1B]" />
              <span>Explore All 50 Countries</span>
            </div>
            <div className="relative">
              <select
                value={selectedDropdown}
                onChange={handleCountrySelectChange}
                className="w-full h-[44px] px-3.5 pr-10 rounded-[10px] bg-[#FAF8F5] border border-[#EAE5DF] text-[13px] font-semibold text-[#111] outline-none focus:border-[#690B1B] cursor-pointer appearance-none transition-all"
              >
                <option value="" disabled>
                  Select destination (50 available)...
                </option>
                {ALL_50_COUNTRIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.flag} {c.name} ({c.region})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777] pointer-events-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
         3. 6 FEATURED COUNTRY CARDS
         ═══════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-14 sm:space-y-16 flex-1">
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuides.map(({ meta, guide }) => (
              <div
                key={meta.slug}
                className="bg-white border border-[#EAE5DF] rounded-[20px] overflow-hidden shadow-xs hover:shadow-md hover:border-[#690B1B]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="h-[170px] relative overflow-hidden bg-gray-100">
                    <img
                      src={guide.heroImage}
                      alt={`Study in ${meta.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[20px] filter drop-shadow-md">{meta.flag}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10.5px] font-bold text-[#111] shadow-xs">
                        {meta.region}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="text-[20px] font-bold leading-tight drop-shadow-sm">
                        {meta.name}
                      </h3>
                    </div>
                  </div>

                  {/* 4 Key Metrics */}
                  <div className="p-5 space-y-4">
                    <p className="text-[12.5px] text-[#555] line-clamp-2 leading-relaxed">
                      {guide.heroDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11.5px]">
                      <div className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[10px] p-2.5">
                        <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#888]">Tuition</div>
                        <div className="text-[12px] font-bold text-[#111] mt-0.5 truncate">
                          {guide.heroFacts.tuition}
                        </div>
                      </div>
                      <div className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[10px] p-2.5">
                        <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#888]">Living Cost</div>
                        <div className="text-[12px] font-bold text-[#111] mt-0.5 truncate">
                          {guide.heroFacts.livingCost}
                        </div>
                      </div>
                      <div className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[10px] p-2.5">
                        <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#888]">English Req</div>
                        <div className="text-[12px] font-bold text-[#111] mt-0.5 truncate">
                          {guide.heroFacts.englishBenchmark}
                        </div>
                      </div>
                      <div className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[10px] p-2.5">
                        <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#888]">Visa Type</div>
                        <div className="text-[12px] font-bold text-[#690B1B] mt-0.5 truncate">
                          {guide.heroFacts.studentVisa}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-5 pt-0 border-t border-[#F5F2EE] mt-2">
                  <Link
                    href={`/country-guide/${meta.slug}`}
                    className="w-full h-[40px] rounded-full bg-[#FAF0F2] hover:bg-[#690B1B] text-[#690B1B] hover:text-white text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 group/btn active:scale-95"
                  >
                    <span>Explore {meta.name} Guide</span>
                    <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Dropdown Banner at the Bottom of Cards */}
          <div className="bg-white border border-[#EAE5DF] rounded-[18px] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF0F2] text-[#690B1B] flex items-center justify-center shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#111]">
                  Looking for another study destination?
                </div>
                <div className="text-[12px] text-[#666]">
                  Select from 44 other verified countries across Europe, Asia-Pacific, and Americas.
                </div>
              </div>
            </div>

            <div className="w-full sm:w-[280px] shrink-0 relative">
              <select
                onChange={handleCountrySelectChange}
                defaultValue=""
                className="w-full h-[42px] px-3.5 pr-10 rounded-[10px] bg-[#FAF8F5] border border-[#EAE5DF] text-[12.5px] font-semibold text-[#111] outline-none focus:border-[#690B1B] cursor-pointer appearance-none transition-all"
              >
                <option value="" disabled>
                  Select destination...
                </option>
                {ALL_50_COUNTRIES.filter((c) => !FEATURED_SLUGS.includes(c.slug)).map((c) => (
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

        {/* ═══════════════════════════════════════════════════════════
           4. SIDE-BY-SIDE COMPARISON MATRIX
           ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              KEY METRICS
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#111] mt-0.5">
              Top Destination Comparison
            </h2>
          </div>

          <div className="bg-white border border-[#EAE5DF] rounded-[18px] overflow-hidden shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12.5px] min-w-[650px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE5DF] text-[#777] text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-4 text-[#111]">Country</th>
                  <th className="py-3 px-4">Avg Tuition / Yr</th>
                  <th className="py-3 px-4">Living Cost / Mo</th>
                  <th className="py-3 px-4">Post-Study Work</th>
                  <th className="py-3 px-4">Part-Time Work</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE6]">
                {[
                  {
                    slug: 'usa',
                    name: 'USA',
                    flag: '🇺🇸',
                    tuition: '$20,000–$55,000',
                    living: '$1,000–$2,500',
                    psw: '1–3 Years (STEM OPT)',
                    work: '20 hrs/wk on-campus',
                  },
                  {
                    slug: 'uk',
                    name: 'United Kingdom',
                    flag: '🇬🇧',
                    tuition: '£12,000–£35,000',
                    living: '£1,000–£1,600',
                    psw: '2 Years (Graduate Route)',
                    work: '20 hrs/wk term-time',
                  },
                  {
                    slug: 'canada',
                    name: 'Canada',
                    flag: '🇨🇦',
                    tuition: 'CAD $18,000–$40,000',
                    living: 'CAD $1,200–$2,200',
                    psw: 'Up to 3 Years (PGWP)',
                    work: '20 hrs/wk off-campus',
                  },
                  {
                    slug: 'germany',
                    name: 'Germany',
                    flag: '🇩🇪',
                    tuition: '€0 (Tuition-Free Public)',
                    living: '€850–€1,350',
                    psw: '18 Months Job Seeker',
                    work: '140 full days / yr',
                  },
                  {
                    slug: 'australia',
                    name: 'Australia',
                    flag: '🇦🇺',
                    tuition: 'AUD $25,000–$45,000',
                    living: 'AUD $1,400–$2,500',
                    psw: '2–4 Years (Subclass 485)',
                    work: '48 hrs / fortnight',
                  },
                  {
                    slug: 'ireland',
                    name: 'Ireland',
                    flag: '🇮🇪',
                    tuition: '€10,000–€25,000',
                    living: '€800–€1,500',
                    psw: '2 Years (Stamp 1G)',
                    work: '20 hrs/wk (40 in hol)',
                  },
                ].map((row) => (
                  <tr key={row.slug} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#111] flex items-center gap-2">
                      <span className="text-[17px]">{row.flag}</span>
                      <span>{row.name}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#333]">{row.tuition}</td>
                    <td className="py-3 px-4 text-[#555]">{row.living}</td>
                    <td className="py-3 px-4 font-semibold text-[#0E7044]">{row.psw}</td>
                    <td className="py-3 px-4 text-[#555]">{row.work}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/country-guide/${row.slug}`}
                        className="text-[11.5px] font-bold text-[#690B1B] hover:underline inline-flex items-center gap-1"
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

        {/* ═══════════════════════════════════════════════════════════
           5. 4-STEP DECISION FRAMEWORK
           ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              HOW TO CHOOSE
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#111] mt-0.5">
              4 Factors to Consider
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Budget & ROI',
                desc: 'Compare tuition-free options (Germany) against high-earning English markets (USA, UK, Canada).',
                icon: DollarSign,
              },
              {
                step: '02',
                title: 'Stay-Back Visas',
                desc: 'Evaluate post-study work permits: 3-year PGWP, 3-year STEM OPT, or 2-year Graduate Route.',
                icon: Briefcase,
              },
              {
                step: '03',
                title: 'Language & Exams',
                desc: 'Check IELTS, TOEFL, or Duolingo requirements and Medium of Instruction (MOI) waivers.',
                icon: GraduationCap,
              },
              {
                step: '04',
                title: 'Intake Timelines',
                desc: 'Plan 10–14 months ahead for Fall (August/September) or Spring (January/February) entries.',
                icon: Calendar,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="bg-white border border-[#EAE5DF] rounded-[16px] p-4.5 shadow-2xs space-y-2.5 hover:border-[#690B1B]/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-[10px] bg-[#FAF0F2] text-[#690B1B] flex items-center justify-center">
                      <Icon size={17} />
                    </div>
                    <span className="text-[16px] font-black text-[#EAE5DF]">{card.step}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-[#111]">{card.title}</h3>
                  <p className="text-[12px] text-[#555] leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           6. MINIMAL CALL-TO-ACTION BANNER
           ═══════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[20px] p-6 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-[22px] sm:text-[26px] font-bold leading-tight">
              Ready to find matching universities?
            </h2>
            <p className="text-[13px] text-white/80 max-w-[520px]">
              Explore verified universities synced from our database or calculate your admit chances with AI.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <Link
              href="/dashboard/schools"
              className="h-[42px] px-6 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[13px] transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <span>University Finder</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════
         7. CLEAN FOOTER
         ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#EAE5DF] bg-white py-6 px-4 sm:px-8 mt-auto">
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
