import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Abroad Simplified — Study Abroad & University Finder',
  description:
    'Discover top global universities, match scholarships, receive AI SOP & visa assistance, and take career psychometric assessments.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-[#F6F4F2] text-[#111111] min-h-screen flex flex-col antialiased font-[Poppins]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
