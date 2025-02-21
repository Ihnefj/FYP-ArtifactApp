import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Screen from '../../../layout/Screen';
import { useState } from 'react';
import { useGoals } from '../../../../contexts/GoalsContext';
import { useNavigation } from '@react-navigation/native';

const GoalsScreen = () => {
  // Initialisations ---------------------
  const {
    dailyCalorieGoal,
    dailyProteinGoal,
    dailyCarbsGoal,
    dailyFatGoal,
    setGoals
  } = useGoals();
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

  // Handlers ----------------------------
  const handleSave = () => {
    const minCalories = parseInt(calorieMinInput);
    const maxCalories = parseInt(calorieMaxInput);

    const newGoals = {
      calories: {
        min: minCalories,
        max: maxCalories
      },
      protein: parseInt(proteinInput),
      carbs: parseInt(carbsInput),
      fat: parseInt(fatInput)
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
    }
  };

  // View ------------------------------------
  return (
    <Screen>
      <View style={styles.container}>
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Goals</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15
  },
  calorieContainer: {
    gap: 5
  },
  inputContainer: {
    gap: 5
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
    marginTop: 10
  },
  saveButtonText: {
    color: '#F0EFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default GoalsScreen;
