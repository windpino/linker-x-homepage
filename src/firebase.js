import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const getCleanEnv = (val) => {
  if (typeof val !== 'string') return val;
  return val.replace(/['"\s\r\n]/g, '').trim();
};

const firebaseConfig = {
  apiKey: getCleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: getCleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: getCleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: getCleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: getCleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: getCleanEnv(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: getCleanEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID)
};

let app;
let db = null;
let auth = null;

try {
  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase API Key is missing. Please configure VITE_FIREBASE_API_KEY in Vercel settings.");
  }
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
  // Fallback objects to prevent React from crashing (White Screen)
  db = {};
  auth = {
    onAuthStateChanged: (cb) => {
      // Simulate auth loading finished with null user
      setTimeout(() => cb(null), 100);
      return () => {};
    }
  };
}

export { db, auth };
export default app;
