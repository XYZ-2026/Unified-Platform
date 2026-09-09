'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  GraduationCap,
  MapPin,
  ArrowRight,
  Sparkles,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Globe,
  X,
} from 'lucide-react';
import { searchUniversities, UniversitySearchRecord, SearchResult } from '@/lib/search/universitySearchEngine';

interface University extends UniversitySearchRecord {
  universityId: string;
  bannerImage?: string;
  bannerAlt: string;
  popularMajors: string[];
  slug: string;
}

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

export default function UniversityFinderPage() {
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const ITEMS_PER_PAGE = 30;

  // Keyboard shortcut listener (/ to search, Esc to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchTerm('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch all universities once on mount for instant real-time indexing
  const fetchUniversities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wix/universities?limit=200');
      const data = await res.json();

      if (data.success && Array.isArray(data.universities)) {
        setAllUniversities(data.universities);
      } else {
        setAllUniversities([]);
      }
    } catch (err) {
      console.warn('Error fetching universities catalog:', err);
      setAllUniversities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // Instant real-time fuzzy search & relevance scoring (0ms execution time)
  const searchResults: SearchResult<University>[] = useMemo(() => {
    return searchUniversities(allUniversities, {
      search: searchTerm,
      country: selectedCountry,
      minScoreThreshold: 45,
    });
  }, [allUniversities, searchTerm, selectedCountry]);

  // Reset to page 1 whenever search query or country changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry]);

  // Pagination slice
  const totalCount = searchResults.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return searchResults.slice(start, start + ITEMS_PER_PAGE);
  }, [searchResults, currentPage]);

  const handleClearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  return (
    <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      {/* HERO PROMO BANNER */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-8 text-white shadow-sm space-y-3 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-white/3 rounded-full blur-2xl -mb-32 pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[12px] font-bold">
            <Sparkles size={14} />
            <span>Verified University Database</span>
          </div>

          <button
            onClick={fetchUniversities}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-[12px] font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Refresh database"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Catalog</span>
          </button>
        </div>

        <h2 className="text-[28px] md:text-[36px] font-bold leading-tight relative z-10">
          University Finder
        </h2>
        <p className="text-[14px] text-white/80 max-w-[700px] relative z-10 leading-relaxed">
          Explore {allUniversities.length > 0 ? `${allUniversities.length.toLocaleString()}+` : ''} verified universities synced directly from our database. Search by acronym (MIT, CMU), abbreviations, typos, state, or major to find your perfect fit.
        </p>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] group-focus-within:text-[#690B1B] transition-colors" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, acronym (e.g. MIT, CMU, UCLA), major, state, or typo..."
              className="w-full h-[48px] pl-11 pr-24 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] placeholder:text-[#999] outline-none focus:border-[#690B1B] focus:ring-2 focus:ring-[#690B1B]/10 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="p-1 rounded-full text-[#999] hover:text-[#111] hover:bg-[#F0EBE6] transition-all cursor-pointer"
                  title="Clear search (Esc)"
                >
                  <X size={16} />
                </button>
              )}
              <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-[#F0EBE6] text-[#888] text-[11px] font-semibold border border-[#E7E2DE]">
                /
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { code: 'ALL', label: 'All Countries', flag: '🌍' },
              { code: 'US', label: 'United States', flag: '🇺🇸' },
              { code: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
              { code: 'CA', label: 'Canada', flag: '🇨🇦' },
              { code: 'DE', label: 'Germany', flag: '🇩🇪' },
              { code: 'AU', label: 'Australia', flag: '🇦🇺' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => setSelectedCountry(item.code)}
                className={`px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  selectedCountry === item.code
                    ? 'bg-[#690B1B] text-white shadow-xs'
                    : 'bg-[#F7F5F3] text-[#555] hover:bg-[#E7E2DE]'
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#F0EBE6] pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[12px] text-[#888] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
            <span>
              {loading ? (
                'Loading universities...'
              ) : (
                <>
                  <strong className="text-[#111]">{totalCount.toLocaleString()}</strong> universities found
                </>
              )}
            </span>
          </div>
          {totalCount > 0 && !loading && (
            <span className="text-[12px] text-[#888] font-medium">
              Showing {startIndex}–{endIndex} of {totalCount.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* UNIVERSITY CARDS */}
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
      ) : paginatedResults.length === 0 ? (
        <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F7F0F1] text-[#690B1B] mx-auto flex items-center justify-center">
            <GraduationCap size={28} />
          </div>
          <h3 className="text-[20px] font-bold text-[#111]">
            {searchTerm ? `No universities matched "${searchTerm}"` : 'No universities found'}
          </h3>
          <p className="text-[14px] text-[#777] max-w-[460px] mx-auto leading-relaxed">
            Try checking for alternate keywords, state names, or clearing your country filter.
          </p>
          {(searchTerm || selectedCountry !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('ALL');
              }}
              className="px-5 py-2.5 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Reset Search & Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedResults.map(({ item: u, matchType, matchedAlias, matchedField }) => (
            <div
              key={u.id}
              className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs hover:border-[#690B1B] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F7F0F1] border border-[#690B1B]/10 flex items-center justify-center text-[24px] shrink-0">
                    {getUniversityEmoji(u.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-[#111] leading-snug line-clamp-2 group-hover:text-[#690B1B] transition-colors">
                      {u.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[12px] text-[#777]">
                      <MapPin size={12} className="text-[#999] shrink-0" />
                      <span className="truncate">{u.state ? `${u.state}, ` : ''}{u.country}</span>
                      <span className="shrink-0">{getCountryFlag(u.countryCode || '')}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE]">
                  <div className="text-center">
                    <div className="text-[10px] text-[#999] font-semibold uppercase tracking-wider">QS Rank</div>
                    <div className="text-[13px] font-bold text-[#690B1B] mt-0.5">
                      {u.qsRanking === 'Unranked' || !u.qsRanking ? '—' : u.qsRanking}
                    </div>
                  </div>
                  <div className="text-center border-x border-[#E7E2DE]">
                    <div className="text-[10px] text-[#999] font-semibold uppercase tracking-wider">Tuition</div>
                    <div className="text-[13px] font-bold text-[#111] mt-0.5 truncate px-1">{u.tuition || 'N/A'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-[#999] font-semibold uppercase tracking-wider">Accept</div>
                    <div className="text-[13px] font-bold text-[#16a34a] mt-0.5">{u.acceptanceRate || 'N/A'}</div>
                  </div>
                </div>

                {/* Major Tags */}
                {u.popularMajors && u.popularMajors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {u.popularMajors.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-[#F7F5F3] text-[#555] px-2 py-0.5 rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {u.popularMajors.length > 4 && (
                      <span className="text-[10px] text-[#999] px-1 py-0.5 font-medium">
                        +{u.popularMajors.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#F0EBE6] flex items-center justify-between">
                {u.website ? (
                  <a
                    href={u.website.startsWith('http') ? u.website : `https://${u.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#690B1B] font-semibold flex items-center gap-1 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe size={12} />
                    <span>Website</span>
                    <ExternalLink size={10} />
                  </a>
                ) : (
                  <span />
                )}

                <Link
                  href={`/dashboard/schools/${u.slug}`}
                  className="px-4 py-1.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer group-hover:scale-[1.02] active:scale-95"
                >
                  <span>View University</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              currentPage === 1
                ? 'bg-[#F7F5F3] text-[#CCC] cursor-not-allowed'
                : 'bg-[#F7F5F3] text-[#555] hover:bg-[#E7E2DE]'
            }`}
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
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
                  className={`w-10 h-10 rounded-[10px] text-[13px] font-bold transition-all cursor-pointer active:scale-95 ${
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
            className={`px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              currentPage === totalPages
                ? 'bg-[#F7F5F3] text-[#CCC] cursor-not-allowed'
                : 'bg-[#F7F5F3] text-[#555] hover:bg-[#E7E2DE]'
            }`}
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

