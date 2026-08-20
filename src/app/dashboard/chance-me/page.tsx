'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Search,
  Sparkles,
  Flame,
  CheckCircle2,
  Building2,
  UserCheck,
  Award,
  BookOpen,
  ArrowRight,
  Plus,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function AIChanceMePage() {
  const [selectedSchool, setSelectedSchool] = useState('University of Pennsylvania');
  const [spiceLevel, setSpiceLevel] = useState<'gentle' | 'candid' | 'roast'>('candid');
  const [evaluationResult, setEvaluationResult] = useState<null | {
    odds: string;
    verdict: string;
    rubric: Array<{ name: string; score: string; width: string }>;
  }>(null);

  const handleRunEvaluation = () => {
    setEvaluationResult({
      odds: '68% Admit Chance',
      verdict: 'Strong academic foundation & high test scores. High chance for UPenn / Imperial. Adding 1 leadership project in CS will increase odds to 85%.',
      rubric: [
        { name: 'Academic Rigor (GPA & SAT)', score: '94%', width: '94%' },
        { name: 'Extracurricular Uniqueness', score: '88%', width: '88%' },
        { name: 'SOP Story Alignment', score: '82%', width: '82%' },
        { name: 'Research & Honors Impact', score: '90%', width: '90%' },
      ]
    });
  };

  return (
    <div className="p-5 md:p-8 flex-1 flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full">
      {/* ═══════════════════════════════════════════════════════════════
         LEFT SIDEBAR — History of Past Reviews
         ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full xl:w-[320px] space-y-4">
        <button
          onClick={() => setEvaluationResult(null)}
          className="w-full py-3 px-4 rounded-[14px] bg-[#690B1B] hover:bg-[#7A1022] text-white text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <Plus size={16} />
          <span>New Review</span>
        </button>

        <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs space-y-3">
          <div className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">
            Past AI Reviews (2)
          </div>
          <div className="space-y-2">
            <button
              onClick={handleRunEvaluation}
              className="w-full text-left p-3 rounded-[14px] bg-[#F7F0F1] border border-[#690B1B]/20 text-[#111] hover:border-[#690B1B] transition-all"
            >
              <div className="text-[14px] font-bold">UPenn — Business/CS</div>
              <div className="text-[11px] text-[#690B1B] font-semibold mt-0.5">Odds: 68% • Candid</div>
            </button>
            <button className="w-full text-left p-3 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] text-[#555] hover:border-[#690B1B] transition-all">
              <div className="text-[14px] font-bold">MIT — Computer Science</div>
              <div className="text-[11px] text-[#777] mt-0.5">Odds: 42% • Gentle</div>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         RIGHT MAIN SECTION — AI Chance Me Studio & Step Wizard
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 space-y-6">
        {/* HERO ILLUSTATED BANNER */}
        <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-8 text-white shadow-sm space-y-3 border border-white/10 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[12px] font-bold">
            <Sparkles size={14} />
            <span>AI Admissions Predictor</span>
          </div>
          <h2 className="text-[28px] md:text-[36px] font-bold leading-tight">
            See your <span className="text-[#C9A55D] italic">chances</span> at any school
          </h2>
          <p className="text-[14px] text-white/80 max-w-[650px] leading-relaxed">
            Get a rubric-aligned read on your odds at any school: category scores, an admit-chance estimate, and a candid admissions officer take.
          </p>
        </div>

        {/* EVALUATION RESULT OR WIZARD FORM */}
        {evaluationResult ? (
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F0EBE6] pb-6">
              <div>
                <span className="text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-full uppercase">
                  Target School: {selectedSchool}
                </span>
                <h3 className="text-[24px] font-bold text-[#111] mt-2">{evaluationResult.odds}</h3>
              </div>
              <button
                onClick={() => setEvaluationResult(null)}
                className="px-4 py-2 rounded-full border border-[#E7E2DE] text-[#555] text-[13px] font-bold hover:bg-[#F7F5F3] flex items-center gap-2"
              >
                <RotateCcw size={15} />
                <span>Re-evaluate</span>
              </button>
            </div>

            {/* CANDID VERDICT BOX */}
            <div className="p-5 rounded-[16px] bg-[#F7F0F1] border border-[#690B1B]/20 text-[#690B1B] space-y-2">
              <div className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={16} />
                <span>Admissions Officer Verdict ({spiceLevel.toUpperCase()} MODE)</span>
              </div>
              <p className="text-[14px] leading-relaxed font-medium text-[#111]">
                &ldquo;{evaluationResult.verdict}&rdquo;
              </p>
            </div>

            {/* RUBRIC SCORES */}
            <div className="space-y-4 pt-2">
              <h4 className="text-[16px] font-bold text-[#111]">Category Rubric Breakdown</h4>
              {evaluationResult.rubric.map((r) => (
                <div key={r.name} className="space-y-1.5">
                  <div className="flex justify-between text-[13px] font-semibold text-[#444]">
                    <span>{r.name}</span>
                    <span className="font-bold text-[#690B1B]">{r.score}</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F7F5F3] rounded-full overflow-hidden border border-[#E7E2DE]">
                    <div className="h-full bg-[#690B1B] rounded-full" style={{ width: r.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 md:p-8 shadow-xs space-y-8">
            {/* STEP WIZARD FORM */}
            <div className="space-y-6">
              <h3 className="text-[20px] font-bold text-[#111]">1. Choose a target university</h3>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                <input
                  type="text"
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  placeholder="Search for a school..."
                  className="w-full h-[50px] pl-11 pr-4 rounded-[14px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>

              {/* SPICE LEVEL SELECTOR */}
              <div className="space-y-3 pt-2">
                <label className="text-[14px] font-bold text-[#111] block">Select Feedback Spice Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'gentle', title: 'Gentle 🌶️', desc: 'Kind & constructive advice.' },
                    { id: 'candid', title: 'Candid 🌶️🌶️', desc: 'Honest, no sugarcoating.' },
                    { id: 'roast', title: 'Roast Me 🌶️🌶️🌶️', desc: 'Admissions officer bad day mode.' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSpiceLevel(s.id as any)}
                      className={`p-4 rounded-[16px] text-left border transition-all ${
                        spiceLevel === s.id
                          ? 'bg-[#F7F0F1] border-[#690B1B] text-[#690B1B] font-bold'
                          : 'bg-[#FDFCFB] border-[#E7E2DE] text-[#555] hover:border-[#690B1B]'
                      }`}
                    >
                      <div className="text-[15px] font-bold">{s.title}</div>
                      <div className="text-[12px] opacity-80 mt-1">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRunEvaluation}
                className="w-full py-4 px-6 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[15px] font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Evaluate My Admission Chances</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* HOW IT WORKS 3-CARD GRID */}
            <div className="pt-6 border-t border-[#F0EBE6] space-y-4">
              <h4 className="text-[16px] font-bold text-[#111] text-center">How It Works</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { num: '1', title: 'Pick a school', desc: 'Choose any university from our database of thousands.' },
                  { num: '2', title: 'Add your stats', desc: 'GPA, test scores, courses, activities, and awards.' },
                  { num: '3', title: 'See your real odds', desc: 'Compare against real admits and see where you stand.' },
                ].map((card) => (
                  <div key={card.num} className="p-5 rounded-[16px] bg-[#FDFCFB] border border-[#E7E2DE] text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-[#F7F0F1] text-[#690B1B] font-bold text-[14px] mx-auto flex items-center justify-center">
                      {card.num}
                    </div>
                    <h5 className="text-[15px] font-bold text-[#111]">{card.title}</h5>
                    <p className="text-[12px] text-[#777]">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
