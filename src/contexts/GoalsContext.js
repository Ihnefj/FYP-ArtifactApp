import { createContext, useContext, useState } from 'react';
import { format } from 'date-fns';

const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  // Initialisations ---------------------
  const defaultGoal = {
    calories: { min: 1700, max: 1700 },
    protein: 100,
    carbs: 250,
    fat: 70
  };

  const getDefaultGoals = () => ({
    calories: { min: 1700, max: 1700 },
    protein: 100,
    carbs: 250,
    fat: 70
  });

  // State -------------------------------
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(
    defaultGoal.calories
  );
  const [dailyProteinGoal, setDailyProteinGoal] = useState(defaultGoal.protein);
  const [dailyCarbsGoal, setDailyCarbsGoal] = useState(defaultGoal.carbs);
  const [dailyFatGoal, setDailyFatGoal] = useState(defaultGoal.fat);
  const [historicalGoals, setHistoricalGoals] = useState({});

  // Handlers ----------------------------
  const storeHistoricalGoal = (date, goals) => {
    setHistoricalGoals((prev) => ({
      ...prev,
      [format(date, 'yyyy-MM-dd')]: goals
    }));
  };

  const getGoalForDate = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetDate < today) {
      return historicalGoals[formattedDate] || getDefaultGoals();
    }
    return {
      calories: dailyCalorieGoal,
      protein: dailyProteinGoal,
      carbs: dailyCarbsGoal,
      fat: dailyFatGoal
    };
  };

  const updateGoals = (newGoals) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDailyCalorieGoal(newGoals.calories);
    setDailyProteinGoal(newGoals.protein);
    setDailyCarbsGoal(newGoals.carbs);
    setDailyFatGoal(newGoals.fat);
    setHistoricalGoals((prev) => {
      const updatedGoals = { ...prev };
      Object.keys(updatedGoals).forEach((dateStr) => {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        if (date >= today) {
          delete updatedGoals[dateStr];
        }
      });
      const todayStr = format(today, 'yyyy-MM-dd');
      updatedGoals[todayStr] = newGoals;

      return updatedGoals;
    });
  };

  // View --------------------------------
  return (
    <GoalsContext.Provider
      value={{
        dailyCalorieGoal,
        dailyProteinGoal,
        dailyCarbsGoal,
        dailyFatGoal,
        setGoals: updateGoals,
        getGoalForDate,
        storeHistoricalGoal,
        historicalGoals
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => useContext(GoalsContext);
