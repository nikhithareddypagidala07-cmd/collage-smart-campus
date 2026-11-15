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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check whether actual configuration keys have been provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== ""
);

// Initialize Firebase (singleton pattern)
export const app = isFirebaseConfigured
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

// Initialize Firebase Authentication & Cloud Firestore
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export default app;
