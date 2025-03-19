import { useState } from 'react';
import { useProfile } from '../../../../contexts/ProfileContext';
import { useNavigation } from '@react-navigation/native';
import ProfileView from '../../../entity/settings/ProfileView';

const DEFAULT_VALUES = {
  weight: '70',
  height: '170',
  feet: '5',
  inches: '7.0',
  age: '25',
  sex: 'female'
};

const ProfileScreen = () => {
  // Initialisations -------------------------
  const {
    measurementSystem,
    weight,
    height,
    feet,
    inches,
    age,
    sex,
    updateProfile
  } = useProfile();
  const navigation = useNavigation();

  // State -----------------------------------
  const [formData, setFormData] = useState({
    systemData: measurementSystem,
    weightData: weight?.toString() || DEFAULT_VALUES.weight,
    heightData: height?.toString() || DEFAULT_VALUES.height,
    feetData: feet?.toString() || DEFAULT_VALUES.feet,
    inchesData: inches?.toString() || DEFAULT_VALUES.inches,
    ageData: age?.toString() || DEFAULT_VALUES.age,
    sexData: sex || DEFAULT_VALUES.sex
  });

  // Handlers --------------------------------
  const convertToImperial = (cm, kg) => {
    const totalFeet = parseFloat(cm) / 30.48;
    const feet = Math.floor(totalFeet);
    const inches = (totalFeet - feet) * 12;
    return {
      feet: feet.toString(),
      inches: inches.toFixed(3),
      weight: (parseFloat(kg) * 2.20462).toFixed(1)
    };
  };

  const convertToMetric = (feet, inches, lbs) => {
    const totalFeet = parseInt(feet) + parseFloat(inches) / 12;
    const exactCm = totalFeet * 30.48;
    return {
      height: exactCm.toFixed(2),
      weight: (parseFloat(lbs) / 2.20462).toFixed(1)
    };
  };

  const resetForm = () => {
    setFormData({
      systemData: measurementSystem,
      weightData: weight?.toString() || DEFAULT_VALUES.weight,
      heightData: height?.toString() || DEFAULT_VALUES.height,
      feetData: feet?.toString() || DEFAULT_VALUES.feet,
      inchesData: inches?.toString() || DEFAULT_VALUES.inches,
      ageData: age?.toString() || DEFAULT_VALUES.age,
      sexData: sex || DEFAULT_VALUES.sex
    });
  };

  const validateForm = () => {
    const {
      systemData,
      weightData,
      heightData,
      feetData,
      inchesData,
      ageData,
      sexData
    } = formData;
    const validInches =
      systemData === 'imperial'
        ? parseFloat(inchesData) >= 0 && parseFloat(inchesData) < 12
        : true;

    return (
      weightData > 0 &&
      (systemData === 'metric'
        ? heightData > 0
        : parseInt(feetData) >= 0 && validInches) &&
      ageData > 0 &&
      (sexData === 'male' || sexData === 'female') &&
      (systemData === 'metric' || systemData === 'imperial')
    );
  };

  const handleSave = () => {
    const {
      systemData,
      weightData,
      heightData,
      feetData,
      inchesData,
      ageData,
      sexData
    } = formData;
    let finalHeight = heightData;
    if (systemData === 'imperial') {
      const { height } = convertToMetric(feetData, inchesData, weightData);
      finalHeight = height;
    }

    const newProfile = {
      measurementSystem: systemData,
      weight: weightData,
      height: finalHeight,
      feet: feetData,
      inches: inchesData,
      age: ageData,
      sex: sexData
    };

    if (validateForm()) {
      updateProfile(newProfile);
      navigation.navigate('SettingsScreen');
    } else {
      resetForm();
    }
  };

  const handleSystemChange = (newSystem) => {
    const { heightData, weightData, feetData, inchesData } = formData;
    if (newSystem === 'imperial') {
      const { feet, inches, weight } = convertToImperial(
        heightData,
        weightData
      );
      setFormData((prev) => ({
        ...prev,
        systemData: newSystem,
        feetData: feet,
        inchesData: inches,
        weightData: weight
      }));
    } else {
      const { height, weight } = convertToMetric(
        feetData,
        inchesData,
        weightData
      );
      setFormData((prev) => ({
        ...prev,
        systemData: newSystem,
        heightData: height,
        weightData: weight
      }));
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // View -----------------------------------
  return (
    <ProfileView
      {...formData}
      handleSystemChange={handleSystemChange}
      setWeightData={(value) => updateFormData('weightData', value)}
      setHeightData={(value) => updateFormData('heightData', value)}
      setFeetData={(value) => updateFormData('feetData', value)}
      setInchesData={(value) => updateFormData('inchesData', value)}
      setAgeData={(value) => updateFormData('ageData', value)}
      setSexData={(value) => updateFormData('sexData', value)}
      handleSave={handleSave}
    />
  );
};

export default ProfileScreen;
