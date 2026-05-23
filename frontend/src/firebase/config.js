import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Replace these placeholders with your actual Firebase project settings
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "prince-portfolio.firebaseapp.com",
  projectId: "prince-portfolio",
  storageBucket: "prince-portfolio.appspot.com",
  messagingSenderId: "PLACEHOLDER_SENDER_ID",
  appId: "PLACEHOLDER_APP_ID",
  measurementId: "PLACEHOLDER_MEASUREMENT_ID"
};

// Check if configuration has been filled out or if it's default/placeholders
export const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.startsWith("PLACEHOLDER_");

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
