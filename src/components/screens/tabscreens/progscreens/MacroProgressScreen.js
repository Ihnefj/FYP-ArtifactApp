import { useState, useEffect, useCallback } from 'react';
import { useMeals } from '../../../../contexts/MealsContext';
import { useGoals } from '../../../../contexts/GoalsContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MacroProgressView from '../../../entity/tabitems/MacroProgressView';
import { Alert } from 'react-native';

// Initialisations ---------------------
const MACRO_FILTER_KEY = '@macro_filter_preference';

const MacroProgScreen = () => {
  const mealsInstance = useMeals();
  const { getGoalForDate } = useGoals();
  const navigation = useNavigation();

  // State -------------------------------
  const [markedDates, setMarkedDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().split('T')[0].substring(0, 7)
  );
  const [macroFilter, setMacroFilter] = useState('all');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [goalStats, setGoalStats] = useState({
    met: 0,
    above: 0,
    below: 0,
    total: 0
  });

  // Handlers ----------------------------
  useEffect(() => {
    const loadFilterPreference = async () => {
      try {
        const savedFilter = await AsyncStorage.getItem(MACRO_FILTER_KEY);
        if (savedFilter) {
          setMacroFilter(savedFilter);
        }
      } catch (error) {
        console.error('Error loading macro filter preference:', error);
      }
    };
    loadFilterPreference();
  }, []);

  const saveFilterPreference = async (filter) => {
    try {
      await AsyncStorage.setItem(MACRO_FILTER_KEY, filter);
      Alert.alert('Success', 'Filter preference saved successfully!', [
        { text: 'OK' }
      ]);
    } catch (error) {
      console.error('Error saving macro filter preference:', error);
      Alert.alert(
        'Error',
        'Failed to save filter preference. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

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
      const meals = mealsInstance.getMeals(formattedDate);
      const goals = getGoalForDate(d);

      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      let totalFibre = 0;

      Object.keys(meals).forEach((mealType) => {
        meals[mealType].forEach((food) => {
          totalProtein += Number(food.FoodProtein || 0);
          totalCarbs += Number(food.FoodCarbs || 0);
          totalFat += Number(food.FoodFat || 0);
          totalFibre += Number(food.FoodFibre || 0);
        });
      });

      totalProtein = Math.round(totalProtein);
      totalCarbs = Math.round(totalCarbs);
      totalFat = Math.round(totalFat);
      totalFibre = Math.round(totalFibre);

      let isGoalMet = false;
      let isAboveGoal = false;
      let isBelowGoal = false;

      if (macroFilter === 'all') {
        const proteinMet =
          Math.abs(totalProtein - goals.protein) <= goals.protein * 0.1;
        const carbsMet =
          Math.abs(totalCarbs - goals.carbs) <= goals.carbs * 0.1;
        const fatMet = Math.abs(totalFat - goals.fat) <= goals.fat * 0.1;
        const fibreMet =
          Math.abs(totalFibre - goals.fibre) <= goals.fibre * 0.1;
        isGoalMet = proteinMet && carbsMet && fatMet && fibreMet;
        isAboveGoal =
          !isGoalMet &&
          totalProtein > goals.protein &&
          totalCarbs > goals.carbs &&
          totalFat > goals.fat &&
          totalFibre > goals.fibre;
        isBelowGoal =
          !isGoalMet &&
          !isAboveGoal &&
          totalProtein < goals.protein &&
          totalCarbs < goals.carbs &&
          totalFat < goals.fat &&
          totalFibre < goals.fibre;
      } else {
        const goal = goals[macroFilter];
        const total = {
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat,
          fibre: totalFibre
        }[macroFilter];

        isGoalMet = Math.abs(total - goal) <= goal * 0.05;
        isAboveGoal = !isGoalMet && total > goal;
        isBelowGoal = !isGoalMet && !isAboveGoal;
      }

      if (
        totalProtein > 0 ||
        totalCarbs > 0 ||
        totalFat > 0 ||
        totalFibre > 0
      ) {
        let markerColor;
        let goalStatus;

        if (isGoalMet) {
          markerColor = '#567279B3';
          goalStatus = 'met';
        } else if (isAboveGoal) {
          markerColor = '#795679B3';
          goalStatus = 'above';
        } else {
          markerColor = '#565879B3';
          goalStatus = 'below';
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
  }, [mealsInstance, getGoalForDate, currentMonth, macroFilter]);

  const handleDayPress = (day) => {
    navigation.navigate('HomeTab', {
      screen: 'FoodListScreen',
      params: { selectedDate: day.dateString }
    });
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month.dateString.substring(0, 7));
  };

  const handleFilterChange = (filter) => {
    setMacroFilter(filter);
    setDropdownVisible(false);
  };

  const handleSaveFilter = () => {
    saveFilterPreference(macroFilter);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const calculatePercentage = (value) => {
    if (goalStats.total === 0) return 0;
    return Math.round((value / goalStats.total) * 100);
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
    <MacroProgressView
      markedDates={markedDates}
      macroFilter={macroFilter}
      dropdownVisible={dropdownVisible}
      toggleDropdown={toggleDropdown}
      handleFilterChange={handleFilterChange}
      handleSaveFilter={handleSaveFilter}
      handleDayPress={handleDayPress}
      handleMonthChange={handleMonthChange}
      calculatePercentage={calculatePercentage}
      goalStats={goalStats}
    />
  );
};

export default MacroProgScreen;
