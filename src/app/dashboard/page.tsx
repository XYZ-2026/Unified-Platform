'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getCachedUserDetails, subscribeToUserDetails } from '@/lib/userDetailsCache';
import {
  Sparkles,
  Zap,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Clock,
  ChevronRight,
  CheckCircle2,
  Gift,
  Share2,
  BookOpen,
  UserCheck,
  FileText
} from 'lucide-react';
import { calculateDeadlineInfo } from '@/lib/deadlineUtils';

const RAW_HOME_TIMELINE_TASKS = [
  {
    id: 'task-1',
    title: 'Draft your Common App personal statement',
    date: 'Sep 12',
    checkpoint: 'SEP 15',
    defaultDone: false
  },
  {
    id: 'task-2',
    title: 'Ask two teachers for rec letters',
    date: 'Sep 20',
    checkpoint: 'SEP 15',
    defaultDone: false
  },
  {
    id: 'task-3',
    title: 'FAFSA opens for financial aid',
    date: 'Oct 01',
    checkpoint: 'OCT 01',
    defaultDone: false
  },
  {
    id: 'task-5',
    title: 'Early Decision / Early Action (ED/EA) Application Deadline',
    date: 'Nov 01',
    checkpoint: 'NOV 01',
    defaultDone: false
  },
];

