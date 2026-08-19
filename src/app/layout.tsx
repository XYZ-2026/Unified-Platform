import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://prep.abroadsimplified.com'),
  title: {
    default: 'Abroad Simplified — Your Ultimate Study Abroad Hub',
    template: '%s | Abroad Simplified',
  },
  description:
    'University finder, AI-powered SOP builder, scholarship matching, and visa guidance. Everything you need to study abroad, simplified.',
  keywords: [
    'study abroad',
    'university finder',
    'scholarship finder',
    'SOP builder',
    'visa guidance',
    'abroad simplified',
    'study in USA',
    'study in UK',
    'study in Germany',
  ],
  openGraph: {
    title: 'Abroad Simplified — Your Ultimate Study Abroad Hub',
    description:
      'University finder, AI-powered SOP builder, scholarship matching, and visa guidance — all in one platform.',
    siteName: 'Abroad Simplified',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abroad Simplified — Your Ultimate Study Abroad Hub',
    description:
      'University finder, AI-powered SOP builder, scholarship matching, and visa guidance — all in one platform.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable}`} suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
