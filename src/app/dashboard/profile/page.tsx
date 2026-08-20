'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Plus,
  Sparkles,
  BarChart3,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Activity,
  ArrowRight,
  Share2,
  Edit2,
  ShieldCheck
} from 'lucide-react';

export default function StudentProfilePage() {
  const [profileStep, setProfileStep] = useState(3);
  const [gpaUnweighted, setGpaUnweighted] = useState('3.90');
  const [gpaWeighted, setGpaWeighted] = useState('4.35');
  const [satScore, setSatScore] = useState('1540');
  const [actScore, setActScore] = useState('34');

  const profileTags = [
    'India',
    'Asian',
    'Male',
    'Full-ride Applicant',
    'International',
    'Test-optional',
    'Class of 2027',
    'Business / CS Major'
  ];

  return (
    <div className="p-5 md:p-8 max-w-[1500px] mx-auto w-full space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
         HEADER PROFILE CARD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#690B1B] text-white flex items-center justify-center text-[32px] font-bold shadow-md border-4 border-[#F7F0F1]">
              S
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] md:text-[30px] font-bold text-[#111]">Sairam Joshi</h1>
                <span className="text-[11px] font-bold bg-[#16a34a]/10 text-[#16a34a] px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>Profile Active</span>
                </span>
              </div>
              <p className="text-[14px] text-[#777]">
                Share your major, interests, academic motivations and background.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-full border border-[#E7E2DE] text-[#555] text-[13px] font-bold hover:bg-[#F7F5F3] transition-all flex items-center gap-2">
              <Share2 size={15} />
              <span>Privacy &amp; Share</span>
            </button>
            <Link
              href="/dashboard/chance-me"
              className="px-5 py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <BarChart3 size={16} />
              <span>Evaluate Odds</span>
            </Link>
          </div>
        </div>

        {/* TAG PILLS */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F0EBE6]">
          {profileTags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] font-bold bg-[#F7F5F3] text-[#555] px-3 py-1 rounded-full border border-[#E7E2DE]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         STEPPER PROGRESS BAR
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#111]">Complete Student Profile</h3>
          <span className="text-[12px] font-bold text-[#690B1B]">Step 3 of 7</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center pt-2">
          {[
            { step: 1, label: 'Bio' },
            { step: 2, label: 'Grad & Major' },
            { step: 3, label: 'Academics' },
            { step: 4, label: 'Extracurriculars' },
            { step: 5, label: 'Awards' },
            { step: 6, label: 'Essays' },
            { step: 7, label: 'Target Unis' },
          ].map((s) => (
            <div key={s.step} className="space-y-1.5">
              <div
                className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center text-[13px] font-bold transition-all ${
                  s.step <= profileStep
                    ? 'bg-[#690B1B] text-white shadow-2xs'
                    : 'bg-[#F7F5F3] text-[#999] border border-[#E7E2DE]'
                }`}
              >
                {s.step}
              </div>
              <span className="text-[10px] font-bold text-[#777] hidden sm:block truncate">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         TWO-COLUMN SECTION: ACADEMICS + RIGHT FLOATING CARD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: SECTIONS */}
        <div className="lg:col-span-2 space-y-6">
          {/* ACADEMICS CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-5">
            <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
              <BookOpen size={20} className="text-[#690B1B]" />
              <span>Academics &amp; Test Scores</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">GPA (Unweighted)</label>
                <input
                  type="text"
                  value={gpaUnweighted}
                  onChange={(e) => setGpaUnweighted(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">GPA (Weighted)</label>
                <input
                  type="text"
                  value={gpaWeighted}
                  onChange={(e) => setGpaWeighted(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">SAT Score</label>
                <input
                  type="text"
                  value={satScore}
                  onChange={(e) => setSatScore(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#690B1B] outline-none focus:border-[#690B1B]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">ACT Score</label>
                <input
                  type="text"
                  value={actScore}
                  onChange={(e) => setActScore(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>
            </div>

            {/* ADVANCED COURSEWORK */}
            <div className="pt-3 border-t border-[#F0EBE6] space-y-3">
              <label className="text-[13px] font-bold text-[#111] block">Advanced Coursework</label>
              <div className="flex items-center gap-2 flex-wrap">
                <button className="px-3.5 py-2 rounded-full border border-[#E7E2DE] bg-[#FDFCFB] text-[12px] font-bold text-[#555] hover:border-[#690B1B] flex items-center gap-1.5">
                  <Plus size={14} />
                  <span>IB Subject</span>
                </button>
                <button className="px-3.5 py-2 rounded-full border border-[#E7E2DE] bg-[#FDFCFB] text-[12px] font-bold text-[#555] hover:border-[#690B1B] flex items-center gap-1.5">
                  <Plus size={14} />
                  <span>AP Exam</span>
                </button>
                <button className="px-3.5 py-2 rounded-full border border-[#E7E2DE] bg-[#FDFCFB] text-[12px] font-bold text-[#555] hover:border-[#690B1B] flex items-center gap-1.5">
                  <Plus size={14} />
                  <span>Custom Score</span>
                </button>
              </div>
            </div>
          </div>

          {/* EXTRACURRICULARS LINK CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
                <Activity size={20} className="text-[#690B1B]" />
                <span>Extracurricular Activities</span>
              </h3>
              <Link href="/dashboard/extracurriculars" className="text-[13px] font-bold text-[#690B1B] hover:underline flex items-center gap-1">
                <span>Manage All →</span>
              </Link>
            </div>
            <div className="p-4 rounded-[14px] bg-[#FDFCFB] border border-dashed border-[#CCCCCC] text-center">
              <Link href="/dashboard/extracurriculars" className="text-[13px] font-bold text-[#690B1B] inline-flex items-center gap-2">
                <Plus size={16} />
                <span>Add Extracurricular Activity</span>
              </Link>
            </div>
          </div>

          {/* AWARDS & HONORS CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
                <Award size={20} className="text-[#C9A55D]" />
                <span>Awards &amp; Honors</span>
              </h3>
              <button className="text-[13px] font-bold text-[#690B1B] hover:underline">+ Add Award</button>
            </div>
            <div className="p-4 rounded-[14px] bg-[#FDFCFB] border border-dashed border-[#CCCCCC] text-center">
              <button className="text-[13px] font-bold text-[#690B1B] inline-flex items-center gap-2">
                <Plus size={16} />
                <span>Add National or School Honor</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT FLOATING CHANCE ME CARD */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#690B1B] to-[#530816] rounded-[24px] p-6 text-white shadow-md space-y-5 sticky top-[96px]">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#C9A55D]">
              <Sparkles size={24} />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A55D]">AI CHANCE ME</span>
              <h4 className="text-[22px] font-bold leading-tight">How strong is your profile?</h4>
              <p className="text-[13px] text-white/80 leading-relaxed">
                Analyze your odds against 10,000+ real admits and learn how to strengthen your application gaps.
              </p>
            </div>
            <Link
              href="/dashboard/chance-me"
              className="w-full py-3.5 px-4 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>See My Chances</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
