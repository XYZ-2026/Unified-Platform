'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeftRight,
  Search,
  Plus,
  X,
  ExternalLink,
  Calculator,
  Sparkles,
  CheckCircle2,
  Building2,
  Share2,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  DollarSign,
  Award,
  Layers,
  Check
} from 'lucide-react';
import universitiesData from '@/data/universities-us.json';
import { University, formatCurrency, formatSATRange, formatPercentage } from '@/lib/npc/data-service';

// Curated comparison presets with exact names
const PRESETS: Record<string, { label: string; icon: string; matchNames: string[] }> = {
  ivy: {
    label: 'Ivy & Elite Privates',
    icon: '🏛️',
    matchNames: ['Harvard University', 'Yale University', 'Princeton University', 'Columbia University']
  },
  flagships: {
    label: 'Top Public Flagships',
    icon: '🌲',
    matchNames: ['University of California, Berkeley', 'University of Michigan - Ann Arbor', 'University of Virginia, Charlottesville']
  },
  stem: {
    label: 'Top Tech & STEM',
    icon: '⚙️',
    matchNames: ['Massachusetts Institute of Technology', 'California Institute of Technology', 'Georgia Institute of Technology', 'Carnegie Mellon University']
  },
  highAid: {
    label: 'Accessible & High-Aid',
    icon: '💡',
    matchNames: ['Haskell Indian Nations University', 'Southwestern Indian Polytechnic Institute', 'Marywood University']
  }
};

