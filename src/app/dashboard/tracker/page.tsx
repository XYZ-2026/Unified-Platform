'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
  Trash2
} from 'lucide-react';

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Draft your Common App personal statement',
    category: 'Milestone',
    date: 'Sep 12',
    dueIn: 'in 24 days',
    group: 'NEXT 30 DAYS',
    type: 'task' as const,
    icon: FileText
  },
  {
    id: 'task-2',
    title: 'Ask two teachers for rec letters',
    category: 'Recommender',
    date: 'Sep 20',
    dueIn: 'in 32 days',
    group: 'LATER THIS CYCLE',
    type: 'task' as const,
    icon: Users
  },
  {
    id: 'task-3',
    title: 'FAFSA opens for financial aid',
    category: 'Financial aid',
    date: 'Oct 01',
    dueIn: 'in 43 days',
    group: 'LATER THIS CYCLE',
    type: 'aid' as const,
    icon: DollarSign
  },
  {
    id: 'task-4',
    title: 'CSS Profile portal opens',
    category: 'Financial aid',
    date: 'Oct 01',
    dueIn: 'in 43 days',
    group: 'LATER THIS CYCLE',
    type: 'aid' as const,
    icon: DollarSign
  },
  {
    id: 'task-5',
    title: 'Early Decision / Early Action (ED/EA) Application Deadline',
    category: 'Application',
    date: 'Nov 01',
    dueIn: 'in 2 months',
    group: 'LATER THIS CYCLE',
    type: 'application' as const,
    icon: Building2
  },
  {
    id: 'task-6',
    title: 'CSS Profile due for early schools',
    category: 'Financial aid',
    date: 'Nov 01',
    dueIn: 'in 2 months',
    group: 'LATER THIS CYCLE',
    type: 'aid' as const,
    icon: DollarSign
  },
  {
    id: 'task-7',
    title: 'Regular Decision (RD) Application Deadline',
    category: 'Application',
    date: 'Jan 01',
    dueIn: 'in 4 months',
    group: 'LATER THIS CYCLE',
    type: 'application' as const,
    icon: Building2
  },
  {
    id: 'task-8',
    title: 'FAFSA priority deadline',
    category: 'Financial aid',
    date: 'Jan 05',
    dueIn: 'in 5 months',
    group: 'LATER THIS CYCLE',
    type: 'aid' as const,
    icon: DollarSign
  },
  {
    id: 'task-9',
    title: 'Decision day: commit and deposit',
    category: 'Milestone',
    date: 'May 01',
    dueIn: 'in 9 months',
    group: 'LATER THIS CYCLE',
    type: 'task' as const,
    icon: CheckCircle2
  }
];

