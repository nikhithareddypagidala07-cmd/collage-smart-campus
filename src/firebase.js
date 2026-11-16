import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase Web App Configuration
 * 
 * Please replace the placeholder values below with your actual Firebase config
 * obtained from the Firebase Console:
 * Firebase Console -> Project Settings -> General -> Your apps -> Web app -> SDK setup and configuration.
 *
 * You can either paste your credentials directly here or set them in a .env file.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB6Hc2s7Yk6HZ57fAPJ6lDRCiGFCdtE-5Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "campus-care-ae2b5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "campus-care-ae2b5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "campus-care-ae2b5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "16770221445",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:16770221445:web:2784a46133d4345d0770ec"
};

// Check whether actual configuration keys have been provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.trim() !== "" &&
  !firebaseConfig.apiKey.toUpperCase().includes("YOUR_API_KEY")
);

// Initialize Firebase (singleton pattern)
export const app = isFirebaseConfigured
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

// Initialize Firebase Authentication & Cloud Firestore
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export default app;
