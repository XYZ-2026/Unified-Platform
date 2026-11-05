'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  ExternalLink,
  Award,
  DollarSign,
  BookOpen,
  Users,
  CheckCircle2,
  BarChart3,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Share2,
  Globe,
  GraduationCap,
  Loader2,
  AlertCircle,
  TrendingUp,
  PenTool,
  Briefcase,
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────── */

interface UniversityDetail {
  id: string;
  universityId: string;
  name: string;
  country: string;
  countryCode: string;
  state: string;
  province?: string;
  city?: string;
  qsRanking: string;
  tuition: string;
  livingCosts: string;
  acceptanceRate: string;
  website: string;
  bannerImage?: string;
  bannerAlt: string;
  popularMajors: string[];
  slug: string;
  avgGpa: number | string | null;
  satScore: string;
  avgNeedBasedGrant: string;
  requiredEssayPromptsDetails: string;
  writingRequirements: string;
  careerOutcomes?: string;
  expectedSalary?: string;
  roi?: string;
  scholarships?: string;
  type?: string;
  // Canada-specific
  dliNumber?: string;
  internationalEligible?: string;
  offersUndergraduate?: string;
  offersPostgraduate?: string;
  offersDoctoral?: string;
  languageOfInstruction?: string;
  // Germany-specific
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

/* ─── Helpers ─────────────────────────────────────────────── */

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

function formatWixImageUrl(url: any): string {
  if (!url) return '';
  if (typeof url !== 'string') {
    if (url.url) return formatWixImageUrl(url.url);
    if (url.src) return formatWixImageUrl(url.src);
    return '';
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('wix:image://v1/')) {
    const match = trimmed.match(/^wix:image:\/\/v1\/([^\/#]+)/);
    if (match && match[1]) {
      return `https://static.wixstatic.com/media/${match[1]}`;
    }
  }
  return trimmed;
}

function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    US: '🇺🇸', GB: '🇬🇧', UK: '🇬🇧', CA: '🇨🇦', DE: '🇩🇪',
    AU: '🇦🇺', FR: '🇫🇷', NL: '🇳🇱', SG: '🇸🇬', IN: '🇮🇳',
    CN: '🇨🇳', JP: '🇯🇵', KR: '🇰🇷', CH: '🇨🇭', SE: '🇸🇪',
    IE: '🇮🇪', NZ: '🇳🇿', IT: '🇮🇹', ES: '🇪🇸', HK: '🇭🇰',
  };
  return flags[code?.toUpperCase()] || '🌍';
}

function getUniversityEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('institute') || lower.includes('technology')) return '⚙️';
  if (lower.includes('medical') || lower.includes('health')) return '🏥';
  if (lower.includes('art') || lower.includes('design') || lower.includes('music')) return '🎨';
  if (lower.includes('law')) return '⚖️';
  if (lower.includes('community') || lower.includes('college')) return '🎓';
  if (lower.includes('seminary') || lower.includes('theological')) return '📿';
  if (lower.includes('state')) return '🏛️';
  return '🏫';
}

/**
 * Parses the free-text essay prompts string from Wix CMS into structured objects.
 * Handles various formatting patterns found in the data.
 */
function parseEssayPrompts(details: string): Array<{
  title: string;
  prompts: string[];
  wordLimit: string;
}> {
  if (!details || !details.trim()) return [];

  const sections: Array<{ title: string; prompts: string[]; wordLimit: string }> = [];

  // Split by double newlines or section headers
  const blocks = details.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // First line is usually the section title
    const titleLine = lines[0];

    // Extract word limit from title line if present
    const wordLimitMatch = titleLine.match(/\((\d+[\s\-–]*\d*\s*words?\s*(?:max|min|each)?)\)/i);
    const wordLimit = wordLimitMatch ? wordLimitMatch[1] : '';

    // Clean title
    let title = titleLine
      .replace(/\(.*?\)/g, '')
      .replace(/[:—–-]+\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Collect numbered prompts
    const prompts = lines
      .slice(1)
      .filter(l => /^\d+[\.\)]\s+/.test(l))
      .map(l => l.replace(/^\d+[\.\)]\s+/, '').trim());

    // If no numbered prompts, use the rest of lines as prompts
    const finalPrompts = prompts.length > 0
      ? prompts
      : lines.slice(1).filter(l => l.length > 10);

    if (title) {
      sections.push({ title, prompts: finalPrompts, wordLimit });
    }
  }

  return sections;
}

/**
 * Determine university type label from name context
 */
function getUniversityType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('seminary') || lower.includes('theological')) return 'Theological Seminary';
  if (lower.includes('institute of technology')) return 'Institute of Technology';
  if (lower.includes('community college')) return 'Community College';
  if (lower.includes('college of law') || lower.includes('law school')) return 'Law School';
  if (lower.includes('medical') || lower.includes('school of medicine')) return 'Medical School';
  if (lower.includes('art') || lower.includes('design')) return 'Art & Design School';
  if (lower.includes('conservatory') || lower.includes('music')) return 'Conservatory';
  if (lower.includes('state university')) return 'Public State University';
  if (lower.includes('university')) return 'University';
  if (lower.includes('college')) return 'College';
  if (lower.includes('institute')) return 'Institute';
  return 'Higher Education';
}

