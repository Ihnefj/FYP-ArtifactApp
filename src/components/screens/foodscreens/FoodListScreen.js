import { useState, useEffect } from 'react';
import {
  LogBox,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import Screen from '../../layout/Screen.js';
import Icons from '../../UI/Icons.js';
import FoodList from '../../entity/fooditems/FoodList.js';
import Meals from '../../entity/fooditems/Meals.js';

const FoodListScreen = ({ navigation }) => {
  // Initialisations -------------------------
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);

  // State -----------------------------------

  const mealsInstance = Meals();
  const [meals, setMeals] = useState(
    mealsInstance.getMeals() || {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: []
    }
  );
  const [totalCalories, setTotalCalories] = useState({});

  // Handlers --------------------------------

  const recalculateTotalCalories = () => {
    const newTotals = {};
    Object.entries(meals).forEach(([mealType, foods]) => {
      newTotals[mealType] = foods.reduce(
        (sum, food) =>
          sum + (!isNaN(food.FoodCalories) ? food.FoodCalories : 0),
        0
      );
    });
    setTotalCalories(newTotals);
  };

  useEffect(() => {
    const newTotals = {};
    Object.entries(meals).forEach(([mealType, foods]) => {
      newTotals[mealType] = foods.reduce(
        (sum, food) =>
          sum + (!isNaN(food.FoodCalories) ? food.FoodCalories : 0),
        0
      );
    });
    setTotalCalories(newTotals);
  }, [meals]);

  const handleAddFood = (food, mealType) => {
    const uniqueFood = { ...food, uniqueID: `${food.FoodID}-${Date.now()}` };
    const updatedMeals = {
      ...meals,
      [mealType]: [...meals[mealType], uniqueFood]
    };
    mealsInstance.updateMeals(updatedMeals);
    setMeals(updatedMeals);
  };

  const handleClearMeal = (mealType) => {
    Alert.alert(
      'Remove',
      `Are you sure you want to remove all foods from ${mealType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          onPress: () => {
            meals[mealType] = [];
            v;
            mealsInstance.updateMeals(meals);
            setMeals({ ...meals });
          }
        }
      ]
    );
  };

  const handleDeleteFood = (foodToDelete, mealType) => {
    Alert.alert(
      `Remove ${foodToDelete.FoodName}`,
      `Are you sure you want to remove ${foodToDelete.FoodName} from your meal?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setMeals((prevMeals) => {
              const updatedMeals = { ...prevMeals };
              updatedMeals[mealType] = updatedMeals[mealType].filter(
                (food) => food.FoodID !== foodToDelete.FoodID
              );

              return { ...updatedMeals };
            });

            recalculateTotalCalories();
          }
        }
      ]
    );
  };

  const handleModifyFood = (updatedFood) => {
    setMeals((prevMeals) => {
      const updatedMeals = { ...prevMeals };

      Object.keys(updatedMeals).forEach((mealType) => {
        updatedMeals[mealType] = updatedMeals[mealType].map((food) =>
          food.FoodID === updatedFood.FoodID ? updatedFood : food
        );
      });

      return { ...updatedMeals };
    });
  };

  const gotoFoodView = (food, mealType) => {
    navigation.navigate('FoodViewScreen', {
      food,
      mealType,
      onDelete: handleDeleteFood,
      onModify: handleModifyFood
    });
  };

  const gotoFoodOverview = (mealType) => {
    navigation.navigate('FoodOverviewScreen', {
      mealType,
      onAddFood: handleAddFood
    });
  };

  const getTotalCalories = (foods) => {
    return foods.reduce(
      (sum, food) => sum + (!isNaN(food.FoodCalories) ? food.FoodCalories : 0),
      0
    );
  };

  const handleUpdate = (foodToUpdate, newAmount, mealType) => {
    setMeals((prevMeals) => {
      const updatedMeals = JSON.parse(JSON.stringify(prevMeals));

      updatedMeals[mealType] = updatedMeals[mealType].map((food) => {
        if (food.uniqueID === foodToUpdate.uniqueID) {
          const parsedAmount = parseFloat(newAmount);
          const baseCalories = food.BaseCalories || food.FoodCalories;
          const baseAmount = food.BaseAmount || 100;

          const newFoodCalories = (parsedAmount / baseAmount) * baseCalories;

          return {
            ...food,
            loggedAmount: parsedAmount > 0 ? parsedAmount : food.FoodAmount,
            FoodCalories: newFoodCalories,
            BaseCalories: baseCalories,
            BaseAmount: baseAmount
          };
        }
        return food;
      });

      const newTotals = {};
      Object.entries(updatedMeals).forEach(([mealType, foods]) => {
        newTotals[mealType] = foods.reduce(
          (sum, food) =>
            sum + (!isNaN(food.FoodCalories) ? food.FoodCalories : 0),
          0
        );
      });

      setTotalCalories(newTotals);
      return updatedMeals;
    });
  };

  // View ------------------------------------
  return (
    <Screen>
      <Text style={styles.header}>Food Diary</Text>
      <ScrollView>
        {Object.entries(meals || {}).map(([mealType, foods = []]) => (
          <View key={mealType} style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>
                {mealType}{' '}
                <Text style={styles.kcalPrMeal}>
                  {Math.round(totalCalories[mealType] || 0)} kcal
                </Text>
              </Text>
              <TouchableOpacity onPress={() => gotoFoodOverview(mealType)}>
                <Icons.Add />
              </TouchableOpacity>
            </View>

            {foods.length === 0 ? (
              <Text style={styles.dimText}>No food added yet</Text>
            ) : (
              <FoodList
                meals={meals}
                onSelect={(food, mealType) => gotoFoodView(food, mealType)}
                onDelete={(food, mealType) => handleDeleteFood(food, mealType)}
                onUpdate={(food, newAmount, mealType) =>
                  handleUpdate(food, newAmount, mealType)
                }
              />
            )}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  mealSection: {
    marginBottom: 15,
    paddingHorizontal: 10
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  dimText: {
    color: 'grey'
  },
  kcalPrMeal: {
    fontSize: 14,
    color: 'grey'
  }
});

export default FoodListScreen;
