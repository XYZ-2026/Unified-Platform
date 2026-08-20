'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  GraduationCap,
  MapPin,
  DollarSign,
  Award,
  ArrowRight,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';

export default function UniversityFinderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  const universities = [
    {
      id: 'mit',
      name: 'Massachusetts Institute of Technology (MIT)',
      location: 'Cambridge, MA, USA',
      country: 'USA',
      type: 'Private Research',
      rank: '#1 QS World',
      acceptanceRate: '3.9%',
      tuition: '$59,750 / year',
      logo: '🏛️',
      tags: ['Engineering', 'Computer Science', 'AI Hub']
    },
    {
      id: 'upenn',
      name: 'University of Pennsylvania (UPenn)',
      location: 'Philadelphia, PA, USA',
      country: 'USA',
      type: 'Ivy League',
      rank: '#15 QS World',
      acceptanceRate: '5.4%',
      tuition: '$63,452 / year',
      logo: '🎓',
      tags: ['Business', 'Wharton', 'Medicine']
    },
    {
      id: 'stanford',
      name: 'Stanford University',
      location: 'Stanford, CA, USA',
      country: 'USA',
      type: 'Private Research',
      rank: '#4 QS World',
      acceptanceRate: '3.7%',
      tuition: '$61,731 / year',
      logo: '🌲',
      tags: ['Silicon Valley', 'AI & Tech', 'Entrepreneurship']
    },
    {
      id: 'harvard',
      name: 'Harvard University',
      location: 'Cambridge, MA, USA',
      country: 'USA',
      type: 'Ivy League',
      rank: '#5 QS World',
      acceptanceRate: '3.4%',
      tuition: '$57,261 / year',
      logo: '📕',
      tags: ['Law', 'Medicine', 'Global Leadership']
    },
    {
      id: 'imperial',
      name: 'Imperial College London',
      location: 'London, UK',
      country: 'UK',
      type: 'Public Research',
      rank: '#6 QS World',
      acceptanceRate: '14.3%',
      tuition: '£36,700 / year',
      logo: '🇬🇧',
      tags: ['STEM', '1-Yr Masters', 'London Hub']
    },
    {
      id: 'tum',
      name: 'Technical University of Munich (TUM)',
      location: 'Munich, Germany',
      country: 'DE',
      type: 'Tuition-Free Public',
      rank: '#37 QS World',
      acceptanceRate: '28.0%',
      tuition: '€0 (Tuition Free)',
      logo: '🇩🇪',
      tags: ['Automotive', 'Engineering', 'No Tuition']
    },
    {
      id: 'toronto',
      name: 'University of Toronto',
      location: 'Toronto, Canada',
      country: 'CA',
      type: 'Public Research',
      rank: '#21 QS World',
      acceptanceRate: '43.0%',
      tuition: 'CAD $58,000 / year',
      logo: '🇨🇦',
      tags: ['AI Research', 'PR Pathway', 'Top Canada']
    }
  ];

  const filteredUniversities = universities.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'ALL' || u.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      {/* HERO PROMO BANNER */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[20px] p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Global Database</span>
          </div>
          <h2 className="text-[26px] md:text-[34px] font-bold leading-tight">
            USA, UK, Canada &amp; Europe Universities
          </h2>
          <p className="text-[14px] text-white/80 max-w-[600px]">
            Explore 500+ verified universities with real admission criteria, tuition fees, and scholarship opportunities.
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by university name, major, or location..."
              className="w-full h-[48px] pl-11 pr-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] placeholder:text-[#999] outline-none focus:border-[#690B1B]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['ALL', 'USA', 'UK', 'CA', 'DE'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all ${
                  selectedCountry === c
                    ? 'bg-[#690B1B] text-white'
                    : 'bg-[#F7F5F3] text-[#555] hover:bg-[#E7E2DE]'
                }`}
              >
                {c === 'ALL' ? 'All Countries' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* UNIVERSITIES LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[13px] text-[#777] px-2 font-medium">
          <span>Showing {filteredUniversities.length} Universities</span>
          <span>Sorted by QS World Ranking</span>
        </div>

        <div className="space-y-4">
          {filteredUniversities.map((u) => (
            <div
              key={u.id}
              className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs hover:border-[#690B1B] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-[16px] bg-[#F7F0F1] border border-[#690B1B]/15 flex items-center justify-center text-[30px] shrink-0">
                  {u.logo}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/dashboard/schools/${u.id}`} className="text-[18px] font-bold text-[#111] hover:text-[#690B1B] transition-colors">
                      {u.name}
                    </Link>
                    <span className="text-[11px] font-bold bg-[#F7F0F1] text-[#690B1B] px-2.5 py-0.5 rounded-full uppercase">
                      {u.country}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[13px] text-[#777] flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#999]" />
                      {u.location}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-[#111]">{u.type}</span>
                    <span>•</span>
                    <span className="font-bold text-[#C9A55D]">{u.rank}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    {u.tags.map((tag) => (
                      <span key={tag} className="text-[11px] bg-[#F7F5F3] text-[#555] px-2.5 py-1 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* STATS & CTA */}
              <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-[#F0EBE6]">
                <div className="text-left md:text-right">
                  <div className="text-[12px] text-[#777]">Acceptance Rate</div>
                  <div className="text-[16px] font-bold text-[#690B1B]">{u.acceptanceRate}</div>
                  <div className="text-[12px] text-[#888]">{u.tuition}</div>
                </div>

                <Link
                  href={`/dashboard/schools/${u.id}`}
                  className="px-5 py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-1.5 shadow-2xs group-hover:scale-[1.02]"
                >
                  <span>View School</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
