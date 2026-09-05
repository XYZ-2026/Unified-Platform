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
  X
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

  if (isStudio) {
    return <>{children}</>;
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/dashboard' },
    { id: 'college-list', label: 'My College List', icon: GraduationCap, href: '/dashboard/college-list' },
    { id: 'tracker', label: 'Application Tracker', icon: Calendar, href: '/dashboard/tracker' },
    { id: 'schools', label: 'University Finder', icon: Compass, href: '/dashboard/schools' },
  ];

  const applicationItems = [
    { id: 'profile', label: 'Student Profile', icon: UserCheck, href: '/dashboard/profile' },
    { id: 'extracurriculars', label: 'Extracurriculars', icon: Activity, href: '/dashboard/extracurriculars' },
    { id: 'essays', label: 'SOP & Essays', icon: FileText, href: '/dashboard/essays' },
    { id: 'chance-me', label: 'AI Chance-Me', icon: BarChart3, href: '/dashboard/chance-me', badge: 'HOT' },
  ];

  const resourceItems = [
    { id: 'admits', label: 'Admitted Profiles', icon: BookOpen, href: '/dashboard/past-admits' },
    { id: 'exemplars', label: 'SOP Examples', icon: Award, href: '/dashboard/exemplar-essays' },
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
    <div className="bg-[#F6F4F2] text-[#111111] font-[Poppins] min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#690B1B] selection:text-white">
      {/* ═══════════════════════════════════════════════════════════════
         LEFT SIDEBAR — Unified Dashboard Navigation
         ═══════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen bg-white border-r border-[#E7E2DE] transition-all duration-300 ease-in-out flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.06)] ${
          sidebarCollapsed ? 'w-[80px]' : 'w-[270px]'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* SIDEBAR HEADER */}
        <div>
          <div className="h-[76px] px-4 flex items-center justify-between border-b border-[#F0EBE6]">
            <Link href="/" className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <div className="w-[40px] h-[40px] rounded-[12px] shadow-[0_4px_16px_rgba(105,11,27,0.2)] overflow-hidden shrink-0">
                <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold tracking-[-0.02em] leading-tight text-[#111] truncate">
                    Abroad Simplified
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#C9A55D] shrink-0" />
                    <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-[#A3A3A3]">
                      Admissions Hub
                    </span>
                  </div>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1.5 text-[#999999] hover:text-[#690B1B] hover:bg-[#F7F0F1] rounded-lg transition-colors shrink-0"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu size={18} />
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-[#999999] hover:text-[#690B1B] hover:bg-[#F7F0F1] rounded-lg transition-colors shrink-0"
              title="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* SIDEBAR NAVIGATION ITEMS */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)] custom-scrollbar">
            {/* MAIN NAVIGATION */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-[14px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#F7F0F1] text-[#690B1B] font-bold shadow-xs'
                        : 'text-[#555555] hover:bg-[#F9F7F5] hover:text-[#111111]'
                    }`}
                  >
                    <Icon size={19} className={isActive ? 'text-[#690B1B]' : 'text-[#777777]'} />
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
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-[#A3A3A3] uppercase tracking-[0.2em] mb-2">
                  My Application
                </div>
              )}
              <div className="space-y-1">
                {applicationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-[12px] text-[14px] font-medium transition-all ${
                        isActive
                          ? 'bg-[#F7F0F1] text-[#690B1B] font-bold'
                          : 'text-[#555555] hover:bg-[#F9F7F5] hover:text-[#111111]'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[#690B1B]' : 'text-[#888888]'} />
                      {!sidebarCollapsed && (
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      )}
                      {!sidebarCollapsed && item.badge && (
                        <span className="text-[9px] font-bold bg-[#690B1B] text-white px-1.5 py-0.5 rounded-full uppercase">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* RESOURCES */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-[#A3A3A3] uppercase tracking-[0.2em] mb-2">
                  Resources
                </div>
              )}
              <div className="space-y-1">
                {resourceItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-[12px] text-[14px] font-medium transition-all ${
                        isActive
                          ? 'bg-[#F7F0F1] text-[#690B1B] font-bold'
                          : 'text-[#555555] hover:bg-[#F9F7F5] hover:text-[#111111]'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[#690B1B]' : 'text-[#888888]'} />
                      {!sidebarCollapsed && (
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR FOOTER — PRO UPGRADE CTA */}
        <div className="p-3 pb-5 border-t border-[#F0EBE6] bg-white">
          <Link
            href="/dashboard"
            className={`w-full flex items-center justify-between p-3 rounded-[14px] bg-gradient-to-r from-[#690B1B] to-[#8A1226] text-white shadow-sm hover:opacity-95 transition-all ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Zap size={18} className="text-[#C9A55D] fill-[#C9A55D] shrink-0" />
              {!sidebarCollapsed && (
                <div className="text-left leading-tight truncate">
                  <div className="text-[13px] font-bold">Upgrade Pro</div>
                  <div className="text-[10px] text-[#E0C080] truncate">Unlimited SOP Reviews</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <span className="text-[10px] font-bold bg-[#C9A55D] text-black px-2 py-0.5 rounded-full uppercase shrink-0">
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MAIN CONTENT AREA
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* TOP HEADER BAR */}
        <header className="h-[64px] sm:h-[76px] px-4 sm:px-5 md:px-8 bg-white border-b border-[#E7E2DE] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile: Hamburger + logo */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-1 text-[#555555] hover:text-[#690B1B] hover:bg-[#F7F0F1] rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            {/* Mobile: Logo mark & Website Name */}
            <Link href="/dashboard" className="md:hidden flex items-center gap-2.5">
              <div className="w-[34px] h-[34px] rounded-[10px] shadow-[0_4px_12px_rgba(105,11,27,0.2)] overflow-hidden shrink-0">
                <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-[15px] font-bold text-[#111] tracking-tight">Abroad Simplified</span>
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-[15px] sm:text-[18px] font-bold text-[#111111]">Abroad Simplified Student Portal</h1>
              <p className="text-[11px] sm:text-[12px] text-[#888888]">Fall 2026 Admissions Cycle</p>
            </div>
          </div>

          {/* HEADER RIGHT ACTIONS */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
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

            {/* AI CREDITS COUNTER */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FFF8EB] border border-[#F4D080] text-[#9E731A] text-[11px] sm:text-[13px] font-bold">
              <Zap size={13} className="fill-[#F4B400] text-[#F4B400] shrink-0" />
              <span className="hidden sm:inline">25 Credits</span>
              <span className="sm:hidden">25</span>
            </div>

            {/* NOTIFICATIONS */}
            <button className="relative p-1.5 sm:p-2 rounded-full border border-[#E7E2DE] bg-white text-[#555555] hover:text-[#690B1B] hover:border-[#690B1B]/30 transition-all">
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#690B1B] border-2 border-white" />
            </button>

            {/* USER AVATAR LINK TO SETTINGS */}
            <Link href="/dashboard/settings" className="flex items-center gap-2 pl-2 border-l border-[#E7E2DE]">
              <div className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] rounded-full bg-gradient-to-br from-[#7A1022] to-[#530816] text-white flex items-center justify-center font-bold text-[12px] sm:text-[14px] shadow-sm ring-2 ring-[#690B1B]/10">
                {initial}
              </div>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT ROUTE */}
        <div className="pb-20 md:pb-0 flex-1">
          {children}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
           MOBILE BOTTOM NAVIGATION BAR
           ═══════════════════════════════════════════════════════════════ */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E7E2DE] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex items-stretch">
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
