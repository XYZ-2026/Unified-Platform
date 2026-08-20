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
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
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
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData({ uid: currentUser.uid, ...userSnap.data() } as UserData);
          } else {
            setUserData({
              uid: currentUser.uid,
              name: currentUser.displayName || 'Student',
              fullName: currentUser.displayName || 'Student',
              email: currentUser.email || '',
              role: 'student'
            });
          }
        } catch (e) {
          console.error('Error fetching user profile:', e);
          setUserData({
            uid: currentUser.uid,
            name: currentUser.displayName || 'Student',
            fullName: currentUser.displayName || 'Student',
            email: currentUser.email || '',
            role: 'student'
          });
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

  const signup = async (name: string, email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    await setDoc(doc(db, 'users', res.user.uid), {
      name: name.trim(),
      fullName: name.trim(),
      email: cleanEmail,
      role: 'student',
      createdAt: serverTimestamp()
    });
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const userRef = doc(db, 'users', res.user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: res.user.displayName || 'Student',
        fullName: res.user.displayName || 'Student',
        email: res.user.email || '',
        role: 'student',
        createdAt: serverTimestamp()
      });
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
