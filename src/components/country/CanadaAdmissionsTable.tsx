'use client';

import { useState, useMemo } from 'react';
import type { CanadaUniversity } from '@/app/country/canada/page';

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
  if (lower.startsWith('yes') || lower.includes('mandatory') || lower.includes('required') || lower.includes('eligible')) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#2E7D32] font-bold text-[12px]">
        <span className="w-2 h-2 rounded-full bg-[#2E7D32] shrink-0" />
        {value}
      </span>
    );
  }
  if (lower.startsWith('no') || lower.includes('n/a') || lower.includes('not required') || lower.includes('not available')) {
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
export default function CanadaAdmissionsTable({ universities }: { universities: CanadaUniversity[] }) {
  // View mode
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  // Card Expansion
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'Acadia University': true, // Keep Acadia University open by default as the reference row
  });
  // Active Category Tab inside cards
  const [activeTabByCard, setActiveTabByCard] = useState<Record<string, string>>({});

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [uniTypeFilter, setUniTypeFilter] = useState<'All' | 'Public' | 'Private'>('All');
  const [dliFilter, setDliFilter] = useState<'All' | 'DLI Verified' | 'Unverified'>('All');
  const [programFilter, setProgramFilter] = useState<'All' | 'Undergraduate' | 'Postgraduate' | 'Doctoral'>('All');

  // Modal deep dive
  const [selectedUniModal, setSelectedUniModal] = useState<CanadaUniversity | null>(null);

  // Comparison tray
  const [compareList, setCompareList] = useState<CanadaUniversity[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Copy notification
  const [copiedName, setCopiedName] = useState<string | null>(null);

  // Extract unique provinces for filter pills
  const availableProvinces = useMemo(() => {
    const provinces = Array.from(new Set(universities.map((u) => u.province).filter(Boolean)));
    return ['All', ...provinces.sort()];
  }, [universities]);

  // Filtered universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = u.institutionName.toLowerCase().includes(q);
        const matchesCity = u.city.toLowerCase().includes(q);
        const matchesProvince = u.province.toLowerCase().includes(q);
        const matchesMajors = u.popularMajors.toLowerCase().includes(q);
        const matchesDli = u.dliNumber.toLowerCase().includes(q);
        const matchesTuition = u.tuition.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesProvince && !matchesMajors && !matchesDli && !matchesTuition) {
          return false;
        }
      }

      // Province filter
      if (selectedProvince !== 'All' && u.province !== selectedProvince) {
        return false;
      }

      // University Type
      if (uniTypeFilter !== 'All') {
        const isPublic = u.publicPrivate.toLowerCase().includes('public');
        if (uniTypeFilter === 'Public' && !isPublic) return false;
        if (uniTypeFilter === 'Private' && isPublic) return false;
      }

      // DLI Filter
      if (dliFilter === 'DLI Verified') {
        if (!u.dliNumber || u.dliNumber.toLowerCase() === 'n/a' || u.dliNumber.toLowerCase() === 'not available') return false;
      } else if (dliFilter === 'Unverified') {
        if (u.dliNumber && u.dliNumber.toLowerCase() !== 'n/a' && u.dliNumber.toLowerCase() !== 'not available') return false;
      }

      // Program Level Filter
      if (programFilter === 'Undergraduate' && u.offersUndergraduate.toLowerCase() !== 'yes') return false;
      if (programFilter === 'Postgraduate' && u.offersPostgraduate.toLowerCase() !== 'yes') return false;
      if (programFilter === 'Doctoral' && !u.offersDoctoral.toLowerCase().startsWith('yes')) return false;

      return true;
    });
  }, [universities, searchQuery, selectedProvince, uniTypeFilter, dliFilter, programFilter]);

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

  const toggleCompare = (uni: CanadaUniversity) => {
    if (compareList.some((c) => c.institutionName === uni.institutionName)) {
      setCompareList((prev) => prev.filter((c) => c.institutionName !== uni.institutionName));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 universities at a time.');
        return;
      }
      setCompareList((prev) => [...prev, uni]);
    }
  };

  const handleCopyProfile = (uni: CanadaUniversity) => {
    const text = `
🇨🇦 CANADIAN UNIVERSITY ADMISSION PROFILE: ${uni.institutionName}
─────────────────────────────────────────────────
1. Institution ID: ${uni.institutionId}
2. Institution Name: ${uni.institutionName}
3. Province: ${uni.province}
4. City: ${uni.city}
5. Institution Type: ${uni.institutionType}
6. Public/Private: ${uni.publicPrivate}
7. Official Website: ${uni.officialWebsite}
8. Domain: ${uni.domain}
9. DLI Number: ${uni.dliNumber}
10. International Student Eligible: ${uni.internationalStudentEligible}
11. Offers Undergraduate: ${uni.offersUndergraduate}
12. Offers Postgraduate: ${uni.offersPostgraduate}
13. Offers Doctoral: ${uni.offersDoctoral}
14. Language of Instruction: ${uni.languageOfInstruction}
15. Last Verified Date: ${uni.lastVerifiedDate}
16. Country: ${uni.country}
17. Country Code: ${uni.countryCode}
18. QS Ranking: ${uni.qsRanking}
19. Acceptance Rate: ${uni.acceptanceRate}
20. Tuition: ${uni.tuition}
21. Living Costs: ${uni.livingCosts}
22. Popular Majors: ${uni.popularMajors}
23. Banner Image: ${uni.bannerImage}
24. Banner Image Alt: ${uni.bannerImageAlt}
25. Avg Need Based Grant: ${uni.avgNeedBasedGrant}
26. Avg GPA: ${uni.avgGpa}
27. SAT Score: ${uni.satScore}
28. Writing Requirements: ${uni.writingRequirements}
29. Required Essay Prompts: ${uni.requiredEssayPrompts}
30. Scholarships: ${uni.scholarships}
31. Total Cost: ${uni.totalCost}
32. Career Outcomes: ${uni.careerOutcomes}
33. Expected Salary: ${uni.expectedSalary}
34. ROI: ${uni.roi}
─────────────────────────────────────────────────
Abroad Simplified 2026 Canada Admissions Guide
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedName(uni.institutionName);
    setTimeout(() => setCopiedName(null), 2500);
  };

  const handleExportCSV = () => {
    const headers = [
      'institution_id',
      'institution_name',
      'province',
      'city',
      'institution_type',
      'public_private',
      'official_website',
      'domain',
      'dli_number',
      'international_student_eligible',
      'offers_undergraduate',
      'offers_postgraduate',
      'offers_doctoral',
      'language_of_instruction',
      'last_verified_date',
      'country',
      'country_code',
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
      escapeCSV(u.institutionId),
      escapeCSV(u.institutionName),
      escapeCSV(u.province),
      escapeCSV(u.city),
      escapeCSV(u.institutionType),
      escapeCSV(u.publicPrivate),
      escapeCSV(u.officialWebsite),
      escapeCSV(u.domain),
      escapeCSV(u.dliNumber),
      escapeCSV(u.internationalStudentEligible),
      escapeCSV(u.offersUndergraduate),
      escapeCSV(u.offersPostgraduate),
      escapeCSV(u.offersDoctoral),
      escapeCSV(u.languageOfInstruction),
      escapeCSV(u.lastVerifiedDate),
      escapeCSV(u.country),
      escapeCSV(u.countryCode),
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
    link.setAttribute('download', `Canada_University_Admissions_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="admissions-table" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F6F4F2]">
      <div className="max-w-7xl mx-auto">

        {/* ══ SECTION HEADER ══════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#690B1B]" />
              <span className="text-[#C9A55D] text-[11px] sm:text-[12px] tracking-[0.2em] font-bold uppercase">
                34-Parameter Canada Admissions Hub
              </span>
            </div>
            <h2 className="text-[26px] sm:text-[38px] font-bold tracking-[-0.03em] text-[#111111] leading-tight">
              Canadian Universities Admissions Dataset
            </h2>
            <p className="text-[#666666] text-[13px] sm:text-[15px] mt-1.5 max-w-2xl leading-relaxed">
              Every university verified against all <strong>34 admission parameters</strong>: DLI number, QS ranking, acceptance rate, tuition fees, GPA requirements, SAT scores, scholarships, living costs, career outcomes, expected salary, and ROI analysis.
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
                📊 34-Column Matrix
              </button>
            </div>

            {/* CSV export */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="h-[38px] px-4 rounded-full border border-[#DCD6CE] bg-white hover:bg-[#FAF8F5] text-[#333] text-[12px] font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
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
            <div className="text-[11px] text-[#777] mt-0.5">Across {availableProvinces.length - 1} Provinces</div>
          </div>
          <div className="bg-white border border-[#E7E2DE] rounded-[16px] p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">DLI & PGWP Verification</div>
            <div className="text-[24px] font-bold text-[#2E7D32] mt-0.5">100% Verified</div>
            <div className="text-[11px] text-[#777] mt-0.5">IRCC DLI Numbers Listed</div>
          </div>
          <div className="bg-white border border-[#E7E2DE] rounded-[16px] p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Post-Grad Work Permit</div>
            <div className="text-[24px] font-bold text-[#1565C0] mt-0.5">Up to 3 Yrs</div>
            <div className="text-[11px] text-[#777] mt-0.5">No Employer Sponsorship</div>
          </div>
          <div className="bg-white border border-[#E7E2DE] rounded-[16px] p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Expected Salary (CS/Eng)</div>
            <div className="text-[24px] font-bold text-[#690B1B] mt-0.5">CAD 65K–120K+</div>
            <div className="text-[11px] text-[#777] mt-0.5">High Co-Op & STEM ROI</div>
          </div>
        </div>

        {/* ══ SEARCH & FILTER BAR ═════════════════════════════════════ */}
        <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-6 mb-6 shadow-xs">
          {/* Top row: Search input + dropdown filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <svg className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search university, city, province, major, DLI..."
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
                onChange={(e) => setUniTypeFilter(e.target.value as 'All' | 'Public' | 'Private')}
                className="w-full h-[44px] px-3 rounded-[12px] bg-[#FAF8F6] border border-[#E2DDD7] text-[12px] sm:text-[13px] text-[#333] font-medium focus:outline-none focus:border-[#690B1B]"
              >
                <option value="All">All Types</option>
                <option value="Public">Public Institutions</option>
                <option value="Private">Private Institutions</option>
              </select>
            </div>

            {/* DLI Filter */}
            <div className="md:col-span-3">
              <select
                value={dliFilter}
                onChange={(e) => setDliFilter(e.target.value as 'All' | 'DLI Verified' | 'Unverified')}
                className="w-full h-[44px] px-3 rounded-[12px] bg-[#FAF8F6] border border-[#E2DDD7] text-[12px] sm:text-[13px] text-[#333] font-medium focus:outline-none focus:border-[#690B1B]"
              >
                <option value="All">DLI Status: All</option>
                <option value="DLI Verified">DLI Verified (PGWP Eligible)</option>
                <option value="Unverified">Not Verified</option>
              </select>
            </div>

            {/* Program Level Filter */}
            <div className="md:col-span-3">
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value as 'All' | 'Undergraduate' | 'Postgraduate' | 'Doctoral')}
                className="w-full h-[44px] px-3 rounded-[12px] bg-[#FAF8F6] border border-[#E2DDD7] text-[12px] sm:text-[13px] text-[#333] font-medium focus:outline-none focus:border-[#690B1B]"
              >
                <option value="All">Program Level: All</option>
                <option value="Undergraduate">Offers Undergraduate</option>
                <option value="Postgraduate">Offers Postgraduate</option>
                <option value="Doctoral">Offers Doctoral</option>
              </select>
            </div>
          </div>

          {/* Province Filter Pills */}
          <div className="mt-4 pt-3.5 border-t border-[#F0EBE5] flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider shrink-0 mr-1">
              Province:
            </span>
            {availableProvinces.map((province) => (
              <button
                key={province}
                type="button"
                onClick={() => setSelectedProvince(province)}
                className={`h-[32px] px-3.5 rounded-full text-[11px] sm:text-[12px] font-bold transition-all shrink-0 border ${
                  selectedProvince === province
                    ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-2xs'
                    : 'bg-[#FAF8F6] text-[#555] border-[#E5E0D9] hover:border-[#690B1B]/40'
                }`}
              >
                {province}
              </button>
            ))}
          </div>

          {/* Active Filter Meta Bar */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#666]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#690B1B]">{filteredUniversities.length}</span> of{' '}
              <span>{universities.length} Canadian Universities listed</span>
              {(searchQuery || selectedProvince !== 'All' || uniTypeFilter !== 'All' || dliFilter !== 'All' || programFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedProvince('All');
                    setUniTypeFilter('All');
                    setDliFilter('All');
                    setProgramFilter('All');
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
                DLI Verified
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-[#1565C0]">
                <span className="w-2 h-2 rounded-full bg-[#1565C0]" />
                PGWP Eligible
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-[#6A1B9A]">
                <span className="w-2 h-2 rounded-full bg-[#6A1B9A]" />
                GIC CAD 20,635
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
                    setSelectedProvince('All');
                    setUniTypeFilter('All');
                    setDliFilter('All');
                    setProgramFilter('All');
                  }}
                  className="px-5 py-2 rounded-full bg-[#690B1B] text-white text-[12px] font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredUniversities.map((uni) => {
                const isExpanded = !!expandedCards[uni.institutionName];
                const activeTab = activeTabByCard[uni.institutionName] || 'all';
                const isCompared = compareList.some((c) => c.institutionName === uni.institutionName);
                const isPublic = uni.publicPrivate.toLowerCase().includes('public');

                return (
                  <div
                    key={uni.institutionId}
                    className={`bg-white border rounded-[20px] overflow-hidden transition-all duration-200 ${
                      isExpanded
                        ? 'border-[#690B1B]/40 shadow-md ring-1 ring-[#690B1B]/10'
                        : 'border-[#E7E2DE] hover:border-[#690B1B]/30 hover:shadow-xs'
                    }`}
                  >
                    {/* ── CARD HEADER ── */}
                    <div className="p-5 sm:p-7">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        {/* Left Info Column */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-mono text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-2.5 py-0.5 rounded-md border border-[#E8C4CC]">
                              {uni.institutionId}
                            </span>
                            <Badge variant="blue">{uni.province}, {uni.countryCode}</Badge>
                            <Badge variant="yellow">{uni.qsRanking}</Badge>
                            <Badge variant="green">
                              Acceptance: {uni.acceptanceRate.split('(')[0].trim()}
                            </Badge>
                            <Badge variant={isPublic ? 'blue' : 'yellow'}>
                              {isPublic ? 'Public' : 'Private'}
                            </Badge>
                            {uni.dliNumber && uni.dliNumber !== 'N/A' && (
                              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                                DLI: {uni.dliNumber}
                              </span>
                            )}
                          </div>

                          <h3 className="text-[20px] sm:text-[24px] font-bold text-[#111111] leading-tight">
                            {uni.institutionName}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[12px] text-[#666666]">
                            <a
                              href={uni.officialWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#690B1B] font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              <span>{uni.domain}</span>
                              <span className="text-[10px]">↗</span>
                            </a>
                            <span>•</span>
                            <span className="text-[#444]">Avg GPA: <strong>{uni.avgGpa}</strong></span>
                            <span>•</span>
                            <span className="text-[#444]">Language: <strong className="text-[#1565C0]">{uni.languageOfInstruction}</strong></span>
                            <span>•</span>
                            <span className="text-[#444]">City: <strong>{uni.city}</strong></span>
                          </div>
                        </div>

                        {/* Right side CTA / Actions (Responsive for Mobile & Tablet) */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F0ECE7] w-full md:w-auto justify-end">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#DDD7CE] text-[11px] font-semibold text-[#555] cursor-pointer hover:bg-white select-none">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={() => toggleCompare(uni)}
                              className="rounded text-[#690B1B] focus:ring-[#690B1B] w-3.5 h-3.5"
                            />
                            <span>Compare</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setSelectedUniModal(uni)}
                            className="h-[36px] px-3.5 rounded-[10px] bg-[#FAF8F5] border border-[#DDD7CE] hover:border-[#690B1B] text-[#333] text-[12px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>🔍 Deep Dive</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyProfile(uni)}
                            className="h-[36px] px-3 rounded-[10px] bg-[#FAF8F5] border border-[#DDD7CE] hover:border-[#690B1B] text-[#333] text-[12px] font-bold transition-colors cursor-pointer"
                            title="Copy 34-point profile to clipboard"
                          >
                            📋
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleExpand(uni.institutionName)}
                            className={`h-[36px] px-4 rounded-[10px] text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial cursor-pointer ${
                              isExpanded
                                ? 'bg-[#690B1B] text-white shadow-xs'
                                : 'bg-[#111217] text-white hover:bg-[#690B1B]'
                            }`}
                          >
                            <span>{isExpanded ? 'Collapse ▴' : 'View All 34 Columns ▾'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Key stats summary strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4 pt-4 border-t border-[#EFECE8]">
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#20 Tuition</div>
                          <div className="text-[12.5px] font-bold text-[#111] mt-0.5 truncate" title={uni.tuition}>{uni.tuition}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#21 Living Costs</div>
                          <div className="text-[12.5px] font-bold text-[#111] mt-0.5 truncate" title={uni.livingCosts}>{uni.livingCosts}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#9 DLI Number</div>
                          <div className="text-[12.5px] font-bold text-[#2E7D32] mt-0.5 truncate" title={uni.dliNumber}>{uni.dliNumber}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#19 Acceptance</div>
                          <div className="text-[12.5px] font-bold text-[#690B1B] mt-0.5 truncate" title={uni.acceptanceRate}>{uni.acceptanceRate}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#33 Expected Salary</div>
                          <div className="text-[12.5px] font-bold text-[#2E7D32] mt-0.5 truncate" title={uni.expectedSalary}>{uni.expectedSalary}</div>
                        </div>
                        <div className="bg-white/80 rounded-[10px] p-2.5 border border-[#ECE7E1]">
                          <div className="text-[9.5px] uppercase tracking-wider text-[#888] font-bold">#34 ROI Analysis</div>
                          <div className="text-[12.5px] font-bold text-[#690B1B] mt-0.5 truncate" title={uni.roi}>{uni.roi.slice(0, 24)}...</div>
                        </div>
                      </div>
                    </div>

                    {/* ── EXPANDED 34-COLUMN DOSSIER ── */}
                    {isExpanded && (
                      <div className="border-t border-[#EAE5DF] bg-[#FCFBF9]">
                        {/* Category Nav Tabs inside card */}
                        <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-[#EAE5DF] bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                          {[
                            { id: 'all', label: 'All 34 Parameters' },
                            { id: 'admissions', label: 'Admissions & Test Scores' },
                            { id: 'costs', label: 'Financials & Costs' },
                            { id: 'outcomes', label: 'ROI & Career Outcomes' },
                            { id: 'institution', label: 'Institution & Eligibility' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setCardTab(uni.institutionName, t.id)}
                              className={`h-[34px] px-3.5 rounded-lg text-[11px] sm:text-[12px] font-bold transition-all shrink-0 cursor-pointer ${
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

                          {/* 1. INSTITUTION INFO GROUP */}
                          {(activeTab === 'institution' || activeTab === 'all') && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Institution Details (Columns #1 to #8)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <FieldBox columnNumber={1} label="Institution ID">
                                  <span className="font-mono text-[#690B1B] font-bold">{uni.institutionId}</span>
                                </FieldBox>

                                <FieldBox columnNumber={2} label="Institution Name">
                                  <span className="font-bold">{uni.institutionName}</span>
                                </FieldBox>

                                <FieldBox columnNumber={3} label="Province">
                                  <span className="font-medium">{uni.province}</span>
                                </FieldBox>

                                <FieldBox columnNumber={4} label="City / Campus">
                                  <span>{uni.city}</span>
                                </FieldBox>

                                <FieldBox columnNumber={5} label="Institution Type">
                                  <Badge variant="blue">{uni.institutionType}</Badge>
                                </FieldBox>

                                <FieldBox columnNumber={6} label="Public / Private">
                                  <Badge variant={isPublic ? 'blue' : 'yellow'}>
                                    {uni.publicPrivate}
                                  </Badge>
                                </FieldBox>

                                <FieldBox columnNumber={7} label="Official Website">
                                  <a
                                    href={uni.officialWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#690B1B] font-bold hover:underline flex items-center gap-1"
                                  >
                                    {uni.domain} ↗
                                  </a>
                                </FieldBox>

                                <FieldBox columnNumber={8} label="Domain">
                                  <span className="font-mono text-[#555]">{uni.domain}</span>
                                </FieldBox>
                              </div>
                            </div>
                          )}

                          {/* 2. ELIGIBILITY & PROGRAMS */}
                          {(activeTab === 'institution' || activeTab === 'eligibility' || activeTab === 'all') && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Eligibility, DLI & Programs (Columns #9 to #17)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <FieldBox columnNumber={9} label="DLI Number" className="bg-[#E8F5E9]/40 border-[#A5D6A7]">
                                  <span className="font-mono font-bold text-[#2E7D32]">{uni.dliNumber}</span>
                                </FieldBox>

                                <FieldBox columnNumber={10} label="International Student Eligible" className="md:col-span-2">
                                  <StatusIndicator value={uni.internationalStudentEligible} />
                                </FieldBox>

                                <FieldBox columnNumber={11} label="Offers Undergraduate">
                                  <StatusIndicator value={uni.offersUndergraduate} />
                                </FieldBox>

                                <FieldBox columnNumber={12} label="Offers Postgraduate">
                                  <StatusIndicator value={uni.offersPostgraduate} />
                                </FieldBox>

                                <FieldBox columnNumber={13} label="Offers Doctoral">
                                  <StatusIndicator value={uni.offersDoctoral} />
                                </FieldBox>

                                <FieldBox columnNumber={14} label="Language of Instruction">
                                  <span className="font-bold text-[#1565C0]">{uni.languageOfInstruction}</span>
                                </FieldBox>

                                <FieldBox columnNumber={15} label="Last Verified Date">
                                  <span className="text-[#888]">{uni.lastVerifiedDate}</span>
                                </FieldBox>

                                <FieldBox columnNumber={16} label="Country">
                                  <span>🇨🇦 {uni.country}</span>
                                </FieldBox>

                                <FieldBox columnNumber={17} label="Country Code">
                                  <span className="font-mono font-bold">{uni.countryCode}</span>
                                </FieldBox>
                              </div>
                            </div>
                          )}

                          {/* 3. TUITION, COSTS & FINANCIALS */}
                          {(activeTab === 'costs' || activeTab === 'all') && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Tuition, Living Costs & Total Cost (Columns #20, #21, #25, #31)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FieldBox columnNumber={20} label="Tuition Fees" className="md:col-span-2">
                                  <span className="font-bold text-[14px] text-[#111]">{uni.tuition}</span>
                                </FieldBox>

                                <FieldBox columnNumber={21} label="Living Costs" className="md:col-span-2">
                                  <span>{uni.livingCosts}</span>
                                </FieldBox>

                                <FieldBox columnNumber={25} label="Avg Need-Based Grant">
                                  <span className="font-bold text-[#2E7D32]">{uni.avgNeedBasedGrant}</span>
                                </FieldBox>

                                <FieldBox columnNumber={31} label="Total Cost (4-Year Estimate)" className="bg-[#EFF5FF]/60 border-[#BFDBFE]">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <span className="font-bold text-[14px] text-[#1565C0]">{uni.totalCost}</span>
                                    <span className="text-[10px] font-bold bg-white text-[#1565C0] px-2.5 py-1 rounded-md border border-[#BFDBFE] self-start sm:self-auto">
                                      GIC: CAD 20,635 Required
                                    </span>
                                  </div>
                                </FieldBox>
                              </div>
                            </div>
                          )}

                          {/* 4. ACADEMICS & ENTRY REQUIREMENTS */}
                          {(activeTab === 'academics' || activeTab === 'admissions' || activeTab === 'all') && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Rankings, GPA, SAT, Writing & Essays (Columns #18–#19, #22, #26–#29)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <FieldBox columnNumber={18} label="QS Ranking">
                                  <span className="font-bold text-[#690B1B]">{uni.qsRanking}</span>
                                </FieldBox>

                                <FieldBox columnNumber={19} label="Acceptance Rate">
                                  <span className="font-bold text-[#111]">{uni.acceptanceRate}</span>
                                </FieldBox>

                                <FieldBox columnNumber={22} label="Popular Majors" className="md:col-span-3 lg:col-span-3">
                                  <div className="flex flex-wrap gap-1.5">
                                    {uni.popularMajors.split(',').map((major) => (
                                      <span key={major.trim()} className="text-[10px] sm:text-[11px] font-semibold bg-[#F3E5F5] text-[#6A1B9A] border border-[#CE93D8] px-2 py-0.5 rounded-full">
                                        {major.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </FieldBox>

                                <FieldBox columnNumber={26} label="Avg GPA Requirement">
                                  <span className="font-bold text-[#111]">{uni.avgGpa}</span>
                                </FieldBox>

                                <FieldBox columnNumber={27} label="SAT Score">
                                  <span className="font-bold text-[#1565C0]">{uni.satScore}</span>
                                </FieldBox>

                                <FieldBox columnNumber={28} label="Writing / Language Requirements" className="md:col-span-3 lg:col-span-3">
                                  <span className="font-medium text-[#111]">{uni.writingRequirements}</span>
                                </FieldBox>

                                <FieldBox columnNumber={29} label="Required Essay Prompts & Details" className="md:col-span-3 lg:col-span-3">
                                  <p className="text-[#333] leading-relaxed">{uni.requiredEssayPrompts}</p>
                                </FieldBox>
                              </div>
                            </div>
                          )}

                          {/* 5. OUTCOMES & ROI */}
                          {(activeTab === 'outcomes' || activeTab === 'all') && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#C9A55D]">
                                  Scholarships, Career Outcomes, Salary & ROI (Columns #30, #32–#34)
                                </span>
                              </div>

                              <FieldBox columnNumber={30} label="Scholarships Available" className="bg-[#E8F5E9]/40 border-[#A5D6A7]">
                                <p className="text-[#333] font-medium leading-relaxed">{uni.scholarships}</p>
                              </FieldBox>

                              <FieldBox columnNumber={32} label="Career Outcomes">
                                <p className="text-[#333] leading-relaxed">{uni.careerOutcomes}</p>
                              </FieldBox>

                              <FieldBox columnNumber={33} label="Expected Salary">
                                <span className="font-bold text-[14px] text-[#2E7D32]">{uni.expectedSalary}</span>
                              </FieldBox>

                              <div className="p-4 rounded-[14px] bg-[#FFF8E6] border border-[#FFCC80]">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309] flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-[#B45309]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Column #34: Return on Investment (ROI)
                                  </span>
                                  <span className="text-[9px] font-black text-[#B45309] bg-white px-2 py-0.5 rounded">
                                    ROI Analysis
                                  </span>
                                </div>
                                <p className="text-[12px] sm:text-[13px] text-[#78350F] leading-relaxed font-medium">
                                  {uni.roi}
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
                                <span>📄 View Full 34-Point Dossier</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyProfile(uni)}
                                className="h-[36px] px-3.5 rounded-[10px] bg-[#FAF8F6] border border-[#DCD6CE] text-[#555] text-[12px] font-semibold hover:border-[#690B1B] hover:text-[#690B1B] transition-all"
                              >
                                {copiedName === uni.institutionName ? '✓ Copied!' : '📋 Copy Profile'}
                              </button>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <a
                                href={uni.officialWebsite}
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

        {/* ══ FULL 34-COLUMN MATRIX / TABLE VIEW ══════════════════════ */}
        {viewMode === 'table' && (
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#EAE5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] sm:text-[17px] font-bold text-[#111]">
                  Complete 34-Parameter Admissions Matrix
                </h3>
                <p className="text-[12px] text-[#777]">
                  Horizontal scrolling table comparing all dataset columns. Click any row for deep-dive.
                </p>
              </div>
              <div className="text-[11px] text-[#888] font-semibold flex items-center gap-1.5 shrink-0">
                <span>← Scroll horizontally to view all 34 columns →</span>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-[12px] text-left border-collapse min-w-[4200px]">
                <thead>
                  <tr className="bg-[#FAF8F6] text-[#444] border-b border-[#E7E2DE] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                    {/* Sticky Column 1: Institution Name */}
                    <th className="sticky left-0 z-20 bg-[#FAF8F6] py-3.5 px-4 shadow-[2px_0_5px_rgba(0,0,0,0.03)] min-w-[260px]">
                      #1 Institution ID
                    </th>
                    <th className="py-3.5 px-3 min-w-[240px]">#2 Institution Name</th>
                    <th className="py-3.5 px-3 min-w-[130px]">#3 Province</th>
                    <th className="py-3.5 px-3 min-w-[120px]">#4 City</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#5 Institution Type</th>
                    <th className="py-3.5 px-3 min-w-[130px]">#6 Public/Private</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#7 Official Website</th>
                    <th className="py-3.5 px-3 min-w-[130px]">#8 Domain</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#9 DLI Number</th>
                    <th className="py-3.5 px-3 min-w-[200px]">#10 Intl. Student Eligible</th>
                    <th className="py-3.5 px-3 min-w-[110px]">#11 Undergrad</th>
                    <th className="py-3.5 px-3 min-w-[110px]">#12 Postgrad</th>
                    <th className="py-3.5 px-3 min-w-[110px]">#13 Doctoral</th>
                    <th className="py-3.5 px-3 min-w-[140px]">#14 Language</th>
                    <th className="py-3.5 px-3 min-w-[120px]">#15 Verified</th>
                    <th className="py-3.5 px-3 min-w-[100px]">#16 Country</th>
                    <th className="py-3.5 px-3 min-w-[80px]">#17 Code</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#18 QS Ranking</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#19 Acceptance Rate</th>
                    <th className="py-3.5 px-3 min-w-[220px]">#20 Tuition</th>
                    <th className="py-3.5 px-3 min-w-[200px]">#21 Living Costs</th>
                    <th className="py-3.5 px-3 min-w-[250px]">#22 Popular Majors</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#23 Banner Image</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#24 Banner Alt</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#25 Avg Need Grant</th>
                    <th className="py-3.5 px-3 min-w-[150px]">#26 Avg GPA</th>
                    <th className="py-3.5 px-3 min-w-[160px]">#27 SAT Score</th>
                    <th className="py-3.5 px-3 min-w-[220px]">#28 Writing Req.</th>
                    <th className="py-3.5 px-3 min-w-[250px]">#29 Essay Prompts</th>
                    <th className="py-3.5 px-3 min-w-[220px]">#30 Scholarships</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#31 Total Cost</th>
                    <th className="py-3.5 px-3 min-w-[220px]">#32 Career Outcomes</th>
                    <th className="py-3.5 px-3 min-w-[180px]">#33 Expected Salary</th>
                    <th className="py-3.5 px-4 min-w-[250px]">#34 ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DF]">
                  {filteredUniversities.map((uni) => (
                    <tr
                      key={uni.institutionId}
                      onClick={() => setSelectedUniModal(uni)}
                      className="hover:bg-[#FAF8F8] transition-colors cursor-pointer group"
                    >
                      {/* Sticky Column 1 */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-[#FAF8F8] py-3.5 px-4 shadow-[2px_0_5px_rgba(0,0,0,0.03)] font-mono text-[#690B1B] font-bold">
                        {uni.institutionId}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#111]">{uni.institutionName}</td>
                      <td className="py-3.5 px-3 font-medium text-[#333]">{uni.province}</td>
                      <td className="py-3.5 px-3 text-[#555]">{uni.city}</td>
                      <td className="py-3.5 px-3 text-[#555]">{uni.institutionType}</td>
                      <td className="py-3.5 px-3">
                        <Badge variant={uni.publicPrivate.toLowerCase().includes('public') ? 'blue' : 'yellow'}>
                          {uni.publicPrivate.toLowerCase().includes('public') ? 'Public' : 'Private'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3">
                        <a href={uni.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-[#690B1B] hover:underline text-[11px]" onClick={(e) => e.stopPropagation()}>
                          {uni.domain} ↗
                        </a>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-[#555]">{uni.domain}</td>
                      <td className="py-3.5 px-3 font-mono text-[#2E7D32] font-semibold text-[11px]">{uni.dliNumber}</td>
                      <td className="py-3.5 px-3 text-[11px]">
                        <StatusIndicator value={uni.internationalStudentEligible.split(';')[0]} />
                      </td>
                      <td className="py-3.5 px-3"><StatusIndicator value={uni.offersUndergraduate} /></td>
                      <td className="py-3.5 px-3"><StatusIndicator value={uni.offersPostgraduate} /></td>
                      <td className="py-3.5 px-3"><StatusIndicator value={uni.offersDoctoral} /></td>
                      <td className="py-3.5 px-3 font-medium text-[#1565C0]">{uni.languageOfInstruction}</td>
                      <td className="py-3.5 px-3 text-[#888]">{uni.lastVerifiedDate}</td>
                      <td className="py-3.5 px-3">🇨🇦 {uni.country}</td>
                      <td className="py-3.5 px-3 font-mono font-bold">{uni.countryCode}</td>
                      <td className="py-3.5 px-3 font-bold text-[#690B1B]">{uni.qsRanking}</td>
                      <td className="py-3.5 px-3 font-medium text-[#111]">{uni.acceptanceRate}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[220px] truncate" title={uni.tuition}>{uni.tuition}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[200px] truncate" title={uni.livingCosts}>{uni.livingCosts}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[250px] truncate" title={uni.popularMajors}>{uni.popularMajors}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[180px] truncate" title={uni.bannerImage}>{uni.bannerImage ? 'Available' : '—'}</td>
                      <td className="py-3.5 px-3 text-[11px] text-[#888] max-w-[180px] truncate" title={uni.bannerImageAlt}>{uni.bannerImageAlt}</td>
                      <td className="py-3.5 px-3 text-[#2E7D32] font-medium text-[11px]">{uni.avgNeedBasedGrant}</td>
                      <td className="py-3.5 px-3 font-medium text-[11px]">{uni.avgGpa}</td>
                      <td className="py-3.5 px-3 font-medium text-[#1565C0] text-[11px]">{uni.satScore}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[220px] truncate" title={uni.writingRequirements}>{uni.writingRequirements}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[250px] truncate" title={uni.requiredEssayPrompts}>{uni.requiredEssayPrompts}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[220px] truncate" title={uni.scholarships}>{uni.scholarships}</td>
                      <td className="py-3.5 px-3 font-bold text-[#1565C0]">{uni.totalCost}</td>
                      <td className="py-3.5 px-3 text-[11px] max-w-[220px] truncate" title={uni.careerOutcomes}>{uni.careerOutcomes}</td>
                      <td className="py-3.5 px-3 font-bold text-[#2E7D32]">{uni.expectedSalary}</td>
                      <td className="py-3.5 px-4 text-[11px] text-[#B45309] font-medium max-w-[250px] truncate" title={uni.roi}>
                        {uni.roi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ 34 DATASET COLUMNS GLOSSARY & GUIDE ══════════════════════ */}
        <div className="mt-12 bg-white border border-[#E7E2DE] rounded-[20px] p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-[#C9A55D] text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
            Dataset Knowledge Base
          </div>
          <h3 className="text-[20px] sm:text-[24px] font-bold text-[#111] mb-2">
            The 34 Canadian Admission Parameters Explained
          </h3>
          <p className="text-[13px] sm:text-[14px] text-[#777] mb-6 max-w-[720px]">
            To ensure zero confusion for international students, here is what each column in our Canada dataset represents:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-[12px]">
            {[
              { col: '#1 Institution ID', def: 'Unique identifier for each Canadian institution in the Abroad Simplified database (e.g., CA-INST-001).' },
              { col: '#2 Institution Name', def: 'Official name of the university or college as registered with the Canadian government.' },
              { col: '#3 Province', def: 'Canadian province or territory where the institution is located. Affects tuition and immigration programs.' },
              { col: '#4 City', def: 'Municipal location or campus name. Impacts living costs and regional job opportunities.' },
              { col: '#5 Institution Type', def: 'Classification: Public University, Private University, College, Polytechnic, etc.' },
              { col: '#6 Public / Private', def: 'Whether the institution is publicly funded (government-supported) or privately operated.' },
              { col: '#7 Official Website', def: 'The institution\'s official web address for admissions and program information.' },
              { col: '#8 Domain', def: 'The institution\'s registered internet domain name.' },
              { col: '#9 DLI Number', def: 'Designated Learning Institution number from IRCC. Required for study permit and PGWP eligibility.' },
              { col: '#10 International Eligible', def: 'Whether the institution accepts international students with study permits and PGWP eligibility.' },
              { col: '#11 Offers Undergraduate', def: 'Whether the institution offers Bachelor\'s degree programs.' },
              { col: '#12 Offers Postgraduate', def: 'Whether the institution offers Master\'s and professional graduate programs.' },
              { col: '#13 Offers Doctoral', def: 'Whether the institution offers PhD and doctoral research programs.' },
              { col: '#14 Language of Instruction', def: 'Primary teaching language: English, French, or Bilingual (English + French).' },
              { col: '#15 Last Verified Date', def: 'Date when the dataset entry was last verified against official sources.' },
              { col: '#16 Country', def: 'Always "Canada" for this dataset — included for cross-country dataset compatibility.' },
              { col: '#17 Country Code', def: 'ISO 3166-1 alpha-2 code: CA — used in data interchange and API systems.' },
              { col: '#18 QS Ranking', def: 'QS World University Rankings position (or Canadian domestic ranking where QS data unavailable).' },
              { col: '#19 Acceptance Rate', def: 'Approximate percentage of applicants admitted. Lower rates indicate higher selectivity.' },
              { col: '#20 Tuition', def: 'Annual tuition fees for international and domestic students. Varies significantly by program.' },
              { col: '#21 Living Costs', def: 'Estimated annual living expenses including housing, food, and transportation.' },
              { col: '#22 Popular Majors', def: 'Most sought-after programs and fields of study at the institution.' },
              { col: '#23 Banner Image', def: 'URL to an institutional banner or campus image for visual identification.' },
              { col: '#24 Banner Image Alt', def: 'Alt text description for the banner image (accessibility compliance).' },
              { col: '#25 Avg Need-Based Grant', def: 'Average financial aid amount awarded based on demonstrated financial need.' },
              { col: '#26 Avg GPA', def: 'Typical GPA range required for competitive admission (on 4.0 scale).' },
              { col: '#27 SAT Score', def: 'SAT score range for applicants. Many Canadian universities make SAT optional for Canadian applicants.' },
              { col: '#28 Writing Requirements', def: 'Language proficiency requirements (IELTS, TOEFL, PTE, Duolingo) and writing components.' },
              { col: '#29 Required Essay Prompts', def: 'Details on supplementary applications, personal statements, and interview requirements.' },
              { col: '#30 Scholarships', def: 'Available merit-based, need-based, and entrance scholarships with amounts and eligibility.' },
              { col: '#31 Total Cost', def: 'Estimated total cost of attendance including tuition and living for the full degree duration.' },
              { col: '#32 Career Outcomes', def: 'Employment rates, top recruiters, and career placement data for graduates.' },
              { col: '#33 Expected Salary', def: 'Starting salary range for graduates, varying by program and industry.' },
              { col: '#34 ROI', def: 'Return on Investment analysis: break-even period, cost vs. earnings, and long-term financial outlook.' },
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
                34-Point Comprehensive Admissions Dossier
              </div>

              <h2 className="text-[20px] sm:text-[26px] md:text-[28px] font-bold text-[#111] mb-1 leading-snug pr-8">
                {selectedUniModal.institutionName}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] text-[#777] mb-4 sm:mb-6">
                <span>{selectedUniModal.city}, {selectedUniModal.province}</span>
                <span>•</span>
                <Badge variant={selectedUniModal.publicPrivate.toLowerCase().includes('public') ? 'blue' : 'yellow'}>
                  {selectedUniModal.publicPrivate.toLowerCase().includes('public') ? 'Public' : 'Private'}
                </Badge>
                <span>•</span>
                <span className="font-bold text-[#690B1B]">{selectedUniModal.qsRanking}</span>
                <span>•</span>
                <Badge variant="green">DLI: {selectedUniModal.dliNumber}</Badge>
              </div>

              {/* All 34 Columns in a clean 2-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 text-[12px]">
                <FieldBox columnNumber={1} label="Institution ID"><span className="font-mono">{selectedUniModal.institutionId}</span></FieldBox>
                <FieldBox columnNumber={2} label="Institution Name">{selectedUniModal.institutionName}</FieldBox>
                <FieldBox columnNumber={3} label="Province">{selectedUniModal.province}</FieldBox>
                <FieldBox columnNumber={4} label="City / Campus">{selectedUniModal.city}</FieldBox>
                <FieldBox columnNumber={5} label="Institution Type">{selectedUniModal.institutionType}</FieldBox>
                <FieldBox columnNumber={6} label="Public / Private">{selectedUniModal.publicPrivate}</FieldBox>
                <FieldBox columnNumber={7} label="Official Website">
                  <a href={selectedUniModal.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-[#690B1B] font-bold hover:underline">
                    {selectedUniModal.domain} ↗
                  </a>
                </FieldBox>
                <FieldBox columnNumber={8} label="Domain"><span className="font-mono">{selectedUniModal.domain}</span></FieldBox>
                <FieldBox columnNumber={9} label="DLI Number" className="font-bold text-[#2E7D32]">{selectedUniModal.dliNumber}</FieldBox>
                <FieldBox columnNumber={10} label="International Student Eligible">{selectedUniModal.internationalStudentEligible}</FieldBox>
                <FieldBox columnNumber={11} label="Offers Undergraduate">{selectedUniModal.offersUndergraduate}</FieldBox>
                <FieldBox columnNumber={12} label="Offers Postgraduate">{selectedUniModal.offersPostgraduate}</FieldBox>
                <FieldBox columnNumber={13} label="Offers Doctoral">{selectedUniModal.offersDoctoral}</FieldBox>
                <FieldBox columnNumber={14} label="Language of Instruction">{selectedUniModal.languageOfInstruction}</FieldBox>
                <FieldBox columnNumber={15} label="Last Verified Date">{selectedUniModal.lastVerifiedDate}</FieldBox>
                <FieldBox columnNumber={16} label="Country">🇨🇦 {selectedUniModal.country}</FieldBox>
                <FieldBox columnNumber={17} label="Country Code">{selectedUniModal.countryCode}</FieldBox>
                <FieldBox columnNumber={18} label="QS Ranking" className="font-bold text-[#690B1B]">{selectedUniModal.qsRanking}</FieldBox>
                <FieldBox columnNumber={19} label="Acceptance Rate" className="font-bold text-[#111]">{selectedUniModal.acceptanceRate}</FieldBox>
                <FieldBox columnNumber={20} label="Tuition Fees" className="sm:col-span-2">{selectedUniModal.tuition}</FieldBox>
                <FieldBox columnNumber={21} label="Living Costs" className="sm:col-span-2">{selectedUniModal.livingCosts}</FieldBox>
                <FieldBox columnNumber={22} label="Popular Majors" className="sm:col-span-2">{selectedUniModal.popularMajors}</FieldBox>
                <FieldBox columnNumber={23} label="Banner Image">{selectedUniModal.bannerImage || '—'}</FieldBox>
                <FieldBox columnNumber={24} label="Banner Image Alt">{selectedUniModal.bannerImageAlt}</FieldBox>
                <FieldBox columnNumber={25} label="Avg Need-Based Grant" className="font-bold text-[#2E7D32]">{selectedUniModal.avgNeedBasedGrant}</FieldBox>
                <FieldBox columnNumber={26} label="Avg GPA">{selectedUniModal.avgGpa}</FieldBox>
                <FieldBox columnNumber={27} label="SAT Score" className="font-bold text-[#1565C0]">{selectedUniModal.satScore}</FieldBox>
                <FieldBox columnNumber={28} label="Writing / Language Requirements" className="sm:col-span-2">{selectedUniModal.writingRequirements}</FieldBox>
                <FieldBox columnNumber={29} label="Required Essay Prompts" className="sm:col-span-2">{selectedUniModal.requiredEssayPrompts}</FieldBox>
                <FieldBox columnNumber={30} label="Scholarships" className="sm:col-span-2 bg-[#E8F5E9]/40 border-[#A5D6A7]">{selectedUniModal.scholarships}</FieldBox>
                <FieldBox columnNumber={31} label="Total Cost" className="font-bold text-[#1565C0]">{selectedUniModal.totalCost}</FieldBox>
                <FieldBox columnNumber={32} label="Career Outcomes">{selectedUniModal.careerOutcomes}</FieldBox>
                <FieldBox columnNumber={33} label="Expected Salary" className="font-bold text-[#2E7D32]">{selectedUniModal.expectedSalary}</FieldBox>
                <FieldBox columnNumber={34} label="ROI" className="sm:col-span-2 bg-[#FFF8E6] border-[#FFCC80] text-[#78350F]">{selectedUniModal.roi}</FieldBox>
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
                Side-by-Side 34-Parameter Comparator
              </div>
              <h2 className="text-[20px] sm:text-[24px] md:text-[26px] font-bold text-[#111] mb-2 sm:mb-4 pr-8">
                Comparing {compareList.length} Canadian Universities
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
                        <th key={u.institutionId} className="py-3 px-3 sm:px-4 font-bold text-[#690B1B] text-[13px] sm:text-[14px] min-w-[200px]">
                          {u.institutionName}
                          <div className="text-[11px] text-[#777] font-normal">{u.city}, {u.province}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DF]">
                    {[
                      { key: 'institutionId', label: '#1 Institution ID' },
                      { key: 'province', label: '#3 Province' },
                      { key: 'institutionType', label: '#5 Institution Type' },
                      { key: 'publicPrivate', label: '#6 Public/Private' },
                      { key: 'dliNumber', label: '#9 DLI Number' },
                      { key: 'internationalStudentEligible', label: '#10 Intl. Eligible' },
                      { key: 'offersUndergraduate', label: '#11 Undergraduate' },
                      { key: 'offersPostgraduate', label: '#12 Postgraduate' },
                      { key: 'offersDoctoral', label: '#13 Doctoral' },
                      { key: 'languageOfInstruction', label: '#14 Language' },
                      { key: 'qsRanking', label: '#18 QS Ranking' },
                      { key: 'acceptanceRate', label: '#19 Acceptance Rate' },
                      { key: 'tuition', label: '#20 Tuition' },
                      { key: 'livingCosts', label: '#21 Living Costs' },
                      { key: 'popularMajors', label: '#22 Popular Majors' },
                      { key: 'avgNeedBasedGrant', label: '#25 Avg Grant' },
                      { key: 'avgGpa', label: '#26 Avg GPA' },
                      { key: 'satScore', label: '#27 SAT Score' },
                      { key: 'writingRequirements', label: '#28 Writing Req.' },
                      { key: 'requiredEssayPrompts', label: '#29 Essay Prompts' },
                      { key: 'scholarships', label: '#30 Scholarships' },
                      { key: 'totalCost', label: '#31 Total Cost' },
                      { key: 'careerOutcomes', label: '#32 Career Outcomes' },
                      { key: 'expectedSalary', label: '#33 Expected Salary' },
                      { key: 'roi', label: '#34 ROI' },
                    ].map((row) => (
                      <tr key={row.key} className="hover:bg-[#FAF8F8]">
                        <td className="py-3 px-3 sm:px-4 font-bold text-[#555] bg-[#FAF8F6] sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.06)] text-[11px] sm:text-[12px]">{row.label}</td>
                        {compareList.map((u) => (
                          <td key={u.institutionId} className="py-3 px-3 sm:px-4 leading-relaxed text-[11px] sm:text-[12px]">
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
