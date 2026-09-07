'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Building2,
  MapPin,
  Award,
  BookOpen,
  Activity,
  FileText,
  User,
  Globe,
  ExternalLink,
  Copy,
  Check,
  BarChart3,
  Trophy,
  Briefcase,
  Users,
  Compass,
  MessageSquare,
  ShieldCheck,
  Clock,
  Loader2,
  AlertCircle,
  HelpCircle,
  School,
  FileCheck,
} from 'lucide-react';

interface StudentProfile {
  id: string;
  studentId: string;
  studentName: string;
  admittedCollege: string;
  collegeLocation: string;
  collegeType: string;
  admissionDecision: string;
  applicationType: string;
  classYear: number | string;
  intendedMajor: string;

  // Academics
  gpaUnweighted40: number | string;
  gpaWeighted: number | string;
  classRank: string;
  satScoreTotal: number | string;
  satMath: number | string;
  satEbrw: number | string;
  actScore: number | string;
  numberOfApCourses: number;
  apCoursesTaken: string;
  apScores: string;
  numberOfIbCourses: number;
  ibCoursesDiploma: string;

  // Extracurriculars & Honors
  numberOfExtracurriculars: number;
  extracurricularActivities: string;
  numberOfAwards: number;
  awardsHonors: string;
  leadershipPositions: string;
  researchExperience: string;
  sportsAthletics: string;
  communityServiceVolunteering: string;
  workExperience: string;

  // Demographics & Background
  gender: string;
  ethnicity: string;
  stateCountry: string;
  firstGeneration: string;
  internationalStudent: string;
  schoolType: string;

  // Essays & Subjective Evaluation
  numberOfEssays: number;
  personalStatementEssay: string;
  supplementalEssays: string;
  lettersOfRecommendation: string;
  interview: string;

  // Sources & Metadata
  source: string;
  profileUrl: string;
  createdDate?: string | null;
  updatedDate?: string | null;
}

