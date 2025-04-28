import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useState, useEffect, useCallback } from 'react';
import { useMeals } from '../../../../contexts/MealsContext';
import { useGoals } from '../../../../contexts/GoalsContext';
import { useNavigation } from '@react-navigation/native';

// Initialisations ---------------------
const CalorieProgScreen = () => {
  const { meals, getMeals } = useMeals();
  const { getGoalForDate } = useGoals();
  const navigation = useNavigation();

  // State -------------------------------
  const [markedDates, setMarkedDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().split('T')[0].substring(0, 7)
  );
  const [goalStats, setGoalStats] = useState({
    met: 0,
    above: 0,
    below: 0,
    total: 0
  });

  // Handlers ----------------------------
  const calculateMarkedDates = useCallback(() => {
    const dates = {};
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 30);

    const stats = { met: 0, above: 0, below: 0, total: 0 };

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const formattedDate = d.toISOString().split('T')[0];
      const monthYear = formattedDate.substring(0, 7);
      const mealsForDate = getMeals(formattedDate);
      const goals = getGoalForDate(d);

      let totalCalories = 0;
      Object.keys(mealsForDate).forEach((mealType) => {
        totalCalories += mealsForDate[mealType].reduce(
          (sum, food) => sum + Number(food.FoodCalories || 0),
          0
        );
      });

      const roundedTotal = Math.round(totalCalories);
      const calorieGoal = goals?.calories;

      if (totalCalories > 0 && calorieGoal) {
        let markerColor;
        let goalStatus;

        if (typeof calorieGoal === 'object') {
          if (
            roundedTotal >= calorieGoal.min &&
            roundedTotal <= calorieGoal.max
          ) {
            markerColor = '#567279B3';
            goalStatus = 'met';
          } else if (roundedTotal > calorieGoal.max) {
            markerColor = '#795679B3';
            goalStatus = 'above';
          } else {
            markerColor = '#565879B3';
            goalStatus = 'below';
          }
        } else {
          if (Math.abs(roundedTotal - calorieGoal) < 1) {
            markerColor = '#567279B3';
            goalStatus = 'met';
          } else if (roundedTotal > calorieGoal) {
            markerColor = '#795679B3';
            goalStatus = 'above';
          } else {
            markerColor = '#565879B3';
            goalStatus = 'below';
          }
        }

        dates[formattedDate] = {
          customStyles: {
            container: {
              backgroundColor: markerColor,
              borderRadius: 20
            }
          }
        };

        if (monthYear === currentMonth) {
          stats[goalStatus]++;
          stats.total++;
        }
      }
    }

    setMarkedDates(dates);
    setGoalStats(stats);
  }, [meals, getMeals, getGoalForDate, currentMonth]);

  const handleDayPress = (day) => {
    navigation.navigate('HomeTab', {
      screen: 'FoodListScreen',
      params: { selectedDate: day.dateString }
    });
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month.dateString.substring(0, 7));
  };

  const calculatePercentage = (value) => {
    if (goalStats.total === 0) return 0;
    return Math.round((value / goalStats.total) * 100);
  };

  useEffect(() => {
    calculateMarkedDates();
  }, [meals, currentMonth, calculateMarkedDates]);

  // View --------------------------------
  return (
    <>
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
        enableSwipeMonths
        current={new Date().toISOString().split('T')[0]}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
      />
      <View style={styles.markerGuide}>
        <View style={styles.markerGuideItem}>
          <View style={[styles.markerDot, { backgroundColor: '#567279' }]} />
          <Text style={styles.markerGuideText}>Goal Met</Text>
          <Text style={styles.percentageText}>
            {calculatePercentage(goalStats.met)}%
          </Text>
        </View>
        <View style={styles.markerGuideItem}>
          <View style={[styles.markerDot, { backgroundColor: '#795679' }]} />
          <Text style={styles.markerGuideText}>Above Goal</Text>
          <Text style={styles.percentageText}>
            {calculatePercentage(goalStats.above)}%
          </Text>
        </View>
        <View style={styles.markerGuideItem}>
          <View style={[styles.markerDot, { backgroundColor: '#565879' }]} />
          <Text style={styles.markerGuideText}>Below Goal</Text>
          <Text style={styles.percentageText}>
            {calculatePercentage(goalStats.below)}%
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  markerGuide: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F0EFFF',
    borderRadius: 10
  },
  markerGuideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between'
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10
  },
  markerGuideText: {
    color: '#665679',
    fontSize: 14,
    flex: 1
  },
  percentageText: {
    color: '#665679',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default CalorieProgScreen;
