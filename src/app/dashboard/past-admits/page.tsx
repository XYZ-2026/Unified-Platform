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
    <div className="p-5 md:p-8 max-w-[1500px] mx-auto w-full space-y-6">
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
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, school, major, or SAT score..."
              className="w-full h-[48px] pl-11 pr-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['ALL', 'Computer Science', 'Business', 'Engineering', 'Science'].map((m) => (
              <button
                key={m}
                onClick={() => setMajorFilter(m)}
                className={`px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all ${
                  majorFilter === m ? 'bg-[#690B1B] text-white' : 'bg-[#F7F5F3] text-[#555]'
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
        <div className="text-[13px] text-[#777] font-medium px-2">
          Showing {filteredAdmits.length} Verified Admit Profiles
        </div>

        <div className="space-y-4">
          {filteredAdmits.map((admit) => (
            <div
              key={admit.id}
              className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 shadow-xs hover:border-[#690B1B] transition-all space-y-5 group"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#690B1B] text-white flex items-center justify-center font-bold text-[22px] shadow-sm">
                    {admit.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[20px] font-bold text-[#111]">{admit.name}</h3>
                      <CheckCircle2 size={16} className="text-[#16a34a]" />
                    </div>
                    <p className="text-[13px] text-[#555] max-w-[650px] mt-0.5 leading-relaxed">
                      {admit.bio}
                    </p>
                  </div>
                </div>

                <button className="px-5 py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-1.5 shadow-2xs self-end md:self-center shrink-0">
                  <span>View Full Profile &amp; Essays</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* STATS AND TAGS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#F0EBE6]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold bg-[#F7F0F1] text-[#690B1B] px-3 py-1 rounded-full">
                    {admit.classYear}
                  </span>
                  <span className="text-[11px] font-bold bg-[#F7F5F3] text-[#555] px-3 py-1 rounded-full border border-[#E7E2DE]">
                    {admit.major}
                  </span>
                  <span className="text-[11px] font-bold bg-[#FFF8EB] text-[#9E731A] px-3 py-1 rounded-full">
                    SAT: {admit.sat}
                  </span>
                  <span className="text-[11px] font-bold bg-[#16a34a]/10 text-[#16a34a] px-3 py-1 rounded-full">
                    GPA: {admit.gpa}
                  </span>
                </div>

                {/* ACCEPTED SCHOOLS BADGES */}
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#111] flex-wrap">
                  <span className="text-[#777] font-medium text-[11px]">Accepted to:</span>
                  {admit.acceptedSchools.map((school) => (
                    <span key={school} className="px-2.5 py-0.5 rounded-md bg-[#F7F5F3] border border-[#E7E2DE]">
                      {school}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
