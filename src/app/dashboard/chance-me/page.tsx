'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getCachedUserDetails } from '@/lib/userDetailsCache';
import {
  BarChart3,
  Search,
  Sparkles,
  Flame,
  CheckCircle2,
  Building2,
  UserCheck,
  Award,
  BookOpen,
  ArrowRight,
  Plus,
  Zap,
  RotateCcw,
  MapPin,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Loader2,
  Star,
  X,
  TrendingUp,
  AlertTriangle,
  Target,
  FileText,
  Compass,
  Check,
  Layers,
  ArrowUpRight,
  Lightbulb,
  ShieldAlert,
  Percent,
  Bookmark
} from 'lucide-react';

/* ─── University type from our Wix CMS API ──────────────────────────── */
interface University {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  state: string;
  qsRanking: string;
  acceptanceRate: string;
}

interface BenchmarkItem {
  metric: string;
  userVal: string;
  medianVal: string;
  status: string;
  percentile: string;
}

interface ProfileSectionItem {
  score: number;
  title: string;
  assessment: string;
  highlight: string;
  takeaways: string[];
  proTip: string;
  detail?: string;
}

interface StrengthItem {
  title: string;
  desc: string;
  tag: string;
}

interface WeaknessItem {
  title: string;
  desc: string;
  severity: string;
}

interface ActionRoadmapItem {
  phase: string;
  title: string;
  desc: string;
  impact: string;
}

interface EvaluationResultData {
  odds: string;
  admitChanceNum: number;
  admitTier: string;
  verdictHeadline: string;
  verdict: string;
  recommendation: string;
  benchmarks: BenchmarkItem[];
  profileSections: Record<string, ProfileSectionItem>;
  strengths: StrengthItem[];
  weaknesses: WeaknessItem[];
  actionRoadmap: ActionRoadmapItem[];
  comparativeInsight: string;
}

interface PastReviewItem {
  id?: string;
  school: string;
  major: string;
  odds: string;
  tier: string;
  date: string;
  spiceLevel?: 'gentle' | 'candid' | 'roast';
  fullResult?: EvaluationResultData | null;
}

