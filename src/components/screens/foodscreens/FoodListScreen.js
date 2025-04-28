import { useState, useEffect } from 'react';
import { LogBox, Alert } from 'react-native';
import { format, addDays, subDays } from 'date-fns';
import { useGoals } from '../../../contexts/GoalsContext';
import { useMeals } from '../../../contexts/MealsContext';
import FoodListView from '../../entity/fooditems/FoodListView';
import { useAuth } from '../../../contexts/AuthContext';

const generateUUID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const FoodListScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);
  const {
    meals: allMeals,
    addMeal,
    updateMeal,
    deleteMeal,
    deleteMeals,
    handleModifyFood,
    getMeals
  } = useMeals();
  const { getGoalForDate, storeHistoricalGoal, historicalGoals } = useGoals();
  const { user } = useAuth();

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
    Fat: 0,
    Fibre: 0
  });

  const goals = getGoalForDate(selectedDate);
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    if (route.params?.selectedDate) {
      setSelectedDate(new Date(route.params.selectedDate));
    }
  }, [route.params?.selectedDate]);

  useEffect(() => {
    const mealsForDate = getMeals(formattedDate);
    setMeals(mealsForDate);
  }, [formattedDate, allMeals]);

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
          fat: goals.fat,
          fibre: goals.fibre
        });
      }
    }
  }, [selectedDate]);

  // Handlers --------------------------------
  const recalculateTotals = () => {
    const newTotals = { Calories: {}, Protein: 0, Carbs: 0, Fat: 0, Fibre: 0 };

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
      newTotals.Fibre += foods.reduce(
        (sum, food) => sum + (!isNaN(food.FoodFibre) ? food.FoodFibre : 0),
        0
      );
    });

    setTotalCalories(newTotals.Calories);
    setTotalMacros({
      Protein: newTotals.Protein,
      Carbs: newTotals.Carbs,
      Fat: newTotals.Fat,
      Fibre: newTotals.Fibre
    });
  };

  const handleAddFood = (food, mealType) => {
    const originalAmount =
      parseFloat(food.FoodAmount) || parseFloat(food.amount) || 100;
    const originalUnit = food.FoodUnit || 'g';
    const normalizedUnit = originalUnit.toLowerCase().trim();

    let standardAmount;
    if (normalizedUnit === 'g' || normalizedUnit === 'ml') {
      standardAmount = 100;
    } else if (
      normalizedUnit === 'tbsp' ||
      normalizedUnit === 'tsp' ||
      normalizedUnit === 'serving' ||
      normalizedUnit === 'servings'
    ) {
      standardAmount = 1;
    } else {
      standardAmount = originalAmount;
    }

    const ratio = standardAmount / originalAmount;
    const standardCalories = Math.round(food.FoodCalories * ratio);
    const standardProtein = Math.round(food.FoodProtein * ratio);
    const standardCarbs = Math.round(food.FoodCarbs * ratio);
    const standardFat = Math.round(food.FoodFat * ratio);
    const standardFibre = Math.round(food.FoodFibre * ratio);

    const uniqueId = generateUUID();
    const newMeal = {
      id: uniqueId,
      date: formattedDate,
      mealType,
      FoodName: food.FoodName || 'Unnamed Food',
      amount: standardAmount,
      FoodAmount: standardAmount.toString(),
      FoodUnit: originalUnit,
      FoodCalories: standardCalories,
      FoodProtein: standardProtein,
      FoodCarbs: standardCarbs,
      FoodFat: standardFat,
      FoodFibre: standardFibre,
      Source: food.Source || 'Custom',
      FoodID: food.FoodID || uniqueId,
      uniqueID: uniqueId
    };

    addMeal(newMeal);
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
            const mealIds = meals[mealType].map((meal) => meal.id);
            deleteMeals(mealIds);
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
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMeal(foodToDelete.id);
          }
        }
      ]
    );
  };

  const handleModify = (updatedFood) => {
    const foodToUpdate = {
      ...updatedFood,
      id: updatedFood.FoodID || updatedFood.id
    };
    handleModifyFood(foodToUpdate);
  };

  const handleUpdate = (foodToUpdate, newAmount, mealType) => {
    const parsedAmount = parseFloat(newAmount) || 0;
    const baseAmount =
      parseFloat(foodToUpdate.FoodAmount) ||
      parseFloat(foodToUpdate.amount) ||
      100;
    const ratio = parsedAmount / baseAmount;

    const updatedFood = {
      ...foodToUpdate,
      amount: parsedAmount,
      FoodAmount: parsedAmount.toString(),
      FoodCalories: Math.round(foodToUpdate.FoodCalories * ratio),
      FoodProtein: Math.round(foodToUpdate.FoodProtein * ratio),
      FoodCarbs: Math.round(foodToUpdate.FoodCarbs * ratio),
      FoodFat: Math.round(foodToUpdate.FoodFat * ratio),
      FoodFibre: Math.round(foodToUpdate.FoodFibre * ratio)
    };

    updateMeal(foodToUpdate.id, updatedFood);

    const updatedMeals = { ...meals };
    const mealIndex = updatedMeals[mealType].findIndex(
      (m) => m.id === foodToUpdate.id
    );
    if (mealIndex !== -1) {
      updatedMeals[mealType][mealIndex] = updatedFood;
      setMeals(updatedMeals);
    }
  };

  const gotoFoodView = (food, mealType) => {
    navigation.navigate('FoodViewScreen', {
      food,
      mealType,
      onDelete: handleDeleteFood,
      onModify: handleModify
    });
  };

  const gotoAddFood = (mealType) => {
    navigation.navigate('FoodOverviewScreen', {
      mealType,
      onAddFood: handleAddFood,
      onModify: handleModify
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
