'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LandingNavbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F6F4F2]/92 backdrop-blur-xl border-b border-[#E7E2DE]">
      <div className="w-full h-[68px] sm:h-[84px] md:h-[92px] px-4 sm:px-5 md:px-8 lg:px-12 flex items-center justify-between">
        {/* LEFT - Logo & Website Name */}
        <Link href="/" className="flex items-center gap-3 sm:gap-4 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="relative w-[44px] h-[44px] sm:w-[54px] sm:h-[54px] rounded-[14px] sm:rounded-[16px] shadow-[0_6px_20px_rgba(105,11,27,0.22)] overflow-hidden shrink-0">
            <Image src="/logo.png" alt="Abroad Simplified Logo" width={54} height={54} priority className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[17px] sm:text-[20px] md:text-[22px] font-bold tracking-[-0.03em] leading-none text-[#111111]">
              Abroad Simplified
            </div>
            <div className="hidden sm:flex mt-[5px] items-center gap-1.5">
              <span className="w-[4px] h-[4px] rounded-full bg-[#C9A55D]" />
              <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#A3A3A3]">
                AI Admissions Platform
              </span>
            </div>
          </div>
        </Link>

        {/* CENTER - Navigation Pills */}
        <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 bg-white/70 border border-[#E7E1DD] rounded-full px-3 py-2 shadow-sm backdrop-blur-md">
            {[
              { label: "Universities", targetId: "universities", href: "#universities", dashboardHref: "/dashboard/schools" },
              { label: "AI Chance-Me", targetId: "chance-me", href: "#chance-me", dashboardHref: "/dashboard/chance-me" },
              { label: "SOP Builder", targetId: "features", href: "#features", dashboardHref: "/dashboard/essays" },
              { label: "Scholarships", targetId: "scholarships", href: "https://scholarship.abroadsimplified.com", isExternal: true },
              { label: "Visa Help", targetId: "features", href: "#features", dashboardHref: "/dashboard/visa" },
            ].map((item) => (
              item.isExternal ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 h-[42px] rounded-full flex items-center justify-center text-[15px] font-medium text-[#5F5F5F] hover:bg-[#690B1B] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (user && item.dashboardHref) {
                      e.preventDefault();
                      router.push(item.dashboardHref);
                    } else {
                      handleScrollTo(e, item.targetId);
                    }
                  }}
                  className="px-5 h-[42px] rounded-full flex items-center justify-center text-[15px] font-medium text-[#5F5F5F] hover:bg-[#690B1B] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  {item.label}
                </a>
              )
            ))}
          </div>
        </div>

        {/* RIGHT - Auth and CTA */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#111] focus:outline-none shrink-0"
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
                className="flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[15px] font-bold text-[#690B1B] hover:underline whitespace-nowrap shrink-0"
              >
                <span className="w-7 h-7 rounded-full bg-[#690B1B] text-white flex items-center justify-center text-[12px] shrink-0">
                  {userData?.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="hidden sm:inline whitespace-nowrap">Dashboard</span>
              </Link>
              <button
                onClick={() => logout()}
                className="hidden sm:flex text-[14px] font-medium text-[#777] hover:text-[#690B1B] transition-colors whitespace-nowrap"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:flex text-[15px] font-medium text-[#5B5B5B] hover:text-[#690B1B] transition-colors whitespace-nowrap"
              >
                Sign in
              </Link>

              <Link
                href="/login"
                className="group relative h-[38px] sm:h-[46px] md:h-[50px] px-3.5 sm:px-6 rounded-full overflow-hidden bg-[#690B1B] text-white text-[12px] sm:text-[14px] md:text-[15px] font-bold shadow-[0_10px_25px_rgba(105,11,27,0.22)] hover:scale-[1.02] transition-all flex items-center justify-center whitespace-nowrap shrink-0"
              >
                {/* SHINE */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                <span className="relative flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                  Start Free
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-[#E7E2DE] shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
          <div className="px-5 py-5 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A3A3A3] mb-3 px-1">Platform Navigation</div>
            {[
              {
                label: "Universities",
                targetId: "universities",
                href: "#universities",
                dashboardHref: "/dashboard/schools",
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-5.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                ),
              },
              {
                label: "AI Chance-Me",
                targetId: "chance-me",
                href: "#chance-me",
                dashboardHref: "/dashboard/chance-me",
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                label: "SOP Builder",
                targetId: "features",
                href: "#features",
                dashboardHref: "/dashboard/essays",
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
              {
                label: "Scholarships",
                targetId: "scholarships",
                href: "https://scholarship.abroadsimplified.com",
                isExternal: true,
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4a5 5 0 005 5h4a5 5 0 005-5V3M5 3h14M5 3H3v2a4 4 0 004 4h1M19 3h2v2a4 4 0 01-4 4h-1M12 12v6m-4 3h8" />
                  </svg>
                ),
              },
              {
                label: "Visa Help",
                targetId: "features",
                href: "#features",
                dashboardHref: "/dashboard/visa",
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                ),
              },
            ].map((item) => (
              item.isExternal ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 py-2.5 px-3 rounded-[14px] text-[15px] font-semibold text-[#111111] hover:bg-[#F7F0F1] hover:text-[#690B1B] transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F7F0F1] border border-[#E8C4CC] text-[#690B1B] flex items-center justify-center shrink-0 group-hover:bg-[#690B1B] group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (user && item.dashboardHref) {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      router.push(item.dashboardHref);
                    } else {
                      handleScrollTo(e, item.targetId);
                    }
                  }}
                  className="flex items-center gap-3.5 py-2.5 px-3 rounded-[14px] text-[15px] font-semibold text-[#111111] hover:bg-[#F7F0F1] hover:text-[#690B1B] transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F7F0F1] border border-[#E8C4CC] text-[#690B1B] flex items-center justify-center shrink-0 group-hover:bg-[#690B1B] group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </a>
              )
            ))}
            <div className="pt-4 border-t border-[#F0EBE6] mt-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center w-full py-3.5 rounded-[14px] bg-[#690B1B] text-white font-bold text-[15px] shadow-[0_6px_20px_rgba(105,11,27,0.22)] hover:bg-[#7A1022] transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full py-3.5 rounded-[14px] bg-[#690B1B] text-white font-bold text-[15px] shadow-[0_6px_20px_rgba(105,11,27,0.22)] hover:bg-[#7A1022] transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
