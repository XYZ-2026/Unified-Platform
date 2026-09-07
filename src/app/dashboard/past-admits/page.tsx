'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
  CheckCircle2,
  MapPin,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  BookOpen,
} from 'lucide-react';
import type { AdmittedStudentSummary } from '@/app/api/wix/admitted-students/route';

const MAJOR_FILTERS = [
  { id: 'ALL', label: 'All Majors' },
  { id: 'Computer Science', label: 'Computer Science & AI' },
  { id: 'Business', label: 'Business & Econ' },
  { id: 'Engineering', label: 'Engineering' },
  { id: 'Science', label: 'Sciences' },
  { id: 'Humanities', label: 'Humanities & Social Sciences' },
];

export default function PastAdmitsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<AdmittedStudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '15',
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedMajor !== 'ALL') params.set('major', selectedMajor);

      const res = await fetch(`/api/wix/admitted-students?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setStudents([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.warn('Error loading admitted students:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedMajor]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="p-4 sm:p-5 md:p-8 max-w-[1500px] mx-auto w-full space-y-6">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-[#690B1B] via-[#7A1022] to-[#530816] rounded-[24px] p-6 sm:p-8 text-white shadow-sm space-y-3 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-white/3 rounded-full blur-2xl -mb-32 pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A55D] text-[12px] font-bold backdrop-blur-sm">
            <Sparkles size={14} />
            <span>Verified Admitted Student Profiles</span>
          </div>
          {totalCount > 0 && (
            <span className="text-[12px] text-white/80 bg-white/10 px-3 py-1 rounded-full font-semibold">
              {totalCount} Complete Student Applications
            </span>
          )}
        </div>

        <h1 className="text-[26px] sm:text-[32px] md:text-[38px] font-bold leading-tight relative z-10">
          Admitted Student Profiles
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-white/80 max-w-[700px] leading-relaxed relative z-10">
          Explore complete verified applications of admitted students across top universities. Inspect every detail: weighted & unweighted GPAs, SAT/ACT test scores, full extracurricular lists, accepted essays, and recommendation profiles.
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
              placeholder="Search by student name, admitted college, major, state/country, or SAT score..."
              className="w-full h-[46px] sm:h-[48px] pl-11 pr-4 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[13px] sm:text-[14px] text-[#111] outline-none focus:border-[#690B1B] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
            {MAJOR_FILTERS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMajor(m.id);
                  setCurrentPage(1);
                }}
                className={`h-[38px] px-4 rounded-full text-[12px] sm:text-[13px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center active:scale-95 ${
                  selectedMajor === m.id
                    ? 'bg-[#690B1B] text-white shadow-2xs'
                    : 'bg-[#F7F5F3] text-[#555] hover:bg-[#EAE6E2]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PROFILES LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[12.5px] sm:text-[13px] text-[#777] font-medium px-1">
          <span>
            Showing {students.length} of {totalCount} Verified Profiles
          </span>
          {loading && (
            <span className="inline-flex items-center gap-1.5 text-[#690B1B] text-[12px]">
              <Loader2 size={13} className="animate-spin" />
              <span>Updating results...</span>
            </span>
          )}
        </div>

        {/* LOADING SKELETON */}
        {loading && students.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#E7E2DE] rounded-[22px] p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-6 w-1/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#F7F0F1] text-[#690B1B] mx-auto flex items-center justify-center">
              <GraduationCap size={28} />
            </div>
            <h3 className="text-[18px] font-bold text-[#111]">No Admitted Profiles Found</h3>
            <p className="text-[13.5px] text-[#777] max-w-[420px] mx-auto">
              No profiles match your search criteria. Try clearing or broadening your search filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMajor('ALL');
                setCurrentPage(1);
              }}
              className="px-5 py-2.5 rounded-full bg-[#690B1B] text-white text-[13px] font-bold hover:bg-[#7A1022] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* REAL STUDENTS LIST */
          <div className="space-y-4">
            {students.map((student) => {
              const targetUrl = `/dashboard/past-admits/${student.studentId || student.id}`;
              const avatarLetter = student.studentName ? student.studentName.charAt(0).toUpperCase() : 'S';

              return (
                <div
                  key={student.id}
                  onClick={() => router.push(targetUrl)}
                  className="bg-white border border-[#E7E2DE] hover:border-[#690B1B]/50 hover:shadow-md rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 transition-all duration-200 space-y-4 group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Top Identity & College Section */}
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 aspect-square rounded-full bg-gradient-to-br from-[#690B1B] to-[#91162B] text-white flex items-center justify-center font-bold text-[19px] sm:text-[22px] shadow-sm mt-0.5 sm:mt-0">
                        {avatarLetter}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-[17px] sm:text-[20px] font-bold text-[#111] group-hover:text-[#690B1B] transition-colors leading-tight">
                            {student.studentName}
                          </h2>
                          <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />
                          <span className="text-[11px] font-bold text-[#777] bg-[#F7F5F3] px-2 py-0.5 rounded-md border border-[#E7E2DE]">
                            ID: {student.studentId}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[13px] text-[#444] flex-wrap">
                          <span className="font-semibold text-[#690B1B] flex items-center gap-1">
                            <Building2 size={13} className="shrink-0" />
                            {student.admittedCollege}
                          </span>
                          {student.collegeLocation && (
                            <>
                              <span className="text-[#DDD]">•</span>
                              <span className="text-[#777] flex items-center gap-1">
                                <MapPin size={12} className="shrink-0" />
                                {student.collegeLocation}
                              </span>
                            </>
                          )}
                          {student.collegeType && (
                            <>
                              <span className="text-[#DDD]">•</span>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8EB] text-[#9E731A]">
                                {student.collegeType}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="hidden md:flex items-center gap-2 shrink-0">
                      <Link
                        href={targetUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="h-[40px] px-5 rounded-full bg-[#690B1B] group-hover:bg-[#7A1022] text-white text-[12.5px] sm:text-[13px] font-bold transition-all inline-flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                      >
                        <span>View Full Application</span>
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* STATS & BADGES ROW */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#F0EBE6]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold bg-[#16a34a]/10 text-[#16a34a] px-2.5 py-1 rounded-full whitespace-nowrap">
                        {student.admissionDecision || 'Accepted'}
                      </span>

                      {student.applicationType && (
                        <span className="text-[11px] font-semibold bg-[#F7F5F3] text-[#555] px-2.5 py-1 rounded-full border border-[#E7E2DE] whitespace-nowrap">
                          {student.applicationType}
                        </span>
                      )}

                      <span className="text-[11px] font-bold bg-[#F7F0F1] text-[#690B1B] px-2.5 py-1 rounded-full whitespace-nowrap">
                        Major: {student.intendedMajor}
                      </span>

                      {student.gpaWeighted !== 'N/A' && (
                        <span className="text-[11px] font-bold bg-[#F7F5F3] text-[#333] px-2.5 py-1 rounded-full border border-[#E7E2DE] whitespace-nowrap">
                          GPA: {student.gpaWeighted} (W) {student.gpaUnweighted40 !== 'N/A' ? `/ ${student.gpaUnweighted40} (UW)` : ''}
                        </span>
                      )}

                      {student.satScoreTotal !== 'N/A' && (
                        <span className="text-[11px] font-bold bg-[#FFF8EB] text-[#9E731A] px-2.5 py-1 rounded-full whitespace-nowrap">
                          SAT: {student.satScoreTotal}
                        </span>
                      )}

                      {student.actScore !== 'N/A' && (
                        <span className="text-[11px] font-bold bg-[#FFF8EB] text-[#9E731A] px-2.5 py-1 rounded-full whitespace-nowrap">
                          ACT: {student.actScore}
                        </span>
                      )}
                    </div>

                    {/* COUNTS / BADGES */}
                    <div className="flex items-center gap-3 text-[11.5px] text-[#666] flex-wrap shrink-0">
                      {student.numberOfExtracurriculars > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Activity size={12} className="text-[#690B1B]" />
                          <b>{student.numberOfExtracurriculars}</b> ECs
                        </span>
                      )}
                      {student.numberOfAwards > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Award size={12} className="text-[#C9A55D]" />
                          <b>{student.numberOfAwards}</b> Awards
                        </span>
                      )}
                      {student.numberOfEssays > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <FileText size={12} className="text-[#690B1B]" />
                          <b>{student.numberOfEssays}</b> Essays
                        </span>
                      )}
                    </div>
                  </div>

                  {/* MOBILE FULL-WIDTH ACTION BUTTON */}
                  <div className="md:hidden pt-1">
                    <Link
                      href={targetUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full h-[40px] px-4 rounded-full bg-[#690B1B] text-white text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>View Full Application &amp; Essays</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full text-[12.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentPage === 1
                  ? 'bg-[#F7F5F3] text-[#CCC] cursor-not-allowed'
                  : 'bg-white border border-[#E7E2DE] text-[#555] hover:bg-[#F7F0F1]'
              }`}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <span className="px-3 text-[12.5px] text-[#777] font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full text-[12.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentPage === totalPages
                  ? 'bg-[#F7F5F3] text-[#CCC] cursor-not-allowed'
                  : 'bg-white border border-[#E7E2DE] text-[#555] hover:bg-[#F7F0F1]'
              }`}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
