'use client';

import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F6F4F2] selection:bg-[#690B1B] selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E7E2DE]">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-[40px] h-[40px] rounded-[12px] shadow-[0_4px_16px_rgba(105,11,27,0.2)] overflow-hidden shrink-0">
              <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[18px] font-bold text-[#111111] tracking-[-0.04em] leading-none">
                Abroad Simplified
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="w-[3px] h-[3px] rounded-full bg-[#C9A55D]" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#A3A3A3]">
                  AI Admissions Platform
                </span>
              </div>
            </div>
          </Link>
          <Link
            href="/login"
            className="text-[13px] font-bold text-[#690B1B] hover:text-[#7A1022] transition-colors border border-[#690B1B]/20 hover:border-[#690B1B]/40 px-4 py-2 rounded-full"
          >
            Back
          </Link>
        </div>
      </header>

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#690B1B] via-[#7A1022] to-[#530816] text-white py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full mb-4 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#C9A55D]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">Legal Document</span>
          </div>
          <h1 className="text-[36px] sm:text-[48px] font-bold tracking-[-0.03em] leading-tight mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-white/70 text-[15px] max-w-xl">
            Please read these terms carefully before using the Abroad Simplified platform.
          </p>
          <p className="text-white/50 text-[13px] mt-3">
            Last updated: September 4, 2026
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="bg-white rounded-[24px] border border-[#E7E2DE] shadow-xs overflow-hidden">
          {/* Table of Contents */}
          <div className="bg-[#FDFCFB] border-b border-[#E7E2DE] p-6 sm:p-8">
            <h2 className="text-[14px] font-bold text-[#555] uppercase tracking-[0.1em] mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['1', 'Acceptance of Terms'],
                ['2', 'Description of Services'],
                ['3', 'User Accounts & Registration'],
                ['4', 'User Responsibilities'],
                ['5', 'Intellectual Property'],
                ['6', 'Privacy & Data Protection'],
                ['7', 'AI-Generated Content Disclaimer'],
                ['8', 'Limitation of Liability'],
                ['9', 'Termination'],
                ['10', 'Governing Law'],
                ['11', 'Changes to Terms'],
                ['12', 'Contact Information'],
              ].map(([num, title]) => (
                <a
                  key={num}
                  href={`#section-${num}`}
                  className="flex items-center gap-3 text-[13px] text-[#444] hover:text-[#690B1B] transition-colors group py-1"
                >
                  <span className="w-6 h-6 rounded-full bg-[#690B1B]/8 text-[#690B1B] text-[11px] font-bold flex items-center justify-center shrink-0 group-hover:bg-[#690B1B] group-hover:text-white transition-all">
                    {num}
                  </span>
                  {title}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="p-6 sm:p-8 space-y-10">

            {/* Section 1 */}
            <section id="section-1">
              <SectionHeading number="1" title="Acceptance of Terms" />
              <Prose>
                By accessing or using the Abroad Simplified platform (&quot;Platform&quot;, &quot;Service&quot;, or &quot;we&quot;), you
                (&quot;User&quot; or &quot;you&quot;) agree to be legally bound by these Terms and Conditions
                (&quot;Terms&quot;). If you do not agree to all of these Terms, you must not use the Platform.
              </Prose>
              <Prose>
                Your continued use of the Platform following the posting of any changes to these Terms
                constitutes your acceptance of those changes. These Terms apply to all visitors, users, and
                others who access or use the Service.
              </Prose>
            </section>

            <Divider />

            {/* Section 2 */}
            <section id="section-2">
              <SectionHeading number="2" title="Description of Services" />
              <Prose>
                Abroad Simplified provides an AI-powered admissions assistance platform designed to help
                students navigate the process of applying to universities and educational institutions abroad.
                Our services include, but are not limited to:
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'AI-driven guidance on university selection and application strategy',
                  'Country and program exploration tools',
                  'Document preparation assistance and templates',
                  'Scholarship and financial aid information',
                  'Counselor-student communication tools',
                  'Application progress tracking dashboards',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#444]">
                    <span className="w-4 h-4 rounded-full bg-[#690B1B]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <Divider />

            {/* Section 3 */}
            <section id="section-3">
              <SectionHeading number="3" title="User Accounts & Registration" />
              <Prose>
                To access certain features of the Platform, you must create an account. When you register,
                you agree to:
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'Provide accurate, current, and complete information during registration',
                  'Maintain and promptly update your account information',
                  'Keep your password secure and confidential',
                  'Accept responsibility for all activities that occur under your account',
                  'Notify us immediately of any unauthorized use of your account',
                  'Not create more than one account per person without our written permission',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#444]">
                    <span className="w-4 h-4 rounded-full bg-[#690B1B]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Prose>
                We reserve the right to suspend or terminate accounts that violate these Terms or provide
                false information.
              </Prose>
            </section>

            <Divider />

            {/* Section 4 */}
            <section id="section-4">
              <SectionHeading number="4" title="User Responsibilities" />
              <Prose>
                As a user of the Platform, you agree not to:
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'Use the Platform for any unlawful purpose or in violation of any regulations',
                  'Attempt to gain unauthorized access to any part of the Platform or its related systems',
                  'Upload or transmit viruses, malware, or any other harmful code',
                  'Engage in any form of automated data collection, scraping, or harvesting',
                  'Impersonate another person or entity',
                  'Post or share any defamatory, obscene, or offensive content',
                  'Interfere with the proper functioning of the Platform',
                  'Use the Platform to send unsolicited communications (spam)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#444]">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <Divider />

            {/* Section 5 */}
            <section id="section-5">
              <SectionHeading number="5" title="Intellectual Property" />
              <Prose>
                All content on the Platform, including but not limited to text, graphics, logos, icons,
                images, audio clips, and software, is the property of Abroad Simplified or its content
                suppliers and is protected by applicable intellectual property laws.
              </Prose>
              <Prose>
                You are granted a limited, non-exclusive, non-transferable license to access and use the
                Platform for your personal, non-commercial use. This license does not include the right to:
                (a) resell or commercially use the Platform or its content; (b) download or copy account
                information for another party; (c) use any data mining or similar data gathering tools.
              </Prose>
            </section>

            <Divider />

            {/* Section 6 */}
            <section id="section-6">
              <SectionHeading number="6" title="Privacy & Data Protection" />
              <Prose>
                Your use of the Platform is also governed by our{' '}
                <Link href="/privacy" className="text-[#690B1B] font-bold hover:underline">
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms by reference. By using the Platform, you consent to the collection, use, and sharing of your information as described in our Privacy Policy.
              </Prose>
              <Prose>
                We collect and process personal data including your name, email address, academic history,
                and application-related documents to provide and improve our services. All data is handled
                in compliance with applicable data protection laws, including the General Data Protection
                Regulation (GDPR) where applicable.
              </Prose>
              <div className="mt-4 p-4 bg-[#FFF8EB] border border-[#C9A55D]/30 rounded-[14px]">
                <p className="text-[13px] text-[#7A5C1E] font-medium">
                  🔒 When you agree to these Terms during registration, your consent along with a timestamp
                  is securely recorded in our database for compliance and transparency purposes.
                </p>
              </div>
            </section>

            <Divider />

            {/* Section 7 */}
            <section id="section-7">
              <SectionHeading number="7" title="AI-Generated Content Disclaimer" />
              <Prose>
                The Platform uses artificial intelligence to generate guidance, suggestions, and content.
                You acknowledge and agree that:
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'AI-generated content is for informational and guidance purposes only and does not constitute professional legal, academic, or financial advice',
                  'You should verify all information with official sources such as university websites and official government portals',
                  'Abroad Simplified is not responsible for decisions made based solely on AI-generated content',
                  'AI responses may contain inaccuracies and should be treated as a starting point for your research',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#444]">
                    <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <Divider />

            {/* Section 8 */}
            <section id="section-8">
              <SectionHeading number="8" title="Limitation of Liability" />
              <Prose>
                To the fullest extent permitted by applicable law, Abroad Simplified and its officers,
                directors, employees, and agents shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including but not limited to loss of profits, data,
                goodwill, or other intangible losses, resulting from:
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'Your access to, use of, or inability to use the Platform',
                  'Any conduct or content of any third party on the Platform',
                  'Any content obtained from the Platform',
                  'Unauthorized access, use, or alteration of your transmissions or content',
                  'Admission decisions made by universities based on application materials prepared using our Platform',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#444]">
                    <span className="w-4 h-4 rounded-full bg-[#690B1B]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#690B1B]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <Divider />

            {/* Section 9 */}
            <section id="section-9">
              <SectionHeading number="9" title="Termination" />
              <Prose>
                We may terminate or suspend your account and access to the Platform immediately, without
                prior notice or liability, for any reason, including if you breach these Terms. Upon
                termination, your right to use the Platform will immediately cease.
              </Prose>
              <Prose>
                You may also terminate your account at any time by contacting us or using the account
                deletion feature in your account settings. Upon deletion, your personal data will be handled
                in accordance with our Privacy Policy.
              </Prose>
            </section>

            <Divider />

            {/* Section 10 */}
            <section id="section-10">
              <SectionHeading number="10" title="Governing Law" />
              <Prose>
                These Terms shall be governed and construed in accordance with the laws of India, without
                regard to its conflict of law provisions. Any disputes arising under these Terms shall be
                subject to the exclusive jurisdiction of the courts located in India.
              </Prose>
            </section>

            <Divider />

            {/* Section 11 */}
            <section id="section-11">
              <SectionHeading number="11" title="Changes to Terms" />
              <Prose>
                We reserve the right to modify or replace these Terms at any time at our sole discretion.
                We will provide notice of significant changes by updating the &quot;Last Updated&quot; date at the top
                of this page and, where appropriate, via email or an in-app notification.
              </Prose>
              <Prose>
                Your continued use of the Platform after any changes constitutes your acceptance of the new
                Terms. We encourage you to review these Terms periodically.
              </Prose>
            </section>

            <Divider />

            {/* Section 12 */}
            <section id="section-12">
              <SectionHeading number="12" title="Contact Information" />
              <Prose>
                If you have any questions about these Terms and Conditions, please contact us at:
              </Prose>
              <div className="mt-4 p-5 bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] space-y-2">
                <p className="text-[14px] font-bold text-[#111]">Abroad Simplified</p>
                <p className="text-[13px] text-[#666]">📧 support@abroadsimplified.com</p>
                <p className="text-[13px] text-[#666]">🌐 www.abroadsimplified.com</p>
                <p className="text-[13px] text-[#666]">📍 India</p>
              </div>
            </section>

          </div>

          {/* FOOTER CTA */}
          <div className="bg-gradient-to-br from-[#690B1B] to-[#530816] p-6 sm:p-8 text-white text-center">
            <p className="text-[15px] font-semibold mb-2">Ready to get started?</p>
            <p className="text-white/70 text-[13px] mb-5">
              By creating an account, you agree to these Terms and Conditions.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-[#690B1B] font-bold text-[14px] px-6 py-3 rounded-full hover:bg-[#F9F7F5] transition-all shadow-lg"
            >
              Create Account →
            </Link>
          </div>
        </div>
      </div>

      {/* SIMPLE FOOTER */}
      <footer className="text-center py-8 text-[12px] text-[#AAA]">
        © 2026 Abroad Simplified. All rights reserved.
      </footer>
    </div>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#7A1022] to-[#530816] flex items-center justify-center shrink-0 shadow-sm">
        <span className="text-[12px] font-bold text-white">{number}</span>
      </div>
      <h2 className="text-[20px] font-bold text-[#111] tracking-[-0.02em]">{title}</h2>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] text-[#555] leading-relaxed mt-3">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-[#F0EDE9]" />;
}
