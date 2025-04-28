import { db } from '../FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Initialisations ---------------------
const COLLECTION_NAME = 'userSettings';

// State -------------------------------
// Handlers ----------------------------
export const userSettings = {
  async getProfile(userId) {
    if (!userId) return null;
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().profile : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  async saveProfile(userId, profile) {
    if (!userId) return;
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      await setDoc(docRef, { profile }, { merge: true });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  },

  async getGoals(userId) {
    if (!userId) return null;
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().goals : null;
    } catch (error) {
      console.error('Error getting goals:', error);
      return null;
    }
  },

  async saveGoals(userId, goals) {
    if (!userId) return;
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      await setDoc(docRef, { goals }, { merge: true });
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }
};

// View --------------------------------