export default function DashboardHomePage() {
  const { user, userData } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [activeCheckpoint, setActiveCheckpoint] = useState('ALL');
  const [timelineTasks, setTimelineTasks] = useState(() => {
    return RAW_HOME_TIMELINE_TASKS.map((t) => {
      const info = calculateDeadlineInfo(t.date);
      let status = 'Upcoming';
      if (info.diffDays < 0) {
        status = 'Overdue';
      } else if (info.diffDays <= 7) {
        status = 'Due Soon';
      } else if (info.diffDays <= 21) {
        status = 'In Progress';
      }
      return {
        ...t,
        dueIn: info.dueIn,
        diffDays: info.diffDays,
        status: t.defaultDone ? 'Completed' : status,
        done: t.defaultDone
      };
    });
  });

  const toggleTask = (id: string) => {
    setTimelineTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextDone = !t.done;
        const info = calculateDeadlineInfo(t.date);
        let activeStatus = info.diffDays < 0 ? 'Overdue' : info.diffDays <= 7 ? 'Due Soon' : 'In Progress';
        return {
          ...t,
          done: nextDone,
          status: nextDone ? "Completed" : activeStatus
        };
      }
      return t;
    }));
  };

  const CHECKPOINTS = [
    { label: 'SEP 01', sub: 'Cycle Open', date: 'Sep 01' },
    { label: 'SEP 15', sub: 'Personal SOP', date: 'Sep 15' },
    { label: 'OCT 01', sub: 'Financial Aid', date: 'Oct 01' },
    { label: 'NOV 01', sub: 'Early Action', date: 'Nov 01' }
  ];

  // Dynamically compute progress percentage based on today's date
  const progressPercent = (() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 8, 1).getTime(); // Sep 1
    const end = new Date(now.getFullYear(), 10, 1).getTime(); // Nov 1
    const current = now.getTime();
    if (current <= start) return 8;
    if (current >= end) return 100;
    const pct = Math.round(((current - start) / (end - start)) * 100);
    return Math.max(10, Math.min(pct, 95));
  })();

  const displayedTasks = activeCheckpoint === 'ALL'
    ? timelineTasks
    : timelineTasks.filter(t => t.checkpoint === activeCheckpoint);

  useEffect(() => {
    const userKey = user?.uid || user?.email || userData?.email || 'default';
    const cached = getCachedUserDetails(userKey);
    if (cached && (cached.fullName || cached.name)) {
      setDisplayName(cached.fullName || cached.name || '');
    } else if (userData?.name || userData?.fullName || user?.displayName) {
      setDisplayName(userData?.name || userData?.fullName || user?.displayName || '');
    }

    const unsub = subscribeToUserDetails((data) => {
      if (data.fullName || data.name) {
        setDisplayName(data.fullName || data.name || '');
      }
    });
    return () => unsub();
  }, [user, userData]);

  const firstName = displayName ? displayName.split(' ')[0] : (userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student');

  return (
    <main className="p-3.5 sm:p-5 md:p-8 space-y-4 sm:space-y-5 md:space-y-6 max-w-7xl mx-auto w-full">
      {/* PROMOTIONAL TOP BANNER */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[14px] sm:rounded-[18px] p-3.5 sm:p-5 text-white flex items-center justify-between gap-3 shadow-sm border border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-[#C9A55D]" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] sm:text-[15px] font-bold truncate">Fall 2026 Admissions Special Offer</div>
            <div className="text-[11px] sm:text-[12px] text-white/75 leading-relaxed hidden sm:block">
              Get unlimited AI SOP reviews, 500+ admitted student profiles &amp; Chance-Me predictions.
            </div>
          </div>
        </div>
        <button className="shrink-0 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[11px] sm:text-[13px] transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer active:scale-95">
          <span>30% Off</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* GREETING HEADER & TOUR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-[22px] sm:text-[26px] md:text-[30px] font-bold text-[#111111] tracking-[-0.03em]">
            Good day, {firstName} 👋
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#777777]">
            Here is your admissions dashboard and action plan for today.
          </p>
        </div>
        <button className="px-4 py-2 rounded-full border border-[#E7E2DE] bg-white text-[#555555] hover:text-[#690B1B] text-[12px] sm:text-[13px] font-semibold flex items-center gap-2 hover:bg-[#F7F0F1] transition-all shadow-2xs shrink-0 cursor-pointer">
          <HelpCircle size={14} />
          <span>Take the tour</span>
        </button>
      </div>

      {/* TWO-COLUMN LAYOUT: MAIN WIDGETS + RIGHT SIDEBAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* LEFT 2 COLUMNS: HERO CARDS & TIMELINE */}
        <div className="md:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
          {/* HERO FEATURE CARD: AI CHANCE ME */}
          <div className="bg-white border border-[#E7E2DE] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 md:p-8 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#690B1B]/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            <div className="flex items-center gap-3 sm:gap-6 relative z-10">
              {/* UPGRADED CRISP HIGH-RES CHANCE-ME LOGO */}
              <div className="w-13 h-13 sm:w-18 sm:h-18 aspect-square rounded-[18px] sm:rounded-[22px] bg-gradient-to-br from-[#690B1B] via-[#820E22] to-[#420610] flex items-center justify-center shrink-0 shadow-md shadow-[#690B1B]/25 ring-2 ring-white/40 text-white relative">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-[#E5C178]" strokeWidth={2.4} />
                <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] border-2 border-[#690B1B] absolute -top-0.5 -right-0.5" />
              </div>

              <div className="space-y-1.5 sm:space-y-2 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#F7F0F1] text-[#690B1B] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles size={10} />
                  <span>AI Admission Evaluator</span>
                </div>
                <h3 className="text-[17px] sm:text-[20px] md:text-[22px] font-bold text-[#111111] leading-snug">
                  See your real admission chances
                </h3>
                <p className="text-[12px] sm:text-[14px] text-[#666666] leading-relaxed hidden sm:block max-w-[500px]">
                  Get a full read on your profile school-by-school, compared against thousands of verified admitted students.
                </p>
                <div className="pt-1 sm:pt-2">
                  <Link href="/dashboard/chance-me" className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] sm:text-[13px] font-bold transition-all inline-flex items-center gap-2 shadow-xs hover:scale-[1.01] active:scale-95 cursor-pointer">
                    <span>Run AI Chance-Me</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* APPLICATION DEADLINE TIMELINE CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EBE6]">
              <div>
                <h3 className="text-[15px] sm:text-[17px] font-bold text-[#111111] flex items-center gap-2">
                  <Clock size={16} className="text-[#690B1B]" />
                  <span>Fall 2026 Milestone Timeline</span>
                </h3>
                <p className="text-[11px] sm:text-[12px] text-[#888888]">Key deadlines &amp; application checkpoints</p>
              </div>
              <Link href="/dashboard/tracker" className="text-[12px] sm:text-[13px] font-bold text-[#690B1B] hover:underline flex items-center gap-1">
                <span>View all</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            {/* WORKING INTERACTIVE TIMELINE PROGRESS GRAPHIC */}
            <div className="space-y-4">
              {/* TIMELINE TRACK WITH NODES */}
              <div className="relative pt-2 pb-1">
                {/* Background Track Line */}
                <div className="absolute top-[18px] left-[10%] right-[10%] h-[3px] bg-[#EAE6E2] rounded-full" />
                {/* Active Progress Fill Line */}
                <div
                  className="absolute top-[18px] left-[10%] h-[3px] bg-gradient-to-r from-[#16a34a] to-[#690B1B] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(80, Math.max(10, progressPercent * 0.8))}%` }}
                />

                <div className="relative z-10 grid grid-cols-4 gap-1 text-center">
                  {CHECKPOINTS.map((cp) => {
                    const isSelected = activeCheckpoint === cp.label;
                    const isPast = calculateDeadlineInfo(cp.date).diffDays <= 0;
                    return (
                      <button
                        key={cp.label}
                        type="button"
                        onClick={() => setActiveCheckpoint(activeCheckpoint === cp.label ? 'ALL' : cp.label)}
                        className="group flex flex-col items-center gap-1.5 focus:outline-hidden cursor-pointer"
                      >
                        {/* Node Dot */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#690B1B] border-[#690B1B] text-white shadow-xs scale-110'
                            : isPast
                              ? 'bg-[#16a34a]/10 border-[#16a34a] text-[#16a34a]'
                              : 'bg-white border-[#C9A55D] text-[#690B1B] group-hover:border-[#690B1B]'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : isPast ? 'bg-[#16a34a]' : 'bg-[#C9A55D]'}`} />
                        </div>
                        {/* Date Label */}
                        <span className={`text-[11px] sm:text-[12px] font-bold transition-colors ${
                          isSelected ? 'text-[#690B1B]' : 'text-[#777] group-hover:text-[#111]'
                        }`}>
                          {cp.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TIMELINE TASKS LIST - INTERACTIVE CHECKABLE */}
              <div className="space-y-2.5 sm:space-y-3 pt-2">
                {displayedTasks.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleTask(item.id)}
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-[12px] sm:rounded-[14px] bg-[#FDFCFB] border border-[#F0EBE6] hover:border-[#690B1B]/30 hover:bg-[#FFFDFD] transition-all gap-2 cursor-pointer group"
                    title="Click to toggle completion status"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        item.done ? 'bg-[#16a34a]/15 text-[#16a34a]' : 'bg-[#690B1B]/10 text-[#690B1B]'
                      }`}>
                        {item.done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[12.5px] sm:text-[14px] font-bold truncate transition-colors ${
                          item.done ? 'line-through text-[#888888]' : 'text-[#111111]'
                        }`}>
                          {item.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap text-[10.5px] sm:text-[11px] text-[#888888]">
                          <span>Deadline: {item.date}</span>
                          <span className="w-1 h-1 rounded-full bg-[#ccc]" />
                          <span className="font-semibold text-[#690B1B] bg-[#F7F0F1] px-1.5 py-0.5 rounded-full">{item.dueIn}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 transition-colors ${
                      item.done
                        ? 'bg-[#16a34a]/15 text-[#16a34a]'
                        : item.status === 'Due Soon'
                          ? 'bg-[#690B1B]/10 text-[#690B1B]'
                          : item.status === 'In Progress'
                            ? 'bg-[#C9A55D]/20 text-[#9E731A]'
                            : 'bg-[#F0EBE6] text-[#777]'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REWARDS & UPGRADE WIDGETS */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* REWARDS CARD */}
          <div className="bg-gradient-to-br from-[#EBF4FB] to-white border border-[#D0E2F3] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0088CB]/10 text-[#0088CB] flex items-center justify-center">
                <Gift size={20} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#0088CB] bg-[#0088CB]/10 px-2.5 py-0.5 rounded-full">
                FREE REWARDS
              </span>
            </div>
            <h4 className="text-[16px] sm:text-[18px] font-bold text-[#111111] mb-1">Earn Free AI Credits!</h4>
            <p className="text-[12px] sm:text-[13px] text-[#555555] leading-relaxed mb-3 sm:mb-4">
              Earn <strong className="text-[#0088CB]">30 free credits</strong> by inviting your friends &amp; classmates.
            </p>
            <button className="w-full py-2 sm:py-2.5 px-4 rounded-[12px] bg-[#0088CB] hover:bg-[#0074AE] text-white text-[12px] sm:text-[13px] font-bold transition-all flex items-center justify-center gap-2 shadow-xs">
              <Share2 size={14} />
              <span>Invite Friends →</span>
            </button>
          </div>

          {/* UNLIMITED ENERGY / UPGRADE WIDGET */}
          <div className="bg-gradient-to-br from-[#FFF9EE] to-white border border-[#F5E5C4] rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C9A55D]/15 text-[#9E731A] flex items-center justify-center">
                <Zap size={20} className="fill-[#C9A55D]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#9E731A] bg-[#C9A55D]/20 px-2.5 py-0.5 rounded-full">
                PRO ACCESS
              </span>
            </div>
            <h4 className="text-[16px] sm:text-[18px] font-bold text-[#111111] mb-1">Unlimited AI Energy</h4>
            <p className="text-[12px] sm:text-[13px] text-[#666666] leading-relaxed mb-3 sm:mb-4">
              Get infinite SOP reviews, priority AI Chance-Me, and full access to 500+ exemplar admit essays.
            </p>
            <button className="w-full py-2 sm:py-2.5 px-4 rounded-[12px] bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] sm:text-[13px] font-bold transition-all flex items-center justify-center gap-2 shadow-xs">
              <span>View Upgrade Plans →</span>
            </button>
          </div>
        </div>
      </div>

      {/* RECOMMENDED FOR YOU GRID (4 ACTION CARDS) */}
      <div className="pt-1 sm:pt-2 md:pt-4">
        <h3 className="text-[15px] sm:text-[18px] font-bold text-[#111111] mb-3 sm:mb-4">Recommended Actions for You</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            {
              title: "See your real admission chances",
              desc: "Run a free AI Chance-Me prediction.",
              action: "Open →",
              href: "/dashboard/chance-me",
              btnBg: "bg-[#690B1B] text-white",
              icon: BarChart3,
              badge: "RECOMMENDED"
            },
            {
              title: "Explore Admitted SOPs",
              desc: "See how real admits got into TU Munich & Harvard.",
              action: "Explore →",
              href: "/dashboard/exemplar-essays",
              btnBg: "bg-[#111111] text-white",
              icon: BookOpen,
              badge: "500+ ESSAYS"
            },
            {
              title: "Complete your profile",
              desc: "Add GPA, test scores & extracurriculars.",
              action: "Finish →",
              href: "/dashboard/profile",
              btnBg: "bg-[#C9A55D] text-black",
              icon: UserCheck,
              badge: "ACTION REQ"
            },
            {
              title: "Write your SOP",
              desc: "Get instant real-time AI feedback on your essays.",
              action: "Write →",
              href: "/dashboard/essays",
              btnBg: "bg-[#690B1B] text-white",
              icon: FileText,
              badge: "AI EDITOR"
            },
          ].map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E7E2DE] rounded-[14px] sm:rounded-[18px] p-3.5 sm:p-5 shadow-2xs hover:border-[#690B1B]/40 hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F7F0F1] text-[#690B1B] flex items-center justify-center">
                      <IconComponent size={16} />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-[#690B1B] bg-[#F7F0F1] px-1.5 sm:px-2 py-0.5 rounded-full truncate ml-1">
                      {card.badge}
                    </span>
                  </div>
                  <h4 className="text-[13px] sm:text-[15px] font-bold text-[#111111] mb-1 sm:mb-1.5 leading-snug">
                    {card.title}
                  </h4>
                  <p className="text-[11px] sm:text-[12px] text-[#777777] leading-relaxed mb-3 sm:mb-4 hidden sm:block">
                    {card.desc}
                  </p>
                </div>
                <Link href={card.href} className={`w-full py-1.5 sm:py-2 px-3 sm:px-4 rounded-[8px] sm:rounded-[10px] text-[11px] sm:text-[12px] font-bold transition-all text-center block ${card.btnBg}`}>
                  {card.action}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
