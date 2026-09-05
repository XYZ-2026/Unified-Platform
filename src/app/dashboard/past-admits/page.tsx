'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Search,
  BookOpen,
  Filter,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
  BarChart3,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function PastAdmitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [majorFilter, setMajorFilter] = useState('ALL');

  const admits = [
    {
      id: 'admit-1',
      name: 'Dhruv Kurup',
      bio: 'Admitted to UPenn Wharton (ED), Georgia Tech & NYU Stern. Built open-source finance software with 5,000+ users.',
      classYear: 'Class of 2028',
      major: 'Business / Finance',
      location: 'India / International',
      sat: '1550',
      gpa: '4.0 / 4.0',
      awards: '8 Awards',
      essays: '14 Essays',
      acceptedSchools: ['UPenn Wharton', 'Georgia Tech', 'NYU Stern', 'Michigan'],
      avatar: 'D'
    },
    {
      id: 'admit-2',
      name: 'Julian D.',
      bio: 'Admitted to Stanford & Harvard CS. Published research paper on NLP in healthcare.',
      classYear: 'Class of 2028',
      major: 'Computer Science',
      location: 'United States',
      sat: '1580',
      gpa: '3.98',
      awards: '5 Awards',
      essays: '12 Essays',
      acceptedSchools: ['Stanford', 'Harvard', 'MIT', 'CMU'],
      avatar: 'J'
    },
    {
      id: 'admit-3',
      name: 'Judy Zhang',
      bio: 'Admitted to MIT & Caltech for Electrical Engineering & Robotics.',
      classYear: 'Class of 2028',
      major: 'Engineering',
      location: 'United States',
      sat: '1570',
      gpa: '4.00',
      awards: '10 Awards',
      essays: '16 Essays',
      acceptedSchools: ['MIT', 'Caltech', 'UC Berkeley', 'Cornell'],
      avatar: 'J'
    },
    {
      id: 'admit-4',
      name: 'Stella W.',
      bio: 'Admitted to Imperial College London & Cambridge for Bioengineering.',
      classYear: 'Class of 2028',
      major: 'Science / Bio',
      location: 'UK / International',
      sat: '1540',
      gpa: '3.95',
      awards: '6 Awards',
      essays: '10 Essays',
      acceptedSchools: ['Imperial College', 'Cambridge', 'UCL'],
      avatar: 'S'
    }
  ];

  const filteredAdmits = admits.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.major.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMajor = majorFilter === 'ALL' || a.major.includes(majorFilter);
    return matchesSearch && matchesMajor;
  });

  return (
    <div className="p-4 sm:p-5 md:p-8 max-w-[1500px] mx-auto w-full space-y-6">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-8 text-white shadow-sm space-y-3 border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[12px] font-bold">
          <Sparkles size={14} />
          <span>Verified Student Database</span>
        </div>
        <h2 className="text-[28px] md:text-[36px] font-bold leading-tight">
          Admitted Student Profiles
        </h2>
        <p className="text-[14px] text-white/80 max-w-[650px]">
          Hundreds of verified admitted student profiles with full statistics, GPAs, test scores, extracurricular lists, and accepted essays.
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-4 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, school, major, or SAT score..."
              className="w-full h-[46px] sm:h-[48px] pl-11 pr-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] sm:text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
            {['ALL', 'Computer Science', 'Business', 'Engineering', 'Science'].map((m) => (
              <button
                key={m}
                onClick={() => setMajorFilter(m)}
                className={`h-[36px] px-3.5 sm:px-4 rounded-full text-[12px] sm:text-[13px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center active:scale-95 ${
                  majorFilter === m ? 'bg-[#690B1B] text-white shadow-2xs' : 'bg-[#F7F5F3] text-[#555] hover:bg-[#EAE6E2]'
                }`}
              >
                {m === 'ALL' ? 'All Majors' : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ADMITTED PROFILES LIST */}
      <div className="space-y-4">
        <div className="text-[12.5px] sm:text-[13px] text-[#777] font-medium px-1">
          Showing {filteredAdmits.length} Verified Admit Profiles
        </div>

        <div className="space-y-4">
          {filteredAdmits.map((admit) => (
            <div
              key={admit.id}
              className="bg-white border border-[#E7E2DE] rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-xs hover:border-[#690B1B]/40 transition-all space-y-4 group"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-4">
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 aspect-square rounded-full bg-[#690B1B] text-white flex items-center justify-center font-bold text-[20px] sm:text-[22px] shadow-sm mt-0.5 sm:mt-0">
                    {admit.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h3 className="text-[18px] sm:text-[20px] font-bold text-[#111] leading-tight">{admit.name}</h3>
                      <CheckCircle2 size={15} className="text-[#16a34a] shrink-0" />
                    </div>
                    <p className="text-[12.5px] sm:text-[13px] text-[#555] max-w-[650px] mt-1 leading-relaxed">
                      {admit.bio}
                    </p>
                  </div>
                </div>

                <button className="hidden md:inline-flex h-[42px] px-5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12.5px] sm:text-[13px] font-bold transition-all items-center justify-center gap-1.5 shadow-2xs shrink-0 whitespace-nowrap cursor-pointer active:scale-95">
                  <span>View Full Profile &amp; Essays</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* STATS AND TAGS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#F0EBE6]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10.5px] sm:text-[11px] font-bold bg-[#F7F0F1] text-[#690B1B] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                    {admit.classYear}
                  </span>
                  <span className="text-[10.5px] sm:text-[11px] font-bold bg-[#F7F5F3] text-[#555] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#E7E2DE] whitespace-nowrap">
                    {admit.major}
                  </span>
                  <span className="text-[10.5px] sm:text-[11px] font-bold bg-[#FFF8EB] text-[#9E731A] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                    SAT: {admit.sat}
                  </span>
                  <span className="text-[10.5px] sm:text-[11px] font-bold bg-[#16a34a]/10 text-[#16a34a] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                    GPA: {admit.gpa}
                  </span>
                </div>

                {/* ACCEPTED SCHOOLS BADGES */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11.5px] sm:text-[12px] font-bold text-[#111] flex-wrap">
                  <span className="text-[#777] font-medium text-[11px]">Accepted to:</span>
                  {admit.acceptedSchools.map((school) => (
                    <span key={school} className="px-2 py-0.5 rounded-md bg-[#F7F5F3] border border-[#E7E2DE] text-[11px] font-semibold">
                      {school}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile Full-Width View Profile Button */}
              <div className="md:hidden pt-1">
                <button className="w-full h-[40px] px-4 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
                  <span>View Full Profile &amp; Essays</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
