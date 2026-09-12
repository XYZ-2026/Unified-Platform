'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COUNTRY_GUIDES, CountryGuideData } from '@/data/countryGuides';
import { useAuth } from '@/context/AuthContext';

/* ══════════════════════════════════════════════════════════════
   BADGE HELPER
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
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#E8F8F0] text-[#0E7044] border border-[#C2EBD6]">
        {text}
      </span>
    );
  }
  if (lower.includes('usually') || lower.includes('typical')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#FDF0EC] text-[#B83E1B] border border-[#FADCD3]">
        {text}
      </span>
    );
  }
  if (lower.includes('country') || lower.includes('competitive')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#FEF7E6] text-[#9A6B06] border border-[#FCE8B2]">
        {text}
      </span>
    );
  }
  if (lower.includes('specific')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#F5EEFB] text-[#7828A8] border border-[#E6D4F5]">
        {text}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#F1EFEA] text-[#555555] border border-[#E2DFD8]">
      {text}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   VISA PROCESS & APPLICATION PROCESS DATA DEFINITIONS
══════════════════════════════════════════════════════════════ */
interface CountryVisaStep {
  num: string;
  title: string;
  shortDesc: string;
  badge?: string;
  heading?: string;
  bullets?: string[];
  nextLabel?: string;
  outputBadge?: string;
  outcomes?: {
    label: string;
    desc: string;
  }[];
}

interface CountryApplicationProcess {
  beforeApp: {
    prepare: string[];
    check: string[];
  };
  duringApp: {
    num: string;
    title: string;
    bullets: string[];
  }[];
  afterApp: {
    stage: string;
    desc: string;
  }[];
  whatsNext: {
    steps: string[];
  };
}

const CANADA_VISA_PROCESS: CountryVisaStep[] = [
  {
    num: '01',
    title: 'GET ADMITTED',
    shortDesc: 'Receive admission from your Canadian institution.',
    heading: 'WHAT HAPPENS',
    bullets: [
      'Receive your Letter of Acceptance',
      'Confirm your program and institution',
      'Begin visa preparation',
    ],
    nextLabel: 'Provincial Attestation',
  },
  {
    num: '02',
    title: 'PROVINCIAL ATTESTATION',
    shortDesc: 'Obtain the applicable provincial attestation.',
    heading: 'WHAT HAPPENS',
    bullets: [
      'Request the required attestation',
      'Confirm the information',
      'Keep the confirmation',
    ],
    nextLabel: 'Study Permit Application',
  },
  {
    num: '03',
    title: 'STUDY PERMIT APPLICATION',
    shortDesc: 'Submit your study permit application.',
    heading: 'WHAT HAPPENS',
    bullets: [
      'Start the application',
      'Enter your personal information',
      'Provide application details',
      'Review your information',
      'Submit the application',
    ],
    outputBadge: 'Application Submitted',
  },
  {
    num: '04',
    title: 'BIOMETRICS',
    shortDesc: 'Complete biometrics when required.',
    heading: 'WHAT HAPPENS',
    bullets: [
      'Receive instructions if applicable',
      'Schedule the required appointment',
      'Complete biometrics',
      'Keep confirmation',
    ],
    nextLabel: 'Application Processing',
  },
  {
    num: '05',
    title: 'MEDICAL / VERIFICATION',
    shortDesc: 'Complete additional checks when applicable.',
    badge: 'IF APPLICABLE',
    heading: 'MAY INCLUDE',
    bullets: [
      'Medical examination',
      'Background verification',
      'Additional information requests',
    ],
  },
  {
    num: '06',
    title: 'APPLICATION PROCESSING',
    shortDesc: 'Your application is reviewed by the relevant authorities.',
    heading: 'DURING PROCESSING',
    bullets: [
      'Application review',
      'Verification',
      'Additional requests, if applicable',
      'Status updates',
    ],
  },
  {
    num: '07',
    title: 'VISA DECISION',
    shortDesc: 'Receive the outcome of your application.',
    outcomes: [
      {
        label: 'APPROVED',
        desc: 'Follow the instructions for the next stage.',
      },
      {
        label: 'ADDITIONAL ACTION',
        desc: 'Complete any requested step.',
      },
      {
        label: 'REFUSED',
        desc: 'Review the decision and applicable next steps.',
      },
    ],
  },
];

