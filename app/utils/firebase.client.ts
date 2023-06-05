import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

export default function setClientFirebase(env: any) {
  const app = initializeApp(env);

  const storage = getStorage(app);
  const db = getFirestore(app);
  const functions = getFunctions(app);

  return { storage, db, functions };
}

// Subsequent queries will use persistence, if it was enabled successfully
