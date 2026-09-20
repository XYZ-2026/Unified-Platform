'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Feature grid with protected navigation and inline auth modal.
 * Extracted from the homepage to enable SSR for surrounding content.
 * Only the interactive buttons and modal require client-side rendering.
 */
export default function FeatureSection() {
  const router = useRouter();
  const { user, googleSignIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const pendingRedirectRef = React.useRef<string | null>(null);

  const handleProtectedLink = (dashboardHref: string) => {
    if (user) {
      router.push(dashboardHref);
    } else {
      pendingRedirectRef.current = dashboardHref;
      setModalError('');
      setShowAuthModal(true);
    }
  };

  const handleModalGoogleSignIn = async () => {
    setModalLoading(true);
    setModalError('');
    try {
      const { isNewUser } = await googleSignIn();
      setShowAuthModal(false);
      if (isNewUser) {
        router.push('/onboarding');
      } else if (pendingRedirectRef.current) {
        router.push(pendingRedirectRef.current);
        pendingRedirectRef.current = null;
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setModalError(err?.message || 'Sign in failed. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const features = [
    { num: "01", title: "University Matcher", desc: "Filter 500+ global universities by budget, acceptance rate, and major.", link: "/dashboard/schools", linkText: "Explore Universities →" },
    { num: "02", title: "AI Chance-Me Predictor", desc: "Estimate real odds by comparing your stats against past admitted students.", link: "/dashboard/chance-me", linkText: "Test Admit Odds →" },
    { num: "03", title: "AI SOP Feedback", desc: "Ethical, real-time essay analysis grounded in thousands of successful SOPs.", link: "/dashboard/essays", linkText: "SOP Analyzer →" },
    { num: "04", id: "scholarships", title: "Scholarship Finder", desc: "Discover merit and need-based grants matched to your student profile.", link: "https://scholarship.abroadsimplified.com", linkText: "Browse Scholarships ↗", isExternal: true },
    { num: "05", title: "Application Tracker", desc: "Never miss deadlines, document requirements, or portal submissions.", link: "/dashboard/tracker", linkText: "Open Tracker →" },
    { num: "06", title: "Visa & Document Guide", desc: "Tailored checklists, financial proof guides, and mock visa interview tools.", link: "/dashboard/visa", linkText: "Visa Guide →" },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-[#DDD7D3] rounded-[20px] overflow-hidden">
        {features.map((feature) => (
          <div
            key={feature.num}
            id={feature.id}
            className="bg-[#F7F5F3] min-h-[200px] sm:min-h-[260px] p-5 sm:p-8 border-r border-b border-[#DDD7D3] hover:bg-white transition-colors scroll-mt-28 flex flex-col justify-between"
          >
            <div>
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
            {feature.link && (
              <div className="mt-6 pt-4 border-t border-[#EAE4DF]">
                {feature.isExternal ? (
                  <a
                    href={feature.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-bold text-[#690B1B] hover:underline inline-flex items-center gap-1"
                  >
                    {feature.linkText}
                  </a>
                ) : (
                  <button
                    onClick={() => handleProtectedLink(feature.link)}
                    className="text-[13px] font-bold text-[#690B1B] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {feature.linkText}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         AUTH MODAL — Sign in to access dashboard features
         ═══════════════════════════════════════════════════════════════ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowAuthModal(false); setModalError(''); }}
          />
          {/* Modal Card */}
          <div className="relative bg-white rounded-[24px] w-full max-w-[420px] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            {/* Close */}
            <button
              onClick={() => { setShowAuthModal(false); setModalError(''); }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#AAAAAA] hover:bg-[#F5F5F5] hover:text-[#111] transition-all text-base cursor-pointer"
              aria-label="Close sign-in modal"
            >
              ✕
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-[52px] h-[52px] rounded-[16px] shadow-[0_6px_20px_rgba(105,11,27,0.22)] overflow-hidden">
                <Image src="/logo.png" alt="Abroad Simplified" width={52} height={52} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-7">
              <h2 className="text-[22px] font-bold text-[#111] tracking-tight mb-2">Sign in to continue</h2>
              <p className="text-[14px] text-[#777] leading-relaxed">
                Create your free account or sign in to access all of Abroad Simplified&apos;s features.
              </p>
            </div>

            {/* Error */}
            {modalError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-[10px] text-[13px] text-red-600 text-center">
                {modalError}
              </div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleModalGoogleSignIn}
              disabled={modalLoading}
              className="w-full h-[50px] flex items-center justify-center gap-3 rounded-[12px] border border-[#E0E0E0] bg-white hover:bg-[#F9F9F9] transition-all text-[15px] font-semibold text-[#333] shadow-sm disabled:opacity-60 mb-4 cursor-pointer"
            >
              {modalLoading ? (
                <span className="w-5 h-5 border-2 border-[#690B1B]/30 border-t-[#690B1B] rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {modalLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#EEEEEE]" />
              <span className="text-[12px] text-[#BBBBBB] font-medium">or</span>
              <div className="flex-1 h-px bg-[#EEEEEE]" />
            </div>

            {/* Email Sign In */}
            <Link
              href="/login"
              className="w-full h-[50px] flex items-center justify-center rounded-[12px] bg-[#690B1B] text-white text-[15px] font-bold hover:bg-[#7A1022] transition-all"
              onClick={() => setShowAuthModal(false)}
            >
              Sign in with Email →
            </Link>

            <p className="mt-5 text-center text-[12px] text-[#AAAAAA]">
              Free forever · No credit card required
            </p>
          </div>
        </div>
      )}
    </>
  );
}
