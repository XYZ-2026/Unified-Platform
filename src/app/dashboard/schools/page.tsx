'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  GraduationCap,
  MapPin,
  DollarSign,
  ArrowRight,
  Sparkles,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Globe,
  BookOpen,
  TrendingUp,
  Building2,
  Award,
  Filter,
  CheckCircle2,
  X,
  FileText,
  ShieldCheck,
  Briefcase,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  HelpCircle,
  Eye,
  ArrowUpRight
} from 'lucide-react';

/* ─── Interfaces ─────────────────────────────────────────── */

interface University {
  id: string;
  universityId: string;
  name: string;
  country: string;
  countryCode: string;
  state: string;
  qsRanking: string;
  tuition: string;
  livingCosts: string;
  acceptanceRate: string;
  website: string;
  bannerImage?: string;
  bannerAlt: string;
  popularMajors: string[];
  slug: string;
  careerOutcomes?: string;
  expectedSalary?: string;
  roi?: string;
  // Country-specific parameters
  dliNumber?: string;
  internationalEligible?: string;
  province?: string;
  city?: string;
  offersUndergraduate?: string;
  offersPostgraduate?: string;
  offersDoctoral?: string;
  languageOfInstruction?: string;
  avgNeedBasedGrant?: string;
  avgGpa?: number | string;
  satScore?: string;
  scholarships?: string;
  type?: string;
  // Germany-specific parameters
  apsCertificateRequired?: string;
  ncNumerusClausus?: string;
  ncGradeCutoff?: string;
  hzb?: string;
  studienkollegRequired?: string;
  uniAssistApplication?: string;
  hochschulstartApplication?: string;
  semesterContribution?: string;
  semesterTicket?: string;
  bwTuitionFee?: string;
  ectsRequirements?: string;
  germanLanguageRequirement?: string;
  testDaF?: string;
  dsh?: string;
  blockedAccountProofOfFunds?: string;
  winterSemester?: string;
  summerSemester?: string;
  indianQualificationEquivalency?: string;
  anabinRecognition?: string;
  countrySpecificRequirements?: string;
}

// Client-side cache for instant search and pagination
const clientUniCache = new Map<string, { universities: University[]; totalCount: number; totalPages: number }>();

// Country flag emoji mapping
function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    US: '🇺🇸', GB: '🇬🇧', UK: '🇬🇧', CA: '🇨🇦', DE: '🇩🇪',
    AU: '🇦🇺', FR: '🇫🇷', NL: '🇳🇱', SG: '🇸🇬', IN: '🇮🇳',
    CN: '🇨🇳', JP: '🇯🇵', KR: '🇰🇷', CH: '🇨🇭', SE: '🇸🇪',
    IE: '🇮🇪', NZ: '🇳🇿', IT: '🇮🇹', ES: '🇪🇸', HK: '🇭🇰',
  };
  return flags[code?.toUpperCase()] || '🌍';
}

// University type/logo mapping
function getUniversityEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('institute') || lower.includes('technology')) return '⚙️';
  if (lower.includes('medical') || lower.includes('health')) return '🏥';
  if (lower.includes('art') || lower.includes('design') || lower.includes('music')) return '🎨';
  if (lower.includes('law')) return '⚖️';
  if (lower.includes('community') || lower.includes('college')) return '🎓';
  if (lower.includes('state')) return '🏛️';
  return '🏫';
}

function formatRank(rank?: string): string {
  if (!rank || rank === 'Unranked') return '—';
  const clean = rank.trim().replace(/^#+/, '#');
  if (clean.startsWith('#')) return clean;
  if (/^\d+$/.test(clean)) return `#${clean} QS World`;
  return `#${clean}`;
}

function formatAcceptance(acc?: string, countryCode?: string): string {
  if (!acc || acc === 'N/A') return 'Selective Admission';
  const clean = acc.trim();
  if (clean.length > 25) {
    if (countryCode === 'DE' || clean.toLowerCase().includes('medicine') || clean.toLowerCase().includes('nc')) {
      return 'NC Restricted';
    }
    return 'Selective Admission';
  }
  if (clean.toLowerCase().includes('acceptance') || clean.toLowerCase().includes('admission') || clean.toLowerCase().includes('restricted')) {
    return clean;
  }
  return `${clean} Acceptance`;
}

function formatRoiBadge(roi?: string): string {
  if (!roi) return 'High';
  const lower = roi.toLowerCase();
  if (lower.includes('exceptional')) return 'Exceptional';
  if (lower.includes('very good')) return 'Very Good';
  if (lower.includes('high')) return 'High';
  if (lower.includes('positive')) return 'Positive';
  const match = roi.match(/(\d+%\s*(?:\([^)]*\))?)/);
  if (match) return match[1];
  if (roi.length > 20) return roi.slice(0, 18) + '…';
  return roi;
}

function formatCardTuition(tuition?: string, isGermany?: boolean): string {
  if (!tuition || tuition === 'N/A') return 'Contact Uni';
  const t = tuition.trim();
  if (isGermany) {
    if (t.includes('1,500') || t.includes('1500')) return '€1,500/sem';
    if (t.toLowerCase().includes('free') || t.includes('€0')) return '€0 (Free)';
    if (t.length > 14) return t.slice(0, 13) + '…';
    return t;
  }
  // Canada CAD range: e.g. "$28,000 - $38,000 CAD/yr (Intl)..."
  const cadRangeMatch = t.match(/([\d,]+)\s*(?:-|–)\s*[\$]?([\d,]+)\s*CAD/i);
  if (cadRangeMatch) {
    const minK = Math.round(parseInt(cadRangeMatch[1].replace(/,/g, ''), 10) / 1000);
    const maxK = Math.round(parseInt(cadRangeMatch[2].replace(/,/g, ''), 10) / 1000);
    return `CAD ${minK}K–${maxK}K`;
  }
  if (t.toUpperCase().includes('CAD')) {
    const singleCad = t.match(/([\d,]+)\s*CAD/i);
    if (singleCad) return `CAD ${singleCad[1]}`;
  }
  const firstPart = t.split('|')[0].trim();
  if (firstPart.length > 16) return firstPart.slice(0, 15) + '…';
  return firstPart;
}

