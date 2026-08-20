'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Edit2
} from 'lucide-react';

export default function ExtracurricularsPage() {
  const [rightTab, setRightTab] = useState<'analyse' | 'chat' | 'examples'>('analyse');
  const [activities, setActivities] = useState([
    {
      id: 'act-1',
      title: 'Founder & Lead Developer',
      organization: 'TechForGood Student Non-Profit',
      category: 'Computer Science / Community Service',
      hoursPerWeek: '8 hrs/wk • 40 wks/yr',
      description: 'Built an open-source web platform helping local food banks manage volunteer scheduling. Scaled to 3,000+ monthly active users.'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddActivity = () => {
    if (!newTitle.trim()) return;
    setActivities((prev) => [
      ...prev,
      {
        id: `act-${Date.now()}`,
        title: newTitle,
        organization: newOrg || 'Independent Project',
        category: 'Leadership / Academic',
        hoursPerWeek: '5 hrs/wk • 30 wks/yr',
        description: newDesc || 'Organized initiatives and contributed to team development.'
      }
    ]);
    setNewTitle('');
    setNewOrg('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="p-5 md:p-8 flex-1 flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full">
      {/* ═══════════════════════════════════════════════════════════════
         LEFT MAIN SECTION — Extracurricular Activity Slots
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 space-y-6">
        {/* HEADER */}
        <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-bold text-[#111111] tracking-[-0.03em]">Extracurriculars</h2>
            <p className="text-[13px] text-[#777777]">
              {activities.length} of 10 Common App slots filled • ordered by significance
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus size={16} />
            <span>Add Activity</span>
          </button>
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
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[14px] font-bold transition-all inline-flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Activity</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((act, index) => (
              <div
                key={act.id}
                className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs hover:border-[#690B1B]/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#F7F0F1] text-[#690B1B] font-bold text-[13px] flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="text-[17px] font-bold text-[#111]">{act.title}</h4>
                      <div className="text-[13px] text-[#690B1B] font-semibold">{act.organization}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#777] bg-[#F7F5F3] px-3 py-1 rounded-full">
                    {act.hoursPerWeek}
                  </span>
                </div>
                <p className="text-[14px] text-[#555] leading-relaxed pl-11">
                  {act.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* MODAL: ADD ACTIVITY */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 max-w-md w-full shadow-xl space-y-4">
              <h3 className="text-[20px] font-bold text-[#111]">Add New Activity</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[12px] font-bold text-[#555] block mb-1">Position / Role Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Founder & Lead Developer"
                    className="w-full h-[44px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] outline-none focus:border-[#690B1B]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#555] block mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="e.g. Robotics Club / Tech Non-Profit"
                    className="w-full h-[44px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] outline-none focus:border-[#690B1B]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#555] block mb-1">Description (150 chars max)</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe accomplishments, leadership, and impact..."
                    rows={3}
                    className="w-full p-3 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] outline-none focus:border-[#690B1B]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-[13px] font-bold text-[#666] hover:bg-[#F7F5F3]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddActivity}
                  className="px-5 py-2 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022]"
                >
                  Save Activity
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         RIGHT SIDE PANEL — Analysis, Chat & Exemplars Tabs
         ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full xl:w-[420px] bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs flex flex-col justify-between h-auto xl:h-[calc(100vh-120px)] sticky top-[96px]">
        <div>
          {/* TABS HEADER */}
          <div className="flex items-center gap-1 bg-[#F7F5F3] p-1 rounded-full border border-[#E7E2DE] mb-6">
            {(['analyse', 'chat', 'examples'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`flex-1 py-2 rounded-full text-[12px] font-bold capitalize transition-all ${
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
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFF8EB] border border-[#F4D080] text-[#9E731A] mx-auto flex items-center justify-center">
                <Sparkles size={28} />
              </div>

              <div className="space-y-2">
                <h3 className="text-[18px] font-bold text-[#111]">Admissions Officer Analysis</h3>
                <p className="text-[13px] text-[#777] max-w-[320px] mx-auto leading-relaxed">
                  AI reads your entire activity list at once, exactly the way an admissions committee member does.
                </p>
              </div>

              <div className="bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] p-4 text-left space-y-3">
                {[
                  "0 - 100 evaluation read of the list as a cohesive set",
                  "Checks activity order, leadership depth, and missing gaps",
                  "Suggests powerful rewrites using action verbs",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[12px] text-[#444]">
                    <CheckCircle2 size={16} className="text-[#16a34a] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 px-4 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-xs">
                <span>Analyse Activity List</span>
                <span className="bg-[#C9A55D] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  ⚡ 7
                </span>
              </button>
            </div>
          )}

          {/* TAB 2: CHAT */}
          {rightTab === 'chat' && (
            <div className="space-y-4">
              <div className="text-[13px] text-[#666] bg-[#F7F5F3] p-3 rounded-[12px]">
                Ask AI Advisor how to reword activities to highlight leadership impact.
              </div>
            </div>
          )}

          {/* TAB 3: EXAMPLES */}
          {rightTab === 'examples' && (
            <div className="space-y-3 text-left">
              <div className="text-[13px] font-bold text-[#111]">Top Admitted Activity Profiles</div>
              <div className="p-3 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[12px] text-[#555]">
                <strong>MIT Admit:</strong> Research Lead on ML diagnostic tool • 12 hrs/wk
              </div>
              <div className="p-3 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[12px] text-[#555]">
                <strong>UPenn Admit:</strong> Founder of Regional Speech &amp; Debate League • 15 hrs/wk
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
