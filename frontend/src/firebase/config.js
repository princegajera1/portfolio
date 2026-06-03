import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase project configuration (public credentials — safe to include in frontend)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC4GGiLzrDWRmY9IUrTuC0aTw75NqNtAY8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "prince-portfolio-155bf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "prince-portfolio-155bf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "prince-portfolio-155bf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109021156926",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109021156926:web:47dece61ca17875f32636f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-S797VBLCHM"
};

// Firebase credentials are always valid (real values baked in as fallbacks)
export const isFirebaseConfigured = 
  !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;


let app;
let db = null;
let auth = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);  
  }
} else {
  console.warn(
    "⚠️ Firebase configuration has placeholders. Local Mock Database is enabled. " +
    "Please update your settings in frontend/src/firebase/config.js."
  );
}

export { db, auth, storage };
