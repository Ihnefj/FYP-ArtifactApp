import { useState } from 'react';

const Meals = () => {
  // Initialisations ---------------------
  const defaultMeals = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  };

  // State -------------------------------
  const [mealsByDate, setMealsByDate] = useState({});
  const [subscribers] = useState(new Set());

  // Handlers ----------------------------
  const subscribe = (callback) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };

  const notifySubscribers = () => {
    subscribers.forEach((callback) => callback());
  };

  const getMeals = (date) => {
    return (
      mealsByDate[date] || { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] }
    );
  };

  const updateMeals = (date, updatedMeals) => {
    setMealsByDate((prevMealsByDate) => ({
      ...prevMealsByDate,
      [date]: updatedMeals
    }));
    notifySubscribers();
  };

  const addFood = (date, foodItem, mealType) => {
    setMealsByDate((prevMealsByDate) => {
      const updatedMeals = { ...prevMealsByDate };
      updatedMeals[date] = updatedMeals[date] || {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: []
      };
      updatedMeals[date][mealType] = [
        ...updatedMeals[date][mealType],
        { ...foodItem, uniqueID: `${foodItem.FoodID}-${Date.now()}` }
      ];
      return updatedMeals;
    });
    notifySubscribers();
  };

  const handleModifyFood = (updatedFood) => {
    setMealsByDate((prevMealsByDate) => {
      const newMealsByDate = { ...prevMealsByDate };

      Object.keys(newMealsByDate).forEach((date) => {
        const meals = newMealsByDate[date];
        if (meals) {
          Object.keys(meals).forEach((mealType) => {
            if (meals[mealType]) {
              meals[mealType] = meals[mealType].map((food) => {
                if (food.FoodID === updatedFood.FoodID) {
                  const baseAmount = food.BaseAmount || 100;
                  const ratio = updatedFood.FoodAmount / baseAmount;

                  return {
                    ...food,
                    ...updatedFood,
                    FoodCalories: Math.round(food.BaseCalories * ratio),
                    FoodProtein: Math.round(food.BaseProtein * ratio),
                    FoodCarbs: Math.round(food.BaseCarbs * ratio),
                    FoodFat: Math.round(food.BaseFat * ratio),
                    FoodFibre: Math.round(food.BaseFibre * ratio)
                  };
                }
                return food;
              });
            }
          });
        }
      });
      return newMealsByDate;
    });
    notifySubscribers();
  };

  const handleDeleteFood = (foodToDelete, mealType) => {
    setMealsByDate((prevMealsByDate) => {
      const newMealsByDate = { ...prevMealsByDate };
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
  };

  // View --------------------------------
  return {
    getMeals,
    updateMeals,
    addFood,
    handleModifyFood,
    handleDeleteFood,
    subscribe
  };
};

export default Meals;
