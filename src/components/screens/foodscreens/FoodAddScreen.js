import { useState } from 'react';
import Screen from '../../layout/Screen.js';
import FoodItemForm from '../../entity/fooditems/FoodItemForm.js';
import { useAuth } from '../../../contexts/AuthContext';
import { customFoods } from '../../../data/customFoods';
import { Alert } from 'react-native';

const FoodAddScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { user } = useAuth();
  const { onAdd } = route.params;

  // State -----------------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState('');

  // Handlers --------------------------------
  const handleCancel = navigation.goBack;

  const handleSubmit = async (food) => {
    if (!food.FoodName || food.FoodName.trim() === '') {
      setNameError('Food name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      let savedFood;

      if (user) {
        savedFood = await customFoods.saveFirebaseFood(food, user.uid);
      } else {
        savedFood = await customFoods.saveLocalFood(food);
      }

      onAdd(savedFood);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save food. Please try again.');
      console.error('Error saving food:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // View ------------------------------------
  return (
    <Screen>
      <FoodItemForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        nameError={nameError}
        setNameError={setNameError}
      />
    </Screen>
  );
};

export default FoodAddScreen;
