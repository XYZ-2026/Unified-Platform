'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, signup, googleSignIn, resetPassword } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Target redirect ref to prevent race condition with onAuthStateChanged
  const targetRedirectRef = React.useRef<string | null>(null);

  // Redirect if already logged in (e.g. direct page visit)
  React.useEffect(() => {
    if (user) {
      const destination = targetRedirectRef.current || '/dashboard';
      router.push(destination);
    }
  }, [user, router]);

  const formatAuthError = (err: any, fallback: string) => {
    if (!err) return fallback;
    const code = err.code || '';
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
      return 'Invalid email or password. Please check your credentials.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email already exists. Please sign in.';
    }
    if (code === 'auth/weak-password') {
      return 'Password is too weak. Please use at least 6 characters.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'This domain is not authorized in Firebase Console. Please add your domain to Firebase Auth > Settings > Authorized Domains.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Sign-in pop-up was blocked by your browser. Please allow pop-ups for this site.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Google sign-in pop-up was closed before completing.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your connection and try again.';
    }
    return err.message || fallback;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    targetRedirectRef.current = '/dashboard';
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      targetRedirectRef.current = null;
      console.error(err);
      setError(formatAuthError(err, 'Failed to sign in. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!agreedToTerms) {
      setError('You must agree to the Terms & Conditions to create an account.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    targetRedirectRef.current = '/onboarding';
    try {
      await signup(name, email, password);
      router.push('/onboarding');
    } catch (err: any) {
      targetRedirectRef.current = null;
      console.error(err);
      setError(formatAuthError(err, 'Failed to register account.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    targetRedirectRef.current = '/onboarding';
    try {
      await googleSignIn();
      router.push('/onboarding');
    } catch (err: any) {
      targetRedirectRef.current = null;
      console.error(err);
      setError(formatAuthError(err, 'Google sign-in failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4F2] flex flex-col justify-center items-center p-5 selection:bg-[#690B1B] selection:text-white">
      {/* BRAND LOGO & NAME HEADER */}
      <Link href="/" className="flex items-center gap-3.5 mb-8 hover:opacity-90 transition-opacity">
        <div className="w-[52px] h-[52px] rounded-[16px] shadow-[0_8px_24px_rgba(105,11,27,0.22)] overflow-hidden shrink-0">
          <img src="/logo.png" alt="Abroad Simplified Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-[22px] font-bold text-[#111111] tracking-[-0.04em] leading-none">
            Abroad Simplified
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="w-[4px] h-[4px] rounded-full bg-[#C9A55D]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A3A3A3]">
              AI Admissions Platform
            </span>
          </div>
        </div>
      </Link>

      {/* AUTH CONTAINER CARD */}
      <div className="w-full max-w-[460px] bg-white border border-[#E7E2DE] rounded-[24px] p-6 sm:p-8 shadow-xs space-y-6">
        {/* TAB SWITCHER */}
        <div className="flex items-center gap-1 bg-[#F7F5F3] p-1 rounded-full border border-[#E7E2DE]">
          <button
            onClick={() => { setTab('login'); setError(''); setMessage(''); }}
            className={`flex-1 py-2 rounded-full text-[13px] font-bold transition-all ${
              tab === 'login' ? 'bg-white text-[#690B1B] shadow-2xs' : 'text-[#666] hover:text-[#111]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); setMessage(''); }}
            className={`flex-1 py-2 rounded-full text-[13px] font-bold transition-all ${
              tab === 'register' ? 'bg-white text-[#690B1B] shadow-2xs' : 'text-[#666] hover:text-[#111]'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('forgot'); setError(''); setMessage(''); }}
            className={`flex-1 py-2 rounded-full text-[13px] font-bold transition-all ${
              tab === 'forgot' ? 'bg-white text-[#690B1B] shadow-2xs' : 'text-[#666] hover:text-[#111]'
            }`}
          >
            Reset
          </button>
        </div>

        {/* ERROR / MESSAGE ALERTS */}
        {error && (
          <div className="p-3.5 rounded-[14px] bg-[#FDF2F2] border border-[#F8B4B4] text-[#991B1B] text-[13px] flex items-center gap-2 font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="p-3.5 rounded-[14px] bg-[#F0FDF4] border border-[#86EFAC] text-[#166534] text-[13px] flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[12px] font-bold text-[#555] block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#555] block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[46px] pl-3.5 pr-11 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#111]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In →'}</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-[#E7E2DE]" />
              <span className="px-3 text-[11px] text-[#999] font-bold uppercase">OR</span>
              <div className="flex-1 h-px bg-[#E7E2DE]" />
            </div>

            {/* T&C for Google sign-in */}
            <div className="flex items-start gap-2.5">
              <div
                role="checkbox"
                aria-checked={agreedToTerms}
                id="login-terms-checkbox"
                tabIndex={0}
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                onKeyDown={(e) => e.key === ' ' && setAgreedToTerms(!agreedToTerms)}
                className={`mt-0.5 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                  agreedToTerms
                    ? 'bg-[#690B1B] border-[#690B1B]'
                    : 'bg-white border-[#D1CBC4] hover:border-[#690B1B]'
                }`}
              >
                {agreedToTerms && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <label htmlFor="login-terms-checkbox" className="text-[12px] text-[#555] leading-relaxed cursor-pointer select-none">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-[#690B1B] font-bold hover:underline">
                  Terms &amp; Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="text-[#690B1B] font-bold hover:underline">
                  Privacy Policy
                </Link>{' '}
                of Abroad Simplified
              </label>
            </div>

            {/* GOOGLE SIGN IN BUTTON */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading || !agreedToTerms}
              title={!agreedToTerms ? 'Please agree to the Terms & Conditions first' : ''}
              className="w-full h-[48px] rounded-full border border-[#E7E2DE] bg-white text-[#333] font-bold text-[14px] hover:bg-[#F9F7F5] transition-all flex items-center justify-center gap-3 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-[12px] font-bold text-[#555] block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#555] block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#555] block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#555] block mb-1">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
              />
            </div>

            {/* T&C CHECKBOX */}
            <div className="flex items-start gap-2.5 py-1">
              <div
                role="checkbox"
                aria-checked={agreedToTerms}
                id="register-terms-checkbox"
                tabIndex={0}
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                onKeyDown={(e) => e.key === ' ' && setAgreedToTerms(!agreedToTerms)}
                className={`mt-0.5 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                  agreedToTerms
                    ? 'bg-[#690B1B] border-[#690B1B]'
                    : 'bg-white border-[#D1CBC4] hover:border-[#690B1B]'
                }`}
              >
                {agreedToTerms && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <label htmlFor="register-terms-checkbox" className="text-[12px] text-[#555] leading-relaxed cursor-pointer select-none">
                I have read and agree to the{' '}
                <Link href="/terms" target="_blank" className="text-[#690B1B] font-bold hover:underline">
                  Terms &amp; Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="text-[#690B1B] font-bold hover:underline">
                  Privacy Policy
                </Link>{' '}
                of Abroad Simplified.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              title={!agreedToTerms ? 'Please agree to the Terms & Conditions to continue' : ''}
              className="w-full h-[48px] rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account →'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: RESET PASSWORD FORM */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label className="text-[12px] font-bold text-[#555] block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[46px] px-3.5 rounded-[12px] bg-[#FDFCFB] border border-[#E7E2DE] text-[14px] text-[#111] outline-none focus:border-[#690B1B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] rounded-full bg-[#690B1B] hover:bg-[#7A1022] text-white font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span>{loading ? 'Sending Link...' : 'Send Password Reset Link →'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
