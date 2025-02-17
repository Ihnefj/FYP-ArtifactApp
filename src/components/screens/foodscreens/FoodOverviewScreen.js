import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LogBox, Text, View, TextInput, StyleSheet } from 'react-native';
import FoodOverview from '../../entity/fooditems/FoodOverview.js';
import initialFoods from '../../../data/foods.js';
import Meals from '../../entity/fooditems/Meals.js';

const FoodOverviewScreen = () => {
  // Initialisations -------------------------
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);

  // State -----------------------------------

  const route = useRoute();
  const navigation = useNavigation();
  const { mealType } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(initialFoods);
  const mealsInstance = Meals();
  const meals = mealsInstance.getMeals();
  const [foodList, setFoodList] = useState(filteredFoods);

  // Handlers --------------------------------

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredFoods(
      initialFoods.filter((food) =>
        food.FoodName.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleSelectFood = (food) => {
    meals[mealType] = [...meals[mealType], food];
    mealsInstance.updateMeals(meals);
    route.params.onAddFood(food, mealType);
    navigation.goBack();
  };

  const handleModifyFood = (updatedFood, mealType) => {
    meals[mealType] = meals[mealType].map((food) =>
      food.FoodID === updatedFood.FoodID ? updatedFood : food
    );
    mealsInstance.updateMeals(meals);
    setMeals({ ...meals });
  };

  const gotoModifyScreen = (food) => {
    navigation.navigate('FoodModifyScreen', {
      food,
      onModify: (updatedFood) => {
        setFoodList((prevFoodList) =>
          prevFoodList.map((f) =>
            f.FoodID === updatedFood.FoodID ? updatedFood : f
          )
        );
      }
    });
  };

  const gotoFoodView = (food, mealType) => {
    navigation.navigate('FoodViewScreen', {
      food,
      mealType,
      onModify: handleModifyFood
    });
  };

  // View ------------------------------------
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder='Search foods...'
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FoodOverview
        foods={foodList}
        onSelect={handleSelectFood}
        onView={gotoFoodView}
        onEdit={gotoModifyScreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10
  }
});

export default FoodOverviewScreen;
