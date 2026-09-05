'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getCachedUserDetails } from '@/lib/userDetailsCache';
import {
  Search,
  Star,
  Plus,
  Sparkles,
  Send,
  Building2,
  Calendar,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  Loader2,
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function CollegeListPage() {
  const { user, userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Hi! I\'m your **Application AI Advisor**. I can analyze your GPA, test scores, and major to help you build a balanced college list across Dream, Reach, Target, and Safety tiers. Ask me anything about admissions!'
    }
  ]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const [dreamSchools, setDreamSchools] = useState([
    {
      id: 'upenn',
      name: 'University of Pennsylvania',
      location: 'Philadelphia, PA',
      deadline: 'ED: Nov 1',
      acceptanceRate: '5.4%',
      qsRank: '#15 QS World',
      logo: '🏛️'
    }
  ]);

  const [reachSchools, setReachSchools] = useState([
    {
      id: 'harvard',
      name: 'Harvard University',
      location: 'Cambridge, MA',
      deadline: 'REA: Nov 1',
      acceptanceRate: '3.4%',
      qsRank: '#4 QS World',
      logo: '🎓'
    }
  ]);

  const [targetSchools, setTargetSchools] = useState([
    {
      id: 'gatech',
      name: 'Georgia Institute of Technology',
      location: 'Atlanta, GA',
      deadline: 'EA: Oct 15',
      acceptanceRate: '16.0%',
      qsRank: '#88 QS World',
      logo: '🔬'
    }
  ]);

  const [safetySchools, setSafetySchools] = useState([
    {
      id: 'purdue',
      name: 'Purdue University',
      location: 'West Lafayette, IN',
      deadline: 'EA: Nov 1',
      acceptanceRate: '52.7%',
      qsRank: '#99 QS World',
      logo: '⚙️'
    }
  ]);

  // Get user profile from cache for AI context
  const getUserProfile = () => {
    const userKey = user?.uid || user?.email || userData?.email || 'default';
    const cached = getCachedUserDetails(userKey);
    if (!cached) return undefined;
    return {
      fullName: cached.fullName || cached.name || user?.displayName || '',
      gpa: cached.gpa || '',
      gpaWeighted: cached.gpaWeighted || '',
      satScore: cached.satScore || '',
      actScore: cached.actScore || '',
      classRank: cached.classRank || '',
      highSchool: cached.highSchool || '',
      targetMajor: cached.targetMajor || cached.intendedMajor || '',
      dreamSchool: cached.dreamSchool || '',
      country: cached.country || '',
      applicationCycle: cached.applicationCycle || '',
      extracurriculars: cached.extracurriculars || [],
    };
  };

  // Get current college list for AI context
  const getCollegeList = () => ({
    dream: dreamSchools.map(s => ({ name: s.name, acceptanceRate: s.acceptanceRate })),
    reach: reachSchools.map(s => ({ name: s.name, acceptanceRate: s.acceptanceRate })),
    target: targetSchools.map(s => ({ name: s.name, acceptanceRate: s.acceptanceRate })),
    safety: safetySchools.map(s => ({ name: s.name, acceptanceRate: s.acceptanceRate })),
  });

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isAiLoading) return;

    const userMsg: ChatMessage = { sender: 'user', text: promptText };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setIsAiLoading(true);

    try {
      // Build API history (convert sender format to role format)
      const apiHistory = chatHistory
        .filter(msg => msg.sender !== 'ai' || !msg.text.includes("I'm your **Application AI Advisor**"))
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text,
        }));

      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          history: apiHistory,
          profile: getUserProfile(),
          collegeList: getCollegeList(),
        }),
      });

      const data = await res.json();

      if (data.success && data.response) {
        setChatHistory(prev => [...prev, { sender: 'ai', text: data.response }]);
      } else {
        setChatHistory(prev => [...prev, {
          sender: 'ai',
          text: data.error || 'Sorry, I encountered an issue processing your request. Please try again.',
        }]);
      }
    } catch (err) {
      console.error('Advisor API error:', err);
      setChatHistory(prev => [...prev, {
        sender: 'ai',
        text: 'I\'m having trouble connecting right now. Please check your internet connection and try again.',
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  /**
   * Formats inline markdown tokens: **bold**, *italic*, `code`
   */
  const renderInlineFormatting = (text: string) => {
    if (!text) return null;
    const tokens = text.split(/(\*\*.*?\*\*|__.*?__|`.*?`|\*.*?\*|_.*?_)/g);
    return tokens.map((token, idx) => {
      if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
        const inner = token.slice(2, -2);
        return <strong key={idx} className="font-bold text-[#111]">{inner}</strong>;
      }
      if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
        const inner = token.slice(1, -1);
        return <code key={idx} className="bg-[#EAE5E0] text-[#690B1B] px-1.5 py-0.5 rounded text-[12px] font-mono">{inner}</code>;
      }
      if ((token.startsWith('*') && token.endsWith('*') && token.length > 2) || (token.startsWith('_') && token.endsWith('_') && token.length > 2)) {
        const inner = token.slice(1, -1);
        return <em key={idx} className="italic text-[#444]">{inner}</em>;
      }
      return <span key={idx}>{token}</span>;
    });
  };

  /**
   * Renders AI message text with complete markdown support:
   * Headers (#, ##, ###), bold/italic, bullet lists (-, *, •), numbered lists (1.), and clean spacing
   */
  const renderMessageText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5">
        {lines.map((rawLine, i) => {
          const trimmed = rawLine.trim();

          // Empty line -> small spacing
          if (!trimmed) {
            return <div key={i} className="h-1" />;
          }

          // Headers (####, ###, ##, #)
          if (trimmed.startsWith('#### ')) {
            const content = trimmed.replace(/^####\s+/, '');
            return (
              <div key={i} className="font-bold text-[13px] text-[#690B1B] pt-1">
                {renderInlineFormatting(content)}
              </div>
            );
          }
          if (trimmed.startsWith('### ')) {
            const content = trimmed.replace(/^###\s+/, '');
            return (
              <div key={i} className="font-bold text-[14px] text-[#111] pt-1.5 pb-0.5 border-b border-[#E7E2DE]/60">
                {renderInlineFormatting(content)}
              </div>
            );
          }
          if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            const content = trimmed.replace(/^#{1,2}\s+/, '');
            return (
              <div key={i} className="font-bold text-[14px] text-[#690B1B] pt-1.5">
                {renderInlineFormatting(content)}
              </div>
            );
          }

          // Unordered list items: -, *, •
          if (/^[-*•]\s+/.test(trimmed)) {
            const content = trimmed.replace(/^[-*•]\s+/, '');
            return (
              <div key={i} className="flex items-start gap-2 ml-1 text-[13px] leading-relaxed">
                <span className="text-[#690B1B] font-bold shrink-0 mt-0.5">•</span>
                <div className="flex-1">{renderInlineFormatting(content)}</div>
              </div>
            );
          }

          // Numbered list items: 1., 2., etc.
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            const num = numMatch[1];
            const content = numMatch[2];
            return (
              <div key={i} className="flex items-start gap-2 ml-1 text-[13px] leading-relaxed">
                <span className="text-[#690B1B] font-bold text-[11px] shrink-0 mt-0.5 bg-[#F7F0F1] px-1.5 py-0.5 rounded-md">
                  {num}.
                </span>
                <div className="flex-1">{renderInlineFormatting(content)}</div>
              </div>
            );
          }

          // Normal paragraph text
          return (
            <div key={i} className="text-[13px] text-[#333] leading-relaxed">
              {renderInlineFormatting(trimmed)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-5 md:p-8 flex-1 flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full">
      {/* ═══════════════════════════════════════════════════════════════
         LEFT MAIN SECTION — My College List & Tier Dropzones
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 space-y-6">
        {/* HEADER & SEARCH */}
        <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[26px] font-bold text-[#111111] tracking-[-0.03em]">My College List</h2>
              <p className="text-[13px] text-[#777777]">Organize target schools by Dream, Reach, Target, and Safety tiers</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 py-1.5 rounded-full">
                Total Listed: {dreamSchools.length + reachSchools.length + targetSchools.length + safetySchools.length} Schools
              </span>
            </div>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search to add a school (e.g. MIT, Oxford, TU Munich)..."
              className="w-full h-[50px] pl-11 pr-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] placeholder:text-[#999] outline-none focus:border-[#690B1B] focus:ring-1 focus:ring-[#690B1B] transition-all"
            />
          </div>
        </div>

        {/* CATEGORY TIERS */}
        <div className="space-y-5">
          {/* 1. DREAM SCHOOL */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#C9A55D] text-[12px] font-bold tracking-wider uppercase">
              <Star size={16} className="fill-[#C9A55D]" />
              <span>DREAM SCHOOL ({dreamSchools.length})</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {dreamSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] hover:border-[#C9A55D] transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-[28px] shrink-0">{school.logo}</span>
                    <div className="min-w-0">
                      <Link href={`/dashboard/schools/${school.id}`} className="text-[15px] sm:text-[16px] font-bold text-[#111] hover:text-[#690B1B] transition-colors">
                        {school.name}
                      </Link>
                      <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-[#777777] mt-0.5 flex-wrap">
                        <span>{school.location}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-bold text-[#690B1B]">{school.deadline}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Acceptance: {school.acceptanceRate}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/schools/${school.id}`} className="px-3.5 py-1.5 rounded-full text-[12px] font-bold border border-[#E7E2DE] bg-white text-[#555] group-hover:border-[#690B1B] group-hover:text-[#690B1B] transition-all w-full sm:w-auto text-center shrink-0">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 2. REACH SCHOOLS */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#690B1B] text-[12px] font-bold tracking-wider uppercase">
              <TrendingUp size={16} />
              <span>REACH ({reachSchools.length})</span>
            </div>
            <div className="space-y-3">
              {reachSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] hover:border-[#690B1B] transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-[28px] shrink-0">{school.logo}</span>
                    <div className="min-w-0">
                      <Link href={`/dashboard/schools/${school.id}`} className="text-[15px] sm:text-[16px] font-bold text-[#111] hover:text-[#690B1B] transition-colors">
                        {school.name}
                      </Link>
                      <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-[#777777] mt-0.5 flex-wrap">
                        <span>{school.location}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-bold text-[#690B1B]">{school.deadline}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Acceptance: {school.acceptanceRate}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/schools/${school.id}`} className="px-3.5 py-1.5 rounded-full text-[12px] font-bold border border-[#E7E2DE] bg-white text-[#555] group-hover:border-[#690B1B] group-hover:text-[#690B1B] transition-all w-full sm:w-auto text-center shrink-0">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 3. TARGET SCHOOLS */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0088CB] text-[12px] font-bold tracking-wider uppercase">
              <Building2 size={16} />
              <span>TARGET ({targetSchools.length})</span>
            </div>
            <div className="space-y-3">
              {targetSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] hover:border-[#0088CB] transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-[28px] shrink-0">{school.logo}</span>
                    <div className="min-w-0">
                      <Link href={`/dashboard/schools/${school.id}`} className="text-[15px] sm:text-[16px] font-bold text-[#111] hover:text-[#0088CB] transition-colors">
                        {school.name}
                      </Link>
                      <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-[#777777] mt-0.5 flex-wrap">
                        <span>{school.location}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-bold text-[#0088CB]">{school.deadline}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Acceptance: {school.acceptanceRate}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/schools/${school.id}`} className="px-3.5 py-1.5 rounded-full text-[12px] font-bold border border-[#E7E2DE] bg-white text-[#555] group-hover:border-[#0088CB] group-hover:text-[#0088CB] transition-all w-full sm:w-auto text-center shrink-0">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 4. SAFETY SCHOOLS */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#16a34a] text-[12px] font-bold tracking-wider uppercase">
              <ShieldCheck size={16} />
              <span>SAFETY ({safetySchools.length})</span>
            </div>
            <div className="space-y-3">
              {safetySchools.map((school) => (
                <div
                  key={school.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] hover:border-[#16a34a] transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-[28px] shrink-0">{school.logo}</span>
                    <div className="min-w-0">
                      <Link href={`/dashboard/schools/${school.id}`} className="text-[15px] sm:text-[16px] font-bold text-[#111] hover:text-[#16a34a] transition-colors">
                        {school.name}
                      </Link>
                      <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-[#777777] mt-0.5 flex-wrap">
                        <span>{school.location}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-bold text-[#16a34a]">{school.deadline}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Acceptance: {school.acceptanceRate}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/schools/${school.id}`} className="px-3.5 py-1.5 rounded-full text-[12px] font-bold border border-[#E7E2DE] bg-white text-[#555] group-hover:border-[#16a34a] group-hover:text-[#16a34a] transition-all w-full sm:w-auto text-center shrink-0">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         RIGHT SIDE DRAWER — Application AI Advisor Side Panel
         ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full xl:w-[420px] bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-5 shadow-xs flex flex-col justify-between h-auto xl:h-[calc(100vh-120px)] xl:sticky top-[96px]">
        {/* ASSISTANT HEADER */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE6] mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#690B1B] text-white flex items-center justify-center">
                <Sparkles size={18} className="text-[#C9A55D]" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#111]">Application AI Advisor</h3>
                <span className="text-[11px] text-[#16a34a] font-semibold flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAiLoading ? 'bg-[#C9A55D] animate-pulse' : 'bg-[#16a34a] animate-pulse'}`} />
                  {isAiLoading ? 'Thinking...' : 'Online'}
                </span>
              </div>
            </div>
          </div>

          {/* CHAT MESSAGES CONTAINER */}
          <div className="space-y-4 max-h-[340px] xl:max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-[14px] text-[13px] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#690B1B] text-white ml-6'
                    : 'bg-[#F7F5F3] text-[#333333] border border-[#E7E2DE] mr-4'
                }`}
              >
                {msg.sender === 'ai' ? renderMessageText(msg.text) : msg.text}
              </div>
            ))}

            {/* Loading indicator */}
            {isAiLoading && (
              <div className="p-3.5 rounded-[14px] bg-[#F7F5F3] border border-[#E7E2DE] mr-4 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#690B1B]" />
                <span className="text-[12px] text-[#888]">Application AI Advisor is thinking...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* QUICK PROMPT SUGGESTIONS */}
          {chatHistory.length <= 2 && (
            <div className="mt-5 space-y-2">
              <div className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider mb-2">
                Suggested Questions
              </div>
              {[
                "Help me build a balanced college list",
                "Recommend a few reach schools for my profile",
                "Which schools on my list are the best fit?",
                "Should I apply Early Decision anywhere?",
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendPrompt(prompt)}
                  disabled={isAiLoading}
                  className={`w-full text-left p-2.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[12px] text-[#444] font-medium hover:border-[#690B1B] hover:text-[#690B1B] transition-all flex items-center justify-between group cursor-pointer ${
                    isAiLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>{prompt}</span>
                  <ArrowRight size={14} className="text-[#999] group-hover:text-[#690B1B] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CHAT INPUT AREA */}
        <div className="pt-4 border-t border-[#F0EBE6] mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(chatMessage);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask me anything about admissions..."
              disabled={isAiLoading}
              className="flex-1 h-[44px] px-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] text-[#111] outline-none focus:border-[#690B1B] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isAiLoading || !chatMessage.trim()}
              className={`h-[44px] px-4 rounded-[12px] bg-[#690B1B] text-white flex items-center justify-center hover:bg-[#7A1022] transition-all cursor-pointer ${
                isAiLoading || !chatMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isAiLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
