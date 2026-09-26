'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  FileText,
  User,
  Globe,
  MapPin,
  Activity,
  Briefcase,
  Trophy,
  Users,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  School,
  ShieldCheck,
  ClipboardCheck,
  ArrowRight,
  Pencil,
  Star,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// IMPORT6 FIELD SCHEMA — Every field maps to the actual Wix CMS
// ═══════════════════════════════════════════════════════════════
interface Import6FormData {
  studentName: string;
  studentId: string;
  admittedCollege: string;
  collegeLocation: string;
  collegeType: string;
  admissionDecision: string;
  applicationType: string;
  classYear: string;
  intendedMajor: string;
  gpaUnweighted40: string;
  gpaWeighted: string;
  classRank: string;
  satScoreTotal: string;
  satMath: string;
  satEbrw: string;
  actScore: string;
  numberOfApCourses: string;
  apCoursesTaken: string;
  apScores: string;
  numberOfIbCourses: string;
  ibCoursesDiploma: string;
  numberOfExtracurriculars: string;
  extracurricularActivities: string;
  numberOfAwards: string;
  awardsHonors: string;
  leadershipPositions: string;
  researchExperience: string;
  sportsAthletics: string;
  communityServiceVolunteering: string;
  workExperience: string;
  gender: string;
  ethnicity: string;
  stateCountry: string;
  firstGeneration: string;
  internationalStudent: string;
  schoolType: string;
  numberOfEssays: string;
  personalStatementEssay: string;
  supplementalEssays: string;
  lettersOfRecommendation: string;
  interview: string;
  source: string;
  profileUrl: string;
}

const INITIAL_FORM: Import6FormData = {
  studentName: '', studentId: '',
  admittedCollege: '', collegeLocation: '', collegeType: '', admissionDecision: 'Accepted',
  applicationType: 'Regular Decision', classYear: '2028', intendedMajor: '',
  gpaUnweighted40: '', gpaWeighted: '', classRank: '',
  satScoreTotal: '', satMath: '', satEbrw: '', actScore: '',
  numberOfApCourses: '', apCoursesTaken: '', apScores: '', numberOfIbCourses: '', ibCoursesDiploma: '',
  numberOfExtracurriculars: '', extracurricularActivities: '', numberOfAwards: '',
  awardsHonors: '', leadershipPositions: '', researchExperience: '',
  sportsAthletics: '', communityServiceVolunteering: '', workExperience: '',
  gender: '', ethnicity: '', stateCountry: '', firstGeneration: 'No',
  internationalStudent: 'No', schoolType: '',
  numberOfEssays: '', personalStatementEssay: '', supplementalEssays: '',
  lettersOfRecommendation: '', interview: '',
  source: 'Abroad Simplified Portal', profileUrl: '',
};

const STEPS = [
  { id: 1, label: 'Student & College', shortLabel: 'Student', icon: GraduationCap, color: '#690B1B' },
  { id: 2, label: 'Academics', shortLabel: 'Academics', icon: BookOpen, color: '#0088CB' },
  { id: 3, label: 'Activities & Honors', shortLabel: 'Activities', icon: Activity, color: '#C9A55D' },
  { id: 4, label: 'Background', shortLabel: 'Background', icon: Globe, color: '#2E7D32' },
  { id: 5, label: 'Essays & Recs', shortLabel: 'Essays', icon: FileText, color: '#7B1FA2' },
  { id: 6, label: 'Review & Submit', shortLabel: 'Review', icon: ClipboardCheck, color: '#690B1B' },
];

// ═══════════════════════════════════════════════════════════════
// POLISHED FORM COMPONENTS
// ═══════════════════════════════════════════════════════════════