function formatCardAcceptance(acc?: string, countryCode?: string): string {
  if (!acc || acc === 'N/A') return 'Selective';
  const clean = acc.trim();
  if (countryCode === 'DE' && (clean.toLowerCase().includes('nc') || clean.toLowerCase().includes('medicine'))) {
    return 'NC Restricted';
  }
  const pctMatch = clean.match(/(\d+(?:\.\d+)?%)/);
  if (pctMatch) {
    if (clean.includes('~') || clean.toLowerCase().includes('approx')) {
      return `~${pctMatch[1]}`;
    }
    return pctMatch[1];
  }
  if (clean.toLowerCase().includes('restricted')) return 'NC Restricted';
  if (clean.toLowerCase().includes('open')) return 'Open';
  if (clean.toLowerCase().includes('selective')) return 'Selective';
  if (clean.length > 14) return clean.slice(0, 13) + '…';
  return clean;
}

function getCardCallout(u: University): { label: string; badge: string; color: string; badgeColor: string } {
  const isCanada = u.countryCode === 'CA' || u.country.toLowerCase().includes('canada');
  const isGermany = u.countryCode === 'DE' || u.country.toLowerCase().includes('germany');
  const isUS = u.countryCode === 'US' || u.country.toLowerCase().includes('united states') || u.country.toLowerCase().includes('usa');
  const isUK = u.countryCode === 'UK' || u.countryCode === 'GB' || u.country.toLowerCase().includes('kingdom') || u.country.toLowerCase().includes('britain');
  const isAU = u.countryCode === 'AU' || u.country.toLowerCase().includes('australia');

  if (isCanada) {
    return {
      label: `DLI: ${u.dliNumber || 'O19209939222'}`,
      badge: 'GIC: CAD 20,635',
      color: 'text-[#2E7D32]',
      badgeColor: 'text-[#690B1B]',
    };
  }
  if (isGermany) {
    return {
      label: 'APS: Mandatory',
      badge: 'Blocked: €11,904',
      color: 'text-[#1565C0]',
      badgeColor: 'text-[#690B1B]',
    };
  }
  if (isUS) {
    return {
      label: 'STEM OPT: 3 Years',
      badge: 'F-1 Visa',
      color: 'text-[#1565C0]',
      badgeColor: 'text-[#690B1B]',
    };
  }
  if (isUK) {
    return {
      label: 'Graduate Route: 2-Yr',
      badge: 'CAS Visa',
      color: 'text-[#6A1B9A]',
      badgeColor: 'text-[#690B1B]',
    };
  }
  if (isAU) {
    return {
      label: 'CRICOS Registered',
      badge: '485 Work Visa',
      color: 'text-[#B45309]',
      badgeColor: 'text-[#690B1B]',
    };
  }
  return {
    label: 'Verified Partner',
    badge: 'Study Roadmap',
    color: 'text-[#555]',
    badgeColor: 'text-[#690B1B]',
  };
}

/* ─── Country Header Configurations ─────────────────────── */

interface CountryConfig {
  title: string;
  flag: string;
  subtitle: string;
  badges: Array<{ label: string; icon: string; color: string }>;
  guideUrl?: string;
  guideLabel?: string;
}

