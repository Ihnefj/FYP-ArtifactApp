import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { customFoods, CUSTOM_FOODS_KEY } from '../data/customFoods';

// Initialisations ---------------------
const CustomFoodsContext = createContext();
export const useCustomFoods = () => useContext(CustomFoodsContext);

// State -------------------------------
// Handlers ----------------------------
export const CustomFoodsProvider = ({ children }) => {
  const [customFoodsList, setCustomFoodsList] = useState([]);
  const subscribers = [];

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        loadCustomFoodsFromFirebase(user.uid);
      } else {
        loadCustomFoodsFromStorage();
      }
    });
    return unsubscribe;
  }, []);

  const loadCustomFoodsFromFirebase = async (uid) => {
    try {
      const foods = await customFoods.getFirebaseFoods(uid);
      setCustomFoodsList(foods);
    } catch (error) {
      console.error('Error loading custom foods from Firebase:', error);
      setCustomFoodsList([]);
    }
  };

  const loadCustomFoodsFromStorage = async () => {
    try {
      const foods = await customFoods.getLocalFoods();
      setCustomFoodsList(foods);
    } catch (error) {
      console.error('Error loading custom foods from AsyncStorage:', error);
      setCustomFoodsList([]);
    }
  };

  const saveCustomFoods = async (newFoods) => {
    setCustomFoodsList(newFoods);
    const user = getAuth().currentUser;
    if (user && user.uid) {
      try {
        for (const food of newFoods) {
          if (food.id) {
            await customFoods.updateFirebaseFood(food.id, food, user.uid);
          } else {
            await customFoods.saveFirebaseFood(food, user.uid);
          }
        }
      } catch (error) {
        console.error('Error saving custom foods to Firebase:', error);
      }
    } else {
      try {
        await AsyncStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(newFoods));
      } catch (error) {
        console.error('Error saving custom foods to AsyncStorage:', error);
      }
    }
    notifySubscribers();
  };

  const addCustomFood = (food) => {
    const newFoods = [...customFoodsList, food];
    saveCustomFoods(newFoods);
  };

  const updateCustomFood = (updatedFood) => {
    const newFoods = customFoodsList.map((food) =>
      food.id === updatedFood.id || food.FoodID === updatedFood.FoodID
        ? updatedFood
        : food
    );
    saveCustomFoods(newFoods);
  };

  const deleteCustomFood = async (foodToDelete) => {
    try {
      const user = getAuth().currentUser;
      if (user && foodToDelete.id) {
        await customFoods.deleteFirebaseFood(foodToDelete.id, user.uid);
        const mealsRef = doc(db, 'users', user.uid);
        const mealsDoc = await getDoc(mealsRef);
        if (mealsDoc.exists()) {
          const mealsData = mealsDoc.data();
          if (mealsData.mealsData) {
            const updatedMeals = mealsData.mealsData.filter(
              (meal) => meal.FoodID !== foodToDelete.FoodID
            );
            await setDoc(
              mealsRef,
              { mealsData: updatedMeals },
              { merge: true }
            );
          }
        }
      } else {
        const foods = await customFoods.getLocalFoods();
        const updatedFoods = foods.filter(
          (food) => food.FoodID !== foodToDelete.FoodID
        );
        await AsyncStorage.setItem(
          CUSTOM_FOODS_KEY,
          JSON.stringify(updatedFoods)
        );

        const storedMeals = await AsyncStorage.getItem('@meals');
        if (storedMeals) {
          const mealsArray = JSON.parse(storedMeals);
          const updatedMeals = mealsArray.filter(
            (meal) => meal.FoodID !== foodToDelete.FoodID
          );
          await AsyncStorage.setItem('@meals', JSON.stringify(updatedMeals));
        }
      }

      const newFoods = customFoodsList.filter((food) =>
        user && food.id
          ? food.id !== foodToDelete.id
          : food.FoodID !== foodToDelete.FoodID
      );
      saveCustomFoods(newFoods);
    } catch (error) {
      console.error('Error deleting custom food:', error);
      throw error;
    }
  };

  const notifySubscribers = () => {
    subscribers.forEach((callback) => callback());
  };

  const subscribe = (callback) => {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  };

  return (
    <CustomFoodsContext.Provider
      value={{
        customFoodsList,
        addCustomFood,
        updateCustomFood,
        deleteCustomFood,
        subscribe
      }}
    >
      {children}
    </CustomFoodsContext.Provider>
  );
};
