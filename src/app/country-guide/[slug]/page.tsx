'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COUNTRY_GUIDES, CountryGuideData } from '@/data/countryGuides';
import { useAuth } from '@/context/AuthContext';

/* ══════════════════════════════════════════════════════════════
   BADGE HELPER
══════════════════════════════════════════════════════════════ */
function StatusBadge({
  text,
  variant,
}: {
  text: string;
  variant?: 'required' | 'usually' | 'specific' | 'optional' | 'country' | 'varies' | 'typical' | 'competitive';
}) {
  const lower = (variant || text).toLowerCase();

  if (lower.includes('required') && !lower.includes('usually') && !lower.includes('not')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#E8F8F0] text-[#0E7044] border border-[#C2EBD6]">
        {text}
      </span>
    );
  }
  if (lower.includes('usually') || lower.includes('typical')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#FDF0EC] text-[#B83E1B] border border-[#FADCD3]">
        {text}
      </span>
    );
  }
  if (lower.includes('country') || lower.includes('competitive')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#FEF7E6] text-[#9A6B06] border border-[#FCE8B2]">
        {text}
      </span>
    );
  }
  if (lower.includes('specific')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#F5EEFB] text-[#7828A8] border border-[#E6D4F5]">
        {text}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#F1EFEA] text-[#555555] border border-[#E2DFD8]">
      {text}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
export default function CountryGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const authTarget = user ? '/dashboard' : '/login';

  const [guide, setGuide] = useState<CountryGuideData | null>(null);
  const [loading, setLoading] = useState(true);

  const countrySlug = slug?.toLowerCase() || 'usa';

  useEffect(() => {
    // Attempt to fetch from API route (which queries CMS with local fallback)
    async function loadGuide() {
      try {
        const res = await fetch(`/api/wix/country-guide?slug=${countrySlug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setGuide(json.data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to local
      }
      setGuide(COUNTRY_GUIDES[countrySlug] || COUNTRY_GUIDES.usa);
      setLoading(false);
    }
    loadGuide();
  }, [countrySlug]);

  const activeGuide = guide || COUNTRY_GUIDES[countrySlug] || COUNTRY_GUIDES.usa;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    router.push(`/country-guide/${selected}`);
  };

  const countriesList = [
    { slug: 'usa', name: 'USA', flag: '🇺🇸' },
    { slug: 'uk', name: 'UK', flag: '🇬🇧' },
    { slug: 'canada', name: 'Canada', flag: '🇨🇦' },
    { slug: 'germany', name: 'Germany', flag: '🇩🇪' },
    { slug: 'australia', name: 'Australia', flag: '🇦🇺' },
    { slug: 'ireland', name: 'Ireland', flag: '🇮🇪' },
    { slug: 'france', name: 'France', flag: '🇫🇷' },
    { slug: 'new-zealand', name: 'New Zealand', flag: '🇳🇿' },
    { slug: 'netherlands', name: 'Netherlands', flag: '🇳🇱' },
    { slug: 'singapore', name: 'Singapore', flag: '🇸🇬' },
    { slug: 'italy', name: 'Italy', flag: '🇮🇹' },
    { slug: 'sweden', name: 'Sweden', flag: '🇸🇪' },
    { slug: 'switzerland', name: 'Switzerland', flag: '🇨🇭' },
    { slug: 'spain', name: 'Spain', flag: '🇪🇸' },
    { slug: 'japan', name: 'Japan', flag: '🇯🇵' },
    { slug: 'south-korea', name: 'South Korea', flag: '🇰🇷' },
    { slug: 'uae', name: 'UAE (Dubai)', flag: '🇦🇪' },
    { slug: 'finland', name: 'Finland', flag: '🇫🇮' },
    { slug: 'poland', name: 'Poland', flag: '🇵🇱' },
    { slug: 'austria', name: 'Austria', flag: '🇦🇹' },
    { slug: 'malaysia', name: 'Malaysia', flag: '🇲🇾' },
  ];

  return (
    <div className="bg-[#FAF8F5] text-[#111111] font-[Poppins] font-normal min-h-screen">
      {/* ══ TOP NAVBAR ════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DF]">
        <div className="max-w-6xl mx-auto h-[64px] sm:h-[76px] px-4 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-[10px] sm:rounded-[12px] shadow-[0_4px_16px_rgba(105,11,27,0.15)] overflow-hidden shrink-0">
              <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[15px] sm:text-[18px] font-bold tracking-[-0.03em] text-[#111]">Abroad Simplified</div>
              <div className="hidden sm:block text-[9px] uppercase tracking-[0.16em] text-[#888] font-semibold">Study Abroad Guide</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/#universities"
              className="hidden md:flex text-[13px] font-medium text-[#666] hover:text-[#690B1B] transition-colors items-center gap-1"
            >
              ← All Destinations
            </Link>
            <Link
              href={authTarget}
              className="h-[38px] sm:h-[42px] px-5 sm:px-6 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all shadow-[0_4px_14px_rgba(105,11,27,0.2)] flex items-center gap-1.5"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ MAIN CONTAINER ══════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* ══ HERO SECTION ════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-5">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#F3D5DC] text-[11px] font-bold text-[#690B1B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B]" />
              <span>STUDY ABROAD GUIDE · 2026 EDITION</span>
            </div>

            {/* Heading */}
            <h1 className="text-[38px] sm:text-[52px] lg:text-[58px] font-extrabold tracking-[-0.035em] text-[#111111] leading-[1.06]">
              Study in <span className="text-[#690B1B]">{activeGuide.countryName}</span>
            </h1>

            {/* Description */}
            <p className="text-[14px] sm:text-[15.5px] text-[#444444] leading-relaxed max-w-[560px]">
              {activeGuide.heroDescription ||
                `Explore universities, admission requirements, exams, student visa process, costs, documents and application timeline to plan your studies in ${activeGuide.countryName}.`}
            </p>

            {/* 4 Concise Country-Specific Facts Micro-Cards */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-stretch">
              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>🎓</span> TUITION
                </div>
                <div className="text-[13px] sm:text-[13.5px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.heroFacts.tuition}
                </div>
              </div>
              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>🏠</span> LIVING COST
                </div>
                <div className="text-[13px] sm:text-[13.5px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.heroFacts.livingCost}
                </div>
              </div>
              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>🗣️</span> ENGLISH
                </div>
                <div className="text-[13px] sm:text-[13.5px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.heroFacts.englishBenchmark}
                </div>
              </div>
              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>🛂</span> VISA
                </div>
                <div className="text-[13px] sm:text-[13.5px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.heroFacts.studentVisa}
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[22px] overflow-hidden border border-[#EAE5DF] shadow-[0_12px_32px_rgba(0,0,0,0.06)] group bg-white">
              <img
                src={activeGuide.heroImage}
                alt={`Study in ${activeGuide.countryName}`}
                className="w-full h-[280px] sm:h-[340px] lg:h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </section>

        {/* ══ EXPLORE ANOTHER DESTINATION (DROPDOWN BAR) ════════════════ */}
        <section className="bg-white border border-[#EAE5DF] rounded-[14px] px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-bold text-[#888888]">
              EXPLORE ANOTHER DESTINATION
            </span>
            <span className="hidden sm:inline text-[#CCC]">·</span>
            <span className="text-[14px] sm:text-[15px] font-bold text-[#111111]">
              Choose your country
            </span>
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={activeGuide.slug}
              onChange={handleCountryChange}
              className="w-full bg-[#FAF8F5] border border-[#D9D3CC] rounded-[10px] px-3.5 py-2 text-[13px] font-bold text-[#111111] focus:outline-none focus:border-[#690B1B] transition-colors cursor-pointer appearance-none pr-8"
            >
              {countriesList.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#555] text-[12px]">
              ▼
            </div>
          </div>
        </section>

        {/* ══ DESTINATION OVERVIEW (WHY STUDY IN COUNTRY?) ══════════════ */}
        <section className="space-y-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              DESTINATION OVERVIEW
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
              Why study in {activeGuide.countryName}?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeGuide.whyStudyHere.map((item) => (
              <div
                key={item.num}
                className="bg-white border border-[#EAE5DF] rounded-[14px] p-5 hover:border-[#690B1B]/40 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2"
              >
                <div className="text-[13px] font-bold text-[#690B1B]">{item.num}</div>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#222222] font-medium leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ QUICK COUNTRY FACTS (BLACK STRIP) ════════════════════════ */}
        <section className="bg-[#111217] rounded-[18px] text-white p-6 sm:p-7 shadow-xl space-y-4 border border-white/[0.06]">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/90">
                QUICK COUNTRY FACTS
              </span>
            </div>
            <span className="text-[11px] text-white/40 font-medium">
              At a glance · {activeGuide.countryName}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch pt-1">
            {/* 1. Currency */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>🪙</span> CURRENCY
              </div>
              <div className="text-[14px] font-bold text-white mt-2 leading-snug">
                {activeGuide.quickFacts.currency}
              </div>
            </div>

            {/* 2. Visa */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>🛂</span> STUDENT VISA
              </div>
              <div className="text-[14px] font-bold text-white mt-2 leading-snug">
                {activeGuide.quickFacts.visa}
              </div>
            </div>

            {/* 3. Major Intakes */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>📅</span> MAJOR INTAKES
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(activeGuide.quickFacts.majorIntakes || '')
                  .split(/[·•]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-white/[0.08] text-white text-[11px] font-semibold border border-white/[0.1] hover:bg-white/[0.14] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            {/* 4. Popular Levels */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>🎓</span> POPULAR LEVELS
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(activeGuide.quickFacts.popularLevels || '')
                  .split(/[·•]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-white/[0.08] text-white text-[11px] font-semibold border border-white/[0.1] hover:bg-white/[0.14] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            {/* 5. Popular Fields */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>💼</span> POPULAR FIELDS
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(activeGuide.quickFacts.popularFields || '')
                  .split(/[·•]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-white/[0.08] text-white text-[11px] font-semibold border border-white/[0.1] hover:bg-white/[0.14] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                      {item}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 01 ADMISSION REQUIREMENTS ════════════════════════════════ */}
        <section id="01-admission" className="space-y-4 scroll-mt-24">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              01 ADMISSION
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
              Admission requirements for {activeGuide.countryName}
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
              A starting point — each university and course sets its own final criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
            {Object.entries(activeGuide.admissionRequirements).map(([key, item]) => {
              const icons: Record<string, string> = {
                academicQualification: '🎓',
                academicBenchmark: '📊',
                englishRequirement: '🗣️',
                applicationRequirement: '📝',
                majorIntakes: '📅',
              };
              return (
                <div
                  key={key}
                  className="bg-white border border-[#EAE5DF] rounded-[14px] p-4.5 flex flex-col justify-between h-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#777777]">
                        {item.title}
                      </span>
                      <span className="text-[13px] opacity-75">{icons[key] || '📌'}</span>
                    </div>
                    <div className="text-[13.5px] font-bold text-[#111111] mt-2.5 leading-snug min-h-[44px]">
                      {item.value}
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#F0EBE5] flex items-center">
                    <StatusBadge text={item.badge} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 02 TESTS & EXAMS ═════════════════════════════════════════ */}
        <section className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              02 TESTS & EXAMS
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
              Tests you may need for {activeGuide.countryName}
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
              Standardized language, aptitude and admissions tests commonly evaluated by {activeGuide.countryName} universities.
            </p>
          </div>

          <div className="bg-white border-t-2 border-t-[#111111] border-x border-b border-[#EAE5DF] rounded-b-[12px] overflow-x-auto shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-[#EAE5DF] bg-[#FAF8F5]/80">
                  <th className="py-3 px-5 text-[10.5px] font-bold uppercase tracking-wider text-[#666]">TEST</th>
                  <th className="py-3 px-5 text-[10.5px] font-bold uppercase tracking-wider text-[#666]">TYPICAL SCORE</th>
                  <th className="py-3 px-5 text-[10.5px] font-bold uppercase tracking-wider text-[#666]">VALIDITY</th>
                  <th className="py-3 px-5 text-[10.5px] font-bold uppercase tracking-wider text-[#666]">REQUIREMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DF]">
                {activeGuide.testsAndExams.map((t, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF8F5]/50 transition-colors">
                    <td className="py-3.5 px-5 text-[13px] font-bold text-[#111111]">{t.test}</td>
                    <td className="py-3.5 px-5 text-[13px] text-[#444444] font-medium">{t.score}</td>
                    <td className="py-3.5 px-5 text-[12.5px] text-[#666666]">{t.validity}</td>
                    <td className="py-3.5 px-5">
                      <StatusBadge text={t.requirement} variant={t.badgeVariant} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══ 03 STUDENT VISA PROCESS ══════════════════════════════════ */}
        <section className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              03 STUDENT VISA
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
              {activeGuide.countryName} student visa process
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
              A clear route from offer letter to arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-stretch">
            {activeGuide.visaProcess.map((step) => (
              <div
                key={step.step}
                className="bg-white border border-[#EAE5DF] rounded-[12px] p-4 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] relative hover:border-[#690B1B]/40 transition-all"
              >
                <div className="text-[12px] font-bold text-[#690B1B] mb-2">{step.step}</div>
                <div className="flex-1 flex flex-col justify-start">
                  <h3 className="text-[13px] font-bold text-[#111111] leading-tight min-h-[34px] flex items-start">
                    {step.title}
                  </h3>
                  <p className="text-[11.5px] text-[#555555] mt-2 leading-relaxed flex-1">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 04 COST OF STUDY ═════════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-[#FAF5F6] via-[#FAF8F5] to-[#F7EEF0] border border-[#F0DFE3] rounded-[18px] p-6 sm:p-8 space-y-5 shadow-[0_2px_12px_rgba(105,11,27,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                04 COST OF STUDY
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
                Cost of studying in {activeGuide.countryName}
              </h2>
              <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
                Reference figures for planning — actual costs vary by university, city, program and lifestyle.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white border border-[#E8C4CC] px-3.5 py-1.5 rounded-full text-[11.5px] font-bold text-[#690B1B] shrink-0 shadow-xs">
              <span>🗂️</span> Budget before you apply
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
            {[
              {
                key: 'tuition' as const,
                label: 'TUITION FEES',
                icon: '🎓',
                iconBg: 'bg-[#FAF0F2] text-[#690B1B] border-[#F3D5DC]',
                borderHover: 'hover:border-[#690B1B]/40',
              },
              {
                key: 'livingExpenses' as const,
                label: 'LIVING EXPENSES',
                icon: '🏠',
                iconBg: 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]',
                borderHover: 'hover:border-[#C2410C]/40',
              },
              {
                key: 'healthInsurance' as const,
                label: 'HEALTH INSURANCE',
                icon: '🛡️',
                iconBg: 'bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]',
                borderHover: 'hover:border-[#047857]/40',
              },
              {
                key: 'visaApplication' as const,
                label: 'VISA & FEES',
                icon: '📑',
                iconBg: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]',
                borderHover: 'hover:border-[#1D4ED8]/40',
              },
              {
                key: 'proofOfFunds' as const,
                label: 'PROOF OF FUNDS',
                icon: '💰',
                iconBg: 'bg-[#FAF5FF] text-[#7E22CE] border-[#F3E8FF]',
                borderHover: 'hover:border-[#7E22CE]/40',
              },
            ].map((cat) => {
              const raw = activeGuide.costOfStudy[cat.key] || '';
              // Smart parsing: separate primary monetary highlight from secondary contextual breakdown
              let primary = raw.trim();
              let secondary = '';
              const parenIdx = primary.indexOf('(');
              if (parenIdx !== -1) {
                secondary = primary.substring(parenIdx).trim();
                primary = primary.substring(0, parenIdx).trim();
                if (secondary.startsWith('(') && secondary.endsWith(')')) {
                  secondary = secondary.slice(1, -1).trim();
                }
              } else if (primary.includes(' + ')) {
                const parts = primary.split(' + ');
                primary = parts[0].trim();
                secondary = '+ ' + parts.slice(1).join(' + ').trim();
              }

              return (
                <div
                  key={cat.key}
                  className={`bg-white border border-[#EAE5DF] rounded-[14px] p-4.5 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${cat.borderHover} hover:shadow-md transition-all duration-200 h-full`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#777777]">
                        {cat.label}
                      </span>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] shrink-0 border ${cat.iconBg}`}
                      >
                        {cat.icon}
                      </span>
                    </div>
                    <div className="mt-2 mb-2.5">
                      <div className="text-[15.5px] sm:text-[16.5px] font-bold text-[#111111] tracking-[-0.02em] leading-snug">
                        {primary || '—'}
                      </div>
                    </div>
                  </div>
                  {secondary ? (
                    <div className="pt-2.5 mt-2 border-t border-[#F0EBE5] text-[11px] text-[#555555] leading-relaxed">
                      {secondary}
                    </div>
                  ) : (
                    <div className="pt-2.5 mt-2 border-t border-[#F0EBE5] text-[11px] text-[#888888] leading-relaxed italic">
                      Standard university & consular rate
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 05 WORK & POST-STUDY OPTIONS ═════════════════════════════ */}
        <section className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              05 WORK & POST-STUDY
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
              Work while studying & after graduation in {activeGuide.countryName}
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
              Part-time student employment rules and post-graduation stay-back permits in {activeGuide.countryName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Card: Part-time Work */}
            <div className="bg-white border border-[#EAE5DF] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF4F5] border border-[#F3E2E6] flex items-center justify-center text-[#690B1B]">
                  💼
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#888]">EMPLOYMENT</div>
                  <h3 className="text-[15px] font-bold text-[#111]">PART-TIME WORK</h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {activeGuide.workAndPostStudy.partTimeWork.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px] text-[#333] leading-relaxed">
                    <span className="text-[#0E7044] font-bold mt-0.5">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Card: Post-study Work (Dark Container) */}
            <div className="bg-[#111217] border border-white/10 rounded-[16px] p-6 shadow-lg text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#690B1B]/40 border border-[#690B1B]/60 flex items-center justify-center text-white">
                  🎓
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">STAY-BACK PERMIT</div>
                  <h3 className="text-[15px] font-bold text-white">POST-STUDY WORK</h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {activeGuide.workAndPostStudy.postStudyWork.map((psw, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px] text-gray-200 leading-relaxed">
                    <span className="text-[#EAB308] font-bold mt-0.5">✓</span>
                    <span>{psw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-[11.5px] text-[#777777] flex items-center gap-1.5 pt-1">
            <span>⚖</span> Rules may change. Verify current requirements before applying.
          </div>
        </section>

        {/* ══ 06 DOCUMENTS YOU'LL NEED ═════════════════════════════════ */}
        <section className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              06 DOCUMENTS
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
              Documents you’ll need for {activeGuide.countryName}
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
              Essential academic, financial and consular document checklist for {activeGuide.countryName}.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* University Application Column */}
            <div className="bg-white border border-[#EAE5DF] rounded-[16px] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-[16px] font-bold text-[#111111] border-b border-[#EAE5DF] pb-3">
                University application
              </h3>
              <div className="space-y-2.5">
                {activeGuide.documents.universityApplication.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-[#F4F1EC] last:border-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#888] text-[14px]">📄</span>
                      <span className="text-[13px] font-semibold text-[#222222]">{doc.name}</span>
                    </div>
                    <StatusBadge text={doc.status} variant={doc.badgeVariant} />
                  </div>
                ))}
              </div>
            </div>

            {/* Financial & Visa Column */}
            <div className="bg-white border border-[#EAE5DF] rounded-[16px] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-[16px] font-bold text-[#111111] border-b border-[#EAE5DF] pb-3">
                Financial & visa
              </h3>
              <div className="space-y-2.5">
                {activeGuide.documents.financialAndVisa.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-[#F4F1EC] last:border-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#888] text-[14px]">📑</span>
                      <span className="text-[13px] font-semibold text-[#222222]">{doc.name}</span>
                    </div>
                    <StatusBadge text={doc.status} variant={doc.badgeVariant} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 07 APPLICATION TIMELINE ══════════════════════════════════ */}
        <section className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              07 APPLICATION TIMELINE
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
              {activeGuide.countryName} application timeline
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
              A step-by-step preparation, testing, application and arrival roadmap for {activeGuide.countryName}.
            </p>
          </div>

          <div className="border-t-2 border-[#111111] pt-4 space-y-3">
            {activeGuide.timeline.map((stage) => (
              <div
                key={stage.step}
                className="bg-white border border-[#EAE5DF] rounded-[12px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#690B1B] text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                    {stage.step}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#111111]">{stage.title}</h3>
                    <p className="text-[12.5px] text-[#555555] mt-0.5">{stage.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#666666] bg-[#FAF8F5] border border-[#EAE5DF] px-3 py-1.5 rounded-[8px] shrink-0 self-start sm:self-auto">
                  <span>⏱</span> {stage.time}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ GOOD TO KNOW (IMPORTANT NOTES) ═══════════════════════════ */}
        <section className="bg-white border border-[#EAE5DF] rounded-[16px] p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="text-[16px]">💡</span>
            <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111111]">
              Good to Know for {activeGuide.countryName}
            </h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {activeGuide.goodToKnow.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-[#444] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B] mt-2 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ SOURCES / VERIFICATION BAR ═════════════════════════════ */}
        <div className="pt-6 border-t border-[#EAE5DF] flex flex-col sm:flex-row items-center justify-between text-[11.5px] text-[#888888] gap-3">
          <div>
            Last Verified: <span className="font-semibold text-[#555]">{activeGuide.lastVerified}</span>
          </div>
          <div>
            Source: <span className="font-semibold text-[#555]">{activeGuide.source}</span>
          </div>
        </div>

      </main>

      {/* ═══════════════════════════════════════════════════════════════
         FOOTER — Abroad Simplified Brand Footer
         ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#030303] px-4 sm:px-6 md:px-10 lg:px-16 pt-12 sm:pt-16 md:pt-20 pb-8 text-left text-white mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
            {/* BRAND */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 max-w-[300px]">
              <Link href="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
                <div className="w-[44px] h-[44px] rounded-[13px] overflow-hidden shadow-[0_6px_20px_rgba(105,11,27,0.3)] shrink-0">
                  <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-[20px] font-bold tracking-[-0.03em]">Abroad Simplified</span>
              </Link>
              <p className="mt-5 text-[#5E6168] text-[14px] leading-relaxed">
                Think Beyond Your Boundaries. Your ultimate AI-powered study abroad platform.
              </p>
            </div>

            {/* STUDY ABROAD GUIDES */}
            <div>
              <div className="text-[#C8A15D] text-[11px] tracking-[0.22em] uppercase font-bold mb-5">
                Country Guides
              </div>
              <div className="space-y-3.5">
                {[
                  { label: "Study in USA 🇺🇸", href: "/country-guide/usa" },
                  { label: "Study in UK 🇬🇧", href: "/country-guide/uk" },
                  { label: "Study in Canada 🇨🇦", href: "/country-guide/canada" },
                  { label: "Study in Germany 🇩🇪", href: "/country-guide/germany" },
                  { label: "Study in Australia 🇦🇺", href: "/country-guide/australia" },
                  { label: "Study in Ireland 🇮🇪", href: "/country-guide/ireland" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[14px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* PLATFORM TOOLS */}
            <div>
              <div className="text-[#C8A15D] text-[11px] tracking-[0.22em] uppercase font-bold mb-5">
                Platform Tools
              </div>
              <div className="space-y-3.5">
                {[
                  { label: "University Finder", href: "/#universities" },
                  { label: "AI Chance-Me Predictor", href: "/#chance-me" },
                  { label: "SOP & Essay Studio", href: "/dashboard/essays" },
                  { label: "Application Tracker", href: "/dashboard/tracker" },
                  { label: "Scholarship Matcher", href: "/#scholarships" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[14px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* COMPANY & LEGAL */}
            <div>
              <div className="text-[#C8A15D] text-[11px] tracking-[0.22em] uppercase font-bold mb-5">
                Company & Legal
              </div>
              <div className="space-y-3.5">
                {[
                  { label: "Home", href: "/" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Student Login", href: "/login" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[14px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="w-full h-px bg-white/10 mt-14 md:mt-16 mb-6" />

          {/* BOTTOM COPYRIGHT */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[#5E6168] text-[13px] text-center md:text-left">
              © 2026 Abroad Simplified. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-[#5E6168] text-[13px]">
              <Link href="/privacy" className="hover:text-white transition cursor-pointer">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition cursor-pointer">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
