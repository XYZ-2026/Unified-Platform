'use client';

import { useState, useMemo } from 'react';
import type { GermanyUniversity } from '@/app/country/germany/page';

/* ══════════════════════════════════════════════════════════════
   HELPERS & BADGES
══════════════════════════════════════════════════════════════ */
function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'default';
}) {
  const styles: Record<string, string> = {
    green: 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]',
    blue: 'bg-[#EFF5FF] text-[#1565C0] border-[#90CAF9]',
    red: 'bg-[#FDF0F2] text-[#690B1B] border-[#F0C9D0]',
    yellow: 'bg-[#FFF8E6] text-[#B45309] border-[#FFCC80]',
    purple: 'bg-[#F3E5F5] text-[#6A1B9A] border-[#CE93D8]',
    default: 'bg-[#F6F4F2] text-[#444] border-[#E7E2DE]',
  };
  return (
    <span className={`inline-flex items-center text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styles[variant]}`}>
      {children}
    </span>
  );
}

function StatusIndicator({ value }: { value: string }) {
  const lower = (value || '').toLowerCase();
  if (lower.startsWith('yes') || lower.includes('mandatory') || lower.includes('required')) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#2E7D32] font-bold text-[12px]">
        <span className="w-2 h-2 rounded-full bg-[#2E7D32] shrink-0" />
        {value}
      </span>
    );
  }
  if (lower.startsWith('no') || lower.includes('n/a') || lower.includes('not required') || lower.includes('none')) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#888888] font-semibold text-[12px]">
        <span className="w-2 h-2 rounded-full bg-[#D1D5DB] shrink-0" />
        {value}
      </span>
    );
  }
  return <span className="text-[#333333] text-[12px] font-medium leading-relaxed">{value}</span>;
}

