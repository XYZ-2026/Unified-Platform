'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  ShieldAlert,
  Moon,
  CheckCircle2,
  LogOut,
  Zap,
  ArrowRight,
  Sparkles,
  Bell
} from 'lucide-react';

export default function SettingsPage() {
  const [transactionalEmails, setTransactionalEmails] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-5 md:p-8 max-w-[1400px] mx-auto w-full space-y-6">
      <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs">
        <h2 className="text-[26px] font-bold text-[#111111] tracking-[-0.03em]">Account Settings &amp; Preferences</h2>
        <p className="text-[13px] text-[#777777]">Manage your profile details, notification preferences, and subscription plan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: PROFILE OVERVIEW & CURRENT PLAN */}
        <div className="space-y-6">
          {/* PROFILE CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-5">
            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-[#F0EBE6]">
              <div className="w-20 h-20 rounded-full bg-[#690B1B] text-white flex items-center justify-center font-bold text-[32px] shadow-sm">
                S
              </div>
              <div>
                <h3 className="text-[20px] font-bold text-[#111]">Sairam Joshi</h3>
                <p className="text-[13px] text-[#777]">sairamjoshi25@gmail.com</p>
              </div>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="flex items-center justify-between py-1">
                <span className="text-[#777] font-medium">Role</span>
                <span className="font-bold text-[#111] bg-[#F7F5F3] px-3 py-1 rounded-full border border-[#E7E2DE]">
                  Applicant
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#777] font-medium">Email Verified</span>
                <span className="font-bold text-[#690B1B] bg-[#F7F0F1] px-3 py-1 rounded-full">
                  False
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#777] font-medium">Joined Date</span>
                <span className="font-bold text-[#111]">8/19/2026</span>
              </div>
            </div>

            <button className="w-full py-2.5 px-4 rounded-full border border-[#E7E2DE] bg-[#FDFCFB] text-[#555] hover:text-[#690B1B] hover:border-[#690B1B] text-[13px] font-bold transition-all flex items-center justify-center gap-2">
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>

          {/* CURRENT PLAN CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[16px] font-bold text-[#111]">Current Plan</h4>
              <span className="text-[11px] font-bold bg-[#C9A55D]/20 text-[#9E731A] px-2.5 py-0.5 rounded-full">
                FREE TIER
              </span>
            </div>
            <div className="text-[28px] font-bold text-[#111]">Free</div>
            <p className="text-[12px] text-[#777] leading-relaxed">
              Standard access to college finder and limited AI SOP reviews.
            </p>
            <button className="w-full py-2.5 px-4 rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white text-[13px] font-bold transition-all shadow-xs">
              Upgrade Plan →
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PREFERENCES & DANGER ZONE */}
        <div className="lg:col-span-2 space-y-6">
          {/* PREFERENCES CARD */}
          <div className="bg-white border border-[#E7E2DE] rounded-[20px] p-6 shadow-xs space-y-6">
            <h3 className="text-[20px] font-bold text-[#111] border-b border-[#F0EBE6] pb-4">
              Notification &amp; Display Preferences
            </h3>

            <div className="space-y-6">
              {/* TOGGLE 1: TRANSACTIONAL EMAILS */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[15px] font-bold text-[#111]">Transactional Emails</h4>
                  <p className="text-[13px] text-[#777]">Only used for login links, password resets, and critical alerts.</p>
                </div>
                <button
                  onClick={() => setTransactionalEmails(!transactionalEmails)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    transactionalEmails ? 'bg-[#690B1B]' : 'bg-[#E7E2DE]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      transactionalEmails ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* TOGGLE 2: MARKETING EMAILS */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[15px] font-bold text-[#111]">Marketing &amp; Tips Emails</h4>
                  <p className="text-[13px] text-[#777]">Receive updates about new admissions tools and curated application tips.</p>
                </div>
                <button
                  onClick={() => setMarketingEmails(!marketingEmails)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    marketingEmails ? 'bg-[#690B1B]' : 'bg-[#E7E2DE]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      marketingEmails ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* TOGGLE 3: DARK MODE */}
              <div className="flex items-center justify-between gap-4 border-t border-[#F0EBE6] pt-4">
                <div>
                  <h4 className="text-[15px] font-bold text-[#111]">Dark Mode</h4>
                  <p className="text-[13px] text-[#777]">Switch between light and dark appearance themes.</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    darkMode ? 'bg-[#690B1B]' : 'bg-[#E7E2DE]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      darkMode ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* DANGER ZONE CARD */}
          <div className="bg-white border border-red-200 rounded-[20px] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-[16px]">
              <ShieldAlert size={20} />
              <span>Danger Zone</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h4 className="text-[15px] font-bold text-[#111]">Delete Account</h4>
                <p className="text-[13px] text-[#777]">Permanently delete your account and all associated application data. This cannot be undone.</p>
              </div>
              <button className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-all shrink-0">
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
