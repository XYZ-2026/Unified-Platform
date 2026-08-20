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
  ChevronDown
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
      title: 'University of Pennsylvania · Early Decision Deadline',
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
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-bold text-[#111111] tracking-[-0.03em]">Application Tracker</h2>
          <p className="text-[13px] text-[#777777]">1 school · 3 application systems · 10 key dates tracked</p>
        </div>
        <button className="px-5 py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-2 shadow-xs">
          <Plus size={16} />
          <span>Add Deadline</span>
        </button>
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
                  : 'text-[#666666] hover:text-[#111]'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#690B1B] shadow-2xs'
                  : 'text-[#666666] hover:text-[#111]'
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
        <div className="p-4 bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] space-y-6 overflow-x-auto">
          {/* TRACK LINES */}
          <div className="space-y-6 min-w-[600px]">
            <div className="flex items-center gap-4">
              <span className="w-28 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">Common App</span>
              <div className="flex-1 h-px bg-[#E7E2DE] relative">
                <div className="absolute left-[30%] -top-3 px-2 py-1 bg-white border border-[#E7E2DE] rounded-full text-[11px] font-bold text-[#690B1B] shadow-2xs">
                  Draft Common App...
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-28 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">Financial Aid</span>
              <div className="flex-1 h-px bg-[#E7E2DE] relative">
                <div className="absolute left-[55%] -top-3 px-2 py-1 bg-white border border-[#E7E2DE] rounded-full text-[11px] font-bold text-[#0088CB] shadow-2xs">
                  2 aid dates ($)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-28 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">You</span>
              <div className="flex-1 h-px bg-[#E7E2DE] relative">
                <div className="absolute left-[45%] -top-3 px-2 py-1 bg-white border border-[#E7E2DE] rounded-full text-[11px] font-bold text-[#16a34a] shadow-2xs">
                  Ask teacher recs
                </div>
              </div>
            </div>
          </div>

          {/* DATES FOOTER */}
          <div className="flex justify-between text-[11px] text-[#888888] pt-2 border-t border-[#F0EBE6] min-w-[600px]">
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0EBE6] pb-4">
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
                className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${
                  activeFilter === f.id
                    ? 'bg-[#690B1B] text-white'
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
                    className="flex items-center justify-between p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] hover:border-[#690B1B]/30 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() => toggleTask(t.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                          isDone ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isDone && <CheckCircle2 size={16} />}
                      </button>
                      <div className="w-8 h-8 rounded-lg bg-[#F7F0F1] text-[#690B1B] flex items-center justify-center">
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <div className={`text-[15px] font-bold ${isDone ? 'line-through text-[#888888]' : 'text-[#111111]'}`}>
                          {t.title}
                        </div>
                        <div className="text-[12px] text-[#777777]">
                          {t.category} • {t.date}
                        </div>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-full">
                      {t.dueIn}
                    </span>
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
                    className="flex items-center justify-between p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] hover:border-[#690B1B]/30 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() => toggleTask(t.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                          isDone ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isDone && <CheckCircle2 size={16} />}
                      </button>
                      <div className="w-8 h-8 rounded-lg bg-[#F7F5F3] text-[#555555] flex items-center justify-center">
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <div className={`text-[15px] font-bold ${isDone ? 'line-through text-[#888888]' : 'text-[#111111]'}`}>
                          {t.title}
                        </div>
                        <div className="text-[12px] text-[#777777]">
                          {t.category} • {t.date}
                        </div>
                      </div>
                    </div>
                    <span className="text-[12px] font-medium text-[#777777]">
                      {t.dueIn}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