const CANADA_APPLICATION_PROCESS: CountryApplicationProcess = {
  beforeApp: {
    prepare: [
      'Check eligibility',
      'Confirm your program',
      'Review current requirements',
      'Prepare application information',
    ],
    check: [
      'Personal information',
      'Application details',
      'Requirement changes',
      'Information consistency',
    ],
  },
  duringApp: [
    {
      num: '01',
      title: 'START',
      bullets: [
        'Begin application',
        'Select appropriate category',
        'Enter personal information',
      ],
    },
    {
      num: '02',
      title: 'COMPLETE',
      bullets: [
        'Provide required information',
        'Review responses',
        'Make applicable payment',
      ],
    },
    {
      num: '03',
      title: 'SUBMIT',
      bullets: [
        'Review application',
        'Confirm details',
        'Submit',
        'Save confirmation',
      ],
    },
  ],
  afterApp: [
    { stage: 'SUBMITTED', desc: 'Application received' },
    { stage: 'BIOMETRICS', desc: 'If required' },
    { stage: 'PROCESSING', desc: 'Application review' },
    { stage: 'REQUESTS*', desc: 'If applicable' },
    { stage: 'DECISION', desc: 'Final outcome' },
  ],
  whatsNext: {
    steps: [
      'Application Submitted',
      'Complete Required Follow-up',
      'Track Application',
      'Receive Decision',
    ],
  },
};

function getCountryVisaProcess(slug: string, countryName: string): CountryVisaStep[] {
  if (slug === 'canada') return CANADA_VISA_PROCESS;

  if (slug === 'usa') {
    return [
      {
        num: '01',
        title: 'GET ADMITTED',
        shortDesc: 'Receive acceptance from a SEVP-certified institution.',
        heading: 'WHAT HAPPENS',
        bullets: ['Receive Form I-20 / DS-2019', 'Verify program details and start date', 'Begin visa preparation'],
        nextLabel: 'SEVIS I-901 Fee',
      },
      {
        num: '02',
        title: 'SEVIS I-901 FEE',
        shortDesc: 'Pay your mandatory SEVIS fee before DS-160.',
        heading: 'WHAT HAPPENS',
        bullets: ['Access the FMJfee portal', 'Pay SEVIS I-901 fee', 'Keep payment confirmation receipt'],
        nextLabel: 'DS-160 Application',
      },
      {
        num: '03',
        title: 'DS-160 APPLICATION',
        shortDesc: 'Complete and submit your online visa application.',
        heading: 'WHAT HAPPENS',
        bullets: ['Complete Form DS-160 online', 'Upload compliant visa photograph', 'Print confirmation barcode page'],
        outputBadge: 'DS-160 Submitted',
      },
      {
        num: '04',
        title: 'VISA APPOINTMENT',
        shortDesc: 'Schedule consular appointments (OFC & Interview).',
        heading: 'WHAT HAPPENS',
        bullets: ['Create consular portal profile', 'Pay visa MRV application fee', 'Schedule OFC & interview appointments'],
        nextLabel: 'Biometrics & Interview',
      },
      {
        num: '05',
        title: 'BIOMETRICS & OFC',
        shortDesc: 'Complete biometric collection at Visa Application Center.',
        heading: 'WHAT HAPPENS',
        bullets: ['Visit Visa Application Center', 'Complete digital fingerprinting & photo', 'Verify appointment confirmation'],
      },
      {
        num: '06',
        title: 'CONSULAR INTERVIEW',
        shortDesc: 'Attend in-person interview with a consular officer.',
        heading: 'DURING PROCESSING',
        bullets: ['State academic intent and ties to home country', 'Provide required answers clearly', 'Review administrative status'],
      },
      {
        num: '07',
        title: 'VISA DECISION',
        shortDesc: 'Receive the outcome of your visa application.',
        outcomes: [
          { label: 'APPROVED', desc: 'Passport retained for visa stamping and delivery.' },
          { label: 'ADDITIONAL ACTION', desc: '221(g) administrative processing or requested documents.' },
          { label: 'REFUSED', desc: 'Review refusal notice and reapplication guidelines.' },
        ],
      },
    ];
  }

  if (slug === 'uk') {
    return [
      {
        num: '01',
        title: 'GET ADMITTED',
        shortDesc: 'Receive unconditional offer from a licensed UK sponsor.',
        heading: 'WHAT HAPPENS',
        bullets: ['Accept unconditional offer', 'Meet all academic and financial conditions', 'Request CAS issuance'],
        nextLabel: 'CAS Attestation',
      },
      {
        num: '02',
        title: 'CAS ATTESTATION',
        shortDesc: 'Receive your Confirmation of Acceptance for Studies.',
        heading: 'WHAT HAPPENS',
        bullets: ['Receive unique CAS reference number', 'Verify course and fee details', 'Keep confirmation safe'],
        nextLabel: 'Student Visa Application',
      },
      {
        num: '03',
        title: 'STUDENT VISA APPLICATION',
        shortDesc: 'Submit online Student Visa application & pay IHS.',
        heading: 'WHAT HAPPENS',
        bullets: ['Complete online UKVI application', 'Pay Immigration Health Surcharge (IHS)', 'Pay visa application fee'],
        outputBadge: 'Application Submitted',
      },
      {
        num: '04',
        title: 'BIOMETRICS',
        shortDesc: 'Attend appointment at VFS / TLScontact center.',
        heading: 'WHAT HAPPENS',
        bullets: ['Book biometric appointment', 'Submit facial photograph and fingerprints', 'Retain appointment confirmation'],
        nextLabel: 'Application Processing',
      },
      {
        num: '05',
        title: 'TB / VERIFICATION',
        shortDesc: 'Complete additional checks when applicable.',
        badge: 'IF APPLICABLE',
        heading: 'MAY INCLUDE',
        bullets: ['Tuberculosis screening (panel clinic)', 'Credibility interview if requested', 'Verification of qualifications'],
      },
      {
        num: '06',
        title: 'APPLICATION PROCESSING',
        shortDesc: 'UK Visas and Immigration reviews your application.',
        heading: 'DURING PROCESSING',
        bullets: ['UKVI case worker review', 'Sponsor compliance checks', 'Status notifications via email'],
      },
      {
        num: '07',
        title: 'VISA DECISION',
        shortDesc: 'Receive the outcome of your application.',
        outcomes: [
          { label: 'APPROVED', desc: 'Receive decision letter and entry vignette / eVisa.' },
          { label: 'ADDITIONAL ACTION', desc: 'Provide requested clarification or interview.' },
          { label: 'REFUSED', desc: 'Review decision reasons and administrative review rights.' },
        ],
      },
    ];
  }

  // Universal high-standard 7-step fallback for all other countries
  return [
    {
      num: '01',
      title: 'GET ADMITTED',
      shortDesc: `Receive admission from your ${countryName} institution.`,
      heading: 'WHAT HAPPENS',
      bullets: [
        'Receive official Letter of Acceptance / Admission',
        'Confirm program details and study commencement',
        'Begin visa preparation',
      ],
      nextLabel: 'Admission Confirmation',
    },
    {
      num: '02',
      title: 'ADMISSION CONFIRMATION',
      shortDesc: 'Obtain official visa eligibility certificate / confirmation.',
      heading: 'WHAT HAPPENS',
      bullets: [
        'Pay initial deposit if applicable',
        'Receive official visa confirmation reference',
        'Keep confirmation records',
      ],
      nextLabel: 'Student Visa Application',
    },
    {
      num: '03',
      title: 'STUDENT VISA APPLICATION',
      shortDesc: 'Submit your formal student visa application.',
      heading: 'WHAT HAPPENS',
      bullets: [
        'Start consular / online portal application',
        'Enter personal and academic details',
        'Review information and pay applicable fees',
        'Submit the application',
      ],
      outputBadge: 'Application Submitted',
    },
    {
      num: '04',
      title: 'BIOMETRICS',
      shortDesc: 'Complete biometrics when required.',
      heading: 'WHAT HAPPENS',
      bullets: [
        'Receive appointment booking instructions',
        'Schedule and attend biometric appointment',
        'Keep submission confirmation receipt',
      ],
      nextLabel: 'Application Processing',
    },
    {
      num: '05',
      title: 'MEDICAL / VERIFICATION',
      shortDesc: 'Complete additional checks when applicable.',
      badge: 'IF APPLICABLE',
      heading: 'MAY INCLUDE',
      bullets: [
        'Medical examination / panel health check',
        'Background and security verification',
        'Additional consular information requests',
      ],
    },
    {
      num: '06',
      title: 'APPLICATION PROCESSING',
      shortDesc: 'Your application is reviewed by the relevant authorities.',
      heading: 'DURING PROCESSING',
      bullets: [
        'Consular application review',
        'Eligibility verification',
        'Additional requests, if applicable',
        'Status updates',
      ],
    },
    {
      num: '07',
      title: 'VISA DECISION',
      shortDesc: 'Receive the outcome of your application.',
      outcomes: [
        { label: 'APPROVED', desc: 'Follow the instructions for travel and entry.' },
        { label: 'ADDITIONAL ACTION', desc: 'Complete any requested step or interview.' },
        { label: 'REFUSED', desc: 'Review the decision and applicable appeal / reapply steps.' },
      ],
    },
  ];
}

