import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  // Initialisations -------------------------

  const defaultProfile = {
    measurementSystem: 'metric',
    weight: '70',
    height: '170',
    feet: '5',
    inches: '7',
    age: '25',
    sex: 'female'
  };

  // State -----------------------------------
  const [measurementSystem, setMeasurementSystem] = useState(
    defaultProfile.measurementSystem
  );
  const [weight, setWeight] = useState(defaultProfile.weight);
  const [height, setHeight] = useState(defaultProfile.height);
  const [feet, setFeet] = useState(defaultProfile.feet);
  const [inches, setInches] = useState(defaultProfile.inches);
  const [age, setAge] = useState(defaultProfile.age);
  const [sex, setSex] = useState(defaultProfile.sex);

  // Handlers --------------------------------
  const updateProfile = (newProfile) => {
    setMeasurementSystem(newProfile.measurementSystem);
    setWeight(newProfile.weight);
    setHeight(newProfile.height);
    setFeet(newProfile.feet);
    setInches(newProfile.inches);
    setAge(newProfile.age);
    setSex(newProfile.sex);
  };

  // View ------------------------------------
  return (
    <ProfileContext.Provider
      value={{
        measurementSystem,
        weight,
        height,
        feet,
        inches,
        age,
        sex,
        updateProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
