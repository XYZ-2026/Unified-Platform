'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getCachedUserDetails, subscribeToUserDetails } from '@/lib/userDetailsCache';
import {
  Home,
  Sparkles,
  GraduationCap,
  Calendar,
  FileText,
  UserCheck,
  BookOpen,
  Zap,
  Bell,
  Settings,
  Compass,
  Award,
  BarChart3,
  Menu,
  Activity,
  User,
  X,
  Calculator,
  ArrowLeftRight
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, userData } = useAuth();
  const [initial, setInitial] = useState('S');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isStudio = pathname === '/dashboard/essays/studio';

  useEffect(() => {
    const userKey = user?.uid || user?.email || userData?.email || 'default';
    const cached = getCachedUserDetails(userKey);
    const name = cached?.fullName || cached?.name || userData?.name || user?.displayName || user?.email;
    if (name) {
      setInitial(name.charAt(0).toUpperCase());
    }

    const unsub = subscribeToUserDetails((data) => {
      const updatedName = data.fullName || data.name;
      if (updatedName) {
        setInitial(updatedName.charAt(0).toUpperCase());
      }
    });

    return () => unsub();
  }, [user, userData]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  if (isStudio) {
    return <>{children}</>;
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/dashboard' },
    { id: 'college-list', label: 'My College List', icon: GraduationCap, href: '/dashboard/college-list' },
    { id: 'tracker', label: 'Application Tracker', icon: Calendar, href: '/dashboard/tracker' },
    { id: 'schools', label: 'University Finder', icon: Compass, href: '/dashboard/schools' },
    { id: 'calculator', label: 'Net Price Calculator', icon: Calculator, href: '/dashboard/calculator' },
    { id: 'compare', label: 'Compare Universities', icon: ArrowLeftRight, href: '/dashboard/compare' },
  ];

  const applicationItems = [
    { id: 'profile', label: 'Student Profile', icon: UserCheck, href: '/dashboard/profile' },
    { id: 'extracurriculars', label: 'Extracurriculars', icon: Activity, href: '/dashboard/extracurriculars' },
    { id: 'essays', label: 'SOP & Essays', icon: FileText, href: '/dashboard/essays' },
    { id: 'chance-me', label: 'AI Chance-Me', icon: BarChart3, href: '/dashboard/chance-me', badge: 'HOT' },
  ];

  const resourceItems = [
    { id: 'admits', label: 'Admitted Profiles', icon: BookOpen, href: '/dashboard/past-admits' },
    { id: 'exemplars', label: 'Admitted Essays', icon: Award, href: '/dashboard/exemplar-essays' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  /* ── Mobile bottom nav items (5 most important) ── */
  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/dashboard' },
    { id: 'college-list', label: 'Colleges', icon: GraduationCap, href: '/dashboard/college-list' },
    { id: 'essays', label: 'Essays', icon: FileText, href: '/dashboard/essays' },
    { id: 'chance-me', label: 'Chance-Me', icon: BarChart3, href: '/dashboard/chance-me' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <div className="bg-[#F6F4F2] dark:bg-[#0F1117] text-[#111111] dark:text-[#E8E6E3] font-[Poppins] min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#690B1B] selection:text-white transition-colors duration-300">
      {/* ═══════════════════════════════════════════════════════════════
         LEFT SIDEBAR — Unified Dashboard Navigation (LOCKED & STATIONARY)
         ═══════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 left-0 bottom-0 h-screen max-h-screen z-40 bg-white dark:bg-[#1A1D27] border-r border-[#E7E2DE] dark:border-[#2A2D3A] transition-all duration-300 ease-in-out flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.06)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.3)] overflow-hidden select-none ${
          sidebarCollapsed ? 'w-[80px]' : 'w-[280px] max-w-[85vw] md:max-w-none'
        } ${mobileSidebarOpen ? 'translate-x-0 !z-50' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* SIDEBAR HEADER - PINNED AT TOP */}
        <div className={`h-[64px] sm:h-[68px] flex items-center border-b border-[#F0EBE6] dark:border-[#2A2D3A] shrink-0 bg-white dark:bg-[#1A1D27] z-10 ${
          sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}>
          {sidebarCollapsed ? (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center hover:bg-[#F7F0F1] transition-all cursor-pointer group relative shadow-2xs"
              title="Click to expand sidebar"
            >
              <div className="w-[36px] h-[36px] rounded-[10px] shadow-xs overflow-hidden shrink-0">
                <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover group-hover:opacity-10 transition-opacity" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#690B1B]">
                <Menu size={20} />
              </div>
            </button>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                <div className="w-[38px] h-[38px] rounded-[11px] shadow-[0_4px_16px_rgba(105,11,27,0.2)] overflow-hidden shrink-0">
                  <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold tracking-[-0.02em] leading-tight text-[#111] truncate">
                    Abroad Simplified
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#C9A55D] shrink-0" />
                    <span className="text-[9.5px] uppercase tracking-[0.18em] font-semibold text-[#A3A3A3]">
                      Admissions Hub
                    </span>
                  </div>
                </div>
              </Link>

              <button
                onClick={() => setSidebarCollapsed(true)}
                className="hidden md:flex p-1.5 text-[#999999] hover:text-[#690B1B] hover:bg-[#F7F0F1] rounded-lg transition-colors shrink-0 cursor-pointer"
                title="Collapse sidebar"
              >
                <Menu size={18} />
              </button>

              {/* Mobile close button */}
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1.5 text-[#999999] hover:text-[#690B1B] hover:bg-[#F7F0F1] rounded-lg transition-colors shrink-0 cursor-pointer"
                title="Close sidebar"
              >
                <X size={20} />
              </button>
            </>
          )}
        </div>

        {/* SIDEBAR NAVIGATION ITEMS (SCROLLABLE INDEPENDENTLY WHEN HOVERED) */}
        <div
          onWheel={(e) => e.stopPropagation()}
          className={`flex-1 py-3 sm:py-4 flex flex-col justify-start overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:#E3DDD9_transparent] ${
            sidebarCollapsed ? 'px-2 space-y-3 items-center' : 'px-3 sm:px-3.5 space-y-4 sm:space-y-5'
          }`}
        >
          {/* MAIN NAVIGATION */}
          <div className={sidebarCollapsed ? 'space-y-1.5 w-full flex flex-col items-center' : 'space-y-1 sm:space-y-1.5'}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={item.label}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`rounded-[12px] transition-all flex items-center ${
                    sidebarCollapsed
                      ? 'w-[44px] h-[44px] justify-center p-0'
                      : 'w-full gap-3 px-3.5 py-2.5 text-[14px] sm:text-[14.5px] font-semibold'
                  } ${
                    isActive
                      ? 'bg-[#F7F0F1] text-[#690B1B] font-bold shadow-2xs'
                      : 'text-[#444444] hover:bg-[#F9F7F5] hover:text-[#111111]'
                  }`}
                >
                  <Icon size={sidebarCollapsed ? 20 : 19} className={isActive ? 'text-[#690B1B]' : 'text-[#777777]'} />
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B] shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* MY APPLICATION */}
          <div className={sidebarCollapsed ? 'w-full flex flex-col items-center' : ''}>
            {!sidebarCollapsed && (
              <div className="px-3.5 text-[10px] sm:text-[10.5px] font-bold text-[#9A9A9A] uppercase tracking-[0.16em] mb-1.5">
                My Application
              </div>
            )}
            <div className={sidebarCollapsed ? 'space-y-1.5 w-full flex flex-col items-center' : 'space-y-1 sm:space-y-1.5'}>
              {applicationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={item.label}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`rounded-[12px] transition-all flex items-center ${
                      sidebarCollapsed
                        ? 'w-[44px] h-[44px] justify-center p-0'
                        : 'w-full gap-3 px-3.5 py-2.5 text-[14px] sm:text-[14.5px] font-semibold'
                    } ${
                      isActive
                        ? 'bg-[#F7F0F1] text-[#690B1B] font-bold shadow-2xs'
                        : 'text-[#444444] hover:bg-[#F9F7F5] hover:text-[#111111]'
                    }`}
                  >
                    <Icon size={sidebarCollapsed ? 20 : 19} className={isActive ? 'text-[#690B1B]' : 'text-[#777777]'} />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="text-[9px] font-bold bg-[#690B1B] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RESOURCES */}
          <div className={sidebarCollapsed ? 'w-full flex flex-col items-center' : ''}>
            {!sidebarCollapsed && (
              <div className="px-3.5 text-[10px] sm:text-[10.5px] font-bold text-[#9A9A9A] uppercase tracking-[0.16em] mb-1.5">
                Resources
              </div>
            )}
            <div className={sidebarCollapsed ? 'space-y-1.5 w-full flex flex-col items-center' : 'space-y-1 sm:space-y-1.5'}>
              {resourceItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={item.label}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`rounded-[12px] transition-all flex items-center ${
                      sidebarCollapsed
                        ? 'w-[44px] h-[44px] justify-center p-0'
                        : 'w-full gap-3 px-3.5 py-2.5 text-[14px] sm:text-[14.5px] font-semibold'
                    } ${
                      isActive
                        ? 'bg-[#F7F0F1] text-[#690B1B] font-bold shadow-2xs'
                        : 'text-[#444444] hover:bg-[#F9F7F5] hover:text-[#111111]'
                    }`}
                  >
                    <Icon size={sidebarCollapsed ? 20 : 19} className={isActive ? 'text-[#690B1B]' : 'text-[#777777]'} />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDEBAR FOOTER — PINNED AT BOTTOM */}
        <div className={`border-t border-[#F0EBE6] dark:border-[#2A2D3A] bg-white dark:bg-[#1A1D27] shrink-0 z-10 ${
          sidebarCollapsed ? 'p-2 pb-3 flex justify-center' : 'p-3 sm:p-3.5 pb-4 sm:pb-5'
        }`}>
          <Link
            href="/dashboard"
            title="Upgrade to Pro — Unlimited SOP Reviews (30% OFF)"
            className={`rounded-[14px] sm:rounded-[15px] bg-gradient-to-r from-[#690B1B] to-[#8A1226] text-white shadow-sm hover:opacity-95 transition-all flex items-center ${
              sidebarCollapsed
                ? 'w-[44px] h-[44px] justify-center p-0'
                : 'w-full justify-between p-3 sm:p-3.5'
            }`}
          >
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
              <Zap size={18} className="text-[#C9A55D] fill-[#C9A55D] shrink-0" />
              {!sidebarCollapsed && (
                <div className="text-left leading-tight truncate">
                  <div className="text-[13px] sm:text-[13.5px] font-bold">Upgrade Pro</div>
                  <div className="text-[10px] sm:text-[10.5px] text-[#E0C080] truncate">Unlimited SOP Reviews</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <span className="text-[9.5px] sm:text-[10px] font-bold bg-[#C9A55D] text-black px-2 py-0.5 rounded-full uppercase shrink-0">
                30% OFF
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-45 md:hidden"
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MAIN CONTENT AREA (OFFSET BY FIXED SIDEBAR ON DESKTOP)
         ═══════════════════════════════════════════════════════════════ */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-x-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'md:pl-[80px]' : 'md:pl-[280px]'
      }`}>
        {/* TOP HEADER BAR */}
        <header className="h-[60px] sm:h-[76px] px-3 sm:px-5 md:px-8 bg-white dark:bg-[#1A1D27] border-b border-[#E7E2DE] dark:border-[#2A2D3A] flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile: Hamburger button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-[#555555] hover:text-[#690B1B] hover:bg-[#F7F0F1] rounded-lg transition-colors shrink-0 cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            {/* Mobile: Logo mark & Website Name */}
            <Link href="/dashboard" className="md:hidden flex items-center gap-2 min-w-0">
              <div className="w-[32px] h-[32px] rounded-[10px] shadow-[0_4px_12px_rgba(105,11,27,0.18)] overflow-hidden shrink-0">
                <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-[15px] font-bold text-[#111] tracking-tight truncate">
                Abroad Simplified
              </span>
            </Link>
            <div className="hidden md:block">
              <h1 className="text-[16px] sm:text-[18px] font-bold text-[#111111]">Abroad Simplified Student Portal</h1>
              <p className="text-[11px] sm:text-[12px] text-[#888888]">Fall 2026 Admissions Cycle</p>
            </div>
          </div>

          {/* HEADER RIGHT ACTIONS */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
            {/* INVITE FRIENDS / REWARDS BUTTON */}
            <button className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FB] border border-[#0088CB]/20 text-[#0088CB] text-[12px] font-bold hover:bg-[#0088CB]/10 transition-all">
              <span>Invite Friends</span>
              <span className="bg-[#0088CB] text-white px-2 py-0.5 rounded-full text-[10px]">
                +30 ⚡
              </span>
            </button>

            {/* PROMO OFFER BADGE */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F0F1] border border-[#690B1B]/15 text-[#690B1B] text-[11px] sm:text-[12px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#690B1B] animate-pulse shrink-0" />
              <span>Get 30% Off</span>
              <span className="font-bold text-[#C9A55D] bg-[#111] px-2 py-0.5 rounded-full text-[10px]">
                0d 23h 11m
              </span>
            </div>

            {/* AI CREDITS COUNTER - Hidden on mobile, visible on sm+ */}
            <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FFF8EB] border border-[#F4D080] text-[#9E731A] text-[11px] sm:text-[13px] font-bold shrink-0">
              <Zap size={13} className="fill-[#F4B400] text-[#F4B400] shrink-0" />
              <span>25 Credits</span>
            </div>

            {/* NOTIFICATIONS - Hidden on mobile, visible on sm+ */}
            <button className="hidden sm:flex relative p-1.5 sm:p-2 rounded-full border border-[#E7E2DE] bg-white text-[#555555] hover:text-[#690B1B] hover:border-[#690B1B]/30 transition-all shrink-0 cursor-pointer">
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#690B1B] border-2 border-white" />
            </button>

            {/* USER AVATAR LINK TO SETTINGS */}
            <Link href="/dashboard/settings" className="flex items-center sm:pl-2 sm:border-l sm:border-[#E7E2DE] shrink-0">
              <div className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] aspect-square rounded-full bg-gradient-to-br from-[#7A1022] to-[#530816] text-white flex items-center justify-center font-bold text-[13px] sm:text-[14px] shadow-xs ring-2 ring-[#690B1B]/10 shrink-0">
                {initial}
              </div>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT ROUTE */}
        <div className="pb-20 sm:pb-24 md:pb-8 flex-1">
          {children}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
           MOBILE BOTTOM NAVIGATION BAR
           ═══════════════════════════════════════════════════════════════ */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1A1D27]/97 backdrop-blur-xl border-t border-[#E7E2DE] dark:border-[#2A2D3A] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex items-stretch">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative transition-all ${
                  isActive ? 'text-[#690B1B]' : 'text-[#888888]'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#690B1B] rounded-b-full" />
                )}
                <div className={`p-1.5 rounded-[10px] transition-all ${
                  isActive ? 'bg-[#F7F0F1]' : ''
                }`}>
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
                <span className={`text-[9px] font-semibold tracking-wide leading-none ${
                  isActive ? 'text-[#690B1B]' : 'text-[#999]'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
