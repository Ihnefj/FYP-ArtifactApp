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

  // Handlers ----------------------------
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
                  const newFoodCalories =
                    (food.FoodAmount / updatedFood.FoodAmount) *
                    updatedFood.FoodCalories;
                  return {
                    ...updatedFood,
                    uniqueID: food.uniqueID,
                    FoodAmount: food.FoodAmount,
                    FoodCalories: newFoodCalories,
                    BaseCalories: updatedFood.FoodCalories,
                    BaseAmount: updatedFood.FoodAmount
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
  };

  // View --------------------------------
  return {
    getMeals,
    updateMeals,
    addFood,
    handleModifyFood,
    handleDeleteFood
  };
};

export default Meals;
