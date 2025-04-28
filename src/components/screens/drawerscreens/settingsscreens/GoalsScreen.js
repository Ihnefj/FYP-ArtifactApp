import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Screen from '../../../layout/Screen';
import { useState, useEffect } from 'react';
import { useGoals } from '../../../../contexts/GoalsContext';
import { useProfile } from '../../../../contexts/ProfileContext';
import { useNavigation } from '@react-navigation/native';

const GoalsScreen = () => {
  // Initialisations ---------------------
  const {
    dailyCalorieGoal,
    dailyProteinGoal,
    dailyCarbsGoal,
    dailyFatGoal,
    dailyFibreGoal,
    weightGoal,
    setGoals
  } = useGoals();
  const { measurementSystem } = useProfile();
  const navigation = useNavigation();

  // State -------------------------------
  const [calorieMinInput, setCalorieMinInput] = useState(
    typeof dailyCalorieGoal === 'object'
      ? dailyCalorieGoal.min?.toString()
      : dailyCalorieGoal?.toString() || '1700'
  );
  const [calorieMaxInput, setCalorieMaxInput] = useState(
    typeof dailyCalorieGoal === 'object'
      ? dailyCalorieGoal.max?.toString()
      : dailyCalorieGoal?.toString() || '1700'
  );
  const [proteinInput, setProteinInput] = useState(
    dailyProteinGoal?.toString() || '100'
  );
  const [carbsInput, setCarbsInput] = useState(
    dailyCarbsGoal?.toString() || '250'
  );
  const [fatInput, setFatInput] = useState(dailyFatGoal?.toString() || '70');
  const [fibreInput, setFibreInput] = useState(
    dailyFibreGoal?.toString() || '25'
  );
  const [weightInput, setWeightInput] = useState(
    measurementSystem === 'imperial'
      ? (weightGoal * 2.20462).toFixed(1)
      : weightGoal?.toString() || '70'
  );

  useEffect(() => {
    if (measurementSystem === 'imperial') {
      setWeightInput((weightGoal * 2.20462).toFixed(1));
    } else {
      setWeightInput(weightGoal?.toString() || '70');
    }
  }, [measurementSystem, weightGoal]);

  // Handlers ----------------------------
  const handleSave = () => {
    const minCalories = parseInt(calorieMinInput);
    const maxCalories = parseInt(calorieMaxInput);

    const weightValue =
      measurementSystem === 'imperial'
        ? parseFloat(weightInput) / 2.20462
        : parseFloat(weightInput);

    const newGoals = {
      calories: {
        min: minCalories,
        max: maxCalories
      },
      protein: parseInt(proteinInput),
      carbs: parseInt(carbsInput),
      fat: parseInt(fatInput),
      fibre: parseInt(fibreInput),
      weight: weightValue
    };

    if (
      Object.values(newGoals).every((value) =>
        typeof value === 'object'
          ? !isNaN(value.min) &&
            !isNaN(value.max) &&
            value.min > 0 &&
            value.max >= value.min
          : !isNaN(value) && value > 0
      )
    ) {
      setGoals(newGoals);
      navigation.navigate('SettingsScreen');
    } else {
      setCalorieMinInput(
        typeof dailyCalorieGoal === 'object'
          ? dailyCalorieGoal.min?.toString()
          : dailyCalorieGoal?.toString() || '1700'
      );
      setCalorieMaxInput(
        typeof dailyCalorieGoal === 'object'
          ? dailyCalorieGoal.max?.toString()
          : dailyCalorieGoal?.toString() || '1700'
      );
      setProteinInput(dailyProteinGoal?.toString() || '100');
      setCarbsInput(dailyCarbsGoal?.toString() || '250');
      setFatInput(dailyFatGoal?.toString() || '70');
      setFibreInput(dailyFibreGoal?.toString() || '25');
      setWeightInput(
        measurementSystem === 'imperial'
          ? (weightGoal * 2.20462).toFixed(1)
          : weightGoal?.toString() || '70'
      );
    }
  };

  // View ------------------------------------
  return (
    <Screen>
      <KeyboardAwareScrollView
        style={styles.container}
        bounces={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps='handled'
        extraScrollHeight={20}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.calorieContainer}>
          <Text style={styles.label}>Daily Calorie Goal Range</Text>
          <View style={styles.rangeInputs}>
            <TextInput
              placeholder='Min calories'
              value={calorieMinInput}
              onChangeText={setCalorieMinInput}
              keyboardType='numeric'
              style={[styles.input, styles.rangeInput]}
            />
            <Text style={styles.rangeSeparator}>-</Text>
            <TextInput
              placeholder='Max calories'
              value={calorieMaxInput}
              onChangeText={setCalorieMaxInput}
              keyboardType='numeric'
              style={[styles.input, styles.rangeInput]}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Daily Protein Goal (g)</Text>
          <TextInput
            placeholder='Enter protein goal'
            value={proteinInput}
            onChangeText={setProteinInput}
            keyboardType='numeric'
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Daily Carbs Goal (g)</Text>
          <TextInput
            placeholder='Enter carbs goal'
            value={carbsInput}
            onChangeText={setCarbsInput}
            keyboardType='numeric'
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Daily Fat Goal (g)</Text>
          <TextInput
            placeholder='Enter fat goal'
            value={fatInput}
            onChangeText={setFatInput}
            keyboardType='numeric'
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Daily Fibre Goal (g)</Text>
          <TextInput
            placeholder='Enter fibre goal'
            value={fibreInput}
            onChangeText={setFibreInput}
            keyboardType='numeric'
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Weight Goal ({measurementSystem === 'imperial' ? 'lbs' : 'kg'})
          </Text>
          <TextInput
            placeholder={`Enter weight goal in ${
              measurementSystem === 'imperial' ? 'pounds' : 'kilograms'
            }`}
            value={weightInput}
            onChangeText={setWeightInput}
            keyboardType='numeric'
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            Keyboard.dismiss();
            handleSave();
          }}
        >
          <Text style={styles.saveButtonText}>Save Goals</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  calorieContainer: {
    gap: 5,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  inputContainer: {
    gap: 5,
    paddingHorizontal: 20,
    marginTop: 15
  },
  label: {
    fontSize: 16,
    color: '#665679',
    marginBottom: 5
  },
  input: {
    backgroundColor: '#F0EFFF',
    borderRadius: 10,
    padding: 10,
    color: '#665679'
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  rangeInput: {
    flex: 1
  },
  rangeSeparator: {
    color: '#665679',
    fontSize: 20
  },
  saveButton: {
    backgroundColor: '#665679',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20
  },
  saveButtonText: {
    color: '#F0EFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default GoalsScreen;
