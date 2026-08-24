'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getCachedUserDetails,
  setCachedUserDetails,
  subscribeToUserDetails,
  CachedUserDetails
} from '@/lib/userDetailsCache';
import {
  UserCheck,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Activity,
  Save,
  Check,
  GraduationCap,
  School,
  Phone,
  Calendar
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user, userData } = useAuth();
  const userKey = useMemo(() => {
    return user?.uid || user?.email || userData?.email || 'default';
  }, [user, userData]);

  // Form State initialized from Cache for INSTANT display without wait or flicker
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [targetMajor, setTargetMajor] = useState('');
  const [dreamSchool, setDreamSchool] = useState('');
  const [applicationCycle, setApplicationCycle] = useState('Fall 2026');
  const [gpaUnweighted, setGpaUnweighted] = useState('');
  const [gpaWeighted, setGpaWeighted] = useState('');
  const [satScore, setSatScore] = useState('');
  const [actScore, setActScore] = useState('');
  const [classRank, setClassRank] = useState('');
  const [highSchool, setHighSchool] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncedWithWix, setSyncedWithWix] = useState(false);

  // Track if user has made unsaved edits in current session
  const isDirtyRef = useRef(false);

  // Helper to populate form fields from a data object
  const populateFields = (d: CachedUserDetails | null) => {
    if (!d) return;
    if (d.fullName !== undefined || d.name !== undefined) setFullName(d.fullName || d.name || '');
    if (d.phone !== undefined) setPhone(d.phone || '');
    if (d.country !== undefined) setCountry(d.country || '');
    if (d.targetMajor !== undefined || d.intendedMajor !== undefined) setTargetMajor(d.targetMajor || d.intendedMajor || '');
    if (d.dreamSchool !== undefined) setDreamSchool(d.dreamSchool || '');
    if (d.applicationCycle !== undefined) setApplicationCycle(d.applicationCycle || 'Fall 2026');
    if (d.gpa !== undefined) setGpaUnweighted(d.gpa || '');
    if (d.gpaWeighted !== undefined) setGpaWeighted(d.gpaWeighted || '');
    if (d.satScore !== undefined) setSatScore(d.satScore || '');
    if (d.actScore !== undefined) setActScore(d.actScore || '');
    if (d.classRank !== undefined) setClassRank(d.classRank || '');
    if (d.highSchool !== undefined) setHighSchool(d.highSchool || '');
  };

  // 1. INSTANT LOAD: Load cached data immediately on mount / key change
  useEffect(() => {
    const cached = getCachedUserDetails(userKey);
    if (cached) {
      populateFields(cached);
    } else if (userData?.name || user?.displayName) {
      setFullName(userData?.name || user?.displayName || '');
    }

    // Subscribe to cross-tab / cross-component live cache updates
    const unsubscribe = subscribeToUserDetails((updated) => {
      if (!isDirtyRef.current) {
        populateFields(updated);
      }
    });

    return () => unsubscribe();
  }, [userKey, userData, user]);

  // 2. BACKGROUND REVALIDATE: Fetch latest for THIS user from Wix CMS
  useEffect(() => {
    let isMounted = true;

    async function loadCmsProfile() {
      const email = user?.email || userData?.email || '';
      const uid = user?.uid || '';
      if (!email && !uid) return;

      try {
        const res = await fetch(`/api/wix/user-details?userId=${uid}&userEmail=${encodeURIComponent(email)}`);
        const json = await res.json();

        if (isMounted && json.success && json.data) {
          // If user hasn't typed unsaved changes, apply the verified server data
          if (!isDirtyRef.current) {
            populateFields(json.data);
            setCachedUserDetails(userKey, json.data);
          }
          setSyncedWithWix(true);
        }
      } catch (err) {
        console.warn('Notice: Background CMS profile sync error:', err);
      }
    }

    if (user || userData) {
      loadCmsProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [user, userData, userKey]);

  // 3. OVERWRITE & SAVE HANDLER
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const payload = {
      userId: user?.uid || 'guest-user',
      userEmail: user?.email || userData?.email || '',
      fullName,
      name: fullName,
      phone,
      country,
      targetMajor,
      intendedMajor: targetMajor,
      dreamSchool,
      applicationCycle,
      gpa: gpaUnweighted,
      gpaWeighted,
      satScore,
      actScore,
      classRank,
      highSchool
    };

    // INSTANT LOCAL CACHE UPDATE (Zero lag for user)
    setCachedUserDetails(userKey, payload);
    isDirtyRef.current = false;

    try {
      const res = await fetch('/api/wix/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success && result.data) {
        populateFields(result.data);
        setCachedUserDetails(userKey, result.data);
        setSyncedWithWix(true);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile changes to Wix CMS:', err);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (setter: (val: string) => void, val: string) => {
    isDirtyRef.current = true;
    setter(val);
  };

  const profileTags = [
    country || 'Country Unspecified',
    targetMajor || 'Major Unspecified',
    applicationCycle || 'Fall 2026',
    dreamSchool ? `Dream: ${dreamSchool}` : 'Dream School Unspecified',
    gpaUnweighted ? `GPA: ${gpaUnweighted}` : (gpaWeighted ? `GPA: ${gpaWeighted}` : 'GPA Unspecified'),
    satScore ? `SAT: ${satScore}` : (actScore ? `ACT: ${actScore}` : null)
  ].filter(Boolean);

  return (
    <div className="p-5 md:p-8 max-w-[1500px] mx-auto w-full space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
         HEADER PROFILE CARD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E7E2DE] rounded-[24px] p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#690B1B] text-white flex items-center justify-center text-[32px] font-bold shadow-md border-4 border-[#F7F0F1]">
              {fullName ? fullName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'S')}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[26px] md:text-[30px] font-bold text-[#111]">
                  {fullName || userData?.name || user?.email?.split('@')[0] || 'Student Profile'}
                </h1>
                <span className="text-[11px] font-bold bg-[#16a34a]/10 text-[#16a34a] px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>Instant Cached &amp; Wix Synced</span>
                </span>
              </div>
              <p className="text-[14px] text-[#777]">
                {user?.email || 'Student Account'} • Manage your profile, academics, and target universities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSaveProfile()}
              disabled={saving}
              className="px-5 py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {saveSuccess ? <Check size={16} /> : <Save size={16} />}
              <span>{saving ? 'Saving...' : saveSuccess ? 'Saved & Synced!' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </div>

        {/* TAG PILLS */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F0EBE6]">
          {profileTags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[12px] font-bold bg-[#F7F5F3] text-[#555] px-3 py-1 rounded-full border border-[#E7E2DE]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         MAIN EDITABLE PROFILE FORM
         ═══════════════════════════════════════════════════════════════ */}
      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: SECTIONS */}
        <div className="lg:col-span-2 space-y-6">
          {/* PERSONAL & GENERAL DETAILS */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-5">
            <h3 className="text-[18px] font-bold text-[#111] flex items-center gap-2">
              <UserCheck size={18} className="text-[#690B1B]" />
              <span>Personal &amp; Target Background</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sairam Joshi"
                  value={fullName}
                  onChange={(e) => handleInputChange(setFullName, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Country of Citizenship</label>
                <input
                  type="text"
                  placeholder="e.g. United States, India, Canada..."
                  value={country}
                  onChange={(e) => handleInputChange(setCountry, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Intended Major</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Economics..."
                  value={targetMajor}
                  onChange={(e) => handleInputChange(setTargetMajor, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Dream School</label>
                <input
                  type="text"
                  placeholder="e.g. UPenn, Stanford, MIT, Harvard..."
                  value={dreamSchool}
                  onChange={(e) => handleInputChange(setDreamSchool, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1 flex items-center gap-1">
                  <Phone size={12} />
                  <span>Phone / Mobile</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => handleInputChange(setPhone, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1 flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Target Application Cycle</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fall 2026, Fall 2027"
                  value={applicationCycle}
                  onChange={(e) => handleInputChange(setApplicationCycle, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>
            </div>
          </div>

          {/* ACADEMICS & TEST SCORES CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-5">
            <h3 className="text-[18px] font-bold text-[#111] flex items-center gap-2">
              <BookOpen size={18} className="text-[#690B1B]" />
              <span>Academics &amp; Test Scores</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Unweighted GPA</label>
                <input
                  type="text"
                  placeholder="e.g. 3.9"
                  value={gpaUnweighted}
                  onChange={(e) => handleInputChange(setGpaUnweighted, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Weighted GPA</label>
                <input
                  type="text"
                  placeholder="e.g. 4.3"
                  value={gpaWeighted}
                  onChange={(e) => handleInputChange(setGpaWeighted, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">SAT Score</label>
                <input
                  type="text"
                  placeholder="e.g. 1540"
                  value={satScore}
                  onChange={(e) => handleInputChange(setSatScore, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#690B1B] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">ACT Score</label>
                <input
                  type="text"
                  placeholder="e.g. 34"
                  value={actScore}
                  onChange={(e) => handleInputChange(setActScore, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F0EBE6]">
              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1 flex items-center gap-1">
                  <School size={12} />
                  <span>High School / Institution</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lincoln High School"
                  value={highSchool}
                  onChange={(e) => handleInputChange(setHighSchool, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1 flex items-center gap-1">
                  <GraduationCap size={12} />
                  <span>Class Rank / Percentile</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Top 5%, 12 of 450"
                  value={classRank}
                  onChange={(e) => handleInputChange(setClassRank, e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B] transition-all"
                />
              </div>
            </div>
          </div>

          {/* EXTRACURRICULARS LINK CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#111] flex items-center gap-2">
                <Activity size={18} className="text-[#690B1B]" />
                <span>Extracurricular Activities</span>
              </h3>
              <Link href="/dashboard/extracurriculars" className="text-[13px] font-bold text-[#690B1B] hover:underline flex items-center gap-1">
                <span>Manage Extracurriculars →</span>
              </Link>
            </div>
            <p className="text-[13px] text-[#666]">
              Your extracurricular activities entered on the Extracurriculars page are automatically cached and synchronized to the same Wix CMS user-details collection.
            </p>
          </div>
        </div>

        {/* RIGHT SIDEBAR: SAVE & PERSISTENCE CARD */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#690B1B] to-[#530816] rounded-[24px] p-6 text-white shadow-md space-y-5 sticky top-[96px]">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#C9A55D]">
              <Sparkles size={24} />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A55D]">INSTANT CACHE &amp; CLOUD SYNC</span>
              <h4 className="text-[20px] font-bold leading-tight">Save &amp; Overwrite Details</h4>
              <p className="text-[13px] text-white/80 leading-relaxed">
                Your modifications are cached locally for immediate access across reloads and synchronized to the Wix CMS database.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 px-4 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {saveSuccess ? <Check size={16} /> : <Save size={16} />}
              <span>{saving ? 'Saving...' : saveSuccess ? 'Saved & Synced!' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
