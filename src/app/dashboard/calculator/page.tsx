'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Calculator,
  Search,
  Sparkles,
  Sliders,
  Layers,
  ArrowRight,
  TrendingDown,
  Building2,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Bookmark,
  Check,
  X,
  MapPin,
  Award,
  BookOpen,
  Filter,
  RefreshCw,
  HelpCircle,
  Clock,
  ShieldCheck,
  FileText,
  DollarSign,
  Percent,
  Star,
  Trash2,
  ArrowLeft,
  Info
} from 'lucide-react';

import { University, formatCurrency, formatPercentage, getStickerPrice } from '@/lib/npc/data-service';
import { calculateNetPrice, CalculationResult, getMeritLevelLabel, getMeritLevelDescription } from '@/lib/npc/calculator';
import { analyzeScholarships, ScholarshipAnalysis } from '@/lib/npc/scholarship-matcher';



/* ─── Income Bracket Definitions ─── */
const INCOME_BRACKETS = [
  { min: 0, max: 30000, label: 'Under $30K', aidLevel: 'Maximum Need-Based Aid' },
  { min: 30000, max: 48000, label: '$30K – $48K', aidLevel: 'High Need-Based Aid' },
  { min: 48000, max: 75000, label: '$48K – $75K', aidLevel: 'Substantial Need-Based Aid' },
  { min: 75000, max: 110000, label: '$75K – $110K', aidLevel: 'Moderate Need Aid' },
  { min: 110000, max: 150000, label: '$110K – $150K', aidLevel: 'Partial Need Aid' },
  { min: 150000, max: 500000, label: 'Over $150K', aidLevel: 'Merit-Focused Aid' },
];

function getBracketLabel(income: number): string {
  const bracket = INCOME_BRACKETS.find((b) => income >= b.min && income < b.max);
  return bracket?.label || 'Over $150K';
}

function getBracketAidInfo(income: number): string {
  const bracket = INCOME_BRACKETS.find((b) => income >= b.min && income < b.max);
  return bracket?.aidLevel || 'Merit-Focused Aid';
}

