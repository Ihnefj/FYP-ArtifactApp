import { useState } from 'react';

let mealsState = {
  Breakfast: [],
  Lunch: [],
  Dinner: [],
  Snacks: []
};

const Meals = () => {
  // Initialisations ---------------------
  const [mealsByDate, setMealsByDate] = useState({});
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  });

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

  const clearMeals = () => {
    setMeals({
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: []
    });
  };

  const handleModifyFood = (updatedFood) => {
    console.log('Modifying food:', updatedFood);
    setMeals((prevMeals) => {
      const newMeals = JSON.parse(JSON.stringify(prevMeals));

      Object.keys(newMeals).forEach((mealType) => {
        newMeals[mealType] = newMeals[mealType].map((food) =>
          food.uniqueID === updatedFood.uniqueID ? updatedFood : food
        );
      });

      console.log('After modification:', newMeals);
      return newMeals;
    });
  };

  const handleDeleteFood = (foodToDelete, mealType) => {
    console.log(`Deleting ${foodToDelete.FoodName} from ${mealType}...`);
    setMeals((prevMeals) => {
      const newMeals = JSON.parse(JSON.stringify(prevMeals));
      newMeals[mealType] = newMeals[mealType].filter(
        (food) => food.uniqueID !== foodToDelete.uniqueID
      );

      console.log('After deletion:', newMeals);
      return newMeals;
    });
  };

  // View --------------------------------

  return {
    getMeals,
    clearMeals,
    updateMeals,
    handleModifyFood,
    handleDeleteFood,
    addFood
  };
};

export default Meals;
