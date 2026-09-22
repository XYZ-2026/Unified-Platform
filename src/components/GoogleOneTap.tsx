'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Google GSI typings
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (momentListener?: (notification: any) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '829246439395-i37rvdbch9scch207hqhknb0k333fuft.apps.googleusercontent.com';

// Pages where One Tap should NOT appear (user is already in auth flow)
const SUPPRESSED_PATHS = ['/login', '/onboarding'];

export default function GoogleOneTap() {
  const { user, loading, signInWithGoogleIdToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Use refs to keep callback stable and avoid effect dependency churn
  const signInRef = useRef(signInWithGoogleIdToken);
  const routerRef = useRef(router);
  const scriptLoadedRef = useRef(false);
  const promptActiveRef = useRef(false);

  signInRef.current = signInWithGoogleIdToken;
  routerRef.current = router;

  // Disable auto-select when user is authenticated (prevents re-prompting)
  useEffect(() => {
    if (user && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
      promptActiveRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    // Don't show One Tap if:
    // - No client ID configured
    // - User is already signed in
    // - Auth state is still loading
    // - We're on a suppressed page (login, onboarding)
    if (!GOOGLE_CLIENT_ID) {
      console.warn('[Google One Tap] NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing.');
      return;
    }
    if (loading) return;
    if (user) return;
    if (SUPPRESSED_PATHS.some((p) => pathname.startsWith(p))) {
      // On suppressed pages, just mark prompt as inactive — don't call cancel()
      // to avoid FedCM AbortError when navigating between pages
      promptActiveRef.current = false;
      return;
    }

    const handleCredentialResponse = (response: GoogleCredentialResponse) => {
      console.log('[Google One Tap] Credential received from Google, authenticating with Firebase...');
      signInRef.current(response.credential)
        .then(({ isNewUser }) => {
          console.log('[Google One Tap] Sign-in successful. isNewUser:', isNewUser);
          routerRef.current.push(isNewUser ? '/onboarding' : '/dashboard');
        })
        .catch((err) => {
          console.error('[Google One Tap] Firebase sign-in error:', err);
        });
    };

    const initializeOneTap = () => {
      if (!window.google?.accounts?.id) return;
      if (promptActiveRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true,
        use_fedcm_for_prompt: true,
      });

      promptActiveRef.current = true;
      window.google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed?.()) {
          const reason = notification.getNotDisplayedReason?.();
          console.warn('[Google One Tap] Prompt not displayed. Reason:', reason);
          promptActiveRef.current = false;
        } else if (notification?.isSkippedMoment?.()) {
          const reason = notification.getSkippedReason?.();
          console.warn('[Google One Tap] Prompt skipped. Reason:', reason);
          promptActiveRef.current = false;
        } else if (notification?.isDismissedMoment?.()) {
          const reason = notification.getDismissedReason?.();
          console.info('[Google One Tap] Prompt dismissed by user. Reason:', reason);
          promptActiveRef.current = false;
        }
      });
    };

    // Load GSI script if not already loaded
    if (!scriptLoadedRef.current) {
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (existingScript) {
        scriptLoadedRef.current = true;
        initializeOneTap();
      } else {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          scriptLoadedRef.current = true;
          initializeOneTap();
        };
        document.head.appendChild(script);
      }
    } else {
      initializeOneTap();
    }

    // No cleanup cancel() — FedCM handles dismissal automatically.
    // Calling cancel() mid-flight causes FedCM AbortError in the console.
  }, [user, loading, pathname]);

  // This component renders nothing — One Tap UI is managed by Google's script
  return null;
}