function NetPriceCalculatorContent() {
  const searchParams = useSearchParams();

    /* ────── Student Profile Inputs ────── */
  const [familyIncome, setFamilyIncome] = useState<number>(() => {
    return Number(searchParams.get('income')) || 65000;
  });
  const [studentGpa, setStudentGpa] = useState<number>(() => {
    return Number(searchParams.get('gpa')) || 3.75;
  });
  const [studentSat, setStudentSat] = useState<number>(() => {
    return Number(searchParams.get('sat')) || 1350;
  });
  const [selectedState, setSelectedState] = useState<string>(() => {
    return searchParams.get('state') || '';
  });
  const [selectedMajor, setSelectedMajor] = useState<string>(() => {
    return searchParams.get('major') || '';
  });
  const [residency, setResidency] = useState<'in-state' | 'out-of-state' | 'international'>(() => {
    return (searchParams.get('residency') as any) || 'in-state';
  });
  const [housing, setHousing] = useState<'on-campus' | 'off-campus' | 'with-family'>(() => {
    return (searchParams.get('housing') as any) || 'on-campus';
  });
  const [firstGen, setFirstGen] = useState<boolean>(() => {
    return searchParams.get('firstGen') === '1' || searchParams.get('firstGen') === 'true';
  });
  const [multipleInCollege, setMultipleInCollege] = useState<boolean>(() => {
    return searchParams.get('multipleInCollege') === '1' || searchParams.get('multipleInCollege') === 'true';
  });

  /* ─── Data & Meta States ─── */
  const [universities, setUniversities] = useState<University[]>([]);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [majorsList, setMajorsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ─── UI & View States ─── */
  const [activeTab, setActiveTab] = useState<'catalog' | 'compare'>('catalog');
  const totalUniCount = universities.length > 0 ? universities.length : 2328;
  const totalUniCountStr = totalUniCount.toLocaleString();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tuitionFilter, setTuitionFilter] = useState<number | null>(null);
  const [meritFilter, setMeritFilter] = useState<'all' | 'high' | 'moderate'>('all');
  const [sortBy, setSortBy] = useState<string>('netPrice-asc');
  const [visibleLimit, setVisibleLimit] = useState<number>(24);

  /* ─── Compare Selection State ─── */
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  /* ─── Selected University for In-Page Breakdown ─── */
  const [selectedUniDetail, setSelectedUniDetail] = useState<University | null>(null);
  const [mobileH2HIndices, setMobileH2HIndices] = useState<[number, number]>([0, 1]);
  const [mobileCompareMode, setMobileCompareMode] = useState<'h2h' | 'stacked'>('h2h');
  const [detailSimIncome, setDetailSimIncome] = useState<number>(65000);
  const [detailSimGpa, setDetailSimGpa] = useState<number>(3.75);
  const [detailSimSat, setDetailSimSat] = useState<number>(1350);
  const [detailSimResidency, setDetailSimResidency] = useState<'in-state' | 'out-of-state' | 'international'>('in-state');
  const [detailSimHousing, setDetailSimHousing] = useState<'on-campus' | 'off-campus' | 'with-family'>('on-campus');
  const [detailSimFirstGen, setDetailSimFirstGen] = useState<boolean>(false);
  const [detailSimMultipleInCollege, setDetailSimMultipleInCollege] = useState<boolean>(false);

  /* ─── Saved Colleges in LocalStorage ─── */
  const [savedUniIds, setSavedUniIds] = useState<Set<string>>(new Set());

  /* ─── Toast Notification State ─── */
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  /* ─── Fetch Universities and Filter Metadata from API ─── */
  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const res = await fetch('/api/npc/universities');
        const data = await res.json();
        if (data.success && Array.isArray(data.universities)) {
          setUniversities(data.universities);
          if (Array.isArray(data.states)) setStatesList(data.states);
          if (Array.isArray(data.majors)) setMajorsList(data.majors);
        } else {
          setError('Could not load universities catalog.');
        }
      } catch (err: any) {
        console.error('Failed to load NPC universities:', err);
        setError('Failed to connect to university catalog.');
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  /* ─── Sync Saved Colleges from LocalStorage ─── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('unified_college_list_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        const ids = new Set<string>();
        ['dream', 'target', 'safety'].forEach((cat) => {
          if (Array.isArray(parsed[cat])) {
            parsed[cat].forEach((u: any) => {
              if (u.id) ids.add(u.id);
            });
          }
        });
        setSavedUniIds(ids);
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  /* ─── Format Money (USD only) ─── */
  const formatMoney = useCallback(
    (amountInUSD: number) => `$${Math.round(amountInUSD).toLocaleString()}`,
    []
  );

  /* ─── Save University to College List ─── */
  const handleSaveToCollegeList = (uni: University) => {
    try {
      const stored = localStorage.getItem('unified_college_list_data');
      let targetObj: { dream: any[]; target: any[]; safety: any[] } = {
        dream: [],
        target: [],
        safety: []
      };

      if (stored) {
        try {
          targetObj = JSON.parse(stored);
        } catch {
          // fallback
        }
      }

      let categoryKey: 'dream' | 'target' | 'safety' = 'target';
      if (uni.acceptanceRate < 25) {
        categoryKey = 'dream';
      } else if (uni.acceptanceRate > 55) {
        categoryKey = 'safety';
      }

      const newItem = {
        id: uni.id,
        name: uni.name,
        country: 'USA',
        state: uni.state,
        ranking: uni.qsRanking !== 'Unranked' ? `#${uni.qsRanking}` : 'Unranked',
        tuition: `$${uni.tuition.toLocaleString()}/yr`,
        acceptanceRate: `${uni.acceptanceRate}%`,
        status: 'Researching',
        savedAt: new Date().toISOString()
      };

      const existing = targetObj[categoryKey] || [];
      if (!existing.some((s: any) => s.id === newItem.id)) {
        targetObj[categoryKey] = [newItem, ...existing];
        localStorage.setItem('unified_college_list_data', JSON.stringify(targetObj));
        setSavedUniIds((prev) => new Set(prev).add(uni.id));
      }

      showToast(`Added ${uni.name} to your College List!`);
    } catch (e) {
      console.warn('Failed to save to college list:', e);
    }
  };

  /* ─── Open In-Page University Breakdown ─── */
  const openUniDetail = (uni: University) => {
    setSelectedUniDetail(uni);
    setDetailSimIncome(familyIncome);
    setDetailSimGpa(studentGpa);
    setDetailSimSat(studentSat);
    setDetailSimResidency(residency);
    setDetailSimHousing(housing);
    setDetailSimFirstGen(firstGen);
    setDetailSimMultipleInCollege(multipleInCollege);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ─── Detail View Live Simulator Calculation ─── */
  const uniDetailCalc = useMemo(() => {
    if (!selectedUniDetail) return null;
    const calc = calculateNetPrice(selectedUniDetail, detailSimIncome, detailSimGpa, detailSimSat, {
      residency: detailSimResidency,
      housing: detailSimHousing,
      firstGen: detailSimFirstGen,
      multipleInCollege: detailSimMultipleInCollege,
    });
    const sticker = calc.stickerPrice;
    const savings = Math.max(0, sticker - calc.netPrice);
    const savingsPercent = sticker > 0 ? (savings / sticker) * 100 : 0;
    const scholarships = analyzeScholarships(selectedUniDetail, detailSimIncome, detailSimGpa, detailSimSat);
    return { calc, sticker, savings, savingsPercent, scholarships };
  }, [selectedUniDetail, detailSimIncome, detailSimGpa, detailSimSat, detailSimResidency, detailSimHousing, detailSimFirstGen, detailSimMultipleInCollege]);

  /* ─── Compute Real-Time Net Price for All Universities ─── */
  const calculatedCatalog = useMemo(() => {
    return universities.map((uni) => {
      const calc = calculateNetPrice(uni, familyIncome, studentGpa, studentSat, {
        residency,
        housing,
        firstGen,
        multipleInCollege,
      });
      const sticker = calc.stickerPrice;
      const savings = Math.max(0, sticker - calc.netPrice);
      const savingsPercent = sticker > 0 ? (savings / sticker) * 100 : 0;
      return {
        university: uni,
        calc,
        sticker,
        savings,
        savingsPercent,
      };
    });
  }, [universities, familyIncome, studentGpa, studentSat, residency, housing, firstGen, multipleInCollege]);

  /* ─── Filter & Sort Calculations ─── */
  const filteredUniversities = useMemo(() => {
    let result = calculatedCatalog.filter(({ university, calc }) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = university.name.toLowerCase().includes(q);
        const matchesState = university.state.toLowerCase().includes(q);
        if (!matchesName && !matchesState) return false;
      }

      // 2. State Filter
      if (selectedState && university.state !== selectedState) {
        return false;
      }

      // 3. Major Filter
      if (selectedMajor && Array.isArray(university.popularMajors)) {
        const hasMajor = university.popularMajors.some((m) =>
          m.toLowerCase().includes(selectedMajor.toLowerCase())
        );
        if (!hasMajor) return false;
      }

      // 4. Tuition/Net Price Filter
      if (tuitionFilter !== null) {
        if (tuitionFilter === 15000 && calc.netPrice > 15000) return false;
        if (tuitionFilter === 30000 && (calc.netPrice < 15000 || calc.netPrice > 30000)) return false;
        if (tuitionFilter === 50000 && (calc.netPrice < 30000 || calc.netPrice > 50000)) return false;
        if (tuitionFilter === 99999 && calc.netPrice < 50000) return false;
      }

      // 5. Merit Filter
      if (meritFilter === 'high' && calc.meritLevel !== 'high') return false;
      if (meritFilter === 'moderate' && calc.meritLevel !== 'high' && calc.meritLevel !== 'moderate') {
        return false;
      }

      return true;
    });

    // Sort Results
    result.sort((a, b) => {
      switch (sortBy) {
        case 'netPrice-asc':
          return a.calc.netPrice - b.calc.netPrice;
        case 'netPrice-desc':
          return b.calc.netPrice - a.calc.netPrice;
        case 'tuition-asc':
          return a.university.tuition - b.university.tuition;
        case 'tuition-desc':
          return b.university.tuition - a.university.tuition;
        case 'acceptance-desc':
          return b.university.acceptanceRate - a.university.acceptanceRate;
        case 'savings-desc':
          return b.savings - a.savings;
        case 'name-asc':
          return a.university.name.localeCompare(b.university.name);
        default:
          return a.calc.netPrice - b.calc.netPrice;
      }
    });

    return result;
  }, [calculatedCatalog, searchQuery, selectedState, selectedMajor, tuitionFilter, meritFilter, sortBy]);

  /* ─── Toggle Compare Selection ─── */
  const toggleCompare = (uni: University) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(uni.id)) {
        return prev.filter((id) => id !== uni.id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 universities at a time.');
          return prev;
        }
        showToast(`Added ${uni.name} to comparison.`);
        return [...prev, uni.id];
      }
    });
  };

  /* ─── Universities Selected for Comparison ─── */
  const compareUniversities = useMemo(() => {
    if (selectedForCompare.length === 0) return [];
    const idSet = new Set(selectedForCompare);
    return calculatedCatalog.filter(({ university }) => idSet.has(university.id));
  }, [calculatedCatalog, selectedForCompare]);

  // Horizontal Scroll & Drag Navigation for Calculator Comparison Table
  const calcTableContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeftCalc, setCanScrollLeftCalc] = useState(false);
  const [canScrollRightCalc, setCanScrollRightCalc] = useState(false);
  const [isDraggingCalc, setIsDraggingCalc] = useState(false);
  const startXCalcRef = useRef(0);
  const scrollLeftCalcRef = useRef(0);

  const checkCalcScrollState = useCallback(() => {
    const el = calcTableContainerRef.current;
    if (el) {
      setCanScrollLeftCalc(el.scrollLeft > 15);
      setCanScrollRightCalc(el.scrollLeft < el.scrollWidth - el.clientWidth - 15);
    }
  }, []);

  useEffect(() => {
    const el = calcTableContainerRef.current;
    if (!el) return;
    checkCalcScrollState();

    const handleScroll = () => checkCalcScrollState();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [checkCalcScrollState, compareUniversities]);

  const scrollCalcColumns = (direction: 'left' | 'right') => {
    const el = calcTableContainerRef.current;
    if (el) {
      const scrollAmount = Math.max(280, Math.floor(el.clientWidth * 0.65));
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCalcMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, a, select, input')) return;
    const el = calcTableContainerRef.current;
    if (!el) return;
    setIsDraggingCalc(true);
    startXCalcRef.current = e.pageX - el.offsetLeft;
    scrollLeftCalcRef.current = el.scrollLeft;
  };

  const handleCalcMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCalc) return;
    const el = calcTableContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXCalcRef.current) * 1.5;
    el.scrollLeft = scrollLeftCalcRef.current - walk;
  };

  const handleCalcMouseUpOrLeave = () => {
    setIsDraggingCalc(false);
  };

  /* ─── Reset All Search & Filters ─── */
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedMajor('');
    setTuitionFilter(null);
    setMeritFilter('all');
    setSortBy('netPrice-asc');
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedState || selectedMajor || tuitionFilter !== null || meritFilter !== 'all' || sortBy !== 'netPrice-asc'
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full antialiased font-[Poppins]">
      {/* ═══════════════════════════════════════════════════════════════
         TOAST NOTIFICATION
         ═══════════════════════════════════════════════════════════════ */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#111111] text-white px-4 py-3 rounded-[12px] shadow-2xl flex items-center gap-2.5 text-[13px] font-semibold border border-white/10 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-[#C9A55D]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         TOP HEADER BAR: BREADCRUMBS, TITLE & CONTROLS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[22px] p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0EBE6] pb-5">
          <div>
            {/* DYNAMIC BREADCRUMB */}
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#888888] mb-2 flex-wrap">
              <Link href="/dashboard" className="hover:text-[#690B1B] transition-colors">
                Dashboard
              </Link>
              <ChevronRight size={13} />
              <Link href="/dashboard/schools" className="hover:text-[#690B1B] transition-colors">
                University Finder
              </Link>
              <ChevronRight size={13} />
              {selectedUniDetail ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUniDetail(null);
                      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#690B1B] text-[#888888] transition-colors cursor-pointer"
                  >
                    Net Price Calculator
                  </button>
                  <ChevronRight size={13} />
                  <span className="text-[#690B1B] font-bold truncate max-w-[260px] sm:max-w-none">
                    {selectedUniDetail.name}
                  </span>
                </>
              ) : (
                <span className="text-[#690B1B] font-bold">Net Price Calculator</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-[#690B1B]/10 text-[#690B1B] flex items-center justify-center shrink-0 shadow-2xs border border-[#690B1B]/15">
                <Calculator size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-[-0.03em]">
                    {selectedUniDetail ? selectedUniDetail.name : 'US Universities Net Price Calculator'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F7F0F1] text-[#690B1B] text-[10.5px] font-extrabold uppercase tracking-wider border border-[#690B1B]/20">
                    {selectedUniDetail ? `${selectedUniDetail.state}, USA` : `${totalUniCountStr} Institutions`}
                  </span>
                </div>
                <p className="text-[12.5px] sm:text-[13.5px] text-[#666666] mt-0.5">
                  {selectedUniDetail
                    ? 'In-depth real-time out-of-pocket cost breakdown, merit aid, and admission criteria.'
                    : 'Calculate your true out-of-pocket net tuition, need-based grants, and merit scholarships.'}
                </p>
              </div>
            </div>
          </div>

          {/* TABS & CURRENCY SWITCHER */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* TAB SWITCHER */}
            <div className="flex items-center bg-[#F6F4F2] p-1 rounded-full border border-[#E7E2DE]">
              <button
                onClick={() => {
                  setActiveTab('catalog');
                  if (selectedUniDetail) setSelectedUniDetail(null);
                }}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-white text-[#690B1B] shadow-xs'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                Calculator &amp; Catalog
              </button>
              <button
                onClick={() => {
                  setActiveTab('compare');
                  if (selectedUniDetail) setSelectedUniDetail(null);
                }}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'compare'
                    ? 'bg-[#690B1B] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Layers size={13} />
                <span>Compare ({selectedForCompare.length}/4)</span>
              </button>
            </div>


          </div>
        </div>

        {/* FINANCIAL AID ELIGIBILITY HIGHLIGHT BANNER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FAF8F6] border border-[#F0EBE6] rounded-[16px] p-3.5 sm:p-4 text-[12.5px]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse shrink-0" />
            <div>
              <span className="font-bold text-[#111111]">Financial Aid Tier: </span>
              <span className="text-[#690B1B] font-bold">{getBracketAidInfo(familyIncome)}</span>
              <span className="text-[#666666] hidden md:inline"> • Based on ${familyIncome.toLocaleString()} annual family income</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11.5px] text-[#777777]">
            <Sparkles size={14} className="text-[#C9A55D]" />
            <span>Updated live across all {totalUniCountStr} universities</span>
          </div>
        </div>
      </div>

      {selectedUniDetail && uniDetailCalc ? (
        /* ═══════════════════════════════════════════════════════════════
           IN-PAGE UNIVERSITY DETAIL BREAKDOWN VIEW (NO POPUP)
           ═══════════════════════════════════════════════════════════════ */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* TOP BACK BUTTON & QUICK ACTIONS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-[#E7E2DE] p-4 rounded-[18px] shadow-xs">
            <button
              onClick={() => {
                setSelectedUniDetail(null);
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-full bg-[#F7F0F1] hover:bg-[#690B1B] hover:text-white text-[#690B1B] font-bold text-[13px] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <ArrowLeft size={14} />
              <span>Back to all universities</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
              <button
                onClick={() => handleSaveToCollegeList(selectedUniDetail)}
                className="px-4 py-2 rounded-[12px] bg-[#690B1B] text-white text-[12.5px] font-bold hover:bg-[#7A1022] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Bookmark size={14} />
                <span>Save to My College List</span>
              </button>

              <button
                onClick={() => toggleCompare(selectedUniDetail)}
                className={`px-3.5 py-2 rounded-[12px] border text-[12.5px] font-semibold transition-colors cursor-pointer ${
                  selectedForCompare.includes(selectedUniDetail.id)
                    ? 'bg-[#111111] border-[#111111] text-white'
                    : 'bg-white border-[#E7E2DE] text-[#111111] hover:bg-[#F6F4F2]'
                }`}
              >
                {selectedForCompare.includes(selectedUniDetail.id)
                  ? '✓ In Compare'
                  : '+ Add to Compare'}
              </button>

              {selectedUniDetail.website && (
                <a
                  href={selectedUniDetail.website.startsWith('http') ? selectedUniDetail.website : `https://${selectedUniDetail.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-[12px] bg-white border border-[#E7E2DE] text-[#555555] hover:text-[#690B1B] text-[12px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Official Website</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* MAIN BREAKDOWN CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[22px] p-5 sm:p-7 shadow-xs space-y-6">
            {/* UNIVERSITY HERO HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0EBE6] pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-[12px] text-[#888888] flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-[#690B1B]">
                    <MapPin size={13} />
                    <span>{selectedUniDetail.state}, United States</span>
                  </span>
                  {selectedUniDetail.qsRanking !== 'Unranked' && (
                    <>
                      <span>•</span>
                      <span className="font-bold text-[#C9A55D] flex items-center gap-1">
                        <Award size={13} />
                        <span>QS World Rank #{selectedUniDetail.qsRanking}</span>
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="font-medium text-[#666]">Acceptance Rate: {selectedUniDetail.acceptanceRate}%</span>
                </div>
                <h2 className="text-[24px] sm:text-[30px] font-extrabold text-[#111111] leading-tight tracking-[-0.02em]">
                  {selectedUniDetail.name}
                </h2>
              </div>

              {/* ESTIMATED SAVINGS CALLOUT */}
              <div className="bg-[#F7F0F1] border border-[#690B1B]/20 rounded-[16px] p-3 sm:p-4 text-right shrink-0">
                <span className="text-[11px] font-semibold text-[#666666] block">Estimated Out-of-Pocket</span>
                <span className="text-[24px] sm:text-[28px] font-extrabold text-[#690B1B] block leading-none my-0.5">
                  {formatMoney(uniDetailCalc.calc.netPrice)}
                  <span className="text-[13px] font-bold text-[#666]">/yr</span>
                </span>
                <span className="text-[11.5px] font-bold text-[#16a34a]">
                  Save {formatMoney(uniDetailCalc.savings)}/yr ({Math.round(uniDetailCalc.savingsPercent)}% off COA)
                </span>
              </div>
            </div>

            {/* LIVE SIMULATOR SLIDER CARD FOR THIS UNIVERSITY */}
            <div className="bg-[#FAF8F6] border border-[#E7E2DE] rounded-[18px] p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <h3 className="text-[15px] font-bold text-[#111111] flex items-center gap-2">
                  <Sparkles size={17} className="text-[#690B1B]" />
                  <span>Interactive Net Price Simulator for {selectedUniDetail.name}</span>
                </h3>
                <span className="text-[11.5px] text-[#777777]">Slide values to test real-time financial aid outcomes</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* INCOME SLIDER */}
                <div className="bg-white p-4 rounded-[14px] border border-[#EAE6E2] shadow-2xs space-y-2">
                  <div className="flex justify-between items-center text-[12px] font-semibold text-[#555555]">
                    <span>Household Income:</span>
                    <strong className="text-[#690B1B] text-[14px] font-bold">${detailSimIncome.toLocaleString()}</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250000}
                    step={5000}
                    value={detailSimIncome}
                    onChange={(e) => setDetailSimIncome(Number(e.target.value))}
                    className="w-full accent-[#690B1B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#999]">
                    <span>$0 (Full Need)</span>
                    <span>$125k</span>
                    <span>$250k+</span>
                  </div>
                </div>

                {/* GPA SLIDER */}
                <div className="bg-white p-4 rounded-[14px] border border-[#EAE6E2] shadow-2xs space-y-2">
                  <div className="flex justify-between items-center text-[12px] font-semibold text-[#555555]">
                    <span>Unweighted GPA:</span>
                    <strong className="text-[#111111] text-[14px] font-bold">{detailSimGpa.toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min={2.0}
                    max={4.0}
                    step={0.05}
                    value={detailSimGpa}
                    onChange={(e) => setDetailSimGpa(Number(e.target.value))}
                    className="w-full accent-[#690B1B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#999]">
                    <span>2.0</span>
                    <span>3.0</span>
                    <span>4.0</span>
                  </div>
                </div>

                {/* SAT SLIDER */}
                <div className="bg-white p-4 rounded-[14px] border border-[#EAE6E2] shadow-2xs space-y-2">
                  <div className="flex justify-between items-center text-[12px] font-semibold text-[#555555]">
                    <span>SAT Composite:</span>
                    <strong className="text-[#111111] text-[14px] font-bold">{detailSimSat}</strong>
                  </div>
                  <input
                    type="range"
                    min={800}
                    max={1600}
                    step={10}
                    value={detailSimSat}
                    onChange={(e) => setDetailSimSat(Number(e.target.value))}
                    className="w-full accent-[#690B1B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#999]">
                    <span>800</span>
                    <span>1200</span>
                    <span>1600</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS METRICS & ITEMIZED COST SHEET */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* COST BREAKDOWN */}
              <div className="space-y-3 bg-[#FAF8F6] p-5 sm:p-6 rounded-[18px] border border-[#F0EBE6]">
                <h4 className="text-[15px] font-bold text-[#111111] flex items-center justify-between">
                  <span>Annual Cost Breakdown</span>
                  <span className="text-[11px] font-medium text-[#888]">USD or Converted</span>
                </h4>
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex justify-between py-1.5 border-b border-[#EAE6E2]">
                    <span className="text-[#666]">Published Tuition &amp; Fees:</span>
                    <strong className="text-[#111]">{formatMoney(selectedUniDetail.tuition)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#EAE6E2]">
                    <span className="text-[#666]">Estimated Housing &amp; Living:</span>
                    <strong className="text-[#111]">{formatMoney(selectedUniDetail.livingCosts)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#EAE6E2] font-semibold">
                    <span className="text-[#333]">Total Cost of Attendance (COA):</span>
                    <strong className="text-[#111]">{formatMoney(uniDetailCalc.sticker)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#EAE6E2] text-[#16a34a]">
                    <span>Need-Based Grant (Est.):</span>
                    <strong className="font-bold">-{formatMoney(uniDetailCalc.calc.estimatedNeedBasedAid)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#EAE6E2] text-[#16a34a]">
                    <span>Merit Scholarship (Est.):</span>
                    <strong className="font-bold">-{formatMoney(uniDetailCalc.calc.estimatedMeritAid)}</strong>
                  </div>
                  <div className="flex justify-between pt-3.5 text-[17px] font-extrabold text-[#690B1B] border-t-2 border-[#690B1B]/20">
                    <span>YOUR ESTIMATED NET PRICE:</span>
                    <span>{formatMoney(uniDetailCalc.calc.netPrice)}/yr</span>
                  </div>
                </div>
              </div>

              {/* SCHOLARSHIP OPPORTUNITIES */}
              <div className="space-y-3 bg-[#FAF8F6] p-5 sm:p-6 rounded-[18px] border border-[#F0EBE6]">
                <div className="flex items-center justify-between">
                  <h4 className="text-[15px] font-bold text-[#111111]">Scholarship Opportunities</h4>
                  <span className="text-[11px] font-bold text-[#16a34a] bg-[#16a34a]/10 px-2.5 py-0.5 rounded-full border border-[#16a34a]/20">
                    Match: {uniDetailCalc.scholarships.overallMatch.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto [scrollbar-width:thin] pr-1">
                  {uniDetailCalc.scholarships.opportunities.map((opp, idx) => (
                    <div key={idx} className="p-3.5 rounded-[14px] bg-white border border-[#E7E2DE] text-[12px] space-y-1.5 shadow-2xs">
                      <div className="font-bold text-[#111111] leading-snug">
                        {opp.title}
                      </div>
                      <div>
                        <span className="inline-block text-[#15803d] font-bold text-[11.5px] bg-[#16a34a]/10 px-2.5 py-1 rounded-[8px] border border-[#16a34a]/20 max-w-full break-words leading-snug">
                          {opp.estimatedAmount}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#666] leading-relaxed">{opp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ADMISSION REQUIREMENTS & WRITING PROMPTS */}
            <div className="space-y-3 bg-[#FAF8F6] p-5 sm:p-6 rounded-[18px] border border-[#F0EBE6] text-[12.5px]">
              <h4 className="text-[15px] font-bold text-[#111111] flex items-center gap-2">
                <FileText size={16} className="text-[#690B1B]" />
                <span>Admissions &amp; Application Guidelines</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#555]">
                <div className="p-4 bg-white rounded-[14px] border border-[#E7E2DE]">
                  <strong className="text-[#111] block mb-1">English Proficiency Cut-off:</strong>
                  <p>{selectedUniDetail.toeflScore || 'TOEFL 79 iBT / IELTS 6.5 minimum'}</p>
                </div>
                <div className="p-4 bg-white rounded-[14px] border border-[#E7E2DE]">
                  <strong className="text-[#111] block mb-1">Writing &amp; Essay Requirements:</strong>
                  <p>{selectedUniDetail.writingReqs || 'Common App personal essay required'}</p>
                </div>
              </div>
              {selectedUniDetail.essayPrompts && (
                <div className="p-4 bg-white rounded-[14px] border border-[#E7E2DE]">
                  <strong className="text-[#111] block mb-1">Essay Topics:</strong>
                  <p className="text-[11.5px] text-[#666] leading-relaxed whitespace-pre-line">
                    {selectedUniDetail.essayPrompts}
                  </p>
                </div>
              )}
            </div>

            {/* BOTTOM NAV / ACTIONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F0EBE6]">
              <button
                onClick={() => {
                  setSelectedUniDetail(null);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#F7F0F1] hover:bg-[#690B1B] hover:text-white text-[#690B1B] font-bold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <ArrowLeft size={14} />
                <span>Back to all universities</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleSaveToCollegeList(selectedUniDetail)}
                  className="px-5 py-2.5 rounded-[12px] bg-[#690B1B] text-white text-[12.5px] font-bold hover:bg-[#7A1022] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Bookmark size={14} />
                  <span>Save to My College List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ═══════════════════════════════════════════════════════════════
             INTERACTIVE PROFILE & CALCULATOR INPUTS BAR (CARD)
             ═══════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-[#E7E2DE] rounded-[22px] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0EBE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#690B1B]/10 text-[#690B1B] flex items-center justify-center">
                  <Sliders size={16} />
                </div>
                <div>
                  <h2 className="text-[16px] sm:text-[18px] font-bold text-[#111111]">
                    Your Student &amp; Financial Profile
                  </h2>
                  <p className="text-[11.5px] text-[#777777]">
                    Adjust your values below to recalibrate all {totalUniCountStr} universities instantly
                  </p>
                </div>
              </div>

              {/* QUICK RESET BUTTON */}
              <button
                onClick={() => {
                  setFamilyIncome(65000);
                  setStudentGpa(3.75);
                  setStudentSat(1350);
                }}
                className="text-[11.5px] font-semibold text-[#888888] hover:text-[#690B1B] transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw size={12} />
                <span>Reset Profile Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* INCOME SLIDER CARD */}
              <div className="space-y-3 bg-[#FAF8F6] border border-[#F0EBE6] p-4 sm:p-5 rounded-[16px]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#555555]">Annual Family Income</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-[15px] text-[#690B1B] font-bold">
                      ${familyIncome.toLocaleString()}
                    </strong>
                    <span className="text-[10.5px] bg-[#690B1B]/10 text-[#690B1B] px-2 py-0.5 rounded-full font-bold">
                      {getBracketLabel(familyIncome)}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={250000}
                  step={5000}
                  value={familyIncome}
                  onChange={(e) => setFamilyIncome(Number(e.target.value))}
                  className="w-full accent-[#690B1B] cursor-pointer"
                />
                {/* QUICK PRESET CHIPS */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {[25000, 50000, 75000, 100000, 150000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setFamilyIncome(val)}
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold transition-all cursor-pointer ${
                        familyIncome === val
                          ? 'bg-[#690B1B] text-white'
                          : 'bg-white text-[#666] border border-[#E7E2DE] hover:border-[#690B1B]'
                      }`}
                    >
                      ${val / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* GPA SLIDER CARD */}
              <div className="space-y-3 bg-[#FAF8F6] border border-[#F0EBE6] p-4 sm:p-5 rounded-[16px]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#555555]">High School GPA</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-[15px] text-[#111111] font-bold">
                      {studentGpa.toFixed(2)}
                    </strong>
                    <span className="text-[10.5px] bg-[#C9A55D]/15 text-[#C9A55D] px-2 py-0.5 rounded-full font-bold">
                      {studentGpa >= 3.8 ? 'Excellent' : studentGpa >= 3.5 ? 'Competitive' : 'Good'}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={2.0}
                  max={4.0}
                  step={0.05}
                  value={studentGpa}
                  onChange={(e) => setStudentGpa(Number(e.target.value))}
                  className="w-full accent-[#690B1B] cursor-pointer"
                />
                {/* QUICK PRESET CHIPS */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {[3.0, 3.3, 3.6, 3.85, 4.0].map((val) => (
                    <button
                      key={val}
                      onClick={() => setStudentGpa(val)}
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold transition-all cursor-pointer ${
                        studentGpa === val
                          ? 'bg-[#690B1B] text-white'
                          : 'bg-white text-[#666] border border-[#E7E2DE] hover:border-[#690B1B]'
                      }`}
                    >
                      {val.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* SAT SLIDER CARD */}
              <div className="space-y-3 bg-[#FAF8F6] border border-[#F0EBE6] p-4 sm:p-5 rounded-[16px]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#555555]">SAT Composite</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-[15px] text-[#111111] font-bold">
                      {studentSat}
                    </strong>
                    <span className="text-[10.5px] bg-[#16a34a]/10 text-[#16a34a] px-2 py-0.5 rounded-full font-bold">
                      {studentSat >= 1450 ? 'Top 5%' : studentSat >= 1300 ? 'Top 15%' : 'Standard'}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={800}
                  max={1600}
                  step={10}
                  value={studentSat}
                  onChange={(e) => setStudentSat(Number(e.target.value))}
                  className="w-full accent-[#690B1B] cursor-pointer"
                />
                {/* QUICK PRESET CHIPS */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {[1100, 1250, 1350, 1450, 1550].map((val) => (
                    <button
                      key={val}
                      onClick={() => setStudentSat(val)}
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold transition-all cursor-pointer ${
                        studentSat === val
                          ? 'bg-[#690B1B] text-white'
                          : 'bg-white text-[#666] border border-[#E7E2DE] hover:border-[#690B1B]'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* QUICK HIGH-IMPACT QUESTIONS: RESIDENCY, HOUSING, & BOOSTERS */}
            <div className="pt-2 border-t border-[#F0EBE6] grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* RESIDENCY SELECTOR */}
              <div className="bg-[#FAF8F6] border border-[#F0EBE6] p-4 rounded-[16px] space-y-2.5">
                <span className="text-[12px] font-semibold text-[#555555] block">Residency Status</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setResidency('in-state')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      residency === 'in-state'
                        ? 'bg-[#690B1B] text-white shadow-2xs'
                        : 'bg-white text-[#666] border border-[#E7E2DE] hover:border-[#690B1B]'
                    }`}
                  >
                    🏛️ In-State (Save $15k–$30k)
                  </button>
                  <button
                    type="button"
                    onClick={() => setResidency('out-of-state')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      residency === 'out-of-state'
                        ? 'bg-[#690B1B] text-white shadow-2xs'
                        : 'bg-white text-[#666] border border-[#E7E2DE] hover:border-[#690B1B]'
                    }`}
                  >
                    ✈️ Out-of-State
                  </button>
                  <button
                    type="button"
                    onClick={() => setResidency('international')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      residency === 'international'
                        ? 'bg-[#690B1B] text-white shadow-2xs'
                        : 'bg-white text-[#666] border border-[#E7E2DE] hover:border-[#690B1B]'
                    }`}
                  >
                    🌍 International
                  </button>
                </div>
              </div>

              {/* HOUSING PLAN SELECTOR */}
              <div className="bg-[#FAF8F6] border border-[#F0EBE6] p-4 rounded-[16px] space-y-2.5">
                <span className="text-[12px] font-semibold text-[#555555] block">Housing & Living Plan</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setHousing('on-campus')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      housing === 'on-campus'
                        ? 'bg-[#690B1B] text-white shadow-2xs'
                        : 'bg-white text-[#666] border border-[#E7E2DE] hover:border-[#690B1B]'
                    }`}
                  >
                    🏢 On-Campus Dorm
                  </button>
                  <button
                    type="button"
                    onClick={() => setHousing('off-campus')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      housing === 'off-campus'
                        ? 'bg-[#690B1B] text-white shadow-2xs'
                        : 'bg-white text-[#666] border border-[#E7E2DE] hover:border-[#690B1B]'
                    }`}
                  >
                    🏬 Off-Campus
                  </button>
                  <button
                    type="button"
                    onClick={() => setHousing('with-family')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      housing === 'with-family'
                        ? 'bg-[#16a34a] text-white shadow-2xs'
                        : 'bg-white text-[#666] border border-[#E7E2DE] hover:border-[#16a34a]'
                    }`}
                  >
                    🏠 With Family (-$12k!)
                  </button>
                </div>
              </div>

              {/* SCHOLARSHIP BOOSTERS */}
              <div className="bg-[#FAF8F6] border border-[#F0EBE6] p-4 rounded-[16px] space-y-2">
                <span className="text-[12px] font-semibold text-[#555555] block">Scholarship Boosters (Optional)</span>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[11.5px] text-[#333] cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={firstGen}
                      onChange={(e) => setFirstGen(e.target.checked)}
                      className="accent-[#690B1B] w-3.5 h-3.5"
                    />
                    <span>🎓 First-Generation Student (+$3k grant)</span>
                  </label>
                  <label className="flex items-center gap-2 text-[11.5px] text-[#333] cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={multipleInCollege}
                      onChange={(e) => setMultipleInCollege(e.target.checked)}
                      className="accent-[#690B1B] w-3.5 h-3.5"
                    />
                    <span>👨‍👩‍👧‍👦 2+ Siblings in College (Boosts need aid)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
             MAIN VIEW TABS: CATALOG vs COMPARE
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'catalog' ? (
            <div className="space-y-5">
              {/* ─── SEARCH & FILTER TOOLBAR ─── */}
              <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* SEARCH INPUT */}
                  <div className="lg:col-span-2 relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
                    <input
                      type="text"
                      placeholder="Search universities by name or state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#E7E2DE] text-[13px] text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#690B1B] transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] p-1"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* STATE FILTER */}
                  <div>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#E7E2DE] text-[13px] text-[#111111] focus:outline-none focus:border-[#690B1B] transition-colors cursor-pointer"
                    >
                      <option value="">All US States ({statesList.length || 50})</option>
                      {statesList.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* MAJOR FILTER */}
                  <div>
                    <select
                      value={selectedMajor}
                      onChange={(e) => setSelectedMajor(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#E7E2DE] text-[13px] text-[#111111] focus:outline-none focus:border-[#690B1B] transition-colors cursor-pointer"
                    >
                      <option value="">All Majors ({majorsList.length || 20}+)</option>
                      {majorsList.map((major) => (
                        <option key={major} value={major}>
                          {major}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SORT BY */}
                  <div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#E7E2DE] text-[13px] text-[#111111] font-semibold focus:outline-none focus:border-[#690B1B] transition-colors cursor-pointer"
                    >
                      <option value="netPrice-asc">Net Price: Low to High</option>
                      <option value="netPrice-desc">Net Price: High to Low</option>
                      <option value="tuition-asc">Tuition: Low to High</option>
                      <option value="acceptance-desc">Highest Acceptance Rate</option>
                      <option value="savings-desc">Highest Financial Savings ($)</option>
                      <option value="name-asc">Alphabetical (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* SECONDARY FILTER CHIPS & ACTIVE COUNT */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#F0EBE6] text-[12px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#888888] font-semibold">Net Price Budget:</span>
                    {[
                      { label: 'Any Budget', val: null },
                      { label: '< $15k', val: 15000 },
                      { label: '$15k – $30k', val: 30000 },
                      { label: '$30k – $50k', val: 50000 },
                      { label: '$50k+', val: 99999 },
                    ].map(({ label, val }) => (
                      <button
                        key={label}
                        onClick={() => setTuitionFilter(val)}
                        className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold transition-all cursor-pointer ${
                          tuitionFilter === val
                            ? 'bg-[#690B1B] text-white shadow-2xs'
                            : 'bg-[#FAF8F6] text-[#666666] border border-[#E7E2DE] hover:border-[#690B1B]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#666666] font-semibold">
                      Showing <strong className="text-[#111111]">{filteredUniversities.length}</strong> of {totalUniCountStr} schools
                    </span>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-[#690B1B] hover:underline font-bold text-[11.5px] flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={11} />
                        <span>Clear Filters</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── LOADING STATE ─── */}
              {loading && (
                <div className="py-20 text-center bg-white rounded-[22px] border border-[#E7E2DE] shadow-xs">
                  <div className="w-9 h-9 border-3 border-[#690B1B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <div className="text-[14px] font-bold text-[#111111]">Loading US Universities Database...</div>
                  <div className="text-[12px] text-[#888888] mt-1">Analyzing {totalUniCountStr} institutions and aid policies</div>
                </div>
              )}

              {/* ─── ERROR STATE ─── */}
              {error && (
                <div className="p-6 bg-[#FFF5F5] rounded-[18px] border border-red-200 text-center text-[13px] text-red-700">
                  {error}
                </div>
              )}

              {/* ─── EMPTY STATE ─── */}
              {!loading && filteredUniversities.length === 0 && (
                <div className="py-16 text-center bg-white rounded-[22px] border border-[#E7E2DE] p-6 shadow-xs space-y-3">
                  <Building2 size={36} className="mx-auto text-[#888888]" />
                  <h3 className="text-[17px] font-bold text-[#111111]">No universities found</h3>
                  <p className="text-[13px] text-[#666666] max-w-md mx-auto">
                    No institutions match your selected filters. Try broadening your income, location, or budget criteria.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-full bg-[#690B1B] text-white text-[12.5px] font-bold hover:bg-[#7A1022] transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* ─── UNIVERSITY CARDS GRID ─── */}
              {!loading && filteredUniversities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredUniversities.slice(0, visibleLimit).map(({ university, calc, sticker, savings, savingsPercent }) => {
                    const isCompared = selectedForCompare.includes(university.id);
                    const isSaved = savedUniIds.has(university.id);

                    return (
                      <div
                        key={university.id}
                        className="group bg-white border border-[#E7E2DE] hover:border-[#690B1B]/40 rounded-[20px] p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                      >
                        <div>
                          {/* TOP CARD HEADER: STATE & QS RANK */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full bg-[#FAF8F6] text-[#666666] text-[11px] font-bold border border-[#E7E2DE] flex items-center gap-1">
                                <MapPin size={11} className="text-[#690B1B]" />
                                <span>{university.state}</span>
                              </span>
                              {university.qsRanking !== 'Unranked' && (
                                <span className="px-2 py-0.5 rounded-full bg-[#C9A55D]/15 text-[#C9A55D] text-[11px] font-extrabold border border-[#C9A55D]/25 flex items-center gap-1">
                                  <Star size={10} className="fill-[#C9A55D]" />
                                  <span>#{university.qsRanking}</span>
                                </span>
                              )}
                            </div>

                            {/* BOOKMARK SAVE BUTTON */}
                            <button
                              type="button"
                              onClick={() => handleSaveToCollegeList(university)}
                              title="Save to My College List"
                              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                isSaved
                                  ? 'bg-[#690B1B] text-white shadow-2xs'
                                  : 'bg-[#FAF8F6] text-[#888888] hover:text-[#690B1B] hover:bg-[#F7F0F1]'
                              }`}
                            >
                              <Bookmark size={14} className={isSaved ? 'fill-white' : ''} />
                            </button>
                          </div>

                          {/* UNIVERSITY TITLE */}
                          <h3 className="text-[17px] font-bold text-[#111111] group-hover:text-[#690B1B] transition-colors line-clamp-2 leading-snug">
                            {university.name}
                          </h3>

                          {/* SPOTLIGHT COST BOX */}
                          <div className="bg-[#FAF8F6] border border-[#F0EBE6] rounded-[16px] p-3.5 my-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[11.5px] text-[#777777]">
                              <span>Published Cost of Attendance (COA):</span>
                              <span className="line-through font-medium">{formatMoney(sticker)}</span>
                            </div>

                            <div className="flex items-baseline justify-between pt-0.5">
                              <span className="text-[11px] font-extrabold uppercase text-[#555555] tracking-wider">
                                Your Net Price:
                              </span>
                              <div className="text-right">
                                <span className="text-[22px] font-extrabold text-[#690B1B] leading-none">
                                  {formatMoney(calc.netPrice)}
                                </span>
                                <span className="text-[11px] font-bold text-[#888888]">/yr</span>
                              </div>
                            </div>

                            {/* SAVINGS PILL */}
                            <div className="flex items-center justify-between pt-1 border-t border-[#EAE6E2] text-[11px]">
                              <span className="text-[#16a34a] font-extrabold flex items-center gap-1">
                                <Check size={12} />
                                <span>Save {formatMoney(savings)}/yr</span>
                              </span>
                              <span className="text-[10px] bg-[#16a34a]/10 text-[#16a34a] font-bold px-1.5 py-0.5 rounded">
                                {Math.round(savingsPercent)}% Off
                              </span>
                            </div>
                          </div>

                          {/* ADMISSION METRICS ROW */}
                          <div className="grid grid-cols-3 gap-1.5 text-center py-2 border-y border-[#F0EBE6] text-[11px]">
                            <div>
                              <span className="text-[#888888] block text-[10px]">Acceptance</span>
                              <strong className="text-[#111111] font-bold">{university.acceptanceRate}%</strong>
                            </div>
                            <div className="border-x border-[#F0EBE6]">
                              <span className="text-[#888888] block text-[10px]">Avg GPA</span>
                              <strong className="text-[#111111] font-bold">{university.avgGPA || 3.75}</strong>
                            </div>
                            <div>
                              <span className="text-[#888888] block text-[10px]">Need Aid</span>
                              <strong className="text-[#16a34a] font-bold">
                                {calc.estimatedNeedBasedAid > 0 ? formatMoney(calc.estimatedNeedBasedAid) : 'Merit'}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* CARD ACTIONS FOOTER */}
                        <div className="flex items-center gap-2 pt-3 mt-1">
                          {/* COMPARE BUTTON */}
                          <button
                            type="button"
                            onClick={() => toggleCompare(university)}
                            className={`px-3 py-2 rounded-[10px] border text-[11.5px] font-bold transition-all cursor-pointer shrink-0 ${
                              isCompared
                                ? 'bg-[#111111] border-[#111111] text-white'
                                : 'bg-white border-[#E7E2DE] text-[#666666] hover:bg-[#F6F4F2] hover:text-[#111111]'
                            }`}
                          >
                            {isCompared ? '✓ Compared' : '+ Compare'}
                          </button>

                          {/* FULL BREAKDOWN IN-PAGE BUTTON */}
                          <button
                            type="button"
                            onClick={() => openUniDetail(university)}
                            className="w-full px-3.5 py-2 rounded-[10px] bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#7A1022] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:shadow-xs"
                          >
                            <span>Full Breakdown</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ─── LOAD MORE BUTTON ─── */}
              {!loading && filteredUniversities.length > visibleLimit && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setVisibleLimit((prev) => prev + 24)}
                    className="px-6 py-2.5 rounded-full bg-white border border-[#E7E2DE] text-[#690B1B] font-bold text-[13px] hover:bg-[#F7F0F1] transition-all cursor-pointer shadow-xs"
                  >
                    Load More Institutions ({filteredUniversities.length - visibleLimit} remaining)
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ═══════════════════════════════════════════════════════════════
               COMPARE TAB VIEW
               ═══════════════════════════════════════════════════════════════ */
            <div className="bg-white border border-[#E7E2DE] rounded-[22px] p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE6] pb-4">
                <div>
                  <h3 className="text-[18px] font-bold text-[#111111] flex items-center gap-2">
                    <Layers size={18} className="text-[#690B1B]" />
                    <span>University Comparison Matrix</span>
                  </h3>
                  <p className="text-[12px] text-[#666666]">
                    Comparing side-by-side estimated net tuition, published costs, and scholarships
                  </p>
                </div>

                {selectedForCompare.length > 0 && (
                  <button
                    onClick={() => setSelectedForCompare([])}
                    className="text-[12px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <Trash2 size={13} />
                    <span>Clear All ({selectedForCompare.length})</span>
                  </button>
                )}
              </div>

              {compareUniversities.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Layers size={36} className="mx-auto text-[#888888]" />
                  <h4 className="text-[16px] font-bold text-[#111111]">No universities selected for comparison</h4>
                  <p className="text-[13px] text-[#666666] max-w-sm mx-auto">
                    Click &quot;+ Compare&quot; on any university card in the catalog to add up to 4 schools side-by-side.
                  </p>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="px-4 py-2 rounded-full bg-[#690B1B] text-white text-[12.5px] font-bold hover:bg-[#7A1022] transition-colors cursor-pointer"
                  >
                    Return to Catalog
                  </button>
                </div>
              ) : (
                <>
                  {/* ══════════════════════════════════════════════════════════
                     DESKTOP TABLE (VISIBLE ON MD+ SCREENS)
                   ══════════════════════════════════════════════════════════ */}
                {/* ─── HORIZONTAL SCROLL CONTROLLER BAR (DESKTOP & TABLET) ─── */}
                {compareUniversities.length > 1 && (
                  <div className="hidden md:flex items-center justify-between bg-white border border-[#E7E2DE] px-4 py-2.5 rounded-[18px] text-[12.5px] shadow-2xs mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#690B1B] animate-pulse" />
                      <span className="font-bold text-[#111111]">Comparing {compareUniversities.length} of 4 Schools</span>
                      <span className="text-[#888888] text-[11.5px] hidden lg:inline">• Click arrows or drag to view hidden columns horizontally</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => scrollCalcColumns('left')}
                        disabled={!canScrollLeftCalc}
                        className="px-3 py-1 rounded-full bg-[#FAF8F6] border border-[#E7E2DE] text-[#111111] font-bold text-[11px] hover:bg-[#690B1B] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft size={13} />
                        <span>Left</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollCalcColumns('right')}
                        disabled={!canScrollRightCalc}
                        className="px-3 py-1 rounded-full bg-[#690B1B] text-white font-bold text-[11px] hover:bg-[#530816] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Right</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                )}

                <div
                  ref={calcTableContainerRef}
                  onMouseDown={handleCalcMouseDown}
                  onMouseMove={handleCalcMouseMove}
                  onMouseUp={handleCalcMouseUpOrLeave}
                  onMouseLeave={handleCalcMouseUpOrLeave}
                  className={`hidden md:block overflow-x-auto select-none touch-pan-x rounded-[20px] border border-[#E7E2DE] bg-white shadow-xs ${
                    isDraggingCalc ? 'cursor-grabbing' : 'cursor-default'
                  } [scrollbar-width:auto] [scrollbar-color:#C9A55D_#EAE4DF] [&::-webkit-scrollbar]:h-3.5 [&::-webkit-scrollbar-track]:bg-[#F0EBE6] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C9A55D] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#690B1B]`}>
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#E7E2DE] bg-[#FAF8F6]">
                        <th className="p-4 sm:p-5 w-[220px] min-w-[200px] text-[12px] font-extrabold uppercase tracking-wider text-[#888888] bg-[#FAF8F6]">
                          <span className="flex items-center gap-1.5">
                            <Layers size={14} className="text-[#690B1B]" />
                            <span>Comparison Metrics</span>
                          </span>
                        </th>
                        {compareUniversities.map(({ university }) => (
                          <th
                            key={university.id}
                            className="p-4 sm:p-5 min-w-[260px] max-w-[320px] align-top relative border-l border-[#F0EBE6]"
                          >
                            <button
                              onClick={() => toggleCompare(university)}
                              className="absolute top-4 right-4 p-1 rounded-full text-[#888888] hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                              title="Remove from comparison"
                            >
                              <X size={14} />
                            </button>
                            <div className="pr-6 space-y-1">
                              <span className="text-[10.5px] font-bold text-[#690B1B] uppercase tracking-wider block">
                                📍 {university.state}, USA
                              </span>
                              <h4 className="text-[16px] font-bold text-[#111111] leading-snug">
                                {university.name}
                              </h4>
                              {university.qsRanking !== 'Unranked' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C9A55D] bg-[#C9A55D]/15 px-2 py-0.5 rounded-full mt-1">
                                  <Award size={12} /> QS #{university.qsRanking}
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE6] text-[13px]">
                      {/* SECTION 1: OUT-OF-POCKET ESTIMATE & SAVINGS */}
                      <tr className="bg-[#FAF8F6]">
                        <td
                          colSpan={compareUniversities.length + 1}
                          className="px-4 sm:px-5 py-2.5 text-[11px] font-extrabold text-[#690B1B] uppercase tracking-wider"
                        >
                          💰 Out-of-Pocket Net Price &amp; Aid Savings
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-bold text-[#333333] bg-[#FAF8F6]/40">
                          Estimated Net Price / yr
                        </td>
                        {compareUniversities.map(({ university, calc }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] bg-[#FDF9FA]/50">
                            <strong className="text-[24px] sm:text-[26px] font-extrabold text-[#690B1B] block leading-none">
                              {formatMoney(calc.netPrice)}
                              <span className="text-[12px] font-normal text-[#666666]">/yr</span>
                            </strong>
                            <span className="text-[11px] text-[#888888] block mt-1">
                              Personalized to your income &amp; stats
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          Total Annual Savings
                        </td>
                        {compareUniversities.map(({ university, savings, savingsPercent }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6]">
                            <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#16a34a] bg-[#16a34a]/10 px-2.5 py-1 rounded-full border border-[#16a34a]/20">
                              🎉 Save {formatMoney(savings)} ({Math.round(savingsPercent)}% off COA)
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* SECTION 2: COST OF ATTENDANCE BREAKDOWN */}
                      <tr className="bg-[#FAF8F6]">
                        <td
                          colSpan={compareUniversities.length + 1}
                          className="px-4 sm:px-5 py-2.5 text-[11px] font-extrabold text-[#690B1B] uppercase tracking-wider"
                        >
                          💵 Published Cost of Attendance (COA)
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          Published Tuition &amp; Fees
                        </td>
                        {compareUniversities.map(({ university, calc }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] font-semibold text-[#111111]">
                            {formatMoney(calc.tuition)}
                            {calc.inStateSavings ? (
                              <span className="block text-[11px] text-[#16a34a] font-normal mt-0.5">
                                ✓ In-State Rates Applied
                              </span>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          Housing &amp; Food Expenses
                        </td>
                        {compareUniversities.map(({ university, calc }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] font-semibold text-[#111111]">
                            {formatMoney(calc.livingCosts)}
                            {calc.housingSavings ? (
                              <span className="block text-[11px] text-[#16a34a] font-normal mt-0.5">
                                ✓ Living with Family (Room/Board $0)
                              </span>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-bold text-[#333333] bg-[#FAF8F6]/40">
                          Total Cost of Attendance (COA)
                        </td>
                        {compareUniversities.map(({ university, calc }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] font-bold text-[#111111]">
                            {formatMoney(calc.stickerPrice)}
                          </td>
                        ))}
                      </tr>

                      {/* SECTION 3: FINANCIAL AID & SCHOLARSHIPS */}
                      <tr className="bg-[#FAF8F6]">
                        <td
                          colSpan={compareUniversities.length + 1}
                          className="px-4 sm:px-5 py-2.5 text-[11px] font-extrabold text-[#690B1B] uppercase tracking-wider"
                        >
                          🎁 Grants &amp; Scholarships Breakdown
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          Need-Based Grant (Est.)
                        </td>
                        {compareUniversities.map(({ university, calc }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] font-bold text-[#16a34a]">
                            {calc.estimatedNeedBasedAid > 0 ? `-${formatMoney(calc.estimatedNeedBasedAid)}` : '$0'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          Academic Merit Scholarship
                        </td>
                        {compareUniversities.map(({ university, calc }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] font-bold text-[#C9A55D]">
                            {calc.estimatedMeritAid > 0 ? `-${formatMoney(calc.estimatedMeritAid)}` : '$0'}
                            <span className="block text-[10.5px] text-[#666666] font-normal mt-0.5">
                              Rating: {getMeritLevelLabel(calc.meritLevel)}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          Key Scholarships (Authentic)
                        </td>
                        {compareUniversities.map(({ university }) => {
                          const schList = university.scholarships || [];
                          return (
                            <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] align-top max-w-[320px]">
                              {schList.length > 0 ? (
                                <div className="space-y-2">
                                  {schList.slice(0, 3).map((s, sIdx) => (
                                    <div
                                      key={sIdx}
                                      className="text-[11.5px] p-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#EAE6E2] space-y-1.5 shadow-2xs"
                                    >
                                      <div className="font-bold text-[#111111] leading-snug">
                                        {s.title}
                                      </div>
                                      <div>
                                        <span className="inline-block text-[#16a34a] font-extrabold text-[10.5px] bg-[#16a34a]/10 px-2 py-0.5 rounded-full border border-[#16a34a]/20 max-w-full break-words leading-tight">
                                          {s.amount}
                                        </span>
                                      </div>
                                      {s.description && (
                                        <p className="text-[10.5px] text-[#666666] line-clamp-2 leading-relaxed">
                                          {s.description}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[12px] text-[#888888] italic">
                                  Institutional &amp; federal Pell grants apply
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* SECTION 4: ADMISSIONS & SELECTIVITY */}
                      <tr className="bg-[#FAF8F6]">
                        <td
                          colSpan={compareUniversities.length + 1}
                          className="px-4 sm:px-5 py-2.5 text-[11px] font-extrabold text-[#690B1B] uppercase tracking-wider"
                        >
                          📊 Admissions &amp; Academic Selectivity
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          Acceptance Rate
                        </td>
                        {compareUniversities.map(({ university }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] font-bold text-[#111111]">
                            {university.acceptanceRate}%
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          Average High School GPA
                        </td>
                        {compareUniversities.map(({ university }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] font-bold text-[#111111]">
                            {university.avgGPA ? `${university.avgGPA.toFixed(2)} / 4.0` : '3.50+'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          SAT Score Range
                        </td>
                        {compareUniversities.map(({ university }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] font-semibold text-[#111111]">
                            {university.satScore.min > 0 ? `${university.satScore.min} – ${university.satScore.max}` : 'Test-Optional'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-medium text-[#555555] bg-[#FAF8F6]/40">
                          English Proficiency (TOEFL/IELTS)
                        </td>
                        {compareUniversities.map(({ university }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] text-[12px] text-[#555555]">
                            {university.toeflScore || 'TOEFL 79 iBT / IELTS 6.5'}
                          </td>
                        ))}
                      </tr>

                      {/* SECTION 5: ACTIONS */}
                      <tr className="bg-white">
                        <td className="p-4 sm:p-5 font-bold text-[#333333] bg-[#FAF8F6]/40">
                          Explore &amp; Apply
                        </td>
                        {compareUniversities.map(({ university }) => (
                          <td key={university.id} className="p-4 sm:p-5 border-l border-[#F0EBE6] space-y-2">
                            <button
                              onClick={() => openUniDetail(university)}
                              className="w-full py-2.5 rounded-[12px] bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#7A1022] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <span>View In-Page Breakdown</span>
                              <ArrowRight size={12} />
                            </button>
                            {university.website && (
                              <a
                                href={university.website.startsWith('http') ? university.website : `https://${university.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 rounded-[12px] bg-[#FAF8F6] border border-[#E7E2DE] hover:border-[#690B1B] text-[#555555] hover:text-[#690B1B] text-[11.5px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>Official Website</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ══════════════════════════════════════════════════════════
                    MOBILE COMPARISON VIEW (VISIBLE ON < MD SCREENS, ZERO HORIZONTAL SCROLL)
                   ══════════════════════════════════════════════════════════ */}
                <div className="block md:hidden space-y-4">
                  {/* Mode switch & selector when 3+ universities */}
                  {compareUniversities.length > 2 && (
                    <div className="bg-[#FAF8F6] p-3 rounded-[18px] border border-[#E7E2DE] space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <span className="text-[12px] font-bold text-[#111111] whitespace-nowrap shrink-0">Mobile View:</span>
                        <div className="inline-flex items-center bg-white border border-[#E7E2DE] rounded-full p-1 text-[11px] font-bold shrink-0 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setMobileCompareMode('h2h')}
                            className={`px-2.5 sm:px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1 shrink-0 leading-none ${
                              mobileCompareMode === 'h2h'
                                ? 'bg-[#690B1B] text-white shadow-xs'
                                : 'text-[#666666] hover:text-[#111111]'
                            }`}
                          >
                            <span>⚡ Head-to-Head</span>
                            <span className={mobileCompareMode === 'h2h' ? 'text-white/80 text-[10.5px]' : 'text-[#888888] text-[10.5px]'}>
                              (2)
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMobileCompareMode('stacked')}
                            className={`px-2.5 sm:px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1 shrink-0 leading-none ${
                              mobileCompareMode === 'stacked'
                                ? 'bg-[#690B1B] text-white shadow-xs'
                                : 'text-[#666666]'
                            }`}
                          >
                            <span>📋 Stacked</span>
                            <span className={mobileCompareMode === 'stacked' ? 'text-white/80 text-[10.5px]' : 'text-[#888888] text-[10.5px]'}>
                              ({compareUniversities.length})
                            </span>
                          </button>
                        </div>
                      </div>

                      {mobileCompareMode === 'h2h' && (
                        <div className="grid grid-cols-2 gap-2 text-[11.5px] pt-1 border-t border-[#EAE6E2]">
                          <div>
                            <label className="block text-[10.5px] font-bold text-[#777777] mb-1">College A:</label>
                            <select
                              value={mobileH2HIndices[0]}
                              onChange={(e) => {
                                const newIdx = Number(e.target.value);
                                setMobileH2HIndices([newIdx, newIdx === mobileH2HIndices[1] ? (newIdx + 1) % compareUniversities.length : mobileH2HIndices[1]]);
                              }}
                              className="w-full bg-white border border-[#E7E2DE] rounded-[10px] px-2 py-1.5 font-bold text-[#111111] text-[11px] truncate"
                            >
                              {compareUniversities.map((item, idx) => (
                                <option key={item.university.id} value={idx}>
                                  {item.university.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10.5px] font-bold text-[#777777] mb-1">College B:</label>
                            <select
                              value={mobileH2HIndices[1]}
                              onChange={(e) => {
                                const newIdx = Number(e.target.value);
                                setMobileH2HIndices([newIdx === mobileH2HIndices[0] ? (newIdx + 1) % compareUniversities.length : mobileH2HIndices[0], newIdx]);
                              }}
                              className="w-full bg-white border border-[#E7E2DE] rounded-[10px] px-2 py-1.5 font-bold text-[#111111] text-[11px] truncate"
                            >
                              {compareUniversities.map((item, idx) => (
                                <option key={item.university.id} value={idx}>
                                  {item.university.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ─── SINGLE COLLEGE VIEW (IF ONLY 1 SELECTED) ─── */}
                  {compareUniversities.length === 1 && (
                    <div className="bg-white rounded-[20px] border border-[#E7E2DE] p-4 shadow-xs space-y-4">
                      <div className="flex items-start justify-between gap-2 border-b border-[#F0EBE6] pb-3">
                        <div>
                          <div className="text-[11px] font-extrabold uppercase text-[#C9A55D]">
                            {compareUniversities[0].university.state}, USA
                          </div>
                          <h4 className="text-[16px] font-black text-[#111111]">
                            {compareUniversities[0].university.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => toggleCompare(compareUniversities[0].university)}
                          className="p-1.5 rounded-full hover:bg-red-50 text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="bg-[#FAF8F6] p-3.5 rounded-[16px] border border-[#E7E2DE] space-y-1">
                        <div className="text-[11px] font-bold text-[#777777] uppercase">Your Estimated Net Price</div>
                        <div className="text-[24px] font-black text-[#690B1B]">
                          {formatMoney(compareUniversities[0].calc.netPrice)}
                          <span className="text-[12px] font-bold text-[#666666]">/yr</span>
                        </div>
                        <div className="text-[11px] text-green-700 font-bold">
                          🎉 Save {formatMoney(compareUniversities[0].savings)} ({compareUniversities[0].savingsPercent.toFixed(0)}% Off Published Cost)
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[12px]">
                        <div className="p-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#F0EBE6]">
                          <div className="text-[#888888] text-[10.5px] font-bold">Published COA</div>
                          <div className="font-bold text-[#111111]">{formatMoney(compareUniversities[0].sticker)}</div>
                        </div>
                        <div className="p-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#F0EBE6]">
                          <div className="text-[#888888] text-[10.5px] font-bold">Need Aid (Est.)</div>
                          <div className="font-bold text-green-700">{formatMoney(compareUniversities[0].calc.estimatedNeedBasedAid)}</div>
                        </div>
                        <div className="p-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#F0EBE6]">
                          <div className="text-[#888888] text-[10.5px] font-bold">Acceptance Rate</div>
                          <div className="font-bold text-[#111111]">{compareUniversities[0].university.acceptanceRate}%</div>
                        </div>
                        <div className="p-2.5 rounded-[12px] bg-[#FAF8F6] border border-[#F0EBE6]">
                          <div className="text-[#888888] text-[10.5px] font-bold">Avg High School GPA</div>
                          <div className="font-bold text-[#111111]">{compareUniversities[0].university.avgGPA ? `${compareUniversities[0].university.avgGPA.toFixed(2)} / 4.0` : '3.50+'}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="w-full py-2.5 rounded-full bg-[#690B1B] text-white font-bold text-[12px] hover:bg-[#7A1022] transition-colors"
                      >
                        + Add Another College to Compare Side-by-Side
                      </button>
                    </div>
                  )}

                  {/* ─── 2-COLLEGE HEAD-TO-HEAD VIEW (50% / 50% NO HORIZONTAL SCROLL) ─── */}
                  {compareUniversities.length >= 2 && (compareUniversities.length === 2 || mobileCompareMode === 'h2h') && (() => {
                    const uA = compareUniversities[mobileH2HIndices[0]] || compareUniversities[0];
                    const uB = compareUniversities[mobileH2HIndices[1]] || compareUniversities[1];
                    const lowerPriceCol = uA.calc.netPrice <= uB.calc.netPrice ? 'A' : 'B';

                    return (
                      <div className="space-y-3 bg-white rounded-[20px] border border-[#E7E2DE] p-3.5 sm:p-4 shadow-xs">
                        {/* College Names Header (2 columns 50/50) */}
                        <div className="grid grid-cols-2 gap-2 border-b border-[#F0EBE6] pb-3">
                          <div className="space-y-1 relative pr-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#C9A55D] truncate">
                                {uA.university.state}, USA
                              </span>
                              <button
                                onClick={() => toggleCompare(uA.university)}
                                className="text-red-500 hover:text-red-700 p-0.5"
                                title="Remove"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <h4 className="text-[13.5px] font-black text-[#111111] leading-tight line-clamp-2 min-h-[34px]">
                              {uA.university.name}
                            </h4>
                            <div className="text-[10px] font-semibold text-[#888888]">
                              Published COA: {formatMoney(uA.sticker)}
                            </div>
                          </div>

                          <div className="space-y-1 pl-1 border-l border-[#F0EBE6]">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#C9A55D] truncate">
                                {uB.university.state}, USA
                              </span>
                              <button
                                onClick={() => toggleCompare(uB.university)}
                                className="text-red-500 hover:text-red-700 p-0.5"
                                title="Remove"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <h4 className="text-[13.5px] font-black text-[#111111] leading-tight line-clamp-2 min-h-[34px]">
                              {uB.university.name}
                            </h4>
                            <div className="text-[10px] font-semibold text-[#888888]">
                              Published COA: {formatMoney(uB.sticker)}
                            </div>
                          </div>
                        </div>

                        {/* SECTION 1: NET PRICE & SAVINGS */}
                        <div className="space-y-2">
                          <div className="px-2.5 py-1 rounded-[8px] bg-[#690B1B]/5 text-[#690B1B] text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                            <DollarSign size={12} />
                            <span>Estimated Net Price / yr</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className={`p-2.5 rounded-[14px] border ${lowerPriceCol === 'A' ? 'bg-[#FDF6F7] border-[#690B1B]/30 shadow-2xs' : 'bg-[#FAF8F6] border-[#E7E2DE]'}`}>
                              <div className="text-[18px] font-black text-[#690B1B] leading-tight">
                                {formatMoney(uA.calc.netPrice)}
                                <span className="text-[10.5px] font-semibold text-[#777777]">/yr</span>
                              </div>
                              {lowerPriceCol === 'A' && (
                                <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-[#690B1B] text-white text-[9.5px] font-bold">
                                  ✓ Lower Net Cost
                                </span>
                              )}
                              <div className="text-[10.5px] text-green-700 font-bold mt-1">
                                Save {formatMoney(uA.savings)} ({uA.savingsPercent.toFixed(0)}%)
                              </div>
                            </div>

                            <div className={`p-2.5 rounded-[14px] border ${lowerPriceCol === 'B' ? 'bg-[#FDF6F7] border-[#690B1B]/30 shadow-2xs' : 'bg-[#FAF8F6] border-[#E7E2DE]'}`}>
                              <div className="text-[18px] font-black text-[#690B1B] leading-tight">
                                {formatMoney(uB.calc.netPrice)}
                                <span className="text-[10.5px] font-semibold text-[#777777]">/yr</span>
                              </div>
                              {lowerPriceCol === 'B' && (
                                <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-[#690B1B] text-white text-[9.5px] font-bold">
                                  ✓ Lower Net Cost
                                </span>
                              )}
                              <div className="text-[10.5px] text-green-700 font-bold mt-1">
                                Save {formatMoney(uB.savings)} ({uB.savingsPercent.toFixed(0)}%)
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 2: COST BREAKDOWN */}
                        <div className="space-y-2 pt-2 border-t border-[#F0EBE6]">
                          <div className="px-2.5 py-1 rounded-[8px] bg-[#FAF8F6] text-[#666666] text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 size={12} />
                            <span>Published Cost Breakdown</span>
                          </div>

                          <div className="space-y-1.5 text-[12px]">
                            {/* Tuition */}
                            <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                              <div className="text-[10.5px] font-bold text-[#888888] mb-0.5">Published Tuition & Fees</div>
                              <div className="grid grid-cols-2 gap-2 font-bold text-[#111111]">
                                <div>{formatMoney(uA.calc.tuition)}</div>
                                <div className="border-l border-[#EAE6E2] pl-2">{formatMoney(uB.calc.tuition)}</div>
                              </div>
                            </div>

                            {/* Housing & Food */}
                            <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                              <div className="text-[10.5px] font-bold text-[#888888] mb-0.5">Housing & Living Costs</div>
                              <div className="grid grid-cols-2 gap-2 font-bold text-[#111111]">
                                <div>{formatMoney(uA.calc.livingCosts)}</div>
                                <div className="border-l border-[#EAE6E2] pl-2">{formatMoney(uB.calc.livingCosts)}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 3: GRANTS & AID */}
                        <div className="space-y-2 pt-2 border-t border-[#F0EBE6]">
                          <div className="px-2.5 py-1 rounded-[8px] bg-green-50 text-green-800 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                            <Award size={12} />
                            <span>Grants & Scholarships</span>
                          </div>

                          <div className="space-y-1.5 text-[12px]">
                            {/* Need Based Aid */}
                            <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                              <div className="text-[10.5px] font-bold text-[#888888] mb-0.5">Need-Based Aid (Est.)</div>
                              <div className="grid grid-cols-2 gap-2 font-bold text-green-700">
                                <div>{formatMoney(uA.calc.estimatedNeedBasedAid)}</div>
                                <div className="border-l border-[#EAE6E2] pl-2">{formatMoney(uB.calc.estimatedNeedBasedAid)}</div>
                              </div>
                            </div>

                            {/* Merit Scholarship */}
                            <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                              <div className="text-[10.5px] font-bold text-[#888888] mb-0.5">Academic Merit Aid</div>
                              <div className="grid grid-cols-2 gap-2 font-bold text-[#C9A55D]">
                                <div>
                                  {formatMoney(uA.calc.estimatedMeritAid)}
                                  <div className="text-[9.5px] font-medium text-[#777777]">Rating: {getMeritLevelLabel(uA.calc.meritLevel)}</div>
                                </div>
                                <div className="border-l border-[#EAE6E2] pl-2">
                                  {formatMoney(uB.calc.estimatedMeritAid)}
                                  <div className="text-[9.5px] font-medium text-[#777777]">Rating: {getMeritLevelLabel(uB.calc.meritLevel)}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 4: ADMISSION STATS */}
                        <div className="space-y-2 pt-2 border-t border-[#F0EBE6]">
                          <div className="px-2.5 py-1 rounded-[8px] bg-[#FAF8F6] text-[#666666] text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                            <GraduationCap size={12} />
                            <span>Admissions Profile</span>
                          </div>

                          <div className="space-y-1.5 text-[12px]">
                            <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                              <div className="text-[10.5px] font-bold text-[#888888] mb-0.5">Acceptance Rate</div>
                              <div className="grid grid-cols-2 gap-2 font-bold text-[#111111]">
                                <div>{uA.university.acceptanceRate}%</div>
                                <div className="border-l border-[#EAE6E2] pl-2">{uB.university.acceptanceRate}%</div>
                              </div>
                            </div>

                            <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                              <div className="text-[10.5px] font-bold text-[#888888] mb-0.5">Average GPA</div>
                              <div className="grid grid-cols-2 gap-2 font-bold text-[#111111]">
                                <div>{uA.university.avgGPA ? `${uA.university.avgGPA.toFixed(2)} / 4.0` : '3.50+'}</div>
                                <div className="border-l border-[#EAE6E2] pl-2">{uB.university.avgGPA ? `${uB.university.avgGPA.toFixed(2)} / 4.0` : '3.50+'}</div>
                              </div>
                            </div>

                            <div className="bg-[#FAF8F6] p-2 rounded-[12px]">
                              <div className="text-[10.5px] font-bold text-[#888888] mb-0.5">Median SAT Range</div>
                              <div className="grid grid-cols-2 gap-2 font-bold text-[#111111]">
                                <div className="text-[11px]">{uA.university.satScore.min > 0 ? `${uA.university.satScore.min} – ${uA.university.satScore.max}` : 'Test-Optional'}</div>
                                <div className="border-l border-[#EAE6E2] pl-2 text-[11px]">{uB.university.satScore.min > 0 ? `${uB.university.satScore.min} – ${uB.university.satScore.max}` : 'Test-Optional'}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 5: ACTIONS */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EBE6]">
                          <button
                            onClick={() => openUniDetail(uA.university)}
                            className="py-2 px-2 rounded-[12px] bg-[#690B1B] text-white text-[11px] font-bold hover:bg-[#7A1022] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Breakdown</span>
                            <ArrowRight size={11} />
                          </button>
                          <button
                            onClick={() => openUniDetail(uB.university)}
                            className="py-2 px-2 rounded-[12px] bg-[#690B1B] text-white text-[11px] font-bold hover:bg-[#7A1022] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Breakdown</span>
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ─── STACKED CARDS VIEW (FOR 3+ COLLEGES) ─── */}
                  {compareUniversities.length > 2 && mobileCompareMode === 'stacked' && (
                    <div className="space-y-3">
                      {compareUniversities.map((item, idx) => (
                        <div key={item.university.id} className="bg-white rounded-[20px] border border-[#E7E2DE] p-4 shadow-xs space-y-3">
                          <div className="flex items-start justify-between gap-2 border-b border-[#F0EBE6] pb-2.5">
                            <div>
                              <div className="text-[10.5px] font-extrabold uppercase text-[#C9A55D]">
                                #{idx + 1} • {item.university.state}, USA
                              </div>
                              <h4 className="text-[15px] font-black text-[#111111] leading-snug">
                                {item.university.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => toggleCompare(item.university)}
                              className="p-1 rounded-full text-red-500 hover:bg-red-50"
                            >
                              <X size={15} />
                            </button>
                          </div>

                          <div className="bg-[#FAF8F6] p-3 rounded-[14px] border border-[#E7E2DE] flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-bold text-[#777777] uppercase">Net Price / yr</div>
                              <div className="text-[20px] font-black text-[#690B1B]">
                                {formatMoney(item.calc.netPrice)}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10.5px] font-bold">
                                Save {formatMoney(item.savings)}
                              </span>
                              <div className="text-[10px] text-[#777777] mt-0.5">
                                Published COA: {formatMoney(item.sticker)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                            <div className="p-2 rounded-[10px] bg-[#FAF8F6]">
                              <div className="text-[#888888] text-[9.5px]">Need Aid</div>
                              <div className="font-bold text-green-700">{formatMoney(item.calc.estimatedNeedBasedAid)}</div>
                            </div>
                            <div className="p-2 rounded-[10px] bg-[#FAF8F6]">
                              <div className="text-[#888888] text-[9.5px]">Acceptance</div>
                              <div className="font-bold text-[#111111]">{item.university.acceptanceRate}%</div>
                            </div>
                            <div className="p-2 rounded-[10px] bg-[#FAF8F6]">
                              <div className="text-[#888888] text-[9.5px]">Avg GPA</div>
                              <div className="font-bold text-[#111111]">{item.university.avgGPA ? item.university.avgGPA.toFixed(2) : '3.50'}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => openUniDetail(item.university)}
                            className="w-full py-2 rounded-[12px] bg-[#690B1B] text-white text-[11.5px] font-bold hover:bg-[#7A1022] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>View Full Breakdown</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
           STICKY COMPARE FLOATING BAR (WHEN 1+ SELECTED) - ELEVATED ABOVE MOBILE NAV
           ═══════════════════════════════════════════════════════════════ */}
        {selectedForCompare.length > 0 && activeTab === 'catalog' && (
          <div className="fixed bottom-[72px] sm:bottom-[76px] md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/15 flex items-center justify-between gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-5 w-[calc(100%-32px)] max-w-sm sm:max-w-md">
            <div className="flex items-center gap-2 text-[12px] sm:text-[12.5px] truncate">
              <Layers size={15} className="text-[#C9A55D] shrink-0" />
              <span className="font-semibold truncate">
                <strong className="text-[#C9A55D]">{selectedForCompare.length}</strong> of 4 schools in Compare
              </span>
            </div>
            <button
              onClick={() => {
                setActiveTab('compare');
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={selectedForCompare.length < 2}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full font-bold text-[11.5px] sm:text-[12px] whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedForCompare.length >= 2
                  ? 'bg-[#690B1B] text-white hover:bg-[#7A1022] shadow-xs'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              Compare Now →
            </button>
          </div>
        )}
      </>
    )}
  </div>
);
}

export default function NetPriceCalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-3 border-[#690B1B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-[13px] font-bold text-[#888888]">Loading Net Price Calculator...</div>
        </div>
      }
    >
      <NetPriceCalculatorContent />
    </Suspense>
  );
}