const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  ALL: {
    title: 'Global University Directory',
    flag: '🌍',
    subtitle: 'Explore verified universities across the United States, Canada, Germany, United Kingdom, and Australia with live datasets and country-specific admissions matrices.',
    badges: [
      { label: 'Wix Studio CMS Connected', icon: '✨', color: 'bg-[#C9A55D]/20 text-[#C9A55D]' },
      { label: '117 Canadian DLI Unis', icon: '🍁', color: 'bg-white/10 text-white/90' },
      { label: '45 German Unis (€0 Tuition)', icon: '🇩🇪', color: 'bg-white/10 text-white/90' },
      { label: 'US 24-Point Matrix', icon: '🇺🇸', color: 'bg-white/10 text-white/90' },
      { label: 'UK & Australia Hubs', icon: '🌐', color: 'bg-white/10 text-white/90' },
    ],
  },
  CA: {
    title: 'Canada Admissions Hub 🇨🇦',
    flag: '🇨🇦',
    subtitle: 'Verified DLI-designated universities with official IRCC DLI numbers, 3-year PGWP eligibility, Express Entry PR pathway, and tuition in CAD.',
    badges: [
      { label: 'DLI Verified & PGWP', icon: '🍁', color: 'bg-[#E8F5E9] text-[#2E7D32]' },
      { label: 'CAD 20,635 GIC Proof', icon: '💰', color: 'bg-[#EFF5FF] text-[#1565C0]' },
      { label: '3-Year Post-Grad Permit', icon: '🛂', color: 'bg-[#F3E5F5] text-[#6A1B9A]' },
      { label: 'Express Entry PR Pathway', icon: '🏡', color: 'bg-[#FFF8E6] text-[#B45309]' },
    ],
    guideUrl: '/country/canada',
    guideLabel: 'Explore Full 34-Column Canada Guide →',
  },
  US: {
    title: 'United States Admissions Hub 🇺🇸',
    flag: '🇺🇸',
    subtitle: 'Comprehensive 24-parameter directory covering tuition, need-based aid packages, Common App essays, SAT/GPA cutoffs, and 3-year STEM OPT.',
    badges: [
      { label: 'Common App Essays', icon: '📝', color: 'bg-[#EFF5FF] text-[#1565C0]' },
      { label: 'Need-Based Aid ($24.5K+ Avg)', icon: '💵', color: 'bg-[#E8F5E9] text-[#2E7D32]' },
      { label: '3-Year STEM OPT', icon: '🔬', color: 'bg-[#F3E5F5] text-[#6A1B9A]' },
      { label: 'F-1 Visa Roadmap', icon: '🛂', color: 'bg-[#FFF8E6] text-[#B45309]' },
    ],
    guideUrl: '/country/usa',
    guideLabel: 'Explore Full 24-Column US Guide →',
  },
  DE: {
    title: 'Germany Admissions Hub 🇩🇪',
    flag: '🇩🇪',
    subtitle: 'Tuition-free world-class public universities, automotive and mechanical engineering leaders, and 18-month job seeker visa.',
    badges: [
      { label: '€0 Tuition Public', icon: '💸', color: 'bg-[#E8F5E9] text-[#2E7D32]' },
      { label: '18-Mo Job Seeker Visa', icon: '🛂', color: 'bg-[#EFF5FF] text-[#1565C0]' },
      { label: 'English-Taught Degrees', icon: '🌐', color: 'bg-[#F3E5F5] text-[#6A1B9A]' },
      { label: 'Schengen 26-Country Travel', icon: '🌍', color: 'bg-[#FFF8E6] text-[#B45309]' },
    ],
    guideUrl: '/country/germany',
    guideLabel: 'Explore Germany Admissions Guide →',
  },
  UK: {
    title: 'United Kingdom Admissions Hub 🇬🇧',
    flag: '🇬🇧',
    subtitle: 'Historic Russell Group institutions, 2-year Graduate Route visa, 1-year accelerated master’s programs, and CAS visa support.',
    badges: [
      { label: 'Russell Group Elite', icon: '🏛️', color: 'bg-[#EFF5FF] text-[#1565C0]' },
      { label: '2-Year Graduate Route', icon: '🇬🇧', color: 'bg-[#E8F5E9] text-[#2E7D32]' },
      { label: '1-Year Master’s', icon: '⏱️', color: 'bg-[#F3E5F5] text-[#6A1B9A]' },
      { label: 'NHS Health Surcharge', icon: '🏥', color: 'bg-[#FFF8E6] text-[#B45309]' },
    ],
  },
  AU: {
    title: 'Australia Admissions Hub 🇦🇺',
    flag: '🇦🇺',
    subtitle: 'Group of Eight (Go8) research powerhouses, CRICOS accredited degrees, generous post-study work streams, and top global liveability.',
    badges: [
      { label: 'Group of Eight (Go8)', icon: '🦘', color: 'bg-[#EFF5FF] text-[#1565C0]' },
      { label: 'CRICOS Accredited', icon: '📜', color: 'bg-[#E8F5E9] text-[#2E7D32]' },
      { label: 'Subclass 485 Visa', icon: '🛂', color: 'bg-[#F3E5F5] text-[#6A1B9A]' },
      { label: 'High Student Minimum Wage', icon: '💼', color: 'bg-[#FFF8E6] text-[#B45309]' },
    ],
  },
};

