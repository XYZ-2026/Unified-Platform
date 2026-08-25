'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  BookOpen,
  Filter,
  Sparkles,
  ArrowRight,
  Clock,
  Edit3
} from 'lucide-react';

export default function MyEssaysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'school'>('all');

  const essayCards = [
    {
      id: 'essay-1',
      prompt: 'After a challenging experience, how do you rejuvenate and reflect?',
      tag: 'Common App Personal Statement',
      words: '650 max',
      status: 'In Progress',
      school: 'Common App'
    },
    {
      id: 'essay-2',
      prompt: 'How will you explore your intellectual and academic interests at Penn?',
      tag: 'University of Pennsylvania',
      words: '500 max',
      status: 'Not Started',
      school: 'UPenn'
    },
    {
      id: 'essay-3',
      prompt: 'Our behavior is often shaped by our values. Tell us about a core value you hold.',
      tag: 'Supplemental Essay',
      words: '250 max',
      status: 'Draft Ready',
      school: 'UPenn'
    },
    {
      id: 'essay-4',
      prompt: 'Tell us about a time when your perspective was challenged by someone else.',
      tag: 'Stanford Supplemental',
      words: '250 max',
      status: 'Not Started',
      school: 'Stanford'
    },
    {
      id: 'essay-5',
      prompt: 'What compliment are you most proud of receiving and who gave it to you?',
      tag: 'Short Answer',
      words: '150 max',
      status: 'Not Started',
      school: 'Harvard'
    },
    {
      id: 'essay-6',
      prompt: 'Describe how your background and experiences will shape your contribution to our community.',
      tag: 'Community Essay',
      words: '300 max',
      status: 'In Progress',
      school: 'MIT'
    }
  ];

  const filteredEssays = essayCards.filter((e) =>
    e.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      {/* HEADER & NEW ESSAY BUTTON */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-bold text-[#111111] tracking-[-0.03em]">My Essays &amp; SOPs</h2>
          <p className="text-[13px] text-[#777777]">Every prompt from your college list, ready to write and evaluate with AI</p>
        </div>
        <Link
          href="/dashboard/essays/studio?topic=Statement+of+Purpose&format=ieee"
          className="px-5 py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-2 shadow-xs"
        >
          <Plus size={16} />
          <span>New Essay Draft</span>
        </Link>
      </div>

      {/* CONTROLS BAR */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search essays by prompt or school name..."
            className="w-full h-[46px] pl-11 pr-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#11] outline-none focus:border-[#690B1B]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all ${
              filterMode === 'all' ? 'bg-[#690B1B] text-white' : 'bg-[#F7F5F3] text-[#555]'
            }`}
          >
            All Prompts
          </button>
          <button
            onClick={() => setFilterMode('school')}
            className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all ${
              filterMode === 'school' ? 'bg-[#690B1B] text-white' : 'bg-[#F7F5F3] text-[#555]'
            }`}
          >
            By School
          </button>
        </div>
      </div>

      {/* ESSAY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEssays.map((essay) => (
          <div
            key={essay.id}
            className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#690B1B]/40 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-[#F7F0F1] text-[#690B1B] px-3 py-1 rounded-full uppercase tracking-wider">
                  {essay.school}
                </span>
                <span className="text-[12px] text-[#888] font-medium flex items-center gap-1">
                  <Clock size={13} />
                  <span>{essay.words}</span>
                </span>
              </div>

              {/* CARD PAPER GRAPHIC */}
              <div className="h-[100px] bg-[#FDFCFB] border border-[#F0EBE6] rounded-[14px] p-4 flex items-center justify-center text-center">
                <FileText size={32} className="text-[#C9A55D] opacity-60" />
              </div>

              <h3 className="text-[15px] font-bold text-[#111] leading-snug line-clamp-3">
                &ldquo;{essay.prompt}&rdquo;
              </h3>
            </div>

            <div className="pt-3 border-t border-[#F0EBE6] flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                essay.status === 'In Progress' ? 'bg-[#FFF8EB] text-[#9E731A]' : 'bg-[#F7F5F3] text-[#777]'
              }`}>
                {essay.status}
              </span>
              <Link
                href={`/dashboard/essays/studio?topic=${encodeURIComponent(essay.prompt)}&format=ieee&paperId=${encodeURIComponent(essay.id)}`}
                className="px-4 py-1.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 size={13} />
                <span>Write SOP</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
