import { useState } from 'react';

const Meals = () => {
  // Initialisations ---------------------
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  });

  // State -------------------------------
  // Handlers ----------------------------

  const getMeals = () => meals;

  const clearMeals = () => {
    setMeals({
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: []
    });
  };

  const updateMeals = (updatedMeals) => {
    setMeals({ ...updatedMeals });
  };

  const handleModifyFood = (updatedFood) => {
    setMeals((prevMeals) => {
      const updatedMeals = { ...prevMeals };

      Object.keys(updatedMeals).forEach((mealType) => {
        updatedMeals[mealType] = updatedMeals[mealType].map((food) =>
          food.FoodID === updatedFood.FoodID ? updatedFood : food
        );
      });

      return updatedMeals;
    });
  };

  const handleDeleteFood = (foodToDelete) => {
    setMeals((prevMeals) => {
      const updatedMeals = { ...prevMeals };

      Object.keys(updatedMeals).forEach((mealType) => {
        updatedMeals[mealType] = updatedMeals[mealType].filter(
          (food) => food.FoodID !== foodToDelete.FoodID
        );
      });

      return updatedMeals;
    });
  };

  // View --------------------------------

  return {
    getMeals,
    clearMeals,
    updateMeals,
    handleModifyFood,
    handleDeleteFood
  };
};

export default Meals;
