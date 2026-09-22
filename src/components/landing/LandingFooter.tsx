import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingFooter() {
  return (
    <footer className="bg-[#030303] px-4 sm:px-6 md:px-10 lg:px-16 pt-12 sm:pt-16 md:pt-20 pb-8 text-left">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
          {/* BRAND */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 max-w-[300px]">
            <Link href="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
              <div className="w-[46px] h-[46px] rounded-[14px] overflow-hidden shadow-[0_6px_20px_rgba(105,11,27,0.3)] shrink-0">
                <Image src="/logo.png" alt="Abroad Simplified Logo" width={46} height={46} className="w-full h-full object-cover" />
              </div>
              <span className="text-[22px] font-bold tracking-[-0.03em]">Abroad Simplified</span>
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
                { label: "Net Price Calculator", href: "/dashboard/calculator" },
                { label: "AI Chance-Me Predictor", href: "/#chance-me" },
                { label: "SOP Builder", href: "/#features" },
                { label: "Scholarship Matcher", href: "https://scholarship.abroadsimplified.com", isExternal: true },
                { label: "Visa Guidance", href: "/#features" },
              ].map((item) => (
                item.isExternal ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#6B6F78] text-[15px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[15px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                )
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
                { label: "Study in USA", href: "/country/usa" },
                { label: "Study in UK", href: "/country/uk" },
                { label: "Study in Germany", href: "/country/germany" },
                { label: "Study in Canada", href: "/country/canada" },
                { label: "Study in Australia", href: "/country/australia" },
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

          {/* COMPANY */}
          <div>
            <div className="text-[#C8A15D] text-[11px] tracking-[0.24em] uppercase font-bold mb-6">
              Company
            </div>
            <div className="space-y-4">
              {[
                { label: "Admissions Journey", href: "/#journey" },
                { label: "Platform Features", href: "/#features" },
                { label: "Admissions FAQ", href: "/#faq" },
                { label: "Contact & Support", href: "mailto:support@abroadsimplified.com", isMail: true },
              ].map((item) => (
                item.isMail ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[15px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-[#6B6F78] text-[15px] hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                )
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
            <Link href="/privacy" className="hover:text-white transition cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition cursor-pointer">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
