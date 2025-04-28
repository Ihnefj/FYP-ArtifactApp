import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../FirebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';

// Initialisations ---------------------
export const CUSTOM_FOODS_KEY = '@custom_foods';
export const CUSTOM_FOODS_COLLECTION = 'customFoods';

// State -------------------------------
// Handlers ----------------------------
export const customFoods = {
  async getLocalFoods() {
    try {
      const foods = await AsyncStorage.getItem(CUSTOM_FOODS_KEY);
      const parsedFoods = foods ? JSON.parse(foods) : [];

      return parsedFoods.map((f) => ({
        ...f,
        amount: f.amount || 100
      }));
    } catch (error) {
      console.error('Error getting local foods:', error);
      return [];
    }
  },

  async saveLocalFood(food) {
    try {
      const foods = await this.getLocalFoods();
      foods.push(food);
      await AsyncStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(foods));
      return food;
    } catch (error) {
      console.error('Error saving local food:', error);
      throw error;
    }
  },

  async getFirebaseFoods(userId) {
    if (!userId) {
      console.warn('No userId provided for getFirebaseFoods');
      return [];
    }

    try {
      const q = query(
        collection(db, CUSTOM_FOODS_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const f = doc.data();
        return {
          id: doc.id,
          ...f,
          amount: f.amount || 100
        };
      });
    } catch (error) {
      console.error('Error getting Firebase foods:', error);
      return [];
    }
  },

  async saveFirebaseFood(food, userId) {
    if (!userId) {
      console.warn('No userId provided for saveFirebaseFood');
      return this.saveLocalFood(food);
    }

    try {
      const docRef = await addDoc(collection(db, CUSTOM_FOODS_COLLECTION), {
        ...food,
        userId,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...food };
    } catch (error) {
      console.error('Error saving Firebase food:', error);
      return this.saveLocalFood(food);
    }
  },

  async updateFirebaseFood(foodId, updates, userId) {
    if (!foodId || !userId) {
      console.warn('FoodId or UserId is missing');
      return null;
    }

    try {
      const foodRef = doc(db, CUSTOM_FOODS_COLLECTION, foodId);
      const foodDoc = await getDoc(foodRef);

      if (!foodDoc.exists()) {
        console.warn('Food not found for updateFirebaseFood');
        return null;
      }

      const foodData = foodDoc.data();
      if (foodData.userId !== userId) {
        console.warn('Food does not belong to the current user');
        return null;
      }

      const updateData = {
        ...updates,
        amount: updates.amount || 100
      };

      await updateDoc(foodRef, updateData);

      console.log('Food updated successfully:', updateData);
      return { id: foodId, ...updateData };
    } catch (error) {
      console.error('Error updating Firebase food:', error);
      throw error;
    }
  },

  async deleteFirebaseFood(foodId, userId) {
    if (!foodId) {
      console.warn('No foodId provided for deleteFirebaseFood');
      return null;
    }

    if (!userId) {
      console.warn('No userId provided for deleteFirebaseFood');
      return null;
    }

    try {
      const foodRef = doc(db, CUSTOM_FOODS_COLLECTION, foodId);
      const foodDoc = await getDoc(foodRef);

      if (!foodDoc.exists()) {
        console.warn('Food not found for deleteFirebaseFood');
        return null;
      }

      const foodData = foodDoc.data();
      if (foodData.userId !== userId) {
        console.warn('Food does not belong to the current user');
        return null;
      }

      await deleteDoc(foodRef);
      return foodId;
    } catch (error) {
      console.error('Error deleting Firebase food:', error);
      throw error;
    }
  },

  async syncLocalToFirebase(userId) {
    if (!userId) {
      console.warn('No userId provided for syncLocalToFirebase');
      return;
    }

    try {
      const localFoods = await this.getLocalFoods();
      for (const food of localFoods) {
        await this.saveFirebaseFood(food, userId);
      }
      await AsyncStorage.removeItem(CUSTOM_FOODS_KEY);
    } catch (error) {
      console.error('Error syncing local to Firebase:', error);
      throw error;
    }
  }
};

// View --------------------------------