export default function AIChanceMePage() {
  const { user, userData } = useAuth();
  const userKey = useMemo(() => {
    return user?.uid || user?.email || userData?.email || 'default';
  }, [user, userData]);

  /* ─── Core State ──────────────────────────────────────────────────── */
  const [selectedSchool, setSelectedSchool] = useState('');
  const [spiceLevel, setSpiceLevel] = useState<'gentle' | 'candid' | 'roast'>('candid');
  const [evaluationResult, setEvaluationResult] = useState<null | EvaluationResultData>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationProvider, setEvaluationProvider] = useState('');

  /* ─── Navigation within Report ────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<'overview' | 'deepdive' | 'swot' | 'roadmap'>('overview');
  const [selectedDeepDiveKey, setSelectedDeepDiveKey] = useState<string>('academics');

  /* ─── University Dropdown State ───────────────────────────────────── */
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dreamSchoolLoaded, setDreamSchoolLoaded] = useState(false);

  /* ─── Saved Reviews History from Wix CMS ─────────────────────────── */
  const [pastReviews, setPastReviews] = useState<PastReviewItem[]>([]);
  const [loadingPastReviews, setLoadingPastReviews] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* ─── 0. Load past candidate evaluations from Wix CMS ─────────────── */
  useEffect(() => {
    let isMounted = true;
    async function loadPastEvaluations() {
      const uid = user?.uid;
      const email = user?.email || userData?.email;
      if (!uid && !email) return;

      setLoadingPastReviews(true);
      try {
        const res = await fetch(`/api/wix/evaluations?userId=${encodeURIComponent(uid || '')}&userEmail=${encodeURIComponent(email || '')}`);
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setPastReviews(json.data);
        }
      } catch (e) {
        console.warn('Could not load past evaluations from Wix CMS:', e);
      } finally {
        if (isMounted) setLoadingPastReviews(false);
      }
    }
    loadPastEvaluations();
    return () => { isMounted = false; };
  }, [user, userData]);

  /* ─── 1. Load dream school from user cache as default ─────────────── */
  useEffect(() => {
    const cached = getCachedUserDetails(userKey);
    if (cached?.dreamSchool && !dreamSchoolLoaded) {
      setSelectedSchool(cached.dreamSchool);
      setDreamSchoolLoaded(true);
    }
  }, [userKey, dreamSchoolLoaded]);

  /* ─── 2. Fetch all universities from Wix CMS ─────────────────────── */
  useEffect(() => {
    let isMounted = true;
    async function fetchUniversities() {
      setLoadingUnis(true);
      try {
        const res = await fetch('/api/wix/universities?limit=200');
        const json = await res.json();
        if (isMounted && json.success && json.universities) {
          setUniversities(json.universities);
          if (json.totalPages > 1) {
            const remaining: University[] = [];
            for (let page = 2; page <= json.totalPages; page++) {
              const r = await fetch(`/api/wix/universities?limit=200&page=${page}`);
              const j = await r.json();
              if (j.success && j.universities) remaining.push(...j.universities);
            }
            if (isMounted) setUniversities(prev => [...prev, ...remaining]);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch universities:', err);
      } finally {
        if (isMounted) setLoadingUnis(false);
      }
    }
    fetchUniversities();
    return () => { isMounted = false; };
  }, []);

  /* ─── Filtered university list ────────────────────────────────────── */
  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return universities;
    const q = searchQuery.toLowerCase();
    return universities.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.country.toLowerCase().includes(q) ||
      u.state.toLowerCase().includes(q)
    );
  }, [universities, searchQuery]);

  /* ─── Close dropdown on outside click ─────────────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ─── Scroll highlighted item into view ───────────────────────────── */
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-uni-item]');
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  /* ─── Keyboard navigation for dropdown ────────────────────────────── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
        e.preventDefault();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, filteredUniversities.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredUniversities[highlightedIndex]) {
          setSelectedSchool(filteredUniversities[highlightedIndex].name);
          setSearchQuery('');
          setIsDropdownOpen(false);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setSearchQuery('');
        break;
    }
  }, [isDropdownOpen, highlightedIndex, filteredUniversities]);

  const selectUniversity = (name: string) => {
    setSelectedSchool(name);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  /* ─── Execute AI Evaluation ────────────────────────────────────────── */
  const handleRunEvaluation = async () => {
    if (!selectedSchool.trim()) return;
    setIsEvaluating(true);
    setEvaluationResult(null);
    setEvaluationProvider('');
    setActiveTab('overview');

    const profile = getCachedUserDetails(userKey) || {};

    try {
      const res = await fetch('/api/chance-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSchool: selectedSchool,
          spiceLevel,
          profile: {
            fullName: profile.fullName || profile.name || '',
            gpa: profile.gpa || '',
            gpaWeighted: profile.gpaWeighted || '',
            satScore: profile.satScore || '',
            actScore: profile.actScore || '',
            classRank: profile.classRank || '',
            highSchool: profile.highSchool || '',
            targetMajor: profile.targetMajor || profile.intendedMajor || '',
            dreamSchool: profile.dreamSchool || '',
            country: profile.country || '',
            extracurriculars: profile.extracurriculars || [],
            applicationCycle: profile.applicationCycle || 'Fall 2026',
          },
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        const chance = d.admitChance || 50;

        // Normalize strengths
        const rawStrengths = Array.isArray(d.strengths) ? d.strengths : [];
        const strengths: StrengthItem[] = rawStrengths.map((s: any) =>
          typeof s === 'string'
            ? { title: 'Identified Strength', desc: s, tag: 'Key Anchor' }
            : { title: s.title || 'Strength', desc: s.desc || '', tag: s.tag || 'Core' }
        );

        // Normalize weaknesses
        const rawWeaknesses = Array.isArray(d.weaknesses) ? d.weaknesses : [];
        const weaknesses: WeaknessItem[] = rawWeaknesses.map((w: any) =>
          typeof w === 'string'
            ? { title: 'Vulnerability Gap', desc: w, severity: 'Medium Priority' }
            : { title: w.title || 'Vulnerability', desc: w.desc || '', severity: w.severity || 'Medium Priority' }
        );

        // Normalize action roadmap
        const rawRoadmap = Array.isArray(d.actionRoadmap) ? d.actionRoadmap : (Array.isArray(d.actionPlan) ? d.actionPlan : []);
        const actionRoadmap: ActionRoadmapItem[] = rawRoadmap.map((a: any, idx: number) => {
          if (typeof a === 'string') {
            const phases = ['Next 30 Days', '60 Days Out', 'Pre-Submission'];
            return { phase: phases[idx] || 'Phase Step', title: `Milestone Step ${idx + 1}`, desc: a, impact: '+5% Odds' };
          }
          return {
            phase: a.phase || `Step ${idx + 1}`,
            title: a.title || 'Application Tactic',
            desc: a.desc || '',
            impact: a.impact || '+5% Boost'
          };
        });

        // Normalize profile sections
        const rawSections = d.profileSections || {};
        const profileSections: Record<string, ProfileSectionItem> = {};
        Object.keys(rawSections).forEach((k) => {
          const sec = rawSections[k];
          profileSections[k] = {
            score: sec.score || 75,
            title: sec.title || k,
            assessment: sec.assessment || 'Competitive',
            highlight: sec.highlight || sec.detail || 'Evaluated against institutional standards.',
            takeaways: Array.isArray(sec.takeaways) && sec.takeaways.length > 0
              ? sec.takeaways
              : [sec.detail || 'Metrics align with baseline review thresholds.'],
            proTip: sec.proTip || 'Optimize your application presentation in this category.',
            detail: sec.detail
          };
        });

        const resultObj: EvaluationResultData = {
          odds: `${chance}% Admit Chance`,
          admitChanceNum: chance,
          admitTier: d.admitTier || (chance >= 70 ? 'Likely' : chance >= 45 ? 'Target' : 'Reach'),
          verdictHeadline: d.verdictHeadline || 'Admissions Candidacy Assessment',
          verdict: d.verdict || 'Evaluation completed.',
          recommendation: d.recommendation || '',
          benchmarks: Array.isArray(d.benchmarks) && d.benchmarks.length > 0 ? d.benchmarks : [
            { metric: 'GPA Context', userVal: profile.gpa || '3.85', medianVal: '3.92', status: 'Competitive', percentile: '65th' },
            { metric: 'Test Scores', userVal: profile.satScore ? `${profile.satScore}` : 'Test-Optional', medianVal: '1510 - 1560', status: 'In Range', percentile: '55th' },
            { metric: 'EC Spike', userVal: 'Tier 2-3', medianVal: 'Tier 1-2', status: 'In Range', percentile: '50th' },
            { metric: 'Program Selectivity', userVal: profile.targetMajor || 'General', medianVal: 'High Selectivity', status: 'High Rigor', percentile: 'Top 20%' }
          ],
          profileSections,
          strengths,
          weaknesses,
          actionRoadmap,
          comparativeInsight: d.comparativeInsight || ''
        };

        setEvaluationResult(resultObj);
        setEvaluationProvider(json.provider || 'Admissions AI Engine');

        // 1. Persist/Update to Wix CMS evaluations collection (upsert per student + university)
        try {
          const uid = user?.uid || 'guest-user';
          const email = user?.email || userData?.email || '';
          fetch('/api/wix/evaluations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: uid,
              userEmail: email,
              universityName: selectedSchool,
              major: profile.targetMajor || profile.intendedMajor || 'General',
              admitChance: chance,
              admitTier: resultObj.admitTier,
              spiceLevel,
              verdictHeadline: resultObj.verdictHeadline,
              verdict: resultObj.verdict,
              recommendation: resultObj.recommendation,
              resultData: resultObj
            })
          }).then(async (r) => {
            const j = await r.json();
            console.log('[Wix Evaluations] Upsert response:', j);
          }).catch(err => {
            console.warn('Wix evaluations sync warning:', err);
          });
        } catch (e) {
          console.warn('Wix evaluation save error:', e);
        }

        // 2. Update past reviews history locally (upsert without creating duplicate card)
        setPastReviews(prev => {
          const normSchool = selectedSchool.trim().toLowerCase();
          const existingIdx = prev.findIndex(p => p.school.trim().toLowerCase() === normSchool);
          const newItem: PastReviewItem = {
            school: selectedSchool,
            major: profile.targetMajor || profile.intendedMajor || 'Major',
            odds: `${chance}%`,
            tier: resultObj.admitTier,
            date: 'Just now',
            spiceLevel,
            fullResult: resultObj
          };

          if (existingIdx >= 0) {
            const updated = [...prev];
            updated[existingIdx] = newItem;
            return updated;
          }
          return [newItem, ...prev];
        });
      } else {
        console.error('Chance-Me API error:', json.error);
      }
    } catch (err) {
      console.error('Chance-Me network error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  /* ─── Select Past Evaluation ───────────────────────────────────────── */
  const handleSelectPastReview = async (rev: PastReviewItem) => {
    setSelectedSchool(rev.school);
    if (rev.spiceLevel) setSpiceLevel(rev.spiceLevel);

    if (rev.fullResult) {
      setEvaluationResult(rev.fullResult);
      setActiveTab('overview');
      return;
    }

    // If fullResult is not cached in state, fetch directly from Wix CMS
    try {
      const uid = user?.uid || '';
      const email = user?.email || userData?.email || '';
      const res = await fetch(`/api/wix/evaluations?userId=${encodeURIComponent(uid)}&userEmail=${encodeURIComponent(email)}&universityName=${encodeURIComponent(rev.school)}`);
      const json = await res.json();
      if (json.success && json.data?.fullResult) {
        setEvaluationResult(json.data.fullResult);
        setActiveTab('overview');
      }
    } catch (e) {
      console.warn('Could not load specific evaluation report:', e);
    }
  };

  /* ─── Color Helpers ───────────────────────────────────────────────── */
  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'Safety':
      case 'Likely':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Target':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Reach':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'High Reach':
      case 'Extreme Reach':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#059669'; // Emerald
    if (score >= 70) return '#690B1B'; // Brand Crimson
    if (score >= 50) return '#D97706'; // Amber
    return '#E11D48'; // Rose
  };

  const sectionMetaMap: Record<string, { icon: any; label: string; color: string }> = {
    academics: { icon: BookOpen, label: 'Academics & Rigor', color: '#690B1B' },
    testScores: { icon: Percent, label: 'Standardized Tests', color: '#2563EB' },
    extracurriculars: { icon: Award, label: 'Extracurricular Spike', color: '#D97706' },
    essayPotential: { icon: FileText, label: 'Narrative & Identity', color: '#7C3AED' },
    researchAndHonors: { icon: Sparkles, label: 'Research & Honors', color: '#059669' },
    fitAndContext: { icon: Compass, label: 'Institutional Fit', color: '#DB2777' },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full font-sans">
      {/* ═══════════════════════════════════════════════════════════════
         LEFT SIDEBAR — History of Past Reviews & Navigation
         ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full xl:w-[300px] space-y-4 shrink-0">
        <button
          onClick={() => {
            setEvaluationResult(null);
            setSelectedSchool('');
            setSearchQuery('');
          }}
          className="w-full py-3 px-4 rounded-[14px] bg-[#690B1B] hover:bg-[#7A1022] text-white text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          <span>New School Evaluation</span>
        </button>

        {/* PAST REVIEWS LIST */}
        <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#888] uppercase tracking-wider">
            <span>Past Assessments</span>
            <span className="bg-[#F7F5F3] px-2 py-0.5 rounded-full text-[#666] font-mono">{pastReviews.length}</span>
          </div>

          <div className="space-y-2">
            {loadingPastReviews ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3 rounded-[14px] bg-[#FDFCFB] border border-[#F0EBE6] animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : pastReviews.length === 0 ? (
              <div className="py-6 text-center text-[12px] text-[#999] leading-relaxed">
                No past evaluations yet.<br />Select a university to begin.
              </div>
            ) : (
              pastReviews.map((rev, idx) => {
                const isSelected = selectedSchool.trim().toLowerCase() === rev.school.trim().toLowerCase() && evaluationResult !== null;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPastReview(rev)}
                    className={`w-full text-left p-3 rounded-[14px] transition-all group cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FDF6F7] border-[#690B1B] shadow-xs'
                        : 'bg-[#FDFCFB] border-[#F0EBE6] hover:border-[#690B1B]/40 hover:bg-[#FBF8F6]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={`text-[13px] font-bold transition-colors truncate ${
                        isSelected ? 'text-[#690B1B]' : 'text-[#111] group-hover:text-[#690B1B]'
                      }`}>
                        {rev.school}
                      </div>
                      <span className="text-[11px] font-bold text-[#690B1B] shrink-0">{rev.odds}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-[#777]">
                      <span className="truncate max-w-[130px]">{rev.major}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getTierBadgeStyle(rev.tier)}`}>
                        {rev.tier}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* QUICK INSIGHTS CARD */}
        <div className="bg-gradient-to-br from-[#FBF8F6] to-[#F5ECE8] border border-[#EADFD9] rounded-[20px] p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[#690B1B] font-bold text-[13px]">
            <Lightbulb size={16} />
            <span>Admissions Tip</span>
          </div>
          <p className="text-[12px] text-[#555] leading-relaxed">
            Admissions committees evaluate applicants relative to their specific high school context and declared major pool. A tailored spike outperforms broad generalism.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         RIGHT MAIN SECTION — Studio & Interactive Report
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* HERO BANNER (WHEN NO RESULT OR TOP BAR) */}
        {!evaluationResult && (
          <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-8 text-white shadow-sm space-y-3 border border-white/10 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[12px] font-bold backdrop-blur-xs">
              <Sparkles size={14} />
              <span>Admissions Intelligence Engine</span>
            </div>
            <h2 className="text-[26px] sm:text-[34px] font-bold leading-tight tracking-tight">
              Evaluate your <span className="text-[#C9A55D] italic">true admission odds</span>
            </h2>
            <p className="text-[13px] sm:text-[14px] text-white/80 max-w-[650px] leading-relaxed">
              Powered by our Admissions Intelligence Engine. Receive quantitative benchmarks, an admissions officer critique, rubric ratings, and an actionable 30-day roadmap.
            </p>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
           VIEW 1: EVALUATION REPORT DASHBOARD (LUXURY & SCANNABLE)
           ═════════════════════════════════════════════════════════════ */}
        {evaluationResult ? (
          <div className="space-y-6">
            {/* ─── 1. TOP HERO DASHBOARD CARD ────────────────────────── */}
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-[#F0EBE6] pb-6">
                {/* Left: Score Dial & Target Info */}
                <div className="flex items-center gap-5 sm:gap-6">
                  {/* Circular SVG Gauge */}
                  <div className="relative shrink-0 w-[110px] h-[110px] sm:w-[124px] sm:h-[124px]">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#F4EFEA" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={getScoreColor(evaluationResult.admitChanceNum)}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={2 * Math.PI * 50 * (1 - evaluationResult.admitChanceNum / 100)}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[28px] sm:text-[32px] font-black text-[#111] leading-none">
                        {evaluationResult.admitChanceNum}%
                      </span>
                      <span className="text-[9px] font-bold text-[#888] uppercase tracking-wider mt-0.5">
                        Admit Odds
                      </span>
                    </div>
                  </div>

                  {/* School & Major Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-full flex items-center gap-1.5">
                        <GraduationCap size={13} />
                        {selectedSchool}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getTierBadgeStyle(evaluationResult.admitTier)}`}>
                        {evaluationResult.admitTier}
                      </span>
                      {evaluationProvider && (
                        <span className="text-[10px] font-medium text-[#888] bg-[#F7F5F3] px-2 py-0.5 rounded-full">
                          {evaluationProvider}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[20px] sm:text-[24px] font-bold text-[#111] leading-snug">
                      {evaluationResult.verdictHeadline}
                    </h3>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => setEvaluationResult(null)}
                    className="px-4 py-2 rounded-full border border-[#E7E2DE] text-[#444] text-[13px] font-bold hover:bg-[#F7F5F3] flex items-center gap-2 transition-all"
                  >
                    <RotateCcw size={14} />
                    <span>Change School</span>
                  </button>
                  <button
                    onClick={handleRunEvaluation}
                    disabled={isEvaluating}
                    className="px-4 py-2 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Sparkles size={14} />
                    <span>Re-evaluate</span>
                  </button>
                </div>
              </div>

              {/* ─── VERDICT & RECOMMENDATION SUMMARY ─────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-6">
                {/* Admissions Officer Verdict */}
                <div className="lg:col-span-2 p-4 sm:p-5 rounded-[18px] bg-[#FDFCFB] border border-[#F0EBE6] space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#690B1B] uppercase tracking-wider">
                    <Flame size={14} />
                    <span>Admissions Committee Take ({spiceLevel.toUpperCase()} MODE)</span>
                  </div>
                  <p className="text-[13px] sm:text-[14px] text-[#333] leading-relaxed font-medium italic">
                    &ldquo;{evaluationResult.verdict}&rdquo;
                  </p>
                </div>

                {/* Top Priority Action */}
                <div className="p-4 sm:p-5 rounded-[18px] bg-gradient-to-br from-[#FFF9EE] to-[#FFF3DC] border border-[#E8D4A2] space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8B6914] uppercase tracking-wider">
                    <Sparkles size={14} className="text-[#C9A55D]" />
                    <span>Priority Recommendation</span>
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-[#5A4510] leading-relaxed font-semibold">
                    {evaluationResult.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* ─── 2. INTERACTIVE TAB NAVIGATION ──────────────────────── */}
            <div className="flex items-center gap-1.5 bg-[#F7F5F3] p-1.5 rounded-[16px] border border-[#E7E2DE] overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Overview & Benchmarks', icon: BarChart3 },
                { id: 'deepdive', label: 'Section Deep Dives', icon: Layers },
                { id: 'swot', label: 'Strengths & Gaps', icon: ShieldAlert },
                { id: 'roadmap', label: 'Strategic Roadmap', icon: Target },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white text-[#690B1B] shadow-xs border border-[#E7E2DE]'
                        : 'text-[#666] hover:text-[#111] hover:bg-white/50'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ─── TAB 1: OVERVIEW & BENCHMARKS ───────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 4 Quantitative Benchmark Cards */}
                <div>
                  <h4 className="text-[16px] font-bold text-[#111] mb-3 flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#690B1B]" />
                    <span>Competitive Profile Benchmarking vs Admitted Median</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {evaluationResult.benchmarks.map((bench, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-[#E7E2DE] rounded-[18px] p-4.5 shadow-xs flex flex-col justify-between gap-3 hover:border-[#690B1B]/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 text-[11px] font-bold text-[#888] uppercase min-w-0">
                          <span className="truncate flex-1" title={bench.metric}>{bench.metric}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 whitespace-nowrap ${
                            bench.status === 'Exceptional' || bench.status === 'Competitive'
                              ? 'bg-emerald-50 text-emerald-700'
                              : bench.status === 'Below Median'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-blue-50 text-blue-700'
                          }`}>
                            {bench.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[20px] font-extrabold text-[#111] truncate">{bench.userVal}</div>
                          <div className="text-[11px] text-[#777] flex items-center justify-between gap-2">
                            <span>Admitted Median:</span>
                            <span className="font-semibold text-[#444] truncate">{bench.medianVal}</span>
                          </div>
                        </div>

                        {/* Percentile Pill */}
                        <div className="pt-2 border-t border-[#F4EFEA] flex items-center justify-between gap-2 text-[11px]">
                          <span className="text-[#999]">Percentile Band</span>
                          <span className="font-bold text-[#690B1B] bg-[#F7F0F1] px-2 py-0.5 rounded text-right shrink-0">
                            {bench.percentile}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6 Category Score Pills with Click to Deep Dive */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[16px] font-bold text-[#111] flex items-center gap-2">
                      <Layers size={18} className="text-[#690B1B]" />
                      <span>Category Rubric Ratings</span>
                    </h4>
                    <span className="text-[12px] text-[#777] hidden sm:inline">Click any category for in-depth takeaways</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {Object.keys(evaluationResult.profileSections).map((key) => {
                      const sec = evaluationResult.profileSections[key];
                      const meta = sectionMetaMap[key] || { icon: BookOpen, label: sec.title, color: '#690B1B' };
                      const Icon = meta.icon;
                      const scoreColor = getScoreColor(sec.score);

                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedDeepDiveKey(key);
                            setActiveTab('deepdive');
                          }}
                          className="bg-white border border-[#E7E2DE] hover:border-[#690B1B] rounded-[18px] p-4.5 text-left shadow-xs transition-all group space-y-3 cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-3 min-w-0">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-full bg-[#F7F0F1] flex items-center justify-center text-[#690B1B] shrink-0">
                                <Icon size={16} />
                              </div>
                              <span className="text-[13px] font-bold text-[#111] group-hover:text-[#690B1B] transition-colors truncate" title={sec.title}>
                                {sec.title}
                              </span>
                            </div>
                            <span className="text-[15px] sm:text-[16px] font-extrabold shrink-0 px-2 py-0.5 rounded-lg bg-[#FAF8F6] border border-[#EFE9E4]" style={{ color: scoreColor }}>
                              {sec.score}%
                            </span>
                          </div>

                          {/* Progress Meter */}
                          <div className="w-full h-1.5 bg-[#F0EBE6] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${sec.score}%`, backgroundColor: scoreColor }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] gap-2">
                            <span className="font-semibold text-[#666] truncate">{sec.assessment}</span>
                            <span className="text-[#690B1B] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                              Analyze <ArrowRight size={11} />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comparative Cohort Insight */}
                {evaluationResult.comparativeInsight && (
                  <div className="p-5 rounded-[20px] bg-gradient-to-r from-[#690B1B]/5 via-[#690B1B]/10 to-transparent border border-[#690B1B]/15 flex items-start gap-3.5">
                    <BarChart3 size={20} className="text-[#690B1B] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[13px] font-bold text-[#690B1B] uppercase tracking-wider mb-1">
                        Comparative Cohort Context
                      </h5>
                      <p className="text-[13px] text-[#444] leading-relaxed font-medium">
                        {evaluationResult.comparativeInsight}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 2: SECTION DEEP DIVES ──────────────────────────── */}
            {activeTab === 'deepdive' && (
              <div className="space-y-6">
                {/* Horizontal Category Selector Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {Object.keys(evaluationResult.profileSections).map((key) => {
                    const sec = evaluationResult.profileSections[key];
                    const meta = sectionMetaMap[key] || { icon: BookOpen, label: sec.title, color: '#690B1B' };
                    const Icon = meta.icon;
                    const isSelected = selectedDeepDiveKey === key;

                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedDeepDiveKey(key)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[12px] font-bold transition-all shrink-0 border ${
                          isSelected
                            ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-xs'
                            : 'bg-white text-[#555] border-[#E7E2DE] hover:border-[#690B1B]/40'
                        }`}
                      >
                        <Icon size={14} />
                        <span>{sec.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F4EFEA] text-[#666]'}`}>
                          {sec.score}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Category Detailed Breakdown Card */}
                {(() => {
                  const sec = evaluationResult.profileSections[selectedDeepDiveKey] || Object.values(evaluationResult.profileSections)[0];
                  if (!sec) return null;
                  const meta = sectionMetaMap[selectedDeepDiveKey] || { icon: BookOpen, label: sec.title, color: '#690B1B' };
                  const Icon = meta.icon;
                  const scoreColor = getScoreColor(sec.score);

                  return (
                    <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-8 shadow-xs space-y-6">
                      {/* Section Title & Score */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F0EBE6] pb-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-[16px] bg-[#F7F0F1] flex items-center justify-center text-[#690B1B] shrink-0">
                            <Icon size={24} />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#888] uppercase tracking-wider">
                              Category Deep Dive
                            </div>
                            <h3 className="text-[20px] font-bold text-[#111]">{sec.title}</h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                            sec.assessment === 'Exceptional' || sec.assessment === 'Strong'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : sec.assessment === 'Competitive'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {sec.assessment}
                          </span>
                          <span className="text-[28px] font-black" style={{ color: scoreColor }}>
                            {sec.score}%
                          </span>
                        </div>
                      </div>

                      {/* Summary Highlight */}
                      <div className="p-4 rounded-[16px] bg-[#FDFCFB] border border-[#F0EBE6] text-[13px] font-semibold text-[#444] leading-relaxed">
                        {sec.highlight}
                      </div>

                      {/* Bulleted Takeaways (Clean & Readable) */}
                      <div className="space-y-3">
                        <h4 className="text-[14px] font-bold text-[#111] uppercase tracking-wider text-[11px] text-[#888]">
                          Key Admissions Committee Observations
                        </h4>
                        <div className="grid grid-cols-1 gap-2.5">
                          {sec.takeaways.map((point, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-[14px] bg-[#FAFAF8] border border-[#EFECE8] flex items-start gap-3"
                            >
                              <div className="w-5 h-5 rounded-full bg-[#690B1B]/10 text-[#690B1B] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <p className="text-[13px] text-[#333] leading-relaxed font-medium">
                                {point}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pro Tip Pill Box */}
                      {sec.proTip && (
                        <div className="p-4 rounded-[16px] bg-gradient-to-r from-[#FFF8E7] to-[#FFF0CC] border border-[#E8D5A0] flex items-start gap-3">
                          <Lightbulb size={18} className="text-[#C9A55D] shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] font-bold text-[#8B6914] uppercase tracking-wider mb-0.5">
                              Strategic Pro Tip
                            </div>
                            <p className="text-[12px] sm:text-[13px] text-[#5A4510] leading-relaxed font-semibold">
                              {sec.proTip}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ─── TAB 3: STRENGTHS & GAPS ────────────────────────────── */}
            {activeTab === 'swot' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Strengths Column */}
                <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F0EBE6]">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                    <h4 className="text-[16px] font-bold text-[#111]">Application Anchors & Strengths</h4>
                  </div>

                  <div className="space-y-3">
                    {evaluationResult.strengths.map((str, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-[16px] bg-[#F9FDFB] border border-emerald-100/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-[#111]">{str.title}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                            {str.tag}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#444] leading-relaxed font-medium">{str.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gaps / Weaknesses Column */}
                <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F0EBE6]">
                    <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                      <AlertTriangle size={16} />
                    </div>
                    <h4 className="text-[16px] font-bold text-[#111]">Vulnerabilities & Optimization Gaps</h4>
                  </div>

                  <div className="space-y-3">
                    {evaluationResult.weaknesses.map((weak, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-[16px] bg-[#FFFBFB] border border-rose-100/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-[#111]">{weak.title}</span>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-full">
                            {weak.severity}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#444] leading-relaxed font-medium">{weak.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 4: STRATEGIC ROADMAP ───────────────────────────── */}
            {activeTab === 'roadmap' && (
              <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-[#F0EBE6] pb-4">
                  <div className="flex items-center gap-2 text-[#690B1B] text-[11px] font-bold uppercase tracking-wider">
                    <Target size={15} />
                    <span>Admissions Strategy Roadmap</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#111] mt-1">
                    Action Plan to Maximize Your Odds at {selectedSchool}
                  </h3>
                </div>

                <div className="relative space-y-4 before:absolute before:inset-0 before:left-5.5 before:w-0.5 before:bg-[#F0EBE6] before:hidden sm:before:block">
                  {evaluationResult.actionRoadmap.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative flex flex-col sm:flex-row items-start gap-4 p-5 rounded-[18px] bg-[#FDFCFB] border border-[#EFECE8] hover:border-[#690B1B]/30 transition-all"
                    >
                      {/* Step Number Badge */}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#690B1B] to-[#8B1D2F] text-white text-[14px] font-bold flex items-center justify-center shrink-0 shadow-xs z-10">
                        {idx + 1}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[11px] font-bold text-[#690B1B] uppercase tracking-wider bg-[#F7F0F1] px-2.5 py-0.5 rounded-full">
                            {item.phase}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles size={11} /> {item.impact}
                          </span>
                        </div>
                        <h4 className="text-[15px] font-bold text-[#111]">{item.title}</h4>
                        <p className="text-[13px] text-[#555] leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : isEvaluating ? (
          /* ═════════════════════════════════════════════════════════════
             VIEW 2: LOADING / EVALUATING SPINNER STATE
             ═════════════════════════════════════════════════════════════ */
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-10 md:p-16 shadow-xs flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-18 h-18 rounded-full border-4 border-[#F0EBE6] border-t-[#690B1B] animate-spin" />
              <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#690B1B]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[20px] font-bold text-[#111]">Analyzing Admissions Profile...</h3>
              <p className="text-[13px] text-[#777] max-w-[450px]">
                Benchmarking your GPA, test scores, and extracurricular impact against admitted cohorts at {selectedSchool}.
              </p>
            </div>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F7F5F3] border border-[#E7E2DE] text-[11px] text-[#666] font-semibold">
              <span className="text-[#690B1B] font-bold">Admissions Intelligence Engine</span>
              <span>•</span>
              <span>Multi-Factor Benchmark Analysis</span>
            </div>
          </div>
        ) : (
          /* ═════════════════════════════════════════════════════════════
             VIEW 3: WIZARD CONFIGURATION FORM
             ═════════════════════════════════════════════════════════════ */
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 md:p-8 shadow-xs space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-[20px] font-bold text-[#111]">1. Select Target University</h3>
                <p className="text-[13px] text-[#777] mt-1">
                  Choose any institution from our verified global database. Your profile data is auto-synced.
                </p>
              </div>

              {/* ─── UNIVERSITY SEARCHABLE DROPDOWN ─────────────────── */}
              <div className="relative" ref={dropdownRef}>
                <div
                  className={`relative w-full rounded-[16px] border transition-all duration-200 ${
                    isDropdownOpen
                      ? 'border-[#690B1B] ring-2 ring-[#690B1B]/10 shadow-lg bg-white'
                      : 'border-[#E7E2DE] hover:border-[#C4B8AE] bg-[#FDFCFB]'
                  }`}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none z-10" size={18} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={loadingUnis ? 'Loading university database...' : 'Search university by name or location...'}
                    value={isDropdownOpen ? searchQuery : (selectedSchool || searchQuery)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!isDropdownOpen) setIsDropdownOpen(true);
                      setHighlightedIndex(-1);
                    }}
                    onFocus={() => {
                      setIsDropdownOpen(true);
                      setSearchQuery('');
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-11 pr-24 py-4 rounded-[16px] bg-transparent text-[15px] font-medium text-[#111] placeholder:text-[#999] focus:outline-hidden"
                  />

                  {/* Right side controls */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {selectedSchool && !isDropdownOpen && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSchool('');
                          setSearchQuery('');
                          inputRef.current?.focus();
                        }}
                        className="p-1 rounded-full text-[#999] hover:text-[#111] hover:bg-[#F0EBE6] transition-colors"
                        title="Clear selection"
                      >
                        <X size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="p-1.5 rounded-lg text-[#888] hover:text-[#111] transition-colors"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#690B1B]' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* DROPDOWN MENU */}
                {isDropdownOpen && (
                  <div
                    ref={listRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] border border-[#E7E2DE] shadow-2xl z-50 max-h-[360px] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {loadingUnis ? (
                      <div className="p-8 text-center text-[#999] space-y-2">
                        <Loader2 size={24} className="animate-spin mx-auto text-[#690B1B]" />
                        <p className="text-[13px]">Loading university database...</p>
                      </div>
                    ) : filteredUniversities.length === 0 ? (
                      <div className="p-8 text-center space-y-2">
                        <Building2 size={28} className="mx-auto text-[#CCC]" />
                        <p className="text-[14px] font-semibold text-[#666]">No matching universities found</p>
                        <p className="text-[12px] text-[#999]">Try searching by country or university name</p>
                      </div>
                    ) : (
                      <div className="py-2">
                        {filteredUniversities.map((uni, idx) => {
                          const isSelected = selectedSchool === uni.name;
                          const isHighlighted = highlightedIndex === idx;

                          return (
                            <button
                              key={uni.id || idx}
                              data-uni-item
                              type="button"
                              onClick={() => selectUniversity(uni.name)}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                              className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                                isSelected
                                  ? 'bg-[#F7F0F1] text-[#690B1B]'
                                  : isHighlighted
                                    ? 'bg-[#FAF8F5] text-[#111]'
                                    : 'text-[#333] hover:bg-[#FAF8F5]'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 text-[13px] font-bold ${
                                    isSelected
                                      ? 'bg-[#690B1B] text-white'
                                      : 'bg-[#F0EBE6] text-[#666]'
                                  }`}
                                >
                                  {uni.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[14px] font-bold truncate leading-snug">
                                    {uni.name}
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-[#888] mt-0.5">
                                    <span className="flex items-center gap-1 truncate">
                                      <MapPin size={11} className="shrink-0 text-[#AAA]" />
                                      {uni.state ? `${uni.state}, ` : ''}{uni.country}
                                    </span>
                                    {uni.qsRanking && uni.qsRanking !== 'Unranked' && (
                                      <span className="text-[#690B1B] font-semibold">QS #{uni.qsRanking}</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {isSelected && <Check size={16} className="text-[#690B1B] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ─── 2. SPICE LEVEL PERSONA SELECTOR ────────────────── */}
              <div className="space-y-3 pt-2">
                <label className="text-[14px] font-bold text-[#111] block">
                  2. Select Admissions Officer Evaluation Tone
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'gentle', title: 'Gentle 🌶️', desc: 'Encouraging, constructive counseling tone.' },
                    { id: 'candid', title: 'Candid 🌶️🌶️', desc: 'Direct, objective Top-10 admissions officer critique.' },
                    { id: 'roast', title: 'Roast Me 🌶️🌶️🌶️', desc: 'Brutally honest, high-stakes tough love.' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSpiceLevel(s.id as any)}
                      className={`p-4 rounded-[18px] text-left border transition-all ${
                        spiceLevel === s.id
                          ? 'bg-[#F7F0F1] border-[#690B1B] text-[#690B1B] shadow-xs'
                          : 'bg-[#FDFCFB] border-[#E7E2DE] text-[#555] hover:border-[#690B1B]/40'
                      }`}
                    >
                      <div className="text-[14px] font-bold">{s.title}</div>
                      <div className="text-[12px] opacity-80 mt-1 leading-relaxed">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── 3. SUBMIT BUTTON ───────────────────────────────── */}
              <button
                onClick={handleRunEvaluation}
                disabled={isEvaluating || !selectedSchool.trim()}
                className={`w-full py-4 px-6 rounded-full text-white text-[15px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isEvaluating || !selectedSchool.trim()
                    ? 'bg-[#690B1B]/60 cursor-not-allowed'
                    : 'bg-[#690B1B] hover:bg-[#7A1022] hover:shadow-md'
                }`}
              >
                {isEvaluating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Analyzing Admissions Dossier...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Admissions Dossier</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
