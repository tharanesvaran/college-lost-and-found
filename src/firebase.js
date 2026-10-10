import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, addDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Web app Firebase configuration
// Values can be set in .env or configured in settings
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyDemoDummyApiKeyForMCETLostAndFound",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "mcet-lost-found.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "mcet-lost-found",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "mcet-lost-found.appspot.com",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const db = getFirestore(app);
export const functions = getFunctions(app, "asia-south1");

/**
 * Sign In with Google Provider
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

/**
 * Check if the user is in the admin allowlist
 * Requires username ending in .admin and matching Google email
 */
export async function verifyAdminAllowlist(adminUsername, userEmail) {
  if (!adminUsername || !adminUsername.endsWith('.admin')) {
    throw new Error('Admin username must end with .admin (e.g. office1.admin)');
  }
  const allowlistRef = doc(db, 'adminAllowlist', adminUsername.toLowerCase());
  const allowlistSnap = await getDoc(allowlistRef);
  if (!allowlistSnap.exists()) {
    throw new Error(`Username ${adminUsername} is not in the approved database allowlist.`);
  }
  const data = allowlistSnap.data();
  if (data.email.toLowerCase() !== userEmail.toLowerCase()) {
    throw new Error(`Google account ${userEmail} is not mapped to admin username ${adminUsername}.`);
  }
  return data;
}

export { app };
