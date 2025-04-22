import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { format } from 'date-fns';
import { useAuth } from './AuthContext';
import { userSettings } from '../data/userSettings';
import { localSettings } from '../data/localSettings';

const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  // Initialisations ---------------------
  const { user } = useAuth();

  const defaultGoal = {
    calories: { min: 1700, max: 1700 },
    protein: 100,
    carbs: 250,
    fat: 70,
    fibre: 25,
    weight: 70
  };

  const getDefaultGoals = () => ({
    calories: { min: 1700, max: 1700 },
    protein: 100,
    carbs: 250,
    fat: 70,
    fibre: 25,
    weight: 70
  });

  // State -------------------------------
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(
    defaultGoal.calories
  );
  const [dailyProteinGoal, setDailyProteinGoal] = useState(defaultGoal.protein);
  const [dailyCarbsGoal, setDailyCarbsGoal] = useState(defaultGoal.carbs);
  const [dailyFatGoal, setDailyFatGoal] = useState(defaultGoal.fat);
  const [dailyFibreGoal, setDailyFibreGoal] = useState(defaultGoal.fibre);
  const [weightGoal, setWeightGoal] = useState(defaultGoal.weight);
  const [historicalGoals, setHistoricalGoals] = useState({});

  const loadGoals = useCallback(async () => {
    if (user) {
      const savedGoals = await userSettings.getGoals(user.uid);
      if (savedGoals) {
        setDailyCalorieGoal(savedGoals.calories);
        setDailyProteinGoal(savedGoals.protein);
        setDailyCarbsGoal(savedGoals.carbs);
        setDailyFatGoal(savedGoals.fat);
        setDailyFibreGoal(savedGoals.fibre);
        setWeightGoal(savedGoals.weight);
        setHistoricalGoals(savedGoals.historical || {});
      } else {
        setDailyCalorieGoal(defaultGoal.calories);
        setDailyProteinGoal(defaultGoal.protein);
        setDailyCarbsGoal(defaultGoal.carbs);
        setDailyFatGoal(defaultGoal.fat);
        setDailyFibreGoal(defaultGoal.fibre);
        setWeightGoal(defaultGoal.weight);
        setHistoricalGoals({});
      }
    } else {
      const localGoals = await localSettings.getGoals();
      if (localGoals) {
        setDailyCalorieGoal(localGoals.calories);
        setDailyProteinGoal(localGoals.protein);
        setDailyCarbsGoal(localGoals.carbs);
        setDailyFatGoal(localGoals.fat);
        setDailyFibreGoal(localGoals.fibre);
        setWeightGoal(localGoals.weight);
        setHistoricalGoals(localGoals.historical || {});
      } else {
        setDailyCalorieGoal(defaultGoal.calories);
        setDailyProteinGoal(defaultGoal.protein);
        setDailyCarbsGoal(defaultGoal.carbs);
        setDailyFatGoal(defaultGoal.fat);
        setDailyFibreGoal(defaultGoal.fibre);
        setWeightGoal(defaultGoal.weight);
        setHistoricalGoals({});
      }
    }
  }, [user]);
  useEffect(() => {
    loadGoals();
  }, [user, loadGoals]);

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
      fat: dailyFatGoal,
      fibre: dailyFibreGoal,
      weight: weightGoal
    };
  };

  const updateGoals = async (newGoals) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDailyCalorieGoal(newGoals.calories);
    setDailyProteinGoal(newGoals.protein);
    setDailyCarbsGoal(newGoals.carbs);
    setDailyFatGoal(newGoals.fat);
    setDailyFibreGoal(newGoals.fibre);
    setWeightGoal(newGoals.weight);
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

    const goalsToSave = {
      ...newGoals,
      historical: historicalGoals
    };

    if (user) {
      await userSettings.saveGoals(user.uid, goalsToSave);
    } else {
      await localSettings.saveGoals(goalsToSave);
    }
  };

  // View --------------------------------
  return (
    <GoalsContext.Provider
      value={{
        dailyCalorieGoal,
        dailyProteinGoal,
        dailyCarbsGoal,
        dailyFatGoal,
        dailyFibreGoal,
        weightGoal,
        setGoals: updateGoals,
        getGoalForDate,
        storeHistoricalGoal,
        historicalGoals,
        loadGoals
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => useContext(GoalsContext);
