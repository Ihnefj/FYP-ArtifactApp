import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { useAuth } from './AuthContext';
import { userSettings } from '../data/userSettings';
import { localSettings } from '../data/localSettings';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  // Initialisations -------------------------
  const { user } = useAuth();

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

  const loadProfile = useCallback(async () => {
    if (user) {
      const savedProfile = await userSettings.getProfile(user.uid);
      if (savedProfile) {
        setMeasurementSystem(savedProfile.measurementSystem);
        setWeight(savedProfile.weight);
        setHeight(savedProfile.height);
        setFeet(savedProfile.feet);
        setInches(savedProfile.inches);
        setAge(savedProfile.age);
        setSex(savedProfile.sex);
      } else {
        const localProfile = await localSettings.getProfile();
        if (localProfile) {
          await userSettings.saveProfile(user.uid, localProfile);
          setMeasurementSystem(localProfile.measurementSystem);
          setWeight(localProfile.weight);
          setHeight(localProfile.height);
          setFeet(localProfile.feet);
          setInches(localProfile.inches);
          setAge(localProfile.age);
          setSex(localProfile.sex);
        } else {
          setMeasurementSystem(defaultProfile.measurementSystem);
          setWeight(defaultProfile.weight);
          setHeight(defaultProfile.height);
          setFeet(defaultProfile.feet);
          setInches(defaultProfile.inches);
          setAge(defaultProfile.age);
          setSex(defaultProfile.sex);
        }
      }
    } else {
      const localProfile = await localSettings.getProfile();
      if (localProfile) {
        setMeasurementSystem(localProfile.measurementSystem);
        setWeight(localProfile.weight);
        setHeight(localProfile.height);
        setFeet(localProfile.feet);
        setInches(localProfile.inches);
        setAge(localProfile.age);
        setSex(localProfile.sex);
      } else {
        setMeasurementSystem(defaultProfile.measurementSystem);
        setWeight(defaultProfile.weight);
        setHeight(defaultProfile.height);
        setFeet(defaultProfile.feet);
        setInches(defaultProfile.inches);
        setAge(defaultProfile.age);
        setSex(defaultProfile.sex);
      }
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [user, loadProfile]);

  // Handlers --------------------------------
  const updateProfile = async (newProfile) => {
    setMeasurementSystem(newProfile.measurementSystem);
    setWeight(newProfile.weight);
    setHeight(newProfile.height);
    setFeet(newProfile.feet);
    setInches(newProfile.inches);
    setAge(newProfile.age);
    setSex(newProfile.sex);

    if (user) {
      await userSettings.saveProfile(user.uid, newProfile);
    } else {
      await localSettings.saveProfile(newProfile);
    }
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
        updateProfile,
        loadProfile,
        profile: {
          measurementSystem,
          weight,
          height,
          feet,
          inches,
          age,
          sex
        }
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
