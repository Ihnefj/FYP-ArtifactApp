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
import Meals from '../../entity/fooditems/Meals.js';
import { format, addDays, subDays } from 'date-fns';

const FoodListScreen = ({ navigation }) => {
  // Initialisations -------------------------
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);

  const mealsInstance = Meals();

  // State -----------------------------------

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const [mealsByDate, setMealsByDate] = useState({});
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  });

  const [totalCalories, setTotalCalories] = useState({});

  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(1700);

  const [totalMacros, setTotalMacros] = useState({
    Protein: 0,
    Carbs: 0,
    Fat: 0
  });

  // Handlers --------------------------------

  const totalCaloriesForDay = Object.values(totalCalories).reduce(
    (sum, kcal) => sum + kcal,
    0
  );

  const progress = Math.min(totalCaloriesForDay / dailyCalorieGoal, 1);

  useEffect(() => {
    if (mealsByDate[formattedDate]) {
      setMeals(mealsByDate[formattedDate]);
    } else {
      const storedMeals = mealsInstance.getMeals(formattedDate);
      setMeals(storedMeals);
      setMealsByDate((prev) => ({ ...prev, [formattedDate]: storedMeals }));
    }
  }, [formattedDate]);

  useEffect(() => {
    recalculateTotals();
  }, [meals]);

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
    setMeals((prevMeals) => {
      const updatedMeals = {
        ...prevMeals,
        [mealType]: [
          ...(prevMeals[mealType] || []),
          { ...food, uniqueID: `${food.FoodID}-${Date.now()}` }
        ]
      };

      setMealsByDate((prev) => ({ ...prev, [formattedDate]: updatedMeals }));
      mealsInstance.updateMeals(formattedDate, updatedMeals);
      return updatedMeals;
    });
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
            setMealsByDate((prevMealsByDate) => {
              const updatedMeals = {
                ...prevMealsByDate,
                [formattedDate]: {
                  ...prevMealsByDate[formattedDate],
                  [mealType]: prevMealsByDate[formattedDate]?.[mealType].filter(
                    (food) => food.uniqueID !== foodToDelete.uniqueID
                  )
                }
              };

              mealsInstance.updateMeals(updatedMeals[formattedDate]);
            });
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
              const updatedMeals = {
                ...prevMeals,
                [mealType]: prevMeals[mealType].filter(
                  (food) => food.uniqueID !== foodToDelete.uniqueID
                )
              };

              setMealsByDate((prev) => ({
                ...prev,
                [formattedDate]: updatedMeals
              }));
              mealsInstance.updateMeals(formattedDate, updatedMeals);
              return updatedMeals;
            });
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
          food.uniqueID === updatedFood.uniqueID ? updatedFood : food
        );
      });

      setMealsByDate((prev) => ({ ...prev, [formattedDate]: updatedMeals }));
      mealsInstance.updateMeals(formattedDate, updatedMeals);
      return updatedMeals;
    });
  };

  const handleUpdate = (foodToUpdate, newAmount, mealType) => {
    setMeals((prevMeals) => {
      const updatedMeals = { ...prevMeals };

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

      mealsInstance.updateMeals(updatedMeals);
      recalculateTotals(updatedMeals);
      return updatedMeals;
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
          <Progress.Circle
            size={100}
            progress={Math.min(
              Object.values(totalCalories).reduce(
                (sum, kcal) => sum + kcal,
                0
              ) / dailyCalorieGoal,
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
              )} / ${dailyCalorieGoal}`
            }
          />
          <View>
            <Text style={styles.nutrientLabel}>
              {Math.round(totalMacros.Protein)}g Protein
            </Text>
            <Text style={styles.nutrientLabel}>
              {Math.round(totalMacros.Carbs)}g Carbs
            </Text>
            <Text style={styles.nutrientLabel}>
              {Math.round(totalMacros.Fat)}g Fat
            </Text>
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
              <TouchableOpacity
                onPress={() => gotoFoodOverview(mealType)}
                style={styles.addButton}
              >
                <Icons.Add />
              </TouchableOpacity>
            </View>

            {foods.length === 0 ? (
              <Text style={styles.dimText}>No food added yet</Text>
            ) : (
              <FoodList
                meals={meals}
                onSelect={handleModifyFood}
                onDelete={handleDeleteFood}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'semi-bold',
    color: '#665679'
  },
  nutrientLabel: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
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
    width: 25,
    height: 25,
    borderRadius: 35 / 2,
    backgroundColor: '#F0EFFF',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default FoodListScreen;