export default function UniversityFinderPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectivityFilter, setSelectivityFilter] = useState<'ALL' | 'HIGH' | 'MED' | 'ACC'>('ALL');
  const [sortBy, setSortBy] = useState<'default' | 'rank' | 'acceptance_low' | 'acceptance_high'>('default');

  // Quick View Modal State
  const [modalUniversity, setModalUniversity] = useState<University | null>(null);

  const ITEMS_PER_PAGE = 30;

  // Snappy debounce for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 120);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page on country change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry]);

  // Fetch universities from API with client cache
  const fetchUniversities = useCallback(async () => {
    const cacheKey = `${currentPage}-${debouncedSearch}-${selectedCountry}`;

    if (clientUniCache.has(cacheKey)) {
      const cached = clientUniCache.get(cacheKey)!;
      setUniversities(cached.universities);
      setTotalCount(cached.totalCount);
      setTotalPages(cached.totalPages);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedCountry !== 'ALL') params.set('country', selectedCountry);

      const res = await fetch(`/api/wix/universities?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.universities)) {
        setUniversities(data.universities);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        clientUniCache.set(cacheKey, {
          universities: data.universities,
          totalCount: data.totalCount || 0,
          totalPages: data.totalPages || 1,
        });
      } else {
        setUniversities([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.warn('Error fetching universities:', err);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedCountry]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // Filter & Sort results client-side for selectivity
  const displayedUniversities = useMemo(() => {
    let list = [...universities];

    if (selectivityFilter !== 'ALL') {
      list = list.filter((u) => {
        const rateMatch = u.acceptanceRate.match(/(\d+(\.\d+)?)/);
        const rate = rateMatch ? parseFloat(rateMatch[1]) : 50;
        if (selectivityFilter === 'HIGH') return rate < 20;
        if (selectivityFilter === 'MED') return rate >= 20 && rate <= 50;
        if (selectivityFilter === 'ACC') return rate > 50;
        return true;
      });
    }

    if (sortBy === 'rank') {
      list.sort((a, b) => {
        const rankA = parseInt(a.qsRanking.replace(/[^\d]/g, '')) || 9999;
        const rankB = parseInt(b.qsRanking.replace(/[^\d]/g, '')) || 9999;
        return rankA - rankB;
      });
    } else if (sortBy === 'acceptance_low') {
      list.sort((a, b) => {
        const rateA = parseFloat(a.acceptanceRate.match(/\d+(\.\d+)?/)?.[0] || '100');
        const rateB = parseFloat(b.acceptanceRate.match(/\d+(\.\d+)?/)?.[0] || '100');
        return rateA - rateB;
      });
    } else if (sortBy === 'acceptance_high') {
      list.sort((a, b) => {
        const rateA = parseFloat(a.acceptanceRate.match(/\d+(\.\d+)?/)?.[0] || '0');
        const rateB = parseFloat(b.acceptanceRate.match(/\d+(\.\d+)?/)?.[0] || '0');
        return rateB - rateA;
      });
    }

    return list;
  }, [universities, selectivityFilter, sortBy]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);
  const activeConfig = COUNTRY_CONFIGS[selectedCountry] || COUNTRY_CONFIGS.ALL;

  return (
    <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">

      {/* ══ HERO PROMO BANNER (COUNTRY-AWARE) ══════════════════════ */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-8 text-white shadow-sm space-y-4 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-white/3 rounded-full blur-2xl -mb-32 pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[12px] font-bold">
            <Sparkles size={14} />
            <span>{selectedCountry === 'ALL' ? 'Verified Global Admissions Database' : `${activeConfig.title} Database`}</span>
          </div>

          <div className="flex items-center gap-2">
            {activeConfig.guideUrl && (
              <Link
                href={activeConfig.guideUrl}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C9A55D] hover:bg-[#D4B36D] text-[#530816] text-[12px] font-bold transition-all shadow-xs"
              >
                <span>{activeConfig.guideLabel || 'View Guide'}</span>
                <ArrowRight size={13} />
              </Link>
            )}

            <button
              onClick={fetchUniversities}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-[12px] font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="relative z-10 space-y-2">
          <h2 className="text-[28px] md:text-[36px] font-bold leading-tight">
            {activeConfig.title}
          </h2>
          <p className="text-[14px] text-white/80 max-w-[760px] leading-relaxed">
            {activeConfig.subtitle}
          </p>
        </div>

        {/* Dynamic Country Pill Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 relative z-10">
          {activeConfig.badges.map((b) => (
            <span
              key={b.label}
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${b.color} shadow-2xs`}
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </span>
          ))}

          {activeConfig.guideUrl && (
            <Link
              href={activeConfig.guideUrl}
              className="sm:hidden inline-flex items-center gap-1 text-[11px] font-bold text-[#C9A55D] underline ml-1"
            >
              <span>Open Guide ↗</span>
            </Link>
          )}
        </div>
      </div>

      {/* ══ SEARCH AND FILTERS TOOLBAR ═════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs space-y-4">
        
        {/* Country Filter Tabs (Snappy & Prominent) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { code: 'ALL', label: 'All Countries', flag: '🌍' },
            { code: 'US', label: 'United States', flag: '🇺🇸', highlight: '24 Points' },
            { code: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
            { code: 'CA', label: 'Canada', flag: '🇨🇦', highlight: '34 Columns • 117 Unis' },
            { code: 'DE', label: 'Germany', flag: '🇩🇪', highlight: '25 Columns • 45 Unis' },
            { code: 'AU', label: 'Australia', flag: '🇦🇺' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => setSelectedCountry(item.code)}
              className={`px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 border ${
                selectedCountry === item.code
                  ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-sm'
                  : 'bg-[#F7F5F3] text-[#555] border-[#E7E2DE] hover:bg-[#EBE6E1] hover:text-[#111]'
              }`}
            >
              <span className="text-[15px]">{item.flag}</span>
              <span>{item.label}</span>
              {item.highlight && (
                <span
                  className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    selectedCountry === item.code
                      ? 'bg-white/20 text-[#C9A55D]'
                      : 'bg-[#EAE4DC] text-[#690B1B]'
                  }`}
                >
                  {item.highlight}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input & Selectivity / View Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${
                selectedCountry === 'CA' ? 'Canada (Acadia, U of T, McGill...)' :
                selectedCountry === 'DE' ? 'Germany (Heidelberg, TUM, LMU...)' :
                selectedCountry === 'US' ? 'United States (Harvard, MIT, Stanford...)' :
                selectedCountry === 'UK' ? 'United Kingdom (Oxford, Cambridge, UCL...)' :
                selectedCountry === 'AU' ? 'Australia (Melbourne, Sydney, UNSW...)' :
                'university name, state, major...'
              }`}
              className="w-full h-[46px] pl-11 pr-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] placeholder:text-[#999] outline-none focus:border-[#690B1B] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#111] text-[13px]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Selectivity Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectivityFilter}
              onChange={(e) => setSelectivityFilter(e.target.value as any)}
              className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#444] font-semibold outline-none focus:border-[#690B1B] cursor-pointer"
            >
              <option value="ALL">All Selectivity Levels</option>
              <option value="HIGH">Highly Selective (&lt;20%)</option>
              <option value="MED">Selective (20–50%)</option>
              <option value="ACC">Accessible (&gt;50%)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-[46px] px-3 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#444] font-semibold outline-none focus:border-[#690B1B] cursor-pointer"
            >
              <option value="default">Sort: Recommended</option>
              <option value="rank">QS Rank (Top First)</option>
              <option value="acceptance_low">Acceptance (Lowest)</option>
              <option value="acceptance_high">Acceptance (Highest)</option>
            </select>
          </div>

          {/* View Mode Toggle Switcher */}
          <div className="sm:col-span-2 flex items-center justify-end">
            <div className="inline-flex rounded-[12px] border border-[#E7E2DE] bg-[#FDFCFB] p-1 w-full justify-between">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-[9px] text-[12px] font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#690B1B] text-white shadow-2xs'
                    : 'text-[#666] hover:text-[#111]'
                }`}
              >
                <LayoutGrid size={14} />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-[9px] text-[12px] font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#690B1B] text-white shadow-2xs'
                    : 'text-[#666] hover:text-[#111]'
                }`}
              >
                <TableIcon size={14} />
                <span>Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Meta Bar */}
        <div className="flex items-center justify-between border-t border-[#F0EBE6] pt-3 text-[12px] text-[#777]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
            <span className="font-medium">
              {loading
                ? 'Loading universities...'
                : `${totalCount.toLocaleString()} universities found in catalog`}
            </span>
            {(searchTerm || selectivityFilter !== 'ALL' || sortBy !== 'default') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectivityFilter('ALL');
                  setSortBy('default');
                }}
                className="text-[#690B1B] font-bold underline hover:text-[#7A1022] ml-2 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {totalCount > 0 && (
            <span className="font-medium hidden sm:inline">
              Showing {startIndex}–{endIndex} of {totalCount.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* ══ UNIVERSITY DISPLAY (CARDS OR TABLE) ═════════════════════ */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-16 bg-gray-100 rounded-xl" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-100 rounded-full" />
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedUniversities.length === 0 ? (
        <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F7F0F1] text-[#690B1B] mx-auto flex items-center justify-center">
            <GraduationCap size={28} />
          </div>
          <h3 className="text-[20px] font-bold text-[#111]">
            {searchTerm ? `No universities found for "${searchTerm}"` : 'No universities match your filters'}
          </h3>
          <p className="text-[14px] text-[#777] max-w-[460px] mx-auto leading-relaxed">
            Try switching country tabs, loosening your selectivity criteria, or clearing your search term.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCountry('ALL');
              setSelectivityFilter('ALL');
              setSortBy('default');
            }}
            className="px-5 py-2.5 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all cursor-pointer shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* ─── CARDS VIEW ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {displayedUniversities.map((u) => {
            const isCanada = u.countryCode === 'CA' || u.country.toLowerCase().includes('canada');
            const isUS = u.countryCode === 'US' || u.country.toLowerCase().includes('united states');
            const isGermany = u.countryCode === 'DE' || u.country.toLowerCase().includes('germany');
            const callout = getCardCallout(u);

            return (
              <div
                key={u.id}
                className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs hover:border-[#690B1B] hover:shadow-md transition-all flex flex-col justify-between h-[360px] group relative"
              >
                {/* Upper Content Block */}
                <div className="space-y-3">
                  {/* Header: fixed height 72px */}
                  <div className="flex items-start gap-3 h-[72px]">
                    <div className="w-12 h-12 rounded-[14px] bg-[#F7F0F1] border border-[#690B1B]/10 flex items-center justify-center text-[22px] shrink-0 shadow-2xs mt-0.5">
                      {getUniversityEmoji(u.name)}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                      {/* Identity Row: fixed height 18px */}
                      <div className="h-[18px] flex items-center gap-1.5 overflow-hidden">
                        {u.universityId && (
                          <span className="font-mono text-[9px] font-bold text-[#690B1B] bg-[#FDF0F2] px-1.5 py-0.2 rounded border border-[#F0C9D0] shrink-0">
                            {u.universityId}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-[#555] flex items-center gap-1 truncate shrink-0">
                          <span>{getCountryFlag(u.countryCode)}</span>
                          <span className="truncate max-w-[105px]">{u.state || u.province || u.country}</span>
                        </span>
                        {isCanada && (
                          <span className="text-[9px] font-bold bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.2 rounded border border-[#A5D6A7] shrink-0">
                            PGWP ✓
                          </span>
                        )}
                        {isGermany && (
                          <span className="text-[9px] font-bold bg-[#EFF5FF] text-[#1565C0] px-1.5 py-0.2 rounded border border-[#BFDBFE] shrink-0">
                            €0 Tuition
                          </span>
                        )}
                        {isUS && (
                          <span className="text-[9px] font-bold bg-[#EFF5FF] text-[#1565C0] px-1.5 py-0.2 rounded border border-[#BFDBFE] shrink-0">
                            STEM OPT
                          </span>
                        )}
                      </div>

                      {/* Title: 2 lines locked at 42px */}
                      <Link href={`/dashboard/schools/${u.slug}`} className="block">
                        <h3
                          className="text-[14.5px] font-bold text-[#111] leading-[21px] line-clamp-2 group-hover:text-[#690B1B] transition-colors h-[42px] overflow-hidden"
                          title={u.name}
                        >
                          {u.name}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  {/* Standardized 3-Column Metric Box: fixed height 58px */}
                  <div className="grid grid-cols-3 gap-1.5 p-2 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] h-[58px] items-center">
                    <div className="text-center min-w-0">
                      <div className="text-[9px] text-[#888] font-semibold uppercase tracking-wider">QS Rank</div>
                      <div className="text-[12px] font-bold text-[#690B1B] mt-0.5 truncate px-0.5" title={formatRank(u.qsRanking)}>
                        {formatRank(u.qsRanking)}
                      </div>
                    </div>
                    <div className="text-center border-x border-[#E7E2DE] min-w-0">
                      <div className="text-[9px] text-[#888] font-semibold uppercase tracking-wider">
                        {isGermany ? 'Semester Fee' : 'Tuition / yr'}
                      </div>
                      <div className="text-[12px] font-bold text-[#111] mt-0.5 truncate px-0.5" title={u.tuition}>
                        {formatCardTuition(u.tuition, isGermany)}
                      </div>
                    </div>
                    <div className="text-center min-w-0">
                      <div className="text-[9px] text-[#888] font-semibold uppercase tracking-wider">Accept</div>
                      <div className="text-[12px] font-bold text-[#16a34a] mt-0.5 truncate px-0.5" title={formatAcceptance(u.acceptanceRate, u.countryCode)}>
                        {formatCardAcceptance(u.acceptanceRate, u.countryCode)}
                      </div>
                    </div>
                  </div>

                  {/* Universal Country Callout Box: fixed height 34px */}
                  <div className="h-[34px] bg-[#FAF8F5] border border-[#EAE4DC] rounded-[10px] px-2.5 flex items-center justify-between text-[11px] shrink-0">
                    <div className={`flex items-center gap-1.5 font-bold ${callout.color}`}>
                      <ShieldCheck size={13} className="shrink-0" />
                      <span className="truncate max-w-[160px]">{callout.label}</span>
                    </div>
                    <span className={`font-semibold shrink-0 ${callout.badgeColor}`}>{callout.badge}</span>
                  </div>

                  {/* Popular Majors Row: fixed height 26px */}
                  <div className="h-[26px] overflow-hidden flex items-center gap-1.5 flex-nowrap">
                    {u.popularMajors && u.popularMajors.length > 0 ? (
                      <>
                        {u.popularMajors.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-[#F7F5F3] text-[#555] px-2 py-0.5 rounded-md font-medium shrink-0 max-w-[130px] truncate"
                            title={tag}
                          >
                            {tag}
                          </span>
                        ))}
                        {u.popularMajors.length > 2 && (
                          <span className="text-[10px] text-[#888] px-1 py-0.5 font-medium shrink-0">
                            +{u.popularMajors.length - 2} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[10.5px] text-[#888] font-medium flex items-center gap-1">
                        <BookOpen size={11} className="text-[#C9A55D]" />
                        <span>Comprehensive Degree Catalog</span>
                      </span>
                    )}
                  </div>

                  {/* Outcomes & Salary / ROI Row: fixed height 26px */}
                  <div className="h-[26px] flex items-center gap-1.5 overflow-hidden">
                    {u.roi ? (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full shrink-0 max-w-[140px] truncate shadow-2xs"
                        title={u.roi}
                      >
                        <TrendingUp size={11} className="shrink-0" />
                        <span>ROI: {formatRoiBadge(u.roi)}</span>
                      </span>
                    ) : null}
                    {u.expectedSalary ? (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#854D0E] bg-[#FEF9C3] border border-[#FEF08A] px-2 py-0.5 rounded-full shrink-0 max-w-[150px] truncate"
                        title={u.expectedSalary}
                      >
                        <span>Exp: {u.expectedSalary.split('(')[0].trim()}</span>
                      </span>
                    ) : null}
                    {!u.roi && !u.expectedSalary && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#666] bg-[#FAF8F5] border border-[#EAE5DF] px-2 py-0.5 rounded-full shrink-0">
                        <Sparkles size={11} className="text-[#C9A55D] shrink-0" />
                        <span>Verified Academic Quality</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons: locked at bottom */}
                <div className="pt-3 border-t border-[#F0EBE6] flex items-center justify-between gap-2 h-[46px]">
                  <button
                    type="button"
                    onClick={() => setModalUniversity(u)}
                    className="text-[12px] text-[#555] hover:text-[#690B1B] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>Quick View</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {u.website && (
                      <a
                        href={u.website.startsWith('http') ? u.website : `https://${u.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#690B1B] font-semibold flex items-center gap-1 hover:underline shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe size={12} />
                        <span className="hidden sm:inline">Site</span>
                        <ExternalLink size={10} />
                      </a>
                    )}

                    <Link
                      href={`/dashboard/schools/${u.slug}`}
                      className="px-3.5 py-1.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer group-hover:scale-[1.02]"
                    >
                      <span>Explore</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ─── MATRIX TABLE VIEW ─── */
        <div className="bg-white border border-[#E7E2DE] rounded-[20px] overflow-hidden shadow-xs">
          <div className="p-4 bg-[#FAF8F5] border-b border-[#EAE5DF] flex items-center justify-between text-[12px] text-[#666]">
            <span className="font-bold text-[#111]">
              Admissions Matrix Table — {selectedCountry === 'ALL' ? 'All Countries' : activeConfig.title}
            </span>
            <span className="text-[11px] font-semibold text-[#888]">
              ← Scroll horizontally to compare all fields →
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[12px] text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#FAF8F6] text-[#444] border-b border-[#E7E2DE] text-[10.5px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 min-w-[60px]">Flag</th>
                  <th className="py-3 px-3 min-w-[220px]">Institution Name</th>
                  <th className="py-3 px-3 min-w-[130px]">State / Province</th>
                  <th className="py-3 px-3 min-w-[100px]">QS Rank</th>
                  <th className="py-3 px-3 min-w-[100px]">Acceptance</th>
                  <th className="py-3 px-3 min-w-[140px]">Annual Tuition</th>
                  <th className="py-3 px-3 min-w-[130px]">Living Costs</th>
                  <th className="py-3 px-3 min-w-[140px]">Exp. Salary</th>
                  <th className="py-3 px-3 min-w-[140px]">ROI / Outcomes</th>
                  <th className="py-3 px-4 min-w-[120px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DF]">
                {displayedUniversities.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setModalUniversity(u)}
                    className="hover:bg-[#FAF8F8] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-[18px]">{getCountryFlag(u.countryCode)}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#111] group-hover:text-[#690B1B] transition-colors">
                        {u.name}
                      </div>
                      <div className="text-[10.5px] text-[#888] font-mono">{u.universityId || u.slug}</div>
                    </td>
                    <td className="py-3 px-3 text-[#555] font-medium">
                      {u.state || u.province || u.country}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#690B1B]">{formatRank(u.qsRanking)}</td>
                    <td className="py-3 px-3 font-semibold text-[#16a34a]">{formatAcceptance(u.acceptanceRate, u.countryCode)}</td>
                    <td className="py-3 px-3 text-[#111] font-medium">{u.tuition}</td>
                    <td className="py-3 px-3 text-[#666]">{u.livingCosts}</td>
                    <td className="py-3 px-3 text-[#2E7D32] font-semibold">{u.expectedSalary || 'Competitive'}</td>
                    <td className="py-3 px-3 text-[#690B1B] font-medium truncate max-w-[160px]" title={u.roi}>
                      {formatRoiBadge(u.roi)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dashboard/schools/${u.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#690B1B] text-white text-[11px] font-bold hover:bg-[#7A1022] transition-colors"
                      >
                        <span>Profile</span>
                        <ArrowUpRight size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ PAGINATION ═════════════════════════════════════════════ */}
      {totalPages > 1 && !loading && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-4 px-1 w-full">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-[12px] text-[12px] sm:text-[13px] font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
              currentPage === 1
                ? 'bg-[#F7F5F3] text-[#CCC] cursor-not-allowed'
                : 'bg-[#F7F5F3] text-[#555] hover:bg-[#E7E2DE]'
            }`}
          >
            <ChevronLeft size={14} className="shrink-0" />
            <span className="whitespace-nowrap">Previous</span>
          </button>

          <div className="flex items-center gap-1 flex-wrap justify-center">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] sm:rounded-[10px] text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer shrink-0 ${
                    currentPage === pageNum
                      ? 'bg-[#690B1B] text-white shadow-xs'
                      : 'bg-[#F7F5F3] text-[#555] hover:bg-[#E7E2DE]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-[12px] text-[12px] sm:text-[13px] font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
              currentPage === totalPages
                ? 'bg-[#F7F5F3] text-[#CCC] cursor-not-allowed'
                : 'bg-[#F7F5F3] text-[#555] hover:bg-[#E7E2DE]'
            }`}
          >
            <span className="whitespace-nowrap">Next</span>
            <ChevronRight size={14} className="shrink-0" />
          </button>
        </div>
      )}

      {/* ══ QUICK VIEW MODAL (ALL PARAMETERS) ══════════════════════ */}
      {modalUniversity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#E0DCD7] rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative my-auto space-y-5">
            <button
              onClick={() => setModalUniversity(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E2DDD7] text-[#555] hover:text-[#111] flex items-center justify-center font-bold text-[15px] cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[20px]">{getCountryFlag(modalUniversity.countryCode)}</span>
                <span className="text-[11px] font-bold text-[#690B1B] uppercase tracking-wider">
                  {modalUniversity.country} Admissions Dossier
                </span>
                {modalUniversity.universityId && (
                  <span className="font-mono text-[10px] font-bold bg-[#FDF0F2] text-[#690B1B] px-2 py-0.5 rounded border border-[#F0C9D0]">
                    {modalUniversity.universityId}
                  </span>
                )}
              </div>
              <h2 className="text-[22px] font-bold text-[#111] leading-snug">
                {modalUniversity.name}
              </h2>
              <div className="text-[12px] text-[#777] mt-1 flex items-center gap-2">
                <span>{modalUniversity.state || modalUniversity.province}, {modalUniversity.country}</span>
                {modalUniversity.website && (
                  <>
                    <span>•</span>
                    <a
                      href={modalUniversity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#690B1B] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Website ↗</span>
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-[12px] bg-[#FAF8F5] border border-[#EAE5DF]">
                <div className="text-[9.5px] uppercase font-bold text-[#888]">QS Ranking</div>
                <div className="text-[15px] font-bold text-[#690B1B] mt-0.5 truncate">{formatRank(modalUniversity.qsRanking)}</div>
              </div>
              <div className="p-3 rounded-[12px] bg-[#FAF8F5] border border-[#EAE5DF]">
                <div className="text-[9.5px] uppercase font-bold text-[#888]">Acceptance Rate</div>
                <div className="text-[15px] font-bold text-[#16a34a] mt-0.5 truncate">{formatAcceptance(modalUniversity.acceptanceRate, modalUniversity.countryCode)}</div>
              </div>
              <div className="p-3 rounded-[12px] bg-[#FAF8F5] border border-[#EAE5DF]">
                <div className="text-[9.5px] uppercase font-bold text-[#888]">Annual Tuition</div>
                <div className="text-[14px] font-bold text-[#111] mt-0.5 truncate">{modalUniversity.tuition}</div>
              </div>
              <div className="p-3 rounded-[12px] bg-[#FAF8F5] border border-[#EAE5DF]">
                <div className="text-[9.5px] uppercase font-bold text-[#888]">Living Costs</div>
                <div className="text-[14px] font-bold text-[#111] mt-0.5 truncate">{modalUniversity.livingCosts}</div>
              </div>
            </div>

            {/* Canada Specific Details */}
            {(modalUniversity.countryCode === 'CA' || modalUniversity.country.toLowerCase().includes('canada')) && (
              <div className="p-4 rounded-[14px] bg-[#E8F5E9]/50 border border-[#A5D6A7] space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32] flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Canadian DLI & Visa Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                  <div>DLI Number: <strong className="font-mono text-[#2E7D32]">{modalUniversity.dliNumber || 'O19209939222'}</strong></div>
                  <div>PGWP Status: <strong className="text-[#2E7D32]">Eligible (Up to 3 Years)</strong></div>
                  <div>GIC Proof: <strong>CAD 20,635 Required</strong></div>
                  <div>Language: <strong>English</strong></div>
                </div>
              </div>
            )}

            {/* Germany Specific Details */}
            {(modalUniversity.countryCode === 'DE' || modalUniversity.country.toLowerCase().includes('germany')) && (
              <div className="p-4 rounded-[14px] bg-[#EFF5FF]/60 border border-[#BFDBFE] space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1565C0] flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>German Admissions & Requirements</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                  <div>Numerus Clausus: <strong>{modalUniversity.ncNumerusClausus || 'Varies by program'}</strong></div>
                  <div>NC Cut-off Grade: <strong>{modalUniversity.ncGradeCutoff || 'Varies'}</strong></div>
                  <div>APS Certificate: <strong className="text-[#1565C0]">{modalUniversity.apsCertificateRequired || 'Mandatory'}</strong></div>
                  <div>Blocked Account: <strong>{modalUniversity.blockedAccountProofOfFunds || '€11,904/yr'}</strong></div>
                  <div>Semester Fee: <strong>{modalUniversity.semesterContribution || '€150–€350'}</strong></div>
                  <div>BW Tuition: <strong>{modalUniversity.bwTuitionFee || '€0 Free'}</strong></div>
                  <div>Application: <strong>{modalUniversity.uniAssistApplication || 'uni-assist'}</strong></div>
                  <div>Language: <strong>{modalUniversity.germanLanguageRequirement || 'DSH-2 / IELTS'}</strong></div>
                </div>
              </div>
            )}

            {/* United States Specific Details */}
            {(modalUniversity.countryCode === 'US' || modalUniversity.country.toLowerCase().includes('united states') || modalUniversity.country.toLowerCase().includes('usa')) && (
              <div className="p-4 rounded-[14px] bg-[#EFF5FF]/60 border border-[#BFDBFE] space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1565C0] flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>US Admissions & Visa Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                  <div>Need-Based Aid: <strong>{modalUniversity.avgNeedBasedGrant || '$24,500/yr Avg Package'}</strong></div>
                  <div>Academic Profile: <strong>{modalUniversity.avgGpa ? `GPA ${modalUniversity.avgGpa}` : '3.6+ GPA'} {modalUniversity.satScore ? `• SAT ${modalUniversity.satScore}` : ''}</strong></div>
                  <div>STEM OPT Extension: <strong className="text-[#1565C0]">3 Years (36 Months Total)</strong></div>
                  <div>Visa Category: <strong>F-1 Student Visa (I-20 Form)</strong></div>
                </div>
              </div>
            )}

            {/* United Kingdom Specific Details */}
            {(modalUniversity.countryCode === 'UK' || modalUniversity.countryCode === 'GB' || modalUniversity.country.toLowerCase().includes('united kingdom')) && (
              <div className="p-4 rounded-[14px] bg-[#FFF8E6] border border-[#FFCC80] space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#B45309] flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>UK Admissions & Visa Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                  <div>Graduate Route: <strong className="text-[#B45309]">2-Year Post-Study Work</strong></div>
                  <div>Degree Length: <strong>3-Year UG / 1-Year Master's</strong></div>
                  <div>Visa Sponsorship: <strong>Student Route CAS Required</strong></div>
                  <div>Health Surcharge: <strong>£776/year IHS Surcharge</strong></div>
                </div>
              </div>
            )}

            {/* Australia Specific Details */}
            {(modalUniversity.countryCode === 'AU' || modalUniversity.country.toLowerCase().includes('australia')) && (
              <div className="p-4 rounded-[14px] bg-[#E8F5E9]/50 border border-[#A5D6A7] space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32] flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Australia Admissions & Visa Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                  <div>Visa Subclass: <strong className="text-[#2E7D32]">Subclass 500 Student Visa</strong></div>
                  <div>Post-Study Work: <strong>Subclass 485 (2–4 Years)</strong></div>
                  <div>Work Rights: <strong>48 hrs/fortnight during semester</strong></div>
                  <div>CRICOS: <strong>Registered Courses Only</strong></div>
                </div>
              </div>
            )}

            {/* Career Outcomes & ROI */}
            {(modalUniversity.expectedSalary || modalUniversity.roi) && (
              <div className="p-4 rounded-[14px] bg-[#FFF8E6] border border-[#FFCC80] space-y-2 text-[12px]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#B45309] flex items-center gap-1.5">
                  <TrendingUp size={14} />
                  <span>Salary & Return on Investment</span>
                </div>
                {modalUniversity.expectedSalary && (
                  <div>Expected Starting Salary: <strong className="text-[#2E7D32]">{modalUniversity.expectedSalary}</strong></div>
                )}
                {modalUniversity.roi && (
                  <div>ROI Analysis: <strong className="text-[#78350F]">{modalUniversity.roi}</strong></div>
                )}
              </div>
            )}

            {/* Popular Majors */}
            {modalUniversity.popularMajors && modalUniversity.popularMajors.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#888]">
                  Popular Fields of Study
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {modalUniversity.popularMajors.map((m) => (
                    <span key={m} className="text-[11px] bg-[#F7F5F3] text-[#444] px-2.5 py-1 rounded-md font-medium border border-[#E7E2DE]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#F0EBE6] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setModalUniversity(null)}
                className="px-4 py-2 rounded-full border border-[#DDD] text-[#555] text-[12px] font-bold hover:bg-[#FAF8F5] transition-colors w-full sm:w-auto cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {modalUniversity.website && (
                  <a
                    href={modalUniversity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-[#690B1B] text-[#690B1B] text-[12px] font-bold hover:bg-[#FDF0F2] transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                  >
                    <span>Website</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                <Link
                  href={`/dashboard/schools/${modalUniversity.slug}`}
                  className="px-5 py-2 rounded-full bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#7A1022] transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-initial shadow-xs"
                >
                  <span>Open Full Profile</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
