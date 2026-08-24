'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  User
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isStudio = pathname === '/dashboard/essays/studio';

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
  ];

  return (
    <div className="bg-[#F6F4F2] text-[#111111] font-[Poppins] min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#690B1B] selection:text-white">
      {/* ═══════════════════════════════════════════════════════════════
         LEFT SIDEBAR — Unified Dashboard Navigation
         ═══════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen bg-white border-r border-[#E7E2DE] transition-all duration-300 flex flex-col justify-between shadow-xs ${
          sidebarCollapsed ? 'w-[80px]' : 'w-[260px]'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* SIDEBAR HEADER */}
        <div>
          <div className="h-[76px] px-5 flex items-center justify-between border-b border-[#F0EBE6]">
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <div className="w-[42px] h-[42px] rounded-[13px] bg-gradient-to-br from-[#7A1022] to-[#530816] flex items-center justify-center shadow-[0_6px_20px_rgba(105,11,27,0.2)] border border-white/10">
                  <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
                    <path d="M12 3L4 9V21H20V9L12 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 21V12H15V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-bold tracking-[-0.03em] leading-none text-[#111] whitespace-nowrap">
                    Abroad Simplified
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#C9A55D] shrink-0" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#A3A3A3]">
                      Admissions Hub
                    </span>
                  </div>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1.5 text-[#999999] hover:text-[#690B1B] hover:bg-[#F7F0F1] rounded-lg transition-colors"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu size={18} />
            </button>
          </div>

          {/* SIDEBAR NAVIGATION ITEMS */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
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

        {/* SIDEBAR FOOTER */}
        <div className="p-3 border-t border-[#F0EBE6] space-y-2">
          <Link
            href="/dashboard"
            className={`w-full flex items-center justify-between p-3 rounded-[14px] bg-gradient-to-r from-[#690B1B] to-[#8A1226] text-white shadow-sm hover:opacity-95 transition-all ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap size={18} className="text-[#C9A55D] fill-[#C9A55D]" />
              {!sidebarCollapsed && (
                <div className="text-left leading-tight">
                  <div className="text-[13px] font-bold">Upgrade Pro</div>
                  <div className="text-[10px] text-[#E0C080]">Get Unlimited AI SOP Reviews</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <span className="text-[10px] font-bold bg-[#C9A55D] text-black px-2 py-0.5 rounded-full uppercase">
                30% OFF
              </span>
            )}
          </Link>

          <Link
            href="/dashboard/settings"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] font-medium transition-all ${
              pathname === '/dashboard/settings'
                ? 'bg-[#F7F0F1] text-[#690B1B] font-bold'
                : 'text-[#777777] hover:bg-[#F9F7F5] hover:text-[#11]'
            }`}
          >
            <Settings size={18} />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
        </div>
      </aside>

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MAIN CONTENT AREA
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="h-[76px] px-5 md:px-8 bg-white border-b border-[#E7E2DE] flex items-center justify-between sticky top-0 z-30">
          {/* Desktop Header Content (hidden on mobile) */}
          <div className="hidden md:flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-[18px] font-bold text-[#111111]">Abroad Simplified Student Portal</h1>
                <p className="text-[12px] text-[#888888]">Fall 2026 Admissions Cycle</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FB] border border-[#0088CB]/20 text-[#0088CB] text-[12px] font-bold hover:bg-[#0088CB]/10 transition-all">
                <span>Invite Friends</span>
                <span className="bg-[#0088CB] text-white px-2 py-0.5 rounded-full text-[10px]">
                  +30 ⚡
                </span>
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F0F1] border border-[#690B1B]/15 text-[#690B1B] text-[12px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#690B1B] animate-pulse" />
                <span>Get 30% Off</span>
                <span className="font-bold text-[#C9A55D] bg-[#111] px-2 py-0.5 rounded-full text-[10px]">
                  0d 23h 11m
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8EB] border border-[#F4D080] text-[#9E731A] text-[13px] font-bold">
                <Zap size={15} className="fill-[#F4B400] text-[#F4B400]" />
                <span>25 Credits</span>
              </div>

              <button className="relative p-2 rounded-full border border-[#E7E2DE] bg-white text-[#555555] hover:text-[#690B1B] hover:border-[#690B1B]/30 transition-all">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#690B1B] border-2 border-white" />
              </button>

              <Link href="/dashboard/settings" className="flex items-center gap-2.5 pl-2 border-l border-[#E7E2DE]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#690B1B] text-white flex items-center justify-center font-bold text-[14px] shadow-xs">
                  S
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Header Content (hidden on desktop) */}
          <div className="flex md:hidden items-center justify-between w-full">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-[#555555] hover:text-[#111111]"
            >
              <Menu size={22} />
            </button>

            {/* Mobile Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#7A1022] to-[#530816] flex items-center justify-center border border-white/10 shrink-0 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px]">
                  <path d="M12 3L4 9V21H20V9L12 3Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 21V12H15V21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-left leading-tight">
                <div className="text-[13px] font-bold text-[#111] tracking-tight">Abroad Simplified</div>
                <div className="text-[8px] uppercase tracking-[0.15em] font-extrabold text-[#A3A3A3] mt-0.5">STUDENT PORTAL</div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2.5">
              <button className="relative p-2 rounded-full border border-[#E7E2DE] bg-white text-[#555555] hover:text-[#690B1B] hover:border-[#690B1B]/30 transition-all">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#690B1B]" />
              </button>
              <Link href="/dashboard/settings">
                <div className="w-[34px] h-[34px] rounded-full bg-[#690B1B] text-white flex items-center justify-center font-bold text-[13px] shadow-xs">
                  S
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* MOBILE BADGES ROW (Only visible on mobile) */}
        <div className="md:hidden px-5 pt-5 pb-1 flex items-center justify-between gap-2.5 overflow-x-auto scrollbar-none">
          {/* INVITE FRIENDS */}
          <button className="flex-1 min-w-[105px] flex items-center justify-between gap-1 px-3 py-2 rounded-xl bg-[#EBF4FB] border border-[#0088CB]/15 text-[#0088CB] text-[11px] font-bold">
            <span className="truncate">Invite Friends</span>
            <span className="bg-[#0088CB] text-white px-1.5 py-0.5 rounded-full text-[9px] font-extrabold shrink-0">
              +30 ⚡
            </span>
          </button>

          {/* GET 30% OFF */}
          <div className="flex-1 min-w-[115px] flex items-center justify-between gap-1 px-3 py-2 rounded-xl bg-[#F7F0F1] border border-[#690B1B]/15 text-[#690B1B] text-[11px] font-bold">
            <span className="truncate">Get 30% Off</span>
            <span className="bg-[#111] text-[#C9A55D] px-1.5 py-0.5 rounded-full text-[9px] font-extrabold shrink-0">
              23h 11m
            </span>
          </div>

          {/* CREDITS */}
          <div className="flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF8EB] border border-[#F4D080] text-[#9E731A] text-[11px] font-bold">
            <Zap size={12} className="fill-[#F4B400] text-[#F4B400] shrink-0" />
            <span className="truncate">25 Credits</span>
          </div>
        </div>

        {/* PAGE CONTENT ROUTE */}
        {children}
      </div>
    </div>
  );
}
