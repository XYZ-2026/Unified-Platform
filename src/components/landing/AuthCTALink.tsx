'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface AuthCTALinkProps {
  dashboardHref?: string;
  loginHref?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A link that dynamically points to the dashboard (when logged in)
 * or the login page (when logged out). Enables SSR of surrounding
 * content while keeping auth logic client-side.
 */
export default function AuthCTALink({
  dashboardHref = '/dashboard',
  loginHref = '/login',
  className,
  children,
}: AuthCTALinkProps) {
  const { user } = useAuth();
  return (
    <Link href={user ? dashboardHref : loginHref} className={className}>
      {children}
    </Link>
  );
}
