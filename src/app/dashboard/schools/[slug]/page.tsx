'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin,
  ExternalLink,
  Award,
  DollarSign,
  BookOpen,
  Users,
  CheckCircle2,
  BarChart3,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Bookmark,
  Share2
} from 'lucide-react';

export default function UniversityDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'upenn';

  const [activeTab, setActiveTab] = useState('overview');

  const schoolData = {
    name: slug === 'upenn' ? 'University of Pennsylvania' : 'Massachusetts Institute of Technology',
    location: slug === 'upenn' ? 'Philadelphia, PA, USA' : 'Cambridge, MA, USA',
    type: 'Private Ivy League Research University',
    qsRank: '#15 QS World',
    acceptanceRate: '5.4%',
    tuition: '$63,452 / year',
    avgGpa: '3.9 / 4.0',
    satAvg: '1500 - 1570',
    ieltsMin: '7.5',
    logo: slug === 'upenn' ? '🏛️' : '🎓',
    bannerGradient: 'from-[#690B1B] via-[#7A1022] to-[#530816]',
  };

  return (
    <div className="p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
         HERO COVER BANNER & OVERLAY CARD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="relative rounded-[24px] overflow-hidden shadow-sm border border-[#E7E2DE] bg-white">
        {/* TOP GRADIENT BANNER PHOTO AREA */}
        <div className={`h-[220px] md:h-[260px] bg-gradient-to-r ${schoolData.bannerGradient} relative p-6 flex items-start justify-between text-white`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#C9A55D] text-[12px] font-bold">
            <Sparkles size={14} />
            <span>Verified University Profile</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[13px] font-bold transition-all flex items-center gap-2">
              <Bookmark size={15} />
              <span>Add to My List</span>
            </button>
          </div>
        </div>

        {/* FLOATING DETAILS OVERLAY CARD */}
        <div className="p-6 md:p-8 bg-white relative -mt-16 mx-4 md:mx-8 rounded-[20px] shadow-lg border border-[#E7E2DE] space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[18px] bg-[#F7F0F1] border border-[#690B1B]/20 flex items-center justify-center text-[36px] shrink-0">
                {schoolData.logo}
              </div>
              <div>
                <h1 className="text-[26px] md:text-[32px] font-bold text-[#111111] leading-tight">
                  {schoolData.name}
                </h1>
                <p className="text-[14px] text-[#777777] flex items-center gap-1.5 mt-0.5">
                  <MapPin size={15} className="text-[#690B1B]" />
                  <span>{schoolData.location}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-bold bg-[#690B1B] text-white px-3.5 py-1.5 rounded-full">
                {schoolData.qsRank}
              </span>
              <span className="text-[12px] font-bold bg-[#F7F0F1] text-[#690B1B] px-3.5 py-1.5 rounded-full">
                {schoolData.acceptanceRate} Acceptance
              </span>
              <span className="text-[12px] font-bold bg-[#FFF8EB] text-[#9E731A] px-3.5 py-1.5 rounded-full">
                Private Research
              </span>
            </div>
          </div>

          {/* EXTERNAL LINKS */}
          <div className="flex items-center gap-4 pt-2 border-t border-[#F0EBE6] text-[13px] font-medium text-[#690B1B] flex-wrap">
            <a href="#" className="flex items-center gap-1 hover:underline">
              <span>Official Website</span>
              <ExternalLink size={13} />
            </a>
            <span>•</span>
            <a href="#" className="flex items-center gap-1 hover:underline">
              <span>Net Price Calculator</span>
              <ExternalLink size={13} />
            </a>
            <span>•</span>
            <a href="#" className="flex items-center gap-1 hover:underline">
              <span>Common Data Set</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* NAVIGATION SUB-TABS */}
        <div className="px-6 md:px-8 pt-4 pb-2 border-t border-[#F0EBE6] flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'admissions', label: 'Admissions & Requirements' },
            { id: 'cost', label: 'Cost & Scholarships' },
            { id: 'essays', label: 'SOP & Essays' },
            { id: 'admits', label: 'Admitted Profiles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#690B1B] text-white shadow-2xs'
                  : 'text-[#666666] hover:bg-[#F7F5F3] hover:text-[#111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         DETAILED METRICS CONTENT GRID
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN METRICS & STATS (LEFT 2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          {/* ADMISSION REQUIREMENTS */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
              <BarChart3 size={20} className="text-[#690B1B]" />
              <span>Admission Metrics &amp; Requirements</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 text-center">
                <div className="text-[12px] text-[#777] font-medium">Avg GPA</div>
                <div className="text-[22px] font-bold text-[#690B1B] mt-1">{schoolData.avgGpa}</div>
              </div>
              <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 text-center">
                <div className="text-[12px] text-[#777] font-medium">SAT Middle 50%</div>
                <div className="text-[22px] font-bold text-[#111] mt-1">{schoolData.satAvg}</div>
              </div>
              <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 text-center">
                <div className="text-[12px] text-[#777] font-medium">IELTS Min</div>
                <div className="text-[22px] font-bold text-[#C9A55D] mt-1">{schoolData.ieltsMin}</div>
              </div>
              <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] p-4 text-center">
                <div className="text-[12px] text-[#777] font-medium">Acceptance Rate</div>
                <div className="text-[22px] font-bold text-[#690B1B] mt-1">{schoolData.acceptanceRate}</div>
              </div>
            </div>
          </div>

          {/* ESSAY PROMPTS REQUIRED */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
              <FileText size={20} className="text-[#690B1B]" />
              <span>Required Supplemental Essays</span>
            </h3>

            <div className="space-y-4 pt-2">
              {[
                {
                  prompt: "How will you explore your intellectual and academic interests at the University of Pennsylvania?",
                  wordCount: "450 - 500 words",
                  tag: "Academic Fit"
                },
                {
                  prompt: "Describe how your background and experiences will shape your contribution to the Penn community.",
                  wordCount: "150 - 200 words",
                  tag: "Diversity & Community"
                }
              ].map((essay, idx) => (
                <div key={idx} className="p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-2.5 py-0.5 rounded-full">
                      {essay.tag}
                    </span>
                    <span className="text-[12px] font-semibold text-[#888]">{essay.wordCount}</span>
                  </div>
                  <p className="text-[14px] text-[#333] font-medium leading-relaxed">
                    &ldquo;{essay.prompt}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* REAL ADMITTED PROFILES */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <h3 className="text-[20px] font-bold text-[#111] flex items-center gap-2">
              <Users size={20} className="text-[#690B1B]" />
              <span>Admitted Student Profiles &amp; Mentors</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { name: "Marcus K.", major: "Computer Science", classYear: "Class of 2028", gpa: "3.95", sat: "1540" },
                { name: "Sarah L.", major: "Bioengineering", classYear: "Class of 2027", gpa: "3.91", sat: "1560" },
              ].map((admit, idx) => (
                <div key={idx} className="p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#690B1B] text-white flex items-center justify-center font-bold text-[14px]">
                      {admit.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-[#111]">{admit.name}</div>
                      <div className="text-[12px] text-[#777]">{admit.major} • {admit.classYear}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[12px] text-[#555] bg-white p-2 rounded-lg border border-[#E7E2DE]">
                    <span>GPA: <strong>{admit.gpa}</strong></span>
                    <span>SAT: <strong>{admit.sat}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION & SUMMARY SIDEBAR */}
        <div className="space-y-6">
          {/* AI CHANCE ME BOX */}
          <div className="bg-gradient-to-br from-[#690B1B] to-[#530816] rounded-[20px] p-6 text-white shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Sparkles size={20} className="text-[#C9A55D]" />
            </div>
            <h4 className="text-[20px] font-bold">Calculate Your Admit Odds</h4>
            <p className="text-[13px] text-white/80 leading-relaxed">
              Compare your exact GPA, SAT/GRE, and extracurricular profile against historical UPenn admits.
            </p>
            <button className="w-full py-3 px-4 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[13px] transition-all flex items-center justify-center gap-2 shadow-xs">
              <span>Run AI Chance-Me</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* QUICK SUMMARY CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <h4 className="text-[16px] font-bold text-[#111] border-b border-[#F0EBE6] pb-3">
              Cost &amp; Financial Aid Summary
            </h4>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#777]">Tuition &amp; Fees</span>
                <span className="font-bold text-[#111]">$63,452 / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777]">Housing &amp; Dining</span>
                <span className="font-bold text-[#111]">$17,888 / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777]">Avg Need-Based Grant</span>
                <span className="font-bold text-[#16a34a]">$56,000 / yr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