function FormInput({
  label, value, onChange, placeholder, type = 'text', required = false, helperText, error, icon: Icon,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; required?: boolean; helperText?: string; error?: string; icon?: React.ElementType;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[11.5px] font-bold text-[#555] uppercase tracking-[0.06em] flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-[#690B1B]" />}
        <span>{label}</span>
        {required && <span className="text-[#690B1B] text-[10px] font-black">●</span>}
      </label>
      <div className={`relative rounded-[16px] transition-all duration-200 ${
        error ? 'ring-2 ring-red-200' : isFocused ? 'ring-2 ring-[#690B1B]/15 shadow-[0_0_0_1px_#690B1B]' : 'shadow-2xs'
      }`}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full h-[52px] px-4 rounded-[16px] bg-white border text-[14px] font-semibold text-[#111] outline-none transition-all placeholder:text-[#BBB] placeholder:font-normal ${
            error ? 'border-red-300' : 'border-[#E7E2DE]'
          }`}
        />
      </div>
      {helperText && !error && (
        <p className="text-[10.5px] text-[#999] font-medium pl-0.5">{helperText}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-500 font-bold pl-0.5 flex items-center gap-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

function FormTextarea({
  label, value, onChange, placeholder, required = false, helperText, rows = 4, icon: Icon,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  required?: boolean; helperText?: string; rows?: number; icon?: React.ElementType;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[11.5px] font-bold text-[#555] uppercase tracking-[0.06em] flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-[#690B1B]" />}
        <span>{label}</span>
        {required && <span className="text-[#690B1B] text-[10px] font-black">●</span>}
      </label>
      <div className={`relative rounded-[16px] transition-all duration-200 ${
        isFocused ? 'ring-2 ring-[#690B1B]/15 shadow-[0_0_0_1px_#690B1B]' : 'shadow-2xs'
      }`}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3.5 rounded-[16px] bg-white border border-[#E7E2DE] text-[14px] font-semibold text-[#111] outline-none transition-all resize-none placeholder:text-[#BBB] placeholder:font-normal leading-relaxed"
        />
      </div>
      {helperText && (
        <p className="text-[10.5px] text-[#999] font-medium pl-0.5">{helperText}</p>
      )}
    </div>
  );
}

function FormSelect({
  label, value, onChange, options, required = false, helperText, icon: Icon,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean; helperText?: string; icon?: React.ElementType;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11.5px] font-bold text-[#555] uppercase tracking-[0.06em] flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-[#690B1B]" />}
        <span>{label}</span>
        {required && <span className="text-[#690B1B] text-[10px] font-black">●</span>}
      </label>
      <div className="relative shadow-2xs rounded-[16px]">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[52px] px-4 pr-10 rounded-[16px] bg-white border border-[#E7E2DE] text-[14px] font-semibold text-[#111] outline-none focus:border-[#690B1B] focus:ring-2 focus:ring-[#690B1B]/15 transition-all cursor-pointer appearance-none"
        >
          <option value="" className="text-[#BBB]">Select…</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronRight size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] rotate-90 pointer-events-none" />
      </div>
      {helperText && <p className="text-[10.5px] text-[#999] font-medium pl-0.5">{helperText}</p>}
    </div>
  );
}

function SectionCard({
  title, subtitle, icon: Icon, accentColor = '#690B1B', children,
}: {
  title: string; subtitle?: string; icon: React.ElementType; accentColor?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E7E2DE] rounded-[24px] shadow-sm overflow-hidden">
      {/* Accent top bar */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}66)` }} />
      <div className="p-5 sm:p-7 space-y-5">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}12` }}>
            <Icon size={21} style={{ color: accentColor }} />
          </div>
          <div className="pt-0.5">
            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#111] tracking-[-0.01em]">{title}</h3>
            {subtitle && (
              <p className="text-[12px] sm:text-[13px] text-[#888] mt-0.5 leading-snug">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REVIEW COMPONENTS
// ═══════════════════════════════════════════════════════════════
function ReviewField({ label, value }: { label: string; value: string }) {
  if (!value || value.trim() === '') return null;
  const isLong = value.length > 100;
  return (
    <div className={`${isLong ? 'flex flex-col gap-1' : 'flex items-center justify-between gap-4'} py-3 border-b border-[#F0EBE6]/80 last:border-0`}>
      <span className="text-[11.5px] font-bold text-[#999] uppercase tracking-wider shrink-0">{label}</span>
      <span className={`text-[13px] font-semibold text-[#222] leading-relaxed ${isLong ? '' : 'text-right'}`}>
        {isLong ? value.slice(0, 300) + (value.length > 300 ? '…' : '') : value}
      </span>
    </div>
  );
}

