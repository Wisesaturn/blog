import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { DocumentSnapshot, getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import dotenv from 'dotenv';

dotenv.config();
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  storageBucket: process.env.FIREBASE_STORAGE_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export function getEnv() {
  return firebaseConfig;
}

// This helper function pipes your types through a firestore converter
const converter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: DocumentSnapshot) => snap.data() as T,
});

// Subsequent queries will use persistence, if it was enabled successfully

export { storage, db, functions };
