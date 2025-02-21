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
import * as Progress from 'react-native-progress';
import Icons from '../../UI/Icons.js';
import FoodList from '../../entity/fooditems/FoodList.js';
import { format, addDays, subDays } from 'date-fns';
import initialFoods from '../../../data/foods.js';
import { useGoals } from '../../../contexts/GoalsContext';
import { useMeals } from '../../../contexts/MealsContext';

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
    <Screen>
      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {format(selectedDate, 'EEEE, dd MMM yyyy')}
        </Text>
        <TouchableOpacity onPress={goToNextDay} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.headerContainer}>
          <View style={styles.circleContainer}>
            <Progress.Circle
              size={100}
              progress={Math.min(
                Object.values(totalCalories).reduce(
                  (sum, kcal) => sum + kcal,
                  0
                ) /
                  (typeof goals.calories === 'object'
                    ? goals.calories.max
                    : goals.calories),
                1
              )}
              showsText={true}
              color='#E6E6FA'
              borderWidth={3}
              textStyle={styles.progressText}
              formatText={() =>
                `${Math.round(
                  Object.values(totalCalories).reduce(
                    (sum, kcal) => sum + kcal,
                    0
                  )
                )}`
              }
            />
            <Text style={styles.calorieGoalText}>
              {typeof goals.calories === 'object'
                ? `${goals.calories.min} - ${goals.calories.max}`
                : goals.calories}
            </Text>
          </View>

          <View style={styles.macrosContainer}>
            <Text style={styles.macroText}>
              {Math.round(totalMacros.Protein)}g Protein
            </Text>
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                progress={Math.min(totalMacros.Protein / goals.protein, 1)}
                width={150}
                height={12}
                color='#E6E6FA'
                borderRadius={5}
              />
              <Text style={styles.progressBarText}>{goals.protein}g</Text>
            </View>

            <Text style={styles.macroText}>
              {Math.round(totalMacros.Carbs)}g Carbs
            </Text>
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                progress={Math.min(totalMacros.Carbs / goals.carbs, 1)}
                width={150}
                height={12}
                color='#E6E6FA'
                borderRadius={5}
              />
              <Text style={styles.progressBarText}>{goals.carbs}g</Text>
            </View>

            <Text style={styles.macroText}>
              {Math.round(totalMacros.Fat)}g Fat
            </Text>
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                progress={Math.min(totalMacros.Fat / goals.fat, 1)}
                width={150}
                height={12}
                color='#E6E6FA'
                borderRadius={5}
              />
              <Text style={styles.progressBarText}>{goals.fat}g</Text>
            </View>
          </View>
        </View>
        {Object.entries(meals || {}).map(([mealType, foods = []]) => (
          <View key={mealType} style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>
                {mealType}{' '}
                <Text style={styles.kcalPrMeal}>
                  {Math.round(totalCalories[mealType] || 0)} kcal
                </Text>
              </Text>
              <View style={styles.mealHeaderButtons}>
                <TouchableOpacity
                  onPress={() => handleClearMeal(mealType)}
                  style={[styles.headerButton, styles.clearButton]}
                >
                  <Icons.Delete size={14} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => gotoAddFood(mealType)}
                  style={[styles.headerButton, styles.addButton]}
                >
                  <Icons.Add />
                </TouchableOpacity>
              </View>
            </View>

            {foods.length === 0 ? (
              <Text style={styles.dimText}>No food added yet</Text>
            ) : (
              <FoodList
                foods={foods}
                mealType={mealType}
                onSelect={(food) => gotoFoodView(food, mealType)}
                onDelete={handleDeleteFood}
                onUpdate={handleUpdate}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#665679'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  macrosContainer: {
    paddingTop: -30
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'semi-bold',
    color: '#665679'
  },
  macroText: {
    fontSize: 16,
    marginVertical: 2,
    color: '#C4C3D0'
  },
  mealSection: {
    marginBottom: 10,
    paddingHorizontal: 10
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 17,
    marginBottom: 5
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#665679'
  },
  dimText: {
    color: '#C4C3D0'
  },
  kcalPrMeal: {
    fontSize: 14,
    fontWeight: 'light',
    color: '#C4C3D0'
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#665679',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 15
  },
  dateButton: {
    padding: 10
  },
  dateButtonText: {
    fontSize: 20,
    color: '#F0EFFF'
  },
  dateText: {
    fontSize: 16,
    color: '#F0EFFF'
  },
  addButton: {
    backgroundColor: '#F0EFFF'
  },
  mealHeaderButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  headerButton: {
    width: 25,
    height: 25,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  clearButton: {
    backgroundColor: 'mistyrose'
  },
  progressBarContainer: {
    position: 'relative'
  },
  progressBarText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'right',
    paddingRight: 9,
    color: '#C4C3D0',
    fontSize: 9,
    lineHeight: 13
  },
  calorieGoalText: {
    color: '#665679',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5
  },
  circleContainer: {
    alignItems: 'center',
    width: 100
  }
});

export default FoodListScreen;
