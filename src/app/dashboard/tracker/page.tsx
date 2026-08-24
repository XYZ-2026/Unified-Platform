'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  DollarSign,
  Users,
  Building2,
  Filter,
  Layers,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function ApplicationTrackerPage() {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [activeFilter, setActiveFilter] = useState('all');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tasks = [
    {
      id: 'task-1',
      title: 'Draft your Common App personal statement',
      category: 'Milestone',
      date: 'Sep 12',
      dueIn: 'in 24 days',
      group: 'NEXT 30 DAYS',
      type: 'task',
      icon: FileText
    },
    {
      id: 'task-2',
      title: 'Ask two teachers for rec letters',
      category: 'Recommender',
      date: 'Sep 20',
      dueIn: 'in 32 days',
      group: 'LATER THIS CYCLE',
      type: 'task',
      icon: Users
    },
    {
      id: 'task-3',
      title: 'FAFSA opens for financial aid',
      category: 'Financial aid',
      date: 'Oct 01',
      dueIn: 'in 43 days',
      group: 'LATER THIS CYCLE',
      type: 'aid',
      icon: DollarSign
    },
    {
      id: 'task-4',
      title: 'CSS Profile portal opens',
      category: 'Financial aid',
      date: 'Oct 01',
      dueIn: 'in 43 days',
      group: 'LATER THIS CYCLE',
      type: 'aid',
      icon: DollarSign
    },
    {
      id: 'task-5',
      title: 'University of Pennsylvania - Early Decision Deadline',
      category: 'Application',
      date: 'Nov 01',
      dueIn: 'in 2 months',
      group: 'LATER THIS CYCLE',
      type: 'application',
      icon: Building2
    },
    {
      id: 'task-6',
      title: 'CSS Profile due for early schools',
      category: 'Financial aid',
      date: 'Nov 01',
      dueIn: 'in 2 months',
      group: 'LATER THIS CYCLE',
      type: 'aid',
      icon: DollarSign
    },
    {
      id: 'task-7',
      title: 'FAFSA priority deadline',
      category: 'Financial aid',
      date: 'Jan 05',
      dueIn: 'in 5 months',
      group: 'LATER THIS CYCLE',
      type: 'aid',
      icon: DollarSign
    },
    {
      id: 'task-8',
      title: 'Decision day: commit and deposit',
      category: 'Milestone',
      date: 'May 01',
      dueIn: 'in 9 months',
      group: 'LATER THIS CYCLE',
      type: 'task',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
         HEADER AREA & ADD DEADLINE BUTTON
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-4 w-full">
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-[-0.03em]">Application Tracker</h2>
          <button className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] sm:text-[13px] font-bold transition-all flex items-center gap-1.5 sm:gap-2 shadow-xs shrink-0 cursor-pointer">
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span>Add Deadline</span>
          </button>
        </div>
        <p className="text-[12.5px] sm:text-[13.5px] text-[#777777]">1 school · 3 application systems · 10 key dates tracked</p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         TIMELINE CHART CARD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F0EBE6] pb-4">
          {/* VIEW MODE SWITCH */}
          <div className="flex items-center gap-1 bg-[#F7F5F3] p-1 rounded-full border border-[#E7E2DE]">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-[#690B1B] shadow-2xs'
                  : 'text-[#666666] hover:text-[#11]'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#690B1B] shadow-2xs'
                  : 'text-[#666666] hover:text-[#11]'
              }`}
            >
              Calendar
            </button>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#777777]">
            <span className="font-semibold">Range: Nov 4 to Dec 19</span>
            <span className="bg-[#F7F0F1] text-[#690B1B] font-bold px-2.5 py-0.5 rounded-full text-[11px]">
              Month View
            </span>
          </div>
        </div>

        {/* VISUAL TIMELINE GRAPH GRAPHIC */}
        <div className="p-4 bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] space-y-6 overflow-x-auto scrollbar-none">
          {/* TRACK LINES */}
          <div className="space-y-6 min-w-[500px]">
            <div className="flex items-center gap-4">
              <span className="w-24 text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider shrink-0">Common App</span>
              <div className="flex-1 h-px bg-[#E7E2DE] relative">
                <div className="absolute left-[30%] -top-3.5 px-2.5 py-1.5 bg-[#FDF0F2] border border-[#690B1B]/15 rounded-full text-[10.5px] font-bold text-[#690B1B] shadow-2xs whitespace-nowrap">
                  Draft Common App...
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-24 text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider shrink-0">Financial Aid</span>
              <div className="flex-1 h-px bg-[#E7E2DE] relative">
                <div className="absolute left-[65%] -top-3.5 px-2.5 py-1.5 bg-[#EBF4FB] border border-[#0088CB]/15 rounded-full text-[10.5px] font-bold text-[#0088CB] shadow-2xs whitespace-nowrap">
                  2 aid dates ($)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-24 text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider shrink-0">You</span>
              <div className="flex-1 h-px bg-[#E7E2DE] relative">
                <div className="absolute left-[45%] -top-3.5 px-2.5 py-1.5 bg-[#EBF7EE] border border-[#16a34a]/15 rounded-full text-[10.5px] font-bold text-[#16a34a] shadow-2xs whitespace-nowrap">
                  Ask teacher recs
                </div>
              </div>
            </div>
          </div>

          {/* DATES FOOTER */}
          <div className="flex justify-between text-[10.5px] text-[#888888] pt-2 border-t border-[#F0EBE6] min-w-[500px]">
            <span>Nov 11</span>
            <span>Nov 18</span>
            <span>Nov 25</span>
            <span>Dec 2</span>
            <span>Dec 9</span>
            <span>Dec 16</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         UPCOMING CHECKLIST & FILTERS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F0EBE6] pb-4">
          <h3 className="text-[20px] font-bold text-[#111111]">Upcoming Tasks & Deadlines</h3>

          {/* FILTER PILLS */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All 10' },
              { id: 'applications', label: 'Applications 1' },
              { id: 'aid', label: 'Aid 5' },
              { id: 'tasks', label: 'Tasks 4' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#690B1B] text-white shadow-xs'
                    : 'bg-[#F7F5F3] text-[#555] hover:bg-[#E7E2DE]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* TASK ITEMS LIST */}
        <div className="space-y-6">
          {/* GROUP: NEXT 30 DAYS */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-md w-fit uppercase tracking-wider">
              NEXT 30 DAYS (1)
            </div>
            {tasks
              .filter((t) => t.group === 'NEXT 30 DAYS')
              .map((t) => {
                const IconComponent = t.icon;
                const isDone = !!completedTasks[t.id];
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 rounded-[14px] bg-white border border-[#E7E2DE] hover:border-[#690B1B]/30 hover:shadow-2xs transition-all gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(t.id);
                        }}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                          isDone ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isDone && <CheckCircle2 size={16} />}
                      </button>
                      <div className="w-9 h-9 rounded-xl bg-[#F7F0F1] text-[#690B1B] flex items-center justify-center shrink-0">
                        <IconComponent size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[14px] sm:text-[15px] font-bold truncate ${isDone ? 'line-through text-[#888888]' : 'text-[#111111]'}`}>
                          {t.title}
                        </div>
                        <div className="text-[11.5px] text-[#777777] mt-0.5">
                          {t.category} • {t.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-2.5 py-1 rounded-full">
                        {t.dueIn}
                      </span>
                      <ChevronRight size={16} className="text-[#CCCCCC]" />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* GROUP: LATER THIS CYCLE */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-[#555555] bg-[#F7F5F3] px-3 py-1 rounded-md w-fit uppercase tracking-wider">
              LATER THIS CYCLE (7)
            </div>
            {tasks
              .filter((t) => t.group === 'LATER THIS CYCLE')
              .map((t) => {
                const IconComponent = t.icon;
                const isDone = !!completedTasks[t.id];
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 rounded-[14px] bg-white border border-[#E7E2DE] hover:border-[#690B1B]/30 hover:shadow-2xs transition-all gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(t.id);
                        }}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                          isDone ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isDone && <CheckCircle2 size={16} />}
                      </button>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        t.type === 'aid'
                          ? 'bg-[#EBF4FB] text-[#0088CB]'
                          : t.type === 'application'
                          ? 'bg-[#F7F5F3] text-[#555555]'
                          : 'bg-[#F7F5F3] text-[#555555]'
                      }`}>
                        <IconComponent size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[14px] sm:text-[15px] font-bold truncate ${isDone ? 'line-through text-[#888888]' : 'text-[#111111]'}`}>
                          {t.title}
                        </div>
                        <div className="text-[11.5px] text-[#777777] mt-0.5">
                          {t.category} • {t.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] font-bold text-[#777777] bg-[#F7F5F3] px-2.5 py-1 rounded-full">
                        {t.dueIn}
                      </span>
                      <ChevronRight size={16} className="text-[#CCCCCC]" />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         UPGRADE PRO BANNER (Mockup Page Footer)
         ═══════════════════════════════════════════════════════════════ */}
      <Link
        href="/dashboard"
        className="w-full flex items-center justify-between p-4 rounded-[16px] bg-gradient-to-r from-[#690B1B] to-[#8A1226] text-white shadow-sm hover:opacity-95 transition-all mt-6 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8.5 h-8.5 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Zap size={18} className="text-[#C9A55D] fill-[#C9A55D]" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-[14px] font-bold">Upgrade Pro</div>
            <div className="text-[11px] text-[#F7D8A0] mt-0.5">Get Unlimited AI SOP Reviews</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10.5px] font-bold bg-[#C9A55D] text-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            30% OFF
          </span>
          <ChevronRight size={16} className="text-white/70" />
        </div>
      </Link>
    </div>
  );
}
