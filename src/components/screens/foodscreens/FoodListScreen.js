import { useState, useEffect } from 'react';
import { LogBox, Alert } from 'react-native';
import { format, addDays, subDays } from 'date-fns';
import { useGoals } from '../../../contexts/GoalsContext';
import { useMeals } from '../../../contexts/MealsContext';
import FoodListView from '../../entity/fooditems/FoodListView';

const FoodListScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);
  const mealsInstance = useMeals();
  const { getGoalForDate, storeHistoricalGoal, historicalGoals } = useGoals();

  // State -----------------------------------
  const [selectedDate, setSelectedDate] = useState(() => {
    if (route.params?.selectedDate) {
      return new Date(route.params.selectedDate);
    }
    return new Date();
  });
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  });
  const [totalCalories, setTotalCalories] = useState({});
  const [totalMacros, setTotalMacros] = useState({
    Protein: 0,
    Carbs: 0,
    Fat: 0
  });

  const goals = getGoalForDate(selectedDate);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    if (route.params?.selectedDate) {
      setSelectedDate(new Date(route.params.selectedDate));
    }
  }, [route.params?.selectedDate]);

  useEffect(() => {
    const storedMeals = mealsInstance.getMeals(formattedDate);
    setMeals(storedMeals);
    const unsubscribe = mealsInstance.subscribe(() => {
      const updatedMeals = mealsInstance.getMeals(formattedDate);
      setMeals(updatedMeals);
    });
    return () => unsubscribe();
  }, [formattedDate, mealsInstance]);

  useEffect(() => {
    recalculateTotals();
  }, [meals]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < today) {
      const hasHistoricalGoals = historicalGoals.hasOwnProperty(formattedDate);

      if (!hasHistoricalGoals) {
        storeHistoricalGoal(selectedDate, {
          calories: goals.calories,
          protein: goals.protein,
          carbs: goals.carbs,
          fat: goals.fat
        });
      }
    }
  }, [selectedDate]);

  // Handlers --------------------------------
  const recalculateTotals = () => {
    const newTotals = { Calories: {}, Protein: 0, Carbs: 0, Fat: 0 };

    Object.entries(meals).forEach(([mealType, foods]) => {
      newTotals.Calories[mealType] = foods.reduce(
        (sum, food) =>
          sum + (!isNaN(food.FoodCalories) ? food.FoodCalories : 0),
        0
      );
      newTotals.Protein += foods.reduce(
        (sum, food) => sum + (!isNaN(food.FoodProtein) ? food.FoodProtein : 0),
        0
      );
      newTotals.Carbs += foods.reduce(
        (sum, food) => sum + (!isNaN(food.FoodCarbs) ? food.FoodCarbs : 0),
        0
      );
      newTotals.Fat += foods.reduce(
        (sum, food) => sum + (!isNaN(food.FoodFat) ? food.FoodFat : 0),
        0
      );
    });

    setTotalCalories(newTotals.Calories);
    setTotalMacros({
      Protein: newTotals.Protein,
      Carbs: newTotals.Carbs,
      Fat: newTotals.Fat
    });
  };

  const handleAddFood = (food, mealType) => {
    mealsInstance.addFood(formattedDate, food, mealType);
    const updatedMeals = mealsInstance.getMeals(formattedDate);
    setMeals(updatedMeals);
    recalculateTotals();
  };

  const handleClearMeal = (mealType) => {
    Alert.alert(
      'Clear Meal',
      `Are you sure you want to remove all foods from ${mealType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setMeals((prevMeals) => {
              const updatedMeals = {
                ...prevMeals,
                [mealType]: []
              };
              mealsInstance.updateMeals(formattedDate, updatedMeals);
              return updatedMeals;
            });
            recalculateTotals();
          }
        }
      ]
    );
  };

  const handleDeleteFood = (foodToDelete, mealType) => {
    Alert.alert(
      'Delete warning',
      `Are you sure you want to delete food ${foodToDelete.FoodName}?`,
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            mealsInstance.handleDeleteFood(foodToDelete, mealType);
            const updatedMeals = mealsInstance.getMeals(formattedDate);
            setMeals(updatedMeals);
            recalculateTotals();
          }
        }
      ]
    );
  };

  const handleModifyFood = (foodToModify, newAmount, mealType) => {
    mealsInstance.handleModifyFood(foodToModify, mealType);
    const updatedMeals = mealsInstance.getMeals(formattedDate);
    setMeals(updatedMeals);
    recalculateTotals();
  };

  const handleUpdate = (foodToUpdate, newAmount, mealType) => {
    const parsedAmount =
      newAmount === '' ? 0 : parseFloat(newAmount) || foodToUpdate.FoodAmount;
    const baseCalories = foodToUpdate.BaseCalories || foodToUpdate.FoodCalories;
    const baseAmount = foodToUpdate.BaseAmount || 100;

    const ratio = parsedAmount / baseAmount;
    const newCalories = Math.round(baseCalories * ratio);

    const updatedFood = {
      ...foodToUpdate,
      FoodAmount: parsedAmount,
      FoodCalories: newCalories,
      BaseCalories: baseCalories,
      BaseAmount: baseAmount
    };

    mealsInstance.handleModifyFood(updatedFood, mealType);
    const updatedMeals = mealsInstance.getMeals(formattedDate);
    setMeals(updatedMeals);
    recalculateTotals();
  };

  const gotoFoodView = (food, mealType) => {
    navigation.navigate('FoodViewScreen', {
      food,
      mealType,
      onDelete: handleDeleteFood,
      onModify: (newFood) => handleUpdate(newFood, newFood.FoodAmount, mealType)
    });
  };

  const gotoAddFood = (mealType) => {
    navigation.navigate('FoodOverviewScreen', {
      mealType,
      onAddFood: handleAddFood,
      onModifyFood: handleModifyFood
    });
  };

  const goToPreviousDay = () =>
    setSelectedDate((prevDate) => subDays(prevDate, 1));
  const goToNextDay = () => setSelectedDate((prevDate) => addDays(prevDate, 1));

  // View ------------------------------------
  return (
    <FoodListView
      selectedDate={selectedDate}
      goToPreviousDay={goToPreviousDay}
      goToNextDay={goToNextDay}
      totalCalories={totalCalories}
      goals={goals}
      totalMacros={totalMacros}
      meals={meals}
      handleClearMeal={handleClearMeal}
      gotoAddFood={gotoAddFood}
      gotoFoodView={gotoFoodView}
      handleDeleteFood={handleDeleteFood}
      handleUpdate={handleUpdate}
    />
  );
};

export default FoodListScreen;
