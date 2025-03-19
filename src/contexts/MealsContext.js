import React, { createContext, useContext, useState, useCallback } from 'react';

const MealsContext = createContext();

export function MealsProvider({ children }) {
  // Initialisations ---------------------
  // State -------------------------------
  const [mealsByDate, setMealsByDate] = useState({});
  const [subscribers] = useState(new Set());

  // Handlers ----------------------------
  const subscribe = useCallback(
    (callback) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    [subscribers]
  );

  const notifySubscribers = useCallback(() => {
    subscribers.forEach((callback) => callback());
  }, [subscribers]);

  const getMeals = useCallback(
    (date) => {
      return (
        mealsByDate[date] || {
          Breakfast: [],
          Lunch: [],
          Dinner: [],
          Snacks: []
        }
      );
    },
    [mealsByDate]
  );

  const updateMeals = useCallback(
    (date, updatedMeals) => {
      setMealsByDate((prev) => ({
        ...prev,
        [date]: updatedMeals
      }));
      notifySubscribers();
    },
    [notifySubscribers]
  );

  const addFood = useCallback(
    (date, foodItem, mealType) => {
      setMealsByDate((prev) => {
        const updatedMeals = { ...prev };
        updatedMeals[date] = updatedMeals[date] || {
          Breakfast: [],
          Lunch: [],
          Dinner: [],
          Snacks: []
        };
        updatedMeals[date][mealType] = [
          ...(updatedMeals[date][mealType] || []),
          { ...foodItem, uniqueID: `${foodItem.FoodID}-${Date.now()}` }
        ];
        return updatedMeals;
      });
      notifySubscribers();
    },
    [notifySubscribers]
  );

  const handleModifyFood = useCallback(
    (updatedFood, mealType) => {
      setMealsByDate((prev) => {
        const newMealsByDate = { ...prev };
        Object.keys(newMealsByDate).forEach((date) => {
          const meals = newMealsByDate[date];
          if (meals && meals[mealType]) {
            meals[mealType] = meals[mealType].map((food) => {
              if (food.uniqueID === updatedFood.uniqueID) {
                return {
                  ...updatedFood,
                  uniqueID: food.uniqueID
                };
              }
              return food;
            });
          }
        });
        return newMealsByDate;
      });
      notifySubscribers();
    },
    [notifySubscribers]
  );

  const handleDeleteFood = useCallback(
    (foodToDelete, mealType) => {
      setMealsByDate((prev) => {
        const newMealsByDate = { ...prev };
        Object.keys(newMealsByDate).forEach((date) => {
          if (newMealsByDate[date] && newMealsByDate[date][mealType]) {
            newMealsByDate[date][mealType] = newMealsByDate[date][
              mealType
            ].filter((food) => food.uniqueID !== foodToDelete.uniqueID);
          }
        });
        return newMealsByDate;
      });
      notifySubscribers();
    },
    [notifySubscribers]
  );

  // View --------------------------------
  const value = {
    getMeals,
    updateMeals,
    addFood,
    handleModifyFood,
    handleDeleteFood,
    subscribe
  };

  return (
    <MealsContext.Provider value={value}>{children}</MealsContext.Provider>
  );
}

export function useMeals() {
  const context = useContext(MealsContext);
  if (!context) {
    throw new Error('useMeals must be used within a MealsProvider');
  }
  return context;
}
