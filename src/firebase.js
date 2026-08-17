import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const getCleanEnv = (val) => {
  if (typeof val !== 'string') return val;
  return val.replace(/['"\s\r\n]/g, '').trim();
};

const firebaseConfig = {
  apiKey: getCleanEnv(import.meta.env.VITE_FIREBASE_API_KEY) || "AIzaSyAqx7nPiQ0mJGqnAGv28dO07C3-GQuqkpk",
  authDomain: getCleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || "link-x-b8208.firebaseapp.com",
  projectId: "link-x-b8208",
  storageBucket: getCleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || "link-x-b8208.firebasestorage.app",
  messagingSenderId: getCleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || "236294239528",
  appId: getCleanEnv(import.meta.env.VITE_FIREBASE_APP_ID) || "1:236294239528:web:8f735c42d36d6d1c434c1d",
  measurementId: getCleanEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) || "G-G8626RZH6X"
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
