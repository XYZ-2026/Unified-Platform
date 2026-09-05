'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  Copy,
  Check,
  ExternalLink,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface ExemplarEssay {
  id: string;
  title: string;
  school: string;
  words: string;
  tag: string;
  previewText: string;
  content: string;
  author?: string;
  year?: string;
}

export default function ExemplarEssaysPage() {
  const [essays, setEssays] = useState<ExemplarEssay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('ALL');

  // Modal State for viewing full essay in Rich Text Editor
  const [activeModalEssay, setActiveModalEssay] = useState<ExemplarEssay | null>(null);
  const [modalContent, setModalContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Fetch all dynamic essays directly from Wix CMS
  const fetchEssays = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/wix/essays');
      const data = await res.json();
      if (data.success && Array.isArray(data.essays)) {
        setEssays(data.essays);
      } else {
        setEssays([]);
        if (data.error) setError(data.error);
      }
    } catch (err: any) {
      console.warn('Error fetching dynamic essays from Wix CMS:', err);
      setError(err.message || 'Unable to connect to Wix CMS');
      setEssays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEssays();
  }, []);

  // Open Full Essay Viewer in Rich Text Editor
  const handleOpenEssay = (essay: ExemplarEssay) => {
    setActiveModalEssay(essay);
    const fullText = essay.content || (essay.previewText ? `<p>${essay.previewText}</p>` : '<p>No content available.</p>');
    setModalContent(fullText);
  };

  const handleCopyContent = () => {
    if (typeof document !== 'undefined') {
      const tempEl = document.createElement('div');
      tempEl.innerHTML = modalContent;
      const plainText = tempEl.textContent || tempEl.innerText || '';
      navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Extract unique school names from dynamic Wix CMS essays
  const schoolOptions = ['ALL', ...Array.from(new Set(essays.map((e) => e.school).filter(Boolean)))];

  const filteredEssays = essays.filter((e) => {
    const matchesSearch =
      (e.title && e.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.school && e.school.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.previewText && e.previewText.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.content && e.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSchool = selectedSchool === 'ALL' || (e.school && e.school.toLowerCase().includes(selectedSchool.toLowerCase()));
    return matchesSearch && matchesSchool;
  });

  return (
    <div className="p-4 sm:p-5 md:p-8 max-w-[1500px] mx-auto w-full space-y-6">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-8 text-white shadow-sm space-y-3 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[12px] font-bold">
            <Sparkles size={14} />
            <span>Verified SOP Library • Accepted Profiles</span>
          </div>

          <button
            onClick={fetchEssays}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-[12px] font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Essays</span>
          </button>
        </div>

        <h2 className="text-[28px] md:text-[36px] font-bold leading-tight relative z-10">
          Statement of Purpose (SOP) &amp; Essay Bank
        </h2>
        <p className="text-[14px] text-white/80 max-w-[700px] relative z-10 leading-relaxed">
          Comprehensive database of admitted SOPs and personal statements. Click <strong>View Essay</strong> on any card to read and review the full text.
        </p>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search essays by prompt, university, topic, or keyword..."
              className="w-full h-[48px] pl-11 pr-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B] transition-all"
            />
          </div>

          {schoolOptions.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {schoolOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSchool(s)}
                  className={`px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedSchool === s ? 'bg-[#690B1B] text-white shadow-xs' : 'bg-[#F7F5F3] text-[#555] hover:bg-[#EFEBE7]'
                  }`}
                >
                  {s === 'ALL' ? 'All Universities' : s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#F0EBE6] pt-3 text-[13px]">
          <span className="text-[12px] text-[#888] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
            <span>{filteredEssays.length} exemplar essays available</span>
          </span>
        </div>
      </div>

      {/* ESSAY CARDS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 bg-gray-200 rounded-full" />
                <div className="h-4 w-16 bg-gray-100 rounded" />
              </div>
              <div className="h-24 bg-gray-100 rounded-xl" />
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredEssays.length === 0 ? (
        <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F7F0F1] text-[#690B1B] mx-auto flex items-center justify-center">
            <FileText size={28} />
          </div>
          <h3 className="text-[20px] font-bold text-[#111]">
            {searchTerm ? `No essays found for "${searchTerm}"` : 'No exemplar essays found'}
          </h3>
          <p className="text-[14px] text-[#777] max-w-[460px] mx-auto leading-relaxed">
            {searchTerm
              ? 'Try changing your search terms or clearing your filters.'
              : 'No published essays found matching your criteria.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedSchool('ALL'); }}
                className="px-5 py-2 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all cursor-pointer"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={fetchEssays}
              className="px-5 py-2 rounded-full border border-[#E7E2DE] bg-white text-[#555] text-[13px] font-bold hover:bg-[#F9F7F5] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Retry Fetch</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEssays.map((ex) => (
            <div
              key={ex.id}
              onClick={() => handleOpenEssay(ex)}
              className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs hover:border-[#690B1B] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold bg-[#F7F0F1] text-[#690B1B] px-3 py-1 rounded-full uppercase tracking-wider">
                    {ex.school}
                  </span>
                  <span className="text-[11px] font-medium text-[#888] flex items-center gap-1">
                    <Clock size={12} />
                    <span>{ex.words}</span>
                  </span>
                </div>

                {/* ESSAY PREVIEW BOX */}
                <div className="p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] space-y-2 group-hover:bg-[#FFFDFD] transition-colors">
                  <div className="flex items-center justify-between">
                    <FileText size={18} className="text-[#C9A55D]" />
                    <span className="text-[10px] uppercase font-bold text-[#999] tracking-wider">
                      {ex.tag || 'SOP'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#555] italic line-clamp-3 leading-relaxed">
                    &ldquo;{ex.previewText}&rdquo;
                  </p>
                </div>

                <h3 className="text-[15px] font-bold text-[#111] leading-snug line-clamp-2 group-hover:text-[#690B1B] transition-colors">
                  {ex.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-[#F0EBE6] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#16a34a] bg-[#16a34a]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Verified Admit</span>
                </span>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEssay(ex);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye size={14} />
                  <span>View Essay</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         FULL ESSAY RICH TEXT VIEWER MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {activeModalEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white border border-[#E7E2DE] rounded-[24px] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-[#F0EBE6] flex items-center justify-between bg-gradient-to-r from-[#FAF8F6] to-white">
              <div className="space-y-1 max-w-[75%]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold bg-[#F7F0F1] text-[#690B1B] px-3 py-0.5 rounded-full uppercase">
                    {activeModalEssay.school}
                  </span>
                  <span className="text-[12px] text-[#777] font-medium">• {activeModalEssay.words}</span>
                  <span className="text-[11px] font-bold bg-[#16a34a]/10 text-[#16a34a] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>Full Essay</span>
                  </span>
                </div>
                <h3 className="text-[18px] font-bold text-[#111] truncate">
                  {activeModalEssay.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/essays/studio?topic=${encodeURIComponent(activeModalEssay.title)}&format=ieee&essayId=${encodeURIComponent(activeModalEssay.id)}`}
                  className="px-4 py-2 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles size={14} className="text-[#C9A55D]" />
                  <span>Open in AI Studio</span>
                  <ExternalLink size={13} />
                </Link>

                <button
                  onClick={() => setActiveModalEssay(null)}
                  className="p-2 rounded-full text-[#777] hover:bg-[#F7F0F1] hover:text-[#111] transition-colors cursor-pointer"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* MODAL BODY DISPLAYING THE FULL ESSAY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE6]">
                <div className="text-[13px] font-semibold text-[#555] flex items-center gap-2">
                  <FileText size={16} className="text-[#690B1B]" />
                  <span>Full Statement of Purpose / Essay Text</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyContent}
                    className="px-3 py-1.5 rounded-lg border border-[#E7E2DE] bg-[#FDFCFB] hover:bg-[#F7F0F1] text-[#555] text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-[#16a34a]" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied Full Essay!' : 'Copy Full Essay'}</span>
                  </button>
                </div>
              </div>

              {/* FORMATTED ESSAY VIEWER */}
              <div
                className="essay-viewer-content min-h-[420px] bg-white border border-[#E7E2DE] rounded-[18px] px-10 py-8 shadow-2xs"
                dangerouslySetInnerHTML={{ __html: modalContent }}
              />
            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-4 border-t border-[#F0EBE6] flex items-center justify-between bg-[#FAF8F6] text-[13px]">
              <span className="text-[#777]">
                Author: <strong>{activeModalEssay.author || 'Verified Admit'}</strong> • Cycle: <strong>{activeModalEssay.year || 'Class of 2028'}</strong>
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveModalEssay(null)}
                  className="px-4 py-2 rounded-full border border-[#E7E2DE] bg-white text-[#555] hover:bg-[#F9F7F5] font-bold text-[13px] transition-all cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href={`/dashboard/essays/studio?topic=${encodeURIComponent(activeModalEssay.title)}&format=ieee&essayId=${encodeURIComponent(activeModalEssay.id)}`}
                  className="px-5 py-2 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white font-bold text-[13px] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Open in AI Studio</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
