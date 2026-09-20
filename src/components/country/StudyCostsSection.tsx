'use client';

import { useState } from 'react';

export interface StudyCostLevel {
  range: string;
  notes: string;
}

export interface CityCost {
  city: string;
  rent: string;
  food: string;
  transport: string;
  total: string;
}

const DEGREE_TABS = ["Bachelor's", "Master's", 'MBA', 'PhD'];

export default function StudyCostsSection({
  countryName,
  studyCosts,
  cities,
}: {
  countryName: string;
  studyCosts: {
    bachelor: StudyCostLevel;
    master: StudyCostLevel;
    mba: StudyCostLevel;
    phd: StudyCostLevel;
    livingCost: string;
  };
  cities: CityCost[];
}) {
  const [costsTab, setCostsTab] = useState(0);
  const degCosts = [
    studyCosts.bachelor,
    studyCosts.master,
    studyCosts.mba,
    studyCosts.phd,
  ];

  return (
    <section id="costs" className="px-4 sm:px-8 py-10 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">
          Financial Planning
        </div>
        <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-2">
          Study Costs in {countryName}
        </h2>
        <p className="text-[#727272] text-[13px] sm:text-[14px] mb-6 sm:mb-8">
          Get the full financial picture before you apply. Select your degree level below.
        </p>

        {/* Degree Tabs (scrollable on mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6 sm:mb-8">
          {DEGREE_TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setCostsTab(i)}
              className={`h-[38px] sm:h-[40px] px-5 sm:px-6 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all border shrink-0 ${
                costsTab === i
                  ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-sm'
                  : 'bg-white text-[#555] border-[#E7E2DE] hover:border-[#690B1B]/40'
              }`}
              aria-pressed={costsTab === i}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Tuition Card */}
          <div className="bg-[#F7F5F3] border border-[#E7E2DE] rounded-[16px] p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#F7F0F1] text-[#690B1B] border border-[#E8C4CC] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-5.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="text-[11px] text-[#999] uppercase tracking-[0.1em] font-semibold">
                {DEGREE_TABS[costsTab]} — Tuition Range
              </div>
            </div>
            <div className="text-[20px] sm:text-[28px] font-bold text-[#690B1B] mb-3 sm:mb-4 leading-snug">
              {degCosts[costsTab].range}
            </div>
            <p className="text-[13px] sm:text-[14px] text-[#666] leading-relaxed">
              {degCosts[costsTab].notes}
            </p>
          </div>

          {/* Living Cost Card with top 3 city breakdown */}
          <div className="bg-[#F7F5F3] border border-[#E7E2DE] rounded-[16px] p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#F7F0F1] text-[#690B1B] border border-[#E8C4CC] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-[11px] text-[#999] uppercase tracking-[0.1em] font-semibold">
                Monthly Living Cost
              </div>
            </div>
            <div className="text-[20px] sm:text-[28px] font-bold text-[#111] mb-4 sm:mb-5">
              {studyCosts.livingCost}
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {cities.slice(0, 3).map((c) => (
                <div
                  key={c.city}
                  className="flex justify-between items-center py-1.5 sm:py-2 border-b border-[#E7E2DE] last:border-b-0"
                >
                  <span className="text-[12px] sm:text-[13px] text-[#555] font-medium">
                    {c.city}
                  </span>
                  <span className="text-[12px] sm:text-[13px] font-bold text-[#690B1B]">
                    {c.total}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