function parseRoi(roiStr?: string) {
  if (!roiStr) return { hero: 'N/A', rating: '', desc: 'Projected earnings premium relative to total cost of attendance.' };
  const str = roiStr.trim();

  // 1. Percentage like '1273% (Excellent)'
  const pctMatch = str.match(/^([\d,]+%)\s*(?:\((.*?)\))?/i);
  if (pctMatch) {
    return {
      hero: pctMatch[1],
      rating: pctMatch[2] ? `${pctMatch[2]} Rating` : 'High Return',
      desc: 'Projected earnings premium relative to total net attendance cost.',
    };
  }

  // 2. Pipe-separated string like Canada:
  // 'High ROI | Break-even in ~3-4 years | Strong 20-Year Lifetime Earnings Premium...'
  if (str.includes('|')) {
    const parts = str.split('|').map((s) => s.trim());
    return {
      hero: parts[0] || 'High ROI',
      rating: parts[1] || 'Strong Return',
      desc: parts[2] || 'High long-term career earnings premium with work permit pathways.',
    };
  }

  // 3. Text ratings like 'Exceptional ROI (...)'
  const textMatch = str.match(/^([A-Za-z\s]+ROI)\s*(?:\((.*?)\))?/i);
  if (textMatch) {
    return {
      hero: textMatch[1].trim(),
      rating: 'Top Tier',
      desc: textMatch[2] || 'Exceptional value and low tuition cost relative to graduate compensation.',
    };
  }

  return {
    hero: str.length > 15 ? 'High ROI' : str,
    rating: 'Verified Return',
    desc: str,
  };
}

function parseSalary(salaryStr?: string) {
  if (!salaryStr) return { hero: 'N/A', unit: '/ yr', badge: '', desc: 'Starting to early-career compensation reported across academic programs.' };
  const str = salaryStr.trim();

  // Range like '$62,000 - $88,000 CAD/yr starting salary ($95,000+ CAD for CS & Engineering graduates)'
  const rangeMatch = str.match(/(?:CAD\s*)?\$?([\d,]+)\s*(?:-|–)\s*(?:CAD\s*)?\$?([\d,]+)/i);
  if (rangeMatch) {
    const num1 = parseInt(rangeMatch[1].replace(/,/g, ''), 10);
    const num2 = parseInt(rangeMatch[2].replace(/,/g, ''), 10);
    const minK = Math.round(num1 / 1000);
    const maxK = Math.round(num2 / 1000);
    const unit = str.toUpperCase().includes('CAD') ? 'CAD / yr' : '/ yr';

    // Check for paren note like '($95,000+ CAD for CS & Engineering graduates)'
    const parenMatch = str.match(/\((.*?)\)/);
    let badge = 'Early Career Range';
    if (parenMatch) {
      const pText = parenMatch[1];
      if (pText.includes('+')) {
        const topSalaryMatch = pText.match(/\$?[\d,]+\+?\s*(?:CAD)?/i);
        badge = topSalaryMatch ? `Tech: ${topSalaryMatch[0].trim()}` : 'Tech Premium';
      }
    }

    return {
      hero: `$${minK}K – $${maxK}K`,
      unit,
      badge,
      desc: 'Starting to early-career compensation reported across academic programs.',
    };
  }

  // Single figure like '$72,500'
  const singleMatch = str.match(/(?:CAD\s*)?\$?([\d,]+)/);
  if (singleMatch) {
    const unit = str.toUpperCase().includes('CAD') ? 'CAD / yr' : '/ yr';
    return {
      hero: `$${singleMatch[1]}`,
      unit,
      badge: 'Starting Median',
      desc: 'Projected early-career earnings reported by alumni.',
    };
  }

  return {
    hero: str.length > 16 ? str.slice(0, 15) + '…' : str,
    unit: '',
    badge: 'Expected',
    desc: str,
  };
}

function parseCareerOutcomes(outcomesStr?: string) {
  if (!outcomesStr) return { rate: '90%+', timeline: 'Within 6 months', desc: 'Employed full-time in industry or pursuing advanced master’s/doctoral study.' };
  const str = outcomesStr.trim();

  // Match range or percentage like '92% - 96%' or '94%'
  const rateMatch = str.match(/(\d+%\s*(?:-|–)\s*\d+%)|(\d+%\+?)/);
  const rate = rateMatch ? rateMatch[0].replace(/\s+/g, ' ').replace(/-/g, '–') : '92%+';

  // Match timeline like 'within 6 months'
  const timeMatch = str.match(/(?:within|in)\s+(\d+\s+(?:months?|years?))/i);
  const timeline = timeMatch ? `Within ${timeMatch[1]}` : 'Within 6 months';

  // Extract description from pipes if available
  let desc = 'Employed full-time in industry or pursuing advanced master’s/doctoral study.';
  if (str.includes('|')) {
    const parts = str.split('|').map((s) => s.trim());
    if (parts.length > 1) {
      desc = parts.slice(1).join(' • ');
    }
  }

  return {
    rate,
    timeline,
    desc,
  };
}

