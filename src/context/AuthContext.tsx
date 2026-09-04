'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  uid: string;
  fullName?: string;
  name?: string;
  email: string;
  role?: string;
  photoURL?: string;
  institution?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string, agreedToTerms?: boolean) => Promise<void>;
  googleSignIn: (agreedToTerms?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  googleSignIn: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Provide immediate fallback userData so the app is instantly responsive
        const initialData: UserData = {
          uid: currentUser.uid,
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Student',
          fullName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Student',
          email: currentUser.email || '',
          role: 'student',
          photoURL: currentUser.photoURL || undefined
        };
        setUserData(initialData);

        // Asynchronously attempt to fetch document from Firestore with a 3-second timeout
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const fetchPromise = getDoc(userRef);
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
          const userSnap = await Promise.race([fetchPromise, timeoutPromise]);
          if (userSnap && 'exists' in userSnap && userSnap.exists()) {
            setUserData({ ...initialData, ...userSnap.data() } as UserData);
          }
        } catch (e) {
          console.warn('Firestore user profile fetch notice (offline/delayed):', e);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
  };

  const signup = async (name: string, email: string, pass: string, agreedToTerms = false) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    
    // Set immediate user data
    setUserData({
      uid: res.user.uid,
      name: cleanName,
      fullName: cleanName,
      email: cleanEmail,
      role: 'student'
    });

    // Attempt to persist profile to Firestore safely without failing the signup
    try {
      const userRef = doc(db, 'users', res.user.uid);
      const writePromise = setDoc(userRef, {
        name: cleanName,
        fullName: cleanName,
        email: cleanEmail,
        role: 'student',
        createdAt: serverTimestamp(),
        termsAgreed: agreedToTerms,
        termsAgreedAt: agreedToTerms ? serverTimestamp() : null,
        termsVersion: '2026-09-04'
      }, { merge: true });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      await Promise.race([writePromise, timeoutPromise]);
    } catch (firestoreErr) {
      console.warn('Firestore profile save notice (offline or rules not deployed):', firestoreErr);
    }
  };

  const googleSignIn = async (agreedToTerms = false) => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, provider);
    
    const displayName = res.user.displayName || res.user.email?.split('@')[0] || 'Student';
    const email = res.user.email || '';

    setUserData({
      uid: res.user.uid,
      name: displayName,
      fullName: displayName,
      email: email,
      role: 'student',
      photoURL: res.user.photoURL || undefined
    });

    // Safe background Firestore sync
    try {
      const userRef = doc(db, 'users', res.user.uid);
      const fetchPromise = getDoc(userRef);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const userSnap = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (userSnap && 'exists' in userSnap && userSnap.exists()) {
        // Existing user: update termsAgreed only if not already agreed
        const existingData = userSnap.data();
        if (agreedToTerms && !existingData?.termsAgreed) {
          const writePromise = setDoc(userRef, {
            termsAgreed: true,
            termsAgreedAt: serverTimestamp(),
            termsVersion: '2026-09-04'
          }, { merge: true });
          await Promise.race([writePromise, timeoutPromise]);
        }
        setUserData({
          uid: res.user.uid,
          name: displayName,
          fullName: displayName,
          email: email,
          role: 'student',
          photoURL: res.user.photoURL || undefined,
          ...existingData
        } as UserData);
      } else {
        // New user via Google: save profile + terms agreement
        const writePromise = setDoc(userRef, {
          name: displayName,
          fullName: displayName,
          email: email,
          role: 'student',
          photoURL: res.user.photoURL || '',
          createdAt: serverTimestamp(),
          termsAgreed: agreedToTerms,
          termsAgreedAt: agreedToTerms ? serverTimestamp() : null,
          termsVersion: '2026-09-04'
        }, { merge: true });
        await Promise.race([writePromise, timeoutPromise]);
      }
    } catch (firestoreErr) {
      console.warn('Firestore Google sign-in profile notice:', firestoreErr);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, signup, googleSignIn, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
