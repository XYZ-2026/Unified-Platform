'use client';

import React, { use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COUNTRY_GUIDES, CountryGuideData } from '@/data/countryGuides';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Globe,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Briefcase,
  HelpCircle,
  Award,
  ChevronDown,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   STATUS BADGE HELPER
══════════════════════════════════════════════════════════════ */
function StatusBadge({
  text,
  variant,
}: {
  text: string;
  variant?: 'required' | 'usually' | 'specific' | 'optional' | 'country' | 'varies' | 'typical' | 'competitive';
}) {
  const lower = (variant || text).toLowerCase();

  if (lower.includes('required') && !lower.includes('usually') && !lower.includes('not')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#E8F8F0] text-[#0E7044] border border-[#C2EBD6]">
        {text}
      </span>
    );
  }
  if (lower.includes('usually') || lower.includes('typical')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FDF0EC] text-[#B83E1B] border border-[#FADCD3]">
        {text}
      </span>
    );
  }
  if (lower.includes('country') || lower.includes('competitive')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FEF7E6] text-[#9A6B06] border border-[#FCE8B2]">
        {text}
      </span>
    );
  }
  if (lower.includes('specific')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#F5EEFB] text-[#7828A8] border border-[#E6D4F5]">
        {text}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#F1EFEA] text-[#555555] border border-[#E2DFD8]">
      {text}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   COUNTRY SPECIFIC VISA INSIGHTS
══════════════════════════════════════════════════════════════ */
const COUNTRY_VISA_INSIGHTS: Record<
  string,
  {
    authority: string;
    visaName: string;
    processingTime: string;
    solvencyRule: string;
    interviewType: string;
    spousalWork: string;
    refusalMitigation: string[];
  }
> = {
  canada: {
    authority: 'Immigration, Refugees and Citizenship Canada (IRCC)',
    visaName: 'Study Permit + Temporary Resident Visa (TRV) / eTA',
    processingTime: '4–8 Weeks (Online IRCC Portal)',
    solvencyRule: 'CAD $20,635 Guaranteed Investment Certificate (GIC) + Paid 1st-Year Tuition Receipt',
    interviewType: 'Rare (Biometrics at VAC + Panel Medical Exam mandatory)',
    spousalWork: 'Eligible for Spousal Open Work Permit (SOWP) for Master’s & Doctoral programs',
    refusalMitigation: [
      'Provincial Attestation Letter (PAL) is strictly mandatory with your Letter of Acceptance (LOA).',
      'Ensure proof of CAD $20,635 GIC is issued by a CDIC-insured authorized financial institution.',
      'SOP must explain clear economic return in your home country after graduation.',
      'Upfront medical exam must be completed through an authorized IRCC e-Medical panel physician.',
    ],
  },
  usa: {
    authority: 'U.S. Department of State & USCIS',
    visaName: 'F-1 Nonimmigrant Student Visa',
    processingTime: '2–6 Weeks (Appointment wait times vary by consulate)',
    solvencyRule: 'Proof of 100% of Form I-20 Total Estimated Cost for Year 1 (Tuition + Living)',
    interviewType: 'Mandatory in-person Consular Interview at US Embassy/Consulate',
    spousalWork: 'F-2 dependents cannot work in the US',
    refusalMitigation: [
      'Pay the $350 SEVIS I-901 fee at least 3 business days before the embassy interview.',
      'Clearly articulate your study plan and post-graduation intent without mentioning immigrant intent.',
      'Maintain strong liquid financial backing with verifiable income tax returns (ITR) from sponsors.',
      'Demonstrate ties to home country (career opportunities, family assets, academic goals).',
    ],
  },
  uk: {
    authority: 'UK Visas and Immigration (UKVI)',
    visaName: 'UK Student Visa (Points-Based System)',
    processingTime: '3–4 Weeks (Priority 5-day service available)',
    solvencyRule: 'Tuition Balance + 9 Months Living Funds (£9,207–£12,006) held unbroken for 28 consecutive days',
    interviewType: 'Credibility Interview (Randomly selected or remote video call)',
    spousalWork: 'Dependents permitted only for postgraduate research programs (PhD/Research Master’s)',
    refusalMitigation: [
      'Bank statement must never drop below required threshold even for a single day during the 28-day cycle.',
      'Ensure Confirmation of Acceptance for Studies (CAS) reference number matches passport exactly.',
      'Pay the Immigration Health Surcharge (IHS) £776/year during online submission.',
      'Tuberculosis (TB) certificate required from UKVI-approved medical clinic.',
    ],
  },
  germany: {
    authority: 'Federal Foreign Office & Ausländerbehörde',
    visaName: 'National Visa Type D (Study)',
    processingTime: '4–12 Weeks (via German Embassy or VFS Global)',
    solvencyRule: '€11,208 Blocked Account (Sperrkonto) with a certified provider (€934/month)',
    interviewType: 'In-person document verification & consular interview',
    spousalWork: 'Family reunification visa possible after securing German residence permit',
    refusalMitigation: [
      'APS Certificate is strictly mandatory for applicants with degrees from India, China, and Vietnam.',
      'Provide proof of statutory German student health insurance (TK, AOK, Barmer).',
      'Letter of Motivation must detail university selection, curriculum match, and career outlook.',
      'Ensure Blocked Account confirmation letter is issued directly in your name.',
    ],
  },
  australia: {
    authority: 'Australian Department of Home Affairs',
    visaName: 'Student Visa (Subclass 500)',
    processingTime: '4–8 Weeks (ImmiAccount Online Submission)',
    solvencyRule: 'AUD $29,710/year official living benchmark + remaining 1st-year tuition + travel costs',
    interviewType: 'Genuine Student (GS) assessment written statement (Phone interview occasional)',
    spousalWork: 'Dependents have work rights (unlimited for Master’s/PhD candidates)',
    refusalMitigation: [
      'Genuine Student (GS) responses must demonstrate clear career progression and return on investment.',
      'Purchase Overseas Student Health Cover (OSHC) for the full duration of your visa.',
      'Electronic Confirmation of Enrolment (CoE) is mandatory before visa lodging.',
      'Ensure education loans or liquid deposits have clear provenance and sanctioned letters.',
    ],
  },
  ireland: {
    authority: 'Immigration Service Delivery (ISD Ireland)',
    visaName: 'Stamp 2 Study Visa (AVATS)',
    processingTime: '4–8 Weeks (AVATS online + VFS dossier submission)',
    solvencyRule: '€10,000 living expenses proof (6 months unbroken bank statement) + tuition receipt',
    interviewType: 'Document verification at VFS Global',
    spousalWork: 'Spouses cannot work unless on individual employment permits',
    refusalMitigation: [
      'Tuition fee payment receipt (min €6,000 or full first year) is strictly required before appointment.',
      'Provide private student medical insurance policy covering €25,000+ medical emergencies.',
      '6-month bank statement must show clean history without sudden unexplained bulk deposits.',
      'Register for Irish Residence Permit (IRP) within 90 days of landing.',
    ],
  },
};

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
export default function CountryGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const authTarget = user ? '/dashboard' : '/login';

  const [guide, setGuide] = useState<CountryGuideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [docFilter, setDocFilter] = useState<'all' | 'university' | 'visa'>('all');

  const countrySlug = slug?.toLowerCase() || 'usa';

  useEffect(() => {
    async function loadGuide() {
      try {
        const res = await fetch(`/api/wix/country-guide?slug=${countrySlug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setGuide(json.data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to local
      }
      setGuide(COUNTRY_GUIDES[countrySlug] || COUNTRY_GUIDES.usa);
      setLoading(false);
    }
    loadGuide();
  }, [countrySlug]);

  const activeGuide = guide || COUNTRY_GUIDES[countrySlug] || COUNTRY_GUIDES.usa;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    router.push(`/country-guide/${selected}`);
  };

  const countriesList = [
    { slug: 'usa', name: 'USA', flag: '🇺🇸' },
    { slug: 'uk', name: 'UK', flag: '🇬🇧' },
    { slug: 'canada', name: 'Canada', flag: '🇨🇦' },
    { slug: 'germany', name: 'Germany', flag: '🇩🇪' },
    { slug: 'australia', name: 'Australia', flag: '🇦🇺' },
    { slug: 'ireland', name: 'Ireland', flag: '🇮🇪' },
    { slug: 'france', name: 'France', flag: '🇫🇷' },
    { slug: 'new-zealand', name: 'New Zealand', flag: '🇳🇿' },
    { slug: 'netherlands', name: 'Netherlands', flag: '🇳🇱' },
    { slug: 'singapore', name: 'Singapore', flag: '🇸🇬' },
    { slug: 'italy', name: 'Italy', flag: '🇮🇹' },
    { slug: 'sweden', name: 'Sweden', flag: '🇸🇪' },
    { slug: 'switzerland', name: 'Switzerland', flag: '🇨🇭' },
    { slug: 'spain', name: 'Spain', flag: '🇪🇸' },
    { slug: 'japan', name: 'Japan', flag: '🇯🇵' },
    { slug: 'south-korea', name: 'South Korea', flag: '🇰🇷' },
    { slug: 'uae', name: 'UAE (Dubai)', flag: '🇦🇪' },
    { slug: 'finland', name: 'Finland', flag: '🇫🇮' },
    { slug: 'poland', name: 'Poland', flag: '🇵🇱' },
    { slug: 'austria', name: 'Austria', flag: '🇦🇹' },
    { slug: 'malaysia', name: 'Malaysia', flag: '🇲🇾' },
  ];

  const visaInsights =
    COUNTRY_VISA_INSIGHTS[countrySlug] || {
      authority: `${activeGuide.countryName} Immigration Authority`,
      visaName: activeGuide.quickFacts.visa || `${activeGuide.countryName} Student Visa`,
      processingTime: '4–8 Weeks (Consular processing)',
      solvencyRule: activeGuide.costOfStudy.proofOfFunds || 'Demonstrated living costs + first-year tuition',
      interviewType: 'Consular interview or VFS biometrics collection',
      spousalWork: 'Subject to local immigration regulations',
      refusalMitigation: [
        `Ensure unconditional letter of acceptance from an accredited ${activeGuide.countryName} institution.`,
        'Maintain clean, verifiable financial bank statements covering full first-year costs.',
        'Submit compelling Statement of Purpose outlining genuine academic intent.',
        'Provide all certified academic transcripts and language certificates.',
      ],
    };

  return (
    <div className="bg-[#FAF8F5] text-[#111111] font-[Poppins] font-normal min-h-screen">
      {/* ══ TOP NAVBAR ════════════════════════════════════════════════ */}
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
                Visa &amp; Application Dossier
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/country-guide"
              className="hidden md:flex text-[13px] font-semibold text-[#666] hover:text-[#690B1B] transition-colors items-center gap-1 cursor-pointer"
            >
              ← Country Guides
            </Link>
            <Link
              href="/dashboard/schools"
              className="h-[38px] sm:h-[42px] px-5 sm:px-6 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all shadow-[0_4px_14px_rgba(105,11,27,0.2)] flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              University Finder →
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ MAIN CONTAINER ══════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14">
        {/* ══ 1. HERO SECTION (VISA & APPLICATION FOCUS) ═════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-5">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#F3D5DC] text-[11px] font-bold text-[#690B1B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B]" />
              <span>STUDENT VISA &amp; APPLICATION DOSSIER · 2026</span>
            </div>

            {/* Heading */}
            <h1 className="text-[36px] sm:text-[48px] lg:text-[54px] font-extrabold tracking-[-0.035em] text-[#111111] leading-[1.08]">
              {activeGuide.countryName} <span className="text-[#690B1B]">Visa &amp; Application</span> Guide
            </h1>

            {/* Description */}
            <p className="text-[14px] sm:text-[15.5px] text-[#444444] leading-relaxed max-w-[560px]">
              Complete consular roadmap for {activeGuide.countryName}. Step-by-step student visa application, financial solvency rules, mandatory document checklists, and post-study stay-back rights.
            </p>

            {/* 4 Crisp Key Facts Micro-Cards */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-stretch">
              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>🛂</span> VISA TYPE
                </div>
                <div className="text-[12.5px] sm:text-[13px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.heroFacts.studentVisa}
                </div>
              </div>

              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>💰</span> PROOF OF FUNDS
                </div>
                <div className="text-[12.5px] sm:text-[13px] font-bold text-[#690B1B] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.costOfStudy.proofOfFunds.split('(')[0].trim()}
                </div>
              </div>

              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>⏳</span> STAY-BACK VISA
                </div>
                <div className="text-[12.5px] sm:text-[13px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.workAndPostStudy.postStudyWork[0]?.split('(')[0]?.trim() || 'Post-study permit'}
                </div>
              </div>

              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>💼</span> WORK RIGHTS
                </div>
                <div className="text-[12.5px] sm:text-[13px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.workAndPostStudy.partTimeWork[0]?.split('(')[0]?.trim() || '20 hrs/wk'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[22px] overflow-hidden border border-[#EAE5DF] shadow-[0_12px_32px_rgba(0,0,0,0.06)] group bg-white">
              <img
                src={activeGuide.heroImage}
                alt={`Study in ${activeGuide.countryName}`}
                className="w-full h-[280px] sm:h-[340px] lg:h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[11px] font-bold text-[#C9A55D] uppercase tracking-wider">
                  Consular Destination Dossier
                </div>
                <div className="text-[20px] font-bold">{activeGuide.countryName}</div>
                <div className="text-[12px] text-white/80 mt-0.5 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Verified 2026 Student Visa &amp; DLI Guidelines</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 2. EXPLORE ANOTHER DESTINATION (DROPDOWN BAR) ═══════════ */}
        <section className="bg-white border border-[#EAE5DF] rounded-[14px] px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-bold text-[#888888]">
              EXPLORE ANOTHER DESTINATION
            </span>
            <span className="hidden sm:inline text-[#CCC]">·</span>
            <span className="text-[14px] sm:text-[15px] font-bold text-[#111111]">
              Switch visa &amp; application dossier
            </span>
          </div>
          <div className="relative min-w-[220px]">
            <select
              value={activeGuide.slug}
              onChange={handleCountryChange}
              className="w-full bg-[#FAF8F5] border border-[#D9D3CC] rounded-[10px] px-3.5 py-2 text-[13px] font-bold text-[#111111] focus:outline-none focus:border-[#690B1B] transition-colors cursor-pointer appearance-none pr-8"
            >
              {countriesList.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]"
            />
          </div>
        </section>

        {/* ══ 3. QUICK VISA & CONSULAR PROFILE (DARK LUXURY CONTAINER) ═ */}
        <section className="bg-[#111217] rounded-[18px] text-white p-6 sm:p-7 shadow-xl space-y-4 border border-white/[0.06]">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A55D]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/90">
                OFFICIAL VISA &amp; CONSULAR PROFILE
              </span>
            </div>
            <span className="text-[11px] text-white/50 font-medium">
              {visaInsights.authority}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch pt-1">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                VISA CLASSIFICATION
              </div>
              <div className="text-[13.5px] font-bold text-white mt-2 leading-snug">
                {visaInsights.visaName}
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                PROCESSING TIMELINE
              </div>
              <div className="text-[13.5px] font-bold text-[#C9A55D] mt-2 leading-snug">
                {visaInsights.processingTime}
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                SOLVENCY BENCHMARK
              </div>
              <div className="text-[12.5px] font-medium text-white/90 mt-2 leading-snug">
                {visaInsights.solvencyRule}
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                SPOUSAL &amp; DEPENDENT RIGHTS
              </div>
              <div className="text-[12.5px] font-medium text-white/90 mt-2 leading-snug">
                {visaInsights.spousalWork}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 4. STEP-BY-STEP STUDENT VISA ROADMAP ════════════════════ */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                CONSULAR ROADMAP
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
                {activeGuide.countryName} Student Visa Application Process
              </h2>
            </div>
            <span className="text-[12px] text-[#777] font-medium">
              6 Sequential Milestones
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-stretch">
            {activeGuide.visaProcess.map((step) => (
              <div
                key={step.step}
                className="bg-white border border-[#EAE5DF] rounded-[14px] p-4.5 flex flex-col justify-between h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] relative hover:border-[#690B1B]/40 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="w-7 h-7 rounded-full bg-[#FAF0F2] text-[#690B1B] font-bold text-[12px] flex items-center justify-center mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-[13.5px] font-bold text-[#111111] leading-snug min-h-[36px]">
                    {step.title}
                  </h3>
                  <p className="text-[11.5px] text-[#555555] mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 5. PROOF OF FUNDS & FINANCIAL SOLVENCY ══════════════════ */}
        <section className="bg-gradient-to-br from-[#FAF5F6] via-[#FAF8F5] to-[#F7EEF0] border border-[#F0DFE3] rounded-[18px] p-6 sm:p-8 space-y-5 shadow-[0_2px_12px_rgba(105,11,27,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                FINANCIAL SOLVENCY &amp; LIVING BENCHMARKS
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
                Proof of Funds Required for {activeGuide.countryName}
              </h2>
              <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
                Official benchmarks evaluated by visa officers during financial scrutiny.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white border border-[#E8C4CC] px-3.5 py-1.5 rounded-full text-[11.5px] font-bold text-[#690B1B] shrink-0 shadow-xs">
              <CreditCard size={14} />
              <span>Mandatory Solvency Audit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
            {[
              {
                key: 'tuition' as const,
                label: 'TUITION FEES',
                icon: '🎓',
                iconBg: 'bg-[#FAF0F2] text-[#690B1B] border-[#F3D5DC]',
                borderHover: 'hover:border-[#690B1B]/40',
              },
              {
                key: 'livingExpenses' as const,
                label: 'LIVING EXPENSES',
                icon: '🏠',
                iconBg: 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]',
                borderHover: 'hover:border-[#C2410C]/40',
              },
              {
                key: 'healthInsurance' as const,
                label: 'HEALTH INSURANCE',
                icon: '🛡️',
                iconBg: 'bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]',
                borderHover: 'hover:border-[#047857]/40',
              },
              {
                key: 'visaApplication' as const,
                label: 'VISA & CONSULAR FEES',
                icon: '📑',
                iconBg: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]',
                borderHover: 'hover:border-[#1D4ED8]/40',
              },
              {
                key: 'proofOfFunds' as const,
                label: 'PROOF OF FUNDS',
                icon: '💰',
                iconBg: 'bg-[#FAF5FF] text-[#7E22CE] border-[#F3E8FF]',
                borderHover: 'hover:border-[#7E22CE]/40',
              },
            ].map((cat) => {
              const raw = activeGuide.costOfStudy[cat.key] || '';
              let primary = raw.trim();
              let secondary = '';
              const parenIdx = primary.indexOf('(');
              if (parenIdx !== -1) {
                secondary = primary.substring(parenIdx).trim();
                primary = primary.substring(0, parenIdx).trim();
                if (secondary.startsWith('(') && secondary.endsWith(')')) {
                  secondary = secondary.slice(1, -1).trim();
                }
              } else if (primary.includes(' + ')) {
                const parts = primary.split(' + ');
                primary = parts[0].trim();
                secondary = '+ ' + parts.slice(1).join(' + ').trim();
              }

              return (
                <div
                  key={cat.key}
                  className={`bg-white border border-[#EAE5DF] rounded-[14px] p-4.5 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${cat.borderHover} hover:shadow-md transition-all duration-200 h-full`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#777777]">
                        {cat.label}
                      </span>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] shrink-0 border ${cat.iconBg}`}
                      >
                        {cat.icon}
                      </span>
                    </div>
                    <div className="mt-2 mb-2">
                      <div className="text-[15px] sm:text-[16px] font-bold text-[#111111] tracking-[-0.02em] leading-snug">
                        {primary || '—'}
                      </div>
                    </div>
                  </div>
                  {secondary && (
                    <div className="pt-2 mt-2 border-t border-[#F0EBE5] text-[11px] text-[#555555] leading-relaxed">
                      {secondary}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 6. COMPREHENSIVE APPLICATION & VISA DOCUMENT DOSSIER ═══ */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                APPLICATION &amp; CONSULAR DOSSIER
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
                Required Document Checklists for {activeGuide.countryName}
              </h2>
              <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
                Verified portfolio of required documents for university admission and visa lodging.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#FAF0F2] p-1 rounded-full border border-[#F3D5DC] shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setDocFilter('all')}
                className={`px-3 py-1 rounded-full text-[11.5px] font-bold transition-all cursor-pointer ${
                  docFilter === 'all'
                    ? 'bg-[#690B1B] text-white shadow-xs'
                    : 'text-[#690B1B] hover:bg-white/60'
                }`}
              >
                All Documents
              </button>
              <button
                onClick={() => setDocFilter('university')}
                className={`px-3 py-1 rounded-full text-[11.5px] font-bold transition-all cursor-pointer ${
                  docFilter === 'university'
                    ? 'bg-[#690B1B] text-white shadow-xs'
                    : 'text-[#690B1B] hover:bg-white/60'
                }`}
              >
                University App
              </button>
              <button
                onClick={() => setDocFilter('visa')}
                className={`px-3 py-1 rounded-full text-[11.5px] font-bold transition-all cursor-pointer ${
                  docFilter === 'visa'
                    ? 'bg-[#690B1B] text-white shadow-xs'
                    : 'text-[#690B1B] hover:bg-white/60'
                }`}
              >
                Visa Filing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* University Application Column */}
            {(docFilter === 'all' || docFilter === 'university') && (
              <div className="bg-white border border-[#EAE5DF] rounded-[16px] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center justify-between border-b border-[#EAE5DF] pb-3">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-[#690B1B]" />
                    <h3 className="text-[15.5px] font-bold text-[#111111]">
                      University Application Portfolio
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#777] font-semibold">
                    {activeGuide.documents.universityApplication.length} Items
                  </span>
                </div>
                <div className="space-y-2.5">
                  {activeGuide.documents.universityApplication.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-[#F4F1EC] last:border-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        <span className="text-[13px] font-semibold text-[#222222]">
                          {doc.name}
                        </span>
                      </div>
                      <StatusBadge text={doc.status} variant={doc.badgeVariant} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial & Visa Column */}
            {(docFilter === 'all' || docFilter === 'visa') && (
              <div className="bg-white border border-[#EAE5DF] rounded-[16px] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center justify-between border-b border-[#EAE5DF] pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#690B1B]" />
                    <h3 className="text-[15.5px] font-bold text-[#111111]">
                      Visa &amp; Consular Filing Dossier
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#777] font-semibold">
                    {activeGuide.documents.financialAndVisa.length} Items
                  </span>
                </div>
                <div className="space-y-2.5">
                  {activeGuide.documents.financialAndVisa.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-[#F4F1EC] last:border-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        <span className="text-[13px] font-semibold text-[#222222]">
                          {doc.name}
                        </span>
                      </div>
                      <StatusBadge text={doc.status} variant={doc.badgeVariant} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ══ 7. WORK RIGHTS & POST-STUDY STAY-BACK (PGWP/OPT) ═══════ */}
        <section className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              WORK RIGHTS &amp; STAY-BACK AUTHORIZATION
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
              Employment Rules &amp; Post-Study Stay-Back in {activeGuide.countryName}
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
              Part-time student work limits, holiday allowances, and graduate open work permit frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Card: Part-time Work */}
            <div className="bg-white border border-[#EAE5DF] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF4F5] border border-[#F3E2E6] flex items-center justify-center text-[#690B1B]">
                  <Briefcase size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                    STUDY PERIOD
                  </div>
                  <h3 className="text-[15px] font-bold text-[#111]">Part-Time Student Work</h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {activeGuide.workAndPostStudy.partTimeWork.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px] text-[#333] leading-relaxed">
                    <span className="text-[#0E7044] font-bold mt-0.5">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Card: Post-study Work (Dark Container) */}
            <div className="bg-[#111217] border border-white/10 rounded-[16px] p-6 shadow-lg text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#690B1B]/40 border border-[#690B1B]/60 flex items-center justify-center text-white">
                  <Award size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#C9A55D]">
                    GRADUATE IMMIGRATION
                  </div>
                  <h3 className="text-[15px] font-bold text-white">
                    Post-Study Stay-Back Rights
                  </h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {activeGuide.workAndPostStudy.postStudyWork.map((psw, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px] text-gray-200 leading-relaxed">
                    <span className="text-[#C9A55D] font-bold mt-0.5">✓</span>
                    <span>{psw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══ 8. CONSULAR OFFICER EVALUATION PILLARS ══════════════════ */}
        <section className="bg-white border border-[#EAE5DF] rounded-[18px] p-6 sm:p-8 space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between border-b border-[#F0EBE5] pb-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                OFFICER ASSESSMENT CRITERIA
              </div>
              <h2 className="text-[20px] sm:text-[24px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
                What Visa Officers Look For
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-[#888] bg-[#FAF8F5] border border-[#EAE5DF] px-2.5 py-1 rounded-full">
              Consular Approval Factors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: '01',
                title: 'Academic Intent & Fit',
                desc: 'Logical continuation of prior studies or justifiable career pivot with clear curriculum match.',
              },
              {
                num: '02',
                title: 'Financial Capability',
                desc: 'Verifiable liquid funds covering full tuition and living expenses with legitimate source of funds.',
              },
              {
                num: '03',
                title: 'Ties to Home Country',
                desc: 'Demonstrated family, career, or economic reasons to return after completing foreign studies.',
              },
              {
                num: '04',
                title: 'Clarity of Study Plan',
                desc: 'Concrete awareness of program structure, costs, DLI reputation, and measurable future ROI.',
              },
            ].map((pillar) => (
              <div
                key={pillar.num}
                className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[14px] p-4.5 space-y-2 hover:border-[#690B1B]/40 transition-all"
              >
                <div className="text-[12px] font-black text-[#690B1B]">{pillar.num}</div>
                <h3 className="text-[14px] font-bold text-[#111111]">{pillar.title}</h3>
                <p className="text-[12px] text-[#555555] leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 9. VISA REFUSAL PREVENTION & COMMON PITFALLS ════════════ */}
        <section className="bg-[#FFFBF5] border border-[#F5E6CC] rounded-[16px] p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={20} className="text-[#B83E1B]" />
            <h3 className="text-[16px] sm:text-[17px] font-bold text-[#111111]">
              Visa Refusal Prevention &amp; Critical Guidelines ({activeGuide.countryName})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {visaInsights.refusalMitigation.map((tip, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#EAE5DF] rounded-[12px] p-3.5 flex items-start gap-2.5 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B83E1B] mt-2 shrink-0" />
                <span className="text-[12.5px] text-[#333] font-medium leading-relaxed">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 10. GOOD TO KNOW (ESSENTIAL TIPS) ═══════════════════════ */}
        <section className="bg-white border border-[#EAE5DF] rounded-[16px] p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="text-[16px]">💡</span>
            <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111111]">
              Good to Know for {activeGuide.countryName}
            </h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {activeGuide.goodToKnow.map((note, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-[#444] leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B] mt-2 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ 11. BOTTOM ACTION BANNER ════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[20px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-[20px] sm:text-[22px] font-bold leading-tight">
              Ready to find matching universities in {activeGuide.countryName}?
            </h2>
            <p className="text-[12.5px] text-white/80 max-w-[520px]">
              Explore verified universities, calculate your admit chances with AI, or build an authentic SOP.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/schools"
              className="h-[40px] px-5 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[12.5px] transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
            >
              <span>University Finder</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/country-guide"
              className="h-[40px] px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
            >
              <span>All Countries</span>
            </Link>
          </div>
        </section>

        {/* ══ 12. SOURCES / VERIFICATION BAR ══════════════════════════ */}
        <div className="pt-4 border-t border-[#EAE5DF] flex flex-col sm:flex-row items-center justify-between text-[11.5px] text-[#888888] gap-3">
          <div>
            Last Verified:{' '}
            <span className="font-semibold text-[#555]">{activeGuide.lastVerified}</span>
          </div>
          <div>
            Source:{' '}
            <span className="font-semibold text-[#555]">{activeGuide.source}</span>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
         FOOTER — Official Dark Luxury Platform Footer
         ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#030303] px-4 sm:px-6 md:px-10 lg:px-16 pt-12 sm:pt-16 md:pt-20 pb-8 text-left text-white mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
            {/* BRAND */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 max-w-[300px]">
              <Link
                href="/"
                className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
              >
                <div className="w-[44px] h-[44px] rounded-[13px] overflow-hidden shadow-[0_6px_20px_rgba(105,11,27,0.3)] shrink-0">
                  <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-[20px] font-bold tracking-[-0.03em]">Abroad Simplified</span>
              </Link>
              <p className="mt-5 text-[#5E6168] text-[14px] leading-relaxed">
                Think Beyond Your Boundaries. Your ultimate AI-powered study abroad platform.
              </p>
            </div>

            {/* STUDY ABROAD GUIDES */}
            <div>
              <div className="text-[#C8A15D] text-[11px] tracking-[0.22em] uppercase font-bold mb-5">
                Country Guides
              </div>
              <div className="space-y-3.5">
                {[
                  { label: 'Study in USA 🇺🇸', href: '/country-guide/usa' },
                  { label: 'Study in UK 🇬🇧', href: '/country-guide/uk' },
                  { label: 'Study in Canada 🇨🇦', href: '/country-guide/canada' },
                  { label: 'Study in Germany 🇩🇪', href: '/country-guide/germany' },
                  { label: 'Study in Australia 🇦🇺', href: '/country-guide/australia' },
                  { label: 'Study in Ireland 🇮🇪', href: '/country-guide/ireland' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[14px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* PLATFORM TOOLS */}
            <div>
              <div className="text-[#C8A15D] text-[11px] tracking-[0.22em] uppercase font-bold mb-5">
                Platform Tools
              </div>
              <div className="space-y-3.5">
                {[
                  { label: 'University Finder', href: '/dashboard/schools' },
                  { label: 'AI Chance-Me Predictor', href: '/dashboard/chance-me' },
                  { label: 'SOP & Essay Studio', href: '/dashboard/essays' },
                  { label: 'Application Tracker', href: '/dashboard/tracker' },
                  { label: 'Country Directory', href: '/country-guide' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[14px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* COMPANY & LEGAL */}
            <div>
              <div className="text-[#C8A15D] text-[11px] tracking-[0.22em] uppercase font-bold mb-5">
                Company &amp; Legal
              </div>
              <div className="space-y-3.5">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Student Login', href: '/login' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[14px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="w-full h-px bg-white/10 mt-14 md:mt-16 mb-6" />

          {/* BOTTOM COPYRIGHT */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[#5E6168] text-[13px] text-center md:text-left">
              © 2026 Abroad Simplified. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-[#5E6168] text-[13px]">
              <Link href="/privacy" className="hover:text-white transition cursor-pointer">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition cursor-pointer">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
