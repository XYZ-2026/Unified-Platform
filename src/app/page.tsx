'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();

  const authTarget = user ? '/dashboard' : '/login';

  return (
    <div className="bg-[#F6F4F2] text-[#111111] overflow-x-hidden font-[Poppins] font-normal min-h-screen flex flex-col">
      {/* ═══════════════════════════════════════════════════════════════
         NAVBAR — Dynamic Auth Buttons (Sign In / Register / Dashboard)
         ═══════════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 w-full bg-[#F6F4F2]/92 backdrop-blur-xl border-b border-[#E7E2DE]">
        <div className="w-full h-[68px] sm:h-[84px] md:h-[92px] px-4 sm:px-5 md:px-8 lg:px-12 flex items-center justify-between">
          {/* LEFT - Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-4 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="relative">
              {/* GLOW */}
              <div className="absolute inset-0 bg-[#690B1B]/10 blur-xl rounded-full" />
              {/* BOX */}
              <div className="relative w-[38px] h-[38px] sm:w-[52px] sm:h-[52px] rounded-[12px] sm:rounded-[16px] bg-gradient-to-br from-[#7A1022] to-[#530816] flex items-center justify-center shadow-[0_10px_30px_rgba(105,11,27,0.22)] border border-white/10">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]">
                  <path
                    d="M12 3L4 9V21H20V9L12 3Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21V12H15V21"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {/* TEXT */}
            <div>
              <div className="text-[16px] sm:text-[20px] md:text-[21px] font-bold tracking-[-0.04em] leading-none text-[#111111]">
                Abroad Simplified
              </div>
              <div className="hidden sm:flex mt-[6px] items-center gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-[#C9A55D]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#A3A3A3]">
                  AI Admissions Platform
                </span>
              </div>
            </div>
          </Link>

          {/* CENTER - Navigation Pills */}
          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 bg-white/70 border border-[#E7E1DD] rounded-full px-3 py-2 shadow-sm backdrop-blur-md">
              {[
                { label: "Universities", href: "#universities" },
                { label: "AI Chance-Me", href: "#chance-me" },
                { label: "SOP Builder", href: "#features" },
                { label: "Scholarships", href: "#features" },
                { label: "Visa Help", href: "#features" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-5 h-[42px] rounded-full flex items-center justify-center text-[15px] font-medium text-[#5F5F5F] hover:bg-[#690B1B] hover:text-white transition-all duration-300"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT - Auth and CTA */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#111] focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[15px] font-bold text-[#690B1B] hover:underline"
                >
                  <span className="w-7 h-7 rounded-full bg-[#690B1B] text-white flex items-center justify-center text-[12px] shrink-0">
                    {userData?.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="hidden sm:flex text-[14px] font-medium text-[#777] hover:text-[#690B1B] transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:flex text-[15px] font-medium text-[#5B5B5B] hover:text-[#690B1B] transition-colors"
                >
                  Sign in
                </Link>

                <Link
                  href="/login"
                  className="group relative h-[40px] sm:h-[50px] px-4 sm:px-7 rounded-full overflow-hidden bg-[#690B1B] text-white text-[13px] sm:text-[15px] font-bold shadow-[0_10px_25px_rgba(105,11,27,0.22)] hover:scale-[1.02] transition-all flex items-center justify-center"
                >
                  {/* SHINE */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                  <span className="relative flex items-center gap-1.5 sm:gap-2">
                    Start Free
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F6F4F2] border-b border-[#E7E2DE] px-6 py-4 flex flex-col gap-3">
            <a href="#universities" className="py-2 text-[#111] font-medium border-b border-[#E7E2DE]" onClick={() => setMobileMenuOpen(false)}>Universities</a>
            <a href="#chance-me" className="py-2 text-[#111] font-medium border-b border-[#E7E2DE]" onClick={() => setMobileMenuOpen(false)}>AI Chance-Me</a>
            <a href="#features" className="py-2 text-[#111] font-medium border-b border-[#E7E2DE]" onClick={() => setMobileMenuOpen(false)}>SOP Builder</a>
            <a href="#features" className="py-2 text-[#111] font-medium border-b border-[#E7E2DE]" onClick={() => setMobileMenuOpen(false)}>Scholarships</a>
            {user ? (
              <Link href="/dashboard" className="py-2 text-[#690B1B] font-bold" onClick={() => setMobileMenuOpen(false)}>Go to Dashboard →</Link>
            ) : (
              <Link href="/login" className="py-2 text-[#690B1B] font-bold" onClick={() => setMobileMenuOpen(false)}>Sign In →</Link>
            )}
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
         HERO SECTION — Layout and styling matched to Research AS
         ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 sm:py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 lg:gap-20 items-center">
        {/* LEFT */}
        <div className="max-w-[540px] w-full">
          <div className="flex items-center gap-2.5 text-[#C4A15F] text-[11px] tracking-[0.18em] uppercase font-bold mb-6">
            <span className="w-[5px] h-[5px] rounded-full bg-[#C4A15F]" />
            AI-POWERED COLLEGE ADMISSIONS
          </div>

          <h1 className="text-[34px] sm:text-[42px] md:text-[56px] lg:text-[64px] leading-[1.02] tracking-[-0.05em] font-bold text-[#0D0D0D]">
            Get Into Your
            <br />
            <span className="text-[#690B1B]">
              Dream School.
            </span>
            <br />
            Build Your Legacy.
          </h1>

          <p className="mt-5 sm:mt-7 text-[14px] sm:text-[15px] md:text-[16px] leading-7 sm:leading-8 text-[#727272] max-w-[500px]">
            Real admitted-student profiles, verified admission metrics, AI Chance-Me predictor,
            and honest real-time SOP feedback. Everything you need for a standout application.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href={authTarget}
              className="h-[54px] px-7 rounded-[10px] bg-[#690B1B] text-white text-[15px] font-bold inline-flex items-center justify-center shadow-[0_10px_30px_rgba(105,11,27,0.22)] hover:bg-[#7A1022] hover:scale-[1.01] transition-all"
            >
              Start Free Today →
            </Link>
            <a
              href="#universities"
              className="h-[54px] px-7 rounded-[10px] border border-[#690B1B]/20 text-[#690B1B] text-[15px] font-semibold inline-flex items-center justify-center hover:bg-[#690B1B]/5 transition-all"
            >
              Explore Universities
            </a>
          </div>

          {/* STATS UNDER HERO */}
          <div className="flex flex-row flex-wrap gap-4 sm:gap-7 border-t border-[#E8E8E8] pt-5 sm:pt-7 mt-8 sm:mt-10 text-[12px] sm:text-[13px] text-[#8B8B8B]">
            <div>
              <strong className="text-[#111] font-bold text-[14px] sm:text-[15px]">
                10,000+
              </strong>{" "}
              students guided
            </div>
            <div>
              <strong className="text-[#111] font-bold text-[14px] sm:text-[15px]">
                500+
              </strong>{" "}
              universities
            </div>
            <div>
              <strong className="text-[#111] font-bold text-[14px] sm:text-[15px]">
                95%
              </strong>{" "}
              admit success rate
            </div>
          </div>
        </div>

        {/* RIGHT CARD — Matches Research Quality Card design */}
        <div className="w-full max-w-[500px] bg-white border border-[#EBEBEB] rounded-[18px] overflow-hidden shadow-sm mx-auto lg:mx-0 lg:justify-self-end">
          {/* TOP BAR */}
          <div className="h-12 sm:h-14 border-b border-[#EFEFEF] flex items-center gap-3 sm:gap-4 px-4 sm:px-5">
            <div className="flex gap-[7px] shrink-0">
              <span className="w-[9px] h-[9px] rounded-full bg-[#DDDDDD]" />
              <span className="w-[9px] h-[9px] rounded-full bg-[#DDDDDD]" />
              <span className="w-[9px] h-[9px] rounded-full bg-[#DDDDDD]" />
            </div>
            <div className="text-[11px] sm:text-[13px] text-[#B2B2B2] font-medium truncate">
              AI Profile Evaluator — app.abroadsimplified.com
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            <div className="inline-flex px-3 py-1.5 rounded-[7px] bg-[#F7F0F1] text-[#690B1B] text-[10px] font-bold tracking-[0.12em] uppercase">
              TARGET: HARVARD &amp; STANFORD
            </div>

            <h3 className="mt-5 text-[18px] leading-[1.45] text-[#111] font-bold">
              Computer Science &amp; Artificial Intelligence (MS / BS)
            </h3>

            <div className="mt-4 flex flex-wrap justify-between text-[12px] sm:text-[13px] text-[#B0B0B0] gap-2">
              <span>Class of 2028 · Verified Admit Data</span>
              <span className="text-[#C4A15F] font-bold">Admit Odds: 88%</span>
            </div>

            <div className="w-full h-px bg-[#EEEEEE] my-4 sm:my-6" />

            {[
              { title: "GPA & Test Score", width: "94%" },
              { title: "Extracurricular Uniqueness", width: "91%" },
              { title: "SOP & Essay Impact", width: "86%" },
              { title: "Research & Honors Alignment", width: "92%" },
            ].map((metric) => (
              <div
                key={metric.title}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[140px_1fr_36px] items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-[12px] sm:text-[13px] text-[#717171]"
              >
                <span className="font-medium text-[#444] col-span-1 sm:col-span-1">{metric.title}</span>
                <div className="hidden sm:block w-full h-[6px] bg-[#ECECEC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#690B1B] rounded-full"
                    style={{ width: metric.width }}
                  />
                </div>
                <span className="font-bold text-[#111] text-right">{metric.width}</span>
                <div className="col-span-2 sm:hidden w-full h-[5px] bg-[#ECECEC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#690B1B] rounded-full"
                    style={{ width: metric.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         STATS BAR — Dark banner matching Research AS
         ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#111217]">
        <div className="grid grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {[
            { num: "10,000+", text: "STUDENTS GUIDED", gold: true },
            { num: "500+", text: "GLOBAL UNIVERSITIES", gold: false },
            { num: "15+", text: "COUNTRIES COVERED", gold: true },
            { num: "95%", text: "VISA SUCCESS RATE", gold: false },
          ].map((item) => (
            <div
              key={item.text}
              className="h-[120px] sm:h-[145px] border-r border-b lg:border-b-0 border-white/5 flex flex-col items-center justify-center p-3 sm:p-4"
            >
              <h2
                className={`text-[32px] sm:text-[40px] md:text-[46px] font-bold leading-none ${
                  item.gold ? "text-[#C9A55D]" : "text-white"
                }`}
              >
                {item.num}
              </h2>
              <p className="mt-2 sm:mt-3 text-[#6E7380] text-[10px] sm:text-[12px] tracking-[0.1em] sm:tracking-[0.14em] font-semibold text-center">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         THE ADMISSIONS JOURNEY — Step process matching Research AS
         ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#F7F5F3] px-4 sm:px-5 md:px-8 py-12 sm:py-20 lg:py-24 text-center">
        <div className="text-[#C9A55D] text-[12px] tracking-[0.22em] font-bold uppercase mb-4">
          THE ADMISSIONS JOURNEY
        </div>
        <h2 className="text-[28px] sm:text-[36px] md:text-[52px] font-bold tracking-[-0.04em] text-[#090909] px-2">
          From target list to acceptance letter
        </h2>

        <div className="max-w-7xl mx-auto mt-12 sm:mt-20 relative">
          <div className="hidden lg:block absolute top-5 left-[9%] w-[82%] h-px bg-[#EAD9DD]" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 relative z-10">
            {[
              { num: "01", title: "Discovery", desc: "Find target, reach & safety schools", active: true },
              { num: "02", title: "Profile Evaluation", desc: "AI Chance-Me & stats comparison", active: false },
              { num: "03", title: "SOP Builder", desc: "Craft compelling essays with AI guidance", active: false },
              { num: "04", title: "Scholarships", desc: "Match funding & grant opportunities", active: false },
              { num: "05", title: "Visa & Admit", desc: "Document check & mock interview", active: false },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div
                  className={`w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full flex items-center justify-center text-[14px] sm:text-[16px] font-bold ${
                    step.active
                      ? "bg-[#690B1B] text-white"
                      : "border border-[#D9BFC5] text-[#690B1B]"
                  }`}
                >
                  {step.num}
                </div>
                <h3 className="mt-4 sm:mt-6 text-[16px] sm:text-[20px] font-bold text-[#111]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[12px] sm:text-[14px] text-[#888888] max-w-[160px] sm:max-w-[200px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         TOP STUDY DESTINATIONS — Grid layout
         ═══════════════════════════════════════════════════════════════ */}
      <section id="universities" className="px-4 sm:px-5 md:px-8 py-12 sm:py-20 lg:py-24 bg-[#F6F4F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-[#C9A55D] text-[12px] tracking-[0.2em] font-bold uppercase mb-3">
            GLOBAL REACH
          </div>
          <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold tracking-[-0.04em] text-[#111]">
            Top Study Destinations
          </h2>
          <p className="mt-3 text-[16px] text-[#727272] max-w-[600px]">
            Compare programs across premier global hubs with verified tuition, rankings, and visa options.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 mt-8 sm:mt-12">
            {[
              { code: "USA", flag: "🇺🇸", name: "United States", count: "180+ Universities", desc: "Ivy League & top STEM research institutions" },
              { code: "UK", flag: "🇬🇧", name: "United Kingdom", count: "120+ Universities", desc: "Russell Group & 1-year Master programs" },
              { code: "CA", flag: "🇨🇦", name: "Canada", count: "85+ Universities", desc: "Post-study work permits & PR pathways" },
              { code: "AU", flag: "🇦🇺", name: "Australia", count: "60+ Universities", desc: "Group of Eight & high quality of life" },
              { code: "DE", flag: "🇩🇪", name: "Germany", count: "55+ Universities", desc: "Tuition-free public universities & tech hubs" },
            ].map((item) => (
              <div
                key={item.code}
                className="bg-white border border-[#E7E2DE] rounded-[16px] p-6 hover:border-[#690B1B] hover:-translate-y-1 transition-all shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[32px]">{item.flag}</span>
                  <span className="text-[11px] font-bold text-[#690B1B] bg-[#F7F0F1] px-2.5 py-1 rounded-full uppercase">
                    {item.code}
                  </span>
                </div>
                <h3 className="text-[18px] font-bold text-[#111] mb-1">{item.name}</h3>
                <div className="text-[13px] font-bold text-[#690B1B] mb-2">{item.count}</div>
                <p className="text-[13px] text-[#777777] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         PLATFORM FEATURES — Grid matching Research AS
         ═══════════════════════════════════════════════════════════════ */}
      <section id="features" className="px-4 sm:px-5 md:px-8 py-12 sm:py-20 lg:py-24 bg-[#F7F5F3]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-8 border-b border-[#E7E1DE] pb-10">
          <div>
            <div className="text-[#C9A55D] text-[12px] tracking-[0.2em] font-bold uppercase mb-4">
              PLATFORM FEATURES
            </div>
            <h2 className="text-[28px] sm:text-[36px] md:text-[52px] leading-[1.08] font-bold tracking-[-0.05em] text-[#111]">
              Everything you need
              <br />
              to get admitted
            </h2>
          </div>
          <div className="max-w-full lg:max-w-[340px] text-left lg:text-right text-[#909090] text-[14px] sm:text-[15px] leading-7 pt-0 sm:pt-3">
            From university discovery to final visa approval — every tool you need in one elegant workspace.
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-[#DDD7D3] rounded-[20px] overflow-hidden">
          {[
            { num: "01", title: "University Matcher", desc: "Filter 500+ global universities by budget, acceptance rate, and major." },
            { num: "02", title: "AI Chance-Me Predictor", desc: "Estimate real odds by comparing your stats against past admitted students." },
            { num: "03", title: "AI SOP Feedback", desc: "Ethical, real-time essay analysis grounded in thousands of successful SOPs." },
            { num: "04", title: "Scholarship Finder", desc: "Discover merit and need-based grants matched to your student profile." },
            { num: "05", title: "Application Tracker", desc: "Never miss deadlines, document requirements, or portal submissions." },
            { num: "06", title: "Visa & Document Guide", desc: "Tailored checklists, financial proof guides, and mock visa interview tools." },
          ].map((feature) => (
            <div
              key={feature.num}
              className="bg-[#F7F5F3] min-h-[200px] sm:min-h-[260px] p-5 sm:p-8 border-r border-b border-[#DDD7D3] hover:bg-white transition-colors"
            >
              <div className="text-[#D8C1C6] text-[16px] font-bold">
                {feature.num}
              </div>
              <h3 className="mt-6 text-[22px] font-bold tracking-[-0.03em] text-[#111]">
                {feature.title}
              </h3>
              <p className="mt-3 text-[14px] leading-7 text-[#777777]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         DARK SECTION — AI Advisor Interactive Feature Showcase
         ═══════════════════════════════════════════════════════════════ */}
      <section id="chance-me" className="w-full bg-[#050505] px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* LEFT */}
          <div className="max-w-[540px]">
            <div className="text-[#C9A55D] text-[12px] tracking-[0.22em] uppercase font-bold mb-6">
              AI ADMISSIONS ADVISOR
            </div>

            <h2 className="text-white text-[30px] sm:text-[42px] md:text-[58px] leading-[1.05] tracking-[-0.05em] font-bold">
              Personalized guidance
              <br />
              grounded in real
              <br />
              admit outcomes
            </h2>

            <p className="mt-8 text-[#8A8A8A] text-[16px] md:text-[17px] leading-[2.1] max-w-[500px]">
              Ask anything from building a balanced university list to sharpening your Statement of Purpose.
              Our AI provides honest, data-backed feedback without ever writing your essay for you.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-8 sm:mt-10">
              {["GPA & Test Analysis", "Essay Tone Check", "Scholarship Match", "Visa Interview Prep"].map((tag) => (
                <div
                  key={tag}
                  className="h-[38px] sm:h-[42px] px-3 sm:px-5 rounded-[10px] border border-white/10 bg-[#0B0B0B] text-[#BEBEBE] text-[13px] sm:text-[14px] flex items-center"
                >
                  {tag}
                </div>
              ))}
            </div>

            <Link
              href={authTarget}
              className="mt-8 sm:mt-12 h-[50px] sm:h-[56px] px-6 sm:px-8 rounded-[14px] bg-[#690B1B] text-white text-[14px] sm:text-[16px] font-bold hover:bg-[#7A1022] transition-all inline-flex items-center justify-center shadow-[0_10px_25px_rgba(105,11,27,0.3)] w-full sm:w-auto text-center"
            >
              Try AI Admissions Advisor Free →
            </Link>
          </div>

          {/* RIGHT — Dark Chat Widget Simulation */}
          <div className="flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-[440px] rounded-[18px] border border-white/10 bg-[#111114] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)] min-w-0">
              <div className="h-[70px] border-b border-white/10 px-6 flex items-center gap-3">
                <div className="w-[8px] h-[8px] rounded-full bg-[#C9A55D]" />
                <div className="text-[#8B7B63] tracking-[0.08em] text-[13px] font-bold uppercase">
                  Abroad Simplified AI Advisor
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* User Message */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-[#3A2D18] text-[#D7B16A] text-[12px] flex items-center justify-center shrink-0 font-bold">
                    ST
                  </div>
                  <div className="bg-[#1B1D25] rounded-[14px] px-4 sm:px-5 py-4 max-w-[260px] sm:max-w-[300px] text-[#D8D8D8] text-[13px] sm:text-[14px] leading-[1.8]">
                    I have a 3.7 GPA and 324 GRE. What are my realistic chances for Computer Science at CMU and Imperial?
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-[#4A111A] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" className="w-[16px] h-[16px]">
                      <path d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z" fill="#E2B564" />
                    </svg>
                  </div>
                  <div className="bg-[#2A1116] rounded-[14px] px-5 py-5 max-w-[310px]">
                    <div className="text-[#B58C8F] text-[14px] leading-[1.8] mb-4">
                      Based on 1,400+ historical applicant data points:
                    </div>
                    <div className="border-l-2 border-[#C9A55D] pl-4 space-y-3 text-[#F0ECE8] text-[14px] leading-[1.8]">
                      <div>
                        <strong className="text-white">Imperial College:</strong> Target School (Admit Chance: ~68%)
                      </div>
                      <div>
                        <strong className="text-white">Carnegie Mellon:</strong> Reach School (Admit Chance: ~42%)
                      </div>
                      <div className="text-[13px] text-[#C4A15F] font-semibold pt-1">
                        💡 Tip: Highlighting undergraduate research project will boost CMU odds by 18%.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="border-t border-white/10 p-3 sm:p-4 flex gap-2 sm:gap-3 bg-[#111114]">
                <input
                  type="text"
                  placeholder="Ask about target schools, SOP..."
                  className="flex-1 h-[44px] sm:h-[48px] rounded-[12px] bg-[#1B1B1B] border border-white/10 px-3 sm:px-4 text-[13px] sm:text-[14px] text-white outline-none placeholder:text-[#6D6D6D] min-w-0"
                  readOnly
                />
                <button className="h-[44px] sm:h-[48px] px-4 sm:px-5 rounded-[12px] bg-[#690B1B] text-white text-[13px] sm:text-[14px] font-bold hover:bg-[#7A1022] transition-all shrink-0">
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         FAQ SECTION — 2-Column Grid Card Layout
         ═══════════════════════════════════════════════════════════════ */}
      <section id="faq" className="my-12 sm:my-20 max-w-7xl mx-auto px-4 sm:px-5 md:px-10">
        <div className="text-center mb-12">
          <div className="text-[#C9A55D] text-[12px] tracking-[0.22em] font-bold uppercase mb-3">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-[24px] sm:text-[32px] md:text-[44px] font-bold text-[#111] tracking-[-0.03em]">
            Everything You Need to Know About Studying Abroad
          </h2>
          <p className="mt-3 text-[#727272] text-[15px] max-w-xl mx-auto">
            Got questions about university selection, scholarships, or visa procedures? We have answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "How does the AI University Finder predict my admit chances?",
              a: "Our algorithm compares your academic profile (GPA, GRE/GMAT, IELTS/TOEFL) and target budget against actual historical admission data to categorize schools into Safety, Target, and Reach."
            },
            {
              q: "Can I find tuition-free universities in Germany & Europe?",
              a: "Yes! Abroad Simplified catalogues tuition-free German public universities and affordable European programs alongside merit-based global scholarship grants."
            },
            {
              q: "How does the AI SOP Feedback tool work?",
              a: "Our SOP guidance framework analyzes your draft for structure, story alignment, and impact. It gives actionable suggestions without writing the essay for you, keeping your application authentic."
            },
            {
              q: "Is my personal data and SOP draft kept private?",
              a: "Absolutely. Your drafts, personal details, and profile information remain 100% private to you and are never shared or published without your explicit consent."
            }
          ].map((item, i) => (
            <div key={i} className="p-7 bg-white rounded-[16px] border border-[#E7E2DE] shadow-sm hover:border-[#690B1B]/40 transition-all">
              <h3 className="text-[17px] font-bold text-[#111] mb-3">
                {item.q}
              </h3>
              <p className="text-[#666666] text-[14px] leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         CTA BANNER — Burgundy banner matching Research AS
         ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full overflow-hidden mt-auto">
        <div className="bg-[#73061C] px-4 sm:px-6 md:px-10 py-14 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-white font-bold tracking-[-0.05em] leading-[1.02]">
              <span className="block text-[32px] sm:text-[46px] md:text-[64px]">
                Start building your
              </span>
              <span className="block mt-2 sm:mt-3 text-[#C8A15D] italic text-[32px] sm:text-[46px] md:text-[64px] leading-tight">
                study abroad legacy
              </span>
              <span className="block mt-1 text-white text-[32px] sm:text-[46px] md:text-[64px] leading-tight">
                today
              </span>
            </h2>

            <p className="mt-6 sm:mt-8 text-[#D6AEB7] text-[14px] sm:text-[15px] md:text-[18px] leading-[1.9] sm:leading-[2.1] max-w-[760px] mx-auto px-2">
              Join 10,000+ ambitious students already finding target universities, crafting standout SOPs, and securing admissions worldwide.
            </p>

            <Link
              href={authTarget}
              className="mt-8 sm:mt-10 w-full sm:w-auto h-[54px] sm:h-[58px] px-6 sm:px-10 rounded-[14px] bg-white text-[#5B0819] text-[15px] sm:text-[17px] font-bold hover:scale-[1.02] transition-all inline-flex items-center justify-center shadow-lg"
            >
              Begin Your Study Abroad Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         FOOTER — Exact match to Research Abroad Simplified Footer
         ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#030303] px-4 sm:px-6 md:px-10 lg:px-16 pt-12 sm:pt-16 md:pt-20 pb-8 text-left">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
            {/* BRAND */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 max-w-[300px]">
              <Link href="/" className="text-white text-[28px] leading-none font-bold hover:opacity-90 transition-opacity">
                Abroad Simplified
              </Link>
              <p className="mt-6 text-[#5E6168] text-[15px] leading-[2]">
                Think Beyond Your Boundaries. Your ultimate AI-powered study abroad platform.
              </p>
            </div>

            {/* TOOLS */}
            <div>
              <div className="text-[#C8A15D] text-[11px] tracking-[0.24em] uppercase font-bold mb-6">
                Platform Tools
              </div>
              <div className="space-y-4">
                {[
                  { label: "University Finder", href: "#universities" },
                  { label: "AI Chance-Me Predictor", href: "#chance-me" },
                  { label: "SOP Builder", href: "#features" },
                  { label: "Scholarship Matcher", href: "#features" },
                  { label: "Visa Guidance", href: "#features" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[15px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* DESTINATIONS */}
            <div>
              <div className="text-[#C8A15D] text-[11px] tracking-[0.24em] uppercase font-bold mb-6">
                Destinations
              </div>
              <div className="space-y-4">
                {[
                  { label: "Study in USA", href: "#universities" },
                  { label: "Study in UK", href: "#universities" },
                  { label: "Study in Germany", href: "#universities" },
                  { label: "Study in Canada", href: "#universities" },
                  { label: "Study in Australia", href: "#universities" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[15px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* COMPANY */}
            <div>
              <div className="text-[#C8A15D] text-[11px] tracking-[0.24em] uppercase font-bold mb-6">
                Company
              </div>
              <div className="space-y-4">
                {[
                  { label: "About Us", href: "/" },
                  { label: "Research Platform", href: "/" },
                  { label: "Blog & Guides", href: "/" },
                  { label: "Contact & Support", href: "/" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[15px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="w-full h-px bg-white/5 mt-16 md:mt-20 mb-6" />

          {/* BOTTOM */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[#5E6168] text-[14px] text-center md:text-left">
              © 2026 Abroad Simplified. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-[#5E6168] text-[14px]">
              <Link href="/" className="hover:text-white transition cursor-pointer">
                Privacy Policy
              </Link>
              <Link href="/" className="hover:text-white transition cursor-pointer">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
