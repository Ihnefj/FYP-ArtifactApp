import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useProfile } from '../../../../contexts/ProfileContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ProfileView from '../../../entity/settings/ProfileView.js';

const DEFAULT_VALUES = {
  measurementSystem: 'metric',
  weight: '70',
  height: '170',
  feet: '5',
  inches: '7.0',
  age: '25',
  sex: 'female'
};

const ProfileScreen = () => {
  // Initialisations -------------------------
  const navigation = useNavigation();
  const {
    measurementSystem,
    weight,
    height,
    feet,
    inches,
    age,
    sex,
    updateProfile,
    profile,
    loadProfile
  } = useProfile();

  // State -----------------------------------
  const [formData, setFormData] = useState({
    systemData: DEFAULT_VALUES.measurementSystem,
    weightData: DEFAULT_VALUES.weight,
    heightData: DEFAULT_VALUES.height,
    feetData: DEFAULT_VALUES.feet,
    inchesData: DEFAULT_VALUES.inches,
    ageData: DEFAULT_VALUES.age,
    sexData: DEFAULT_VALUES.sex
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        systemData:
          profile.measurementSystem || DEFAULT_VALUES.measurementSystem,
        weightData: profile.weight?.toString() || DEFAULT_VALUES.weight,
        heightData: profile.height?.toString() || DEFAULT_VALUES.height,
        feetData: profile.feet?.toString() || DEFAULT_VALUES.feet,
        inchesData: profile.inches?.toString() || DEFAULT_VALUES.inches,
        ageData: profile.age?.toString() || DEFAULT_VALUES.age,
        sexData: profile.sex || DEFAULT_VALUES.sex
      });
    }
  }, [profile]);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

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

    updateProfile(newProfile);
    navigation.navigate('SettingsScreen');
  };

  // View -----------------------------------
  return (
    <ScrollView style={styles.container}>
      <ProfileView
        systemData={formData.systemData}
        weightData={formData.weightData}
        heightData={formData.heightData}
        feetData={formData.feetData}
        inchesData={formData.inchesData}
        ageData={formData.ageData}
        sexData={formData.sexData}
        handleSystemChange={handleSystemChange}
        setWeightData={(value) => updateFormData('weightData', value)}
        setHeightData={(value) => updateFormData('heightData', value)}
        setFeetData={(value) => updateFormData('feetData', value)}
        setInchesData={(value) => updateFormData('inchesData', value)}
        setAgeData={(value) => updateFormData('ageData', value)}
        setSexData={(value) => updateFormData('sexData', value)}
        handleSave={handleSave}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default ProfileScreen;
