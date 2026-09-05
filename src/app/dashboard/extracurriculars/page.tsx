'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getCachedUserDetails,
  setCachedUserDetails,
  subscribeToUserDetails
} from '@/lib/userDetailsCache';
import {
  Activity,
  Plus,
  Sparkles,
  CheckCircle2,
  Zap,
  MessageSquare,
  BookOpen,
  Award,
  Trash2,
  Edit2,
  Save,
  Check,
  Clock,
  Calendar,
  X,
  ChevronDown,
  Code,
  HeartHandshake,
  FlaskConical,
  Trophy,
  Palette,
  Briefcase,
  Tag,
  AlertTriangle,
  RotateCw,
  Copy,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ExtracurricularActivity {
  id: string;
  title: string;
  organization: string;
  category: string;
  hoursPerWeek: string;
  duration?: string;
  description: string;
}

interface ActivityAnalysisResult {
  overallScore: number;
  tier: string;
  tierRank: number;
  spikeRating: string;
  summary: string;
  breakdown: {
    leadershipScore: number;
    impactScore: number;
    commitmentScore: number;
    uniquenessScore: number;
  };
  strengths: string[];
  gaps: string[];
  activityFeedback: {
    activityId: string;
    title: string;
    rating: string;
    critique: string;
    suggestedRewrite: string;
    actionableAdvice: string;
  }[];
  admissionsVerdict: string;
}

const CATEGORY_OPTIONS = [
  { id: 'Computer Science / STEM', label: 'Computer Science / STEM', icon: Code, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { id: 'Leadership / Academic', label: 'Leadership / Academic', icon: Award, color: 'text-amber-800 bg-amber-50 border-amber-200' },
  { id: 'Community Service / Volunteering', label: 'Community Service / Volunteering', icon: HeartHandshake, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'Research / Publications', label: 'Research / Publications', icon: FlaskConical, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { id: 'Athletics / Sports', label: 'Athletics / Sports', icon: Trophy, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  { id: 'Arts / Music / Theater', label: 'Arts / Music / Theater', icon: Palette, color: 'text-pink-700 bg-pink-50 border-pink-200' },
  { id: 'Internship / Work Experience', label: 'Internship / Work Experience', icon: Briefcase, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { id: 'Speech & Debate / Model UN', label: 'Speech & Debate / Model UN', icon: MessageSquare, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { id: 'Other', label: 'Other', icon: Tag, color: 'text-stone-700 bg-stone-50 border-stone-200' },
];

export default function ExtracurricularsPage() {
  const { user, userData } = useAuth();
  const [rightTab, setRightTab] = useState<'analyse' | 'chat' | 'examples'>('analyse');
  
  const [activities, setActivities] = useState<ExtracurricularActivity[]>([
    {
      id: 'act-1',
      title: 'Founder & Lead Developer',
      organization: 'TechForGood Student Non-Profit',
      category: 'Computer Science / STEM',
      hoursPerWeek: '8 hrs/wk',
      duration: '40 wks/yr',
      description: 'Built an open-source web platform helping local food banks manage volunteer scheduling. Scaled to 3,000+ monthly active users.'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science / STEM');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [newHours, setNewHours] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [savingCms, setSavingCms] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<ActivityAnalysisResult | null>(null);
  const [analysisProvider, setAnalysisProvider] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Instant cache retrieval on mount
  useEffect(() => {
    const userKey = user?.uid || user?.email || userData?.email || 'default';
    const cached = getCachedUserDetails(userKey);
    if (cached && cached.extracurriculars) {
      let list = cached.extracurriculars;
      if (typeof list === 'string') {
        try {
          list = JSON.parse(list);
        } catch (e) {
          list = null;
        }
      }
      if (Array.isArray(list) && list.length > 0) {
        setActivities(list);
      }
    }

    const unsubscribe = subscribeToUserDetails((updated) => {
      if (updated && updated.extracurriculars) {
        let list = updated.extracurriculars;
        if (typeof list === 'string') {
          try {
            list = JSON.parse(list);
          } catch (e) {}
        }
        if (Array.isArray(list)) {
          setActivities(list);
        }
      }
    });

    return () => unsubscribe();
  }, [user, userData]);

  // 2. Fetch extracurriculars from Wix CMS user-details collection in background
  useEffect(() => {
    async function loadExtracurriculars() {
      try {
        const email = user?.email || userData?.email || '';
        const uid = user?.uid || '';
        if (!email && !uid) return;

        const userKey = uid || email;
        const res = await fetch(`/api/wix/user-details?userId=${uid}&userEmail=${encodeURIComponent(email)}`);
        const json = await res.json();

        if (json.success && json.data && json.data.extracurriculars) {
          let list = json.data.extracurriculars;
          if (typeof list === 'string') {
            try {
              list = JSON.parse(list);
            } catch (e) {
              list = null;
            }
          }
          if (Array.isArray(list) && list.length > 0) {
            setActivities(list);
            setCachedUserDetails(userKey, { extracurriculars: list });
          }
        }
      } catch (err) {
        console.warn('Error fetching extracurriculars from Wix CMS:', err);
      }
    }

    if (user || userData) {
      loadExtracurriculars();
    }
  }, [user, userData]);

  // 3. Sync extracurriculars state to Wix CMS user-details collection & local cache
  const syncToWixCms = async (updatedActivities: ExtracurricularActivity[]) => {
    setSavingCms(true);
    setSaveStatus(false);
    const email = user?.email || userData?.email || '';
    const uid = user?.uid || 'guest-user';
    const userKey = user?.uid || user?.email || userData?.email || 'default';

    // Instant local cache update
    setCachedUserDetails(userKey, { extracurriculars: updatedActivities });

    try {
      await fetch('/api/wix/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: uid,
          userEmail: email,
          extracurriculars: updatedActivities
        })
      });

      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 3000);
    } catch (err) {
      console.error('Error syncing extracurriculars to Wix CMS:', err);
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 3000);
    } finally {
      setSavingCms(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewTitle('');
    setNewOrg('');
    setNewCategory('Computer Science / STEM');
    setIsCategoryOpen(false);
    setNewHours('');
    setNewDuration('');
    setNewDesc('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (act: ExtracurricularActivity) => {
    setEditingId(act.id);
    setNewTitle(act.title || '');
    setNewOrg(act.organization || '');
    setNewCategory(act.category || 'Leadership / Academic');
    setIsCategoryOpen(false);
    
    if (act.duration) {
      setNewHours(act.hoursPerWeek || '');
      setNewDuration(act.duration || '');
    } else if (act.hoursPerWeek && act.hoursPerWeek.includes('•')) {
      const parts = act.hoursPerWeek.split('•').map((p) => p.trim());
      setNewHours(parts[0] || '');
      setNewDuration(parts[1] || '');
    } else {
      setNewHours(act.hoursPerWeek || '');
      setNewDuration(act.duration || '');
    }
    
    setNewDesc(act.description || '');
    setShowAddModal(true);
  };

  const handleSaveActivity = () => {
    if (!newTitle.trim()) return;

    let formattedHours = newHours.trim();
    if (formattedHours && !isNaN(Number(formattedHours))) {
      formattedHours = `${formattedHours} hrs/wk`;
    }

    let formattedDuration = newDuration.trim();
    if (formattedDuration && !isNaN(Number(formattedDuration))) {
      formattedDuration = `${formattedDuration} wks/yr`;
    }

    const timingCombined = [formattedHours, formattedDuration].filter(Boolean).join(' • ') || '5 hrs/wk • 30 wks/yr';

    if (editingId) {
      const updated = activities.map((act) => {
        if (act.id === editingId) {
          return {
            ...act,
            title: newTitle.trim(),
            organization: newOrg.trim() || 'Independent Initiative',
            category: newCategory.trim() || 'Leadership / Academic',
            hoursPerWeek: formattedHours || timingCombined,
            duration: formattedDuration,
            description: newDesc.trim() || 'Organized initiatives and contributed to project development.'
          };
        }
        return act;
      });
      setActivities(updated);
      syncToWixCms(updated);
    } else {
      const newAct: ExtracurricularActivity = {
        id: `act-${Date.now()}`,
        title: newTitle.trim(),
        organization: newOrg.trim() || 'Independent Initiative',
        category: newCategory.trim() || 'Leadership / Academic',
        hoursPerWeek: formattedHours || timingCombined,
        duration: formattedDuration,
        description: newDesc.trim() || 'Organized initiatives and contributed to project development.'
      };

      const updated = [...activities, newAct];
      setActivities(updated);
      syncToWixCms(updated);
    }

    resetForm();
    setShowAddModal(false);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((a) => a.id !== id);
    setActivities(updated);
    syncToWixCms(updated);
  };

  const getTimingDisplay = (act: ExtracurricularActivity) => {
    if (act.duration && act.hoursPerWeek && !act.hoursPerWeek.includes('•') && !act.hoursPerWeek.includes(act.duration)) {
      return `${act.hoursPerWeek} • ${act.duration}`;
    }
    return act.hoursPerWeek || (act.duration ? act.duration : '5 hrs/wk • 30 wks/yr');
  };

  // Trigger Admissions Officer Analysis (Groq -> Gemini -> OpenRouter)
  const handleAnalyzeActivities = async () => {
    if (activities.length === 0) return;
    setIsAnalyzing(true);
    setRightTab('analyse');

    const userKey = user?.uid || user?.email || userData?.email || 'default';
    const profile = getCachedUserDetails(userKey);

    try {
      const res = await fetch('/api/extracurriculars/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities,
          targetMajor: profile?.targetMajor || 'Computer Science',
          dreamSchool: profile?.dreamSchool || 'Stanford / Ivy League'
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisData(json.data);
        setAnalysisProvider(json.provider || 'AI Admissions Engine');
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyRewrite = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const selectedCategoryObj = CATEGORY_OPTIONS.find((c) => c.id === newCategory) || CATEGORY_OPTIONS[0];

  return (
    <div className="p-4 sm:p-5 md:p-8 flex-1 flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full font-[Poppins]">
      {/* ═══════════════════════════════════════════════════════════════
         LEFT MAIN SECTION — Extracurricular Activity Slots
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 space-y-6">
        {/* HEADER */}
        <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[26px] font-bold text-[#111111] tracking-[-0.03em]">Extracurriculars</h2>
              {saveStatus && (
                <span className="text-[11px] font-bold bg-[#16a34a]/10 text-[#16a34a] px-3 py-1 rounded-full flex items-center gap-1">
                  <Check size={13} />
                  <span>Profile Synced</span>
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#777777]">
              {activities.length} of 10 Common App slots filled • ordered by significance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => syncToWixCms(activities)}
              disabled={savingCms}
              className="px-4 py-2.5 rounded-full border border-[#E7E2DE] text-[#555] text-[13px] font-bold hover:bg-[#F7F5F3] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save size={15} />
              <span>{savingCms ? 'Saving...' : 'Save & Sync'}</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Activity</span>
            </button>
          </div>
        </div>

        {/* ACTIVITIES LIST OR EMPTY STATE */}
        {activities.length === 0 ? (
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-12 text-center shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F7F0F1] text-[#690B1B] mx-auto flex items-center justify-center">
              <Activity size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-[18px] font-bold text-[#111]">No activities added yet</h3>
              <p className="text-[14px] text-[#777] max-w-[420px] mx-auto">
                Add what you actually do. AI Advisor will tell you how each entry reads to an admissions officer.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="px-6 py-3 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[14px] font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus size={16} />
              <span>Add Activity</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((act, index) => {
              const catObj = CATEGORY_OPTIONS.find((c) => c.id === act.category);
              const CatIcon = catObj?.icon || Tag;

              return (
                <div
                  key={act.id}
                  className="bg-white border border-[#E7E2DE] rounded-[18px] sm:rounded-[20px] p-4 sm:p-6 shadow-xs hover:border-[#690B1B]/40 transition-all group"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Activity Slot Index Badge */}
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F7F0F1] text-[#690B1B] font-bold text-[12px] sm:text-[13px] flex items-center justify-center shrink-0 aspect-square mt-0.5 shadow-2xs">
                      #{index + 1}
                    </span>

                    {/* Main Activity Content Area */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[16px] sm:text-[17px] font-bold text-[#111] leading-snug break-words">
                            {act.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            <span className="text-[12.5px] sm:text-[13px] text-[#690B1B] font-semibold">
                              {act.organization}
                            </span>
                            {act.category && (
                              <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#555] bg-[#F7F5F3] px-2.5 py-0.5 rounded-full border border-[#EAE6E2] flex items-center gap-1.5 shrink-0">
                                <CatIcon size={11} className="text-[#690B1B]" />
                                <span>{act.category}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Timing and Actions */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0 pt-0.5">
                          <span className="text-[11px] font-bold text-[#666] bg-[#F7F5F3] px-2.5 sm:px-3 py-1 rounded-full border border-[#E7E2DE] flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                            <Clock size={12} className="text-[#690B1B]" />
                            <span>{getTimingDisplay(act)}</span>
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditModal(act)}
                              className="p-1.5 rounded-full text-[#888] hover:text-[#690B1B] hover:bg-[#F7F0F1] transition-all cursor-pointer"
                              title="Edit activity"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              className="p-1.5 rounded-full text-[#888] hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title="Delete activity"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Description - Perfectly Aligned */}
                      <p className="text-[13px] sm:text-[14px] text-[#555] leading-relaxed pt-1">
                        {act.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL: ADD / EDIT ACTIVITY */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE6]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F7F0F1] text-[#690B1B] flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#111]">
                    {editingId ? 'Edit Activity' : 'Add New Activity'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-1.5 rounded-full text-[#888] hover:text-[#111] hover:bg-[#F7F5F3] transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-[12px] font-bold text-[#555] block mb-1">
                    Position / Role Title <span className="text-[#690B1B]">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Founder & Lead Developer, Team Captain, President"
                    className="w-full h-[44px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] font-medium outline-none focus:border-[#690B1B] transition-all"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-[#555] block mb-1">Organization / Program Name</label>
                  <input
                    type="text"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="e.g. TechForGood Student Non-Profit, Robotics Club"
                    className="w-full h-[44px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] font-medium outline-none focus:border-[#690B1B] transition-all"
                  />
                </div>

                {/* ═══════════════════════════════════════════════════════════
                   VISUALLY APPEALING CUSTOM CATEGORY DROPDOWN
                   ═══════════════════════════════════════════════════════════ */}
                <div className="relative" ref={categoryDropdownRef}>
                  <label className="text-[12px] font-bold text-[#555] block mb-1">Activity Category</label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] font-semibold flex items-center justify-between hover:border-[#690B1B]/60 focus:border-[#690B1B] transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${selectedCategoryObj.color}`}>
                        <selectedCategoryObj.icon size={13} />
                      </div>
                      <span>{selectedCategoryObj.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-[#777] transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-[#690B1B]' : ''}`}
                    />
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white/95 backdrop-blur-md border border-[#E7E2DE] rounded-[16px] p-1.5 shadow-2xl space-y-1 max-h-[240px] overflow-y-auto">
                      {CATEGORY_OPTIONS.map((cat) => {
                        const isSelected = newCategory === cat.id;
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setNewCategory(cat.id);
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 rounded-[10px] text-[13px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#F7F0F1] text-[#690B1B] font-bold shadow-2xs'
                                : 'text-[#333] hover:bg-[#F7F5F3]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${cat.color}`}>
                                <Icon size={13} />
                              </div>
                              <span>{cat.label}</span>
                            </div>
                            {isSelected && (
                              <Check size={15} className="text-[#690B1B]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2-COLUMN: HOURS PER WEEK & DURATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-bold text-[#555] block mb-1 flex items-center gap-1">
                      <Clock size={13} className="text-[#690B1B]" />
                      <span>Hours Per Week</span>
                    </label>
                    <input
                      type="text"
                      value={newHours}
                      onChange={(e) => setNewHours(e.target.value)}
                      placeholder="e.g. 8 hrs/wk (or 8)"
                      className="w-full h-[44px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] font-medium outline-none focus:border-[#690B1B]"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-bold text-[#555] block mb-1 flex items-center gap-1">
                      <Calendar size={13} className="text-[#690B1B]" />
                      <span>Duration / Timeframe</span>
                    </label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="e.g. 40 wks/yr, 2 yrs, Grades 10–12"
                      className="w-full h-[44px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] font-medium outline-none focus:border-[#690B1B]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[12px] font-bold text-[#555]">Description (Common App 150 chars)</label>
                    <span className={`text-[11px] font-semibold ${newDesc.length > 150 ? 'text-[#690B1B]' : 'text-[#888]'}`}>
                      {newDesc.length} / 150 chars
                    </span>
                  </div>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe your role, responsibilities, leadership impact, and specific measurable outcomes..."
                    rows={3}
                    className="w-full p-3 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] font-medium outline-none focus:border-[#690B1B]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EBE6]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-full text-[13px] font-bold text-[#666] hover:bg-[#F7F5F3] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveActivity}
                  disabled={!newTitle.trim()}
                  className="px-5 py-2.5 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Save size={15} />
                  <span>{editingId ? 'Update Activity' : 'Save Activity & Sync'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         RIGHT SIDE PANEL — Analysis, Chat & Exemplars Tabs
         ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full xl:w-[460px] bg-white border border-[#E7E2DE] rounded-[24px] p-4 sm:p-6 shadow-xs flex flex-col justify-between h-auto xl:h-[calc(100vh-120px)] xl:sticky top-[96px] overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden">
          {/* TABS HEADER */}
          <div className="flex items-center gap-1 bg-[#F7F5F3] p-1 rounded-full border border-[#E7E2DE] mb-5 shrink-0">
            {(['analyse', 'chat', 'examples'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`flex-1 py-2 rounded-full text-[12px] font-bold capitalize transition-all cursor-pointer ${
                  rightTab === tab
                    ? 'bg-white text-[#690B1B] shadow-2xs'
                    : 'text-[#666] hover:text-[#111]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: ANALYSE */}
          {rightTab === 'analyse' && (
            <div className="flex-1 overflow-y-auto pr-1 space-y-5">
              {!analysisData && !isAnalyzing && (
                <div className="space-y-6 text-center pt-2">
                  <div className="w-16 h-16 rounded-full bg-[#FFF8EB] border border-[#F4D080] text-[#9E731A] mx-auto flex items-center justify-center shadow-xs">
                    <Sparkles size={28} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[19px] font-bold text-[#111]">Admissions Officer Analysis</h3>
                    <p className="text-[13px] text-[#777] max-w-[340px] mx-auto leading-relaxed">
                      AI reads your entire activity list at once, exactly the way an elite admissions committee member does. Evaluated with institutional-grade intelligence.
                    </p>
                  </div>

                  <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-4 text-left space-y-3">
                    {[
                      "0 - 100 evaluation read of the list as a cohesive set",
                      "Evaluates Common App Tier & Intellectual Spike",
                      "Suggests powerful rewrites using high-impact action verbs",
                      "Flags missing awards, depth gaps, and hour densities"
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-[12px] text-[#444]">
                        <CheckCircle2 size={15} className="text-[#16a34a] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAnalyzeActivities}
                    disabled={activities.length === 0}
                    className="w-full py-3.5 px-4 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <span>Analyse Activity List</span>
                    <span className="bg-[#C9A55D] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      ⚡ 7
                    </span>
                  </button>
                </div>
              )}

              {/* LOADING STATE */}
              {isAnalyzing && (
                <div className="py-16 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#F7F0F1] border-2 border-[#690B1B]/20 text-[#690B1B] mx-auto flex items-center justify-center animate-spin">
                    <RotateCw size={28} />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[17px] font-bold text-[#111]">Evaluating Activity Portfolio...</h4>
                    <p className="text-[12px] text-[#777] max-w-[280px] mx-auto">
                      Evaluating holistic profile, leadership impact, and category spikes across admissions benchmarks...
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-full w-fit mx-auto">
                    <Zap size={12} />
                    <span>Benchmarking Top 20 Admit Patterns...</span>
                  </div>
                </div>
              )}

              {/* RESULTS VIEW */}
              {analysisData && !isAnalyzing && (
                <div className="space-y-5 pb-4">
                  {/* SCORE HERO CARD */}
                  <div className="bg-gradient-to-br from-[#690B1B] to-[#480611] rounded-[20px] p-5 text-white shadow-md space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#C9A55D] uppercase tracking-wider block mb-1">
                          PORTFOLIO RATING
                        </span>
                        <h4 className="text-[18px] font-bold leading-tight">{analysisData.tier}</h4>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center">
                        <span className="text-[20px] font-black text-[#C9A55D]">{analysisData.overallScore}</span>
                        <span className="text-[9px] font-bold text-white/70">/ 100</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-white/15 text-[11px]">
                      <span className="bg-white/15 px-2.5 py-1 rounded-full font-semibold">
                        🎯 {analysisData.spikeRating}
                      </span>
                      {analysisProvider && (
                        <span className="bg-[#C9A55D]/20 text-[#FFDF88] border border-[#C9A55D]/40 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                          <Zap size={11} />
                          <span>{analysisProvider}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* SUMMARY & VERDICT */}
                  <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-4 space-y-2">
                    <span className="text-[11px] font-bold text-[#690B1B] uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck size={13} />
                      <span>Admissions Committee Summary</span>
                    </span>
                    <p className="text-[13px] text-[#444] leading-relaxed">
                      {analysisData.summary}
                    </p>
                  </div>

                  {/* RUBRIC BREAKDOWN */}
                  <div className="bg-[#F7F5F3] border border-[#E7E2DE] rounded-[16px] p-4 space-y-3">
                    <span className="text-[11px] font-bold text-[#555] uppercase tracking-wider">
                      Rubric Breakdown
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Leadership', score: analysisData.breakdown.leadershipScore },
                        { label: 'Impact / Reach', score: analysisData.breakdown.impactScore },
                        { label: 'Commitment', score: analysisData.breakdown.commitmentScore },
                        { label: 'Uniqueness', score: analysisData.breakdown.uniquenessScore }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-[12px] border border-[#EAE6E2] space-y-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-[#666]">{item.label}</span>
                            <span className="text-[#690B1B]">{item.score}%</span>
                          </div>
                          <div className="w-full bg-[#EAE6E2] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#690B1B] h-full rounded-full transition-all duration-500"
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STRENGTHS */}
                  <div className="space-y-2">
                    <span className="text-[12px] font-bold text-[#111] flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-[#16a34a]" />
                      <span>Key Strategic Strengths</span>
                    </span>
                    <div className="space-y-1.5">
                      {analysisData.strengths.map((str, idx) => (
                        <div key={idx} className="text-[12px] text-[#444] bg-[#F4FBF7] border border-[#D5EFE1] p-2.5 rounded-[10px] leading-relaxed">
                          • {str}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GAPS */}
                  <div className="space-y-2">
                    <span className="text-[12px] font-bold text-[#111] flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-600" />
                      <span>Identified Gaps &amp; Vulnerabilities</span>
                    </span>
                    <div className="space-y-1.5">
                      {analysisData.gaps.map((gap, idx) => (
                        <div key={idx} className="text-[12px] text-[#444] bg-[#FFFBF0] border border-[#FDE6B0] p-2.5 rounded-[10px] leading-relaxed">
                          • {gap}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTIVITY-BY-ACTIVITY POWER REWRITES */}
                  {analysisData.activityFeedback && analysisData.activityFeedback.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <span className="text-[12px] font-bold text-[#111] flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[#690B1B]" />
                        <span>Actionable Activity Rewrites</span>
                      </span>
                      <div className="space-y-3">
                        {analysisData.activityFeedback.map((fb, idx) => (
                          <div key={idx} className="bg-white border border-[#E7E2DE] p-3.5 rounded-[14px] shadow-2xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] font-bold text-[#111]">{fb.title}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F0F1] text-[#690B1B]">
                                {fb.rating}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#666]">{fb.critique}</p>
                            <div className="bg-[#FDFCFB] border border-[#EAE6E2] p-2.5 rounded-[10px] space-y-1.5">
                              <span className="text-[10px] font-bold text-[#888] uppercase block">Suggested Rewrite</span>
                              <p className="text-[12px] font-medium text-[#111] italic leading-snug">
                                &ldquo;{fb.suggestedRewrite}&rdquo;
                              </p>
                              <button
                                onClick={() => handleCopyRewrite(fb.suggestedRewrite, fb.activityId || `${idx}`)}
                                className="text-[11px] font-bold text-[#690B1B] hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
                              >
                                {copiedId === (fb.activityId || `${idx}`) ? (
                                  <>
                                    <Check size={12} className="text-[#16a34a]" />
                                    <span className="text-[#16a34a]">Copied to clipboard!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    <span>Copy Rewrite</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RE-ANALYSE BUTTON */}
                  <button
                    onClick={handleAnalyzeActivities}
                    className="w-full py-3 px-4 rounded-full border border-[#E7E2DE] text-[#444] hover:bg-[#F7F5F3] text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <RotateCw size={14} />
                    <span>Run Re-Analysis</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CHAT */}
          {rightTab === 'chat' && (
            <div className="space-y-4">
              <div className="text-[13px] text-[#666] bg-[#F7F5F3] p-3.5 rounded-[14px]">
                Ask AI Advisor how to reword activities to highlight leadership impact.
              </div>
            </div>
          )}

          {/* TAB 3: EXAMPLES */}
          {rightTab === 'examples' && (
            <div className="space-y-3 text-left">
              <div className="text-[13px] font-bold text-[#111]">Top Admitted Activity Profiles</div>
              <div className="p-3.5 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] text-[12px] text-[#555] space-y-1">
                <div className="font-bold text-[#111]">MIT Admit: Computer Science</div>
                <div>Research Lead on ML diagnostic tool • 12 hrs/wk • 40 wks/yr</div>
              </div>
              <div className="p-3.5 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] text-[12px] text-[#555] space-y-1">
                <div className="font-bold text-[#111]">UPenn Admit: Economics &amp; Policy</div>
                <div>Founder of Regional Speech &amp; Debate League • 15 hrs/wk • 36 wks/yr</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