function FieldBox({
  columnNumber,
  label,
  children,
  className = '',
}: {
  columnNumber: number;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-3 sm:p-3.5 rounded-[12px] bg-[#FAF8F6] border border-[#EBE6E0] hover:border-[#690B1B]/30 transition-colors ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#888888]">
          {label}
        </span>
        <span className="text-[9px] font-black text-[#A0988E] bg-[#EFECE8] px-1.5 py-0.2 rounded">
          #{columnNumber}
        </span>
      </div>
      <div className="text-[12px] sm:text-[13px] text-[#111111] leading-relaxed break-words">
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function GermanyAdmissionsTable({ universities }: { universities: GermanyUniversity[] }) {
  // View mode
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  // Card Expansion
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'Universität Heidelberg': true, // Keep Heidelberg open by default as requested reference
  });
  // Active Category Tab inside cards: 'all' | 'academic' | 'application' | 'costs' | 'language' | 'india'
  const [activeTabByCard, setActiveTabByCard] = useState<Record<string, string>>({});

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [uniTypeFilter, setUniTypeFilter] = useState<'All' | 'Public' | 'Private'>('All');
  const [ncFilter, setNcFilter] = useState<'All' | 'NC Restricted' | 'Open Admission'>('All');
  const [bwFeeFilter, setBwFeeFilter] = useState<'All' | 'BW Tuition' | 'Tuition Free'>('All');

  // Modal deep dive
  const [selectedUniModal, setSelectedUniModal] = useState<GermanyUniversity | null>(null);

  // Comparison tray
  const [compareList, setCompareList] = useState<GermanyUniversity[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Copy notification
  const [copiedName, setCopiedName] = useState<string | null>(null);

  // Extract unique federal states for filter pills
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(universities.map((u) => u.federalState).filter(Boolean)));
    return ['All', ...states.sort()];
  }, [universities]);

  // Filtered universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = u.universityName.toLowerCase().includes(q);
        const matchesCity = u.city.toLowerCase().includes(q);
        const matchesState = u.federalState.toLowerCase().includes(q);
        const matchesNc = u.ncGradeCutoff.toLowerCase().includes(q);
        const matchesIndian = u.indianQualificationEquivalency.toLowerCase().includes(q);
        const matchesGerman = u.germanLanguageRequirement.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesState && !matchesNc && !matchesIndian && !matchesGerman) {
          return false;
        }
      }

      // State filter
      if (selectedState !== 'All' && u.federalState !== selectedState) {
        return false;
      }

      // University Type
      if (uniTypeFilter !== 'All' && u.universityType !== uniTypeFilter) {
        return false;
      }

      // NC Filter
      if (ncFilter === 'NC Restricted') {
        const isNc = u.ncNumerusClausus.toLowerCase().startsWith('yes');
        if (!isNc) return false;
      } else if (ncFilter === 'Open Admission') {
        const isNc = u.ncNumerusClausus.toLowerCase().startsWith('yes');
        if (isNc) return false;
      }

      // BW Fee Filter
      if (bwFeeFilter === 'BW Tuition') {
        if (!u.bwTuitionFee.toLowerCase().startsWith('yes')) return false;
      } else if (bwFeeFilter === 'Tuition Free') {
        if (u.bwTuitionFee.toLowerCase().startsWith('yes')) return false;
      }

      return true;
    });
  }, [universities, searchQuery, selectedState, uniTypeFilter, ncFilter, bwFeeFilter]);

  const toggleExpand = (name: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const setCardTab = (name: string, tab: string) => {
    setActiveTabByCard((prev) => ({
      ...prev,
      [name]: tab,
    }));
  };

  const toggleCompare = (uni: GermanyUniversity) => {
    if (compareList.some((c) => c.universityName === uni.universityName)) {
      setCompareList((prev) => prev.filter((c) => c.universityName !== uni.universityName));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 universities at a time.');
        return;
      }
      setCompareList((prev) => [...prev, uni]);
    }
  };

  const handleCopyProfile = (uni: GermanyUniversity) => {
    const text = `
🇩🇪 GERMAN UNIVERSITY ADMISSION PROFILE: ${uni.universityName}
─────────────────────────────────────────────────
1. University Name: ${uni.universityName}
2. City: ${uni.city}
3. Institution Type: ${uni.institutionType}
4. University Type: ${uni.universityType}
5. Federal State: ${uni.federalState}
6. NC / Numerus Clausus: ${uni.ncNumerusClausus}
7. NC Grade / Cut-off: ${uni.ncGradeCutoff}
8. HZB Requirement: ${uni.hzb}
9. Studienkolleg Required: ${uni.studienkollegRequired}
10. APS Certificate Required: ${uni.apsCertificateRequired}
11. uni-assist Application: ${uni.uniAssistApplication}
12. Hochschulstart Application: ${uni.hochschulstartApplication}
13. Semester Contribution: ${uni.semesterContribution}
14. Semester Ticket: ${uni.semesterTicket}
15. Baden-Württemberg Tuition Fee: ${uni.bwTuitionFee}
16. ECTS Requirements: ${uni.ectsRequirements}
17. German Language Requirement: ${uni.germanLanguageRequirement}
18. TestDaF Requirement: ${uni.testDaF}
19. DSH Requirement: ${uni.dsh}
20. Blocked Account (Proof of Funds): ${uni.blockedAccountProofOfFunds}
21. Winter Semester: ${uni.winterSemester}
22. Summer Semester: ${uni.summerSemester}
23. Indian Qualification Equivalency: ${uni.indianQualificationEquivalency}
24. Anabin Recognition: ${uni.anabinRecognition}
25. Country-Specific Requirements: ${uni.countrySpecificRequirements}
Official Website: ${uni.website}
─────────────────────────────────────────────────
Abroad Simplified 2026 Germany Admissions Guide
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedName(uni.universityName);
    setTimeout(() => setCopiedName(null), 2500);
  };

  return (
    <section id="admissions-table" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F6F4F2]">
      <div className="max-w-7xl mx-auto">

        {/* ══ SECTION HEADER ══════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A55D]" />
              Official 25-Parameter Admissions Matrix
            </div>
            <h2 className="text-[26px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111111] leading-tight">
              German Universities Admissions Dataset
            </h2>
            <p className="text-[#666666] text-[13px] sm:text-[15px] mt-2 max-w-[760px] leading-relaxed">
              Every university verified against all <strong>25 admission parameters</strong>: Numerus Clausus (NC), HZB equivalency, Studienkolleg, APS certificate, uni-assist, Hochschulstart, semester tickets, Baden-Württemberg fees, blocked account (€11,904), and Indian degree recognition.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-[#E0DCD7] shadow-xs self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-[#690B1B] text-white shadow-xs'
                  : 'text-[#555] hover:text-[#111] hover:bg-[#FAF8F5]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dossier Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-[#690B1B] text-white shadow-xs'
                  : 'text-[#555] hover:text-[#111] hover:bg-[#FAF8F5]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Full 25-Column Matrix
            </button>
          </div>
        </div>

        {/* ══ SEARCH & FILTER BAR ═════════════════════════════════════ */}
        <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-6 mb-6 shadow-xs">
          {/* Top row: Search input + dropdown filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <svg className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search university, city, state, NC cutoff, Indian degree..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] pl-10 pr-8 rounded-[12px] bg-[#FAF8F6] border border-[#E2DDD7] text-[13px] text-[#111] placeholder-[#888] focus:outline-none focus:border-[#690B1B] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#111] text-[14px]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* University Type Filter */}
            <div className="md:col-span-2">
              <select
                value={uniTypeFilter}
                onChange={(e) => setUniTypeFilter(e.target.value as any)}
                className="w-full h-[44px] px-3 rounded-[12px] bg-[#FAF8F6] border border-[#E2DDD7] text-[12px] sm:text-[13px] text-[#333] font-medium focus:outline-none focus:border-[#690B1B]"
              >
                <option value="All">All Types (Public & Private)</option>
                <option value="Public">Public Universities</option>
                <option value="Private">Private Universities</option>
              </select>
            </div>

            {/* NC Filter */}
            <div className="md:col-span-2">
              <select
                value={ncFilter}
                onChange={(e) => setNcFilter(e.target.value as any)}
                className="w-full h-[44px] px-3 rounded-[12px] bg-[#FAF8F6] border border-[#E2DDD7] text-[12px] sm:text-[13px] text-[#333] font-medium focus:outline-none focus:border-[#690B1B]"
              >
                <option value="All">NC Restriction: All</option>
                <option value="NC Restricted">Has NC (Restricted)</option>
                <option value="Open Admission">NC-Free (Open Admission)</option>
              </select>
            </div>

            {/* Baden-Württemberg Fee Filter */}
            <div className="md:col-span-3">
              <select
                value={bwFeeFilter}
                onChange={(e) => setBwFeeFilter(e.target.value as any)}
                className="w-full h-[44px] px-3 rounded-[12px] bg-[#FAF8F6] border border-[#E2DDD7] text-[12px] sm:text-[13px] text-[#333] font-medium focus:outline-none focus:border-[#690B1B]"
              >
                <option value="All">Tuition State: All 16 States</option>
                <option value="Tuition Free">€0 Tuition (15 States)</option>
                <option value="BW Tuition">Baden-Württemberg (€1,500/sem)</option>
              </select>
            </div>
          </div>

          {/* Federal State Filter Pills */}
          <div className="mt-4 pt-3.5 border-t border-[#F0EBE5] flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider shrink-0 mr-1">
              Federal State:
            </span>
            {availableStates.map((state) => (
              <button
                key={state}
                type="button"
                onClick={() => setSelectedState(state)}
                className={`h-[32px] px-3.5 rounded-full text-[11px] sm:text-[12px] font-bold transition-all shrink-0 border ${
                  selectedState === state
                    ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-2xs'
                    : 'bg-[#FAF8F6] text-[#555] border-[#E5E0D9] hover:border-[#690B1B]/40'
                }`}
              >
                {state}
              </button>
            ))}
          </div>

          {/* Active Filter Meta Bar */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#666]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#690B1B]">{filteredUniversities.length}</span> of{' '}
              <span>{universities.length} German Universities listed</span>
              {(searchQuery || selectedState !== 'All' || uniTypeFilter !== 'All' || ncFilter !== 'All' || bwFeeFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedState('All');
                    setUniTypeFilter('All');
                    setNcFilter('All');
                    setBwFeeFilter('All');
                  }}
                  className="text-[#690B1B] underline hover:text-[#8B1020] font-bold ml-2 cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Quick indicators */}
            <div className="hidden sm:flex items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#2E7D32]">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                APS Mandatory for India
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-[#1565C0]">
                <span className="w-2 h-2 rounded-full bg-[#1565C0]" />
                Blocked Account €11,904/yr
              </span>
            </div>
          </div>
        </div>

        {/* ══ DOSSIER CARDS VIEW (DEFAULT) ════════════════════════════ */}
        {viewMode === 'cards' && (
          <div className="space-y-5">
            {filteredUniversities.length === 0 ? (
              <div className="bg-white border border-[#E7E2DE] rounded-[18px] p-10 text-center">
                <div className="text-[32px] mb-2">🔍</div>
                <h3 className="text-[17px] font-bold text-[#111]">No universities found</h3>
                <p className="text-[13px] text-[#777] mt-1 mb-4">Try clearing your filters or search keywords.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedState('All');
                    setUniTypeFilter('All');
                    setNcFilter('All');
                    setBwFeeFilter('All');
                  }}
                  className="px-5 py-2 rounded-full bg-[#690B1B] text-white text-[12px] font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredUniversities.map((uni) => {
                const isExpanded = !!expandedCards[uni.universityName];
                const activeTab = activeTabByCard[uni.universityName] || 'academic';
                const isCompared = compareList.some((c) => c.universityName === uni.universityName);

                return (
                  <div
                    key={uni.universityName}
                    className={`bg-white border rounded-[20px] overflow-hidden transition-all duration-200 ${
                      isExpanded
                        ? 'border-[#690B1B]/40 shadow-md ring-1 ring-[#690B1B]/10'
                        : 'border-[#E7E2DE] hover:border-[#690B1B]/30 hover:shadow-xs'
                    }`}
                  >
                    {/* ── CARD HEADER ── */}
                    <div
                      className="p-5 sm:p-6 cursor-pointer select-none"
                      onClick={() => toggleExpand(uni.universityName)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Title & Key Badges */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-[14px] bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-center shrink-0 text-[#690B1B] shadow-2xs">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-5.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <h3 className="text-[17px] sm:text-[19px] font-bold text-[#111111] leading-snug">
                                {uni.universityName}
                              </h3>
                              <span className="text-[10px] font-black text-[#690B1B] bg-[#FDF0F2] border border-[#F0C9D0] px-2 py-0.5 rounded-md shrink-0">
                                {uni.ranking}
                              </span>
                              <Badge variant={uni.universityType === 'Public' ? 'blue' : 'yellow'}>
                                {uni.universityType}
                              </Badge>
                              {uni.federalState === 'Baden-Württemberg' ? (
                                <Badge variant="yellow">BW State (€1,500/sem)</Badge>
                              ) : (
                                <Badge variant="green">€0 Tuition State</Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#777777]">
                              <span className="flex items-center gap-1 font-medium text-[#444]">
                                <svg className="w-3.5 h-3.5 text-[#690B1B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {uni.city}, {uni.federalState}
                              </span>
                              <span>•</span>
                              <span>{uni.institutionType}</span>
                              <span>•</span>
                              <span className="text-[#2E7D32] font-semibold">Anabin: H+ Recognized</span>
                            </div>
                          </div>
                        </div>

                        {/* Summary metric chips & Actions (Responsive for Mobile & Tablet) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-3 mt-3 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F0ECE7] w-full lg:w-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto">
                            <div className="text-center bg-[#FAF8F5] border border-[#EAE5DF] rounded-[12px] px-2.5 sm:px-3 py-1.5 sm:py-2">
                              <div className="text-[9px] text-[#888] uppercase font-bold tracking-wider mb-0.5">NC Grade</div>
                              <div className="text-[11.5px] sm:text-[12px] font-bold text-[#690B1B] truncate" title={uni.ncGradeCutoff}>
                                {uni.ncGradeCutoff.split(';')[0]}
                              </div>
                            </div>

                            <div className="text-center bg-[#FAF8F5] border border-[#EAE5DF] rounded-[12px] px-2.5 sm:px-3 py-1.5 sm:py-2">
                              <div className="text-[9px] text-[#888] uppercase font-bold tracking-wider mb-0.5">Sem. Fee</div>
                              <div className="text-[11.5px] sm:text-[12px] font-bold text-[#111] truncate">{uni.semesterContribution}</div>
                            </div>

                            <div className="text-center bg-[#FAF8F5] border border-[#EAE5DF] rounded-[12px] px-2.5 sm:px-3 py-1.5 sm:py-2">
                              <div className="text-[9px] text-[#888] uppercase font-bold tracking-wider mb-0.5">APS India</div>
                              <div className="text-[11.5px] sm:text-[12px] font-bold text-[#2E7D32]">Mandatory</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                            {/* Compare toggle */}
                            <button
                              type="button"
                              onClick={() => toggleCompare(uni)}
                              className={`h-[36px] px-3.5 rounded-[10px] text-[11px] font-bold transition-all border shrink-0 flex items-center gap-1.5 flex-1 sm:flex-initial justify-center ${
                                isCompared
                                  ? 'bg-[#690B1B] text-white border-[#690B1B]'
                                  : 'bg-white text-[#555] border-[#E0DCD7] hover:border-[#690B1B]'
                              }`}
                              title="Add to comparison drawer"
                            >
                              {isCompared ? '✓ Compared' : '+ Compare'}
                            </button>

                            {/* Expand chevron button */}
                            <button
                              type="button"
                              onClick={() => toggleExpand(uni.universityName)}
                              className={`h-[36px] px-3.5 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-full border border-[#E2DDD7] flex items-center justify-center transition-all shrink-0 gap-1 text-[11px] font-bold ${
                                isExpanded ? 'bg-[#690B1B] text-white border-[#690B1B]' : 'bg-white text-[#690B1B] hover:bg-[#FDF0F2]'
                              }`}
                              aria-label={isExpanded ? 'Collapse admission dossier' : 'Expand admission dossier'}
                            >
                              <span className="sm:hidden">{isExpanded ? 'Hide' : 'Details'}</span>
                              <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── EXPANDED 25-COLUMN DOSSIER ── */}
                    {isExpanded && (
                      <div className="border-t border-[#EAE5DF] bg-[#FCFBF9]">
                        {/* Category Nav Tabs inside card */}
                        <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-[#EAE5DF] bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                          {[
                            { id: 'academic', label: '🎓 Academics & NC (#6–#9, #16)' },
                            { id: 'application', label: '📝 Application & Portals (#10–#12, #21–#22)' },
                            { id: 'costs', label: '💰 Fees & Living (#13–#15, #20)' },
                            { id: 'language', label: '🗣️ Language (#17–#19)' },
                            { id: 'india', label: '🇮🇳 Indian Student Rules (#23–#25)' },
                            { id: 'all', label: 'All 25 Parameters' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setCardTab(uni.universityName, t.id)}
                              className={`h-[34px] px-3.5 rounded-lg text-[11px] sm:text-[12px] font-bold transition-all shrink-0 ${
                                activeTab === t.id
                                  ? 'bg-[#690B1B] text-white shadow-2xs'
                                  : 'text-[#666] hover:text-[#111] hover:bg-[#F7F4F0]'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>

                        {/* Content area */}
                        <div className="p-5 sm:p-6 space-y-6">

                          {/* 1. ACADEMICS & NC GROUP */}
                          {(activeTab === 'academic' || activeTab === 'all') && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Academic & Admission Standards (Columns #6 to #9, #16)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <FieldBox columnNumber={6} label="NC / Numerus Clausus">
                                  <StatusIndicator value={uni.ncNumerusClausus} />
                                </FieldBox>

                                <FieldBox columnNumber={7} label="NC Grade / Cut-off">
                                  <span className="font-bold text-[#690B1B]">{uni.ncGradeCutoff}</span>
                                </FieldBox>

                                <FieldBox columnNumber={8} label="HZB / University Entrance">
                                  <span>{uni.hzb}</span>
                                </FieldBox>

                                <FieldBox columnNumber={9} label="Studienkolleg Required">
                                  <StatusIndicator value={uni.studienkollegRequired} />
                                </FieldBox>

                                <FieldBox columnNumber={16} label="ECTS Requirements" className="md:col-span-2">
                                  <span className="font-medium">{uni.ectsRequirements}</span>
                                </FieldBox>
                              </div>
                            </div>
                          )}

                          {/* 2. APPLICATION & PORTALS */}
                          {(activeTab === 'application' || activeTab === 'all') && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Application Channels & Deadlines (Columns #10 to #12, #21 to #22)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <FieldBox columnNumber={10} label="APS Certificate Required">
                                  <StatusIndicator value={uni.apsCertificateRequired} />
                                </FieldBox>

                                <FieldBox columnNumber={11} label="uni-assist Application">
                                  <StatusIndicator value={uni.uniAssistApplication} />
                                </FieldBox>

                                <FieldBox columnNumber={12} label="Hochschulstart Application">
                                  <StatusIndicator value={uni.hochschulstartApplication} />
                                </FieldBox>

                                <FieldBox columnNumber={21} label="Winter Semester (Main Intake)">
                                  <span className="font-medium text-[#111]">{uni.winterSemester}</span>
                                </FieldBox>

                                <FieldBox columnNumber={22} label="Summer Semester (Secondary Intake)">
                                  <span className="font-medium text-[#111]">{uni.summerSemester}</span>
                                </FieldBox>

                                <FieldBox columnNumber={3} label="Institution Type">
                                  <Badge variant="blue">{uni.institutionType}</Badge>
                                </FieldBox>
                              </div>
                            </div>
                          )}

                          {/* 3. FEES & FINANCIALS */}
                          {(activeTab === 'costs' || activeTab === 'all') && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Tuition, Contributions & Funds (Columns #13 to #15, #20)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <FieldBox columnNumber={13} label="Semester Contribution">
                                  <span className="font-bold text-[14px] text-[#111]">{uni.semesterContribution}</span>
                                </FieldBox>

                                <FieldBox columnNumber={14} label="Semester Ticket" className="md:col-span-2">
                                  <span>{uni.semesterTicket}</span>
                                </FieldBox>

                                <FieldBox columnNumber={15} label="Baden-Württemberg Tuition Fee">
                                  <span className={`font-bold ${uni.bwTuitionFee.toLowerCase().startsWith('yes') ? 'text-[#B45309]' : 'text-[#2E7D32]'}`}>
                                    {uni.bwTuitionFee}
                                  </span>
                                </FieldBox>

                                <FieldBox columnNumber={20} label="Blocked Account (Proof of Funds)" className="md:col-span-4 bg-[#EFF5FF]/60 border-[#BFDBFE]">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                      <span className="font-bold text-[14px] text-[#1565C0]">{uni.blockedAccountProofOfFunds}</span>
                                      <span className="text-[11px] text-[#1565C0]/80 block sm:inline sm:ml-2">
                                        (Mandatory German visa requirement: released monthly at €992/month)
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-white text-[#1565C0] px-2.5 py-1 rounded-md border border-[#BFDBFE] self-start sm:self-auto">
                                      Expatrio / Fintiba / Coracle
                                    </span>
                                  </div>
                                </FieldBox>
                              </div>
                            </div>
                          )}

                          {/* 4. LANGUAGE REQUIREMENTS */}
                          {(activeTab === 'language' || activeTab === 'all') && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Language Proficiency Criteria (Columns #17 to #19)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <FieldBox columnNumber={17} label="German Language Requirement" className="md:col-span-3">
                                  <span className="font-medium text-[#111]">{uni.germanLanguageRequirement}</span>
                                </FieldBox>

                                <FieldBox columnNumber={18} label="TestDaF Requirement">
                                  <span className="font-bold text-[#1565C0]">{uni.testDaF}</span>
                                </FieldBox>

                                <FieldBox columnNumber={19} label="DSH Score Requirement">
                                  <span className="font-bold text-[#1565C0]">{uni.dsh}</span>
                                </FieldBox>

                                <FieldBox columnNumber={1} label="University / Official Portal">
                                  <a
                                    href={uni.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#690B1B] font-bold hover:underline flex items-center gap-1"
                                  >
                                    Official Portal ↗
                                  </a>
                                </FieldBox>
                              </div>
                            </div>
                          )}

                          {/* 5. INDIAN STUDENT ROADMAP */}
                          {(activeTab === 'india' || activeTab === 'all') && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Indian Qualification & Country-Specific Rules (Columns #23 to #25)
                                </span>
                              </div>

                              <FieldBox columnNumber={23} label="Indian Qualification Equivalency" className="bg-[#FAF8F5]">
                                <p className="text-[#333] font-medium leading-relaxed">{uni.indianQualificationEquivalency}</p>
                              </FieldBox>

                              <FieldBox columnNumber={24} label="Anabin / Qualification Recognition">
                                <p className="text-[#333] leading-relaxed">{uni.anabinRecognition}</p>
                              </FieldBox>

                              <div className="p-4 rounded-[14px] bg-[#FFF8E6] border border-[#FFCC80]">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309] flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-[#B45309]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Column #25: Country-Specific Admission Requirements
                                  </span>
                                  <span className="text-[9px] font-black text-[#B45309] bg-white px-2 py-0.5 rounded">
                                    Mandatory Checklist
                                  </span>
                                </div>
                                <p className="text-[12px] sm:text-[13px] text-[#78350F] leading-relaxed font-medium">
                                  {uni.countrySpecificRequirements}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Card Footer Actions */}
                          <div className="pt-4 border-t border-[#EAE5DF] flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedUniModal(uni)}
                                className="h-[36px] px-4 rounded-[10px] bg-[#FAF8F6] border border-[#DCD6CE] text-[#333] text-[12px] font-bold hover:border-[#690B1B] hover:text-[#690B1B] transition-all flex items-center gap-1.5"
                              >
                                <span>📄 View Full 25-Point Dossier</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyProfile(uni)}
                                className="h-[36px] px-3.5 rounded-[10px] bg-[#FAF8F6] border border-[#DCD6CE] text-[#555] text-[12px] font-semibold hover:border-[#690B1B] hover:text-[#690B1B] transition-all"
                              >
                                {copiedName === uni.universityName ? '✓ Copied!' : '📋 Copy Profile'}
                              </button>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <a
                                href={uni.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-[36px] px-5 rounded-[10px] bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#7A1022] transition-all flex items-center gap-1.5 shadow-xs"
                              >
                                Visit University Portal ↗
                              </a>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ══ FULL 25-COLUMN MATRIX / TABLE VIEW ══════════════════════ */}
        {viewMode === 'table' && (
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#EAE5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] sm:text-[17px] font-bold text-[#111]">
                  Complete 25-Parameter Admissions Matrix
                </h3>
                <p className="text-[12px] text-[#777]">
                  Horizontal scrolling table comparing all dataset columns. Click any row for deep-dive.
                </p>
              </div>
              <div className="text-[11px] text-[#888] font-semibold flex items-center gap-1.5 shrink-0">
                <span>← Scroll horizontally to view all 25 columns →</span>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-[12px] text-left border-collapse min-w-[2800px]">
                <thead>
                  <tr className="bg-[#FAF8F6] text-[#444] border-b border-[#E7E2DE] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                    {/* Sticky Column 1: University */}
                    <th className="sticky left-0 z-20 bg-[#FAF8F6] py-3.5 px-4 shadow-[2px_0_5px_rgba(0,0,0,0.03)] min-w-[240px]">
                      #1 University Name
                    </th>
                    <th className="py-3.5 px-3 min-w-[120px]">#2 City</th>
                    <th className="py-3.5 px-3 min-w-[140px]">#3 Institution Type</th>
                    <th className="py-3.5 px-3 min-w-[110px]">#4 Type</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#5 Federal State</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#6 NC / Numerus Clausus</th>
                    <th className="py-3.5 px-3 min-w-[160px]">#7 NC Grade Cut-off</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#8 HZB Requirement</th>
                    <th className="py-3.5 px-3 min-w-[160px]">#9 Studienkolleg</th>
                    <th className="py-3.5 px-3 min-w-[140px]">#10 APS Certificate</th>
                    <th className="py-3.5 px-3 min-w-[140px]">#11 uni-assist</th>
                    <th className="py-3.5 px-3 min-w-[140px]">#12 Hochschulstart</th>
                    <th className="py-3.5 px-3 min-w-[130px]">#13 Semester Fee</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#14 Semester Ticket</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#15 BW Tuition Fee</th>
                    <th className="py-3.5 px-3 min-w-[160px]">#16 ECTS Required</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#17 German Language</th>
                    <th className="py-3.5 px-3 min-w-[140px]">#18 TestDaF</th>
                    <th className="py-3.5 px-3 min-w-[130px]">#19 DSH</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#20 Blocked Account</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#21 Winter Semester</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#22 Summer Semester</th>
                    <th className="py-3.5 px-3 min-w-[220px]">#23 Indian Equivalency</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#24 Anabin Status</th>
                    <th className="py-3.5 px-4 min-w-[250px]">#25 Country Requirements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DF]">
                  {filteredUniversities.map((uni) => (
                    <tr
                      key={uni.universityName}
                      onClick={() => setSelectedUniModal(uni)}
                      className="hover:bg-[#FAF8F8] transition-colors cursor-pointer group"
                    >
                      {/* Sticky Column 1 */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-[#FAF8F8] py-3.5 px-4 shadow-[2px_0_5px_rgba(0,0,0,0.03)] font-bold text-[#111]">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{uni.universityName}</span>
                          <span className="text-[9px] font-black text-[#690B1B] bg-[#FDF0F2] px-1.5 py-0.5 rounded shrink-0">
                            {uni.ranking}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-[#555]">{uni.city}</td>
                      <td className="py-3.5 px-3 text-[#555]">{uni.institutionType}</td>
                      <td className="py-3.5 px-3">
                        <Badge variant={uni.universityType === 'Public' ? 'blue' : 'yellow'}>
                          {uni.universityType}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#333]">{uni.federalState}</td>
                      <td className="py-3.5 px-3">
                        <StatusIndicator value={uni.ncNumerusClausus.split('–')[0].split('-')[0]} />
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#690B1B]">{uni.ncGradeCutoff}</td>
                      <td className="py-3.5 px-3 text-[#555] text-[11px] max-w-[180px] truncate" title={uni.hzb}>
                        {uni.hzb}
                      </td>
                      <td className="py-3.5 px-3 text-[11px]">
                        <StatusIndicator value={uni.studienkollegRequired.split('–')[0]} />
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#2E7D32]">Mandatory</td>
                      <td className="py-3.5 px-3 text-[11px]">{uni.uniAssistApplication.split('–')[0]}</td>
                      <td className="py-3.5 px-3 text-[11px]">{uni.hochschulstartApplication.split('–')[0]}</td>
                      <td className="py-3.5 px-3 font-bold text-[#111]">{uni.semesterContribution}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[180px] truncate" title={uni.semesterTicket}>
                        {uni.semesterTicket}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`font-semibold ${uni.bwTuitionFee.toLowerCase().startsWith('yes') ? 'text-[#B45309]' : 'text-[#2E7D32]'}`}>
                          {uni.bwTuitionFee.toLowerCase().startsWith('yes') ? '€1,500/sem' : '€0'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[11px]">{uni.ectsRequirements}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[180px] truncate" title={uni.germanLanguageRequirement}>
                        {uni.germanLanguageRequirement}
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#1565C0]">{uni.testDaF}</td>
                      <td className="py-3.5 px-3 font-medium text-[#1565C0]">{uni.dsh}</td>
                      <td className="py-3.5 px-3 font-bold text-[#1565C0]">€11,904/yr</td>
                      <td className="py-3.5 px-3 text-[11px]">{uni.winterSemester.split(';')[0]}</td>
                      <td className="py-3.5 px-3 text-[11px]">{uni.summerSemester.split(';')[0]}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[220px] truncate" title={uni.indianQualificationEquivalency}>
                        {uni.indianQualificationEquivalency}
                      </td>
                      <td className="py-3.5 px-3 text-[11px] font-semibold text-[#2E7D32]">H+ (Recognized)</td>
                      <td className="py-3.5 px-4 text-[11px] text-[#B45309] font-medium max-w-[250px] truncate" title={uni.countrySpecificRequirements}>
                        {uni.countrySpecificRequirements}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ 25 DATASET COLUMNS GLOSSARY & GUIDE ══════════════════════ */}
        <div className="mt-12 bg-white border border-[#E7E2DE] rounded-[20px] p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-[#C9A55D] text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
            Dataset Knowledge Base
          </div>
          <h3 className="text-[20px] sm:text-[24px] font-bold text-[#111] mb-2">
            The 25 German Admission Parameters Explained
          </h3>
          <p className="text-[13px] sm:text-[14px] text-[#777] mb-6 max-w-[720px]">
            To ensure zero confusion for Indian and international students, here is what each column in our dataset represents:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-[12px]">
            {[
              { col: '#1 University Name', def: 'Official institution title registered with the German HRK (Hochschulrektorenkonferenz).' },
              { col: '#2 City', def: 'German municipal location. Affects living cost and regional job opportunities.' },
              { col: '#3 Institution Type', def: 'University (Universitäten) vs Technical University (TU) vs UAS (Fachhochschulen).' },
              { col: '#4 Public / Private', def: 'Public universities are state-funded with €0 general tuition. Private charge tuition.' },
              { col: '#5 Federal State', def: 'One of the 16 Bundesländer. Determines state tuition fee laws and student transit passes.' },
              { col: '#6 NC / Numerus Clausus', def: 'Admission restriction based on GPA. Only top applicants within quota are admitted.' },
              { col: '#7 NC Grade / Cut-off', def: 'Historical cut-off on the German 1.0–4.0 scale (1.0 is highest/best; 4.0 is minimum pass).' },
              { col: '#8 HZB (Entrance Qualification)', def: 'Hochschulzugangsberechtigung — legal qualification required to enter German universities.' },
              { col: '#9 Studienkolleg Required', def: '1-year preparatory foundation course needed if secondary diploma does not directly equal the Abitur.' },
              { col: '#10 APS Certificate Required', def: 'Academic Evaluation Centre verification — mandatory for Indian, Chinese, and Vietnamese students.' },
              { col: '#11 uni-assist Application', def: 'Centralized portal used by ~180 German universities to verify international certificates (VPD).' },
              { col: '#12 Hochschulstart', def: 'National central admission platform for Medicine, Dentistry, and Pharmacy in Germany.' },
              { col: '#13 Semester Contribution', def: 'Mandatory Semesterbeitrag (~€150–€350) covering student services, administration, and sports.' },
              { col: '#14 Semester Ticket', def: 'Public transport ticket for buses, trams, and regional trains included in the contribution.' },
              { col: '#15 Baden-Württemberg Fee', def: 'The only state charging €1,500/semester tuition fee for non-EU/EEA international students.' },
              { col: '#16 ECTS Requirements', def: 'European Credit Transfer System: 180 ECTS for 3-year Bachelor; 120 ECTS for 2-year Master.' },
              { col: '#17 German Language Requirement', def: 'Mandatory German proficiency level for German-taught degrees (DSH-2 or TestDaF 4).' },
              { col: '#18 TestDaF', def: 'Test Deutsch als Fremdsprache — standardized test with 4 modules. TDN 4 in each is typical.' },
              { col: '#19 DSH', def: 'Deutsche Sprachprüfung für den Hochschulzugang — university-administered language exam (DSH-2).' },
              { col: '#20 Blocked Account (€11,904)', def: 'Sperrkonto proof of funds for student visa: €11,904/year (€992/month released across 12 months).' },
              { col: '#21 Winter Semester', def: 'Main academic intake (starts October). Standard application deadline is July 15.' },
              { col: '#22 Summer Semester', def: 'Secondary intake (starts April). Standard application deadline is January 15.' },
              { col: '#23 Indian Qualification Equivalency', def: 'CBSE/ISC/State 12th + Studienkolleg/JEE rules, 3-year vs 4-year Bachelor recognition.' },
              { col: '#24 Anabin Recognition', def: 'KMK database rating: H+ means institution and degree are formally recognized in Germany.' },
              { col: '#25 Country-Specific Requirements', def: 'Summarized checklist of APS, visa, minimum percentages, and prerequisite certifications.' },
            ].map((item) => (
              <div key={item.col} className="p-3.5 rounded-[12px] bg-[#FAF8F5] border border-[#EAE5DF]">
                <div className="font-bold text-[#690B1B] mb-1">{item.col}</div>
                <div className="text-[#666] leading-relaxed">{item.def}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ COMPARISON TRAY (STICKY BOTTOM BAR - MOBILE OPTIMIZED) ═ */}
        {compareList.length > 0 && (
          <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#111217] text-white px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-full shadow-2xl border border-white/20 flex items-center justify-between sm:justify-start gap-2.5 sm:gap-4 w-[94vw] sm:w-auto max-w-[94vw]">
            <div className="text-[11px] sm:text-[13px] font-medium truncate">
              Comparing <strong className="text-[#C9A55D]">{compareList.length}</strong> / 3
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="h-[34px] sm:h-[36px] px-3.5 sm:px-4 rounded-full bg-[#690B1B] text-white text-[11px] sm:text-[12px] font-bold hover:bg-[#7A1022] transition-colors"
              >
                Compare Side-by-Side ↗
              </button>
              <button
                type="button"
                onClick={() => setCompareList([])}
                className="h-[34px] sm:h-[36px] px-2.5 sm:px-3 rounded-full bg-white/10 text-[#CCC] hover:text-white text-[11px] sm:text-[12px] font-semibold transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ══ DEEP DIVE MODAL FOR SINGLE UNIVERSITY (MOBILE & TABLET OPTIMIZED) ═ */}
        {selectedUniModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white border border-[#E0DCD7] rounded-[20px] sm:rounded-[24px] max-w-3xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 md:p-8 shadow-2xl relative my-auto">
              <button
                type="button"
                onClick={() => setSelectedUniModal(null)}
                className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF8F5] border border-[#E2DDD7] text-[#555] hover:text-[#111] flex items-center justify-center text-[15px] sm:text-[16px] font-bold transition-colors z-20"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-[#690B1B] uppercase tracking-wider mb-1.5 sm:mb-2 pr-8">
                25-Point Comprehensive Admissions Dossier
              </div>

              <h2 className="text-[20px] sm:text-[26px] md:text-[28px] font-bold text-[#111] mb-1 leading-snug pr-8">
                {selectedUniModal.universityName}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] text-[#777] mb-4 sm:mb-6">
                <span>{selectedUniModal.city}, {selectedUniModal.federalState}</span>
                <span>•</span>
                <Badge variant={selectedUniModal.universityType === 'Public' ? 'blue' : 'yellow'}>
                  {selectedUniModal.universityType}
                </Badge>
                <span>•</span>
                <span className="font-bold text-[#690B1B]">{selectedUniModal.ranking}</span>
              </div>

              {/* All 25 Columns in a responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 text-[12px]">
                <FieldBox columnNumber={1} label="University Name">{selectedUniModal.universityName}</FieldBox>
                <FieldBox columnNumber={2} label="City">{selectedUniModal.city}</FieldBox>
                <FieldBox columnNumber={3} label="Institution Type">{selectedUniModal.institutionType}</FieldBox>
                <FieldBox columnNumber={4} label="University Type">{selectedUniModal.universityType}</FieldBox>
                <FieldBox columnNumber={5} label="Federal State">{selectedUniModal.federalState}</FieldBox>
                <FieldBox columnNumber={6} label="NC / Numerus Clausus">{selectedUniModal.ncNumerusClausus}</FieldBox>
                <FieldBox columnNumber={7} label="NC Grade Cut-off" className="font-bold text-[#690B1B]">{selectedUniModal.ncGradeCutoff}</FieldBox>
                <FieldBox columnNumber={8} label="HZB Requirement">{selectedUniModal.hzb}</FieldBox>
                <FieldBox columnNumber={9} label="Studienkolleg Required">{selectedUniModal.studienkollegRequired}</FieldBox>
                <FieldBox columnNumber={10} label="APS Certificate Required" className="font-semibold text-[#2E7D32]">{selectedUniModal.apsCertificateRequired}</FieldBox>
                <FieldBox columnNumber={11} label="uni-assist Application">{selectedUniModal.uniAssistApplication}</FieldBox>
                <FieldBox columnNumber={12} label="Hochschulstart Application">{selectedUniModal.hochschulstartApplication}</FieldBox>
                <FieldBox columnNumber={13} label="Semester Contribution" className="font-bold text-[#111]">{selectedUniModal.semesterContribution}</FieldBox>
                <FieldBox columnNumber={14} label="Semester Ticket">{selectedUniModal.semesterTicket}</FieldBox>
                <FieldBox columnNumber={15} label="Baden-Württemberg Fee">{selectedUniModal.bwTuitionFee}</FieldBox>
                <FieldBox columnNumber={16} label="ECTS Requirements">{selectedUniModal.ectsRequirements}</FieldBox>
                <FieldBox columnNumber={17} label="German Language Requirement">{selectedUniModal.germanLanguageRequirement}</FieldBox>
                <FieldBox columnNumber={18} label="TestDaF Score">{selectedUniModal.testDaF}</FieldBox>
                <FieldBox columnNumber={19} label="DSH Score">{selectedUniModal.dsh}</FieldBox>
                <FieldBox columnNumber={20} label="Blocked Account (Proof of Funds)" className="font-bold text-[#1565C0]">{selectedUniModal.blockedAccountProofOfFunds}</FieldBox>
                <FieldBox columnNumber={21} label="Winter Semester Intake">{selectedUniModal.winterSemester}</FieldBox>
                <FieldBox columnNumber={22} label="Summer Semester Intake">{selectedUniModal.summerSemester}</FieldBox>
                <FieldBox columnNumber={23} label="Indian Qualification Equivalency" className="sm:col-span-2">{selectedUniModal.indianQualificationEquivalency}</FieldBox>
                <FieldBox columnNumber={24} label="Anabin Qualification Recognition" className="sm:col-span-2">{selectedUniModal.anabinRecognition}</FieldBox>
                <FieldBox columnNumber={25} label="Country-Specific Requirements" className="sm:col-span-2 bg-[#FFF8E6] border-[#FFCC80] text-[#78350F]">{selectedUniModal.countrySpecificRequirements}</FieldBox>
              </div>

              <div className="mt-5 sm:mt-6 pt-4 border-t border-[#EAE5DF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyProfile(selectedUniModal)}
                  className="h-[40px] px-4 rounded-[12px] bg-[#FAF8F5] border border-[#DCD6CE] text-[#333] text-[12px] font-bold hover:border-[#690B1B] text-center"
                >
                  📋 Copy Full Profile
                </button>
                <a
                  href={selectedUniModal.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[40px] px-6 rounded-[12px] bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#7A1022] transition-colors flex items-center justify-center gap-1.5"
                >
                  Visit University Website ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ══ COMPARISON MODAL FOR 2-3 UNIVERSITIES (MOBILE & TABLET STICKY MATRIX) ═ */}
        {showCompareModal && compareList.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white border border-[#E0DCD7] rounded-[20px] sm:rounded-[24px] max-w-6xl w-full max-h-[94vh] overflow-y-auto p-4 sm:p-6 md:p-8 shadow-2xl relative my-auto">
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF8F5] border border-[#E2DDD7] text-[#555] hover:text-[#111] flex items-center justify-center text-[15px] sm:text-[16px] font-bold transition-colors z-20"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="text-[10px] sm:text-[11px] font-bold text-[#690B1B] uppercase tracking-wider mb-1.5 pr-8">
                Side-by-Side 25-Parameter Comparator
              </div>
              <h2 className="text-[20px] sm:text-[24px] md:text-[26px] font-bold text-[#111] mb-2 sm:mb-4 pr-8">
                Comparing {compareList.length} German Universities
              </h2>
              <p className="text-[11px] sm:text-[12px] text-[#777] mb-4 sm:mb-6">
                ↔ Swipe left and right to compare columns. The parameter names remain fixed on the left.
              </p>

              <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
                <table className="w-full text-[12px] text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-[#E7E2DE] bg-[#FAF8F5]">
                      <th className="py-3 px-3 sm:px-4 font-bold text-[#888] uppercase tracking-wider w-[160px] sm:w-[220px] sticky left-0 bg-[#FAF8F5] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.06)] text-[10px] sm:text-[11px]">
                        Dataset Column
                      </th>
                      {compareList.map((u) => (
                        <th key={u.universityName} className="py-3 px-3 sm:px-4 font-bold text-[#690B1B] text-[13px] sm:text-[14px] min-w-[200px]">
                          {u.universityName}
                          <div className="text-[11px] text-[#777] font-normal">{u.city}, {u.federalState}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DF]">
                    {[
                      { key: 'institutionType', label: '#3 Institution Type' },
                      { key: 'universityType', label: '#4 Public / Private' },
                      { key: 'federalState', label: '#5 Federal State' },
                      { key: 'ncNumerusClausus', label: '#6 NC Restriction' },
                      { key: 'ncGradeCutoff', label: '#7 NC Cut-off' },
                      { key: 'hzb', label: '#8 HZB Qualification' },
                      { key: 'studienkollegRequired', label: '#9 Studienkolleg' },
                      { key: 'apsCertificateRequired', label: '#10 APS India' },
                      { key: 'uniAssistApplication', label: '#11 uni-assist' },
                      { key: 'hochschulstartApplication', label: '#12 Hochschulstart' },
                      { key: 'semesterContribution', label: '#13 Semester Fee' },
                      { key: 'semesterTicket', label: '#14 Semester Ticket' },
                      { key: 'bwTuitionFee', label: '#15 BW Tuition Fee' },
                      { key: 'ectsRequirements', label: '#16 ECTS Required' },
                      { key: 'germanLanguageRequirement', label: '#17 German Language' },
                      { key: 'testDaF', label: '#18 TestDaF' },
                      { key: 'dsh', label: '#19 DSH' },
                      { key: 'blockedAccountProofOfFunds', label: '#20 Blocked Account' },
                      { key: 'winterSemester', label: '#21 Winter Semester' },
                      { key: 'summerSemester', label: '#22 Summer Semester' },
                      { key: 'indianQualificationEquivalency', label: '#23 Indian Equivalency' },
                      { key: 'anabinRecognition', label: '#24 Anabin Recognition' },
                      { key: 'countrySpecificRequirements', label: '#25 Country Rules' },
                    ].map((row) => (
                      <tr key={row.key} className="hover:bg-[#FAF8F8]">
                        <td className="py-3 px-3 sm:px-4 font-bold text-[#555] bg-[#FAF8F6] sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.06)] text-[11px] sm:text-[12px]">{row.label}</td>
                        {compareList.map((u) => (
                          <td key={u.universityName} className="py-3 px-3 sm:px-4 leading-relaxed text-[11px] sm:text-[12px]">
                            {String((u as any)[row.key] || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 sm:mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCompareModal(false)}
                  className="h-[38px] sm:h-[40px] px-6 rounded-[12px] bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#7A1022] w-full sm:w-auto"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
