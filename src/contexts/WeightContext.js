import { createContext, useContext, useState } from 'react';

const WeightContext = createContext();

// Initialisations -------------------------
// State -----------------------------------
export const WeightProvider = ({ children }) => {
  const [weightGoal, setWeightGoal] = useState(null);

  // Handlers --------------------------------
  const updateWeightGoal = (goal) => {
    setWeightGoal(goal);
  };

  // View ------------------------------------
  return (
    <WeightContext.Provider
      value={{
        weightGoal,
        updateWeightGoal
      }}
    >
      {children}
    </WeightContext.Provider>
  );
};

export const useWeight = () => useContext(WeightContext);
