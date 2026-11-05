import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// ─── Firebase Admin SDK (lazy-initialized once per server lifecycle) ──────────
function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Firebase Admin env vars missing. Add FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PROJECT_ID to .env.local');
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // Next.js env vars store \n as literal \\n — replace them back
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

// ─── Google public key cache ──────────────────────────────────────────────────
let cachedGoogleKeys: Record<string, string> = {};
let keyCacheExpiry = 0;

async function getGooglePublicKeys(): Promise<Record<string, string>> {
  const now = Date.now();
  if (now < keyCacheExpiry && Object.keys(cachedGoogleKeys).length > 0) {
    return cachedGoogleKeys;
  }

  const res = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  const cacheControl = res.headers.get('cache-control') ?? '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;

  cachedGoogleKeys = await res.json();
  keyCacheExpiry = now + maxAge * 1000;
  return cachedGoogleKeys;
}

// ─── Verify a Google id_token using Google's tokeninfo endpoint ───────────────
// This approach works with ANY Google OAuth client ID, not just the Firebase one.
async function verifyGoogleToken(idToken: string): Promise<{
  sub: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
}> {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token verification failed: ${body}`);
  }

  const payload = await res.json();

  if (!payload.sub || !payload.email) {
    throw new Error('Invalid token payload – missing sub or email');
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email.split('@')[0],
    picture: payload.picture ?? '',
    email_verified: payload.email_verified === 'true' || payload.email_verified === true,
  };
}

// ─── POST /api/auth/google-onetap ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
    }

    // 1. Verify the Google token via Google's public tokeninfo endpoint.
    //    This validates signature + expiry for ANY Google OAuth client.
    const googleUser = await verifyGoogleToken(idToken);

    // 2. Get/create the Firebase user by email using Admin SDK.
    const adminApp = getAdminApp();
    const adminAuth = getAuth(adminApp);

    let firebaseUid: string;

    try {
      // Try to find existing user by email
      const existingUser = await adminAuth.getUserByEmail(googleUser.email);
      firebaseUid = existingUser.uid;

      // Update display name / photo if they were empty
      if (!existingUser.displayName || !existingUser.photoURL) {
        await adminAuth.updateUser(firebaseUid, {
          displayName: existingUser.displayName || googleUser.name,
          photoURL: existingUser.photoURL || googleUser.picture,
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        // Create a new Firebase user for first-time One Tap users
        const newUser = await adminAuth.createUser({
          email: googleUser.email,
          displayName: googleUser.name,
          photoURL: googleUser.picture,
          emailVerified: googleUser.email_verified,
          providerToLink: {
            uid: googleUser.sub,
            providerId: 'google.com',
            email: googleUser.email,
            displayName: googleUser.name,
            photoURL: googleUser.picture,
          },
        });
        firebaseUid = newUser.uid;
      } else {
        throw err;
      }
    }

    // 3. Create a Firebase custom token for this user.
    //    The client uses signInWithCustomToken(auth, customToken) to sign in.
    const customToken = await adminAuth.createCustomToken(firebaseUid, {
      signInMethod: 'google_one_tap',
    });

    return NextResponse.json({ customToken, uid: firebaseUid });
  } catch (err: any) {
    console.error('[One Tap API] Error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
