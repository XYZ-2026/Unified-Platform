'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ChevronLeft,
  ChevronDown,
  GraduationCap,
  Sparkles,
  Search,
  CheckCircle2,
  Building2,
  Award,
  BookOpen,
  ArrowRight,
  UserCheck,
  Globe,
  Briefcase,
  Check
} from 'lucide-react';

const COUNTRIES = [
  { name: 'Afghanistan', flag: '🇦🇫' },
  { name: 'Albania', flag: '🇦🇱' },
  { name: 'Algeria', flag: '🇩🇿' },
  { name: 'Andorra', flag: '🇦🇩' },
  { name: 'Angola', flag: '🇦🇴' },
  { name: 'Antigua & Barbuda', flag: '🇦🇬' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Armenia', flag: '🇦🇲' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Azerbaijan', flag: '🇦🇿' },
  { name: 'Bahamas', flag: '🇧🇸' },
  { name: 'Bahrain', flag: '🇧🇭' },
  { name: 'Bangladesh', flag: '🇧🇩' },
  { name: 'Barbados', flag: '🇧🇧' },
  { name: 'Belarus', flag: '🇧🇾' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Belize', flag: '🇧🇿' },
  { name: 'Benin', flag: '🇧🇯' },
  { name: 'Bhutan', flag: '🇧🇹' },
  { name: 'Bolivia', flag: '🇧🇴' },
  { name: 'Bosnia & Herzegovina', flag: '🇧🇦' },
  { name: 'Botswana', flag: '🇧🇼' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Brunei', flag: '🇧🇳' },
  { name: 'Bulgaria', flag: '🇧🇬' },
  { name: 'Burkina Faso', flag: '🇧🇫' },
  { name: 'Burundi', flag: '🇧🇮' },
  { name: 'Cambodia', flag: '🇰🇭' },
  { name: 'Cameroon', flag: '🇨🇲' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Cape Verde', flag: '🇨🇻' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Costa Rica', flag: '🇨🇷' },
  { name: 'Croatia', flag: '🇭🇷' },
  { name: 'Cuba', flag: '🇨🇺' },
  { name: 'Cyprus', flag: '🇨🇾' },
  { name: 'Czech Republic', flag: '🇨🇿' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Dominican Republic', flag: '🇩🇴' },
  { name: 'Ecuador', flag: '🇪🇨' },
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'El Salvador', flag: '🇸🇻' },
  { name: 'Estonia', flag: '🇪🇪' },
  { name: 'Ethiopia', flag: '🇪🇹' },
  { name: 'Fiji', flag: '🇫🇯' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Gabon', flag: '🇬🇦' },
  { name: 'Georgia', flag: '🇬🇪' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Guatemala', flag: '🇬🇹' },
  { name: 'Honduras', flag: '🇭🇳' },
  { name: 'Hungary', flag: '🇭🇺' },
  { name: 'Iceland', flag: '🇮🇸' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Iran', flag: '🇮🇷' },
  { name: 'Iraq', flag: '🇮🇶' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Israel', flag: '🇮🇱' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Jamaica', flag: '🇯🇲' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Jordan', flag: '🇯🇴' },
  { name: 'Kazakhstan', flag: '🇰🇿' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Kuwait', flag: '🇰🇼' },
  { name: 'Kyrgyzstan', flag: '🇰🇬' },
  { name: 'Laos', flag: '🇱🇦' },
  { name: 'Latvia', flag: '🇱🇻' },
  { name: 'Lebanon', flag: '🇱🇧' },
  { name: 'Libya', flag: '🇱🇾' },
  { name: 'Lithuania', flag: '🇱🇹' },
  { name: 'Luxembourg', flag: '🇱🇺' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Maldives', flag: '🇲🇻' },
  { name: 'Malta', flag: '🇲🇹' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Moldova', flag: '🇲🇩' },
  { name: 'Monaco', flag: '🇲🇨' },
  { name: 'Mongolia', flag: '🇲🇳' },
  { name: 'Montenegro', flag: '🇲🇪' },
  { name: 'Morocco', flag: '🇲🇦' },
  { name: 'Nepal', flag: '🇳🇵' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'Nicaragua', flag: '🇳🇮' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'North Macedonia', flag: '🇲🇰' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Oman', flag: '🇴🇲' },
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Palestine', flag: '🇵🇸' },
  { name: 'Panama', flag: '🇵🇦' },
  { name: 'Paraguay', flag: '🇵🇾' },
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'Philippines', flag: '🇵🇭' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Qatar', flag: '🇶🇦' },
  { name: 'Romania', flag: '🇷🇴' },
  { name: 'Russia', flag: '🇷🇺' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Serbia', flag: '🇷🇸' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Slovakia', flag: '🇸🇰' },
  { name: 'Slovenia', flag: '🇸🇮' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Sudan', flag: '🇸🇩' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Syria', flag: '🇸🇾' },
  { name: 'Taiwan', flag: '🇹🇼' },
  { name: 'Tanzania', flag: '🇹🇿' },
  { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Tunisia', flag: '🇹🇳' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Ukraine', flag: '🇺🇦' },
  { name: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Uruguay', flag: '🇺🇾' },
  { name: 'Uzbekistan', flag: '🇺🇿' },
  { name: 'Venezuela', flag: '🇻🇪' },
  { name: 'Vietnam', flag: '🇻🇳' },
  { name: 'Yemen', flag: '🇾🇪' },
  { name: 'Zambia', flag: '🇿🇲' },
  { name: 'Zimbabwe', flag: '🇿🇼' },
];

function StunningCountryDropdown({
  selectedCountry,
  onSelectCountry
}: {
  selectedCountry: string;
  onSelectCountry: (countryName: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedObj = COUNTRIES.find(
    (c) => c.name.toLowerCase() === selectedCountry.toLowerCase()
  );

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[54px] px-4 rounded-[16px] bg-[#FDFCFB] border-2 transition-all flex items-center justify-between shadow-2xs ${isOpen ? 'border-[#690B1B] bg-white ring-2 ring-[#690B1B]/10' : 'border-[#E7E2DE] hover:border-[#690B1B]/40'
          }`}
      >
        {selectedObj ? (
          <div className="flex items-center gap-3">
            <span className="text-[24px] leading-none">{selectedObj.flag}</span>
            <span className="text-[15px] font-bold text-[#111111]">{selectedObj.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-[#888888]">
            <Globe size={18} className="text-[#999999]" />
            <span className="text-[14px] font-medium">Select your country...</span>
          </div>
        )}
        <ChevronDown
          size={18}
          className={`text-[#777777] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#690B1B]' : ''}`}
        />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-[62px] left-0 right-0 z-50 bg-white border-2 border-[#690B1B]/20 rounded-[20px] shadow-xl p-3 space-y-2 animate-in fade-in duration-150">
          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full h-[40px] pl-10 pr-3 rounded-[12px] bg-[#F7F5F3] border border-[#E7E2DE] text-[13px] text-[#111] placeholder:text-[#999] outline-none focus:border-[#690B1B]"
              autoFocus
            />
          </div>

          {/* COUNTRIES LIST */}
          <div className="max-h-[240px] overflow-y-auto space-y-1 custom-scrollbar pr-1">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-[13px] text-[#888888]">No country found</div>
            ) : (
              filtered.map((c) => {
                const isSelected = c.name.toLowerCase() === selectedCountry.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      onSelectCountry(c.name);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full p-2.5 rounded-[12px] transition-all flex items-center justify-between text-left ${isSelected
                      ? 'bg-[#F7F0F1] text-[#690B1B] font-bold'
                      : 'hover:bg-[#F9F7F5] text-[#333333]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[22px] leading-none">{c.flag}</span>
                      <span className="text-[14px] font-bold leading-tight">{c.name}</span>
                    </div>
                    {isSelected && <Check size={16} className="text-[#690B1B]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Onboarding Form State
  const [userRole, setUserRole] = useState<'applicant' | 'admit'>('applicant');
  const [applicationCycle, setApplicationCycle] = useState('Fall 2026');
  const [targetMajor, setTargetMajor] = useState('');
  const [dreamSchool, setDreamSchool] = useState('');
  const [gpa, setGpa] = useState('3.9');
  const [country, setCountry] = useState(''); // Default unselected
  const [financialAid, setFinancialAid] = useState(true);

  // Search filter states
  const [majorSearch, setMajorSearch] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');

  const majorsList = [
    'Computer Science & AI',
    'Business & Finance',
    'Biomedical Engineering',
    'Data Science & Analytics',
    'Economics & Policy',
    'Mechanical Engineering',
    'Pre-Medicine & Health',
    'Law & International Relations',
    'Psychology & Cognitive Science',
    'Electrical Engineering & Robotics',
    'Architecture & Urban Design',
    'Environmental Science'
  ];

  const universitiesList = [
    'University of Pennsylvania (UPenn)',
    'Harvard University',
    'Massachusetts Institute of Technology (MIT)',
    'Stanford University',
    'Imperial College London',
    'Technical University of Munich (TUM)',
    'University of Toronto',
    'Oxford University',
    'Cambridge University',
    'Columbia University',
    'Carnegie Mellon University (CMU)',
    'Georgia Institute of Technology'
  ];

  const filteredMajors = majorsList.filter((m) =>
    m.toLowerCase().includes(majorSearch.toLowerCase())
  );

  const filteredUniversities = universitiesList.filter((u) =>
    u.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save onboarding answers to Wix CMS user-details collection
      try {
        await fetch('/api/wix/user-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.uid || 'guest-user',
            userEmail: user?.email || '',
            userRole,
            applicationCycle,
            targetMajor,
            dreamSchool,
            gpa,
            country: country || 'Unspecified',
            financialAid
          })
        });
      } catch (err) {
        console.error('Error submitting data to Wix CMS:', err);
      }
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4F2] flex flex-col justify-between items-center p-5 selection:bg-[#690B1B] selection:text-white font-[Poppins]">
      {/* ═══════════════════════════════════════════════════════════════
         TOP HEADER BAR — Step Dots & Back Arrow
         ═══════════════════════════════════════════════════════════════ */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4">
        {currentStep > 1 ? (
          <button
            onClick={handleBack}
            className="p-2.5 rounded-full bg-white border border-[#E7E2DE] text-[#555] hover:text-[#690B1B] hover:border-[#690B1B] transition-all shadow-2xs"
            aria-label="Back Step"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-10" />
        )}

        {/* STEP PROGRESS DOTS */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            return (
              <div
                key={stepNum}
                className={`h-2 rounded-full transition-all duration-300 ${stepNum === currentStep
                  ? 'w-8 bg-[#690B1B]'
                  : stepNum < currentStep
                    ? 'w-2 bg-[#C9A55D]'
                    : 'w-2 bg-[#E7E2DE]'
                  }`}
              />
            );
          })}
        </div>

        <div className="text-[12px] font-bold text-[#888]">
          Step {currentStep} of {totalSteps}
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
         ONBOARDING CARD CONTAINER — Abroad Simplified Theme
         ═══════════════════════════════════════════════════════════════ */}
      <main className="w-full max-w-[620px] my-auto py-8">
        <div className="bg-white border border-[#E7E2DE] rounded-[28px] p-7 sm:p-10 shadow-sm space-y-8">
          {/* STEP 1: WHICH ONE ARE YOU? */}
          {currentStep === 1 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A55D] bg-[#FFF8EB] px-3 py-1 rounded-full border border-[#F4D080]">
                  Welcome to Abroad Simplified
                </span>
                <h1 className="text-[28px] sm:text-[34px] font-bold text-[#111111] tracking-[-0.03em]">
                  Which one are you?
                </h1>
                <p className="text-[14px] text-[#777777] max-w-[420px] mx-auto">
                  Select your primary role so we can personalize your admissions experience.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <button
                  onClick={() => setUserRole('applicant')}
                  className={`p-6 rounded-[20px] text-left border-2 transition-all flex items-start gap-4 ${userRole === 'applicant'
                    ? 'bg-[#F7F0F1] border-[#690B1B] shadow-xs'
                    : 'bg-[#FDFCFB] border-[#E7E2DE] hover:border-[#690B1B]/40'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${userRole === 'applicant' ? 'bg-[#690B1B] text-white' : 'bg-[#F7F5F3] text-[#690B1B]'
                    }`}>
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <div className="text-[18px] font-bold text-[#111]">I&apos;m an Applicant</div>
                    <p className="text-[13px] text-[#666] mt-1 leading-relaxed">
                      Get AI guidance, university matching, SOP reviews, and chance predictions for your college applications.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setUserRole('admit')}
                  className={`p-6 rounded-[20px] text-left border-2 transition-all flex items-start gap-4 ${userRole === 'admit'
                    ? 'bg-[#F7F0F1] border-[#690B1B] shadow-xs'
                    : 'bg-[#FDFCFB] border-[#E7E2DE] hover:border-[#690B1B]/40'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${userRole === 'admit' ? 'bg-[#690B1B] text-white' : 'bg-[#F7F5F3] text-[#690B1B]'
                    }`}>
                    <Award size={24} />
                  </div>
                  <div>
                    <div className="text-[18px] font-bold text-[#111]">I&apos;m a College Admit / Mentor</div>
                    <p className="text-[13px] text-[#666] mt-1 leading-relaxed">
                      Share your admitted profile, review SOPs, and mentor ambitious study abroad applicants.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: APPLICATION CYCLE */}
          {currentStep === 2 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-full">
                  TIMELINE SETTING
                </span>
                <h1 className="text-[28px] sm:text-[34px] font-bold text-[#111111] tracking-[-0.03em]">
                  What cycle are you applying for?
                </h1>
                <p className="text-[14px] text-[#777777] max-w-[420px] mx-auto">
                  We will calibrate your milestone deadlines based on your target intake term.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {['Fall 2026', 'Fall 2027', 'Fall 2028', 'Spring 2027'].map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setApplicationCycle(cycle)}
                    className={`p-4 sm:p-5 rounded-[16px] border-2 text-center transition-all ${applicationCycle === cycle
                      ? 'bg-[#690B1B] text-white border-[#690B1B] font-bold shadow-xs'
                      : 'bg-[#FDFCFB] border-[#E7E2DE] text-[#333] hover:border-[#690B1B]'
                      }`}
                  >
                    <div className="text-[16px] font-bold">{cycle}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">Admissions Intake</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: WHAT DO YOU WANT TO STUDY? */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A55D] bg-[#FFF8EB] px-3 py-1 rounded-full border border-[#F4D080]">
                  ACADEMIC INTENT
                </span>
                <h1 className="text-[28px] sm:text-[34px] font-bold text-[#111111] tracking-[-0.03em]">
                  What do you want to study?
                </h1>
                <p className="text-[14px] text-[#777777] max-w-[420px] mx-auto">
                  Search or select your intended major or field of study.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                  <input
                    type="text"
                    value={majorSearch}
                    onChange={(e) => setMajorSearch(e.target.value)}
                    placeholder="Search major (e.g. Computer Science, Finance)..."
                    className="w-full h-[50px] pl-11 pr-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
                  />
                </div>

                <div className="max-h-[260px] overflow-y-auto space-y-2 custom-scrollbar text-left pr-1">
                  {filteredMajors.map((m) => (
                    <button
                      key={m}
                      onClick={() => setTargetMajor(m)}
                      className={`w-full p-3.5 rounded-[14px] border text-[14px] font-medium transition-all flex items-center justify-between ${targetMajor === m
                        ? 'bg-[#F7F0F1] border-[#690B1B] text-[#690B1B] font-bold'
                        : 'bg-[#FDFCFB] border-[#E7E2DE] text-[#444] hover:border-[#690B1B]/40'
                        }`}
                    >
                      <span>{m}</span>
                      {targetMajor === m && <CheckCircle2 size={18} className="text-[#690B1B]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DREAM SCHOOL */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-full">
                  UNIVERSITY PREFERENCE
                </span>
                <h1 className="text-[28px] sm:text-[34px] font-bold text-[#111111] tracking-[-0.03em]">
                  Do you already have a dream school?
                </h1>
                <p className="text-[14px] text-[#777777] max-w-[420px] mx-auto">
                  Select your top choice university to add to your Dream tier list.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                  <input
                    type="text"
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                    placeholder="Search universities (e.g. UPenn, Harvard, MIT)..."
                    className="w-full h-[50px] pl-11 pr-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
                  />
                </div>

                <div className="max-h-[260px] overflow-y-auto space-y-2 custom-scrollbar text-left pr-1">
                  {filteredUniversities.map((u) => (
                    <button
                      key={u}
                      onClick={() => setDreamSchool(u)}
                      className={`w-full p-3.5 rounded-[14px] border text-[14px] font-medium transition-all flex items-center justify-between ${dreamSchool === u
                        ? 'bg-[#F7F0F1] border-[#690B1B] text-[#690B1B] font-bold'
                        : 'bg-[#FDFCFB] border-[#E7E2DE] text-[#444] hover:border-[#690B1B]/40'
                        }`}
                    >
                      <span>{u}</span>
                      {dreamSchool === u && <CheckCircle2 size={18} className="text-[#690B1B]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ACADEMICS & GPA */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A55D] bg-[#FFF8EB] px-3 py-1 rounded-full border border-[#F4D080]">
                  ACADEMIC PROFILE
                </span>
                <h1 className="text-[28px] sm:text-[34px] font-bold text-[#111111] tracking-[-0.03em]">
                  What is your high school GPA?
                </h1>
                <p className="text-[14px] text-[#777777] max-w-[420px] mx-auto">
                  Enter your unweighted GPA (out of 4.0 or percentage).
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-[12px] font-bold text-[#555] block mb-1">Unweighted GPA</label>
                  <input
                    type="text"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder="e.g. 3.9"
                    className="w-full h-[52px] px-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] text-[18px] font-bold text-[#111] text-center outline-none focus:border-[#690B1B]"
                  />
                </div>

                <div className="p-4 rounded-[16px] bg-[#F7F5F3] border border-[#E7E2DE] text-left text-[13px] text-[#555] space-y-1">
                  <div className="font-bold text-[#111]">💡 Test-Optional Note:</div>
                  <div>Don&apos;t worry if you haven&apos;t taken the SAT/ACT yet — you can update test scores later inside your profile.</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: LOCATION & AID (UNSELECTED DEFAULT & NO COUNTRY CODE) */}
          {currentStep === 6 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-full">
                  FINAL DETAILS
                </span>
                <h1 className="text-[28px] sm:text-[34px] font-bold text-[#111111] tracking-[-0.03em]">
                  Where are you applying from?
                </h1>
                <p className="text-[14px] text-[#777777] max-w-[420px] mx-auto">
                  Confirm your applicant country &amp; scholarship preference.
                </p>
              </div>

              <div className="space-y-5 pt-2 text-left">
                {/* STUNNING COUNTRY SELECTOR */}
                <div>
                  <label className="text-[12px] font-bold text-[#555555] block mb-1.5 uppercase tracking-wider">
                    Country of Citizenship
                  </label>
                  <StunningCountryDropdown
                    selectedCountry={country}
                    onSelectCountry={(selectedName) => setCountry(selectedName)}
                  />
                </div>

                <div className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-[#111]">Financial Aid / Scholarships</div>
                    <div className="text-[12px] text-[#777]">Include scholarship matching in your university recommendations.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFinancialAid(!financialAid)}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${financialAid ? 'bg-[#690B1B]' : 'bg-[#E7E2DE]'
                      }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${financialAid ? 'right-0.5' : 'left-0.5'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONTINUE BUTTON */}
          <button
            onClick={handleNext}
            className="w-full h-[54px] rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[15px] font-bold transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-[1.01]"
          >
            <span>{currentStep === totalSteps ? 'Complete Setup & Open Dashboard →' : 'Continue →'}</span>
          </button>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
         FOOTER BRANDING
         ═══════════════════════════════════════════════════════════════ */}
      <footer className="py-4 text-center">
        <div className="flex items-center justify-center gap-2 text-[14px] font-bold text-[#111]">
          <span className="w-5 h-5 rounded-[6px] bg-gradient-to-br from-[#7A1022] to-[#530816] inline-flex items-center justify-center text-white text-[10px]">
            AS
          </span>
          <span>Abroad Simplified</span>
        </div>
      </footer>
    </div>
  );
}
