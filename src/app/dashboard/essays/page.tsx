'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Clock,
  Edit3,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EssayDraftItem {
  id: string;
  title: string;
  school: string;
  words: string;
  status: string;
  tag?: string;
  updatedAt?: string;
}

export default function MyEssaysPage() {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'in-progress' | 'ready'>('all');
  const [essayDrafts, setEssayDrafts] = useState<EssayDraftItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserDrafts = async () => {
      setLoading(true);
      try {
        const uId = userData?.uid || (typeof window !== 'undefined' ? localStorage.getItem('abroad_current_uid') : '') || 'guest-user';
        const uEmail = userData?.email || (typeof window !== 'undefined' ? localStorage.getItem('abroad_current_email') : '') || '';

        const params = new URLSearchParams();
        if (uId) params.set('userId', uId);
        if (uEmail) params.set('userEmail', uEmail);

        const res = await fetch(`/api/wix/user-essays?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.essays)) {
            const parsed = json.essays.map((p: any) => ({
              id: p.id,
              title: p.title || 'Statement of Purpose',
              school: p.school || 'Target University',
              words: p.wordCount && p.wordCount !== '0' ? `${p.wordCount} words` : 'Blank draft',
              status: p.status || 'In Progress',
              tag: p.format?.toUpperCase() || 'SOP',
              updatedAt: p.updatedAt || new Date().toISOString()
            }));
            setEssayDrafts(parsed);
            return;
          }
        }
        setEssayDrafts([]);
      } catch (err) {
        console.warn('Could not load user essay drafts from Wix CMS:', err);
        setEssayDrafts([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserDrafts();
  }, [userData]);

  const filteredEssays = essayDrafts.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.school.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'in-progress') return e.status === 'In Progress';
    if (filterMode === 'ready') return e.status === 'Draft Ready' || e.status === 'Accepted';
    return true;
  });

  return (
    <div className="p-4 sm:p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6 font-sans">
      {/* HEADER & NEW ESSAY BUTTON */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-6 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-3 w-full">
          <h2 className="text-[20px] sm:text-[26px] font-bold text-[#111111] tracking-[-0.03em]">My Essays &amp; SOPs</h2>
          <Link
            href="/dashboard/essays/studio?topic=Statement+of+Purpose"
            className="h-[38px] sm:h-[42px] px-3.5 sm:px-5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] sm:text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs shrink-0 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Plus size={15} />
            <span>New Essay Draft</span>
          </Link>
        </div>
        <p className="text-[12px] sm:text-[13px] text-[#777777]">Write, polish, humanise, and evaluate your admissions drafts with AI</p>
      </div>

      {/* CONTROLS BAR */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your essays by title or university..."
            className="w-full h-[46px] pl-11 pr-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] outline-none focus:border-[#690B1B] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0 shrink-0">
          {[
            { id: 'all', label: `All (${essayDrafts.length})` },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'ready', label: 'Ready' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id as any)}
              className={`h-[34px] sm:h-[36px] px-3.5 sm:px-4 rounded-full text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center active:scale-95 ${
                filterMode === f.id ? 'bg-[#690B1B] text-white shadow-2xs' : 'bg-[#F7F5F3] text-[#555] hover:bg-[#EFEBE7]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ESSAY CARDS GRID OR EMPTY STATE */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs animate-pulse space-y-4">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-100 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredEssays.length === 0 ? (
        <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#F7F0F1] flex items-center justify-center text-[#690B1B]">
            <FileText size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-[18px] font-bold text-[#111]">No essay drafts yet</h3>
            <p className="text-[13px] text-[#777] max-w-md mx-auto leading-relaxed">
              Create your first Statement of Purpose or admissions essay to write with AI assistance, run AI detection checks, and polish your narrative.
            </p>
          </div>
          <Link
            href="/dashboard/essays/studio?topic=Statement+of+Purpose"
            className="px-6 py-3 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Create First Essay Draft</span>
          </Link>
        </div>
      ) : (
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

                <div className="h-[90px] bg-[#FDFCFB] border border-[#F0EBE6] rounded-[14px] p-4 flex items-center justify-center text-center">
                  <FileText size={30} className="text-[#C9A55D] opacity-60" />
                </div>

                <h3 className="text-[15px] font-bold text-[#111] leading-snug line-clamp-2">
                  &ldquo;{essay.title}&rdquo;
                </h3>
              </div>

              <div className="pt-3 border-t border-[#F0EBE6] flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  essay.status === 'In Progress' ? 'bg-[#FFF8EB] text-[#9E731A]' : 'bg-[#F0FDF4] text-[#16A34A]'
                }`}>
                  {essay.status}
                </span>
                <Link
                  href={`/dashboard/essays/studio?topic=${encodeURIComponent(essay.title)}&paperId=${encodeURIComponent(essay.id)}`}
                  className="px-4 py-1.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Edit3 size={13} />
                  <span>Open Studio</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
