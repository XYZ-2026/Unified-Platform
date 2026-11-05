'use client';

import { useState, useMemo } from 'react';
import type { USAUniversity } from '@/app/country/usa/page';

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
        <span className="text-[9px] font-black text-[#A0988E] bg-[#EFECE8] px-1.5 py-0.5 rounded">
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
export default function USAAdmissionsTable({ universities }: { universities: USAUniversity[] }) {
  // View mode
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  // Card Expansion (Keep Marywood University open by default as the reference row)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'Marywood University': true,
  });
  // Active Category Tab inside cards
  const [activeTabByCard, setActiveTabByCard] = useState<Record<string, string>>({});

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [acceptanceFilter, setAcceptanceFilter] = useState<'All' | 'Highly Selective (<20%)' | 'Selective (20–50%)' | 'Accessible (>50%)'>('All');
  const [satFilter, setSatFilter] = useState<'All' | '1450+' | '1200–1450' | 'Under 1200 / Test Optional'>('All');
  const [tuitionFilter, setTuitionFilter] = useState<'All' | 'Under $40k' | '$40k–$55k' | '$55k+'>('All');

  // Modal deep dive
  const [selectedUniModal, setSelectedUniModal] = useState<USAUniversity | null>(null);

  // Comparison tray
  const [compareList, setCompareList] = useState<USAUniversity[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Copy notification
  const [copiedName, setCopiedName] = useState<string | null>(null);

  // Extract unique states for filter pills
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(universities.map((u) => u.stateProvince).filter(Boolean)));
    return ['All', ...states.sort()];
  }, [universities]);

  // Filtered universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      // Search text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          u.universityName.toLowerCase().includes(query) ||
          u.stateProvince.toLowerCase().includes(query) ||
          u.domain.toLowerCase().includes(query) ||
          u.popularMajors.toLowerCase().includes(query) ||
          u.universityId.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // State
      if (selectedState !== 'All' && u.stateProvince !== selectedState) {
        return false;
      }

      // Acceptance Rate
      if (acceptanceFilter !== 'All') {
        const match = u.acceptanceRate.match(/(\d+(\.\d+)?)/);
        const rate = match ? parseFloat(match[1]) : 50;
        if (acceptanceFilter === 'Highly Selective (<20%)' && rate >= 20) return false;
        if (acceptanceFilter === 'Selective (20–50%)' && (rate < 20 || rate > 50)) return false;
        if (acceptanceFilter === 'Accessible (>50%)' && rate <= 50) return false;
      }

      // SAT Score
      if (satFilter !== 'All') {
        const scoreStr = u.satScore.toLowerCase();
        if (satFilter === '1450+') {
          if (!scoreStr.includes('15') && !scoreStr.includes('1480') && !scoreStr.includes('1450') && !scoreStr.includes('1490') && !scoreStr.includes('1510') && !scoreStr.includes('1520') && !scoreStr.includes('1550') && !scoreStr.includes('1560')) return false;
        } else if (satFilter === '1200–1450') {
          if (!scoreStr.includes('12') && !scoreStr.includes('13') && !scoreStr.includes('1400')) return false;
        } else if (satFilter === 'Under 1200 / Test Optional') {
          if (scoreStr.includes('15') || (scoreStr.includes('14') && !scoreStr.includes('1240') && !scoreStr.includes('optional'))) return false;
        }
      }

      // Tuition
      if (tuitionFilter !== 'All') {
        const match = u.tuition.replace(/,/g, '').match(/\$?(\d+)/);
        const fee = match ? parseInt(match[1], 10) : 40000;
        if (tuitionFilter === 'Under $40k' && fee >= 40000) return false;
        if (tuitionFilter === '$40k–$55k' && (fee < 40000 || fee > 55000)) return false;
        if (tuitionFilter === '$55k+' && fee <= 55000) return false;
      }

      return true;
    });
  }, [universities, searchQuery, selectedState, acceptanceFilter, satFilter, tuitionFilter]);

  // Card toggle
  const toggleCard = (name: string) => {
    setExpandedCards((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Compare toggle
  const toggleCompare = (u: USAUniversity) => {
    if (compareList.some((item) => item.universityId === u.universityId)) {
      setCompareList((prev) => prev.filter((item) => item.universityId !== u.universityId));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 universities at once.');
        return;
      }
      setCompareList((prev) => [...prev, u]);
    }
  };

  // Copy full profile to clipboard
  const handleCopyProfile = (u: USAUniversity) => {
    const text = `
UNIVERSITY PROFILE: ${u.universityName} (${u.universityId})
------------------------------------------------------------
• State: ${u.stateProvince}, ${u.country}
• Official Website: ${u.officialWebsite} (${u.domain})
• QS Ranking: ${u.qsRanking}
• Acceptance Rate: ${u.acceptanceRate}
• Tuition: ${u.tuition}
• Living Costs: ${u.livingCosts}
• Average Need-Based Grant: ${u.avgNeedBasedGrant}
• Total Cost: ${u.totalCost}
• Average GPA: ${u.avgGpa}
• SAT Score Range: ${u.satScore}
• Popular Majors: ${u.popularMajors}
• Writing Requirements: ${u.writingRequirements}
• Required Essay Prompts: ${u.requiredEssayPrompts}
• Scholarships: ${u.scholarships}
• Career Outcomes: ${u.careerOutcomes}
• Expected Salary: ${u.expectedSalary}
• Return on Investment (ROI): ${u.roi}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedName(u.universityName);
    setTimeout(() => setCopiedName(null), 3000);
  };

  // Export full dataset as CSV
  const handleExportCSV = () => {
    const headers = [
      'university_id',
      'university_name',
      'country',
      'country_code',
      'state_province',
      'official_website',
      'domain',
      'QS Ranking',
      'Acceptance Rate',
      'Tuition',
      'Living Costs',
      'Popular Majors',
      'Banner Image',
      'Banner Image alt text',
      'Avg Need Based Grant',
      'Avg GPA',
      'SAT Score',
      'Writing Requirements',
      'Required Essay Prompts & Details',
      'Scholarships',
      'Total Cost',
      'Career Outcomes',
      'Expected Salary',
      'ROI',
    ];

    const escapeCSV = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;

    const rows = filteredUniversities.map((u) => [
      escapeCSV(u.universityId),
      escapeCSV(u.universityName),
      escapeCSV(u.country),
      escapeCSV(u.countryCode),
      escapeCSV(u.stateProvince),
      escapeCSV(u.officialWebsite),
      escapeCSV(u.domain),
      escapeCSV(u.qsRanking),
      escapeCSV(u.acceptanceRate),
      escapeCSV(u.tuition),
      escapeCSV(u.livingCosts),
      escapeCSV(u.popularMajors),
      escapeCSV(u.bannerImage),
      escapeCSV(u.bannerImageAlt),
      escapeCSV(u.avgNeedBasedGrant),
      escapeCSV(u.avgGpa),
      escapeCSV(u.satScore),
      escapeCSV(u.writingRequirements),
      escapeCSV(u.requiredEssayPrompts),
      escapeCSV(u.scholarships),
      escapeCSV(u.totalCost),
      escapeCSV(u.careerOutcomes),
      escapeCSV(u.expectedSalary),
      escapeCSV(u.roi),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `USA_University_Admissions_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="admissions-table" className="px-4 sm:px-8 py-10 sm:py-16 bg-[#F6F4F2]">
      <div className="max-w-7xl mx-auto">

        {/* ══ HEADER ══════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#690B1B]" />
              <span className="text-[#C9A55D] text-[11px] sm:text-[12px] tracking-[0.2em] font-bold uppercase">
                24-Parameter US Admissions Hub
              </span>
            </div>
            <h2 className="text-[26px] sm:text-[38px] font-bold tracking-[-0.03em] text-[#111111] leading-tight">
              United States University Directory
            </h2>
            <p className="text-[#666666] text-[13px] sm:text-[15px] mt-1.5 max-w-2xl leading-relaxed">
              Explore verified US institutions with complete data on tuition, need-based aid, SAT/GPA cutoffs, Common App essay prompts, scholarships, starting salaries, and 20-year ROI.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View switcher */}
            <div className="inline-flex rounded-full border border-[#DCD6CE] bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-[#690B1B] text-white shadow-xs'
                    : 'text-[#666] hover:text-[#111]'
                }`}
              >
                🗂️ Dossier Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#690B1B] text-white shadow-xs'
                    : 'text-[#666] hover:text-[#111]'
                }`}
              >
                📊 24-Column Matrix
              </button>
            </div>

            {/* CSV export */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="h-[38px] px-4 rounded-full border border-[#DCD6CE] bg-white hover:bg-[#FAF8F5] text-[#333] text-[12px] font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* ══ METRIC HIGHLIGHT STRIP ══════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-[#E7E2DE] rounded-[16px] p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Universities Listed</div>
            <div className="text-[24px] font-bold text-[#690B1B] mt-0.5">{filteredUniversities.length}</div>
            <div className="text-[11px] text-[#777] mt-0.5">Across {availableStates.length - 1} States</div>
          </div>
          <div className="bg-white border border-[#E7E2DE] rounded-[16px] p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Avg. Need-Based Aid</div>
            <div className="text-[24px] font-bold text-[#2E7D32] mt-0.5">$24,500+</div>
            <div className="text-[11px] text-[#777] mt-0.5">Pell Grants + Institutional</div>
          </div>
          <div className="bg-white border border-[#E7E2DE] rounded-[16px] p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Work Authorization</div>
            <div className="text-[24px] font-bold text-[#1565C0] mt-0.5">3-Yr OPT</div>
            <div className="text-[11px] text-[#777] mt-0.5">STEM Extension Available</div>
          </div>
          <div className="bg-white border border-[#E7E2DE] rounded-[16px] p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Average Starting Salary</div>
            <div className="text-[24px] font-bold text-[#690B1B] mt-0.5">$76K–$115K</div>
            <div className="text-[11px] text-[#777] mt-0.5">Highest Tech/STEM ROI</div>
          </div>
        </div>

        {/* ══ FILTER PANEL ════════════════════════════════════════════ */}
        <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 mb-8 shadow-2xs space-y-4">
          {/* Top row: search + select dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search university, state, major, SAT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[42px] pl-10 pr-4 rounded-[12px] bg-[#FAF8F5] border border-[#DDD7CE] text-[13px] text-[#111] placeholder-[#999] focus:outline-none focus:border-[#690B1B] transition-colors"
              />
              <svg className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Acceptance Rate filter */}
            <div>
              <select
                value={acceptanceFilter}
                onChange={(e) => setAcceptanceFilter(e.target.value as typeof acceptanceFilter)}
                className="w-full h-[42px] px-3.5 rounded-[12px] bg-[#FAF8F5] border border-[#DDD7CE] text-[13px] text-[#333] font-medium focus:outline-none focus:border-[#690B1B]"
              >
                <option value="All">All Acceptance Rates</option>
                <option value="Highly Selective (<20%)">Highly Selective (&lt;20%)</option>
                <option value="Selective (20–50%)">Selective (20–50%)</option>
                <option value="Accessible (>50%)">Accessible (&gt;50%)</option>
              </select>
            </div>

            {/* SAT Score filter */}
            <div>
              <select
                value={satFilter}
                onChange={(e) => setSatFilter(e.target.value as typeof satFilter)}
                className="w-full h-[42px] px-3.5 rounded-[12px] bg-[#FAF8F5] border border-[#DDD7CE] text-[13px] text-[#333] font-medium focus:outline-none focus:border-[#690B1B]"
              >
                <option value="All">All SAT Ranges</option>
                <option value="1450+">1450+ (Elite Ivy / Tech)</option>
                <option value="1200–1450">1200–1450 (Competitive)</option>
                <option value="Under 1200 / Test Optional">Under 1200 / Test Optional</option>
              </select>
            </div>

            {/* Tuition filter */}
            <div>
              <select
                value={tuitionFilter}
                onChange={(e) => setTuitionFilter(e.target.value as typeof tuitionFilter)}
                className="w-full h-[42px] px-3.5 rounded-[12px] bg-[#FAF8F5] border border-[#DDD7CE] text-[13px] text-[#333] font-medium focus:outline-none focus:border-[#690B1B]"
              >
                <option value="All">All Tuition Ranges</option>
                <option value="Under $40k">Under $40,000 / year</option>
                <option value="$40k–$55k">$40,000–$55,000 / year</option>
                <option value="$55k+">$55,000+ / year</option>
              </select>
            </div>
          </div>

          {/* State pills */}
          <div className="pt-2 border-t border-[#F0ECE7] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-[12px]">
            <span className="text-[#888] font-bold uppercase tracking-wider text-[10px] shrink-0 mr-1">
              State:
            </span>
            {availableStates.map((state) => (
              <button
                key={state}
                type="button"
                onClick={() => setSelectedState(state)}
                className={`h-[30px] px-3 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  selectedState === state
                    ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-2xs'
                    : 'bg-[#FAF8F5] text-[#555] border-[#E2DDD7] hover:border-[#690B1B]/40'
                }`}
              >
                {state}
              </button>
            ))}
            {(searchQuery || selectedState !== 'All' || acceptanceFilter !== 'All' || satFilter !== 'All' || tuitionFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('All');
                  setAcceptanceFilter('All');
                  setSatFilter('All');
                  setTuitionFilter('All');
                }}
                className="text-[11px] font-bold text-[#690B1B] hover:underline ml-auto shrink-0"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ══ COPY ALERT ══════════════════════════════════════════════ */}
        {copiedName && (
          <div className="fixed top-24 right-6 z-50 bg-[#111217] text-white text-[12px] font-semibold px-4 py-2.5 rounded-full shadow-xl border border-white/20 flex items-center gap-2">
            <span className="text-[#A5D6A7]">✓</span>
            <span>Copied full 24-point profile for <strong>{copiedName}</strong>!</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
           VIEW 1: DOSSIER CARDS (PRIMARY VIEW)
        ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'cards' && (
          <div className="space-y-5">
            {filteredUniversities.length === 0 ? (
              <div className="bg-white rounded-[20px] p-12 text-center border border-[#E7E2DE]">
                <div className="text-[36px] mb-2">🔍</div>
                <h3 className="text-[18px] font-bold text-[#111]">No matching universities found</h3>
                <p className="text-[13px] text-[#777] mt-1 max-w-md mx-auto">
                  Try adjusting your search keywords, clearing state filters, or selecting broader SAT and tuition ranges.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedState('All');
                    setAcceptanceFilter('All');
                    setSatFilter('All');
                    setTuitionFilter('All');
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-[#690B1B] text-white text-[12px] font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredUniversities.map((u) => {
                const isExpanded = !!expandedCards[u.universityName];
                const activeTab = activeTabByCard[u.universityName] || 'all';
                const isComparing = compareList.some((item) => item.universityId === u.universityId);

                return (
                  <div
                    key={u.universityId}
                    className={`bg-white rounded-[20px] sm:rounded-[24px] border transition-all overflow-hidden ${
                      isExpanded
                        ? 'border-[#690B1B]/40 shadow-lg ring-1 ring-[#690B1B]/10'
                        : 'border-[#E5E0D9] hover:border-[#690B1B]/30 hover:shadow-md'
                    }`}
                  >
                    {/* Top Header Card */}
                    <div className="p-5 sm:p-6 bg-gradient-to-r from-white via-[#FCFAF8] to-white border-b border-[#F0EBE5]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-mono text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-2.5 py-0.5 rounded-md border border-[#E8C4CC]">
                              {u.universityId}
                            </span>
                            <Badge variant="blue">{u.stateProvince}, {u.countryCode}</Badge>
                            <Badge variant="yellow">{u.qsRanking}</Badge>
                            <Badge variant={parseFloat(u.acceptanceRate) < 20 ? 'red' : 'green'}>
                              Acceptance: {u.acceptanceRate}
                            </Badge>
                          </div>

                          <h3 className="text-[20px] sm:text-[24px] font-bold text-[#111111] leading-tight">
                            {u.universityName}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[12px] text-[#666666]">
                            <a
                              href={u.officialWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#690B1B] font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              <span>{u.domain}</span>
                              <span className="text-[10px]">↗</span>
                            </a>
                            <span>•</span>
                            <span className="text-[#444]">Avg GPA: <strong>{u.avgGpa}</strong></span>
                            <span>•</span>
                            <span className="text-[#444]">SAT Range: <strong>{u.satScore}</strong></span>
                          </div>
                        </div>

                        {/* Right side CTA / Actions (Responsive for Mobile & Tablet) */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F0ECE7] w-full md:w-auto justify-end">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#DDD7CE] text-[11px] font-semibold text-[#555] cursor-pointer hover:bg-white select-none">
                            <input
                              type="checkbox"
                              checked={isComparing}
                              onChange={() => toggleCompare(u)}
                              className="rounded text-[#690B1B] focus:ring-[#690B1B] w-3.5 h-3.5"
                            />
                            <span>Compare</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setSelectedUniModal(u)}
                            className="h-[36px] px-3.5 rounded-[10px] bg-[#FAF8F5] border border-[#DDD7CE] hover:border-[#690B1B] text-[#333] text-[12px] font-bold transition-colors flex items-center gap-1"
                          >
                            <span>🔍 Deep Dive</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyProfile(u)}
                            className="h-[36px] px-3 rounded-[10px] bg-[#FAF8F5] border border-[#DDD7CE] hover:border-[#690B1B] text-[#333] text-[12px] font-bold transition-colors"
                            title="Copy 24-point profile to clipboard"
                          >
                            📋
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleCard(u.universityName)}
                            className={`h-[36px] px-4 rounded-[10px] text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
                              isExpanded
                                ? 'bg-[#690B1B] text-white shadow-xs'
                                : 'bg-[#111217] text-white hover:bg-[#690B1B]'
                            }`}
                          >
                            <span>{isExpanded ? 'Collapse ▴' : 'View All 24 Columns ▾'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Key stats summary strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4 pt-4 border-t border-[#EFECE8]">
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#10 Tuition</div>
                          <div className="text-[12.5px] font-bold text-[#111] mt-0.5 truncate">{u.tuition}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#11 Living Costs</div>
                          <div className="text-[12.5px] font-bold text-[#111] mt-0.5 truncate">{u.livingCosts}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#15 Need-Based Aid</div>
                          <div className="text-[12.5px] font-bold text-[#2E7D32] mt-0.5 truncate">{u.avgNeedBasedGrant}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#17 SAT Range</div>
                          <div className="text-[12.5px] font-bold text-[#1565C0] mt-0.5 truncate">{u.satScore}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#23 Starting Salary</div>
                          <div className="text-[12.5px] font-bold text-[#2E7D32] mt-0.5 truncate">{u.expectedSalary}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#24 20-Yr ROI</div>
                          <div className="text-[12.5px] font-bold text-[#690B1B] mt-0.5 truncate">{u.roi.slice(0, 24)}...</div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded 24-column dossier body */}
                    {isExpanded && (
                      <div className="p-5 sm:p-7 bg-[#FCFAF8]">
                        {/* Dossier Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 border-b border-[#EAE5DF] scrollbar-hide">
                          {[
                            { id: 'all', label: 'All 24 Parameters' },
                            { id: 'admissions', label: 'Admissions & Test Scores' },
                            { id: 'financials', label: 'Financials & Aid' },
                            { id: 'roi', label: 'ROI & Career Outcomes' },
                            { id: 'academics', label: 'Academics & Campus' },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveTabByCard((prev) => ({ ...prev, [u.universityName]: tab.id }))}
                              className={`h-[32px] px-3.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                  ? 'bg-[#690B1B] text-white shadow-2xs'
                                  : 'bg-white text-[#666] border border-[#DDD7CE] hover:text-[#111]'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Tab Content: ALL 24 PARAMETERS */}
                        {activeTab === 'all' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <FieldBox columnNumber={1} label="University ID">
                              <span className="font-mono">{u.universityId}</span>
                            </FieldBox>
                            <FieldBox columnNumber={2} label="University Name">
                              <strong>{u.universityName}</strong>
                            </FieldBox>
                            <FieldBox columnNumber={3} label="Country">
                              🇺🇸 {u.country} ({u.countryCode})
                            </FieldBox>
                            <FieldBox columnNumber={4} label="Country Code">
                              {u.countryCode}
                            </FieldBox>
                            <FieldBox columnNumber={5} label="State / Province">
                              {u.stateProvince}
                            </FieldBox>
                            <FieldBox columnNumber={6} label="Official Website">
                              <a href={u.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-[#690B1B] font-bold hover:underline">
                                {u.domain} ↗
                              </a>
                            </FieldBox>
                            <FieldBox columnNumber={7} label="Domain">
                              <span className="font-mono">{u.domain}</span>
                            </FieldBox>
                            <FieldBox columnNumber={8} label="QS Ranking" className="font-bold text-[#690B1B]">
                              {u.qsRanking}
                            </FieldBox>
                            <FieldBox columnNumber={9} label="Acceptance Rate" className="font-bold text-[#111]">
                              {u.acceptanceRate}
                            </FieldBox>
                            <FieldBox columnNumber={10} label="Tuition" className="font-bold text-[#111]">
                              {u.tuition}
                            </FieldBox>
                            <FieldBox columnNumber={11} label="Living Costs">
                              {u.livingCosts}
                            </FieldBox>
                            <FieldBox columnNumber={12} label="Popular Majors" className="md:col-span-2 lg:col-span-3">
                              {u.popularMajors}
                            </FieldBox>
                            <FieldBox columnNumber={13} label="Banner Image">
                              {u.bannerImage}
                            </FieldBox>
                            <FieldBox columnNumber={14} label="Banner Image Alt">
                              {u.bannerImageAlt}
                            </FieldBox>
                            <FieldBox columnNumber={15} label="Avg Need-Based Grant" className="font-bold text-[#2E7D32]">
                              {u.avgNeedBasedGrant}
                            </FieldBox>
                            <FieldBox columnNumber={16} label="Avg GPA" className="font-bold text-[#111]">
                              {u.avgGpa}
                            </FieldBox>
                            <FieldBox columnNumber={17} label="SAT Score Range" className="font-bold text-[#1565C0]">
                              {u.satScore}
                            </FieldBox>
                            <FieldBox columnNumber={18} label="Writing Requirements" className="md:col-span-2 lg:col-span-3">
                              {u.writingRequirements}
                            </FieldBox>
                            <FieldBox columnNumber={19} label="Required Essay Prompts & Details" className="md:col-span-2 lg:col-span-3 bg-[#FFFDF8] border-[#E8DFC8]">
                              {u.requiredEssayPrompts}
                            </FieldBox>
                            <FieldBox columnNumber={20} label="Scholarships" className="md:col-span-2 lg:col-span-3 bg-[#E8F5E9]/40 border-[#A5D6A7]">
                              {u.scholarships}
                            </FieldBox>
                            <FieldBox columnNumber={21} label="Total Cost" className="font-bold text-[#1565C0]">
                              {u.totalCost}
                            </FieldBox>
                            <FieldBox columnNumber={22} label="Career Outcomes" className="md:col-span-2 lg:col-span-2">
                              {u.careerOutcomes}
                            </FieldBox>
                            <FieldBox columnNumber={23} label="Expected Salary" className="font-bold text-[#2E7D32]">
                              {u.expectedSalary}
                            </FieldBox>
                            <FieldBox columnNumber={24} label="Return on Investment (ROI)" className="md:col-span-2 lg:col-span-3 bg-[#FFF8E6] border-[#FFCC80] text-[#78350F]">
                              {u.roi}
                            </FieldBox>
                          </div>
                        )}

                        {/* Tab Content: ADMISSIONS & TEST SCORES */}
                        {activeTab === 'admissions' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <FieldBox columnNumber={9} label="Acceptance Rate" className="font-bold text-[#690B1B] text-[16px]">
                              {u.acceptanceRate}
                            </FieldBox>
                            <FieldBox columnNumber={16} label="Average GPA (4.0 Scale)" className="font-bold text-[#111] text-[16px]">
                              {u.avgGpa}
                            </FieldBox>
                            <FieldBox columnNumber={17} label="SAT Score Range (Middle 50%)" className="font-bold text-[#1565C0] text-[16px]">
                              {u.satScore}
                            </FieldBox>
                            <FieldBox columnNumber={8} label="QS World Ranking">
                              {u.qsRanking}
                            </FieldBox>
                            <FieldBox columnNumber={18} label="Writing Requirements" className="md:col-span-2">
                              {u.writingRequirements}
                            </FieldBox>
                            <FieldBox columnNumber={19} label="Required Essay Prompts & Supplementary Details" className="md:col-span-2 bg-[#FFFDF8] border-[#E8DFC8]">
                              {u.requiredEssayPrompts}
                            </FieldBox>
                          </div>
                        )}

                        {/* Tab Content: FINANCIALS & SCHOLARSHIPS */}
                        {activeTab === 'financials' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                            <FieldBox columnNumber={10} label="Annual Tuition">
                              <span className="font-bold text-[15px]">{u.tuition}</span>
                            </FieldBox>
                            <FieldBox columnNumber={11} label="Estimated Living Costs">
                              <span className="font-bold text-[15px]">{u.livingCosts}</span>
                            </FieldBox>
                            <FieldBox columnNumber={21} label="Total Cost (Tuition + Living)">
                              <span className="font-bold text-[15px] text-[#1565C0]">{u.totalCost}</span>
                            </FieldBox>
                            <FieldBox columnNumber={15} label="Avg Need-Based Grant" className="md:col-span-3 bg-[#E8F5E9]/50 border-[#A5D6A7]">
                              <span className="font-bold text-[#2E7D32] text-[15px]">{u.avgNeedBasedGrant}</span>
                            </FieldBox>
                            <FieldBox columnNumber={20} label="Scholarships, Grants & Aid Options" className="md:col-span-3">
                              {u.scholarships}
                            </FieldBox>
                          </div>
                        )}

                        {/* Tab Content: ROI & CAREER OUTCOMES */}
                        {activeTab === 'roi' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <FieldBox columnNumber={23} label="Expected Starting Salary" className="font-bold text-[#2E7D32] text-[15px]">
                              {u.expectedSalary}
                            </FieldBox>
                            <FieldBox columnNumber={21} label="Total Cost of Attendance">
                              {u.totalCost}
                            </FieldBox>
                            <FieldBox columnNumber={22} label="Career Outcomes & Placement" className="md:col-span-2">
                              {u.careerOutcomes}
                            </FieldBox>
                            <FieldBox columnNumber={24} label="20-Year ROI & Break-Even Analysis" className="md:col-span-2 bg-[#FFF8E6] border-[#FFCC80] text-[#78350F]">
                              {u.roi}
                            </FieldBox>
                          </div>
                        )}

                        {/* Tab Content: ACADEMICS & CAMPUS */}
                        {activeTab === 'academics' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <FieldBox columnNumber={12} label="Popular Majors & Leading Programs" className="md:col-span-2">
                              {u.popularMajors}
                            </FieldBox>
                            <FieldBox columnNumber={5} label="Campus State / Province">
                              {u.stateProvince}, {u.country}
                            </FieldBox>
                            <FieldBox columnNumber={6} label="Official University Website">
                              <a href={u.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-[#690B1B] font-bold hover:underline">
                                {u.domain} ↗
                              </a>
                            </FieldBox>
                            <FieldBox columnNumber={13} label="Banner Image Caption">
                              {u.bannerImage}
                            </FieldBox>
                            <FieldBox columnNumber={14} label="Banner Image Alt Description">
                              {u.bannerImageAlt}
                            </FieldBox>
                          </div>
                        )}

                        {/* Card Footer Actions */}
                        <div className="mt-5 pt-4 border-t border-[#EAE5DF] flex flex-wrap items-center justify-between gap-3 text-[12px]">
                          <div className="text-[#777]">
                            Dataset ID: <span className="font-mono text-[#444] font-semibold">{u.universityId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyProfile(u)}
                              className="px-3.5 py-1.5 rounded-[8px] bg-white border border-[#DCD6CE] text-[#333] font-semibold hover:border-[#690B1B]"
                            >
                              📋 Copy Profile
                            </button>
                            <a
                              href={u.officialWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-1.5 rounded-[8px] bg-[#690B1B] text-white font-bold hover:bg-[#7A1022] transition-colors"
                            >
                              Visit Website ↗
                            </a>
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

        {/* ══════════════════════════════════════════════════════════════
           VIEW 2: 24-COLUMN HORIZONTAL DATA MATRIX
        ══════════════════════════════════════════════════════════════ */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-[20px] border border-[#E7E2DE] shadow-sm overflow-hidden">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E7E2DE] flex items-center justify-between gap-4 text-[12px]">
              <div className="text-[#666]">
                Showing <strong>{filteredUniversities.length}</strong> universities across all 24 columns. Scroll horizontally to inspect full dataset parameters.
              </div>
              <div className="text-[#888] font-mono text-[11px] shrink-0">
                ↔ Horizontal Scroll
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] border-collapse min-w-[2400px]">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E7E2DE] text-[#666]">
                    <th className="py-3 px-3.5 font-bold uppercase tracking-wider sticky left-0 z-20 bg-[#FAF8F5] shadow-[2px_0_5px_rgba(0,0,0,0.05)] w-[240px]">
                      #2 University Name
                    </th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[120px]">#1 ID</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[100px]">#5 State</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[110px]">#8 QS Rank</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[110px]">#9 Acceptance</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[100px]">#16 Avg GPA</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[120px]">#17 SAT Score</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[130px]">#10 Tuition</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[120px]">#11 Living Costs</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[140px]">#15 Need Grant</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[130px]">#21 Total Cost</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[140px]">#23 Salary</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[240px]">#24 ROI</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[220px]">#18 Writing Req.</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[260px]">#19 Essay Prompts</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[240px]">#20 Scholarships</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[220px]">#22 Outcomes</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[260px]">#12 Popular Majors</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[130px]">#6 Website</th>
                    <th className="py-3 px-3 font-bold uppercase tracking-wider w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DF]">
                  {filteredUniversities.map((u) => {
                    const isComparing = compareList.some((item) => item.universityId === u.universityId);

                    return (
                      <tr key={u.universityId} className="hover:bg-[#FAF8F8] transition-colors">
                        {/* Sticky Name */}
                        <td className="py-3 px-3.5 font-bold text-[#111] sticky left-0 z-10 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isComparing}
                              onChange={() => toggleCompare(u)}
                              className="rounded text-[#690B1B] focus:ring-[#690B1B] w-3.5 h-3.5"
                            />
                            <button
                              type="button"
                              onClick={() => setSelectedUniModal(u)}
                              className="text-left font-bold text-[#690B1B] hover:underline"
                            >
                              {u.universityName}
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px] text-[#777]">{u.universityId}</td>
                        <td className="py-3 px-3 font-semibold text-[#444]">{u.stateProvince}</td>
                        <td className="py-3 px-3 font-bold text-[#690B1B]">{u.qsRanking}</td>
                        <td className="py-3 px-3 font-bold">{u.acceptanceRate}</td>
                        <td className="py-3 px-3 font-bold text-[#333]">{u.avgGpa}</td>
                        <td className="py-3 px-3 font-bold text-[#1565C0]">{u.satScore}</td>
                        <td className="py-3 px-3 font-bold text-[#111]">{u.tuition}</td>
                        <td className="py-3 px-3 text-[#555]">{u.livingCosts}</td>
                        <td className="py-3 px-3 font-bold text-[#2E7D32]">{u.avgNeedBasedGrant}</td>
                        <td className="py-3 px-3 font-bold text-[#1565C0]">{u.totalCost}</td>
                        <td className="py-3 px-3 font-bold text-[#2E7D32]">{u.expectedSalary}</td>
                        <td className="py-3 px-3 text-[11px] leading-relaxed text-[#78350F] bg-[#FFF8E6]/40">{u.roi.slice(0, 110)}...</td>
                        <td className="py-3 px-3 text-[11px] text-[#555] leading-relaxed">{u.writingRequirements.slice(0, 90)}...</td>
                        <td className="py-3 px-3 text-[11px] text-[#555] leading-relaxed">{u.requiredEssayPrompts.slice(0, 110)}...</td>
                        <td className="py-3 px-3 text-[11px] text-[#2E7D32] leading-relaxed">{u.scholarships.slice(0, 100)}...</td>
                        <td className="py-3 px-3 text-[11px] text-[#555] leading-relaxed">{u.careerOutcomes.slice(0, 95)}...</td>
                        <td className="py-3 px-3 text-[11px] text-[#555] leading-relaxed">{u.popularMajors.slice(0, 95)}...</td>
                        <td className="py-3 px-3">
                          <a href={u.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-[#690B1B] font-bold hover:underline">
                            {u.domain} ↗
                          </a>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => setSelectedUniModal(u)}
                            className="px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#DDD7CE] text-[#333] hover:border-[#690B1B] font-bold text-[11px]"
                          >
                            Dossier ↗
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ 24-COLUMN SCHEMA GLOSSARY (EXPLORATORY AID) ══════════════ */}
        <div className="mt-12 bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-[#690B1B] font-bold text-[11px] uppercase tracking-wider">
            Dataset Reference Directory
          </div>
          <h3 className="text-[18px] sm:text-[20px] font-bold text-[#111] mb-4">
            The 24 University Admissions Parameters Explained
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[12px]">
            {[
              { col: '#1 university_id', def: 'Unique system identifier for the institution in the platform dataset.' },
              { col: '#2 university_name', def: 'Official legal name of the university or college.' },
              { col: '#3 country', def: 'Country location (United States).' },
              { col: '#4 country_code', def: 'ISO 2-letter country code (US).' },
              { col: '#5 state_province', def: 'US state where the main campus is located (e.g. Pennsylvania, California).' },
              { col: '#6 official_website', def: 'Official university home page URL.' },
              { col: '#7 domain', def: 'Registered root domain name of the institution (e.g. marywood.edu).' },
              { col: '#8 QS Ranking', def: 'QS World University Rankings 2026 position or status.' },
              { col: '#9 Acceptance Rate', def: 'Undergraduate admission selectivity percentage.' },
              { col: '#10 Tuition', def: 'Annual published tuition and mandatory fees.' },
              { col: '#11 Living Costs', def: 'Estimated annual room, board, and personal expenses.' },
              { col: '#12 Popular Majors', def: 'Leading and most sought-after degree programs offered.' },
              { col: '#13 Banner Image', def: 'Campus banner asset filename or URL.' },
              { col: '#14 Banner Image alt text', def: 'Accessibility description for institutional visual assets.' },
              { col: '#15 Avg Need Based Grant', def: 'Average financial aid awarded to students demonstrating financial need.' },
              { col: '#16 Avg GPA', def: 'Typical high school unweighted GPA on a 4.0 scale.' },
              { col: '#17 SAT Score', def: 'Middle 50% composite SAT score range (e.g. 1080–1240).' },
              { col: '#18 Writing Requirements', def: 'Essay guidelines (Common App, Coalition, supplements, word limits).' },
              { col: '#19 Required Essay Prompts', def: 'Specific essay prompt topics, personal statements, and supplementary details.' },
              { col: '#20 Scholarships', def: 'Merit-based, need-based, Pell Grant, and state funding opportunities.' },
              { col: '#21 Total Cost', def: 'Annual and estimated 4-year total cost of attendance.' },
              { col: '#22 Career Outcomes', def: 'Employment, graduate school placement, and career outcome rates.' },
              { col: '#23 Expected Salary', def: 'Starting salary ranges for graduates and mid-career benchmarks.' },
              { col: '#24 ROI', def: '20-year net earnings premium, break-even period, and ROI models.' },
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
                24-Point Comprehensive Admissions Dossier
              </div>

              <h2 className="text-[20px] sm:text-[26px] md:text-[28px] font-bold text-[#111] mb-1 leading-snug pr-8">
                {selectedUniModal.universityName}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] text-[#777] mb-4 sm:mb-6">
                <span>{selectedUniModal.stateProvince}, {selectedUniModal.country}</span>
                <span>•</span>
                <Badge variant="blue">{selectedUniModal.stateProvince}</Badge>
                <span>•</span>
                <span className="font-bold text-[#690B1B]">{selectedUniModal.qsRanking}</span>
                <span>•</span>
                <Badge variant="green">Acceptance: {selectedUniModal.acceptanceRate}</Badge>
              </div>

              {/* All 24 Columns in a clean 2-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 text-[12px]">
                <FieldBox columnNumber={1} label="University ID"><span className="font-mono">{selectedUniModal.universityId}</span></FieldBox>
                <FieldBox columnNumber={2} label="University Name">{selectedUniModal.universityName}</FieldBox>
                <FieldBox columnNumber={3} label="Country">🇺🇸 {selectedUniModal.country}</FieldBox>
                <FieldBox columnNumber={4} label="Country Code">{selectedUniModal.countryCode}</FieldBox>
                <FieldBox columnNumber={5} label="State / Province">{selectedUniModal.stateProvince}</FieldBox>
                <FieldBox columnNumber={6} label="Official Website">
                  <a href={selectedUniModal.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-[#690B1B] font-bold hover:underline">
                    {selectedUniModal.domain} ↗
                  </a>
                </FieldBox>
                <FieldBox columnNumber={7} label="Domain"><span className="font-mono">{selectedUniModal.domain}</span></FieldBox>
                <FieldBox columnNumber={8} label="QS Ranking" className="font-bold text-[#690B1B]">{selectedUniModal.qsRanking}</FieldBox>
                <FieldBox columnNumber={9} label="Acceptance Rate" className="font-bold text-[#111]">{selectedUniModal.acceptanceRate}</FieldBox>
                <FieldBox columnNumber={10} label="Tuition" className="font-bold text-[#111]">{selectedUniModal.tuition}</FieldBox>
                <FieldBox columnNumber={11} label="Living Costs">{selectedUniModal.livingCosts}</FieldBox>
                <FieldBox columnNumber={12} label="Popular Majors" className="sm:col-span-2">{selectedUniModal.popularMajors}</FieldBox>
                <FieldBox columnNumber={13} label="Banner Image">{selectedUniModal.bannerImage}</FieldBox>
                <FieldBox columnNumber={14} label="Banner Image Alt">{selectedUniModal.bannerImageAlt}</FieldBox>
                <FieldBox columnNumber={15} label="Avg Need-Based Grant" className="font-bold text-[#2E7D32]">{selectedUniModal.avgNeedBasedGrant}</FieldBox>
                <FieldBox columnNumber={16} label="Avg GPA" className="font-bold">{selectedUniModal.avgGpa}</FieldBox>
                <FieldBox columnNumber={17} label="SAT Score Range" className="font-bold text-[#1565C0]">{selectedUniModal.satScore}</FieldBox>
                <FieldBox columnNumber={18} label="Writing Requirements" className="sm:col-span-2">{selectedUniModal.writingRequirements}</FieldBox>
                <FieldBox columnNumber={19} label="Required Essay Prompts & Details" className="sm:col-span-2 bg-[#FFFDF8] border-[#E8DFC8]">{selectedUniModal.requiredEssayPrompts}</FieldBox>
                <FieldBox columnNumber={20} label="Scholarships" className="sm:col-span-2 bg-[#E8F5E9]/40 border-[#A5D6A7]">{selectedUniModal.scholarships}</FieldBox>
                <FieldBox columnNumber={21} label="Total Cost" className="font-bold text-[#1565C0]">{selectedUniModal.totalCost}</FieldBox>
                <FieldBox columnNumber={22} label="Career Outcomes" className="sm:col-span-2">{selectedUniModal.careerOutcomes}</FieldBox>
                <FieldBox columnNumber={23} label="Expected Salary" className="font-bold text-[#2E7D32]">{selectedUniModal.expectedSalary}</FieldBox>
                <FieldBox columnNumber={24} label="ROI" className="sm:col-span-2 bg-[#FFF8E6] border-[#FFCC80] text-[#78350F]">{selectedUniModal.roi}</FieldBox>
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
                  href={selectedUniModal.officialWebsite}
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
                Side-by-Side 24-Parameter Comparator
              </div>
              <h2 className="text-[20px] sm:text-[24px] md:text-[26px] font-bold text-[#111] mb-2 sm:mb-4 pr-8">
                Comparing {compareList.length} US Universities
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
                        <th key={u.universityId} className="py-3 px-3 sm:px-4 font-bold text-[#690B1B] text-[13px] sm:text-[14px] min-w-[200px]">
                          {u.universityName}
                          <div className="text-[11px] text-[#777] font-normal">{u.stateProvince}, {u.countryCode}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DF]">
                    {[
                      { key: 'universityId', label: '#1 University ID' },
                      { key: 'stateProvince', label: '#5 State / Province' },
                      { key: 'qsRanking', label: '#8 QS Ranking' },
                      { key: 'acceptanceRate', label: '#9 Acceptance Rate' },
                      { key: 'avgGpa', label: '#16 Avg GPA' },
                      { key: 'satScore', label: '#17 SAT Score' },
                      { key: 'tuition', label: '#10 Tuition' },
                      { key: 'livingCosts', label: '#11 Living Costs' },
                      { key: 'avgNeedBasedGrant', label: '#15 Avg Need Grant' },
                      { key: 'totalCost', label: '#21 Total Cost' },
                      { key: 'popularMajors', label: '#12 Popular Majors' },
                      { key: 'writingRequirements', label: '#18 Writing Req.' },
                      { key: 'requiredEssayPrompts', label: '#19 Essay Prompts' },
                      { key: 'scholarships', label: '#20 Scholarships' },
                      { key: 'careerOutcomes', label: '#22 Career Outcomes' },
                      { key: 'expectedSalary', label: '#23 Expected Salary' },
                      { key: 'roi', label: '#24 ROI' },
                    ].map((row) => (
                      <tr key={row.key} className="hover:bg-[#FAF8F8]">
                        <td className="py-3 px-3 sm:px-4 font-bold text-[#555] bg-[#FAF8F6] sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.06)] text-[11px] sm:text-[12px]">{row.label}</td>
                        {compareList.map((u) => (
                          <td key={u.universityId} className="py-3 px-3 sm:px-4 leading-relaxed text-[11px] sm:text-[12px]">
                            {String((u as unknown as Record<string, unknown>)[row.key] || '')}
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