function CompareContent() {
  const searchParams = useSearchParams();

  // All universities list
  const allUnis = useMemo(() => universitiesData as unknown as University[], []);

  // Default selection: Haskell Indian Nations, Southwestern Indian Polytechnic, Marywood University
  const defaultUnis = useMemo(() => {
    const haskell = allUnis.find(u => u.name.toLowerCase().includes('haskell'));
    const sipi = allUnis.find(u => u.name.toLowerCase().includes('southwestern indian'));
    const marywood = allUnis.find(u => u.name.toLowerCase().includes('marywood'));
    const initial = [haskell, sipi, marywood].filter(Boolean) as University[];
    if (initial.length >= 2) return initial.map(u => u.id);
    return allUnis.slice(0, 3).map(u => u.id);
  }, [allUnis]);

  // Selected University IDs (Defaults to empty/blank unless specified in URL)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const fromUrl = searchParams.get('unis');
    if (fromUrl) {
      const parsed = fromUrl.split(',').map(s => s.trim()).filter(id => allUnis.some(u => u.id === id));
      if (parsed.length > 0) return parsed.slice(0, 4);
    }
    return []; // Blank at first
  });

  // Modal search state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [modalSlotIndex, setModalSlotIndex] = useState<number | null>(null); // null = add new, number = swap
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [majorFilter, setMajorFilter] = useState('');

  // Highlight differences toggle
  const [highlightBest, setHighlightBest] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mobileH2HIndices, setMobileH2HIndices] = useState<[number, number]>([0, 1]);
  const [mobileCompareMode, setMobileCompareMode] = useState<'h2h' | 'stacked'>('h2h');


  // Sync to URL query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('unis', selectedIds.join(','));
      const newRelativePathQuery = window.location.pathname + '?' + currentParams.toString();
      window.history.replaceState(null, '', newRelativePathQuery);
    }
  }, [selectedIds]);

  // Selected University Objects
  const selectedUnis = useMemo(() => {
    return selectedIds
      .map(id => allUnis.find(u => u.id === id))
      .filter(Boolean) as University[];
  }, [selectedIds, allUnis]);

  // Horizontal Scroll & Drag Navigation for Table
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const checkScrollState = useCallback(() => {
    const el = tableContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 15);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 15);
    }
  }, []);

  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;
    checkScrollState();

    const handleScroll = () => checkScrollState();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [checkScrollState, selectedUnis]);

  const scrollColumns = (direction: 'left' | 'right') => {
    const el = tableContainerRef.current;
    if (el) {
      const scrollAmount = Math.max(300, Math.floor(el.clientWidth * 0.65));
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, a, select, input')) return;
    const el = tableContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = tableContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Unique list of states for filter
  const stateList = useMemo(() => {
    const set = new Set(allUnis.map(u => u.state).filter(Boolean));
    return Array.from(set).sort();
  }, [allUnis]);

  // Filtered universities for search modal
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && filterState === 'all') {
      return allUnis.slice(0, 30);
    }
    const q = searchQuery.toLowerCase().trim();
    return allUnis
      .filter(u => {
        const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.state.toLowerCase().includes(q);
        const matchesState = filterState === 'all' || u.state.toLowerCase() === filterState.toLowerCase();
        return matchesQuery && matchesState;
      })
      .slice(0, 35);
  }, [allUnis, searchQuery, filterState]);

  // Add university
  const handleAddUniversity = (id: string) => {
    if (selectedIds.includes(id)) return;
    if (modalSlotIndex !== null && modalSlotIndex < selectedIds.length) {
      const updated = [...selectedIds];
      updated[modalSlotIndex] = id;
      setSelectedIds(updated);
    } else if (selectedIds.length < 4) {
      setSelectedIds(prev => [...prev, id]);
    }
    setSearchModalOpen(false);
    setSearchQuery('');
    setModalSlotIndex(null);
  };

  // Remove university
  const handleRemoveUniversity = (id: string) => {
    setSelectedIds(prev => prev.filter(item => item !== id));
  };

  // Clear all universities to return to blank state
  const handleClearAll = () => {
    setSelectedIds([]);
  };

  // Apply preset
  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    const matched: string[] = [];
    for (const needle of preset.matchNames) {
      const found = allUnis.find(u => u.name === needle || u.name.toLowerCase().includes(needle.toLowerCase()));
      if (found && !matched.includes(found.id)) matched.push(found.id);
    }
    if (matched.length > 0) {
      setSelectedIds(matched.slice(0, 4));
    }
  };

  // Share comparison link
  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  // Metric helpers for best picks
  const lowestTuitionId = useMemo(() => {
    if (selectedUnis.length === 0) return null;
    let min = Infinity;
    let id = null;
    for (const u of selectedUnis) {
      if (u.tuition > 0 && u.tuition < min) {
        min = u.tuition;
        id = u.id;
      }
    }
    return id;
  }, [selectedUnis]);

  const highestGrantId = useMemo(() => {
    if (selectedUnis.length === 0) return null;
    let max = -Infinity;
    let id = null;
    for (const u of selectedUnis) {
      if (u.avgNeedBasedGrant > max) {
        max = u.avgNeedBasedGrant;
        id = u.id;
      }
    }
    return id;
  }, [selectedUnis]);

  const highestAcceptanceId = useMemo(() => {
    if (selectedUnis.length === 0) return null;
    let max = -Infinity;
    let id = null;
    for (const u of selectedUnis) {
      if (u.acceptanceRate > max) {
        max = u.acceptanceRate;
        id = u.id;
      }
    }
    return id;
  }, [selectedUnis]);

  const highestSatId = useMemo(() => {
    if (selectedUnis.length === 0) return null;
    let max = -Infinity;
    let id = null;
    for (const u of selectedUnis) {
      if (u.satScore && u.satScore.max > max) {
        max = u.satScore.max;
        id = u.id;
      }
    }
    return id;
  }, [selectedUnis]);

  // Section Header Helper
  const renderSectionHeader = (title: string, subtitle: string) => (
    <tr className="bg-[#F7F4F0] border-y border-[#EAE6E2]">
      <td className="py-3.5 px-5 font-black text-[14.5px] uppercase tracking-wider text-[#690B1B] bg-[#F7F4F0] sticky left-0 z-20 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
        {title}
      </td>
      <td
        colSpan={selectedUnis.length + (selectedUnis.length < 4 ? 1 : 0)}
        className="py-3.5 px-5 font-bold text-[13px] text-[#666666] bg-[#F7F4F0] uppercase tracking-wider"
      >
        {subtitle}
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F4] text-[#111111] p-3 sm:p-5 md:p-8 space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
         DETAILED HERO SECTION & INSTITUTIONAL COMPARISON ENGINE
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[28px] p-6 sm:p-8 md:p-10 text-white shadow-xl space-y-7 border border-white/10 relative overflow-hidden">
        {/* Ambient Decorative Blurs */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C9A55D]/10 rounded-full blur-3xl -mr-28 -mt-28 pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mb-40 pointer-events-none" />

        {/* Top Meta Bar: Breadcrumbs & Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 text-[12px] sm:text-[12.5px] text-white/70 flex-wrap font-medium">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={13} className="text-white/40" />
            <Link href="/dashboard/schools" className="hover:text-white transition-colors">
              University Finder
            </Link>
            <ChevronRight size={13} className="text-white/40" />
            <span className="text-[#C9A55D] font-bold">Comparison Matrix</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#C9A55D] text-[11.5px] sm:text-[12px] font-bold border border-white/15 shadow-2xs self-start sm:self-auto">
            <Sparkles size={14} className="text-[#F4B400] animate-pulse" />
            <span>Multi-Dimensional Decision Engine</span>
          </div>
        </div>

        {/* Main Hero Headline & Description */}
        <div className="space-y-3 relative z-10 max-w-4xl">
          <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-black tracking-tight leading-[1.15]">
            Side-by-Side <span className="text-[#C9A55D]">University Comparison</span> Matrix
          </h1>
          <p className="text-[13.5px] sm:text-[15px] md:text-[15.5px] text-white/85 leading-relaxed font-normal">
            Make confident, data-backed higher education decisions. Systematically analyze sticker costs vs. genuine out-of-pocket net prices, authentic institutional scholarships, selectivity percentiles, English cut-offs, and academic strengths across 2,328+ US institutions.
          </p>
        </div>

        {/* 4 Quick Stat Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-1 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-[16px] p-3.5 sm:p-4 border border-white/15 space-y-1">
            <div className="flex items-center gap-2 text-[#C9A55D]">
              <Building2 size={16} />
              <span className="text-[13px] font-extrabold uppercase tracking-wider text-white/75">Coverage</span>
            </div>
            <div className="text-[18px] sm:text-[22px] font-black text-white">2,328+</div>
            <div className="text-[11px] text-white/70">Institutions across all 50 states</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-[16px] p-3.5 sm:p-4 border border-white/15 space-y-1">
            <div className="flex items-center gap-2 text-[#C9A55D]">
              <Award size={16} />
              <span className="text-[13px] font-extrabold uppercase tracking-wider text-white/75">Authentic Aid</span>
            </div>
            <div className="text-[18px] sm:text-[22px] font-black text-white">Verified</div>
            <div className="text-[11px] text-white/70">Institutional, tribal & state awards</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-[16px] p-3.5 sm:p-4 border border-white/15 space-y-1">
            <div className="flex items-center gap-2 text-[#C9A55D]">
              <DollarSign size={16} />
              <span className="text-[13px] font-extrabold uppercase tracking-wider text-white/75">Financials</span>
            </div>
            <div className="text-[18px] sm:text-[22px] font-black text-white">Net vs. Sticker</div>
            <div className="text-[11px] text-white/70">Tuition, housing & direct grants</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-[16px] p-3.5 sm:p-4 border border-white/15 space-y-1">
            <div className="flex items-center gap-2 text-[#C9A55D]">
              <Layers size={16} />
              <span className="text-[13px] font-extrabold uppercase tracking-wider text-white/75">Parameters</span>
            </div>
            <div className="text-[18px] sm:text-[22px] font-black text-white">30+ Metrics</div>
            <div className="text-[11px] text-white/70">Admissions, TOEFL, essays & majors</div>
          </div>
        </div>

        {/* Action Controls & Active Comparison Pill Bar */}
        <div className="pt-4 border-t border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          {/* Active Comparison Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-white/70">
              Comparing ({selectedUnis.length}/4):
            </span>
            {selectedUnis.length === 0 ? (
              <span className="text-[12px] text-white/60 italic font-medium">
                No universities added yet — click &ldquo;+ Add College&rdquo; or pick a preset below
              </span>
            ) : (
              selectedUnis.map(u => (
                <span
                  key={u.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[12px] font-bold border border-white/20"
                >
                  <span>{u.name}</span>
                  <button
                    onClick={() => handleRemoveUniversity(u.id)}
                    className="hover:text-[#ff8080] transition-colors cursor-pointer"
                    title="Remove from comparison"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
            {selectedUnis.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-bold text-white/70 hover:text-white underline ml-1 cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Highlight Best Values Toggle */}
            <button
              onClick={() => setHighlightBest(!highlightBest)}
              className={`px-3.5 py-2 rounded-full text-[12px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                highlightBest
                  ? 'bg-[#C9A55D] text-black border-[#C9A55D] shadow-md font-extrabold'
                  : 'bg-white/15 text-white border-white/25 hover:bg-white/25'
              }`}
            >
              <Sparkles size={14} className={highlightBest ? 'text-black' : 'text-[#C9A55D]'} />
              <span>{highlightBest ? 'Highlighting Best Values' : 'Highlight Best Values'}</span>
            </button>

            {/* Share / Copy Link */}
            <button
              onClick={handleShareLink}
              className="px-3.5 py-2 rounded-full text-[12px] font-bold bg-white/15 text-white border border-white/25 hover:bg-white/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedLink ? <CheckCircle2 size={15} className="text-[#4ade80]" /> : <Share2 size={15} />}
              <span>{copiedLink ? 'Copied to Clipboard!' : 'Share Comparison'}</span>
            </button>

            {/* Add College Button */}
            {selectedIds.length < 4 && (
              <button
                onClick={() => {
                  setModalSlotIndex(null);
                  setSearchModalOpen(true);
                }}
                className="px-4 py-2 rounded-full text-[12.5px] font-bold bg-white text-[#690B1B] hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus size={16} />
                <span>Add College ({selectedIds.length}/4)</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-2.5 relative z-10">
          <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-white/70 mr-1">
            Quick Presets:
          </span>
          {Object.entries(PRESETS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => handleApplyPreset(key)}
              className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      {selectedUnis.length === 0 ? (
        /* ════ EMPTY STATE: USER INVITED TO ADD DESIRED UNIVERSITIES ════ */
        <div className="bg-white rounded-[24px] border border-[#E7E2DE] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8 sm:p-12 text-center space-y-8">
          <div className="max-w-lg mx-auto space-y-3.5">
            <div className="w-16 h-16 rounded-[22px] bg-[#690B1B]/10 text-[#690B1B] mx-auto flex items-center justify-center font-bold shadow-xs">
              <ArrowLeftRight size={30} />
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-black text-[#111111] tracking-tight">
              Start Your University Comparison
            </h2>
            <p className="text-[13.5px] text-[#666666] leading-relaxed">
              Add your desired universities to compare published tuition, living expenses, authentic scholarships, admissions selectivity, and essay requirements side-by-side.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setModalSlotIndex(null);
                  setSearchModalOpen(true);
                }}
                className="px-6 py-3 rounded-full text-[13.5px] font-bold bg-[#690B1B] hover:bg-[#530816] text-white shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus size={18} />
                <span>+ Add Universities to Compare</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Visual Slots Preview */}
          <div className="pt-6 border-t border-[#F0EBE6]">
            <div className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#888888] mb-4">
              Click Any Slot to Add a University (Up to 4)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((slotNum) => (
                <button
                  key={slotNum}
                  onClick={() => {
                    setModalSlotIndex(null);
                    setSearchModalOpen(true);
                  }}
                  className="rounded-[20px] border-2 border-dashed border-[#D9D2CB] hover:border-[#690B1B] hover:bg-[#FAF8F6] p-6 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group min-h-[170px]"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F2ECE6] group-hover:bg-[#690B1B]/10 flex items-center justify-center transition-colors">
                    <Plus size={22} className="text-[#888888] group-hover:text-[#690B1B]" />
                  </div>
                  <div className="text-center">
                    <div className="text-[13.5px] font-extrabold text-[#111111] group-hover:text-[#690B1B]">
                      + Add College {slotNum}
                    </div>
                    <div className="text-[11.5px] text-[#888888] mt-0.5">
                      Search by name or state
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets Section */}
          <div className="pt-6 border-t border-[#F0EBE6] max-w-3xl mx-auto space-y-3">
            <span className="text-[12px] font-bold text-[#888888]">
              Or load a curated comparison with 1 click:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(PRESETS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => handleApplyPreset(key)}
                  className="p-3.5 rounded-[16px] bg-[#FAF8F6] hover:bg-[#F2ECE6] border border-[#E7E2DE] text-[#222222] transition-all flex flex-col items-center gap-1.5 cursor-pointer shadow-2xs group"
                >
                  <span className="text-[22px]">{item.icon}</span>
                  <span className="text-[12px] font-bold text-center group-hover:text-[#690B1B] leading-tight">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
      {/* ── CATEGORY ANCHOR TABS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[14px] font-bold scrollbar-none">
        {[
          { id: 'all', label: 'All Parameters' },
          { id: 'overview', label: '🏛️ Overview & Ranking' },
          { id: 'financials', label: '💰 Costs & Aid' },
          { id: 'scholarships', label: '🎓 Key Scholarships' },
          { id: 'admissions', label: '📊 Selectivity & GPA' },
          { id: 'testing', label: '🗣️ English & Testing' },
          { id: 'requirements', label: '📋 Checklist & Essays' },
          { id: 'majors', label: '📚 Popular Majors' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-[#690B1B] text-white shadow-2xs font-extrabold'
                : 'bg-white text-[#666666] border border-[#E7E2DE] hover:text-[#111111] hover:bg-[#FBF9F6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── COMPARISON MATRIX CARD & TABLE ── */}
            {/* ─── HORIZONTAL SCROLL CONTROLLER BAR (DESKTOP & TABLET) ─── */}
      {selectedUnis.length > 1 && (
        <div className="hidden md:flex items-center justify-between bg-white border border-[#E7E2DE] px-5 py-3 rounded-[20px] text-[12.5px] shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#690B1B] shrink-0 animate-pulse" />
            <span className="font-bold text-[#111111]">
              Comparing {selectedUnis.length} of 4 Universities
            </span>
            <span className="text-[#888888] font-medium hidden lg:inline">
              • Click arrows or drag to view hidden columns horizontally
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12.5px] font-bold text-[#777777] uppercase tracking-wider hidden sm:inline">
              Column Controls:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollColumns('left')}
                disabled={!canScrollLeft}
                className="px-4 py-2 rounded-full bg-[#FAF8F6] border border-[#E7E2DE] text-[#111111] font-bold text-[13px] hover:bg-[#690B1B] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Scroll Columns Left"
              >
                <ChevronLeft size={15} />
                <span>Scroll Left</span>
              </button>
              <button
                type="button"
                onClick={() => scrollColumns('right')}
                disabled={!canScrollRight}
                className="px-4 py-2 rounded-full bg-[#690B1B] text-white font-bold text-[13px] hover:bg-[#530816] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Scroll Columns Right"
              >
                <span>Scroll Right</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── COMPARISON MATRIX CARD & TABLE ─── */}
      <div className="hidden md:block bg-white rounded-[24px] border border-[#E7E2DE] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div
          ref={tableContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`overflow-x-auto select-none touch-pan-x transition-colors ${
            isDragging ? 'cursor-grabbing' : 'cursor-default'
          } [scrollbar-width:auto] [scrollbar-color:#C9A55D_#EAE4DF] [&::-webkit-scrollbar]:h-3.5 [&::-webkit-scrollbar-track]:bg-[#F0EBE6] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C9A55D] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#690B1B]`}
        >
          <table className="w-full border-collapse text-left">
            {/* ════ STICKY TABLE HEADER (COLLEGE CARDS) ════ */}
            <thead>
              <tr className="border-b border-[#E7E2DE] bg-[#FAF8F6]">
                <th className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] text-[13.5px] font-extrabold uppercase tracking-wider text-[#888888] align-bottom bg-[#FAF8F6] sticky left-0 z-30 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                  <div className="space-y-2">
                    <div className="text-[#111111] font-black text-[16px]">Compared Colleges</div>
                    <div className="text-[13px] text-[#666666] normal-case font-bold">
                      {selectedUnis.length} of 4 selected
                    </div>
                    {/* Sticky header quick navigation arrows */}
                    {selectedUnis.length > 2 && (
                      <div className="pt-2 border-t border-[#EAE6E2] flex items-center justify-between">
                        <span className="text-[12px] text-[#666666] font-bold normal-case">Scroll cols:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => scrollColumns('left')}
                            disabled={!canScrollLeft}
                            className="p-1 rounded-[6px] bg-white border border-[#D9D2CB] text-[#111111] hover:bg-[#690B1B] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                            title="Scroll Left"
                          >
                            <ChevronLeft size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => scrollColumns('right')}
                            disabled={!canScrollRight}
                            className="p-1 rounded-[6px] bg-[#690B1B] text-white hover:bg-[#530816] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                            title="Scroll Right"
                          >
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </th>

                {selectedUnis.map((uni, idx) => (
                  <th
                    key={uni.id}
                    className="p-4 sm:p-5 min-w-[280px] max-w-[340px] align-top relative border-r border-[#EAE6E2] bg-[#FAF8F6]"
                  >
                    <div className="space-y-3">
                      {/* Top Action Bar: Swap and Remove */}
                      <div className="flex items-center justify-between gap-1">
                        <button
                          onClick={() => {
                            setModalSlotIndex(idx);
                            setSearchModalOpen(true);
                          }}
                          className="text-[12.5px] font-extrabold text-[#690B1B] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowLeftRight size={13} />
                          <span>Swap</span>
                        </button>
                        <button
                          onClick={() => handleRemoveUniversity(uni.id)}
                          className="p-1 rounded-full text-[#888888] hover:text-[#e11d48] hover:bg-[#ffe4e6] transition-colors cursor-pointer"
                          title="Remove college"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* College Name & State */}
                      <div className="space-y-1">
                        <div className="text-[18px] font-black text-[#111111] leading-snug line-clamp-2">
                          {uni.name}
                        </div>
                        <div className="text-[14px] text-[#555555] flex items-center gap-1.5 font-semibold">
                          <span>📍 {uni.state}</span>
                          <span className="text-[#C9A55D]">•</span>
                          <span className="font-bold text-[#690B1B]">{uni.qsRanking}</span>
                        </div>
                      </div>

                      {/* Quick Snapshot: Tuition & Net Price Badge */}
                      <div className="pt-2 border-t border-[#EAE6E2] flex items-center justify-between text-[13px]">
                        <div>
                          <div className="text-[#777777] text-[11.5px] uppercase font-extrabold">Sticker Tuition</div>
                          <div className="text-[18px] font-black text-[#111111]">
                            {formatCurrency(uni.tuition)}
                            <span className="text-[12px] font-medium text-[#777777]">/yr</span>
                          </div>
                        </div>

                        <Link
                          href={`/dashboard/calculator`}
                          className="px-3 py-1.5 rounded-[10px] bg-[#690B1B]/10 hover:bg-[#690B1B]/20 text-[#690B1B] font-bold text-[12.5px] transition-colors flex items-center gap-1.5 shadow-2xs"
                          title="Simulate in Net Price Calculator"
                        >
                          <Calculator size={13} />
                          <span>Simulate</span>
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}

                {/* Empty Slot Placeholder if < 4 colleges */}
                {selectedUnis.length < 4 && (
                  <th className="p-4 sm:p-5 min-w-[240px] max-w-[300px] align-middle bg-[#FBF9F6] border-r border-[#EAE6E2]">
                    <button
                      onClick={() => {
                        setModalSlotIndex(null);
                        setSearchModalOpen(true);
                      }}
                      className="w-full h-full min-h-[140px] rounded-[16px] border-2 border-dashed border-[#D9D2CB] hover:border-[#690B1B] hover:bg-white text-[#777777] hover:text-[#690B1B] transition-all flex flex-col items-center justify-center gap-2 p-4 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#EAE4DF] group-hover:bg-[#690B1B]/10 flex items-center justify-center transition-colors">
                        <Plus size={20} className="group-hover:text-[#690B1B]" />
                      </div>
                      <span className="text-[14.5px] font-black text-[#111111]">Add Another College</span>
                      <span className="text-[12.5px] text-[#777777]">Compare up to 4 side-by-side</span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>

            {/* ════ TABLE BODY: DETAILED PARAMETERS MATRIX ════ */}
            <tbody className="divide-y divide-[#F0EBE6] text-[14px]">
              {/* ─────────────────────────────────────────────
                  SECTION 1: 🏛️ OVERVIEW & RANKING
                  ───────────────────────────────────────────── */}
              {(activeCategory === 'all' || activeCategory === 'overview') && (
                <>
                  {renderSectionHeader('🏛️ Institutional Standing', 'Identity, State Location, and Digital Portals')}

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Location / State
                    </td>
                    {selectedUnis.map(u => (
                      <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle font-medium">
                        <span className="font-bold text-[#111111]">{u.state}</span>, United States
                      </td>
                    ))}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Ranking Standing
                    </td>
                    {selectedUnis.map(u => (
                      <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#C9A55D]/15 text-[#856404] border border-[#C9A55D]/30">
                          {u.qsRanking}
                        </span>
                      </td>
                    ))}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Official Portal
                    </td>
                    {selectedUnis.map(u => (
                      <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle">
                        <a
                          href={u.website?.startsWith('http') ? u.website : `https://${u.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#690B1B] hover:underline font-bold text-[14.5px] inline-flex items-center gap-1"
                        >
                          <span>{u.website || 'Visit Website'}</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                    ))}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>
                </>
              )}

              {/* ─────────────────────────────────────────────
                  SECTION 2: 💰 COSTS & FINANCIAL AID
                  ───────────────────────────────────────────── */}
              {(activeCategory === 'all' || activeCategory === 'financials') && (
                <>
                  {renderSectionHeader('💰 Costs & Financial Aid', 'Tuition, Room & Board, Direct Grants & Net Out-of-Pocket')}

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Published Tuition & Fees
                    </td>
                    {selectedUnis.map(u => {
                      const isBest = highlightBest && u.id === lowestTuitionId;
                      return (
                        <td key={u.id} className={`p-4 sm:p-5 border-r border-[#EAE6E2] align-middle ${isBest ? 'bg-[#16a34a]/5' : ''}`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[18px] font-black text-[#111111]">
                              {formatCurrency(u.tuition)}
                            </span>
                            {isBest && (
                              <span className="text-[11px] font-black uppercase tracking-wide bg-[#16a34a] text-white px-2.5 py-1 rounded-full">
                                Lowest Tuition
                              </span>
                            )}
                          </div>
                          <div className="text-[12.5px] text-[#666666]">Annual base rate</div>
                        </td>
                      );
                    })}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Room & Board / Living
                    </td>
                    {selectedUnis.map(u => (
                      <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle">
                        <span className="text-[18px] font-black text-[#111111]">
                          {formatCurrency(u.livingCosts)}
                        </span>
                        <div className="text-[12.5px] text-[#666666]">Housing & food allowance</div>
                      </td>
                    ))}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Total Published COA
                    </td>
                    {selectedUnis.map(u => (
                      <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle">
                        <div className="text-[18px] font-black text-[#111111]">
                          {formatCurrency(u.tuition + u.livingCosts)}
                        </div>
                        <div className="text-[12.5px] text-[#666666]">Tuition + Room & Board</div>
                      </td>
                    ))}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Average Need-Based Grant
                    </td>
                    {selectedUnis.map(u => {
                      const isBest = highlightBest && u.id === highestGrantId;
                      return (
                        <td key={u.id} className={`p-4 sm:p-5 border-r border-[#EAE6E2] align-middle ${isBest ? 'bg-[#16a34a]/5' : ''}`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[18px] font-black text-[#16a34a]">
                              {formatCurrency(u.avgNeedBasedGrant)}
                            </span>
                            {isBest && (
                              <span className="text-[11px] font-black uppercase tracking-wide bg-[#16a34a] text-white px-2.5 py-1 rounded-full">
                                Highest Grant
                              </span>
                            )}
                          </div>
                          <div className="text-[12.5px] text-[#666666]">Institutional aid average</div>
                        </td>
                      );
                    })}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Est. Net Price After Aid
                    </td>
                    {selectedUnis.map(u => {
                      const net = Math.max(0, (u.tuition + u.livingCosts) - u.avgNeedBasedGrant);
                      return (
                        <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle bg-[#690B1B]/5">
                          <div className="text-[20px] font-black text-[#690B1B]">
                            {formatCurrency(net)}
                            <span className="text-[13px] font-medium text-[#777777]">/yr</span>
                          </div>
                          <div className="text-[10.5px] text-[#555555] font-medium">
                            Estimated out-of-pocket
                          </div>
                        </td>
                      );
                    })}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>
                </>
              )}

              {/* ─────────────────────────────────────────────
                  SECTION 3: 🎓 KEY SCHOLARSHIPS (AUTHENTIC)
                  ───────────────────────────────────────────── */}
              {(activeCategory === 'all' || activeCategory === 'scholarships') && (
                <>
                  {renderSectionHeader('🎓 Key Scholarships (Authentic)', 'Verified Institutional & Merit Scholarship Programs')}

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] align-top shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Institutional & State Awards
                    </td>
                    {selectedUnis.map(u => {
                      const list = u.scholarships || [];
                      return (
                        <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-top max-w-[340px]">
                          {list.length > 0 ? (
                            <div className="space-y-2.5">
                              {list.map((s, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="p-3 rounded-[12px] bg-[#FAF8F6] border border-[#EAE6E2] space-y-1.5 shadow-2xs"
                                >
                                  <div className="font-bold text-[14.5px] text-[#111111] leading-snug">
                                    {s.title}
                                  </div>
                                  <div>
                                    <span className="inline-block text-[#16a34a] font-black text-[13px] bg-[#16a34a]/10 px-2.5 py-1 rounded-full border border-[#16a34a]/20 max-w-full break-words leading-tight">
                                      {s.amount}
                                    </span>
                                  </div>
                                  {s.description && (
                                    <p className="text-[12.5px] text-[#555555] leading-relaxed">
                                      {s.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[13.5px] text-[#777777] italic">
                              Institutional & federal Pell grants apply
                            </span>
                          )}
                        </td>
                      );
                    })}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>
                </>
              )}

              {/* ─────────────────────────────────────────────
                  SECTION 4: 📊 ADMISSIONS & SELECTIVITY
                  ───────────────────────────────────────────── */}
              {(activeCategory === 'all' || activeCategory === 'admissions') && (
                <>
                  {renderSectionHeader('📊 Admissions Selectivity', 'Acceptance Rates, Test Score Percentiles & High School GPA')}

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Acceptance Rate
                    </td>
                    {selectedUnis.map(u => {
                      const isBest = highlightBest && u.id === highestAcceptanceId;
                      const rate = u.acceptanceRate;
                      let rateBadgeColor = 'bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20';
                      let label = 'Accessible';
                      if (rate < 20) {
                        rateBadgeColor = 'bg-[#e11d48]/10 text-[#e11d48] border-[#e11d48]/20';
                        label = 'Highly Selective';
                      } else if (rate < 50) {
                        rateBadgeColor = 'bg-[#f59e0b]/10 text-[#b45309] border-[#f59e0b]/20';
                        label = 'Selective';
                      }

                      return (
                        <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[18px] font-black text-[#111111]">
                              {formatPercentage(rate)}
                            </span>
                            <span className={`text-[12px] font-extrabold px-2.5 py-1 rounded-full border ${rateBadgeColor}`}>
                              {label}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#EAE6E2] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#690B1B] rounded-full"
                              style={{ width: `${Math.min(100, rate)}%` }}
                            />
                          </div>
                        </td>
                      );
                    })}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Average High School GPA
                    </td>
                    {selectedUnis.map(u => (
                      <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle">
                        <span className="text-[18px] font-black text-[#111111]">
                          {u.avgGPA > 0 ? `${u.avgGPA} / 4.0` : '3.25 / 4.0'}
                        </span>
                        <div className="text-[12.5px] text-[#666666]">Unweighted median GPA</div>
                      </td>
                    ))}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      SAT Score Range
                    </td>
                    {selectedUnis.map(u => {
                      return (
                        <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle">
                          <span className="text-[17px] font-black text-[#111111]">
                            {formatSATRange(u.satScore)}
                          </span>
                          <div className="text-[12.5px] text-[#666666]">25th – 75th percentile composite</div>
                        </td>
                      );
                    })}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>
                </>
              )}

              {/* ─────────────────────────────────────────────
                  SECTION 5: 🗣️ ENGLISH PROFICIENCY & TESTING
                  ───────────────────────────────────────────── */}
              {(activeCategory === 'all' || activeCategory === 'testing') && (
                <>
                  {renderSectionHeader('🗣️ English Proficiency & Tests', 'Cut-offs for TOEFL iBT, IELTS, Duolingo & Waiver Policies')}

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] align-top shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      TOEFL / IELTS Standards
                    </td>
                    {selectedUnis.map(u => (
                      <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-top">
                        <div className="text-[14.5px] font-bold text-[#111111] leading-snug">
                          {u.toeflScore || '79 iBT (or English Proficiency Waiver available)'}
                        </div>
                        <div className="text-[12.5px] text-[#666666] mt-1">
                          IELTS 6.5 / Duolingo 110+ equivalent
                        </div>
                      </td>
                    ))}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>
                </>
              )}

              {/* ─────────────────────────────────────────────
                  SECTION 6: 📋 ADMISSION REQUIREMENTS & ESSAYS
                  ───────────────────────────────────────────── */}
              {(activeCategory === 'all' || activeCategory === 'requirements') && (
                <>
                  {renderSectionHeader('📋 Application Checklists & Essays', 'Portals, Required Transcripts, Recommendations & Writing Prompts')}

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] align-top shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Application Checklist
                    </td>
                    {selectedUnis.map(u => (
                      <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-top text-[13.5px] text-[#333333] leading-relaxed">
                        {u.admissionRequirements || 'Common App or Institutional Application; Official Transcripts; Counselor/Teacher Recommendations; Test-Optional SAT/ACT.'}
                      </td>
                    ))}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] align-top shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Writing & Essays
                    </td>
                    {selectedUnis.map(u => (
                      <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-top text-[13.5px] text-[#333333] leading-relaxed space-y-1.5">
                        <div className="font-bold text-[14px] text-[#111111]">
                          {u.writingReqs || 'Common App Personal Essay (650 words max)'}
                        </div>
                        {u.essayPrompts && (
                          <div className="text-[12.5px] text-[#555555] line-clamp-3">
                            {u.essayPrompts}
                          </div>
                        )}
                      </td>
                    ))}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>
                </>
              )}

              {/* ─────────────────────────────────────────────
                  SECTION 7: 📚 POPULAR MAJORS
                  ───────────────────────────────────────────── */}
              {(activeCategory === 'all' || activeCategory === 'majors') && (
                <>
                  {renderSectionHeader('📚 Popular Academic Majors', 'Top Degree Offerings & Search Match Highlighting')}

                  <tr>
                    <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] bg-[#FAF8F6] sticky left-0 z-10 border-r border-[#EAE6E2] align-top shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                      Major Programs
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Search a major..."
                          value={majorFilter}
                          onChange={e => setMajorFilter(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-[12.5px] rounded-[8px] border border-[#D9D2CB] bg-white focus:outline-none focus:border-[#690B1B]"
                        />
                      </div>
                    </td>
                    {selectedUnis.map(u => {
                      const majors = u.popularMajors || [];
                      const q = majorFilter.toLowerCase().trim();
                      return (
                        <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {majors.slice(0, 12).map((m, mIdx) => {
                              const matches = q && m.toLowerCase().includes(q);
                              return (
                                <span
                                  key={mIdx}
                                  className={`text-[12px] px-2.5 py-1 rounded-full font-semibold transition-all ${
                                    matches
                                      ? 'bg-[#C9A55D] text-black font-extrabold shadow-2xs scale-105'
                                      : 'bg-[#F0EBE6] text-[#444444]'
                                  }`}
                                >
                                  {m}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                    {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
                  </tr>
                </>
              )}

              {/* ─────────────────────────────────────────────
                  SECTION 8: 🚀 EXPLORE & ACTIONS
                  ───────────────────────────────────────────── */}
              <tr className="bg-[#FAF8F6]">
                <td className="p-4 sm:p-5 w-[240px] min-w-[240px] max-w-[240px] font-extrabold text-[15px] text-[#1a1a1a] sticky left-0 z-10 border-r border-[#EAE6E2] shadow-[4px_0_10px_rgba(0,0,0,0.03)] bg-[#FAF8F6]">
                  Actions
                </td>
                {selectedUnis.map(u => (
                  <td key={u.id} className="p-4 sm:p-5 border-r border-[#EAE6E2] align-middle">
                    <div className="space-y-2">
                      <Link
                        href={`/dashboard/calculator`}
                        className="w-full py-2 px-3 rounded-[10px] bg-[#690B1B] hover:bg-[#530816] text-white text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Calculator size={13} />
                        <span>Simulate Net Price</span>
                      </Link>
                      <a
                        href={u.website?.startsWith('http') ? u.website : `https://${u.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-[10px] bg-white border border-[#E0DBD5] hover:border-[#690B1B]/30 hover:text-[#690B1B] text-[#444444] text-[13px] font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Official Website</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </td>
                ))}
                {selectedUnis.length < 4 && <td className="bg-[#FAF8F6] border-r border-[#EAE6E2]" />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE COMPARISON VIEW (VISIBLE ON < MD, ZERO HORIZONTAL SCROLL)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden space-y-4">
        {/* Mode switcher & college selector when 3+ universities */}
        {selectedUnis.length > 2 && (
          <div className="bg-[#FAF8F6] p-3 rounded-[18px] border border-[#E7E2DE] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13.5px] font-bold text-[#111111]">Mobile View:</span>
              <div className="flex items-center bg-white border border-[#E7E2DE] rounded-full p-0.5 text-[12.5px] font-bold">
                <button
                  type="button"
                  onClick={() => setMobileCompareMode('h2h')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    mobileCompareMode === 'h2h'
                      ? 'bg-[#690B1B] text-white shadow-xs'
                      : 'text-[#666666]'
                  }`}
                >
                  ⚡ Head-to-Head (2)
                </button>
                <button
                  type="button"
                  onClick={() => setMobileCompareMode('stacked')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    mobileCompareMode === 'stacked'
                      ? 'bg-[#690B1B] text-white shadow-xs'
                      : 'text-[#666666]'
                  }`}
                >
                  📋 Stacked ({selectedUnis.length})
                </button>
              </div>
            </div>

            {mobileCompareMode === 'h2h' && (
              <div className="grid grid-cols-2 gap-2 text-[11.5px] pt-1 border-t border-[#EAE6E2]">
                <div>
                  <label className="block text-[12px] font-bold text-[#777777] mb-0.5">College A:</label>
                  <select
                    value={mobileH2HIndices[0]}
                    onChange={(e) => {
                      const newIdx = Number(e.target.value);
                      setMobileH2HIndices([newIdx, newIdx === mobileH2HIndices[1] ? (newIdx + 1) % selectedUnis.length : mobileH2HIndices[1]]);
                    }}
                    className="w-full bg-white border border-[#E7E2DE] rounded-[10px] px-2.5 py-2 font-bold text-[#111111] text-[13px] truncate"
                  >
                    {selectedUnis.map((uni, idx) => (
                      <option key={uni.id} value={idx}>
                        {uni.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#777777] mb-0.5">College B:</label>
                  <select
                    value={mobileH2HIndices[1]}
                    onChange={(e) => {
                      const newIdx = Number(e.target.value);
                      setMobileH2HIndices([newIdx === mobileH2HIndices[0] ? (newIdx + 1) % selectedUnis.length : mobileH2HIndices[0], newIdx]);
                    }}
                    className="w-full bg-white border border-[#E7E2DE] rounded-[10px] px-2.5 py-2 font-bold text-[#111111] text-[13px] truncate"
                  >
                    {selectedUnis.map((uni, idx) => (
                      <option key={uni.id} value={idx}>
                        {uni.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── SINGLE COLLEGE VIEW ─── */}
        {selectedUnis.length === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-[22px] border border-[#E7E2DE] p-4 shadow-xs space-y-3.5">
              <div className="flex items-start justify-between gap-2 border-b border-[#F0EBE6] pb-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-extrabold uppercase text-[#C9A55D]">
                    📍 {selectedUnis[0].state} • Rank #{selectedUnis[0].qsRanking}
                  </div>
                  <h4 className="text-[17px] font-black text-[#111111]">
                    {selectedUnis[0].name}
                  </h4>
                </div>
                <button
                  onClick={() => handleRemoveUniversity(selectedUnis[0].id)}
                  className="p-1.5 rounded-full hover:bg-red-50 text-red-500"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div className="p-3 rounded-[14px] bg-[#FAF8F6] border border-[#F0EBE6]">
                  <div className="text-[#777777] text-[11.5px] font-bold uppercase">Sticker Tuition</div>
                  <div className="text-[18px] font-black text-[#690B1B] mt-0.5">{formatCurrency(selectedUnis[0].tuition)}/yr</div>
                </div>
                <div className="p-3 rounded-[14px] bg-[#FAF8F6] border border-[#F0EBE6]">
                  <div className="text-[#777777] text-[11.5px] font-bold uppercase">Housing & Living</div>
                  <div className="text-[18px] font-black text-[#111111] mt-0.5">{formatCurrency(selectedUnis[0].livingCosts)}/yr</div>
                </div>
                <div className="p-3 rounded-[14px] bg-[#FAF8F6] border border-[#F0EBE6]">
                  <div className="text-[#777777] text-[11.5px] font-bold uppercase">Acceptance Rate</div>
                  <div className="text-[18px] font-black text-[#111111] mt-0.5">{selectedUnis[0].acceptanceRate}%</div>
                </div>
                <div className="p-3 rounded-[14px] bg-[#FAF8F6] border border-[#F0EBE6]">
                  <div className="text-[#777777] text-[11.5px] font-bold uppercase">Avg Need Aid</div>
                  <div className="text-[18px] font-black text-green-700 mt-0.5">{formatCurrency(selectedUnis[0].avgNeedBasedGrant)}/yr</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0EBE6] flex gap-2">
                <Link
                  href="/dashboard/calculator"
                  className="flex-1 py-2.5 rounded-[12px] bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#530816] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Calculator size={14} />
                  <span>Simulate Net Price</span>
                </Link>
                {selectedUnis[0].website && (
                  <a
                    href={selectedUnis[0].website.startsWith('http') ? selectedUnis[0].website : `https://${selectedUnis[0].website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-[12px] bg-white border border-[#E7E2DE] text-[#555555] hover:text-[#690B1B] transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Add College Slot */}
            <button
              onClick={() => {
                setModalSlotIndex(null);
                setSearchModalOpen(true);
              }}
              className="w-full py-4 rounded-[20px] border-2 border-dashed border-[#D9D2CB] hover:border-[#690B1B] bg-white text-[#777777] hover:text-[#690B1B] flex flex-col items-center justify-center gap-2 p-4 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#FAF8F6] border border-[#E7E2DE] flex items-center justify-center text-[#690B1B]">
                <Plus size={18} />
              </div>
              <span className="text-[15px] font-black">Add Second College to Compare (1/4)</span>
              <span className="text-[12.5px] text-[#777777]">See head-to-head metrics side-by-side with zero horizontal scroll</span>
            </button>
          </div>
        )}

        {/* ─── 2-COLLEGE HEAD-TO-HEAD VIEW (50% / 50% NO HORIZONTAL SCROLL) ─── */}
        {selectedUnis.length >= 2 && (selectedUnis.length === 2 || mobileCompareMode === 'h2h') && (() => {
          const uA = selectedUnis[mobileH2HIndices[0]] || selectedUnis[0];
          const uB = selectedUnis[mobileH2HIndices[1]] || selectedUnis[1];
          const lowerTuition = uA.tuition <= uB.tuition ? 'A' : 'B';

          return (
            <div className="bg-white rounded-[22px] border border-[#E7E2DE] p-3.5 sm:p-4 shadow-xs space-y-3.5">
              {/* College Headers 50/50 */}
              <div className="grid grid-cols-2 gap-2 border-b border-[#F0EBE6] pb-3">
                <div className="space-y-1 pr-1 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C9A55D] truncate">
                      📍 {uA.state}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setModalSlotIndex(mobileH2HIndices[0]);
                          setSearchModalOpen(true);
                        }}
                        className="text-[12px] font-bold text-[#690B1B] hover:underline"
                        title="Swap"
                      >
                        <ArrowLeftRight size={11} />
                      </button>
                      <button
                        onClick={() => handleRemoveUniversity(uA.id)}
                        className="text-red-500 hover:text-red-700 p-0.5"
                        title="Remove"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-[15.5px] font-black text-[#111111] leading-tight line-clamp-2 min-h-[38px]">
                    {uA.name}
                  </h4>
                  <div className="text-[12.5px] font-extrabold text-[#690B1B]">
                    Rank: #{uA.qsRanking}
                  </div>
                </div>

                <div className="space-y-1 pl-1 border-l border-[#F0EBE6] relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C9A55D] truncate">
                      📍 {uB.state}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setModalSlotIndex(mobileH2HIndices[1]);
                          setSearchModalOpen(true);
                        }}
                        className="text-[12px] font-bold text-[#690B1B] hover:underline"
                        title="Swap"
                      >
                        <ArrowLeftRight size={11} />
                      </button>
                      <button
                        onClick={() => handleRemoveUniversity(uB.id)}
                        className="text-red-500 hover:text-red-700 p-0.5"
                        title="Remove"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-[15.5px] font-black text-[#111111] leading-tight line-clamp-2 min-h-[38px]">
                    {uB.name}
                  </h4>
                  <div className="text-[12.5px] font-extrabold text-[#690B1B]">
                    Rank: #{uB.qsRanking}
                  </div>
                </div>
              </div>

              {/* SECTION: COSTS & FINANCIAL AID */}
              {(activeCategory === 'all' || activeCategory === 'financials') && (
                <div className="space-y-2">
                  <div className="px-2.5 py-1 rounded-[8px] bg-[#690B1B]/5 text-[#690B1B] text-[13px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign size={12} />
                    <span>Costs & Financial Aid</span>
                  </div>

                  <div className="space-y-1.5 text-[12px]">
                    {/* Published Tuition */}
                    <div className="bg-[#FAF8F6] p-2.5 rounded-[12px]">
                      <div className="text-[12.5px] font-bold text-[#666666] mb-1">Published Tuition & Fees</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`font-black ${highlightBest && lowerTuition === 'A' ? 'text-green-700 font-extrabold' : 'text-[#111111]'}`}>
                          {formatCurrency(uA.tuition)}/yr
                          {highlightBest && lowerTuition === 'A' && <span className="block text-[11px] text-green-700 font-bold">✓ Lower Tuition</span>}
                        </div>
                        <div className={`border-l border-[#EAE6E2] pl-2 font-black ${highlightBest && lowerTuition === 'B' ? 'text-green-700 font-extrabold' : 'text-[#111111]'}`}>
                          {formatCurrency(uB.tuition)}/yr
                          {highlightBest && lowerTuition === 'B' && <span className="block text-[11px] text-green-700 font-bold">✓ Lower Tuition</span>}
                        </div>
                      </div>
                    </div>

                    {/* Housing & Food */}
                    <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                      <div className="text-[12.5px] font-bold text-[#666666] mb-0.5">Housing & Living Costs</div>
                      <div className="grid grid-cols-2 gap-2 font-black text-[15px] text-[#111111]">
                        <div>{formatCurrency(uA.livingCosts)}/yr</div>
                        <div className="border-l border-[#EAE6E2] pl-2">{formatCurrency(uB.livingCosts)}/yr</div>
                      </div>
                    </div>

                    {/* Total COA */}
                    <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                      <div className="text-[12.5px] font-bold text-[#666666] mb-0.5">Total Estimated COA</div>
                      <div className="grid grid-cols-2 gap-2 font-black text-[15px] text-[#111111]">
                        <div>{formatCurrency(uA.tuition + uA.livingCosts)}/yr</div>
                        <div className="border-l border-[#EAE6E2] pl-2">{formatCurrency(uB.tuition + uB.livingCosts)}/yr</div>
                      </div>
                    </div>

                    {/* Avg Need Aid */}
                    <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                      <div className="text-[12.5px] font-bold text-[#666666] mb-0.5">Avg Need-Based Aid</div>
                      <div className="grid grid-cols-2 gap-2 font-black text-[15px] text-green-700">
                        <div>{formatCurrency(uA.avgNeedBasedGrant)}/yr</div>
                        <div className="border-l border-[#EAE6E2] pl-2">{formatCurrency(uB.avgNeedBasedGrant)}/yr</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: SCHOLARSHIPS */}
              {(activeCategory === 'all' || activeCategory === 'scholarships') && (
                <div className="space-y-2 pt-2 border-t border-[#F0EBE6]">
                  <div className="px-2.5 py-1 rounded-[8px] bg-green-50 text-green-800 text-[13px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={12} />
                    <span>Key Scholarships</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="space-y-1.5">
                      {(uA.scholarships || []).slice(0, 2).map((sch, i) => (
                        <div key={i} className="p-2 rounded-[10px] bg-[#FAF8F6] border border-[#EAE6E2]">
                          <div className="font-bold text-[#111111] leading-tight line-clamp-1">{sch.title}</div>
                          <div className="text-[12px] font-black text-[#16a34a]">{sch.amount}</div>
                        </div>
                      ))}
                      {(!uA.scholarships || uA.scholarships.length === 0) && (
                        <div className="text-[10.5px] text-[#888888] italic">Pell & institutional aid apply</div>
                      )}
                    </div>

                    <div className="space-y-1.5 pl-1 border-l border-[#F0EBE6]">
                      {(uB.scholarships || []).slice(0, 2).map((sch, i) => (
                        <div key={i} className="p-2 rounded-[10px] bg-[#FAF8F6] border border-[#EAE6E2]">
                          <div className="font-bold text-[#111111] leading-tight line-clamp-1">{sch.title}</div>
                          <div className="text-[12px] font-black text-[#16a34a]">{sch.amount}</div>
                        </div>
                      ))}
                      {(!uB.scholarships || uB.scholarships.length === 0) && (
                        <div className="text-[10.5px] text-[#888888] italic">Pell & institutional aid apply</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: ADMISSIONS & SELECTIVITY */}
              {(activeCategory === 'all' || activeCategory === 'admissions') && (
                <div className="space-y-2 pt-2 border-t border-[#F0EBE6]">
                  <div className="px-2.5 py-1 rounded-[8px] bg-[#FAF8F6] text-[#666666] text-[13px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap size={12} />
                    <span>Admissions Profile</span>
                  </div>

                  <div className="space-y-1.5 text-[12px]">
                    <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                      <div className="text-[12.5px] font-bold text-[#666666] mb-0.5">Acceptance Rate</div>
                      <div className="grid grid-cols-2 gap-2 font-black text-[15px] text-[#111111]">
                        <div>{formatPercentage(uA.acceptanceRate)}</div>
                        <div className="border-l border-[#EAE6E2] pl-2">{formatPercentage(uB.acceptanceRate)}</div>
                      </div>
                    </div>

                    <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                      <div className="text-[12.5px] font-bold text-[#666666] mb-0.5">Average GPA</div>
                      <div className="grid grid-cols-2 gap-2 font-black text-[15px] text-[#111111]">
                        <div>{uA.avgGPA ? `${uA.avgGPA.toFixed(2)} / 4.0` : '3.25+'}</div>
                        <div className="border-l border-[#EAE6E2] pl-2">{uB.avgGPA ? `${uB.avgGPA.toFixed(2)} / 4.0` : '3.25+'}</div>
                      </div>
                    </div>

                    <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                      <div className="text-[12.5px] font-bold text-[#666666] mb-0.5">SAT Score Range</div>
                      <div className="grid grid-cols-2 gap-2 font-black text-[15px] text-[#111111] text-[11px]">
                        <div>{formatSATRange(uA.satScore)}</div>
                        <div className="border-l border-[#EAE6E2] pl-2">{formatSATRange(uB.satScore)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: ENGLISH & REQUIREMENTS */}
              {(activeCategory === 'all' || activeCategory === 'testing' || activeCategory === 'requirements') && (
                <div className="space-y-2 pt-2 border-t border-[#F0EBE6]">
                  <div className="px-2.5 py-1 rounded-[8px] bg-[#FAF8F6] text-[#666666] text-[13px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 size={12} />
                    <span>English & Requirements</span>
                  </div>

                  <div className="space-y-1.5 text-[12px]">
                    <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                      <div className="text-[12.5px] font-bold text-[#666666] mb-0.5">English Proficiency</div>
                      <div className="grid grid-cols-2 gap-2 font-black text-[15px] text-[#111111] text-[10.5px]">
                        <div>{uA.toeflScore || 'TOEFL 79 / IELTS 6.5'}</div>
                        <div className="border-l border-[#EAE6E2] pl-2">{uB.toeflScore || 'TOEFL 79 / IELTS 6.5'}</div>
                      </div>
                    </div>

                    <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                      <div className="text-[12.5px] font-bold text-[#666666] mb-0.5">Admission Reqs</div>
                      <div className="grid grid-cols-2 gap-2 font-black text-[15px] text-[#111111] text-[10.5px]">
                        <div className="line-clamp-2">{uA.admissionRequirements || 'Common App or Portal'}</div>
                        <div className="border-l border-[#EAE6E2] pl-2 line-clamp-2">{uB.admissionRequirements || 'Common App or Portal'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIONS FOOTER */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EBE6]">
                <Link
                  href="/dashboard/calculator"
                  className="py-2 px-2 rounded-[12px] bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#530816] transition-colors flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Calculator size={11} />
                  <span>Net Price</span>
                </Link>
                <Link
                  href="/dashboard/calculator"
                  className="py-2 px-2 rounded-[12px] bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#530816] transition-colors flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Calculator size={11} />
                  <span>Net Price</span>
                </Link>
              </div>
            </div>
          );
        })()}

        {/* ─── STACKED CARDS VIEW (FOR 3+ COLLEGES) ─── */}
        {selectedUnis.length > 2 && mobileCompareMode === 'stacked' && (
          <div className="space-y-3">
            {selectedUnis.map((uni, idx) => (
              <div key={uni.id} className="bg-white rounded-[22px] border border-[#E7E2DE] p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#F0EBE6] pb-2.5">
                  <div className="space-y-0.5">
                    <div className="text-[10.5px] font-extrabold uppercase text-[#C9A55D]">
                      #{idx + 1} • {uni.state} • Rank #{uni.qsRanking}
                    </div>
                    <h4 className="text-[17px] font-black text-[#111111] leading-snug">
                      {uni.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleRemoveUniversity(uni.id)}
                    className="p-1 rounded-full text-red-500 hover:bg-red-50"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="p-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#F0EBE6]">
                    <div className="text-[#777777] text-[11.5px] font-bold uppercase">Sticker Tuition</div>
                    <div className="text-[17px] font-black text-[#690B1B] mt-0.5">{formatCurrency(uni.tuition)}/yr</div>
                  </div>
                  <div className="p-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#F0EBE6]">
                    <div className="text-[#777777] text-[11.5px] font-bold uppercase">Acceptance</div>
                    <div className="text-[17px] font-black text-[#111111] mt-0.5">{formatPercentage(uni.acceptanceRate)}</div>
                  </div>
                  <div className="p-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#F0EBE6]">
                    <div className="text-[#777777] text-[11.5px] font-bold uppercase">Avg Need Aid</div>
                    <div className="text-[16px] font-black text-green-700 mt-0.5">{formatCurrency(uni.avgNeedBasedGrant)}/yr</div>
                  </div>
                  <div className="p-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#F0EBE6]">
                    <div className="text-[#777777] text-[11.5px] font-bold uppercase">SAT Range</div>
                    <div className="text-[14px] font-bold text-[#111111] mt-0.5">{formatSATRange(uni.satScore)}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0EBE6] flex gap-2">
                  <Link
                    href="/dashboard/calculator"
                    className="flex-1 py-2 rounded-[10px] bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#530816] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Calculator size={13} />
                    <span>Net Price Calc</span>
                  </Link>
                  {uni.website && (
                    <a
                      href={uni.website.startsWith('http') ? uni.website : `https://${uni.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-[10px] bg-white border border-[#E7E2DE] text-[#555555] hover:text-[#690B1B] transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add College button if < 4 */}
        {selectedUnis.length < 4 && selectedUnis.length > 0 && (
          <button
            onClick={() => {
              setModalSlotIndex(null);
              setSearchModalOpen(true);
            }}
            className="w-full py-3 rounded-[16px] border border-dashed border-[#D9D2CB] hover:border-[#690B1B] bg-white text-[#690B1B] font-bold text-[12.5px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Plus size={15} />
            <span>Add Another College ({selectedUnis.length}/4)</span>
          </button>
        )}
      </div>

        </>
      )}
      {/* ═══════════════════════════════════════════════════════════════
          SEARCH & ADD / SWAP UNIVERSITY MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[85vh] flex flex-col border border-[#E7E2DE] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#F0EBE6] flex items-center justify-between bg-[#FAF8F6]">
              <div>
                <h3 className="text-[18px] font-black text-[#111111]">
                  {modalSlotIndex !== null ? 'Swap University' : 'Add University to Compare'}
                </h3>
                <p className="text-[12px] text-[#777777]">
                  Select from over 2,328 institutions across all 50 states
                </p>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-2 rounded-full text-[#777777] hover:bg-[#F0EBE6] hover:text-[#111111] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Search Bar & State Filter */}
            <div className="p-4 sm:p-5 border-b border-[#F0EBE6] bg-white flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
                <input
                  type="text"
                  placeholder="Search by name or state (e.g. Stanford, New Mexico, MIT)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#E0DBD5] text-[13px] focus:outline-none focus:border-[#690B1B] text-[#111111]"
                  autoFocus
                />
              </div>

              <select
                value={filterState}
                onChange={e => setFilterState(e.target.value)}
                className="px-3 py-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#E0DBD5] text-[12.5px] font-medium text-[#444444] focus:outline-none focus:border-[#690B1B]"
              >
                <option value="all">All States ({stateList.length})</option>
                {stateList.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Results List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-2 flex-1 divide-y divide-[#F0EBE6]">
              {searchResults.length === 0 ? (
                <div className="text-center py-10 text-[#888888]">
                  <Building2 size={36} className="mx-auto text-[#CCCCCC] mb-2" />
                  <p className="text-[14px] font-bold">No universities found</p>
                  <p className="text-[12px]">Try adjusting your search terms or state filter.</p>
                </div>
              ) : (
                searchResults.map(uni => {
                  const isSelected = selectedIds.includes(uni.id);
                  return (
                    <div
                      key={uni.id}
                      className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 hover:bg-[#FAF8F6] p-2 rounded-[12px] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-[#111111] truncate">
                          {uni.name}
                        </div>
                        <div className="text-[13px] text-[#666666] flex items-center gap-2 mt-0.5">
                          <span>📍 {uni.state}</span>
                          <span className="text-[#C9A55D]">•</span>
                          <span>Tuition: <strong className="text-[#111111]">{formatCurrency(uni.tuition)}</strong></span>
                          <span className="text-[#C9A55D]">•</span>
                          <span>Acceptance: <strong>{formatPercentage(uni.acceptanceRate)}</strong></span>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="px-3 py-1.5 rounded-full text-[12.5px] font-bold bg-[#EAE6E2] text-[#888888] shrink-0">
                          Added
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddUniversity(uni.id)}
                          className="px-3.5 py-1.5 rounded-full text-[13px] font-bold bg-[#690B1B] hover:bg-[#530816] text-white transition-all shrink-0 cursor-pointer shadow-2xs"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F6F4] flex items-center justify-center p-8 text-[#888888]">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={20} className="animate-spin text-[#690B1B]" />
          <span className="font-bold text-[14px]">Loading University Comparison Matrix...</span>
        </div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
