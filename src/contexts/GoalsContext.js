import { createContext, useContext, useState } from 'react';
import { format } from 'date-fns';

const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  // Initialisations ---------------------
  const defaultGoal = {
    calories: 1700,
    protein: 100,
    carbs: 250,
    fat: 70
  };

  // State -------------------------------
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(
    defaultGoal.calories
  );
  const [dailyProteinGoal, setDailyProteinGoal] = useState(defaultGoal.protein);
  const [dailyCarbsGoal, setDailyCarbsGoal] = useState(defaultGoal.carbs);
  const [dailyFatGoal, setDailyFatGoal] = useState(defaultGoal.fat);
  const [historicalGoals, setHistoricalGoals] = useState({});

  // Handlers ----------------------------
  const getGoalForDate = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const relevantDates = Object.keys(historicalGoals)
      .filter((goalDate) => goalDate <= formattedDate)
      .sort((a, b) => b.localeCompare(a));

    if (relevantDates.length > 0) {
      return historicalGoals[relevantDates[0]];
    }
    return defaultGoal;
  };

  const updateGoals = (newGoals) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setHistoricalGoals((prev) => ({
      ...prev,
      [today]: newGoals
    }));
    setDailyCalorieGoal(newGoals.calories);
    setDailyProteinGoal(newGoals.protein);
    setDailyCarbsGoal(newGoals.carbs);
    setDailyFatGoal(newGoals.fat);
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
        getGoalForDate
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => useContext(GoalsContext);
