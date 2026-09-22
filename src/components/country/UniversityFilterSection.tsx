'use client';

import { useState } from 'react';

export interface University {
  name: string;
  location: string;
  ranking: string;
  acceptance: string;
  tuition: string;
  type: 'Public' | 'Private';
  programs: string[];
  subject: string;
  website: string;
}

export default function UniversityFilterSection({
  universities,
  countryName,
}: {
  universities: University[];
  countryName: string;
}) {
  const [uniFilter, setUniFilter] = useState<'All' | 'Public' | 'Private'>('All');
  const filteredUnis = universities.filter(
    (u) => uniFilter === 'All' || u.type === uniFilter
  );

  return (
    <section id="universities" className="px-4 sm:px-8 py-10 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">
              Top Institutions
            </div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111]">
              Top Universities in {countryName}
            </h2>
          </div>
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide shrink-0">
            {(['All', 'Public', 'Private'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setUniFilter(f)}
                className={`h-[36px] px-4 sm:px-5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all border shrink-0 ${
                  uniFilter === f
                    ? 'bg-[#690B1B] text-white border-[#690B1B] shadow-sm'
                    : 'bg-white text-[#555] border-[#E7E2DE] hover:border-[#690B1B]/40'
                }`}
                aria-pressed={uniFilter === f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredUnis.length === 0 ? (
          <div className="text-center py-12 text-[#999] text-[14px]">
            No {uniFilter.toLowerCase()} universities listed for {countryName}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredUnis.map((uni) => (
              <div
                key={uni.name}
                className="group bg-white rounded-[16px] border border-[#EAEAEA] border-t-[3px] border-t-[#690B1B] shadow-[0_1px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-250 flex flex-col justify-between h-full min-h-[415px] sm:min-h-[425px]"
              >
                <div className="px-5 pt-5 pb-5 flex flex-col flex-1">
                  {/* Header: icon + ranking badge */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="w-10 h-10 rounded-[10px] bg-[#FDF0F2] border border-[#F0C9D0] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#690B1B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-5.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-[#690B1B] bg-[#FDF0F2] border border-[#F0C9D0] px-3 py-1 rounded-md tracking-tight shrink-0 mt-0.5">
                      {uni.ranking}
                    </span>
                  </div>

                  {/* University name — normalized height for 1 or 2 lines */}
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111827] leading-snug mb-1 min-h-[44px] sm:min-h-[48px] flex items-center">
                    {uni.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-3.5 h-[20px]">
                    <svg className="w-3 h-3 text-[#690B1B]/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{uni.location}</span>
                  </div>

                  {/* Stats — normalized min-height whether pills wrap to 2 lines or fit on 1 */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 min-h-[66px] sm:min-h-[34px] content-start">
                    <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 py-1.5">
                      <span className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">Acceptance</span>
                      <span className="text-[12px] font-black text-[#690B1B]">{uni.acceptance}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 py-1.5">
                      <span className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">Tuition</span>
                      <span className="text-[12px] font-bold text-[#111827]">{uni.tuition}</span>
                    </div>
                    <div
                      className={`flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border ${
                        uni.type === 'Public'
                          ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]'
                          : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
                      }`}
                    >
                      {uni.type}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#F3F4F6] mb-4" />

                  {/* Popular Programs — normalized min-height so 1-line and 2-line wraps match */}
                  <div className="mb-5 flex-1 flex flex-col justify-start">
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.14em] font-bold mb-2">
                      Popular Programs
                    </p>
                    <div className="flex flex-wrap gap-1.5 min-h-[58px] content-start">
                      {uni.programs.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="text-[11px] bg-white border border-[#E5E7EB] text-[#374151] px-2.5 py-0.5 rounded-full font-medium hover:border-[#690B1B]/30 hover:text-[#690B1B] transition-colors cursor-default h-[26px] flex items-center"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-2">
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-[42px] rounded-[10px] border border-[#690B1B] text-[#690B1B] text-[13px] font-bold hover:bg-[#690B1B] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                      aria-label={`Visit official website for ${uni.name}`}
                    >
                      View University
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