export default function AdmittedStudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'extracurriculars' | 'awards' | 'essays' | 'recommendations'>('overview');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchStudent() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/wix/admitted-students/${id}`);
        const data = await res.json();

        if (data.success && data.student) {
          setStudent(data.student);
        } else {
          setError(data.error || 'Student application profile not found');
        }
      } catch (err: any) {
        console.error('Error fetching student profile:', err);
        setError('Failed to load student application profile');
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Helper to parse numbered lists (e.g. extracurriculars, awards)
  const parseNumberedList = (rawText: string): Array<{ number: string; title: string; body: string }> => {
    if (!rawText || !rawText.trim()) return [];

    const items: Array<{ number: string; title: string; body: string }> = [];
    // Split by numbers like "1. ", "2. ", or newlines followed by digit
    const lines = rawText.split(/(?:^|\n)(?=\d+\.\s*)/).map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
      const match = line.match(/^(\d+)\.\s*([\s\S]*?)(?::\s*([\s\S]*))?$/);
      if (match) {
        items.push({
          number: match[1],
          title: match[2]?.trim() || `Item ${match[1]}`,
          body: match[3]?.trim() || '',
        });
      } else {
        items.push({
          number: '',
          title: line,
          body: '',
        });
      }
    }
    return items;
  };

  // Helper to parse semicolon separated lists
  const parseSemicolonList = (rawText: string): string[] => {
    if (!rawText || !rawText.trim()) return [];
    return rawText
      .split(';')
      .map(s => s.trim())
      .filter(Boolean);
  };

  // ─── LOADING STATE ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
        <div className="h-[220px] bg-gradient-to-r from-gray-200 to-gray-300 rounded-[24px] animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-[18px] animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-white border border-[#E7E2DE] rounded-[24px] p-6 animate-pulse" />
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-[#690B1B]" size={32} />
        </div>
      </div>
    );
  }

  // ─── ERROR STATE ───────────────────────────────────────────
  if (error || !student) {
    return (
      <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full">
        <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FEF2F2] text-red-500 mx-auto flex items-center justify-center">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-[20px] font-bold text-[#111]">Student Profile Not Found</h2>
          <p className="text-[14px] text-[#777] max-w-[460px] mx-auto leading-relaxed">
            {error || 'We could not find the student profile with this ID. It may have been removed or the link is invalid.'}
          </p>
          <button
            onClick={() => router.push('/dashboard/past-admits')}
            className="px-5 py-2.5 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Admitted Profiles</span>
          </button>
        </div>
      </div>
    );
  }

  const s = student;
  const avatarLetter = s.studentName ? s.studentName.charAt(0).toUpperCase() : 'S';
  const ecList = parseNumberedList(s.extracurricularActivities);
  const awardsList = parseNumberedList(s.awardsHonors);
  const apScoresList = parseSemicolonList(s.apScores);
  const apCoursesList = parseSemicolonList(s.apCoursesTaken);
  const leadershipList = parseSemicolonList(s.leadershipPositions);

  const tabs: Array<{
    id: 'overview' | 'academics' | 'extracurriculars' | 'awards' | 'essays' | 'recommendations';
    label: string;
    icon: any;
    count?: number;
  }> = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'academics', label: 'Academics & Testing', icon: GraduationCap },
    { id: 'extracurriculars', label: 'Extracurriculars', icon: Activity, count: s.numberOfExtracurriculars },
    { id: 'awards', label: 'Honors & Awards', icon: Award, count: s.numberOfAwards },
    { id: 'essays', label: 'Essays', icon: FileText, count: s.numberOfEssays },
    { id: 'recommendations', label: 'Recommendations', icon: MessageSquare },
  ];

  return (
    <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      {/* ═══════════════════════════════════════════════════════
         BACK NAVIGATION & BREADCRUMB
         ═══════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => router.push('/dashboard/past-admits')}
          className="h-[36px] px-4 rounded-full inline-flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-[#690B1B] bg-white border border-[#E7E2DE] hover:bg-[#F7F0F1] transition-all cursor-pointer group shadow-2xs active:scale-95 shrink-0 whitespace-nowrap"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Admitted Profiles</span>
        </button>

        <div className="flex items-center gap-1.5 text-[12px] text-[#888]">
          <Link href="/dashboard" className="hover:text-[#690B1B]">Dashboard</Link>
          <span>/</span>
          <Link href="/dashboard/past-admits" className="hover:text-[#690B1B]">Admitted Profiles</Link>
          <span>/</span>
          <span className="font-semibold text-[#111] truncate max-w-[200px]">{s.studentName}</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         HERO APPLICANT DOSSIER HEADER
         ═══════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-5 sm:p-7 md:p-8 text-white shadow-sm space-y-5 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-white/3 rounded-full blur-2xl -mb-32 pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[11.5px] sm:text-[12px] font-bold backdrop-blur-md">
            <Sparkles size={14} />
            <span>Verified Admitted Student Application</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#16a34a] text-white text-[11.5px] font-bold shadow-xs">
              {s.admissionDecision || 'Accepted'}
            </span>
            {s.applicationType && (
              <span className="px-3 py-1 rounded-full bg-white/15 text-white text-[11.5px] font-semibold backdrop-blur-md">
                {s.applicationType}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11.5px] font-semibold">
              Class of {s.classYear}
            </span>
          </div>
        </div>

        {/* Identity & College Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 aspect-square rounded-[22px] bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-bold text-[28px] sm:text-[34px] shadow-md">
              {avatarLetter}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[22px] sm:text-[28px] md:text-[34px] font-bold leading-tight">
                  {s.studentName}
                </h1>
                <CheckCircle2 size={20} className="text-[#4ade80] shrink-0" />
                <span className="text-[11px] font-bold bg-white/15 text-white/90 px-2.5 py-0.5 rounded-full border border-white/20">
                  ID: {s.studentId}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[13.5px] sm:text-[15px] text-white/90 flex-wrap">
                <span className="font-bold flex items-center gap-1.5 text-[#FFE0E6]">
                  <Building2 size={15} className="shrink-0 text-[#C9A55D]" />
                  Admitted to {s.admittedCollege}
                </span>
                {s.collegeLocation && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="flex items-center gap-1 text-white/80">
                      <MapPin size={13} className="shrink-0" />
                      {s.collegeLocation}
                    </span>
                  </>
                )}
                {s.collegeType && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-[11.5px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8EB] text-[#9E731A]">
                      {s.collegeType}
                    </span>
                  </>
                )}
              </div>

              <div className="text-[13px] text-white/80 pt-0.5">
                Intended Major: <span className="font-semibold text-white">{s.intendedMajor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics & Background Pill Row */}
        <div className="pt-3 border-t border-white/15 flex items-center gap-2 flex-wrap text-[11.5px] text-white/85 relative z-10">
          {s.stateCountry && (
            <span className="px-2.5 py-1 rounded-full bg-white/10 flex items-center gap-1">
              <MapPin size={12} />
              <span>Location: <b>{s.stateCountry}</b></span>
            </span>
          )}
          {s.schoolType && (
            <span className="px-2.5 py-1 rounded-full bg-white/10 flex items-center gap-1">
              <School size={12} />
              <span>School: <b>{s.schoolType}</b></span>
            </span>
          )}
          {s.gender && (
            <span className="px-2.5 py-1 rounded-full bg-white/10 flex items-center gap-1">
              <User size={12} />
              <span>Gender: <b>{s.gender}</b></span>
            </span>
          )}
          {s.ethnicity && (
            <span className="px-2.5 py-1 rounded-full bg-white/10">
              Ethnicity: <b>{s.ethnicity}</b>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-white/10">
            First-Gen: <b>{s.firstGeneration}</b>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/10">
            International: <b>{s.internationalStudent}</b>
          </span>
          {s.source && (
            <a
              href={s.source}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white flex items-center gap-1 ml-auto"
            >
              <Globe size={12} />
              <span>Source</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         EXECUTIVE METRICS SCORECARD
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Weighted GPA */}
        <div className="bg-white border border-[#E7E2DE] rounded-[18px] p-4 text-center space-y-1 shadow-2xs">
          <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Weighted GPA</div>
          <div className="text-[22px] font-bold text-[#690B1B]">
            {s.gpaWeighted !== 'N/A' ? s.gpaWeighted : '—'}
          </div>
          <div className="text-[11px] text-[#777]">
            UW: {s.gpaUnweighted40 !== 'N/A' ? `${s.gpaUnweighted40} / 4.0` : '—'}
          </div>
        </div>

        {/* SAT Total */}
        <div className="bg-white border border-[#E7E2DE] rounded-[18px] p-4 text-center space-y-1 shadow-2xs">
          <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">SAT Score</div>
          <div className="text-[22px] font-bold text-[#111]">
            {s.satScoreTotal !== 'N/A' ? s.satScoreTotal : '—'}
          </div>
          <div className="text-[11px] text-[#777]">
            {s.satMath !== 'N/A' && s.satEbrw !== 'N/A' ? `M: ${s.satMath} • R: ${s.satEbrw}` : 'Total Score'}
          </div>
        </div>

        {/* ACT Score */}
        <div className="bg-white border border-[#E7E2DE] rounded-[18px] p-4 text-center space-y-1 shadow-2xs">
          <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">ACT Score</div>
          <div className="text-[22px] font-bold text-[#9E731A]">
            {s.actScore !== 'N/A' ? s.actScore : '—'}
          </div>
          <div className="text-[11px] text-[#777]">Composite (36 max)</div>
        </div>

        {/* Class Rank */}
        <div className="bg-white border border-[#E7E2DE] rounded-[18px] p-4 text-center space-y-1 shadow-2xs">
          <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Class Rank</div>
          <div className="text-[18px] sm:text-[20px] font-bold text-[#16a34a] truncate px-1">
            {s.classRank || 'Top 10%'}
          </div>
          <div className="text-[11px] text-[#777]">High School Rank</div>
        </div>

        {/* Extracurriculars */}
        <div className="bg-white border border-[#E7E2DE] rounded-[18px] p-4 text-center space-y-1 shadow-2xs">
          <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Activities</div>
          <div className="text-[22px] font-bold text-[#111]">
            {s.numberOfExtracurriculars || ecList.length || 0}
          </div>
          <div className="text-[11px] text-[#777]">Extracurriculars</div>
        </div>

        {/* Awards & Honors */}
        <div className="bg-white border border-[#E7E2DE] rounded-[18px] p-4 text-center space-y-1 shadow-2xs">
          <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">Honors</div>
          <div className="text-[22px] font-bold text-[#690B1B]">
            {s.numberOfAwards || awardsList.length || 0}
          </div>
          <div className="text-[11px] text-[#777]">Awards Logged</div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         TABBED SECTION CONTROLS
         ═══════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[22px] p-2 sm:p-2.5 shadow-xs">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-1.5 sm:gap-2 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] sm:min-w-0 h-[42px] px-2.5 sm:px-3 rounded-[13px] text-[12px] xl:text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#690B1B] text-white shadow-2xs'
                    : 'text-[#666] hover:bg-[#F7F5F3] hover:text-[#111]'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#F0EBE6] text-[#690B1B]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         TAB CONTENT SECTIONS
         ═══════════════════════════════════════════════════════ */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Highlights & Quick Dossier */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Snapshot Card */}
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE6]">
                <h3 className="text-[17px] font-bold text-[#111] flex items-center gap-2">
                  <GraduationCap className="text-[#690B1B]" size={20} />
                  <span>Academic Profile Summary</span>
                </h3>
                <span className="text-[12px] font-semibold text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-full">
                  {s.classRank || 'Class Rank Available'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE]">
                  <div className="text-[11px] text-[#888] font-semibold uppercase">Weighted GPA</div>
                  <div className="text-[18px] font-bold text-[#111] mt-1">{s.gpaWeighted}</div>
                </div>
                <div className="p-3.5 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE]">
                  <div className="text-[11px] text-[#888] font-semibold uppercase">Unweighted GPA</div>
                  <div className="text-[18px] font-bold text-[#111] mt-1">{s.gpaUnweighted40}</div>
                </div>
                <div className="p-3.5 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE]">
                  <div className="text-[11px] text-[#888] font-semibold uppercase">SAT Total</div>
                  <div className="text-[18px] font-bold text-[#690B1B] mt-1">{s.satScoreTotal}</div>
                </div>
                <div className="p-3.5 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE]">
                  <div className="text-[11px] text-[#888] font-semibold uppercase">ACT Composite</div>
                  <div className="text-[18px] font-bold text-[#9E731A] mt-1">{s.actScore}</div>
                </div>
              </div>

              {/* AP & IB Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-1.5">
                  <div className="text-[12.5px] font-bold text-[#111] flex items-center justify-between">
                    <span>Advanced Placement (AP)</span>
                    <span className="text-[11.5px] text-[#690B1B] font-bold">{s.numberOfApCourses} Courses</span>
                  </div>
                  <p className="text-[12px] text-[#666] line-clamp-2">
                    {s.apCoursesTaken || 'AP courses detailed in Academics tab.'}
                  </p>
                </div>

                <div className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-1.5">
                  <div className="text-[12.5px] font-bold text-[#111] flex items-center justify-between">
                    <span>International Baccalaureate (IB)</span>
                    <span className="text-[11.5px] text-[#9E731A] font-bold">{s.numberOfIbCourses} Courses</span>
                  </div>
                  <p className="text-[12px] text-[#666] line-clamp-2">
                    {s.ibCoursesDiploma || 'IB coursework detailed in Academics tab.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Extracurricular Highlights */}
            {ecList.length > 0 && (
              <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE6]">
                  <h3 className="text-[17px] font-bold text-[#111] flex items-center gap-2">
                    <Activity className="text-[#690B1B]" size={20} />
                    <span>Extracurricular Highlights ({ecList.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('extracurriculars')}
                    className="text-[12.5px] font-bold text-[#690B1B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="space-y-3">
                  {ecList.slice(0, 3).map((ec, idx) => (
                    <div key={idx} className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-1">
                      <div className="text-[13.5px] font-bold text-[#111] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#690B1B]/10 text-[#690B1B] text-[11px] font-bold flex items-center justify-center shrink-0">
                          {ec.number || idx + 1}
                        </span>
                        <span>{ec.title}</span>
                      </div>
                      {ec.body && <p className="text-[12.5px] text-[#555] pl-7 leading-relaxed">{ec.body}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Statement Preview */}
            {s.personalStatementEssay && (
              <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE6]">
                  <h3 className="text-[17px] font-bold text-[#111] flex items-center gap-2">
                    <FileText className="text-[#690B1B]" size={20} />
                    <span>Personal Statement / Common App Essay</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('essays')}
                    className="text-[12.5px] font-bold text-[#690B1B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Full Essay</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="p-5 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-2.5">
                  <p className="text-[13px] text-[#444] leading-relaxed line-clamp-4 italic">
                    "{s.personalStatementEssay}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Demographics, Subjective & Verification Sidebar */}
          <div className="space-y-6">
            {/* Applicant Profile Card */}
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 space-y-4 shadow-xs">
              <h3 className="text-[16px] font-bold text-[#111] flex items-center gap-2 pb-3 border-b border-[#F0EBE6]">
                <User className="text-[#690B1B]" size={18} />
                <span>Applicant Background</span>
              </h3>

              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between py-1 border-b border-[#F7F5F3]">
                  <span className="text-[#777]">Admitted College</span>
                  <span className="font-bold text-[#690B1B] text-right">{s.admittedCollege}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F7F5F3]">
                  <span className="text-[#777]">College Type</span>
                  <span className="font-semibold text-[#111]">{s.collegeType}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F7F5F3]">
                  <span className="text-[#777]">College Location</span>
                  <span className="font-semibold text-[#111]">{s.collegeLocation}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F7F5F3]">
                  <span className="text-[#777]">Application Type</span>
                  <span className="font-semibold text-[#111]">{s.applicationType}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F7F5F3]">
                  <span className="text-[#777]">Intended Major</span>
                  <span className="font-semibold text-[#111]">{s.intendedMajor}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F7F5F3]">
                  <span className="text-[#777]">High School Type</span>
                  <span className="font-semibold text-[#111]">{s.schoolType}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F7F5F3]">
                  <span className="text-[#777]">Home State / Country</span>
                  <span className="font-semibold text-[#111]">{s.stateCountry}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F7F5F3]">
                  <span className="text-[#777]">First Generation</span>
                  <span className="font-semibold text-[#111]">{s.firstGeneration}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#777]">International Student</span>
                  <span className="font-semibold text-[#111]">{s.internationalStudent}</span>
                </div>
              </div>
            </div>

            {/* Subjective Reviews Card */}
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 space-y-4 shadow-xs">
              <h3 className="text-[16px] font-bold text-[#111] flex items-center gap-2 pb-3 border-b border-[#F0EBE6]">
                <MessageSquare className="text-[#690B1B]" size={18} />
                <span>Recommendations & Interview</span>
              </h3>

              <div className="space-y-3.5">
                <div className="p-3.5 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-1">
                  <div className="text-[11px] font-bold text-[#888] uppercase tracking-wider">Letters of Recommendation</div>
                  <div className="text-[13px] font-semibold text-[#111] leading-relaxed">
                    {s.lettersOfRecommendation || 'Information recorded in dossier.'}
                  </div>
                </div>

                <div className="p-3.5 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-1">
                  <div className="text-[11px] font-bold text-[#888] uppercase tracking-wider">Admissions Interview</div>
                  <div className="text-[12.5px] text-[#444] leading-relaxed">
                    {s.interview || 'Interview details recorded.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Metadata */}
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[24px] p-5 space-y-3">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#690B1B]">
                <ShieldCheck size={16} />
                <span>Wix CMS Verified Record</span>
              </div>
              <div className="text-[11.5px] text-[#777] space-y-1">
                <div>Wix Record ID: <span className="font-mono text-[#333]">{s.id}</span></div>
                {s.profileUrl && (
                  <div className="pt-1">
                    <a
                      href={s.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#690B1B] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Original Profile Source</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMICS & TESTING */}
      {activeTab === 'academics' && (
        <div className="space-y-6">
          {/* GPA & Standardized Test Scores Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GPA Card */}
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 space-y-4 shadow-xs">
              <h3 className="text-[17px] font-bold text-[#111] flex items-center gap-2 pb-3 border-b border-[#F0EBE6]">
                <GraduationCap className="text-[#690B1B]" size={20} />
                <span>Grade Point Average & Class Rank</span>
              </h3>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE]">
                  <div className="text-[11px] text-[#888] font-semibold uppercase">Weighted</div>
                  <div className="text-[22px] font-bold text-[#690B1B] mt-1">{s.gpaWeighted}</div>
                </div>
                <div className="p-4 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE]">
                  <div className="text-[11px] text-[#888] font-semibold uppercase">Unweighted</div>
                  <div className="text-[22px] font-bold text-[#111] mt-1">{s.gpaUnweighted40}</div>
                  <div className="text-[10px] text-[#999]">4.0 Scale</div>
                </div>
                <div className="p-4 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE]">
                  <div className="text-[11px] text-[#888] font-semibold uppercase">Class Rank</div>
                  <div className="text-[18px] font-bold text-[#16a34a] mt-1">{s.classRank || 'Top 10%'}</div>
                </div>
              </div>

              <div className="text-[12.5px] text-[#666] pt-1">
                High School Environment: <span className="font-semibold text-[#111]">{s.schoolType} School</span> located in <span className="font-semibold text-[#111]">{s.stateCountry}</span>.
              </div>
            </div>

            {/* SAT / ACT Card */}
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 space-y-4 shadow-xs">
              <h3 className="text-[17px] font-bold text-[#111] flex items-center gap-2 pb-3 border-b border-[#F0EBE6]">
                <BarChart3 className="text-[#690B1B]" size={20} />
                <span>Standardized Test Scores</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#888] uppercase">SAT Score</span>
                    <span className="text-[11px] font-bold bg-[#690B1B]/10 text-[#690B1B] px-2 py-0.5 rounded-full">1600 Max</span>
                  </div>
                  <div className="text-[24px] font-bold text-[#111]">{s.satScoreTotal}</div>
                  <div className="text-[11.5px] text-[#666] flex items-center justify-between border-t border-[#F0EBE6] pt-1.5">
                    <span>Math: <b>{s.satMath}</b></span>
                    <span>EBRW: <b>{s.satEbrw}</b></span>
                  </div>
                </div>

                <div className="p-4 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#888] uppercase">ACT Score</span>
                    <span className="text-[11px] font-bold bg-[#FFF8EB] text-[#9E731A] px-2 py-0.5 rounded-full">36 Max</span>
                  </div>
                  <div className="text-[24px] font-bold text-[#9E731A]">{s.actScore}</div>
                  <div className="text-[11.5px] text-[#666] border-t border-[#F0EBE6] pt-1.5">
                    Composite Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AP Courses & AP Scores Detailed Card */}
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE6]">
              <h3 className="text-[17px] font-bold text-[#111] flex items-center gap-2">
                <BookOpen className="text-[#690B1B]" size={20} />
                <span>Advanced Placement (AP) Curriculum</span>
              </h3>
              <span className="text-[12px] font-bold bg-[#690B1B] text-white px-3 py-1 rounded-full">
                {s.numberOfApCourses} AP Courses Taken
              </span>
            </div>

            {/* AP Scores Breakdown */}
            {apScoresList.length > 0 ? (
              <div className="space-y-3">
                <div className="text-[13px] font-bold text-[#333]">AP Exam Scores Breakdown:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {apScoresList.map((item, idx) => {
                    const [course, score] = item.split(':').map(str => str?.trim());
                    const numScore = parseInt(score, 10);
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] flex items-center justify-between gap-2"
                      >
                        <span className="text-[12.5px] font-medium text-[#222] truncate">{course}</span>
                        <span
                          className={`text-[12px] font-bold px-2.5 py-0.5 rounded-md shrink-0 ${
                            numScore === 5
                              ? 'bg-[#16a34a] text-white'
                              : numScore === 4
                              ? 'bg-[#16a34a]/15 text-[#16a34a]'
                              : 'bg-[#F0EBE6] text-[#555]'
                          }`}
                        >
                          {score || item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : s.apScores ? (
              <p className="text-[13px] text-[#444] p-4 bg-[#FDFCFB] rounded-[16px] border border-[#E7E2DE]">
                {s.apScores}
              </p>
            ) : null}

            {/* AP Courses Taken List */}
            {apCoursesList.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#F0EBE6]">
                <div className="text-[13px] font-bold text-[#333]">All AP Courses Completed:</div>
                <div className="flex flex-wrap gap-2">
                  {apCoursesList.map((course, idx) => (
                    <span
                      key={idx}
                      className="text-[12px] bg-[#F7F5F3] text-[#444] px-3 py-1 rounded-full border border-[#E7E2DE] font-medium"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* IB Courses & Diploma Detailed Card */}
          {(s.numberOfIbCourses > 0 || s.ibCoursesDiploma) && (
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE6]">
                <h3 className="text-[17px] font-bold text-[#111] flex items-center gap-2">
                  <Award className="text-[#9E731A]" size={20} />
                  <span>International Baccalaureate (IB) Diploma & Courses</span>
                </h3>
                <span className="text-[12px] font-bold bg-[#FFF8EB] text-[#9E731A] px-3 py-1 rounded-full">
                  {s.numberOfIbCourses} IB Courses
                </span>
              </div>

              <div className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-2">
                <div className="text-[13px] text-[#333] leading-relaxed whitespace-pre-line">
                  {s.ibCoursesDiploma || 'No IB diploma details available.'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXTRACURRICULARS & LEADERSHIP */}
      {activeTab === 'extracurriculars' && (
        <div className="space-y-6">
          {/* Main Numbered Extracurricular Activities */}
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE6]">
              <div>
                <h3 className="text-[18px] font-bold text-[#111] flex items-center gap-2">
                  <Activity className="text-[#690B1B]" size={22} />
                  <span>Extracurricular Activities ({s.numberOfExtracurriculars || ecList.length})</span>
                </h3>
                <p className="text-[12.5px] text-[#777] mt-0.5">
                  Complete activity list submitted with leadership roles, honors, and impact descriptions.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(s.extracurricularActivities, 'ecs')}
                className="h-[34px] px-3.5 rounded-full bg-[#F7F5F3] hover:bg-[#EAE6E2] text-[#444] text-[12px] font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedSection === 'ecs' ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                <span>{copiedSection === 'ecs' ? 'Copied' : 'Copy Activities'}</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {ecList.map((ec, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE] hover:border-[#690B1B]/30 transition-all space-y-1.5"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#690B1B] text-white text-[11.5px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {ec.number || idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14.5px] sm:text-[15px] font-bold text-[#111] leading-snug">
                        {ec.title}
                      </h4>
                      {ec.body && (
                        <p className="text-[13px] text-[#555] mt-1.5 leading-relaxed">
                          {ec.body}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership, Research, Sports & Volunteering Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leadership Positions */}
            {s.leadershipPositions && (
              <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 space-y-3 shadow-xs">
                <h4 className="text-[15.5px] font-bold text-[#111] flex items-center gap-2 pb-2.5 border-b border-[#F0EBE6]">
                  <Users className="text-[#690B1B]" size={18} />
                  <span>Leadership Positions</span>
                </h4>
                {leadershipList.length > 0 ? (
                  <div className="space-y-2">
                    {leadershipList.map((role, i) => (
                      <div key={i} className="p-3 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#333] font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B] shrink-0" />
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#555] leading-relaxed">{s.leadershipPositions}</p>
                )}
              </div>
            )}

            {/* Research Experience */}
            {s.researchExperience && (
              <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 space-y-3 shadow-xs">
                <h4 className="text-[15.5px] font-bold text-[#111] flex items-center gap-2 pb-2.5 border-b border-[#F0EBE6]">
                  <Compass className="text-[#690B1B]" size={18} />
                  <span>Research Experience &amp; Passion Projects</span>
                </h4>
                <div className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#444] leading-relaxed whitespace-pre-line">
                  {s.researchExperience}
                </div>
              </div>
            )}

            {/* Sports & Athletics */}
            {s.sportsAthletics && (
              <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 space-y-3 shadow-xs">
                <h4 className="text-[15.5px] font-bold text-[#111] flex items-center gap-2 pb-2.5 border-b border-[#F0EBE6]">
                  <Trophy className="text-[#9E731A]" size={18} />
                  <span>Sports &amp; Athletics</span>
                </h4>
                <div className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#444] leading-relaxed">
                  {s.sportsAthletics}
                </div>
              </div>
            )}

            {/* Community Service & Volunteering */}
            {s.communityServiceVolunteering && s.communityServiceVolunteering !== 'N/A' && (
              <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 space-y-3 shadow-xs">
                <h4 className="text-[15.5px] font-bold text-[#111] flex items-center gap-2 pb-2.5 border-b border-[#F0EBE6]">
                  <Users className="text-[#16a34a]" size={18} />
                  <span>Community Service &amp; Volunteering</span>
                </h4>
                <div className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#444] leading-relaxed whitespace-pre-line">
                  {s.communityServiceVolunteering}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {s.workExperience && s.workExperience !== 'N/A' && (
              <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 space-y-3 shadow-xs">
                <h4 className="text-[15.5px] font-bold text-[#111] flex items-center gap-2 pb-2.5 border-b border-[#F0EBE6]">
                  <Briefcase className="text-[#690B1B]" size={18} />
                  <span>Work Experience &amp; Internships</span>
                </h4>
                <div className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#444] leading-relaxed whitespace-pre-line">
                  {s.workExperience}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: HONORS & AWARDS */}
      {activeTab === 'awards' && (
        <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE6]">
            <div>
              <h3 className="text-[18px] font-bold text-[#111] flex items-center gap-2">
                <Award className="text-[#C9A55D]" size={22} />
                <span>Honors &amp; Awards ({s.numberOfAwards || awardsList.length})</span>
              </h3>
              <p className="text-[12.5px] text-[#777] mt-0.5">
                Academic honors, competition rankings, scholarships, and athletic accolades.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(s.awardsHonors, 'awards')}
              className="h-[34px] px-3.5 rounded-full bg-[#F7F5F3] hover:bg-[#EAE6E2] text-[#444] text-[12px] font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedSection === 'awards' ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
              <span>{copiedSection === 'awards' ? 'Copied' : 'Copy Awards'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {awardsList.map((award, idx) => (
              <div
                key={idx}
                className="p-4 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE] flex items-start gap-3 hover:border-[#690B1B]/30 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#FFF8EB] border border-[#C9A55D]/30 text-[#9E731A] text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {award.number || idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-bold text-[#111] leading-snug">
                    {award.title}
                  </div>
                  {award.body && (
                    <div className="text-[12px] text-[#666] mt-1">
                      {award.body}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: APPLICATION ESSAYS */}
      {activeTab === 'essays' && (
        <div className="space-y-6">
          {/* Personal Statement / Main Common App Essay */}
          {s.personalStatementEssay && (
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE6] flex-wrap gap-2">
                <div>
                  <h3 className="text-[18px] font-bold text-[#111] flex items-center gap-2">
                    <FileText className="text-[#690B1B]" size={20} />
                    <span>Personal Statement (Common App Main Essay)</span>
                  </h3>
                  <span className="text-[12px] text-[#777]">
                    Estimated ~{s.personalStatementEssay.split(/\s+/).length} words
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(s.personalStatementEssay, 'personal-essay')}
                  className="h-[34px] px-3.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedSection === 'personal-essay' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedSection === 'personal-essay' ? 'Copied to Clipboard' : 'Copy Full Essay'}</span>
                </button>
              </div>

              <div className="p-6 rounded-[20px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-4">
                <div className="text-[14px] sm:text-[14.5px] text-[#333] leading-[1.8] whitespace-pre-line font-serif">
                  {s.personalStatementEssay}
                </div>
              </div>
            </div>
          )}

          {/* Supplemental Essays */}
          {s.supplementalEssays && (
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE6] flex-wrap gap-2">
                <div>
                  <h3 className="text-[18px] font-bold text-[#111] flex items-center gap-2">
                    <FileCheck className="text-[#690B1B]" size={20} />
                    <span>Institutional Supplemental Essays</span>
                  </h3>
                  <span className="text-[12px] text-[#777]">
                    School-specific supplementals for {s.admittedCollege}
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(s.supplementalEssays, 'supp-essay')}
                  className="h-[34px] px-3.5 rounded-full bg-[#F7F5F3] hover:bg-[#EAE6E2] text-[#444] text-[12px] font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSection === 'supp-essay' ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                  <span>{copiedSection === 'supp-essay' ? 'Copied' : 'Copy Supplementals'}</span>
                </button>
              </div>

              <div className="p-6 rounded-[20px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-4">
                <div className="text-[14px] text-[#333] leading-[1.8] whitespace-pre-line">
                  {s.supplementalEssays}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: RECOMMENDATIONS & INTERVIEW */}
      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Letters of Recommendation */}
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-4 shadow-xs">
            <h3 className="text-[17px] font-bold text-[#111] flex items-center gap-2 pb-3 border-b border-[#F0EBE6]">
              <MessageSquare className="text-[#690B1B]" size={20} />
              <span>Letters of Recommendation</span>
            </h3>

            <div className="p-5 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-3">
              <div className="text-[14px] font-bold text-[#111]">
                {s.lettersOfRecommendation || '4 Letters of Recommendation logged'}
              </div>
              <p className="text-[12.5px] text-[#666] leading-relaxed">
                Recommendations typically include Core Academic Teachers (STEM and Humanities), High School Counselor evaluation, and optional Extracurricular/Research Mentor endorsements.
              </p>
            </div>
          </div>

          {/* Admissions Interview */}
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-7 space-y-4 shadow-xs">
            <h3 className="text-[17px] font-bold text-[#111] flex items-center gap-2 pb-3 border-b border-[#F0EBE6]">
              <Users className="text-[#690B1B]" size={20} />
              <span>Admissions Interview Report</span>
            </h3>

            <div className="p-5 rounded-[18px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-3">
              <div className="text-[13.5px] font-semibold text-[#333] leading-relaxed whitespace-pre-line">
                {s.interview || 'Interview recorded as part of application submission.'}
              </div>
              <div className="pt-2 border-t border-[#E7E2DE] text-[12px] text-[#888] flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#16a34a]" />
                <span>Evaluated for institutional community fit &amp; intellectual vitality</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
