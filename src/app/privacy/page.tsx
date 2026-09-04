'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
            Back to Sign In
          </Link>
        </div>
      </header>

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#690B1B] via-[#7A1022] to-[#530816] text-white py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full mb-4 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#C9A55D]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">Privacy &amp; Security</span>
          </div>
          <h1 className="text-[36px] sm:text-[48px] font-bold tracking-[-0.03em] leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-[15px] max-w-xl">
            At Abroad Simplified, we respect your privacy and are committed to protecting your personal data.
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
                ['1', 'Information We Collect'],
                ['2', 'How We Use Your Information'],
                ['3', 'Data Sharing & Disclosure'],
                ['4', 'Data Storage & Security'],
                ['5', 'AI Data Processing'],
                ['6', 'Your Rights & Choices'],
                ['7', 'Cookies & Tracking'],
                ['8', 'Third-Party Services'],
                ['9', 'Children\'s Privacy'],
                ['10', 'Updates to This Policy'],
                ['11', 'Contact Us'],
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
              <SectionHeading number="1" title="Information We Collect" />
              <Prose>
                We collect personal information that you provide to us directly, automatically through your use of the Platform, or from third-party services like Google Authentication.
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'Personal Identity: Full name, email address, profile picture (via Google Auth)',
                  'Academic Profile: GPA, test scores (GRE, GMAT, TOEFL, IELTS), target degree, and field of study',
                  'Application Data: Statements of Purpose (SOP), draft essays, target university lists, and scholarship choices',
                  'Account Logs: Consent timestamps for Terms & Conditions and Privacy Policy agreements',
                  'Usage Data: Pages visited, features accessed, browser type, IP address, and device metadata',
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

            {/* Section 2 */}
            <section id="section-2">
              <SectionHeading number="2" title="How We Use Your Information" />
              <Prose>
                We process your personal information to deliver, improve, and personalize our AI admissions platform:
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'Generating accurate AI Chance-Me admission odds based on your academic profile',
                  'Providing automated feedback and suggestions on your Statement of Purpose (SOP)',
                  'Matching your profile with tailored universities and scholarship opportunities',
                  'Managing your account, authenticating sign-ins, and maintaining database security',
                  'Communicating important updates, platform notifications, and service enhancements',
                  'Ensuring legal compliance and audit trails for user terms consent',
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
              <SectionHeading number="3" title="Data Sharing & Disclosure" />
              <Prose>
                Abroad Simplified does not sell, rent, or trade your personal information to third parties. We share your data only in the following limited circumstances:
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'Service Providers: Secure cloud infrastructure (Firebase / Google Cloud) for authentication and data storage',
                  'Educational Counselors: If you explicitly invite or share your application profile with an assigned mentor/counselor',
                  'Legal Compliance: When required by applicable law, court orders, or governmental regulations',
                  'Business Transfers: In the event of a merger, acquisition, or restructuring, subject to confidentiality agreements',
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

            {/* Section 4 */}
            <section id="section-4">
              <SectionHeading number="4" title="Data Storage & Security" />
              <Prose>
                We implement industry-standard administrative, technical, and physical security measures to protect your personal data against unauthorized access, loss, or alteration.
              </Prose>
              <Prose>
                All data in transit is encrypted using HTTPS/TLS, and database entries in Firebase Firestore are secured with strict rules and encryption at rest.
              </Prose>
            </section>

            <Divider />

            {/* Section 5 */}
            <section id="section-5">
              <SectionHeading number="5" title="AI Data Processing" />
              <Prose>
                When you use our AI features (such as SOP analysis or AI Chat Guidance):
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'Your submitted text is processed in real time to generate suggestions and feedback',
                  'Your private essay drafts are NEVER publicly displayed or shared with other users',
                  'We do not sell your essays or profile data to third-party AI training data brokers',
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

            {/* Section 6 */}
            <section id="section-6">
              <SectionHeading number="6" title="Your Rights & Choices" />
              <Prose>
                You have the right to access, update, or delete your personal account information at any time:
              </Prose>
              <ul className="list-none space-y-2 mt-3">
                {[
                  'Access & Export: Request a copy of your stored personal profile data',
                  'Rectification: Correct any inaccurate or incomplete details in your dashboard profile',
                  'Erasure: Request complete deletion of your account and related Firestore records',
                  'Opt-Out: Unsubscribe from non-essential promotional or platform notification emails',
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

            {/* Section 7 */}
            <section id="section-7">
              <SectionHeading number="7" title="Cookies & Tracking" />
              <Prose>
                We use essential cookies and session storage to maintain your authentication state and preferences. You can manage or disable non-essential cookies via your browser settings.
              </Prose>
            </section>

            <Divider />

            {/* Section 8 */}
            <section id="section-8">
              <SectionHeading number="8" title="Third-Party Services" />
              <Prose>
                Our Platform utilizes trusted third-party services including Google Firebase for authentication and database services. Each provider operates under its own privacy policy:
              </Prose>
              <div className="mt-3 p-4 bg-[#FDFCFB] border border-[#E7E2DE] rounded-[14px] text-[13px] text-[#555]">
                • <strong className="text-[#111]">Google Authentication &amp; Firebase Firestore:</strong> Governed by Google&apos;s Privacy Policy (https://policies.google.com/privacy)
              </div>
            </section>

            <Divider />

            {/* Section 9 */}
            <section id="section-9">
              <SectionHeading number="9" title="Children's Privacy" />
              <Prose>
                Our Platform is intended for university applicants and students. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us immediately for prompt deletion.
              </Prose>
            </section>

            <Divider />

            {/* Section 10 */}
            <section id="section-10">
              <SectionHeading number="10" title="Updates to This Policy" />
              <Prose>
                We may update this Privacy Policy periodically to reflect changes in our services or legal obligations. When changes are made, we will update the &quot;Last Updated&quot; date at the top of this page.
              </Prose>
            </section>

            <Divider />

            {/* Section 11 */}
            <section id="section-11">
              <SectionHeading number="11" title="Contact Us" />
              <Prose>
                If you have any questions, concerns, or requests regarding this Privacy Policy or your data protection rights, please contact our Data Protection Officer at:
              </Prose>
              <div className="mt-4 p-5 bg-[#FDFCFB] border border-[#E7E2DE] rounded-[16px] space-y-2">
                <p className="text-[14px] font-bold text-[#111]">Abroad Simplified — Privacy Team</p>
                <p className="text-[13px] text-[#666]">📧 privacy@abroadsimplified.com</p>
                <p className="text-[13px] text-[#666]">🌐 www.abroadsimplified.com</p>
                <p className="text-[13px] text-[#666]">📍 India</p>
              </div>
            </section>

          </div>

          {/* FOOTER CTA */}
          <div className="bg-gradient-to-br from-[#690B1B] to-[#530816] p-6 sm:p-8 text-white text-center">
            <p className="text-[15px] font-semibold mb-2">Have questions about your data?</p>
            <p className="text-white/70 text-[13px] mb-5">
              Read our full Terms &amp; Conditions or reach out to our support team anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white border border-white/20 font-bold text-[14px] px-6 py-3 rounded-full hover:bg-white/20 transition-all"
              >
                View Terms &amp; Conditions
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-[#690B1B] font-bold text-[14px] px-6 py-3 rounded-full hover:bg-[#F9F7F5] transition-all shadow-lg"
              >
                Create Account →
              </Link>
            </div>
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
