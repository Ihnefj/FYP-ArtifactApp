import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LogBox, Text, View, TextInput, StyleSheet } from 'react-native';
import FoodOverview from '../../entity/fooditems/FoodOverview.js';
import initialFoods from '../../../data/foods.js';
import Meals from '../../entity/fooditems/Meals.js';
import Screen from '../../layout/Screen.js';

const FoodOverviewScreen = () => {
  // Initialisations -------------------------
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);
  const route = useRoute();
  const navigation = useNavigation();
  const { mealType } = route.params;
  const mealsInstance = Meals();

  // State -----------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(initialFoods);
  const [foodList, setFoodList] = useState(filteredFoods);
  const meals = mealsInstance.getMeals();

  // Handlers --------------------------------
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredFoods(initialFoods);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = initialFoods.filter((food) =>
        food.FoodName.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredFoods(filtered);
    }
  };

  const handleSelectFood = (food) => {
    mealsInstance.addFood(food, mealType);
    route.params.onAddFood(food, mealType);
    navigation.goBack();
  };

  const handleModifyFood = (updatedFood) => {
    setFilteredFoods((prevFoods) =>
      prevFoods.map((food) =>
        food.FoodID === updatedFood.FoodID ? updatedFood : food
      )
    );

    const foodIndex = initialFoods.findIndex(
      (food) => food.FoodID === updatedFood.FoodID
    );
    if (foodIndex !== -1) {
      initialFoods[foodIndex] = updatedFood;
    }

    if (route.params.onModifyFood) {
      route.params.onModifyFood(updatedFood);
    }
  };

  const updateFoodInList = (updatedFood) => {
    setFilteredFoods((prevFoods) =>
      prevFoods.map((food) =>
        food.FoodID === updatedFood.FoodID ? updatedFood : food
      )
    );
    const foodIndex = initialFoods.findIndex(
      (food) => food.FoodID === updatedFood.FoodID
    );
    if (foodIndex !== -1) {
      initialFoods[foodIndex] = updatedFood;
    }
  };

  const gotoModifyScreen = (food) =>
    navigation.navigate('FoodModifyScreen', {
      food,
      onModify: handleModifyFood
    });

  const gotoFoodView = (food) => {
    navigation.navigate('FoodViewScreen', {
      food,
      mealType,
      onDelete: mealsInstance.handleDeleteFood,
      onModify: handleModifyFood
    });
  };

  // View ------------------------------------
  return (
    <Screen>
      <TextInput
        style={styles.searchInput}
        placeholder='Search foods...'
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FoodOverview
        foods={filteredFoods}
        onSelect={handleSelectFood}
        onView={gotoFoodView}
        onEdit={gotoModifyScreen}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10
  }
});

export default FoodOverviewScreen;
