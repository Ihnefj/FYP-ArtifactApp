import { StyleSheet, View, Button } from 'react-native';
import Screen from '../../../layout/Screen';
import Form from '../../../UI/Form';
import { useState } from 'react';
import { useGoals } from '../../../../contexts/GoalsContext';
import Icons from '../../../UI/Icons';
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
  const [calorieInput, setCalorieInput] = useState(dailyCalorieGoal.toString());
  const [proteinInput, setProteinInput] = useState(dailyProteinGoal.toString());
  const [carbsInput, setCarbsInput] = useState(dailyCarbsGoal.toString());
  const [fatInput, setFatInput] = useState(dailyFatGoal.toString());

  // Handlers ----------------------------
  const handleSave = () => {
    const newGoals = {
      calories: parseInt(calorieInput),
      protein: parseInt(proteinInput),
      carbs: parseInt(carbsInput),
      fat: parseInt(fatInput)
    };

    if (Object.values(newGoals).every((value) => !isNaN(value) && value > 0)) {
      setGoals(newGoals);
    } else {
      setCalorieInput(dailyCalorieGoal.toString());
      setProteinInput(dailyProteinGoal.toString());
      setCarbsInput(dailyCarbsGoal.toString());
      setFatInput(dailyFatGoal.toString());
    }
    navigation.navigate('SettingsScreen');
  };

  // View --------------------------------
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Form.InputText
            label='Daily Calorie Goal'
            value={calorieInput}
            onChange={setCalorieInput}
            keyboardType='numeric'
          />
          <Form.InputText
            label='Daily Protein Goal (g)'
            value={proteinInput}
            onChange={setProteinInput}
            keyboardType='numeric'
          />
          <Form.InputText
            label='Daily Carbs Goal (g)'
            value={carbsInput}
            onChange={setCarbsInput}
            keyboardType='numeric'
          />
          <Form.InputText
            label='Daily Fat Goal (g)'
            value={fatInput}
            onChange={setFatInput}
            keyboardType='numeric'
          />
        </View>
        <Button title='Save Changes' onPress={handleSave} color='#665679' />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    gap: 20
  },
  formContainer: {
    padding: 5
  }
});

export default GoalsScreen;
