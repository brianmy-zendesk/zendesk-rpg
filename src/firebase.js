import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "zendesk-rpg.firebaseapp.com",
  projectId: "zendesk-rpg",
  storageBucket: "zendesk-rpg.firebasestorage.app",
  messagingSenderId: "75912819256",
  appId: "1:75912819256:web:b27ab8f83dfc97daf3accd",
  measurementId: "G-FBCDFNBJGB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