function ReviewSection({
  title, icon: Icon, stepId, onEdit, children,
}: {
  title: string; icon: React.ElementType; stepId: number; onEdit: (step: number) => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E7E2DE] rounded-[20px] shadow-sm overflow-hidden group">
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#F0EBE6]/60 bg-[#FDFCFB]">
        <div className="flex items-center gap-2.5">
          <Icon size={16} className="text-[#690B1B]" />
          <span className="text-[14px] font-bold text-[#111]">{title}</span>
        </div>
        <button
          type="button"
          onClick={() => onEdit(stepId)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-[#690B1B] hover:text-[#7A1022] bg-[#F7F0F1] hover:bg-[#F0E4E6] px-3 py-1.5 rounded-full transition-all"
        >
          <Pencil size={11} />
          <span>Edit</span>
        </button>
      </div>
      <div className="px-5 sm:px-6 py-2">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CollegeAdmitPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Import6FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof Import6FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const totalSteps = STEPS.length;

  // ── AUTH GUARD ──
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  // Pre-fill student name from user data
  useEffect(() => {
    if (user && !formData.studentName) {
      const name = userData?.fullName || userData?.name || user.displayName || '';
      if (name) setFormData((prev) => ({ ...prev, studentName: name }));
    }
  }, [user, userData, formData.studentName]);

  const updateField = useCallback((field: keyof Import6FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) { const next = { ...prev }; delete next[field]; return next; }
      return prev;
    });
  }, []);

  // ── VALIDATION ──
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof Import6FormData, string>> = {};
    if (step === 1) {
      if (!formData.studentName.trim()) newErrors.studentName = 'Please enter the student name.';
      if (!formData.admittedCollege.trim()) newErrors.admittedCollege = 'Please enter the admitted college.';
      if (!formData.intendedMajor.trim()) newErrors.intendedMajor = 'Please enter the intended major.';
    }
    if (step === 2) {
      if (formData.gpaUnweighted40 && (isNaN(Number(formData.gpaUnweighted40)) || Number(formData.gpaUnweighted40) < 0 || Number(formData.gpaUnweighted40) > 4.0))
        newErrors.gpaUnweighted40 = 'Valid GPA: 0 – 4.0';
      if (formData.gpaWeighted && (isNaN(Number(formData.gpaWeighted)) || Number(formData.gpaWeighted) < 0 || Number(formData.gpaWeighted) > 5.0))
        newErrors.gpaWeighted = 'Valid weighted GPA: 0 – 5.0';
      if (formData.satScoreTotal && (isNaN(Number(formData.satScoreTotal)) || Number(formData.satScoreTotal) < 400 || Number(formData.satScoreTotal) > 1600))
        newErrors.satScoreTotal = 'Valid SAT: 400 – 1600';
      if (formData.satMath && (isNaN(Number(formData.satMath)) || Number(formData.satMath) < 200 || Number(formData.satMath) > 800))
        newErrors.satMath = 'Valid SAT Math: 200 – 800';
      if (formData.satEbrw && (isNaN(Number(formData.satEbrw)) || Number(formData.satEbrw) < 200 || Number(formData.satEbrw) > 800))
        newErrors.satEbrw = 'Valid SAT EBRW: 200 – 800';
      if (formData.actScore && (isNaN(Number(formData.actScore)) || Number(formData.actScore) < 1 || Number(formData.actScore) > 36))
        newErrors.actScore = 'Valid ACT: 1 – 36';
    }
    if (step === 5) {
      if (formData.profileUrl && formData.profileUrl.trim()) {
        try { new URL(formData.profileUrl); } catch { newErrors.profileUrl = 'Please enter a valid URL.'; }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── SUBMISSION ──
  const handleSubmit = async () => {
    if (hasSubmitted || isSubmitting) return;
    if (!formData.studentName.trim() || !formData.admittedCollege.trim()) {
      setSubmitError('Student name and admitted college are required.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload: Record<string, any> = {};
      for (const [key, val] of Object.entries(formData)) {
        if (typeof val === 'string' && val.trim() !== '') {
          if (['numberOfApCourses', 'numberOfIbCourses', 'numberOfExtracurriculars', 'numberOfAwards', 'numberOfEssays'].includes(key)) {
            payload[key] = Number(val) || 0;
          } else if (['gpaUnweighted40', 'gpaWeighted', 'satScoreTotal', 'satMath', 'satEbrw', 'actScore'].includes(key)) {
            const num = Number(val); payload[key] = isNaN(num) ? val : num;
          } else if (key === 'classYear') {
            const num = Number(val); payload[key] = isNaN(num) ? val : num;
          } else {
            payload[key] = val.trim();
          }
        }
      }
      const res = await fetch('/api/wix/import6', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setSubmitError(data.error || 'Submission failed. Please try again.'); setIsSubmitting(false); return; }
      setHasSubmitted(true);
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message === 'Failed to fetch' ? 'Network error. Please check your connection.' : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── LOADING / AUTH ──
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F6F4F2] flex flex-col items-center justify-center p-6 font-[Poppins]">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-10 h-10 rounded-full border-3 border-[#690B1B]/20 border-t-[#690B1B] animate-spin" />
          <h3 className="text-[15px] font-bold text-[#111]">
            {loading ? 'Checking authentication...' : 'Redirecting to sign in...'}
          </h3>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SUCCESS STATE
  // ═══════════════════════════════════════════════════════════════
  if (submitSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 font-[Poppins]">
        <div className="w-full max-w-[560px] text-center space-y-8">
          {/* Celebration */}
          <div className="relative">
            <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 flex items-center justify-center mx-auto shadow-lg shadow-green-100/50">
              <CheckCircle2 size={44} className="text-green-600" />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 flex gap-1">
              {['✦', '✧', '✦'].map((s, i) => (
                <span key={i} className="text-[#C9A55D] text-[16px] animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>{s}</span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-[26px] sm:text-[32px] font-bold text-[#111] tracking-[-0.03em]">
              Profile Submitted!
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#666] leading-relaxed max-w-[420px] mx-auto">
              Your admitted student profile for{' '}
              <span className="font-bold text-[#690B1B]">{formData.admittedCollege}</span>{' '}
              has been saved to the Abroad Simplified database.
            </p>
          </div>

          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 text-left space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[13px] font-bold text-[#111]">
              <Sparkles size={15} className="text-[#C9A55D]" />
              <span>Thank you for contributing!</span>
            </div>
            <p className="text-[12.5px] text-[#666] leading-relaxed">
              Your profile will help thousands of future applicants build stronger applications. You&apos;re helping democratize access to admissions data globally.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setSubmitSuccess(false); setHasSubmitted(false); setFormData(INITIAL_FORM); setCurrentStep(1); }}
              className="flex-1 h-[52px] rounded-[16px] bg-white border-2 border-[#E7E2DE] text-[#555] text-[14px] font-bold hover:border-[#690B1B]/40 hover:text-[#690B1B] transition-all"
            >
              Submit Another Profile
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 h-[52px] rounded-[16px] bg-[#690B1B] hover:bg-[#7A1022] text-white text-[14px] font-bold transition-all shadow-md shadow-[#690B1B]/20 flex items-center justify-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN FORM RENDER
  // ═══════════════════════════════════════════════════════════════
  const activeStep = STEPS[currentStep - 1];
  const completedFields = Object.values(formData).filter(v => v && v.trim() !== '').length;
  const totalFields = Object.keys(formData).length;

  return (
    <div className="max-w-[880px] mx-auto px-3 sm:px-5 md:px-6 py-5 sm:py-8 font-[Poppins]">
      {/* ═══════════════ PAGE HERO HEADER ═══════════════ */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-[60%] w-[120px] h-[120px] bg-[#C9A55D]/10 rounded-full translate-y-1/2" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A55D] bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  College Admit Portal
                </span>
              </div>
              <h1 className="text-[22px] sm:text-[28px] font-bold tracking-[-0.03em] leading-tight">
                Submit Admitted Profile
              </h1>
              <p className="text-[13px] text-white/70 max-w-[400px] leading-relaxed">
                Share your admission journey to help future applicants build stronger applications.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-[16px] px-4 py-3 border border-white/10 shrink-0">
              <div className="text-center">
                <div className="text-[20px] font-bold text-[#C9A55D]">{completedFields}</div>
                <div className="text-[9px] font-semibold text-white/50 uppercase tracking-wider">Fields</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-[20px] font-bold text-white">{currentStep}<span className="text-white/40">/{totalSteps}</span></div>
                <div className="text-[9px] font-semibold text-white/50 uppercase tracking-wider">Step</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ STEP NAVIGATION ═══════════════ */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isLast = idx === STEPS.length - 1;
              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => step.id <= currentStep ? goToStep(step.id) : null}
                    disabled={step.id > currentStep}
                    className={`flex items-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-[12px] transition-all flex-1 min-w-0 ${
                      isActive
                        ? 'bg-[#690B1B] text-white shadow-md shadow-[#690B1B]/20'
                        : isCompleted
                        ? 'bg-[#F7F0F1] text-[#690B1B] cursor-pointer hover:bg-[#F0E4E6]'
                        : 'text-[#CCC] cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[9px] flex items-center justify-center shrink-0 transition-all ${
                      isActive ? 'bg-white/20' : isCompleted ? 'bg-[#690B1B]/10' : 'bg-[#F0EBE6]'
                    }`}>
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold truncate hidden sm:block">
                      {step.shortLabel}
                    </span>
                  </button>
                  {!isLast && (
                    <div className={`w-3 sm:w-5 h-[2px] rounded-full shrink-0 transition-all ${
                      isCompleted ? 'bg-[#690B1B]/30' : 'bg-[#E7E2DE]'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════ STEP CONTENT ═══════════════ */}
      <div className="space-y-5 mb-8">

        {/* STEP 1: STUDENT & COLLEGE */}
        {currentStep === 1 && (
          <>
            <SectionCard title="Student Information" subtitle="Who is this admitted student profile for?" icon={User} accentColor="#690B1B">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Student Name" value={formData.studentName} onChange={(v) => updateField('studentName', v)}
                  placeholder="e.g. Rohan Mehta" required error={errors.studentName} icon={User} />
                <FormInput label="Student ID (Optional)" value={formData.studentId} onChange={(v) => updateField('studentId', v)}
                  placeholder="e.g. RS-2028-001" helperText="A unique identifier for this profile." />
              </div>
            </SectionCard>

            <SectionCard title="College & Admission" subtitle="Where were they admitted and how?" icon={Building2} accentColor="#0088CB">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Admitted College / University" value={formData.admittedCollege} onChange={(v) => updateField('admittedCollege', v)}
                  placeholder="e.g. MIT, Stanford, Oxford..." required error={errors.admittedCollege} icon={Building2} />
                <FormInput label="College Location" value={formData.collegeLocation} onChange={(v) => updateField('collegeLocation', v)}
                  placeholder="e.g. Cambridge, Massachusetts" icon={MapPin} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="College Type" value={formData.collegeType} onChange={(v) => updateField('collegeType', v)} icon={School}
                  options={[
                    { value: 'Private', label: 'Private University' }, { value: 'Public', label: 'Public University' },
                    { value: 'Liberal Arts', label: 'Liberal Arts College' }, { value: 'Research', label: 'Research University' },
                    { value: 'Community College', label: 'Community College' }, { value: 'Higher Education', label: 'Higher Education' },
                  ]} />
                <FormSelect label="Admission Decision" value={formData.admissionDecision} onChange={(v) => updateField('admissionDecision', v)} icon={ShieldCheck}
                  options={[
                    { value: 'Accepted', label: 'Accepted' }, { value: 'Waitlisted then Accepted', label: 'Waitlisted → Accepted' },
                    { value: 'Deferred then Accepted', label: 'Deferred → Accepted' },
                  ]} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Application Type" value={formData.applicationType} onChange={(v) => updateField('applicationType', v)}
                  options={[
                    { value: 'Regular Decision', label: 'Regular Decision (RD)' }, { value: 'Early Decision', label: 'Early Decision (ED)' },
                    { value: 'Early Decision II', label: 'Early Decision II' }, { value: 'Early Action', label: 'Early Action (EA)' },
                    { value: 'Restrictive Early Action', label: 'Restrictive EA (REA)' }, { value: 'Rolling', label: 'Rolling Admission' },
                  ]} />
                <FormSelect label="Class Year" value={formData.classYear} onChange={(v) => updateField('classYear', v)}
                  options={[
                    { value: '2025', label: 'Class of 2025' }, { value: '2026', label: 'Class of 2026' },
                    { value: '2027', label: 'Class of 2027' }, { value: '2028', label: 'Class of 2028' },
                    { value: '2029', label: 'Class of 2029' }, { value: '2030', label: 'Class of 2030' },
                  ]} />
                <FormInput label="Intended Major" value={formData.intendedMajor} onChange={(v) => updateField('intendedMajor', v)}
                  placeholder="e.g. Computer Science" required error={errors.intendedMajor} icon={BookOpen} />
              </div>
            </SectionCard>
          </>
        )}

        {/* STEP 2: ACADEMICS */}
        {currentStep === 2 && (
          <>
            <SectionCard title="GPA & Class Rank" subtitle="Academic performance." icon={Award} accentColor="#C9A55D">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="Unweighted GPA (4.0)" value={formData.gpaUnweighted40} onChange={(v) => updateField('gpaUnweighted40', v)}
                  placeholder="e.g. 3.92" error={errors.gpaUnweighted40} helperText="Out of 4.0" />
                <FormInput label="Weighted GPA" value={formData.gpaWeighted} onChange={(v) => updateField('gpaWeighted', v)}
                  placeholder="e.g. 4.35" error={errors.gpaWeighted} helperText="If applicable" />
                <FormInput label="Class Rank" value={formData.classRank} onChange={(v) => updateField('classRank', v)}
                  placeholder="e.g. Top 5%, 12/450" />
              </div>
            </SectionCard>

            <SectionCard title="Standardized Tests" subtitle="SAT, ACT scores." icon={Trophy} accentColor="#0088CB">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="SAT Total" value={formData.satScoreTotal} onChange={(v) => updateField('satScoreTotal', v)}
                  placeholder="e.g. 1540" error={errors.satScoreTotal} helperText="400 – 1600" />
                <FormInput label="SAT Math" value={formData.satMath} onChange={(v) => updateField('satMath', v)}
                  placeholder="e.g. 790" error={errors.satMath} helperText="200 – 800" />
                <FormInput label="SAT EBRW" value={formData.satEbrw} onChange={(v) => updateField('satEbrw', v)}
                  placeholder="e.g. 750" error={errors.satEbrw} helperText="200 – 800" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="ACT Composite" value={formData.actScore} onChange={(v) => updateField('actScore', v)}
                  placeholder="e.g. 35" error={errors.actScore} helperText="1 – 36" />
              </div>
            </SectionCard>

            <SectionCard title="Advanced Coursework" subtitle="AP/IB courses and scores." icon={BookOpen} accentColor="#2E7D32">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Number of AP Courses" value={formData.numberOfApCourses} onChange={(v) => updateField('numberOfApCourses', v)} placeholder="e.g. 12" />
                <FormInput label="Number of IB Courses" value={formData.numberOfIbCourses} onChange={(v) => updateField('numberOfIbCourses', v)} placeholder="e.g. 6" />
              </div>
              <FormTextarea label="AP Courses Taken" value={formData.apCoursesTaken} onChange={(v) => updateField('apCoursesTaken', v)}
                placeholder="e.g. AP Calculus BC, AP Physics C, AP Computer Science A…" rows={3} helperText="Comma-separated list." />
              <FormTextarea label="AP Scores" value={formData.apScores} onChange={(v) => updateField('apScores', v)}
                placeholder="e.g. Calculus BC: 5, Physics C: 5, CS A: 5…" rows={2} />
              <FormTextarea label="IB Courses / Diploma" value={formData.ibCoursesDiploma} onChange={(v) => updateField('ibCoursesDiploma', v)}
                placeholder="e.g. IB Mathematics HL, IB Physics HL…" rows={2} />
            </SectionCard>
          </>
        )}

        {/* STEP 3: EXTRACURRICULARS */}
        {currentStep === 3 && (
          <>
            <SectionCard title="Extracurricular Activities" subtitle="Clubs, organizations, and commitments." icon={Activity} accentColor="#C9A55D">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Number of Extracurriculars" value={formData.numberOfExtracurriculars} onChange={(v) => updateField('numberOfExtracurriculars', v)} placeholder="e.g. 10" />
                <FormInput label="Number of Awards" value={formData.numberOfAwards} onChange={(v) => updateField('numberOfAwards', v)} placeholder="e.g. 5" />
              </div>
              <FormTextarea label="Activities List" value={formData.extracurricularActivities} onChange={(v) => updateField('extracurricularActivities', v)}
                placeholder="List activities with roles, impact, and duration. E.g.:\n1. President, Robotics Club — Led team to FIRST Robotics finals\n2. Founder, CodeForChange — Taught coding to 200+ students" rows={5}
                helperText="Include role, organization, duration, and impact." icon={Activity} />
            </SectionCard>

            <SectionCard title="Awards & Leadership" subtitle="Recognitions and leadership roles." icon={Trophy} accentColor="#690B1B">
              <FormTextarea label="Awards & Honors" value={formData.awardsHonors} onChange={(v) => updateField('awardsHonors', v)}
                placeholder="e.g. USAMO Qualifier, National Merit Finalist, Intel ISEF Grand Award…" rows={4} icon={Award} />
              <FormTextarea label="Leadership Positions" value={formData.leadershipPositions} onChange={(v) => updateField('leadershipPositions', v)}
                placeholder="e.g. Student Body President, Debate Team Captain…" rows={3} icon={Users} />
            </SectionCard>

            <SectionCard title="Other Experiences" subtitle="Research, sports, service, and work." icon={Briefcase} accentColor="#7B1FA2">
              <FormTextarea label="Research Experience" value={formData.researchExperience} onChange={(v) => updateField('researchExperience', v)}
                placeholder="e.g. Research intern at Stanford AI Lab…" rows={3} />
              <FormTextarea label="Sports & Athletics" value={formData.sportsAthletics} onChange={(v) => updateField('sportsAthletics', v)}
                placeholder="e.g. Varsity Basketball (3 years)…" rows={2} />
              <FormTextarea label="Community Service" value={formData.communityServiceVolunteering} onChange={(v) => updateField('communityServiceVolunteering', v)}
                placeholder="e.g. 500+ hours at local hospital…" rows={3} />
              <FormTextarea label="Work Experience" value={formData.workExperience} onChange={(v) => updateField('workExperience', v)}
                placeholder="e.g. Software Engineering Intern at Google…" rows={2} />
            </SectionCard>
          </>
        )}

        {/* STEP 4: BACKGROUND */}
        {currentStep === 4 && (
          <SectionCard title="Demographics & Background" subtitle="Provides context for applicant comparison." icon={Globe} accentColor="#2E7D32">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect label="Gender" value={formData.gender} onChange={(v) => updateField('gender', v)} icon={User}
                options={[
                  { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' },
                  { value: 'Non-Binary', label: 'Non-Binary' }, { value: 'Prefer not to say', label: 'Prefer not to say' },
                ]} />
              <FormInput label="Ethnicity" value={formData.ethnicity} onChange={(v) => updateField('ethnicity', v)}
                placeholder="e.g. Asian, South Asian, White…" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="State / Country" value={formData.stateCountry} onChange={(v) => updateField('stateCountry', v)}
                placeholder="e.g. California, USA" icon={MapPin} />
              <FormSelect label="School Type" value={formData.schoolType} onChange={(v) => updateField('schoolType', v)} icon={School}
                options={[
                  { value: 'Public High School', label: 'Public High School' }, { value: 'Private High School', label: 'Private High School' },
                  { value: 'Charter School', label: 'Charter School' }, { value: 'Boarding School', label: 'Boarding School' },
                  { value: 'International School', label: 'International School' }, { value: 'Homeschooled', label: 'Homeschooled' },
                  { value: 'Magnet School', label: 'Magnet School' },
                ]} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect label="First Generation?" value={formData.firstGeneration} onChange={(v) => updateField('firstGeneration', v)}
                options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]} />
              <FormSelect label="International Student?" value={formData.internationalStudent} onChange={(v) => updateField('internationalStudent', v)} icon={Globe}
                options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]} />
            </div>

            {/* Helpful context note */}
            <div className="p-4 rounded-[16px] bg-[#F7F5F3] border border-[#E7E2DE] text-left text-[12.5px] text-[#555] space-y-1">
              <div className="font-bold text-[#111] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#C9A55D]" />
                <span>Why this matters:</span>
              </div>
              <div>
                Admissions committees evaluate applicants holistically. Background context helps future applicants understand how their own profile compares.
              </div>
            </div>
          </SectionCard>
        )}

        {/* STEP 5: ESSAYS */}
        {currentStep === 5 && (
          <>
            <SectionCard title="Essays & Writing" subtitle="Personal statement, supplementals, and other writing." icon={FileText} accentColor="#7B1FA2">
              <FormInput label="Number of Essays" value={formData.numberOfEssays} onChange={(v) => updateField('numberOfEssays', v)} placeholder="e.g. 8" />
              <FormTextarea label="Personal Statement / Common App Essay" value={formData.personalStatementEssay} onChange={(v) => updateField('personalStatementEssay', v)}
                placeholder="Paste or write the main college application essay here…" rows={8} helperText="Typically 650 words max." />
              <FormTextarea label="Supplemental Essays" value={formData.supplementalEssays} onChange={(v) => updateField('supplementalEssays', v)}
                placeholder="Paste supplemental essays here. Label each with its prompt if possible…" rows={8} helperText="Include all supplemental essays." />
            </SectionCard>

            <SectionCard title="Recommendations & Interview" subtitle="LORs and interview details." icon={Users} accentColor="#0088CB">
              <FormTextarea label="Letters of Recommendation" value={formData.lettersOfRecommendation} onChange={(v) => updateField('lettersOfRecommendation', v)}
                placeholder="e.g. 2 teacher recs (AP Physics, English), 1 counselor rec — highlighted leadership…" rows={3}
                helperText="Who wrote them and general themes." />
              <FormTextarea label="Interview Experience" value={formData.interview} onChange={(v) => updateField('interview', v)}
                placeholder="e.g. Alumni interview — Discussed research and startup projects…" rows={3} />
            </SectionCard>

            <SectionCard title="Source & Profile Link" subtitle="Origin and external references." icon={Globe} accentColor="#C9A55D">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Source" value={formData.source} onChange={(v) => updateField('source', v)} placeholder="e.g. Abroad Simplified Portal" />
                <FormInput label="Profile URL (Optional)" value={formData.profileUrl} onChange={(v) => updateField('profileUrl', v)}
                  placeholder="https://…" type="url" error={errors.profileUrl} />
              </div>
            </SectionCard>
          </>
        )}

        {/* STEP 6: REVIEW & SUBMIT */}
        {currentStep === 6 && (
          <>
            {/* Review banner */}
            <div className="bg-gradient-to-r from-[#690B1B] to-[#8A1226] rounded-[20px] p-5 sm:p-6 flex items-start gap-4 text-white">
              <div className="w-11 h-11 rounded-[14px] bg-white/15 flex items-center justify-center shrink-0">
                <ClipboardCheck size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[18px] font-bold">Review Your Submission</h3>
                <p className="text-[12.5px] text-white/70 mt-0.5">
                  Verify all information below. Click <strong className="text-[#C9A55D]">Edit</strong> on any section to make changes.
                </p>
              </div>
            </div>

            <ReviewSection title="Student & College" icon={GraduationCap} stepId={1} onEdit={goToStep}>
              <ReviewField label="Student Name" value={formData.studentName} />
              <ReviewField label="Student ID" value={formData.studentId} />
              <ReviewField label="Admitted College" value={formData.admittedCollege} />
              <ReviewField label="Location" value={formData.collegeLocation} />
              <ReviewField label="College Type" value={formData.collegeType} />
              <ReviewField label="Decision" value={formData.admissionDecision} />
              <ReviewField label="Application Type" value={formData.applicationType} />
              <ReviewField label="Class Year" value={formData.classYear} />
              <ReviewField label="Major" value={formData.intendedMajor} />
            </ReviewSection>

            <ReviewSection title="Academics" icon={BookOpen} stepId={2} onEdit={goToStep}>
              <ReviewField label="GPA (UW 4.0)" value={formData.gpaUnweighted40} />
              <ReviewField label="GPA (W)" value={formData.gpaWeighted} />
              <ReviewField label="Rank" value={formData.classRank} />
              <ReviewField label="SAT Total" value={formData.satScoreTotal} />
              <ReviewField label="SAT Math" value={formData.satMath} />
              <ReviewField label="SAT EBRW" value={formData.satEbrw} />
              <ReviewField label="ACT" value={formData.actScore} />
              <ReviewField label="AP Courses" value={formData.numberOfApCourses} />
              <ReviewField label="AP List" value={formData.apCoursesTaken} />
              <ReviewField label="AP Scores" value={formData.apScores} />
              <ReviewField label="IB Courses" value={formData.numberOfIbCourses} />
              <ReviewField label="IB Details" value={formData.ibCoursesDiploma} />
            </ReviewSection>

            <ReviewSection title="Activities & Honors" icon={Activity} stepId={3} onEdit={goToStep}>
              <ReviewField label="Extracurriculars" value={formData.numberOfExtracurriculars} />
              <ReviewField label="Activities" value={formData.extracurricularActivities} />
              <ReviewField label="Awards" value={formData.numberOfAwards} />
              <ReviewField label="Honors" value={formData.awardsHonors} />
              <ReviewField label="Leadership" value={formData.leadershipPositions} />
              <ReviewField label="Research" value={formData.researchExperience} />
              <ReviewField label="Sports" value={formData.sportsAthletics} />
              <ReviewField label="Service" value={formData.communityServiceVolunteering} />
              <ReviewField label="Work" value={formData.workExperience} />
            </ReviewSection>

            <ReviewSection title="Background" icon={Globe} stepId={4} onEdit={goToStep}>
              <ReviewField label="Gender" value={formData.gender} />
              <ReviewField label="Ethnicity" value={formData.ethnicity} />
              <ReviewField label="Location" value={formData.stateCountry} />
              <ReviewField label="School Type" value={formData.schoolType} />
              <ReviewField label="First Gen" value={formData.firstGeneration} />
              <ReviewField label="International" value={formData.internationalStudent} />
            </ReviewSection>

            <ReviewSection title="Essays & Recs" icon={FileText} stepId={5} onEdit={goToStep}>
              <ReviewField label="Essays (#)" value={formData.numberOfEssays} />
              <ReviewField label="Personal Statement" value={formData.personalStatementEssay ? `${formData.personalStatementEssay.slice(0, 200)}${formData.personalStatementEssay.length > 200 ? '…' : ''}` : ''} />
              <ReviewField label="Supplementals" value={formData.supplementalEssays ? `${formData.supplementalEssays.slice(0, 200)}${formData.supplementalEssays.length > 200 ? '…' : ''}` : ''} />
              <ReviewField label="Recommendations" value={formData.lettersOfRecommendation} />
              <ReviewField label="Interview" value={formData.interview} />
              <ReviewField label="Source" value={formData.source} />
              <ReviewField label="Profile URL" value={formData.profileUrl} />
            </ReviewSection>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-[16px] p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-[13px] font-bold text-red-700">{submitError}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══════════════ NAVIGATION FOOTER ═══════════════ */}
      <div className="sticky bottom-0 sm:static bg-[#F6F4F2] pt-3 pb-4 sm:pb-0 sm:pt-0 border-t sm:border-t-0 border-[#E7E2DE]/50 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button type="button" onClick={handleBack}
              className="h-[50px] px-5 sm:px-6 rounded-[14px] bg-white border-2 border-[#E7E2DE] text-[#555] text-[13px] sm:text-[14px] font-bold hover:border-[#690B1B]/40 hover:text-[#690B1B] transition-all flex items-center gap-2 shadow-2xs">
              <ChevronLeft size={17} />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < totalSteps ? (
            <button type="button" onClick={handleNext}
              className="h-[50px] px-6 sm:px-8 rounded-[14px] bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] sm:text-[14px] font-bold transition-all shadow-md shadow-[#690B1B]/20 flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99]">
              <span>Continue</span>
              <ChevronRight size={17} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={isSubmitting || hasSubmitted}
              className="h-[50px] px-6 sm:px-8 rounded-[14px] bg-[#690B1B] hover:bg-[#7A1022] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] sm:text-[14px] font-bold transition-all shadow-md shadow-[#690B1B]/20 flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99]">
              {isSubmitting ? (
                <><Loader2 size={17} className="animate-spin" /><span>Submitting…</span></>
              ) : (
                <><CheckCircle2 size={17} /><span>Submit Profile</span></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
