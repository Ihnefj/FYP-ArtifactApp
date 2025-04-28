import Screen from '../../layout/Screen';
import FoodView from '../../entity/fooditems/FoodView';
import { useEffect, useState } from 'react';
import initialFoods from '../../../data/foods.js';
import { ScrollView } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { customFoods } from '../../../data/customFoods';
import { Alert } from 'react-native';
import { useMeals } from '../../../contexts/MealsContext';

const FoodViewScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { food: initialFood, mealType, onDelete, onModify } = route.params;
  const { user } = useAuth();
  const { handleDeleteFood } = useMeals();

  // State -----------------------------------
  const [food, setFood] = useState(() => {
    const baseFood = initialFoods.find((f) => f.FoodID === initialFood.FoodID);
    if (baseFood) {
      return {
        ...baseFood,
        ...initialFood,
        amount: initialFood.amount || baseFood.amount || 100,
        FoodCalories: initialFood.FoodCalories || baseFood.FoodCalories,
        FoodProtein: initialFood.FoodProtein || baseFood.FoodProtein,
        FoodCarbs: initialFood.FoodCarbs || baseFood.FoodCarbs,
        FoodFat: initialFood.FoodFat || baseFood.FoodFat,
        FoodFibre: initialFood.FoodFibre || baseFood.FoodFibre
      };
    }
    return initialFood;
  });

  useEffect(() => {
    setFood(() => {
      const baseFood = initialFoods.find((f) => f.FoodID === food.FoodID);
      if (baseFood) {
        return {
          ...baseFood,
          uniqueID: food.uniqueID,
          FoodAmount: food.FoodAmount,
          FoodCalories: food.FoodCalories,
          BaseCalories: food.BaseCalories || baseFood.FoodCalories,
          BaseAmount: food.BaseAmount || baseFood.FoodAmount,
          BaseProtein: food.BaseProtein || baseFood.FoodProtein,
          BaseCarbs: food.BaseCarbs || baseFood.FoodCarbs,
          BaseFat: food.BaseFat || baseFood.FoodFat,
          BaseFibre: food.BaseFibre || baseFood.FoodFibre
        };
      }
      return food;
    });
  }, [food]);

  // Handlers --------------------------------
  const handleDelete = async () => {
    try {
      if (user && food.id) {
        await customFoods.deleteFirebaseFood(food.id, user.uid);
      }
      if (onDelete) {
        onDelete(food);
      }
      handleDeleteFood(food, mealType);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting food:', error);
      Alert.alert('Error', 'Failed to delete food. Please try again.');
    }
  };

  const gotoModifyScreen = () =>
    navigation.navigate('FoodModifyScreen', {
      food: food,
      onModify: async (newFood) => {
        try {
          if (onModify) {
            onModify(newFood);
          }
          navigation.goBack();
        } catch (error) {
          console.error('Error updating food:', error);
          Alert.alert('Error', 'Failed to update food item');
        }
      }
    });

  // View ------------------------------------
  return (
    <Screen>
      <ScrollView>
        <FoodView
          food={food}
          onDelete={handleDelete}
          onModify={gotoModifyScreen}
        />
      </ScrollView>
    </Screen>
  );
};

export default FoodViewScreen;
