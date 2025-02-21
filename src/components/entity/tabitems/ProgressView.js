import { StyleSheet, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useGoals } from '../../../contexts/GoalsContext';
import { useState, useEffect, useCallback } from 'react';
import { useMeals } from '../../../contexts/MealsContext';
import { useNavigation } from '@react-navigation/native';

const ProgressView = () => {
  // Initialisations ---------------------
  const mealsInstance = useMeals();
  const { getGoalForDate } = useGoals();
  const navigation = useNavigation();

  // State -------------------------------
  const [markedDates, setMarkedDates] = useState({});

  // Handlers ----------------------------
  const calculateMarkedDates = useCallback(() => {
    const dates = {};
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 30);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const formattedDate = d.toISOString().split('T')[0];
      const meals = mealsInstance.getMeals(formattedDate);
      const goals = getGoalForDate(d);

      let totalCalories = 0;
      Object.keys(meals).forEach((mealType) => {
        const mealCalories = meals[mealType].reduce(
          (sum, food) => sum + Number(food.FoodCalories || 0),
          0
        );
        totalCalories += mealCalories;
      });

      const roundedTotal = Math.round(totalCalories);
      const calorieGoal = goals.calories;

      if (totalCalories > 0) {
        const getMarkerColor = () => {
          if (typeof calorieGoal === 'object') {
            if (
              roundedTotal >= calorieGoal.min &&
              roundedTotal <= calorieGoal.max
            ) {
              return '#567279B3';
            } else if (roundedTotal > calorieGoal.max) {
              return '#795679B3';
            }
            return '#565879B3';
          } else {
            if (Math.abs(roundedTotal - calorieGoal) < 1) {
              return '#567279B3';
            } else if (roundedTotal > calorieGoal) {
              return '#795679B3';
            }
            return '#565879B3';
          }
        };

        dates[formattedDate] = {
          customStyles: {
            container: {
              backgroundColor: getMarkerColor(),
              borderRadius: 20
            }
          }
        };
      }
    }

    setMarkedDates(dates);
  }, [mealsInstance, getGoalForDate]);

  const handleDayPress = (day) => {
    navigation.navigate('HomeTab', {
      screen: 'FoodListScreen',
      params: { selectedDate: day.dateString }
    });
  };

  useEffect(() => {
    calculateMarkedDates();

    const unsubscribe = mealsInstance.subscribe(() => {
      calculateMarkedDates();
    });

    return () => {
      unsubscribe();
    };
  }, [calculateMarkedDates]);

  // View --------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goals Progress</Text>
      <Calendar
        markedDates={markedDates}
        theme={{
          calendarBackground: '#F4F2FF',
          textSectionTitleColor: '#665679',
          selectedDayBackgroundColor: '#DCD6F7',
          selectedDayTextColor: '#665679',
          todayTextColor: '#665679',
          dayTextColor: '#665679',
          textDisabledColor: '#C4C3D0',
          monthTextColor: '#665679',
          indicatorColor: '#665679',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          arrowColor: '#665679'
        }}
        markingType='custom'
        enableSwipeMonths={true}
        current={new Date().toISOString().split('T')[0]}
        onDayPress={handleDayPress}
      />
      <View style={styles.markerGuide}>
        <View style={styles.markerGuideItem}>
          <View style={[styles.markerDot, { backgroundColor: '#567279' }]} />
          <Text style={styles.markerGuideText}>Goal Met</Text>
        </View>
        <View style={styles.markerGuideItem}>
          <View style={[styles.markerDot, { backgroundColor: '#795679' }]} />
          <Text style={styles.markerGuideText}>Above Goal</Text>
        </View>
        <View style={styles.markerGuideItem}>
          <View style={[styles.markerDot, { backgroundColor: '#565879' }]} />
          <Text style={styles.markerGuideText}>Below Goal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#665679',
    textAlign: 'center',
    marginBottom: 10
  },
  markerGuide: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F0EFFF',
    borderRadius: 10
  },
  markerGuideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10
  },
  markerGuideText: {
    color: '#665679',
    fontSize: 14
  }
});

export default ProgressView;