function getCountryApplicationProcess(slug: string, countryName: string): CountryApplicationProcess {
  if (slug === 'canada') return CANADA_APPLICATION_PROCESS;

  return {
    beforeApp: {
      prepare: [
        'Check institution eligibility',
        'Confirm program & intake dates',
        'Review current admission requirements',
        'Prepare personal and academic profile',
      ],
      check: [
        'Personal identification records',
        'Application details & dates',
        'Requirement updates',
        'Information consistency across files',
      ],
    },
    duringApp: [
      {
        num: '01',
        title: 'START',
        bullets: [
          'Begin application on official portal',
          'Select degree category & program',
          'Enter personal and academic details',
        ],
      },
      {
        num: '02',
        title: 'COMPLETE',
        bullets: [
          'Provide required application responses',
          'Review all entered fields carefully',
          'Make applicable portal fee payment',
        ],
      },
      {
        num: '03',
        title: 'SUBMIT',
        bullets: [
          'Perform final application review',
          'Confirm declaration details',
          'Submit application formally',
          'Save application confirmation & ID',
        ],
      },
    ],
    afterApp: [
      { stage: 'SUBMITTED', desc: 'Application received' },
      { stage: 'BIOMETRICS', desc: 'If required' },
      { stage: 'PROCESSING', desc: 'Application review' },
      { stage: 'REQUESTS*', desc: 'If applicable' },
      { stage: 'DECISION', desc: 'Final outcome' },
    ],
    whatsNext: {
      steps: [
        'Application Submitted',
        'Complete Required Follow-up',
        'Track Application',
        'Receive Decision',
      ],
    },
  };
}

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
  const [expandedVisaStep, setExpandedVisaStep] = useState<number | null>(0);

  const countrySlug = slug?.toLowerCase() || 'usa';

  useEffect(() => {
    // Attempt to fetch from API route (which queries CMS with local fallback)
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
  const visaSteps = getCountryVisaProcess(countrySlug, activeGuide.countryName);
  const appProcess = getCountryApplicationProcess(countrySlug, activeGuide.countryName);

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

  return (
    <div className="bg-[#FAF8F5] text-[#111111] font-[Poppins] font-normal min-h-screen">
      {/* ══ TOP NAVBAR ════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DF]">
        <div className="w-full max-w-[1440px] mx-auto h-[64px] sm:h-[72px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-[10px] sm:rounded-[12px] shadow-[0_4px_16px_rgba(105,11,27,0.15)] overflow-hidden shrink-0">
              <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[15px] sm:text-[18px] font-bold tracking-[-0.03em] text-[#111]">Abroad Simplified</div>
              <div className="hidden sm:block text-[9px] uppercase tracking-[0.16em] text-[#888] font-semibold">Study Abroad Guide</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/#universities"
              className="hidden md:flex text-[13px] font-medium text-[#666] hover:text-[#690B1B] transition-colors items-center gap-1"
            >
              ← All Destinations
            </Link>
            <Link
              href={authTarget}
              className="h-[38px] sm:h-[42px] px-5 sm:px-6 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all shadow-[0_4px_14px_rgba(105,11,27,0.2)] flex items-center gap-1.5"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ MAIN CONTAINER ══════════════════════════════════════════ */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-8 sm:space-y-10">
        
        {/* ══ HERO SECTION ════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-5">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#F3D5DC] text-[11px] font-bold text-[#690B1B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B]" />
              <span>STUDY ABROAD GUIDE · 2026 EDITION</span>
            </div>

            {/* Heading */}
            <h1 className="text-[38px] sm:text-[52px] lg:text-[58px] font-extrabold tracking-[-0.035em] text-[#111111] leading-[1.06]">
              Study in <span className="text-[#690B1B]">{activeGuide.countryName}</span>
            </h1>

            {/* Description */}
            <p className="text-[14px] sm:text-[15.5px] text-[#444444] leading-relaxed max-w-none lg:max-w-[720px]">
              {activeGuide.heroDescription ||
                `Explore universities, admission requirements, exams, student visa process, costs, documents and application timeline to plan your studies in ${activeGuide.countryName}.`}
            </p>

            {/* 4 Concise Country-Specific Facts Micro-Cards */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-stretch">
              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>🎓</span> TUITION
                </div>
                <div className="text-[13px] sm:text-[13.5px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.heroFacts.tuition}
                </div>
              </div>
              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>🏠</span> LIVING COST
                </div>
                <div className="text-[13px] sm:text-[13.5px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.heroFacts.livingCost}
                </div>
              </div>
              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>🗣️</span> ENGLISH
                </div>
                <div className="text-[13px] sm:text-[13.5px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.heroFacts.englishBenchmark}
                </div>
              </div>
              <div className="bg-white border border-[#EAE5DF] rounded-[12px] p-3 flex flex-col justify-start h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 hover:shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                  <span>🛂</span> VISA
                </div>
                <div className="text-[13px] sm:text-[13.5px] font-bold text-[#111111] mt-1.5 leading-snug flex-1 flex items-start">
                  {activeGuide.heroFacts.studentVisa}
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
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          </div>
        </section>

        {/* ══ EXPLORE ANOTHER DESTINATION (DROPDOWN BAR) ════════════════ */}
        <section className="bg-white border border-[#EAE5DF] rounded-[14px] px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-bold text-[#888888]">
              EXPLORE ANOTHER DESTINATION
            </span>
            <span className="hidden sm:inline text-[#CCC]">·</span>
            <span className="text-[14px] sm:text-[15px] font-bold text-[#111111]">
              Choose your country
            </span>
          </div>
          <div className="relative min-w-[200px]">
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#555] text-[12px]">
              ▼
            </div>
          </div>
        </section>

        {/* ══ DESTINATION OVERVIEW (WHY STUDY IN COUNTRY?) ══════════════ */}
        <section className="space-y-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
              DESTINATION OVERVIEW
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
              Why study in {activeGuide.countryName}?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeGuide.whyStudyHere.map((item) => (
              <div
                key={item.num}
                className="bg-white border border-[#EAE5DF] rounded-[14px] p-5 hover:border-[#690B1B]/40 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2"
              >
                <div className="text-[13px] font-bold text-[#690B1B]">{item.num}</div>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#222222] font-medium leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ QUICK COUNTRY FACTS (BLACK STRIP) ════════════════════════ */}
        <section className="bg-[#111217] rounded-[18px] text-white p-6 sm:p-7 shadow-xl space-y-4 border border-white/[0.06]">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/90">
                QUICK COUNTRY FACTS
              </span>
            </div>
            <span className="text-[11px] text-white/40 font-medium">
              At a glance · {activeGuide.countryName}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch pt-1">
            {/* 1. Currency */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>🪙</span> CURRENCY
              </div>
              <div className="text-[14px] font-bold text-white mt-2 leading-snug">
                {activeGuide.quickFacts.currency}
              </div>
            </div>

            {/* 2. Visa */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>🛂</span> STUDENT VISA
              </div>
              <div className="text-[14px] font-bold text-white mt-2 leading-snug">
                {activeGuide.quickFacts.visa}
              </div>
            </div>

            {/* 3. Major Intakes */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>📅</span> MAJOR INTAKES
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(activeGuide.quickFacts.majorIntakes || '')
                  .split(/[·•]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-white/[0.08] text-white text-[11px] font-semibold border border-white/[0.1] hover:bg-white/[0.14] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            {/* 4. Popular Levels */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>🎓</span> POPULAR LEVELS
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(activeGuide.quickFacts.popularLevels || '')
                  .split(/[·•]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-white/[0.08] text-white text-[11px] font-semibold border border-white/[0.1] hover:bg-white/[0.14] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            {/* 5. Popular Fields */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4 flex flex-col justify-start h-full hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
                <span>💼</span> POPULAR FIELDS
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(activeGuide.quickFacts.popularFields || '')
                  .split(/[·•]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-white/[0.08] text-white text-[11px] font-semibold border border-white/[0.1] hover:bg-white/[0.14] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                      {item}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 01 APPLICATION PROCESS (ACTION ROADMAP) ═════════════════ */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#EAE5DF] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A0019]">
                01 APPLICATION PROCESS
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-[#171717] tracking-[-0.03em] mt-0.5">
                Application Process
              </h2>
              <p className="text-[12.5px] sm:text-[13.5px] text-[#555555] mt-1">
                Know what to do before, during and after you apply to {activeGuide.countryName} institutions.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#7A0019] bg-[#FAF0F2] px-3 py-1 rounded-full border border-[#F3D5DC] shrink-0">
              <span>🧭</span> Action roadmap
            </div>
          </div>

          <div className="space-y-5">
            {/* 01 — BEFORE APPLICATION CONTAINER */}
            <div className="bg-white border border-[#E5E5E5] rounded-[14px] p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[12px] font-bold text-[#7A0019]">01</span>
                  <h3 className="text-[16px] sm:text-[18px] font-bold text-[#171717]">
                    Before Application
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FAF0F2] text-[#7A0019] border border-[#F3D5DC]">
                  PREPARE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prepare Column */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                    PREPARE
                  </div>
                  <ul className="space-y-2">
                    {appProcess.beforeApp.prepare.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12.5px] sm:text-[13px] text-[#333333]">
                        <span className="text-[#7A0019] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Check Column */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                    CHECK
                  </div>
                  <ul className="space-y-2">
                    {appProcess.beforeApp.check.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12.5px] sm:text-[13px] text-[#333333]">
                        <span className="text-[#7A0019] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#F5F5F5] text-[12px]">
                <span className="text-[#777777]">
                  Prepare your academic and financial paperwork before submitting.
                </span>
                <Link
                  href={authTarget}
                  className="text-[12.5px] font-bold text-[#7A0019] hover:text-[#5B0013] transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  Ready to apply →
                </Link>
              </div>
            </div>

            {/* 02 — DURING APPLICATION CONTAINER (Largest Container) */}
            <div className="bg-white border border-[#E5E5E5] rounded-[14px] p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[12px] font-bold text-[#7A0019]">02</span>
                  <h3 className="text-[16px] sm:text-[18px] font-bold text-[#171717]">
                    During Application
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FAF0F2] text-[#7A0019] border border-[#F3D5DC]">
                  SUBMIT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {appProcess.duringApp.map((card) => (
                  <div
                    key={card.num}
                    className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-[10px] p-5 space-y-3 hover:border-[#7A0019]/30 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-extrabold text-[#7A0019]">
                          {card.num}
                        </span>
                        <span className="text-[14px] text-[#777]">
                          {card.num === '01' ? '📝' : card.num === '02' ? '📋' : '📤'}
                        </span>
                      </div>
                      <div className="text-[13.5px] font-bold text-[#171717] uppercase tracking-wide">
                        {card.title}
                      </div>
                      <ul className="space-y-1.5">
                        {card.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-[12px] sm:text-[12.5px] text-[#444444]">
                            <span className="text-[#7A0019] font-bold mt-0.5">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 03 — AFTER APPLICATION CONTAINER */}
            <div className="bg-white border border-[#E5E5E5] rounded-[14px] p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[12px] font-bold text-[#7A0019]">03</span>
                  <h3 className="text-[16px] sm:text-[18px] font-bold text-[#171717]">
                    After Application
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FAF0F2] text-[#7A0019] border border-[#F3D5DC]">
                  NEXT STEPS
                </span>
              </div>

              {/* Horizontal Process on Desktop / Stacked on Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
                {appProcess.afterApp.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-stretch gap-2">
                    <div className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-[10px] p-3 text-center space-y-1 hover:border-[#D5D5D5] transition-colors flex-1 flex flex-col justify-center">
                      <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#171717]">
                        {item.stage}
                      </div>
                      <div className="text-[11px] text-[#555555]">
                        {item.desc}
                      </div>
                    </div>
                    {idx < appProcess.afterApp.length - 1 && (
                      <div className="hidden sm:flex items-center justify-center text-[#7A0019] font-bold text-[14px] px-0.5">
                        →
                      </div>
                    )}
                    {idx < appProcess.afterApp.length - 1 && (
                      <div className="sm:hidden text-[#7A0019] font-bold text-[14px] py-0.5">
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* WHAT'S NEXT? COMPACT CONTAINER */}
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-4 sm:p-4.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#7A0019]" />
                <span className="text-[12.5px] font-bold text-[#171717]">
                  What&apos;s next?
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11.5px] font-medium text-[#444444]">
                {appProcess.whatsNext.steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2.5 py-1 rounded-[6px] bg-[#F5F5F5] border border-[#E5E5E5] text-[#171717] font-semibold text-[11px]">
                      {step}
                    </span>
                    {idx < appProcess.whatsNext.steps.length - 1 && (
                      <span className="text-[#7A0019] font-bold text-[11px]">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 02 DOCUMENTS YOU'LL NEED ═════════════════════════════════ */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#EAE5DF] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                02 DOCUMENTS CHECKLIST
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
                Documents you’ll need for {activeGuide.countryName}
              </h2>
              <p className="text-[12.5px] sm:text-[13.5px] text-[#666666] mt-1">
                Essential academic, financial, and consular document checklist to complete your application.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#690B1B] bg-[#FAF0F2] px-3 py-1 rounded-full border border-[#F3D5DC] shrink-0">
              <span>📋</span> Preparation checklist
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* University Application Column */}
            <div className="bg-white border border-[#EAE5DF] rounded-[16px] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE5DF] pb-3">
                <h3 className="text-[15.5px] font-bold text-[#111111]">
                  University application
                </h3>
                <span className="text-[11px] font-semibold text-[#888888]">
                  Academic & language
                </span>
              </div>
              <div className="space-y-2.5">
                {activeGuide.documents.universityApplication.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-[#F4F1EC] last:border-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#888] text-[14px]">📄</span>
                      <span className="text-[13px] font-semibold text-[#222222]">{doc.name}</span>
                    </div>
                    <StatusBadge text={doc.status} variant={doc.badgeVariant} />
                  </div>
                ))}
              </div>
            </div>

            {/* Financial & Visa Column */}
            <div className="bg-white border border-[#EAE5DF] rounded-[16px] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE5DF] pb-3">
                <h3 className="text-[15.5px] font-bold text-[#111111]">
                  Financial & visa
                </h3>
                <span className="text-[11px] font-semibold text-[#888888]">
                  Funding & identification
                </span>
              </div>
              <div className="space-y-2.5">
                {activeGuide.documents.financialAndVisa.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-[#F4F1EC] last:border-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#888] text-[14px]">📑</span>
                      <span className="text-[13px] font-semibold text-[#222222]">{doc.name}</span>
                    </div>
                    <StatusBadge text={doc.status} variant={doc.badgeVariant} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[11.5px] text-[#777777] flex items-center gap-1.5 pt-1">
            <span>💡</span> Note: Financial records must satisfy the proof of funds benchmarks detailed in Section 04 below.
          </div>
        </section>

        {/* ══ 03 VISA PROCESS (MAIN CENTERPIECE TIMELINE) ══════════════ */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#EAE5DF] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A0019]">
                03 VISA PROCESS
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-[#171717] tracking-[-0.03em] mt-0.5">
                Visa Process
              </h2>
              <p className="text-[12.5px] sm:text-[13.5px] text-[#555555] mt-1">
                Follow the journey from admission to visa decision in {activeGuide.countryName}.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#7A0019] bg-[#FAF0F2] px-3 py-1 rounded-full border border-[#F3D5DC] shrink-0">
              <span>🛂</span> 7-step timeline
            </div>
          </div>

          <div className="relative pl-6 sm:pl-10 space-y-3.5">
            {/* Vertical thin maroon line */}
            <div className="absolute left-[19px] sm:left-[27px] top-6 bottom-6 w-[2px] bg-[#7A0019]/25" />

            {visaSteps.map((step, idx) => {
              const isExpanded = expandedVisaStep === idx;
              return (
                <div key={step.num} className="relative group">
                  {/* Timeline Number Circle */}
                  <button
                    type="button"
                    onClick={() => setExpandedVisaStep(isExpanded ? null : idx)}
                    className={`absolute -left-[20px] sm:-left-[28px] top-4 w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] rounded-full flex items-center justify-center text-[11px] sm:text-[12px] font-bold transition-all z-10 cursor-pointer ${
                      isExpanded
                        ? 'bg-[#7A0019] text-white ring-4 ring-[#FAF0F2] border border-[#7A0019]'
                        : 'bg-white text-[#171717] border border-[#E5E5E5] hover:border-[#7A0019]'
                    }`}
                  >
                    {step.num}
                  </button>

                  {/* Step Container Card */}
                  <div
                    className={`bg-white border rounded-[14px] transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'border-[#7A0019]/40 shadow-[0_2px_12px_rgba(122,0,25,0.05)]'
                        : 'border-[#E5E5E5] hover:border-[#D5D5D5] shadow-xs'
                    }`}
                  >
                    {/* Collapsed Header / Accordion Trigger */}
                    <button
                      type="button"
                      onClick={() => setExpandedVisaStep(isExpanded ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-[13.5px] sm:text-[14.5px] font-bold text-[#171717] tracking-tight">
                            {step.num} — {step.title}
                          </span>
                          {step.badge && (
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider bg-[#F5F5F5] text-[#555555] border border-[#E5E5E5]">
                              {step.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-[#555555] leading-snug">
                          {step.shortDesc}
                        </p>
                      </div>

                      {/* +/- Toggle Indicator */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border text-[14px] sm:text-[16px] font-bold transition-all ${
                          isExpanded
                            ? 'bg-[#FAF0F2] text-[#7A0019] border-[#F3D5DC]'
                            : 'bg-[#F5F5F5] text-[#555555] border-[#E5E5E5] group-hover:bg-[#EAEAEA]'
                        }`}
                      >
                        {isExpanded ? '−' : '+'}
                      </div>
                    </button>

                    {/* Smooth Expanded View */}
                    {isExpanded && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-[#F5F5F5] mt-1 space-y-4">
                        {step.heading && (
                          <div className="pt-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A0019]">
                              {step.heading}
                            </div>
                            {step.bullets && (
                              <ul className="mt-2 space-y-1.5">
                                {step.bullets.map((b, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-2 text-[12.5px] sm:text-[13px] text-[#333333]">
                                    <span className="text-[#7A0019] font-bold mt-0.5">•</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* Next Action Indicator */}
                        {step.nextLabel && (
                          <div className="pt-2 flex items-center gap-1.5 text-[11.5px] font-bold text-[#7A0019]">
                            <span className="text-[9.5px] tracking-wider uppercase text-[#888888]">NEXT</span>
                            <span>→ {step.nextLabel}</span>
                          </div>
                        )}

                        {/* Output Badge */}
                        {step.outputBadge && (
                          <div className="pt-2">
                            <div className="text-[9.5px] font-bold tracking-wider uppercase text-[#888888] mb-1">
                              OUTPUT
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded bg-[#F5F5F5] text-[#171717] border border-[#E5E5E5] text-[11.5px] font-bold font-mono">
                              [ {step.outputBadge} ]
                            </span>
                          </div>
                        )}

                        {/* Visa Decision 3 Neutral Outcome Blocks */}
                        {step.outcomes && (
                          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {step.outcomes.map((outcome, oIdx) => (
                              <div
                                key={oIdx}
                                className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-[10px] p-3.5 space-y-1 hover:border-[#D5D5D5] transition-colors"
                              >
                                <div className="text-[11px] font-bold uppercase tracking-wider text-[#171717]">
                                  {outcome.label}
                                </div>
                                <p className="text-[11.5px] text-[#555555] leading-relaxed">
                                  {outcome.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 04 COST OF STUDY ═════════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-[#FAF5F6] via-[#FAF8F5] to-[#F7EEF0] border border-[#F0DFE3] rounded-[18px] p-6 sm:p-8 space-y-5 shadow-[0_2px_12px_rgba(105,11,27,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0DFE3]/70 pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                04 COST OF STUDY
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
                Cost of studying in {activeGuide.countryName}
              </h2>
              <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
                Reference figures for financial planning — actual costs vary by university, city, program and lifestyle.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white border border-[#E8C4CC] px-3.5 py-1.5 rounded-full text-[11.5px] font-bold text-[#690B1B] shrink-0 shadow-xs">
              <span>🗂️</span> Budget & proof of funds
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
                label: 'VISA & FEES',
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
              // Smart parsing: separate primary monetary highlight from secondary contextual breakdown
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
                    <div className="mt-2 mb-2.5">
                      <div className="text-[15.5px] sm:text-[16.5px] font-bold text-[#111111] tracking-[-0.02em] leading-snug">
                        {primary || '—'}
                      </div>
                    </div>
                  </div>
                  {secondary ? (
                    <div className="pt-2.5 mt-2 border-t border-[#F0EBE5] text-[11px] text-[#555555] leading-relaxed">
                      {secondary}
                    </div>
                  ) : (
                    <div className="pt-2.5 mt-2 border-t border-[#F0EBE5] text-[11px] text-[#888888] leading-relaxed italic">
                      Standard university & consular rate
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 05 WORK & POST-STUDY OPTIONS ═════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#EAE5DF] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                05 WORK & POST-STUDY
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-[#111111] tracking-[-0.03em] mt-0.5">
                Work while studying & after graduation in {activeGuide.countryName}
              </h2>
              <p className="text-[12px] sm:text-[13px] text-[#666666] mt-1">
                Part-time student employment rules and post-graduation stay-back permits in {activeGuide.countryName}.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#690B1B] bg-[#FAF0F2] px-3 py-1 rounded-full border border-[#F3D5DC] shrink-0">
              <span>💼</span> Career & stay-back
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Card: Part-time Work */}
            <div className="bg-white border border-[#EAE5DF] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF4F5] border border-[#F3E2E6] flex items-center justify-center text-[#690B1B]">
                  💼
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#888]">EMPLOYMENT</div>
                  <h3 className="text-[15px] font-bold text-[#111]">PART-TIME WORK</h3>
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
                  🎓
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">STAY-BACK PERMIT</div>
                  <h3 className="text-[15px] font-bold text-white">POST-STUDY WORK</h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {activeGuide.workAndPostStudy.postStudyWork.map((psw, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px] text-gray-200 leading-relaxed">
                    <span className="text-[#EAB308] font-bold mt-0.5">✓</span>
                    <span>{psw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-[11.5px] text-[#777777] flex items-center gap-1.5 pt-1">
            <span>⚖</span> Rules may change. Verify current requirements before applying.
          </div>
        </section>

        {/* ══ 06 GOOD TO KNOW (IMPORTANT NOTES) ════════════════════════ */}
        <section className="bg-white border border-[#EAE5DF] rounded-[16px] p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3.5">
          <div className="flex items-center gap-2 border-b border-[#EAE5DF] pb-3">
            <span className="text-[16px]">💡</span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#690B1B]">
                06 INSIDER ADVICE
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111111]">
                Good to Know for {activeGuide.countryName}
              </h3>
            </div>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {activeGuide.goodToKnow.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-[#444] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B] mt-2 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ INTERACTIVE BRIDGE BANNER (NEXT STEPS) ═══════════════════ */}
        <section className="bg-[#111217] rounded-[18px] text-white p-7 sm:p-9 shadow-xl border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-[10.5px] font-bold tracking-wider text-[#C8A15D]">
              <span>✨</span> PLAN YOUR NEXT STEP
            </div>
            <h3 className="text-[20px] sm:text-[24px] font-bold text-white tracking-tight">
              Ready to explore universities in {activeGuide.countryName}?
            </h3>
            <p className="text-[13px] text-white/60 max-w-[500px]">
              Search accredited institutions, check admission likelihood with AI, and tailor your application.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/#universities"
              className="w-full sm:w-auto h-[44px] px-6 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              Explore Universities →
            </Link>
            <Link
              href="/#chance-me"
              className="w-full sm:w-auto h-[44px] px-6 rounded-full bg-white/10 hover:bg-white/15 text-white text-[13px] font-bold transition-all border border-white/15 flex items-center justify-center gap-1.5"
            >
              AI Chance-Me
            </Link>
          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════════════════════════════
         FOOTER — Abroad Simplified Brand Footer
         ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#030303] px-4 sm:px-8 lg:px-12 pt-12 sm:pt-16 md:pt-20 pb-8 text-left text-white mt-14">
        <div className="w-full max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
            {/* BRAND */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 max-w-[300px]">
              <Link href="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
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
                  { label: "Study in USA 🇺🇸", href: "/country-guide/usa" },
                  { label: "Study in UK 🇬🇧", href: "/country-guide/uk" },
                  { label: "Study in Canada 🇨🇦", href: "/country-guide/canada" },
                  { label: "Study in Germany 🇩🇪", href: "/country-guide/germany" },
                  { label: "Study in Australia 🇦🇺", href: "/country-guide/australia" },
                  { label: "Study in Ireland 🇮🇪", href: "/country-guide/ireland" },
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
                  { label: "University Finder", href: "/#universities" },
                  { label: "AI Chance-Me Predictor", href: "/#chance-me" },
                  { label: "SOP & Essay Studio", href: "/dashboard/essays" },
                  { label: "Application Tracker", href: "/dashboard/tracker" },
                  { label: "Scholarship Matcher", href: "/#scholarships" },
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
                Company & Legal
              </div>
              <div className="space-y-3.5">
                {[
                  { label: "Home", href: "/" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Student Login", href: "/login" },
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
