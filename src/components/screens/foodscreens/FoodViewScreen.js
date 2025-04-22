import Screen from '../../layout/Screen';
import FoodView from '../../entity/fooditems/FoodView';
import Meals from '../../entity/fooditems/Meals';
import { useEffect, useState } from 'react';
import initialFoods from '../../../data/foods.js';
import { ScrollView } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { customFoods } from '../../../data/customFoods';
import { Alert } from 'react-native';

const FoodViewScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { food, onDelete, onModify, mealType } = route.params;
  const mealsInstance = Meals();
  const { user } = useAuth();

  // State -----------------------------------
  const [updatedFood, setUpdatedFood] = useState(food);

  useEffect(() => {
    setUpdatedFood(() => {
      const baseFood = initialFoods.find((f) => f.FoodID === food.FoodID);
      if (baseFood) {
        const newFoodCalories =
          (food.FoodAmount / baseFood.FoodAmount) * baseFood.FoodCalories;
        return {
          ...baseFood,
          uniqueID: food.uniqueID,
          FoodAmount: food.FoodAmount,
          FoodCalories: newFoodCalories,
          BaseCalories: baseFood.FoodCalories,
          BaseAmount: baseFood.FoodAmount
        };
      }
      return food;
    });
  }, [food]);

  // Handlers --------------------------------
  const handleDelete = async () => {
    try {
      if (user && updatedFood.id) {
        await customFoods.deleteFirebaseFood(updatedFood.id, user.uid);
      }

      if (onDelete) {
        onDelete(updatedFood);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error deleting food:', error);
      Alert.alert('Error', 'Failed to delete food. Please try again.');
    }
  };

  const gotoModifyScreen = () =>
    navigation.navigate('FoodModifyScreen', {
      food: updatedFood,
      onModify: (newFood) => {
        if (onModify) {
          onModify(newFood);
        }
        navigation.goBack();
      }
    });

  // View ------------------------------------
  return (
    <Screen>
      <ScrollView>
        <FoodView
          food={updatedFood}
          onDelete={handleDelete}
          onModify={gotoModifyScreen}
        />
      </ScrollView>
    </Screen>
  );
};

export default FoodViewScreen;
