import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const getValidConfigValue = (val: string | undefined, fallback: string): string => {
  if (!val || val.includes('DemoPlaceholder') || val.includes('demo-app') || val.includes('1234567890')) {
    return fallback;
  }
  return val;
};

const firebaseConfig = {
  apiKey: getValidConfigValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'AIzaSyC9t0lqpr7r9cGqDHWprXt972HUTR6LlGo'),
  authDomain: getValidConfigValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'abroad-simplified.firebaseapp.com'),
  projectId: getValidConfigValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'abroad-simplified'),
  storageBucket: getValidConfigValue(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'abroad-simplified.firebasestorage.app'),
  messagingSenderId: getValidConfigValue(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, '829246439395'),
  appId: getValidConfigValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, '1:829246439395:web:f63036bb6c25a66281ead6'),
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
