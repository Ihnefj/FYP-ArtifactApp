import { db } from '../FirebaseConfig';
import {
  doc,
  collection,
  query,
  getDocs,
  addDoc,
  where,
  deleteDoc
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLLECTION_NAME = 'weightEntries';
const LOCAL_WEIGHT_KEY = '@local_weight_entries';

// Initialisations ---------------------
// State -------------------------------
// Handlers ----------------------------
export const weightData = {
  async getWeightEntries(userId) {
    if (!userId) {
      return this.getLocalWeightEntries();
    }

    try {
      const entriesRef = collection(db, COLLECTION_NAME);
      const q = query(entriesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });

      return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('Error getting weight entries:', error);
      return [];
    }
  },

  async saveWeightEntry(userId, entry) {
    if (!userId) {
      return this.saveLocalWeightEntry(entry);
    }

    try {
      const entriesRef = collection(db, COLLECTION_NAME);
      await addDoc(entriesRef, {
        ...entry,
        userId,
        createdAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      return false;
    }
  },

  async deleteWeightEntry(userId, entryId) {
    if (!userId) {
      return this.deleteLocalWeightEntry(entryId);
    }

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, entryId));
      return true;
    } catch (error) {
      console.error('Error deleting weight entry:', error);
      return false;
    }
  },

  async getLocalWeightEntries() {
    try {
      const entries = await AsyncStorage.getItem(LOCAL_WEIGHT_KEY);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error getting local weight entries:', error);
      return [];
    }
  },

  async saveLocalWeightEntry(entry) {
    try {
      const entries = await this.getLocalWeightEntries();
      const newEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      entries.push(newEntry);
      await AsyncStorage.setItem(LOCAL_WEIGHT_KEY, JSON.stringify(entries));
      return true;
    } catch (error) {
      console.error('Error saving local weight entry:', error);
      return false;
    }
  },

  async deleteLocalWeightEntry(entryId) {
    try {
      const entries = await this.getLocalWeightEntries();
      const filteredEntries = entries.filter((entry) => entry.id !== entryId);
      await AsyncStorage.setItem(
        LOCAL_WEIGHT_KEY,
        JSON.stringify(filteredEntries)
      );
      return true;
    } catch (error) {
      console.error('Error deleting local weight entry:', error);
      return false;
    }
  },

  async clearLocalWeightEntries() {
    try {
      await AsyncStorage.removeItem(LOCAL_WEIGHT_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing local weight entries:', error);
      return false;
    }
  },

  async syncLocalToFirebase(userId) {
    if (!userId) {
      console.warn('No userId provided for syncLocalToFirebase');
      return;
    }

    try {
      const localEntries = await this.getLocalWeightEntries();

      for (const entry of localEntries) {
        await this.saveWeightEntry(userId, entry);
      }

      await this.clearLocalWeightEntries();
    } catch (error) {
      console.error('Error syncing local weight entries to Firebase:', error);
      throw error;
    }
  }
};

// View --------------------------------
