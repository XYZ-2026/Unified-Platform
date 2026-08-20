'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  BookOpen,
  Filter,
  Bookmark,
  Sparkles,
  ArrowRight,
  Eye,
  Lock
} from 'lucide-react';

export default function ExemplarEssaysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'unlocked'>('all');
  const [selectedSchool, setSelectedSchool] = useState('ALL');

  const exemplars = [
    {
      id: 'ex-1',
      title: 'How will you explore community at Penn? Consider how Penn will help shape your perspective...',
      school: 'University of Pennsylvania',
      words: '485 words',
      tag: 'Admitted Essay',
      previewText: 'Growing up in a dual-heritage household taught me that community is not defined by location, but by shared curiosity and mutual support...'
    },
    {
      id: 'ex-2',
      title: 'Write about a time you learned something new and were excited to uncover more information...',
      school: 'University of Pennsylvania',
      words: '240 words',
      tag: 'Supplemental',
      previewText: 'When I first encountered graph neural networks, what began as a late-night rabbit hole quickly became a obsession with multi-relational data modeling...'
    },
    {
      id: 'ex-3',
      title: 'The defining quality of a university is its student body. Describe something unique about your perspective...',
      school: 'University of Pennsylvania',
      words: '320 words',
      tag: 'Community',
      previewText: 'My perspective was forged at the intersection of classical violin performance and algorithmic problem solving...'
    },
    {
      id: 'ex-4',
      title: 'How do you hope to pursue your intellectual curiosity at Harvard?',
      school: 'Harvard University',
      words: '150 words',
      tag: 'Short Answer',
      previewText: 'I am drawn to the interdisciplinary research at the Harvard Data Science Initiative, where computational models meet social policy...'
    },
    {
      id: 'ex-5',
      title: 'Top 3 things your college roommate should know about you...',
      school: 'Harvard University',
      words: '250 words',
      tag: 'Roommate Letter',
      previewText: '1. I make artisanal cold brew at 6 AM. 2. I have a wall covered in whiteboard equations. 3. I will always proofread your essays...'
    },
    {
      id: 'ex-[#ex-6]',
      title: 'Briefly describe one of your extracurricular activities or work experiences...',
      school: 'Harvard University',
      words: '150 words',
      tag: 'Activity Essay',
      previewText: 'As founder of TechForGood, I managed a team of 8 student developers building volunteer scheduling software...'
    },
    {
      id: 'ex-7',
      title: 'Discuss an accomplishment, event, or realization that sparked a period of personal growth...',
      school: 'Common App',
      words: '642 words',
      tag: 'Personal Statement',
      previewText: 'The hum of the server rack was the only sound in the basement lab at 2 AM. That night, after 47 failed deployments, the model converged...'
    },
    {
      id: 'ex-8',
      title: 'Why Johns Hopkins? How will you engage with our academic environment?',
      school: 'Johns Hopkins',
      words: '350 words',
      tag: 'Why School',
      previewText: 'Johns Hopkins offers the exact nexus of biomedical engineering and clinical practice that matches my research ambitions...'
    }
  ];

  const filteredExemplars = exemplars.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = selectedSchool === 'ALL' || e.school.includes(selectedSchool);
    return matchesSearch && matchesSchool;
  });

  return (
    <div className="p-5 md:p-8 max-w-[1500px] mx-auto w-full space-y-6">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-8 text-white shadow-sm space-y-3 border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[12px] font-bold">
          <Sparkles size={14} />
          <span>Exemplar Essay Bank</span>
        </div>
        <h2 className="text-[28px] md:text-[36px] font-bold leading-tight">
          Admitted Student Essays &amp; Exemplars
        </h2>
        <p className="text-[14px] text-white/80 max-w-[650px]">
          Thousands of high-quality, verified admit essays from top universities worldwide to inspire your writing.
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search essays by prompt, school, or keyword..."
              className="w-full h-[48px] pl-11 pr-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['ALL', 'Penn', 'Harvard', 'Common App', 'Johns Hopkins'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSchool(s)}
                className={`px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all ${
                  selectedSchool === s ? 'bg-[#690B1B] text-white' : 'bg-[#F7F5F3] text-[#555]'
                }`}
              >
                {s === 'ALL' ? 'All Schools' : s}
              </button>
            ))}
          </div>
        </div>

        {/* SUB TABS */}
        <div className="flex items-center gap-2 border-t border-[#F0EBE6] pt-3 text-[13px]">
          {(['all', 'saved', 'unlocked'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-full font-bold transition-all capitalize ${
                activeTab === t ? 'bg-[#F7F0F1] text-[#690B1B]' : 'text-[#777] hover:text-[#111]'
              }`}
            >
              {t} Essays
            </button>
          ))}
        </div>
      </div>

      {/* ESSAY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExemplars.map((ex) => (
          <div
            key={ex.id}
            className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs hover:border-[#690B1B] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-[#F7F0F1] text-[#690B1B] px-2.5 py-0.5 rounded-full">
                  {ex.school}
                </span>
                <span className="text-[11px] font-medium text-[#888]">{ex.words}</span>
              </div>

              {/* PAPER ESSAY PREVIEW */}
              <div className="p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-2">
                <FileText size={20} className="text-[#C9A55D]" />
                <p className="text-[12px] text-[#666] italic line-clamp-3 leading-relaxed">
                  &ldquo;{ex.previewText}&rdquo;
                </p>
              </div>

              <h3 className="text-[15px] font-bold text-[#111] leading-snug line-clamp-2">
                {ex.title}
              </h3>
            </div>

            <div className="pt-3 border-t border-[#F0EBE6] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#16a34a] bg-[#16a34a]/10 px-2.5 py-0.5 rounded-full">
                Verified Admit
              </span>
              <button className="px-4 py-1.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-2xs">
                <Eye size={13} />
                <span>Read Full Essay</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
