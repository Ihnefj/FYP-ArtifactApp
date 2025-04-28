import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import Screen from '../../layout/Screen.js';
import * as Progress from 'react-native-progress';
import Icons from '../../UI/Icons.js';
import FoodList from './FoodList.js';
import { format } from 'date-fns';

const FoodListView = ({
  selectedDate,
  goToPreviousDay,
  goToNextDay,
  totalCalories,
  goals,
  totalMacros,
  handleClearMeal,
  gotoAddFood,
  meals,
  gotoFoodView,
  handleDeleteFood,
  handleUpdate
}) => {
  // Initialisations -------------------------
  // State -----------------------------------
  const [localMeals, setLocalMeals] = useState(meals);

  useEffect(() => {
    setLocalMeals(meals);
  }, [meals]);

  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <Screen>
      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}>
          <Text style={styles.arrowButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {format(selectedDate, 'EEEE, dd MMM yyyy')}
        </Text>
        <TouchableOpacity onPress={goToNextDay} style={styles.arrowButton}>
          <Text style={styles.arrowButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.headerContainer}>
          <View style={styles.circleContainer}>
            <Progress.Circle
              size={125}
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
              textStyle={styles.calorieGoalText}
              formatText={() =>
                Math.round(
                  Object.values(totalCalories).reduce(
                    (sum, kcal) => sum + kcal,
                    0
                  )
                ).toString()
              }
            />
            <Text style={styles.calorieGoalText}>
              {typeof goals.calories === 'object'
                ? `${goals.calories.min} - ${goals.calories.max}`
                : goals.calories}
            </Text>
          </View>

          <View>
            <Text style={styles.macroText}>
              {Math.round(totalMacros.Protein)}g Protein
            </Text>
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                style={styles.progressBar}
                color='#E6E6FA' // cannot be put in styles cuz they need to be passed as props for Progress Bar, same with height
                height={12}
                progress={Math.min(totalMacros.Protein / goals.protein, 1)}
              />
              <Text style={styles.progressBarText}>{goals.protein}g</Text>
            </View>

            <Text style={styles.macroText}>
              {Math.round(totalMacros.Carbs)}g Carbs
            </Text>
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                style={styles.progressBar}
                color='#E6E6FA'
                height={12}
                progress={Math.min(totalMacros.Carbs / goals.carbs, 1)}
              />
              <Text style={styles.progressBarText}>{goals.carbs}g</Text>
            </View>

            <Text style={styles.macroText}>
              {Math.round(totalMacros.Fat)}g Fat
            </Text>
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                style={styles.progressBar}
                color='#E6E6FA'
                height={12}
                progress={Math.min(totalMacros.Fat / goals.fat, 1)}
              />
              <Text style={styles.progressBarText}>{goals.fat}g</Text>
            </View>

            <Text style={styles.macroText}>
              {Math.round(totalMacros.Fibre)}g Fibre
            </Text>
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                style={styles.progressBar}
                color='#E6E6FA'
                height={12}
                progress={Math.min(totalMacros.Fibre / goals.fibre, 1)}
              />
              <Text style={styles.progressBarText}>{goals.fibre}g</Text>
            </View>
          </View>
        </View>

        {Object.entries(localMeals || {}).map(([mealType, foods = []]) => (
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
  arrowButton: {
    padding: 10
  },
  arrowButtonText: {
    fontSize: 20,
    color: '#F0EFFF'
  },
  dateText: {
    fontSize: 16,
    color: '#F0EFFF'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  circleContainer: {
    alignItems: 'center',
    width: 125,
    marginTop: 10
  },
  calorieGoalText: {
    color: '#665679',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'semibold'
  },
  macroText: {
    fontSize: 16,
    marginVertical: 2,
    color: '#C4C3D0'
  },
  progressBarContainer: {
    position: 'relative'
  },
  progressBar: {
    width: 150,
    borderRadius: 5
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
  kcalPrMeal: {
    fontSize: 14,
    fontWeight: 'light',
    color: '#C4C3D0'
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
  addButton: {
    backgroundColor: '#F0EFFF'
  },
  dimText: {
    color: '#C4C3D0'
  }
});

export default FoodListView;
