import Screen from '../../layout/Screen';
import FoodView from '../../entity/fooditems/FoodView';
import Meals from '../../entity/fooditems/Meals';
import { useEffect, useState } from 'react';

const FoodViewScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { food, onDelete, onModify, mealType } = route.params;

  // State -----------------------------------
  const mealsInstance = Meals();
  const [updatedFood, setUpdatedFood] = useState(food);

  useEffect(() => {
    setUpdatedFood(() => {
      const allMeals = mealsInstance.getMeals();
      for (const mealList of Object.values(allMeals)) {
        const foundFood = mealList.find((f) => f.FoodID === food.FoodID);
        if (foundFood) return foundFood;
      }
      return food;
    });
  }, [food]);

  // Handlers --------------------------------

  const gotoModifyScreen = () =>
    navigation.navigate('FoodModifyScreen', {
      food: updatedFood,
      onModify: (newFood) => {
        setUpdatedFood(newFood);
      }
    });

  // View ------------------------------------
  return (
    <Screen>
      <FoodView
        food={updatedFood}
        onDelete={() => mealsInstance.handleDeleteFood(updatedFood)}
        onModify={gotoModifyScreen}
      />
    </Screen>
  );
};

export default FoodViewScreen;
