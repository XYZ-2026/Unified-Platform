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
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────── */

interface UniversityDetail {
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
  bannerAlt: string;
  popularMajors: string[];
  slug: string;
  avgGpa: number | null;
  satScore: string;
  avgNeedBasedGrant: string;
  requiredEssayPromptsDetails: string;
  writingRequirements: string;
}

/* ─── Helpers ─────────────────────────────────────────────── */

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

/* ─── Component ───────────────────────────────────────────── */

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const [university, setUniversity] = useState<UniversityDetail | null>(null);
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
          <div className="h-[220px] md:h-[260px] bg-gradient-to-r from-gray-200 to-gray-300" />
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
  const location = [u.state, u.country].filter(Boolean).join(', ');
  const essaySections = parseEssayPrompts(u.requiredEssayPromptsDetails);
  const uniType = getUniversityType(u.name);

  // Compute total cost
  const parseCurrency = (s: string) => {
    const match = s.replace(/,/g, '').match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };
  const tuitionVal = parseCurrency(u.tuition);
  const livingVal = parseCurrency(u.livingCosts);
  const totalCost = tuitionVal + livingVal;

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
        {/* TOP GRADIENT BANNER */}
        <div className="h-[190px] sm:h-[230px] md:h-[260px] bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] relative p-3.5 sm:p-6 flex flex-wrap items-start justify-between gap-2.5 text-white">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-white/3 rounded-full blur-2xl -mb-32 pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 sm:gap-2 h-[32px] sm:h-[36px] px-3 sm:px-3.5 rounded-full bg-white/10 backdrop-blur-md text-[#C9A55D] text-[11px] sm:text-[12px] font-bold relative z-10 shrink-0">
            <Sparkles size={14} className="shrink-0" />
            <span>Verified University Profile</span>
          </div>

          <div className="flex items-center gap-2 relative z-10 shrink-0">
            <button className="h-[32px] sm:h-[36px] px-3.5 sm:px-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-[11.5px] sm:text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 shrink-0">
              <Bookmark size={14} className="shrink-0" />
              <span>Add to My List</span>
            </button>
          </div>
        </div>

        {/* FLOATING DETAILS OVERLAY CARD */}
        <div className="p-4 sm:p-6 md:p-8 bg-white relative -mt-14 sm:-mt-16 mx-3 sm:mx-6 md:mx-8 rounded-[18px] sm:rounded-[20px] shadow-lg border border-[#E7E2DE] space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[18px] bg-[#F7F0F1] border border-[#690B1B]/20 flex items-center justify-center text-[26px] sm:text-[36px] shrink-0 aspect-square">
                {getUniversityEmoji(u.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-[20px] sm:text-[26px] md:text-[32px] font-bold text-[#111111] leading-tight break-words">
                  {u.name}
                </h1>
                <div className="text-[12.5px] sm:text-[14px] text-[#777777] flex items-center gap-1.5 mt-1 flex-wrap">
                  <MapPin size={14} className="text-[#690B1B] shrink-0" />
                  <span>{location}</span>
                  {u.countryCode && <span className="ml-1 shrink-0">{getCountryFlag(u.countryCode)}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto pt-1 md:pt-0">
              {u.qsRanking && u.qsRanking !== 'Unranked' && (
                <span className="text-[11px] sm:text-[12px] font-bold bg-[#690B1B] text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full whitespace-nowrap">
                  #{u.qsRanking} QS World
                </span>
              )}
              <span className="text-[11px] sm:text-[12px] font-bold bg-[#F7F0F1] text-[#690B1B] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full whitespace-nowrap">
                {u.acceptanceRate} Acceptance
              </span>
              <span className="text-[11px] sm:text-[12px] font-bold bg-[#FFF8EB] text-[#9E731A] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full whitespace-nowrap">
                {uniType}
              </span>
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
            <a
              href={`https://npc.collegeboard.org/app`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <span>Net Price Calculator</span>
              <ExternalLink size={13} />
            </a>
            <span className="text-[#D4CFC9]">•</span>
            <a
              href={`https://nces.ed.gov/collegenavigator/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <span>Common Data Set</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* NAVIGATION SUB-TABS */}
        <div className="px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 pb-2 border-t border-[#F0EBE6] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'admissions', label: 'Admissions & Requirements' },
            { id: 'cost', label: 'Cost & Scholarships' },
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
                    label: 'Avg GPA',
                    value: u.avgGpa !== null ? `${u.avgGpa} / 4.0` : 'N/A',
                    color: 'text-[#690B1B]'
                  },
                  {
                    label: 'SAT Middle 50%',
                    value: u.satScore || 'N/A',
                    color: 'text-[#111111]'
                  },
                  {
                    label: 'Acceptance Rate',
                    value: u.acceptanceRate || 'N/A',
                    color: 'text-[#690B1B]'
                  },
                  {
                    label: 'QS World Rank',
                    value: u.qsRanking === 'Unranked' || !u.qsRanking ? '—' : `#${u.qsRanking}`,
                    color: 'text-[#C9A55D]'
                  }
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-3 sm:p-4 text-center flex flex-col justify-center items-center min-h-[108px] sm:min-h-[120px] h-full"
                  >
                    <div className="text-[11px] sm:text-[12px] text-[#777] font-medium h-[32px] flex items-center justify-center text-center leading-snug">
                      {m.label}
                    </div>
                    <div className={`text-[17px] xs:text-[19px] sm:text-[22px] font-bold mt-1 leading-tight ${m.color} flex items-center justify-center flex-1`}>
                      {m.value}
                    </div>
                  </div>
                ))}
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

          {/* QUICK SUMMARY CARD - Cost */}
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
                  <span className="font-bold text-[#111]">{u.state}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#777]">Acceptance Rate</span>
                <span className="font-bold text-[#690B1B]">{u.acceptanceRate}</span>
              </div>
              {u.avgGpa !== null && (
                <div className="flex justify-between">
                  <span className="text-[#777]">Avg GPA</span>
                  <span className="font-bold text-[#111]">{u.avgGpa}</span>
                </div>
              )}
              {u.satScore && (
                <div className="flex justify-between">
                  <span className="text-[#777]">SAT Range</span>
                  <span className="font-bold text-[#111]">{u.satScore}</span>
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
