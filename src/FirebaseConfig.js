// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA8tx_NB83XUZb7PTK-TY9VhDeBT93QhcA',
  authDomain: 'chewie-3c57c.firebaseapp.com',
  projectId: 'chewie-3c57c',
  storageBucket: 'chewie-3c57c.firebasestorage.app',
  messagingSenderId: '467863091411',
  appId: '1:467863091411:web:ce90f93728508b9dfefc26',
  measurementId: 'G-L4SK1RP5J0'
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