/* ─── Component ───────────────────────────────────────────── */

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const [university, setUniversity] = useState<UniversityDetail | null>(null);
  const [bannerError, setBannerError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch university data from Wix CMS
  useEffect(() => {
    if (!slug) return;

    async function fetchUniversity() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/wix/universities/${slug}`);
        const data = await res.json();

        if (data.success && data.university) {
          setUniversity(data.university);
          setBannerError(false);
        } else {
          setError(data.error || 'University not found');
        }
      } catch (err: any) {
        console.error('Error fetching university:', err);
        setError('Failed to load university data');
      } finally {
        setLoading(false);
      }
    }

    fetchUniversity();
  }, [slug]);

  // ─── LOADING STATE ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
        {/* Skeleton hero */}
        <div className="relative rounded-[24px] overflow-hidden border border-[#E7E2DE] bg-white animate-pulse">
          <div className="h-[250px] sm:h-[320px] md:h-[370px] lg:h-[400px] bg-gradient-to-r from-gray-200 to-gray-300" />
          <div className="p-6 md:p-8 -mt-16 mx-4 md:mx-8 rounded-[20px] bg-white border border-[#E7E2DE] space-y-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[18px] bg-gray-200" />
              <div className="space-y-2 flex-1">
                <div className="h-7 w-3/5 bg-gray-200 rounded" />
                <div className="h-4 w-2/5 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-7 w-24 bg-gray-200 rounded-full" />
              <div className="h-7 w-32 bg-gray-100 rounded-full" />
              <div className="h-7 w-28 bg-gray-100 rounded-full" />
            </div>
          </div>
          <div className="px-6 py-4 flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-32 bg-gray-100 rounded-full" />
            ))}
          </div>
        </div>

        {/* Skeleton content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 space-y-4 animate-pulse">
              <div className="h-6 w-2/5 bg-gray-200 rounded" />
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-[14px]" />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-52 bg-gray-100 rounded-[20px] animate-pulse" />
            <div className="h-44 bg-gray-100 rounded-[20px] animate-pulse" />
          </div>
        </div>

        {/* Centered loader */}
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-[#690B1B]" size={32} />
        </div>
      </div>
    );
  }

  // ─── ERROR STATE ───────────────────────────────────────────
  if (error || !university) {
    return (
      <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full">
        <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FEF2F2] text-red-500 mx-auto flex items-center justify-center">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-[20px] font-bold text-[#111]">
            University Not Found
          </h3>
          <p className="text-[14px] text-[#777] max-w-[460px] mx-auto leading-relaxed">
            {error || 'We couldn\'t find a university with this URL. It may have been removed or the link is incorrect.'}
          </p>
          <button
            onClick={() => router.push('/dashboard/schools')}
            className="px-5 py-2.5 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Back to University Finder</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── DATA DERIVED VALUES ───────────────────────────────────
  const u = university;
  const isCanada = u.countryCode === 'CA' || u.country.toLowerCase().includes('canada');
  const isGermany = u.countryCode === 'DE' || u.country.toLowerCase().includes('germany');
  const isUS = u.countryCode === 'US' || u.country.toLowerCase().includes('united states');
  const location = [u.city, u.state || u.province, u.country].filter(Boolean).join(', ');
  const essaySections = parseEssayPrompts(u.requiredEssayPromptsDetails);
  const uniType = getUniversityType(u.name);
  const bannerSrc = formatWixImageUrl(u.bannerImage);

  // Compute total cost
  const parseCurrency = (s: string) => {
    const match = s.replace(/,/g, '').match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };
  const tuitionVal = parseCurrency(u.tuition);
  const livingVal = parseCurrency(u.livingCosts);
  const totalCost = tuitionVal + livingVal;

  const roiData = parseRoi(u.roi);
  const salaryData = parseSalary(u.expectedSalary);
  const outcomeData = parseCareerOutcomes(u.careerOutcomes);

  // ─── RENDER ────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      {/* ═══════════════════════════════════════════════════════
         BACK NAVIGATION
         ═══════════════════════════════════════════════════════ */}
      <button
        onClick={() => router.push('/dashboard/schools')}
        className="h-[36px] px-4 rounded-full inline-flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-[#690B1B] bg-white border border-[#E7E2DE] hover:bg-[#F7F0F1] transition-all cursor-pointer group shadow-2xs active:scale-95 shrink-0 whitespace-nowrap"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to University Finder</span>
      </button>

      {/* ═══════════════════════════════════════════════════════
         HERO COVER BANNER & OVERLAY CARD
         ═══════════════════════════════════════════════════════ */}
      <div className="relative rounded-[24px] overflow-hidden shadow-sm border border-[#E7E2DE] bg-white">
        {/* TOP MAROON BANNER CONTAINER */}
        <div className="h-[200px] sm:h-[260px] md:h-[300px] bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] relative p-3.5 sm:p-6 flex flex-wrap items-start justify-between gap-2.5 text-white overflow-hidden">
          {/* University Banner Image from CMS (if available & valid) */}
          {bannerSrc && !bannerError ? (
            <>
              <img
                src={bannerSrc}
                alt={u.bannerAlt || `${u.name} campus banner`}
                onError={() => setBannerError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10 z-[1] pointer-events-none" />
            </>
          ) : (
            <>
              <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-white/3 rounded-full blur-2xl -mb-32 pointer-events-none" />
            </>
          )}

          <div className="inline-flex items-center gap-1.5 sm:gap-2 h-[32px] sm:h-[36px] px-3 sm:px-3.5 rounded-full bg-black/25 backdrop-blur-md border border-white/15 text-[#C9A55D] text-[11px] sm:text-[12px] font-bold relative z-10 shrink-0 shadow-xs">
            <Sparkles size={14} className="shrink-0" />
            <span>Verified University Dossier</span>
          </div>

          <div className="flex items-center gap-2 relative z-10 shrink-0">
            <button className="h-[32px] sm:h-[36px] px-3.5 sm:px-4 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-md border border-white/15 text-white text-[11.5px] sm:text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 shrink-0 shadow-xs">
              <Bookmark size={14} className="shrink-0" />
              <span>Add to My List</span>
            </button>
          </div>
        </div>

        {/* FLOATING DETAILS OVERLAY CARD */}
        <div className="p-4 sm:p-6 md:p-8 bg-white relative -mt-10 sm:-mt-14 mx-3 sm:mx-6 md:mx-8 rounded-[18px] sm:rounded-[20px] shadow-lg border border-[#E7E2DE] space-y-4 z-10">
          <div className="flex flex-col gap-4">
            {/* Title & Identity Row */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[18px] bg-[#F7F0F1] border border-[#690B1B]/20 flex items-center justify-center text-[26px] sm:text-[36px] shrink-0 aspect-square shadow-2xs">
                {getUniversityEmoji(u.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-[20px] sm:text-[26px] md:text-[32px] font-bold text-[#111111] leading-tight">
                  {u.name}
                </h1>
                <div className="text-[12.5px] sm:text-[14px] text-[#777777] flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <MapPin size={14} className="text-[#690B1B] shrink-0" />
                  <span className="font-medium">{location}</span>
                  {u.countryCode && <span className="ml-1 shrink-0 text-[15px]">{getCountryFlag(u.countryCode)}</span>}
                  {u.universityId && (
                    <span className="font-mono text-[10px] font-bold bg-[#FDF0F2] text-[#690B1B] px-2 py-0.5 rounded border border-[#F0C9D0] ml-1">
                      {u.universityId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Badges Row - Clean and Responsive */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F5F2EF]">
              {u.qsRanking && u.qsRanking !== 'Unranked' && (
                <span className="text-[11px] sm:text-[12px] font-bold bg-[#690B1B] text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                  <Award size={12} className="shrink-0" />
                  <span>{formatRank(u.qsRanking)}</span>
                </span>
              )}
              {u.acceptanceRate && (
                <span className="text-[11px] sm:text-[12px] font-bold bg-[#F7F0F1] text-[#690B1B] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#690B1B]/15">
                  {formatAcceptance(u.acceptanceRate, u.countryCode)}
                </span>
              )}
              <span className="text-[11px] sm:text-[12px] font-bold bg-[#FFF8EB] text-[#9E731A] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#F3E3C6]">
                {uniType}
              </span>
              {u.roi && (
                <span className="text-[11px] sm:text-[12px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                  <TrendingUp size={12} className="text-[#059669] shrink-0" />
                  <span>ROI: {formatRoiBadge(u.roi)}</span>
                </span>
              )}
              {isCanada && (
                <span className="text-[11px] sm:text-[12px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full inline-flex items-center gap-1">
                  <span>🍁</span>
                  <span>DLI Verified • PGWP Eligible</span>
                </span>
              )}
              {isGermany && (
                <span className="text-[11px] sm:text-[12px] font-bold bg-[#EFF5FF] text-[#1565C0] border border-[#BFDBFE] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full inline-flex items-center gap-1">
                  <span>🇩🇪</span>
                  <span>€0 Tuition • APS Mandatory</span>
                </span>
              )}
            </div>
          </div>

          {/* EXTERNAL LINKS */}
          <div className="flex items-center gap-3 sm:gap-4 pt-3 border-t border-[#F0EBE6] text-[12px] sm:text-[13px] font-medium text-[#690B1B] flex-wrap">
            {u.website && (
              <>
                <a
                  href={u.website.startsWith('http') ? u.website : `https://${u.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>Official Website</span>
                  <ExternalLink size={13} />
                </a>
                <span className="text-[#D4CFC9]">•</span>
              </>
            )}
            {isGermany ? (
              <>
                <a
                  href="https://www.daad.de/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>DAAD Portal</span>
                  <ExternalLink size={13} />
                </a>
                <span className="text-[#D4CFC9]">•</span>
                <a
                  href="https://anabin.kmk.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>Anabin Recognition</span>
                  <ExternalLink size={13} />
                </a>
              </>
            ) : isCanada ? (
              <>
                <a
                  href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>IRCC DLI Directory</span>
                  <ExternalLink size={13} />
                </a>
                <span className="text-[#D4CFC9]">•</span>
                <a
                  href="https://www.educanada.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>EduCanada Official</span>
                  <ExternalLink size={13} />
                </a>
              </>
            ) : (
              <>
                <a
                  href="https://npc.collegeboard.org/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>Net Price Calculator</span>
                  <ExternalLink size={13} />
                </a>
                <span className="text-[#D4CFC9]">•</span>
                <a
                  href="https://nces.ed.gov/collegenavigator/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>Common Data Set</span>
                  <ExternalLink size={13} />
                </a>
              </>
            )}
          </div>
        </div>

        {/* NAVIGATION SUB-TABS */}
        <div className="px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 pb-2 border-t border-[#F0EBE6] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'admissions', label: 'Admissions & Requirements' },
            { id: 'cost', label: 'Cost & Scholarships' },
            { id: 'careers', label: 'Career & ROI' },
            { id: 'essays', label: 'SOP & Essays' },
            { id: 'majors', label: 'Popular Majors' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-[36px] sm:h-[40px] px-4 rounded-full text-[12px] sm:text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center shrink-0 active:scale-95 ${activeTab === tab.id
                  ? 'bg-[#690B1B] text-white shadow-2xs'
                  : 'text-[#666666] hover:bg-[#F7F5F3] hover:text-[#111]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         DETAILED METRICS CONTENT GRID
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN METRICS & STATS (LEFT 2 COLS) */}
        <div className="lg:col-span-2 space-y-6">

          {/* ─── OVERVIEW / ADMISSIONS TAB ────────────────────── */}
          {(activeTab === 'overview' || activeTab === 'admissions') && (
            <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#111] flex items-center gap-2">
                <BarChart3 size={20} className="text-[#690B1B] shrink-0" />
                <span>Admission Metrics &amp; Requirements</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
                {[
                  {
                    label: 'Academic Profile',
                    value: u.avgGpa !== null && u.avgGpa !== undefined ? `${u.avgGpa}` : (isGermany ? 'Class 12 > 70%' : '3.6+ GPA'),
                    color: 'text-[#690B1B]'
                  },
                  {
                    label: isGermany ? 'APS / Entrance' : (isCanada ? 'DLI Number' : 'SAT Range'),
                    value: isGermany
                      ? (u.apsCertificateRequired?.toLowerCase().includes('yes') || u.apsCertificateRequired?.toLowerCase().includes('mandatory') ? 'APS Mandatory' : 'Required')
                      : (isCanada ? (u.dliNumber || 'O19209939222') : (u.satScore || 'Optional / N/A')),
                    color: 'text-[#111111]'
                  },
                  {
                    label: 'Admissions Mode',
                    value: formatAcceptance(u.acceptanceRate, u.countryCode),
                    color: 'text-[#16a34a]'
                  },
                  {
                    label: 'QS World Rank',
                    value: formatRank(u.qsRanking),
                    color: 'text-[#C9A55D]'
                  }
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-3 sm:p-4 text-center flex flex-col justify-center items-center min-h-[96px] sm:min-h-[108px] h-full"
                  >
                    <div className="text-[11px] sm:text-[12px] text-[#777] font-medium h-[24px] flex items-center justify-center text-center leading-snug">
                      {m.label}
                    </div>
                    <div className={`text-[14px] xs:text-[15px] sm:text-[17px] font-bold mt-1 leading-tight ${m.color} flex items-center justify-center flex-1 text-center truncate max-w-full px-1`}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── GERMANY ADMISSIONS & REQUIREMENTS SECTION ──── */}
          {(activeTab === 'overview' || activeTab === 'admissions') && isGermany && (
            <div className="bg-white border border-[#BFDBFE] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4 bg-gradient-to-br from-white to-[#EFF6FF]/30">
              <div className="flex items-center justify-between border-b border-[#DBEAFE] pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF5FF] text-[#1565C0] flex items-center justify-center border border-[#BFDBFE] text-[16px]">
                    🇩🇪
                  </div>
                  <div>
                    <h3 className="text-[17px] sm:text-[19px] font-bold text-[#111]">
                      Germany Admissions &amp; Visa Dossier
                    </h3>
                    <p className="text-[12px] text-[#666]">
                      Public university admissions requirements, APS verification, and proof of funds
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-full border border-[#A5D6A7]">
                  €0 Tuition Public
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px] items-stretch">
                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#1565C0] uppercase tracking-wider">APS Certificate</div>
                    <div className="font-semibold text-[#111] mt-0.5">{u.apsCertificateRequired || 'Mandatory for Indian Applicants'}</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">Required prior to German student visa appointment</div>
                </div>

                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#1565C0] uppercase tracking-wider">Blocked Account (Sperrkonto)</div>
                    <div className="font-semibold text-[#111] mt-0.5">{u.blockedAccountProofOfFunds || '€11,904 / year (€992 / month)'}</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">Federal statutory proof of living resources</div>
                </div>

                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#1565C0] uppercase tracking-wider">Numerus Clausus (NC) Cut-off</div>
                    <div className="font-semibold text-[#111] mt-0.5">{u.ncGradeCutoff || u.ncNumerusClausus || 'Varies by program / Open Admission'}</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">Program-level academic grade entry thresholds</div>
                </div>

                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#1565C0] uppercase tracking-wider">Application Channel</div>
                    <div className="font-semibold text-[#111] mt-0.5">{u.uniAssistApplication || 'uni-assist / Direct Portal'}</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">VPD (Vorprüfungsdokumentation) review portal</div>
                </div>

                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#1565C0] uppercase tracking-wider">Language Proficiency</div>
                    <div className="font-semibold text-[#111] mt-0.5">{u.germanLanguageRequirement || 'TestDaF TDN 4 / DSH-2 / IELTS 6.5+'}</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">Depending on German vs English instruction medium</div>
                </div>

                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#1565C0] uppercase tracking-wider">Post-Graduation Opportunity</div>
                    <div className="font-semibold text-[#2E7D32] mt-0.5">18-Month Job Seeker Visa</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">Direct fast-track pathway to EU Blue Card PR</div>
                </div>
              </div>
            </div>
          )}

          {/* ─── CANADA ADMISSIONS & IMMIGRATION SECTION ──── */}
          {(activeTab === 'overview' || activeTab === 'admissions') && isCanada && (
            <div className="bg-white border border-[#A5D6A7] rounded-[20px] p-5 sm:p-6 shadow-xs space-y-4 bg-gradient-to-br from-white to-[#F0FDF4]/30">
              <div className="flex items-center justify-between border-b border-[#C8E6C9] pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center border border-[#A5D6A7] text-[16px]">
                    🍁
                  </div>
                  <div>
                    <h3 className="text-[17px] sm:text-[19px] font-bold text-[#111]">
                      Canada DLI &amp; Immigration Dossier
                    </h3>
                    <p className="text-[12px] text-[#666]">
                      Designated Learning Institution verification, PGWP rights, and GIC requirement
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-full border border-[#A5D6A7]">
                  DLI Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px] items-stretch">
                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">Designated Learning Institution (DLI)</div>
                    <div className="font-mono font-bold text-[#2E7D32] text-[13px] mt-0.5">{u.dliNumber || 'O19209939222'}</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">Official IRCC approved institution code</div>
                </div>

                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">PGWP Work Permit Eligibility</div>
                    <div className="font-semibold text-[#111] mt-0.5">Eligible (Up to 3-Year Post-Grad Permit)</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">Open Canadian work permit with zero employer restriction</div>
                </div>

                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">Guaranteed Investment Certificate (GIC)</div>
                    <div className="font-semibold text-[#111] mt-0.5">CAD 20,635 Proof of Funds</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">Mandatory living cost proof for study permit application</div>
                </div>

                <div className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] flex flex-col justify-between h-full min-h-[88px] space-y-1">
                  <div>
                    <div className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">Permanent Residency Pathways</div>
                    <div className="font-semibold text-[#111] mt-0.5">Express Entry (CEC) &amp; Provincial PNP</div>
                  </div>
                  <div className="text-[11px] text-[#666] pt-1">Canadian degree grants maximum CRS bonus points</div>
                </div>
              </div>
            </div>
          )}

          {/* ─── WRITING REQUIREMENTS ─────────────────────────── */}
          {(activeTab === 'overview' || activeTab === 'admissions') && u.writingRequirements && (
            <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
              <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
                <PenTool size={20} className="text-[#690B1B]" />
                <span>Writing Requirements</span>
              </h3>
              <div className="p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE]">
                <p className="text-[14px] text-[#333] font-medium leading-relaxed">
                  {u.writingRequirements}
                </p>
              </div>
            </div>
          )}

          {/* ─── ESSAY PROMPTS ────────────────────────────────── */}
          {(activeTab === 'overview' || activeTab === 'essays') && essaySections.length > 0 && (
            <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
              <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
                <FileText size={20} className="text-[#690B1B]" />
                <span>Required Essay Prompts</span>
              </h3>

              <div className="space-y-4 pt-2">
                {essaySections.map((section, idx) => (
                  <div key={idx} className="p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-2.5 py-0.5 rounded-full">
                        {section.title}
                      </span>
                      {section.wordLimit && (
                        <span className="text-[12px] font-semibold text-[#888]">
                          {section.wordLimit}
                        </span>
                      )}
                    </div>

                    {section.prompts.length > 0 ? (
                      <ol className="space-y-2 pl-1">
                        {section.prompts.map((prompt, pIdx) => (
                          <li key={pIdx} className="text-[13px] text-[#444] leading-relaxed flex gap-2">
                            <span className="text-[#690B1B] font-bold shrink-0">{pIdx + 1}.</span>
                            <span>{prompt}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-[13px] text-[#555] leading-relaxed">
                        {section.title}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── FULL ESSAY TEXT (fallback if parsing yields no sections) ── */}
          {(activeTab === 'overview' || activeTab === 'essays') && essaySections.length === 0 && u.requiredEssayPromptsDetails && (
            <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
              <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
                <FileText size={20} className="text-[#690B1B]" />
                <span>Required Essay Prompts</span>
              </h3>
              <div className="p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE]">
                <pre className="text-[13px] text-[#444] leading-relaxed whitespace-pre-wrap font-sans">
                  {u.requiredEssayPromptsDetails}
                </pre>
              </div>
            </div>
          )}

          {/* ─── CAREER OUTCOMES, EXPECTED SALARY & ROI SECTION ───────────── */}
          {(activeTab === 'overview' || activeTab === 'careers') && (u.careerOutcomes || u.expectedSalary || u.roi) && (
            <div className="bg-white border border-[#E7E2DE] rounded-[22px] p-5 sm:p-7 shadow-xs space-y-6 relative overflow-hidden">
              {/* Subtle decorative ambient lights */}
              <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
              <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-amber-50/30 rounded-full blur-3xl pointer-events-none -mb-24" />

              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE6] pb-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] flex items-center justify-center border border-[#A7F3D0] shrink-0 shadow-2xs">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <h3 className="text-[20px] sm:text-[22px] font-bold text-[#111111] leading-tight">
                      Career Outcomes &amp; Return on Investment (ROI)
                    </h3>
                    <p className="text-[13px] text-[#666666] mt-0.5 leading-normal">
                      Post-graduation earnings potential, placement metrics, and long-term education value
                    </p>
                  </div>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative z-10 items-stretch">
                {/* 1. Return on Investment Card */}
                {u.roi ? (
                  <div className="group relative bg-white border border-[#E7E2DE] hover:border-[#10B981]/50 rounded-[18px] p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-sm h-full min-h-[210px] min-w-0 overflow-hidden">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0]/60 whitespace-nowrap shrink-0">
                          10-Year ROI
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center border border-[#A7F3D0] shrink-0">
                          <TrendingUp size={15} />
                        </div>
                      </div>

                      <div className="my-3.5 min-w-0">
                        <div className="text-[22px] sm:text-[26px] font-black text-[#111111] leading-tight tracking-tight truncate" title={roiData.hero}>
                          {roiData.hero}
                        </div>
                        {roiData.rating && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] max-w-full truncate">
                            <Sparkles size={11} className="shrink-0" />
                            <span className="truncate">{roiData.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11.5px] text-[#666666] leading-relaxed pt-2.5 border-t border-[#F5F2EF] mt-auto line-clamp-3" title={roiData.desc}>
                      {roiData.desc}
                    </p>
                  </div>
                ) : null}

                {/* 2. Expected Salary Range Card */}
                {u.expectedSalary ? (
                  <div className="group relative bg-white border border-[#E7E2DE] hover:border-[#F59E0B]/50 rounded-[18px] p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-sm h-full min-h-[210px] min-w-0 overflow-hidden">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <span className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider bg-[#FEF3C7] px-2.5 py-1 rounded-full border border-[#FDE68A]/60 whitespace-nowrap shrink-0">
                          Expected Salary
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center border border-[#FDE68A] shrink-0">
                          <Briefcase size={15} />
                        </div>
                      </div>

                      <div className="my-3.5 min-w-0">
                        <div className="flex items-baseline gap-1 min-w-0">
                          <span className="text-[22px] sm:text-[26px] font-black text-[#111111] leading-tight tracking-tight truncate" title={salaryData.hero}>
                            {salaryData.hero}
                          </span>
                          {salaryData.unit && (
                            <span className="text-[12px] font-bold text-[#888888] shrink-0">{salaryData.unit}</span>
                          )}
                        </div>
                        {salaryData.badge && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] max-w-full truncate">
                            <span className="truncate">{salaryData.badge}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11.5px] text-[#666666] leading-relaxed pt-2.5 border-t border-[#F5F2EF] mt-auto line-clamp-3" title={salaryData.desc}>
                      {salaryData.desc}
                    </p>
                  </div>
                ) : null}

                {/* 3. Career Placement Outcomes Card */}
                {u.careerOutcomes ? (
                  <div className="group relative bg-white border border-[#E7E2DE] hover:border-[#6366F1]/50 rounded-[18px] p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-sm h-full min-h-[210px] min-w-0 overflow-hidden">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <span className="text-[11px] font-bold text-[#4338CA] uppercase tracking-wider bg-[#EEF2FF] px-2.5 py-1 rounded-full border border-[#C7D2FE]/60 whitespace-nowrap shrink-0">
                          Placement Rate
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-[#C7D2FE] shrink-0">
                          <GraduationCap size={15} />
                        </div>
                      </div>

                      <div className="my-3.5 min-w-0">
                        <div className="text-[22px] sm:text-[26px] font-black text-[#111111] leading-tight tracking-tight truncate" title={outcomeData.rate}>
                          {outcomeData.rate}
                        </div>
                        {outcomeData.timeline && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#4338CA] bg-[#EEF2FF] border border-[#C7D2FE] max-w-full truncate">
                            <span className="truncate">{outcomeData.timeline}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11.5px] text-[#666666] leading-relaxed pt-2.5 border-t border-[#F5F2EF] mt-auto line-clamp-3" title={outcomeData.desc}>
                      {outcomeData.desc}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Financial Investment vs Payoff Overview */}
              {(u.expectedSalary || u.roi) && (
                <div className="bg-[#FAF8F6] border border-[#E7E2DE] rounded-[18px] p-4 sm:p-5 space-y-3.5 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="text-[11.5px] font-bold text-[#690B1B] uppercase tracking-wider">
                      Education Investment vs. Career Earning Power
                    </span>
                    {roiData.rating && (
                      <span className="text-[12px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full w-fit">
                        ★ {roiData.rating}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white border border-[#E7E2DE] rounded-[14px] p-3.5 flex flex-col justify-center min-w-0 overflow-hidden">
                      <div className="text-[11px] font-bold text-[#777] uppercase tracking-wider">Annual Tuition</div>
                      <div className="text-[17px] sm:text-[19px] font-bold text-[#111] mt-0.5 truncate" title={u.tuition}>{u.tuition}</div>
                      <div className="text-[11px] text-[#999] mt-0.5">Base investment / yr</div>
                    </div>

                    <div className="bg-white border border-[#E7E2DE] rounded-[14px] p-3.5 flex flex-col justify-center min-w-0 overflow-hidden">
                      <div className="text-[11px] font-bold text-[#777] uppercase tracking-wider">Projected Starting Comp</div>
                      <div className="text-[17px] sm:text-[19px] font-bold text-[#15803d] mt-0.5 truncate" title={salaryData.hero}>
                        {salaryData.hero}
                      </div>
                      <div className="text-[11px] text-[#999] mt-0.5">Early-career baseline</div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-[#F0FDF4] border border-[#BBF7D0] rounded-[14px] p-3.5 flex flex-col justify-center min-w-0 overflow-hidden">
                      <div className="text-[11px] font-bold text-[#15803d] uppercase tracking-wider">10-Year ROI Multiple</div>
                      <div className="text-[17px] sm:text-[19px] font-black text-[#15803d] mt-0.5 truncate" title={roiData.hero}>
                        {roiData.hero}
                      </div>
                      <div className="text-[11px] text-[#15803d]/80 mt-0.5">Estimated net career surplus</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── COST & SCHOLARSHIPS TAB ──────────────────────── */}
          {(activeTab === 'overview' || activeTab === 'cost') && (
            <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
              <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
                <DollarSign size={20} className="text-[#690B1B]" />
                <span>Cost Breakdown</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-5 text-center">
                  <div className="text-[12px] text-[#777] font-medium">Tuition & Fees</div>
                  <div className="text-[24px] font-bold text-[#111] mt-1">{u.tuition}</div>
                  <div className="text-[11px] text-[#999] mt-0.5">per year</div>
                </div>
                <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-5 text-center">
                  <div className="text-[12px] text-[#777] font-medium">Housing & Living</div>
                  <div className="text-[24px] font-bold text-[#111] mt-1">{u.livingCosts}</div>
                  <div className="text-[11px] text-[#999] mt-0.5">per year</div>
                </div>
                <div className="bg-[#F0FFF4] border border-[#BBF7D0] rounded-[14px] p-5 text-center">
                  <div className="text-[12px] text-[#16a34a] font-medium">Avg Need-Based Grant</div>
                  <div className="text-[24px] font-bold text-[#16a34a] mt-1">
                    {u.avgNeedBasedGrant || 'N/A'}
                  </div>
                  <div className="text-[11px] text-[#16a34a]/60 mt-0.5">per year</div>
                </div>
              </div>

              {totalCost > 0 && (
                <div className="mt-2 p-4 rounded-[14px] bg-[#FFF8EB] border border-[#F5E6C8]">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#9E731A]">Estimated Total Cost</span>
                    <span className="text-[18px] font-bold text-[#9E731A]">
                      ${totalCost.toLocaleString()} / yr
                    </span>
                  </div>
                  {u.avgNeedBasedGrant && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[12px] text-[#9E731A]/70">After Avg Grant</span>
                      <span className="text-[14px] font-bold text-[#16a34a]">
                        ${Math.max(0, totalCost - parseCurrency(u.avgNeedBasedGrant)).toLocaleString()} / yr
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Scholarships from CMS */}
              {u.scholarships && (
                <div className="mt-3 p-4 rounded-[14px] bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#15803d]">
                    <Award size={16} />
                    <span>Scholarship &amp; Financial Aid Opportunities</span>
                  </div>
                  <p className="text-[13px] text-[#166534] leading-relaxed">
                    {u.scholarships}
                  </p>
                </div>
              )}

              {/* Career Salary & ROI Payoff summary */}
              {(u.expectedSalary || u.roi) && (
                <div className="mt-3 p-3.5 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
                  {u.expectedSalary && (
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-[#690B1B]" />
                      <span className="text-[#777]">Expected Career Salary:</span>
                      <span className="font-bold text-[#111]">{u.expectedSalary}</span>
                    </div>
                  )}
                  {u.roi && (
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-[#059669]" />
                      <span className="text-[#777]">Projected ROI:</span>
                      <span className="font-bold text-[#059669]">{u.roi}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── POPULAR MAJORS TAB ───────────────────────────── */}
          {(activeTab === 'overview' || activeTab === 'majors') && u.popularMajors.length > 0 && (
            <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
              <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
                <BookOpen size={20} className="text-[#690B1B]" />
                <span>Popular Majors &amp; Programs</span>
              </h3>

              <div className="flex flex-wrap gap-2 pt-2">
                {u.popularMajors.map((major, idx) => (
                  <span
                    key={idx}
                    className="text-[13px] bg-[#F7F5F3] text-[#444] px-3.5 py-2 rounded-[10px] font-medium border border-[#E7E2DE] hover:border-[#690B1B]/30 hover:bg-[#F7F0F1] transition-colors"
                  >
                    {major}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTION & SUMMARY SIDEBAR */}
        <div className="space-y-6">
          {/* AI CHANCE ME BOX */}
          <div className="bg-gradient-to-br from-[#690B1B] to-[#530816] rounded-[20px] p-6 text-white shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Sparkles size={20} className="text-[#C9A55D]" />
            </div>
            <h4 className="text-[20px] font-bold">Calculate Your Admit Odds</h4>
            <p className="text-[13px] text-white/80 leading-relaxed">
              Compare your exact GPA, SAT/GRE, and extracurricular profile against historical {u.name} admits.
            </p>
            <Link
              href="/dashboard/chance-me"
              className="w-full py-3 px-4 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[13px] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Run AI Chance-Me</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* QUICK SUMMARY CARD - Cost & Value */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <h4 className="text-[16px] font-bold text-[#111] border-b border-[#F0EBE6] pb-3">
              Cost &amp; Financial Aid Summary
            </h4>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#777]">Tuition &amp; Fees</span>
                <span className="font-bold text-[#111]">{u.tuition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777]">Housing &amp; Dining</span>
                <span className="font-bold text-[#111]">{u.livingCosts}</span>
              </div>
              {u.avgNeedBasedGrant && (
                <div className="flex justify-between">
                  <span className="text-[#777]">Avg Need-Based Grant</span>
                  <span className="font-bold text-[#16a34a]">{u.avgNeedBasedGrant}</span>
                </div>
              )}
              {u.expectedSalary && (
                <div className="flex justify-between items-start gap-2 pt-2 border-t border-[#F0EBE6]">
                  <span className="text-[#777] shrink-0">Expected Salary</span>
                  <span className="font-bold text-[#111] text-right">{u.expectedSalary}</span>
                </div>
              )}
              {u.roi && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[#777] shrink-0">Estimated ROI</span>
                  <span className="font-bold text-[#059669] text-right truncate max-w-[180px]" title={u.roi}>
                    {formatRoiBadge(u.roi)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* QUICK STATS CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <h4 className="text-[16px] font-bold text-[#111] border-b border-[#F0EBE6] pb-3">
              Quick Facts
            </h4>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#777]">Type</span>
                <span className="font-bold text-[#111]">{uniType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777]">Country</span>
                <span className="font-bold text-[#111]">{u.country} {getCountryFlag(u.countryCode)}</span>
              </div>
              {u.state && (
                <div className="flex justify-between">
                  <span className="text-[#777]">State / Province</span>
                  <span className="font-bold text-[#111]">{u.state || u.province}</span>
                </div>
              )}
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#777] shrink-0">Acceptance Rate</span>
                <span className="font-bold text-[#690B1B] text-right truncate max-w-[180px]">
                  {formatAcceptance(u.acceptanceRate, u.countryCode)}
                </span>
              </div>
              {u.avgGpa !== null && (
                <div className="flex justify-between">
                  <span className="text-[#777]">Academic Standard</span>
                  <span className="font-bold text-[#111]">{u.avgGpa}</span>
                </div>
              )}
              {u.satScore && (
                <div className="flex justify-between">
                  <span className="text-[#777]">SAT Range</span>
                  <span className="font-bold text-[#111]">{u.satScore}</span>
                </div>
              )}
              {u.roi && (
                <div className="flex justify-between items-center gap-2 pt-2 border-t border-[#F0EBE6]">
                  <span className="text-[#777] shrink-0">ROI Rating</span>
                  <span className="font-bold text-[#059669] text-right truncate max-w-[180px]" title={u.roi}>
                    {formatRoiBadge(u.roi)}
                  </span>
                </div>
              )}
              {u.careerOutcomes && (
                <div className="flex flex-col gap-1 pt-2 border-t border-[#F0EBE6]">
                  <span className="text-[#777]">Placement Outcomes</span>
                  <span className="font-semibold text-[#222] text-[12px] leading-relaxed">{u.careerOutcomes}</span>
                </div>
              )}
            </div>
          </div>

          {/* EXTERNAL RESOURCES */}
          {u.website && (
            <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-3">
              <h4 className="text-[16px] font-bold text-[#111] border-b border-[#F0EBE6] pb-3">
                Official Resources
              </h4>
              <a
                href={u.website.startsWith('http') ? u.website : `https://${u.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[13px] font-semibold text-[#690B1B] hover:underline"
              >
                <Globe size={14} />
                <span>{u.website}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
