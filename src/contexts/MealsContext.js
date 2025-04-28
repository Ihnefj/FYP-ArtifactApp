import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../FirebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Initialisations ---------------------
const MealsContext = createContext();
export const useMeals = () => useContext(MealsContext);
export const MealsProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const LOCAL_STORAGE_KEY = '@meals';
  const subscribers = [];

  // State -------------------------------
  // Handlers ----------------------------
  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        loadMealsFromFirebase(user.uid);
      } else {
        loadMealsFromStorage();
      }
    });
    return unsubscribe;
  }, []);

  const loadMealsFromFirebase = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data()) {
        const data = docSnap.data();
        if (data.mealsData) {
          setMeals(data.mealsData);
        } else {
          await setDoc(docRef, { mealsData: [] }, { merge: true });
          setMeals([]);
        }
      } else {
        await setDoc(docRef, { mealsData: [] });
        setMeals([]);
      }
    } catch (error) {
      console.error('Error loading meals from Firebase:', error);
    }
  };

  const loadMealsFromStorage = async () => {
    try {
      const storedMeals = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }
    } catch (error) {
      console.error('Error loading meals from AsyncStorage:', error);
    }
  };

  const saveMeals = async (newMeals) => {
    setMeals(newMeals);
    const user = auth.currentUser;
    if (user && user.uid) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { mealsData: newMeals }, { merge: true });
      } catch (error) {
        console.error('Error saving meals to Firebase:', error);
      }
    } else {
      try {
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMeals));
      } catch (error) {
        console.error('Error saving meals to AsyncStorage:', error);
      }
    }

    subscribers.forEach((callback) => callback());
  };

  const handleModifyFood = async (updatedFood) => {
    const newMeals = meals.map((meal) => {
      if (meal.id === updatedFood.id || meal.FoodID === updatedFood.FoodID) {
        const originalAmount =
          parseFloat(updatedFood.FoodAmount) ||
          parseFloat(updatedFood.amount) ||
          100;
        const originalUnit = updatedFood.FoodUnit || 'g';

        let standardAmount;
        if (originalUnit === 'g' || originalUnit === 'ml') {
          standardAmount = 100;
        } else if (
          originalUnit === 'tbsp' ||
          originalUnit === 'tsp' ||
          originalUnit === 'serving'
        ) {
          standardAmount = 1;
        } else {
          standardAmount = originalAmount;
        }
        const standardUnit = originalUnit;

        const ratio = standardAmount / originalAmount;
        const standardCalories = Math.round(updatedFood.FoodCalories * ratio);
        const standardProtein = Math.round(updatedFood.FoodProtein * ratio);
        const standardCarbs = Math.round(updatedFood.FoodCarbs * ratio);
        const standardFat = Math.round(updatedFood.FoodFat * ratio);
        const standardFibre = Math.round(updatedFood.FoodFibre * ratio);

        return {
          ...updatedFood,
          uniqueID: meal.uniqueID,
          amount: standardAmount,
          FoodAmount: standardAmount.toString(),
          FoodUnit: standardUnit,
          FoodCalories: standardCalories,
          FoodProtein: standardProtein,
          FoodCarbs: standardCarbs,
          FoodFat: standardFat,
          FoodFibre: standardFibre
        };
      }
      return meal;
    });

    const user = auth.currentUser;
    if (user && user.uid) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { mealsData: newMeals }, { merge: true });
      } catch (error) {
        console.error('Error saving meals to Firebase:', error);
        throw error;
      }
    }

    setMeals(newMeals);
    notifySubscribers();
  };

  const addMeal = (meal) => {
    const newMeals = [...meals, meal];
    saveMeals(newMeals);
  };

  const updateMeal = (mealId, updatedMeal) => {
    const newMeals = meals.map((meal) =>
      meal.id === mealId ? updatedMeal : meal
    );
    saveMeals(newMeals);
  };

  const deleteMeal = (mealId) => {
    const newMeals = meals.filter((meal) => meal.id !== mealId);
    saveMeals(newMeals);
  };

  const deleteMeals = (mealIds) => {
    const newMeals = meals.filter((meal) => !mealIds.includes(meal.id));
    saveMeals(newMeals);
  };

  const syncLocalToFirebase = async (userId) => {
    if (!userId) {
      console.warn('No userId provided for meal sync');
      return;
    }
    try {
      const storedMeals = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedMeals) {
        const mealsArray = JSON.parse(storedMeals);
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, { mealsData: mealsArray }, { merge: true });
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error syncing local meals to Firebase:', error);
    }
  };

  const getMeals = (date) => {
    const mealsForDate = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: []
    };

    meals.forEach((meal) => {
      const mealDate = meal.date;
      const mealType =
        meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1);

      if (mealDate === date && mealsForDate[mealType]) {
        mealsForDate[mealType].push(meal);
      }
    });

    return mealsForDate;
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

  // View --------------------------------
  return (
    <MealsContext.Provider
      value={{
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        deleteMeals,
        syncLocalToFirebase,
        getMeals,
        subscribe,
        handleModifyFood
      }}
    >
      {children}
    </MealsContext.Provider>
  );
};