export default function ApplicationTrackerPage() {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [activeFilter, setActiveFilter] = useState('all');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineScrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      timelineScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Add Deadline Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Application');
  const [newType, setNewType] = useState<'application' | 'aid' | 'task'>('application');
  const [newDate, setNewDate] = useState('');
  const [newGroup, setNewGroup] = useState<'NEXT 30 DAYS' | 'LATER THIS CYCLE'>('NEXT 30 DAYS');

  // Load saved deadlines from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('unified_app_tracker_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Re-map icon component based on type
          const rehydrated = parsed.map((item: any) => ({
            ...item,
            icon: item.type === 'aid' ? DollarSign : item.type === 'application' ? Building2 : FileText
          }));
          setTasks(rehydrated);
        }
      }
    } catch (e) {
      console.error('Failed to parse saved deadlines:', e);
    }
  }, []);

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    try {
      localStorage.setItem('unified_app_tracker_tasks', JSON.stringify(updated.map(({ icon, ...rest }) => rest)));
    } catch (e) {
      console.error('Failed to save deadlines:', e);
    }
  };

  const handleAddDeadlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let selectedIcon = Building2;
    if (newType === 'aid') {
      selectedIcon = DollarSign;
    } else if (newType === 'task') {
      selectedIcon = FileText;
    }

    const newTaskItem = {
      id: `task-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      date: newDate.trim() || 'Upcoming',
      dueIn: newGroup === 'NEXT 30 DAYS' ? 'Upcoming soon' : 'Later in cycle',
      group: newGroup,
      type: newType,
      icon: selectedIcon
    };

    const updated = [newTaskItem, ...tasks];
    setTasks(updated);
    try {
      localStorage.setItem('unified_app_tracker_tasks', JSON.stringify(updated.map(({ icon, ...rest }) => rest)));
    } catch (err) {
      console.error('Failed to save deadlines:', err);
    }

    // Reset Form & Close Modal
    setNewTitle('');
    setNewDate('');
    setShowAddModal(false);
  };

  const getShortTitle = (title: string): string => {
    const t = title.toLowerCase();
    if (t.includes('common app')) return 'Draft Common App';
    if (t.includes('teacher') || t.includes('rec letter')) return 'Ask teacher recs';
    if (t.includes('fafsa opens')) return 'FAFSA opens';
    if (t.includes('css profile portal')) return 'CSS Profile opens';
    if (t.includes('early decision') || t.includes('ed/ea')) return 'ED / EA Deadline';
    if (t.includes('css profile due')) return 'CSS Profile due';
    if (t.includes('regular decision') || t.includes('rd')) return 'RD Deadline';
    if (t.includes('fafsa priority')) return 'FAFSA priority';
    if (t.includes('decision day') || t.includes('commit')) return 'Commit & Deposit';

    return title.length > 20 ? `${title.slice(0, 18)}...` : title;
  };

  // Collision-free timeline position calculator with above/below staggering
  const getTimelinePlacement = (taskList: typeof tasks) => {
    const monthRanges: Record<string, { start: number; span: number }> = {
      sep: { start: 4, span: 10 },
      oct: { start: 16, span: 11 },
      nov: { start: 29, span: 11 },
      dec: { start: 42, span: 11 },
      jan: { start: 55, span: 11 },
      feb: { start: 67, span: 9 },
      mar: { start: 77, span: 8 },
      apr: { start: 86, span: 6 },
      may: { start: 93, span: 5 }
    };

    const parsed = taskList.map((t, idx) => {
      const str = (t.date || '').toLowerCase();
      let monthKey = 'nov';
      for (const m of Object.keys(monthRanges)) {
        if (str.includes(m)) {
          monthKey = m;
          break;
        }
      }
      const { start, span } = monthRanges[monthKey];
      const dayMatch = str.match(/\d+/);
      const day = dayMatch ? Math.min(Math.max(parseInt(dayMatch[0], 10), 1), 31) : 15;
      const rawPct = start + ((day - 1) / 30) * span;
      return { t, rawPct, originalIdx: idx };
    });

    parsed.sort((a, b) => a.rawPct - b.rawPct);

    const MIN_GAP = 7.5; // percent points minimum gap between adjacent badges
    let lastPct = -999;
    let lastTier: 'above' | 'below' = 'above';

    const placed = parsed.map((item, i) => {
      let pct = item.rawPct;
      let tier: 'above' | 'below' = 'above';

      if (pct - lastPct < MIN_GAP) {
        pct = lastPct + MIN_GAP;
        tier = lastTier === 'above' ? 'below' : 'above';
      } else {
        tier = i % 2 === 0 ? 'above' : 'below';
      }

      lastPct = pct;
      lastTier = tier;

      return {
        ...item.t,
        leftPct: Math.min(Math.max(pct, 4), 95),
        tier
      };
    });

    return placed;
  };

  const [selectedMonth, setSelectedMonth] = useState('Nov');
  const cycleMonths = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'May'];

  const applicationTasks = tasks.filter((t) => t.type === 'application');
  const aidTasks = tasks.filter((t) => t.type === 'aid');
  const genericTasks = tasks.filter((t) => t.type === 'task');

  const placedApplicationTasks = useMemo(() => getTimelinePlacement(applicationTasks), [applicationTasks]);
  const placedAidTasks = useMemo(() => getTimelinePlacement(aidTasks), [aidTasks]);
  const placedGenericTasks = useMemo(() => getTimelinePlacement(genericTasks), [genericTasks]);

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'applications') return t.type === 'application';
    if (activeFilter === 'aid') return t.type === 'aid';
    if (activeFilter === 'tasks') return t.type === 'task';
    return true;
  });

  const next30DaysTasks = filteredTasks.filter((t) => t.group === 'NEXT 30 DAYS');
  const laterCycleTasks = filteredTasks.filter((t) => t.group === 'LATER THIS CYCLE');

  return (
    <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6 relative">
      {/* ═══════════════════════════════════════════════════════════════
         HEADER AREA & ADD DEADLINE BUTTON
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-6 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-4 w-full">
          <h2 className="text-[20px] sm:text-[26px] font-bold text-[#111111] tracking-[-0.03em]">Application Tracker</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="h-[38px] sm:h-[42px] px-3.5 sm:px-5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] sm:text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs shrink-0 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Plus size={15} />
            <span>Add Deadline</span>
          </button>
        </div>
        <p className="text-[12px] sm:text-[13.5px] text-[#777777]">General application cycle · 3 application systems · {tasks.length} key dates tracked</p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         DYNAMIC TIMELINE / CALENDAR CHART CARD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#F0EBE6] pb-4">
          {/* VIEW MODE SWITCH */}
          <div className="flex items-center gap-1 bg-[#F7F5F3] p-1 rounded-full border border-[#E7E2DE] shrink-0">
            <button
              onClick={() => setViewMode('timeline')}
              className={`h-[32px] sm:h-[34px] px-3.5 sm:px-4 rounded-full text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center whitespace-nowrap ${
                viewMode === 'timeline'
                  ? 'bg-white text-[#690B1B] shadow-2xs'
                  : 'text-[#666666] hover:text-[#11]'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`h-[32px] sm:h-[34px] px-3.5 sm:px-4 rounded-full text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center whitespace-nowrap ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#690B1B] shadow-2xs'
                  : 'text-[#666666] hover:text-[#11]'
              }`}
            >
              Calendar
            </button>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 text-[12px] text-[#777777]">
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => scrollTimeline('left')}
                className="w-7 h-7 rounded-full bg-[#F7F5F3] hover:bg-[#E7E2DE] text-[#333] flex items-center justify-center transition-all cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => scrollTimeline('right')}
                className="w-7 h-7 rounded-full bg-[#F7F5F3] hover:bg-[#E7E2DE] text-[#333] flex items-center justify-center transition-all cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <span className="font-semibold text-[11px] sm:text-[12px]">Range: Sep 2026 to May 2027</span>
          </div>
        </div>

        {/* ─── DYNAMIC GRAPH CONTENTS ─── */}
        {viewMode === 'timeline' ? (
          /* VISUAL TIMELINE GRAPH GRAPHIC */
          <div className="relative group">
            {/* Scroll Container */}
            <div
              ref={timelineScrollRef}
              className="p-3 sm:p-4 bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] space-y-6 overflow-x-auto scrollbar-thin scrollbar-thumb-[#690B1B]/20 hover:scrollbar-thumb-[#690B1B]/40 transition-all scroll-smooth"
            >
              {/* TRACK LINES */}
              <div className="space-y-14 min-w-[1450px] pt-8 pb-8">
                {/* TRACK 1: COMMON APP / APPLICATIONS */}
                <div className="flex items-center gap-4">
                  <span className="w-24 text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider shrink-0">Common App</span>
                  <div className="flex-1 h-px bg-[#E7E2DE] relative">
                    {placedApplicationTasks.map((t) => {
                      const isDone = !!completedTasks[t.id];
                      const isAbove = t.tier === 'above';
                      return (
                        <div
                          key={t.id}
                          style={{ left: `${t.leftPct}%` }}
                          className={`absolute ${isAbove ? '-top-7' : 'top-2.5'} -translate-x-1/2 z-10`}
                        >
                          {/* Vertical Connector Tick to Track Line */}
                          <span
                            className={`absolute left-1/2 -translate-x-1/2 w-[1.5px] ${
                              isAbove ? '-bottom-2 h-2 bg-[#690B1B]/25' : '-top-2 h-2 bg-[#690B1B]/25'
                            } pointer-events-none`}
                          />
                          <button
                            onClick={() => toggleTask(t.id)}
                            title={`${t.title} • Date: ${t.date} (${t.dueIn}) - Click to toggle complete`}
                            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer whitespace-nowrap hover:scale-105 ${
                              isDone
                                ? 'bg-[#16a34a]/10 border border-[#16a34a]/40 text-[#16a34a] line-through'
                                : 'bg-[#FDF0F2] border border-[#690B1B]/20 text-[#690B1B]'
                            }`}
                          >
                            {isDone && <CheckCircle2 size={11} />}
                            <span>{getShortTitle(t.title)}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TRACK 2: FINANCIAL AID */}
                <div className="flex items-center gap-4">
                  <span className="w-24 text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider shrink-0">Financial Aid</span>
                  <div className="flex-1 h-px bg-[#E7E2DE] relative">
                    {placedAidTasks.map((t) => {
                      const isDone = !!completedTasks[t.id];
                      const isAbove = t.tier === 'above';
                      return (
                        <div
                          key={t.id}
                          style={{ left: `${t.leftPct}%` }}
                          className={`absolute ${isAbove ? '-top-7' : 'top-2.5'} -translate-x-1/2 z-10`}
                        >
                          {/* Vertical Connector Tick to Track Line */}
                          <span
                            className={`absolute left-1/2 -translate-x-1/2 w-[1.5px] ${
                              isAbove ? '-bottom-2 h-2 bg-[#0088CB]/25' : '-top-2 h-2 bg-[#0088CB]/25'
                            } pointer-events-none`}
                          />
                          <button
                            onClick={() => toggleTask(t.id)}
                            title={`${t.title} • Date: ${t.date} (${t.dueIn}) - Click to toggle complete`}
                            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer whitespace-nowrap hover:scale-105 ${
                              isDone
                                ? 'bg-[#16a34a]/10 border border-[#16a34a]/40 text-[#16a34a] line-through'
                                : 'bg-[#EBF4FB] border border-[#0088CB]/20 text-[#0088CB]'
                            }`}
                          >
                            {isDone && <CheckCircle2 size={11} />}
                            <span>{getShortTitle(t.title)}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TRACK 3: YOU / TASKS */}
                <div className="flex items-center gap-4">
                  <span className="w-24 text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider shrink-0">You</span>
                  <div className="flex-1 h-px bg-[#E7E2DE] relative">
                    {placedGenericTasks.map((t) => {
                      const isDone = !!completedTasks[t.id];
                      const isAbove = t.tier === 'above';
                      return (
                        <div
                          key={t.id}
                          style={{ left: `${t.leftPct}%` }}
                          className={`absolute ${isAbove ? '-top-7' : 'top-2.5'} -translate-x-1/2 z-10`}
                        >
                          {/* Vertical Connector Tick to Track Line */}
                          <span
                            className={`absolute left-1/2 -translate-x-1/2 w-[1.5px] ${
                              isAbove ? '-bottom-2 h-2 bg-[#16a34a]/25' : '-top-2 h-2 bg-[#16a34a]/25'
                            } pointer-events-none`}
                          />
                          <button
                            onClick={() => toggleTask(t.id)}
                            title={`${t.title} • Date: ${t.date} (${t.dueIn}) - Click to toggle complete`}
                            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer whitespace-nowrap hover:scale-105 ${
                              isDone
                                ? 'bg-[#16a34a]/10 border border-[#16a34a]/40 text-[#16a34a] line-through'
                                : 'bg-[#EBF7EE] border border-[#16a34a]/20 text-[#16a34a]'
                            }`}
                          >
                            {isDone && <CheckCircle2 size={11} />}
                            <span>{getShortTitle(t.title)}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* DATES FOOTER MARKS */}
              <div className="flex justify-between text-[10.5px] font-semibold text-[#888888] pt-2 border-t border-[#F0EBE6] min-w-[1450px]">
                <span>Sep 01</span>
                <span>Sep 15</span>
                <span>Oct 01</span>
                <span>Oct 15</span>
                <span>Nov 01</span>
                <span>Nov 15</span>
                <span>Dec 01</span>
                <span>Dec 15</span>
                <span>Jan 01</span>
                <span>Jan 15</span>
                <span>Feb 01</span>
                <span>Mar 01</span>
                <span>Apr 01</span>
                <span>May 01</span>
              </div>
            </div>
          </div>
        ) : (
          /* INTERACTIVE CALENDAR GRID VIEW */
          <div className="space-y-4">
            {/* MONTH TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {cycleMonths.map((m) => {
                const monthCount = tasks.filter((t) => t.date.toLowerCase().includes(m.toLowerCase())).length;
                return (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(m)}
                    className={`px-4 py-2 rounded-[12px] text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                      selectedMonth === m
                        ? 'bg-[#690B1B] text-white shadow-xs'
                        : 'bg-[#F7F5F3] text-[#666666] hover:bg-[#E7E2DE]'
                    }`}
                  >
                    <span>{m} 2026/27</span>
                    {monthCount > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        selectedMonth === m ? 'bg-white/20 text-white' : 'bg-[#690B1B]/10 text-[#690B1B]'
                      }`}>
                        {monthCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* MONTHLY CALENDAR GRID & TASK DIGEST */}
            <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-3">
                <h4 className="text-[15px] font-bold text-[#111111]">
                  Deadlines &amp; Milestones scheduled for {selectedMonth}
                </h4>
                <span className="text-[12px] text-[#777777]">
                  {tasks.filter((t) => t.date.toLowerCase().includes(selectedMonth.toLowerCase())).length} active deadlines
                </span>
              </div>

              {tasks.filter((t) => t.date.toLowerCase().includes(selectedMonth.toLowerCase())).length === 0 ? (
                <div className="text-center py-8 text-[#888888] text-[13px]">
                  No specific deadlines scheduled in {selectedMonth}. Click "+ Add Deadline" to schedule one!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tasks
                    .filter((t) => t.date.toLowerCase().includes(selectedMonth.toLowerCase()))
                    .map((t) => {
                      const isDone = !!completedTasks[t.id];
                      return (
                        <div
                          key={t.id}
                          onClick={() => toggleTask(t.id)}
                          className={`p-3.5 rounded-[14px] border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                            isDone
                              ? 'bg-[#16a34a]/5 border-[#16a34a]/30'
                              : t.type === 'aid'
                              ? 'bg-[#EBF4FB]/60 border-[#0088CB]/25 hover:border-[#0088CB]'
                              : t.type === 'application'
                              ? 'bg-[#FDF0F2]/60 border-[#690B1B]/25 hover:border-[#690B1B]'
                              : 'bg-white border-[#E7E2DE] hover:border-[#16a34a]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-black/10 text-[#333]">
                              {t.date}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              t.type === 'aid' ? 'bg-[#0088CB]/10 text-[#0088CB]' : t.type === 'application' ? 'bg-[#690B1B]/10 text-[#690B1B]' : 'bg-[#16a34a]/10 text-[#16a34a]'
                            }`}>
                              {t.category}
                            </span>
                          </div>
                          <div className={`text-[13.5px] font-bold leading-snug ${isDone ? 'line-through text-[#888888]' : 'text-[#111111]'}`}>
                            {t.title}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#777777] pt-1">
                            <span>{t.dueIn}</span>
                            <span className="font-semibold text-[#690B1B]">
                              {isDone ? '✓ Completed' : 'Mark complete'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}
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
              { id: 'all', label: `All ${tasks.length}` },
              { id: 'applications', label: `Applications ${tasks.filter(t => t.type === 'application').length}` },
              { id: 'aid', label: `Aid ${tasks.filter(t => t.type === 'aid').length}` },
              { id: 'tasks', label: `Tasks ${tasks.filter(t => t.type === 'task').length}` },
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
          {next30DaysTasks.length > 0 && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-md w-fit uppercase tracking-wider">
                NEXT 30 DAYS ({next30DaysTasks.length})
              </div>
              {next30DaysTasks.map((t) => {
                const IconComponent = t.icon;
                const isDone = !!completedTasks[t.id];
                return (
                  <div
                    key={t.id}
                    className="group p-3.5 sm:p-4 rounded-[14px] bg-white border border-[#E7E2DE] hover:border-[#690B1B]/30 hover:shadow-2xs transition-all cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-2.5 sm:gap-3">
                      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(t.id);
                          }}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 cursor-pointer ${
                            isDone ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'border-[#CCCCCC] bg-white'
                          }`}
                        >
                          {isDone && <CheckCircle2 size={13} className="sm:w-4 sm:h-4" />}
                        </button>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F7F0F1] text-[#690B1B] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                          <IconComponent size={15} className="sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-[13.5px] sm:text-[15px] font-bold leading-snug break-words ${isDone ? 'line-through text-[#888888]' : 'text-[#111111]'}`}>
                            {t.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[11px] text-[#777777]">
                              {t.category} • {t.date}
                            </span>
                            {/* Mobile Due Badge */}
                            <span className="sm:hidden text-[10px] font-bold text-[#690B1B] bg-[#F7F0F1] px-2 py-0.5 rounded-full shrink-0">
                              {t.dueIn}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Action Badges */}
                      <div className="hidden sm:flex items-center gap-2.5 shrink-0">
                        <span className="text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-2.5 py-1 rounded-full whitespace-nowrap">
                          {t.dueIn}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(t.id);
                          }}
                          title="Delete Deadline"
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#999999] hover:text-[#dc2626] transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                        <ChevronRight size={16} className="text-[#CCCCCC]" />
                      </div>

                      {/* Mobile Delete Button */}
                      <div className="sm:hidden flex items-center gap-1 shrink-0 mt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(t.id);
                          }}
                          title="Delete Deadline"
                          className="p-1 text-[#aaaaaa] hover:text-[#dc2626] transition-all cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* GROUP: LATER THIS CYCLE */}
          {laterCycleTasks.length > 0 && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-[#555555] bg-[#F7F5F3] px-3 py-1 rounded-md w-fit uppercase tracking-wider">
                LATER THIS CYCLE ({laterCycleTasks.length})
              </div>
              {laterCycleTasks.map((t) => {
                const IconComponent = t.icon;
                const isDone = !!completedTasks[t.id];
                return (
                  <div
                    key={t.id}
                    className="group p-3.5 sm:p-4 rounded-[14px] bg-white border border-[#E7E2DE] hover:border-[#690B1B]/30 hover:shadow-2xs transition-all cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-2.5 sm:gap-3">
                      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(t.id);
                          }}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 cursor-pointer ${
                            isDone ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'border-[#CCCCCC] bg-white'
                          }`}
                        >
                          {isDone && <CheckCircle2 size={13} className="sm:w-4 sm:h-4" />}
                        </button>
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                          t.type === 'aid'
                            ? 'bg-[#EBF4FB] text-[#0088CB]'
                            : t.type === 'application'
                            ? 'bg-[#F7F5F3] text-[#555555]'
                            : 'bg-[#F7F5F3] text-[#555555]'
                        }`}>
                          <IconComponent size={15} className="sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-[13.5px] sm:text-[15px] font-bold leading-snug break-words ${isDone ? 'line-through text-[#888888]' : 'text-[#111111]'}`}>
                            {t.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[11px] text-[#777777]">
                              {t.category} • {t.date}
                            </span>
                            {/* Mobile Due Badge */}
                            <span className="sm:hidden text-[10px] font-bold text-[#777777] bg-[#F7F5F3] px-2 py-0.5 rounded-full shrink-0">
                              {t.dueIn}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Action Badges */}
                      <div className="hidden sm:flex items-center gap-2.5 shrink-0">
                        <span className="text-[11px] font-bold text-[#777777] bg-[#F7F5F3] px-2.5 py-1 rounded-full whitespace-nowrap">
                          {t.dueIn}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(t.id);
                          }}
                          title="Delete Deadline"
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#999999] hover:text-[#dc2626] transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                        <ChevronRight size={16} className="text-[#CCCCCC]" />
                      </div>

                      {/* Mobile Delete Button */}
                      <div className="sm:hidden flex items-center gap-1 shrink-0 mt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(t.id);
                          }}
                          title="Delete Deadline"
                          className="p-1 text-[#aaaaaa] hover:text-[#dc2626] transition-all cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         ADD DEADLINE MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] shadow-2xl max-w-md w-full p-6 space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-4">
              <div>
                <h3 className="text-[19px] font-bold text-[#111111]">Add New Deadline</h3>
                <p className="text-[12px] text-[#777777]">Add custom milestones to your application tracker</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#F7F5F3] text-[#777777] hover:text-[#111111] flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddDeadlineSubmit} className="space-y-4">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-[#333333]">Deadline Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Submit Supplement Essay, IELTS Scores..."
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#E7E2DE] bg-[#FDFCFB] text-[13.5px] text-[#111111] focus:outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              {/* Type / Category Pills */}
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-[#333333]">Category Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'application', label: 'Application', cat: 'Application' },
                    { type: 'aid', label: 'Financial Aid', cat: 'Financial aid' },
                    { type: 'task', label: 'Task / Recs', cat: 'Milestone' }
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setNewType(item.type as any);
                        setNewCategory(item.cat);
                      }}
                      className={`py-2 px-2 rounded-[10px] text-[11.5px] font-bold transition-all border text-center cursor-pointer ${
                        newType === item.type
                          ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-2xs'
                          : 'bg-[#F7F5F3] text-[#555] border-[#E7E2DE] hover:bg-[#E7E2DE]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-[#333333]">Target Date</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. Oct 15 or Nov 01"
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#E7E2DE] bg-[#FDFCFB] text-[13.5px] text-[#111111] focus:outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              {/* Group Horizon */}
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-[#333333]">Timeline Horizon</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { group: 'NEXT 30 DAYS', label: 'Next 30 Days' },
                    { group: 'LATER THIS CYCLE', label: 'Later This Cycle' }
                  ].map((g) => (
                    <button
                      key={g.group}
                      type="button"
                      onClick={() => setNewGroup(g.group as any)}
                      className={`py-2 px-2 rounded-[10px] text-[11.5px] font-bold transition-all border text-center cursor-pointer ${
                        newGroup === g.group
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-[#F7F5F3] text-[#555] border-[#E7E2DE] hover:bg-[#E7E2DE]'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F0EBE6]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#666666] hover:bg-[#F7F5F3] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all shadow-xs cursor-pointer"
                >
                  Add Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

