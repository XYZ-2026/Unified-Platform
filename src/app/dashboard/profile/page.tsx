'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  UserCheck,
  Plus,
  Sparkles,
  BarChart3,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Activity,
  ArrowRight,
  Share2,
  Save,
  Globe,
  Building2,
  Check
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user, userData } = useAuth();
  const [profileStep, setProfileStep] = useState(3);

  // Form State initialized from Wix CMS / Onboarding
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [targetMajor, setTargetMajor] = useState('');
  const [dreamSchool, setDreamSchool] = useState('');
  const [applicationCycle, setApplicationCycle] = useState('');
  const [gpaUnweighted, setGpaUnweighted] = useState('');
  const [gpaWeighted, setGpaWeighted] = useState('');
  const [satScore, setSatScore] = useState('');
  const [actScore, setActScore] = useState('');
  const [classRank, setClassRank] = useState('');
  const [highSchool, setHighSchool] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadingCms, setLoadingCms] = useState(true);

  // Fetch CMS data on mount
  useEffect(() => {
    async function loadCmsProfile() {
      try {
        setLoadingCms(true);
        const email = user?.email || userData?.email || '';
        const uid = user?.uid || '';

        const res = await fetch(`/api/wix/user-details?userId=${uid}&userEmail=${encodeURIComponent(email)}`);
        const json = await res.json();

        if (json.success && json.data) {
          const d = json.data;
          setFullName(d.fullName || d.name || userData?.name || '');
          setPhone(d.phone || '');
          setCountry(d.country || '');
          setTargetMajor(d.targetMajor || '');
          setDreamSchool(d.dreamSchool || '');
          setApplicationCycle(d.applicationCycle || '');
          setGpaUnweighted(d.gpa || '');
          setGpaWeighted(d.gpaWeighted || '');
          setSatScore(d.satScore || '');
          setActScore(d.actScore || '');
          setClassRank(d.classRank || '');
          setHighSchool(d.highSchool || '');
        }
      } catch (err) {
        console.error('Error fetching CMS profile details:', err);
      } finally {
        setLoadingCms(false);
      }
    }

    if (user) {
      loadCmsProfile();
    } else {
      setLoadingCms(false);
    }
  }, [user, userData]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        userId: user?.uid || 'guest-user',
        userEmail: user?.email || userData?.email || '',
        fullName,
        phone,
        country,
        targetMajor,
        dreamSchool,
        applicationCycle,
        gpa: gpaUnweighted,
        gpaWeighted,
        satScore,
        actScore,
        classRank,
        highSchool
      };

      const res = await fetch('/api/wix/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving profile changes to Wix CMS:', err);
    } finally {
      setSaving(false);
    }
  };

  const profileTags = [
    country || 'Country Unspecified',
    targetMajor || 'Major Unspecified',
    applicationCycle || 'Cycle Unspecified',
    dreamSchool ? `Dream: ${dreamSchool}` : 'Dream School Unspecified',
    gpaUnweighted ? `GPA: ${gpaUnweighted}` : 'GPA Unspecified'
  ];

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
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] md:text-[30px] font-bold text-[#111]">
                  {fullName || userData?.name || user?.email?.split('@')[0] || 'Student Profile'}
                </h1>
                <span className="text-[11px] font-bold bg-[#16a34a]/10 text-[#16a34a] px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>Wix CMS Synced</span>
                </span>
              </div>
              <p className="text-[14px] text-[#777]">
                {user?.email || 'Student Account'} • Manage your profile, academics, and target universities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-5 py-2.5 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {saveSuccess ? <Check size={16} /> : <Save size={16} />}
              <span>{saving ? 'Saving to Wix...' : saveSuccess ? 'Saved to Wix CMS!' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </div>

        {/* TAG PILLS FETCHED FROM ONBOARDING */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F0EBE6]">
          {profileTags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] font-bold bg-[#F7F5F3] text-[#555] px-3 py-1 rounded-full border border-[#E7E2DE]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         MAIN EDITABLE PROFILE FORM (ONBOARDING DATA POPULATED)
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
                  placeholder="Enter full name..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Country of Citizenship</label>
                <input
                  type="text"
                  placeholder="Enter country..."
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Intended Major</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science & AI..."
                  value={targetMajor}
                  onChange={(e) => setTargetMajor(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Dream School</label>
                <input
                  type="text"
                  placeholder="e.g. UPenn, Harvard..."
                  value={dreamSchool}
                  onChange={(e) => setDreamSchool(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>
            </div>
          </div>

          {/* ACADEMICS CARD */}
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
                  onChange={(e) => setGpaUnweighted(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">Weighted GPA</label>
                <input
                  type="text"
                  placeholder="e.g. 4.3"
                  value={gpaWeighted}
                  onChange={(e) => setGpaWeighted(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">SAT Score</label>
                <input
                  type="text"
                  placeholder="e.g. 1540"
                  value={satScore}
                  onChange={(e) => setSatScore(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#690B1B] outline-none focus:border-[#690B1B]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#777] block mb-1">ACT Score</label>
                <input
                  type="text"
                  placeholder="e.g. 34"
                  value={actScore}
                  onChange={(e) => setActScore(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[15px] font-bold text-[#111] outline-none focus:border-[#690B1B]"
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
              Your extracurricular activities entered on the Extracurriculars page are automatically synced and stored in the same Wix CMS user-details collection.
            </p>
          </div>
        </div>

        {/* RIGHT SIDEBAR: SAVE & EVALUATE */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#690B1B] to-[#530816] rounded-[24px] p-6 text-white shadow-md space-y-5 sticky top-[96px]">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#C9A55D]">
              <Sparkles size={24} />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A55D]">WIX CMS SYNC</span>
              <h4 className="text-[20px] font-bold leading-tight">Save &amp; Update Profile</h4>
              <p className="text-[13px] text-white/80 leading-relaxed">
                Clicking save updates your profile details across the entire platform and Wix CMS database.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 px-4 rounded-full bg-[#C9A55D] hover:bg-[#b8924b] text-black font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {saveSuccess ? <Check size={16} /> : <Save size={16} />}
              <span>{saving ? 'Saving...' : saveSuccess ? 'Saved to Wix CMS!' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
