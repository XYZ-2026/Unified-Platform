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
  CheckCircle2,
  DollarSign,
  Briefcase,
  GraduationCap,
  Calendar,
  Compass,
  FileText,
  HelpCircle,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronUp,
} from 'lucide-react';
import { COUNTRY_GUIDES, CountryGuideData } from '@/data/countryGuides';
import { useAuth } from '@/context/AuthContext';

// ─── REGIONS & FLAGS HELPER ──────────────────────────────────────────────────

interface CountryMeta {
  slug: string;
  name: string;
  flag: string;
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Latin America & Other';
  featured?: boolean;
}

const ALL_COUNTRIES_META: CountryMeta[] = [
  // Top 6 Featured
  { slug: 'usa', name: 'USA', flag: '🇺🇸', region: 'North America', featured: true },
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

  // Latin America & Middle East
  { slug: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Latin America & Other' },
  { slug: 'qatar', name: 'Qatar', flag: '🇶🇦', region: 'Latin America & Other' },
  { slug: 'saudi-arabia', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Latin America & Other' },
  { slug: 'turkey', name: 'Turkey', flag: '🇹🇷', region: 'Latin America & Other' },
  { slug: 'mexico', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
  { slug: 'brazil', name: 'Brazil', flag: '🇧🇷', region: 'Latin America & Other' },
  { slug: 'argentina', name: 'Argentina', flag: '🇦🇷', region: 'Latin America & Other' },
  { slug: 'chile', name: 'Chile', flag: '🇨🇱', region: 'Latin America & Other' },
  { slug: 'colombia', name: 'Colombia', flag: '🇨🇴', region: 'Latin America & Other' },
  { slug: 'south-africa', name: 'South Africa', flag: '🇿🇦', region: 'Latin America & Other' },
];

export default function CountryGuidesHubPage() {
  const router = useRouter();
  const { user } = useAuth();
  const authTarget = user ? '/dashboard' : '/login';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [showAllCards, setShowAllCards] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Filtered countries based on search and region
  const filteredCountries = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return ALL_COUNTRIES_META.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q);

      const matchRegion =
        selectedRegion === 'ALL' || c.region === selectedRegion;

      return matchSearch && matchRegion;
    });
  }, [searchTerm, selectedRegion]);

  // Top 6 Featured Country Guides
  const featuredGuides = useMemo(() => {
    return ALL_COUNTRIES_META.filter((c) => c.featured).map((meta) => {
      const guideData: CountryGuideData =
        COUNTRY_GUIDES[meta.slug] || COUNTRY_GUIDES.usa;
      return { meta, guide: guideData };
    });
  }, []);

  const handleCountrySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(`/country-guide/${val}`);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-[#FAF8F5] text-[#111111] font-[Poppins] font-normal min-h-screen flex flex-col">
      {/* ═══════════════════════════════════════════════════════════
         1. TOP NAVIGATION BAR
         ═══════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DF]">
        <div className="max-w-6xl mx-auto h-[64px] sm:h-[76px] px-4 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-[10px] sm:rounded-[12px] shadow-[0_4px_16px_rgba(105,11,27,0.15)] overflow-hidden shrink-0">
              <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[15px] sm:text-[18px] font-bold tracking-[-0.03em] text-[#111]">
                Abroad Simplified
              </div>
              <div className="hidden sm:block text-[9px] uppercase tracking-[0.16em] text-[#888] font-semibold">
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
            <Link href="/dashboard/essays" className="hover:text-[#690B1B] transition-colors">
              SOP &amp; Essays
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={authTarget}
              className="h-[38px] sm:h-[42px] px-5 sm:px-6 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all shadow-[0_4px_14px_rgba(105,11,27,0.2)] flex items-center gap-1.5 active:scale-95"
            >
              <span>{user ? 'Dashboard' : 'Get Started'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
         2. HERO SECTION & SEARCH TOOLBAR
         ═══════════════════════════════════════════════════════════ */}
      <header className="relative bg-gradient-to-b from-[#F3EEEA] via-[#FAF8F5] to-[#FAF8F5] border-b border-[#EAE5DF] py-12 sm:py-16 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          <div className="space-y-4 max-w-[840px]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF0F2] border border-[#F3D5DC] text-[11.5px] font-bold text-[#690B1B]">
              <Sparkles size={13} className="text-[#C9A55D]" />
              <span>50 GLOBAL STUDY DESTINATIONS · 2026 EDITION</span>
            </div>

            <h1 className="text-[34px] sm:text-[48px] lg:text-[54px] font-extrabold tracking-[-0.035em] text-[#111111] leading-[1.08]">
              Discover Your Ideal <br className="hidden sm:inline" />
              <span className="text-[#690B1B]">Study Abroad Destination</span>
            </h1>

            <p className="text-[14.5px] sm:text-[16px] text-[#555555] leading-relaxed max-w-[680px]">
              Compare verified tuition fees, living expenses, post-study work permits, admission benchmarks, and timelines across 50 top countries. Choose with complete clarity.
            </p>
          </div>

          {/* Search, Region Filter & Quick Dropdown */}
          <div className="bg-white border border-[#EAE5DF] rounded-[20px] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search 50 countries (e.g. Germany, UK, Australia, Singapore)..."
                  className="w-full h-[46px] pl-10 pr-4 rounded-[12px] bg-[#FAF8F5] border border-[#EAE5DF] text-[13.5px] text-[#111] placeholder:text-[#999] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              {/* Quick Jump Dropdown */}
              <div className="w-full md:w-[260px] shrink-0 relative">
                <select
                  onChange={handleCountrySelectChange}
                  defaultValue=""
                  className="w-full h-[46px] px-4 pr-10 rounded-[12px] bg-[#FAF8F5] border border-[#EAE5DF] text-[13px] font-semibold text-[#333] outline-none focus:border-[#690B1B] cursor-pointer appearance-none transition-all"
                >
                  <option value="" disabled>
                    ⚡ Quick Jump to Country...
                  </option>
                  {ALL_COUNTRIES_META.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777] pointer-events-none"
                />
              </div>
            </div>

            {/* Region Filter Tabs */}
            <div className="flex items-center justify-between border-t border-[#F0EBE6] pt-3 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {[
                  { id: 'ALL', label: 'All Destinations (50)' },
                  { id: 'North America', label: 'North America' },
                  { id: 'Europe', label: 'Europe (25+)' },
                  { id: 'Asia-Pacific', label: 'Asia-Pacific (11)' },
                  { id: 'Latin America & Other', label: 'Middle East & Others' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedRegion(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      selectedRegion === tab.id
                        ? 'bg-[#690B1B] text-white shadow-2xs'
                        : 'bg-[#FAF8F5] text-[#666] hover:bg-[#EAE5DF] hover:text-[#111]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <span className="text-[11.5px] text-[#888] font-medium">
                Showing {filteredCountries.length} countries
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
         3. FEATURED DESTINATIONS (TOP 6 CARDS)
         ═══════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20 flex-1">
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                RECOMMENDED DESTINATIONS
              </div>
              <h2 className="text-[26px] sm:text-[32px] font-extrabold tracking-[-0.03em] text-[#111] mt-1">
                Top 6 International Study Hubs
              </h2>
            </div>
            <p className="text-[13px] text-[#666] max-w-[420px] leading-relaxed">
              The most popular choices for 2026 admissions with globally ranked research universities and post-study work stay-back permits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuides.map(({ meta, guide }) => (
              <div
                key={meta.slug}
                className="bg-white border border-[#EAE5DF] rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(105,11,27,0.09)] hover:border-[#690B1B]/40 transition-all flex flex-col justify-between group"
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
                    
                    {/* Badge on Top Left */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[20px] filter drop-shadow-md">{meta.flag}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10.5px] font-bold text-[#111] shadow-xs">
                        {meta.region}
                      </span>
                    </div>

                    {/* Country Title on Bottom Left */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="text-[20px] font-bold leading-tight drop-shadow-sm">
                        {meta.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body & 4 Quick Facts */}
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
                        <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#888]">Visa</div>
                        <div className="text-[12px] font-bold text-[#690B1B] mt-0.5 truncate">
                          {guide.heroFacts.studentVisa}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
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
        </section>

        {/* ═══════════════════════════════════════════════════════════
           4. COMPLETE 50-COUNTRY DIRECTORY & DROPDOWN EXPANDER
           ═══════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-[#EAE5DF] rounded-[24px] p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EBE6] pb-5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                ALL DESTINATIONS
              </div>
              <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#111] mt-0.5">
                Complete 50-Country Guide Directory
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#777] font-medium">
                {filteredCountries.length} countries found
              </span>
              <button
                onClick={() => setShowAllCards(!showAllCards)}
                className="px-4 py-2 rounded-full bg-[#FAF8F5] border border-[#EAE5DF] hover:border-[#690B1B] text-[12px] font-bold text-[#111] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{showAllCards ? 'Show Compact' : 'Expand All 50'}</span>
                {showAllCards ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Grid of Countries */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {(showAllCards ? filteredCountries : filteredCountries.slice(0, 20)).map((c) => {
              const guide = COUNTRY_GUIDES[c.slug];
              const tuition = guide ? guide.heroFacts.tuition.split('/')[0].trim() : 'Varies';

              return (
                <Link
                  key={c.slug}
                  href={`/country-guide/${c.slug}`}
                  className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[14px] p-3.5 hover:border-[#690B1B] hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[24px] shrink-0 leading-none">{c.flag}</span>
                    <span className="text-[9px] font-bold text-[#888] uppercase tracking-wider truncate">
                      {c.region.split(' ')[0]}
                    </span>
                  </div>

                  <div>
                    <div className="text-[13px] font-bold text-[#111] group-hover:text-[#690B1B] transition-colors leading-snug line-clamp-1">
                      {c.name}
                    </div>
                    <div className="text-[10.5px] text-[#777] mt-0.5 truncate">
                      {tuition}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EAE5DF]/60 flex items-center justify-between text-[11px] font-semibold text-[#690B1B]">
                    <span>View Guide</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          {!showAllCards && filteredCountries.length > 20 && (
            <div className="text-center pt-2">
              <button
                onClick={() => setShowAllCards(true)}
                className="px-6 py-2.5 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all cursor-pointer shadow-xs active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>View All {filteredCountries.length} Countries</span>
                <ChevronDown size={14} />
              </button>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════
           5. SIDE-BY-SIDE COMPARISON MATRIX
           ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              AT A GLANCE
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-extrabold tracking-[-0.03em] text-[#111] mt-1">
              Top Destination Comparison Matrix
            </h2>
            <p className="text-[13.5px] text-[#555] max-w-[620px] mt-1">
              Compare average tuition costs, living expenses, post-study work authorization, and language benchmarks side by side.
            </p>
          </div>

          <div className="bg-white border border-[#EAE5DF] rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12.5px] min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE5DF] text-[#777] text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4 font-bold text-[#111]">Country</th>
                  <th className="py-3.5 px-4">Avg Tuition / Yr</th>
                  <th className="py-3.5 px-4">Living Cost / Mo</th>
                  <th className="py-3.5 px-4">Post-Study Work</th>
                  <th className="py-3.5 px-4">Part-Time Work</th>
                  <th className="py-3.5 px-4">Action</th>
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
                  {
                    slug: 'singapore',
                    name: 'Singapore',
                    flag: '🇸🇬',
                    tuition: 'SGD $18,000–$42,000',
                    living: 'SGD $1,200–$2,500',
                    psw: '1 Year LTVP / 3-Yr Bond',
                    work: '16 hrs/wk semester',
                  },
                ].map((row) => (
                  <tr key={row.slug} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#111] flex items-center gap-2">
                      <span className="text-[18px]">{row.flag}</span>
                      <span>{row.name}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#333]">{row.tuition}</td>
                    <td className="py-3 px-4 text-[#555]">{row.living}</td>
                    <td className="py-3 px-4 font-semibold text-[#0E7044]">{row.psw}</td>
                    <td className="py-3 px-4 text-[#555]">{row.work}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/country-guide/${row.slug}`}
                        className="text-[11.5px] font-bold text-[#690B1B] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Full Guide</span>
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
           6. 4-STEP COUNTRY SELECTION FRAMEWORK
           ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="text-center max-w-[680px] mx-auto">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              HOW TO CHOOSE
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-extrabold tracking-[-0.03em] text-[#111] mt-1">
              4-Step Framework to Pick Your Country
            </h2>
            <p className="text-[13.5px] text-[#555] mt-1.5">
              Follow this structured decision model to select the destination that best aligns with your budget, career goals, and academic background.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Budget & ROI',
                desc: 'Compare total tuition and living costs. Consider tuition-free destinations like Germany or 1-year Master’s in the UK and Ireland for faster ROI.',
                icon: DollarSign,
              },
              {
                step: '02',
                title: 'Stay-Back & Visas',
                desc: 'Evaluate post-study work rights: 3-year PGWP in Canada, 3-year STEM OPT in the USA, or 2-year Graduate Route in the UK and Ireland.',
                icon: Briefcase,
              },
              {
                step: '03',
                title: 'Language & Exams',
                desc: 'Check standardized test prerequisites (IELTS, TOEFL, Duolingo, GRE, GMAT). Some European destinations offer complete English waivers.',
                icon: GraduationCap,
              },
              {
                step: '04',
                title: 'Intake Timelines',
                desc: 'Plan 10–14 months ahead. Fall (August/September) offers the most scholarships; Spring (January/February) provides a flexible secondary entry.',
                icon: Calendar,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="bg-white border border-[#EAE5DF] rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3 relative hover:border-[#690B1B]/40 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-[12px] bg-[#FAF0F2] text-[#690B1B] flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="text-[20px] font-black text-[#EAE5DF]">{card.step}</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#111]">{card.title}</h3>
                  <p className="text-[12.5px] text-[#555] leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           7. GLOBAL ADMISSIONS TIMELINE OVERVIEW
           ═══════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-[#EAE5DF] rounded-[24px] p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE6] pb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                PLANNING ROADMAP
              </div>
              <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#111] mt-0.5">
                Global Study Abroad Application Timeline
              </h2>
            </div>
            <span className="text-[12px] font-bold text-[#690B1B] bg-[#FAF0F2] px-3 py-1 rounded-full">
              Fall 2026 Admissions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                time: '12–15 Months Before',
                title: 'Phase 1: Research & Exams',
                bullets: [
                  'Shortlist countries and programs',
                  'Register for IELTS / TOEFL / PTE',
                  'Prepare for GRE / GMAT if needed',
                ],
              },
              {
                time: '8–10 Months Before',
                title: 'Phase 2: Applications & SOP',
                bullets: [
                  'Draft Statements of Purpose (SOP)',
                  'Obtain Letters of Recommendation',
                  'Submit university application portals',
                ],
              },
              {
                time: '4–6 Months Before',
                title: 'Phase 3: Offers & Deposits',
                bullets: [
                  'Accept admission offers',
                  'Pay tuition deposits & get I-20/CAS/CoE',
                  'Arrange proof of living funds / blocked account',
                ],
              },
              {
                time: '1–3 Months Before',
                title: 'Phase 4: Visa & Departure',
                bullets: [
                  'File student visa application',
                  'Complete biometrics and medicals',
                  'Book flights and secure accommodation',
                ],
              },
            ].map((phase, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[16px] p-4 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-bold text-[#690B1B] uppercase tracking-wider">
                    {phase.time}
                  </div>
                  <h4 className="text-[14px] font-bold text-[#111] mt-1">{phase.title}</h4>
                  <ul className="mt-3 space-y-1.5 text-[12px] text-[#555]">
                    {phase.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <span className="text-[#690B1B] font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           8. FREQUENTLY ASKED QUESTIONS (FAQ)
           ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="text-center max-w-[620px] mx-auto">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              COMMON QUESTIONS
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-extrabold tracking-[-0.03em] text-[#111] mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="bg-white border border-[#EAE5DF] rounded-[20px] divide-y divide-[#F0EBE6] shadow-[0_2px_12px_rgba(0,0,0,0.02)] max-w-4xl mx-auto overflow-hidden">
            {[
              {
                q: 'Which countries offer tuition-free higher education for international students?',
                a: 'Germany is the most prominent destination where almost all public universities charge €0 tuition fees (only a small semester administrative fee of €150–€350 applies). Other affordable destinations include Austria, Norway (select public PhDs), and Italy (via need-based DSU regional scholarships).',
              },
              {
                q: 'Which study abroad countries offer the longest post-study work visas?',
                a: 'Canada offers up to 3 years through the Post-Graduation Work Permit (PGWP). The USA provides up to 3 years (12-month OPT + 24-month STEM extension). Australia offers 2 to 4 years through the Subclass 485 visa, and New Zealand provides up to 3 years of post-study work rights.',
              },
              {
                q: 'Can I study abroad without IELTS or by using the Duolingo English Test (DET)?',
                a: 'Yes! Ireland widely accepts the Duolingo English Test (DET). Many universities in the UK, USA, France, and Germany offer English language test waivers if your previous medium of instruction was entirely in English (MOI certificate) or based on strong high school English scores.',
              },
              {
                q: 'How much bank balance or proof of funds is required for student visas?',
                a: 'The living expenses benchmarks vary by destination: Germany requires €11,208 in a Blocked Account (Sperrkonto); Canada requires CAD $20,635 via a GIC; the UK requires 9 months of living expenses (~£9,207–£12,006) held for 28 consecutive days; and Australia requires demonstrated living funds of AUD $29,710.',
              },
              {
                q: 'What is the difference between Fall and Spring intakes?',
                a: 'Fall (August/September) is the primary intake globally, offering the widest range of courses, highest departmental scholarship availability, and on-campus recruitment cycles. Spring (January/February) is a flexible secondary intake ideal for students who missed Fall deadlines or required extra test preparation time.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-[14px] sm:text-[15px] text-[#111] hover:text-[#690B1B] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className="w-6 h-6 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                    {openFaqIndex === idx ? (
                      <ChevronUp size={16} className="text-[#690B1B]" />
                    ) : (
                      <ChevronDown size={16} className="text-[#888]" />
                    )}
                  </div>
                </button>
                {openFaqIndex === idx && (
                  <p className="mt-3 text-[13px] text-[#555] leading-relaxed pr-6 border-t border-[#F5F2EE] pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           9. BOTTOM CALL-TO-ACTION (CTA) BANNER
           ═══════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-8 sm:p-12 text-white text-center space-y-6 relative overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-white/3 rounded-full blur-2xl -mb-32 pointer-events-none" />

          <div className="max-w-[640px] mx-auto space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[11.5px] font-bold">
              <Sparkles size={14} />
              <span>Personalized Admissions Planning</span>
            </div>
            <h2 className="text-[28px] sm:text-[38px] font-bold leading-tight">
              Ready to Shortlist Your Universities?
            </h2>
            <p className="text-[14px] text-white/80 leading-relaxed">
              Explore our verified database of global universities or run an AI profile evaluation to calculate your exact admit odds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10 pt-2">
            <Link
              href="/dashboard/schools"
              className="w-full sm:w-auto h-[46px] px-7 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[13.5px] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <span>Explore University Finder</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard/chance-me"
              className="w-full sm:w-auto h-[46px] px-7 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-[13.5px] transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer active:scale-95"
            >
              <span>Run AI Chance-Me</span>
            </Link>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════
         10. GLOBAL FOOTER
         ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#EAE5DF] bg-white py-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#777]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111]">Abroad Simplified</span>
            <span>•</span>
            <span>© 2026 Admissions Hub. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/country-guide" className="hover:text-[#690B1B] transition-colors">
              Country Guides
            </Link>
            <Link href="/dashboard/schools" className="hover:text-[#690B1B] transition-colors">
              University Finder
            </Link>
            <Link href="/privacy" className="hover:text-[#690B1B] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
