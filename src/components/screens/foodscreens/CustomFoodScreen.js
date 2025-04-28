import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import { useMeals } from '../../../contexts/MealsContext';
import { format } from 'date-fns';
import { useCustomFoods } from '../../../contexts/CustomFoodsContext';

import Screen from '../../layout/Screen';
import Icons from '../../UI/Icons';
import FoodOverview from '../../entity/fooditems/FoodOverview';
import { useAuth } from '../../../contexts/AuthContext';

const generateUUID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const CustomFoodScreen = () => {
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { addMeal } = useMeals();
  const { customFoodsList, deleteCustomFood, updateCustomFood, addCustomFood } =
    useCustomFoods();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = debounce((text) => handleSearch(text), 400);

  const mealType = route.params?.mealType;

  useEffect(() => {
    setFilteredList(customFoodsList);
    setIsLoading(false);
  }, [customFoodsList]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredList(customFoodsList);
      return;
    }
    const results = customFoodsList.filter((item) =>
      item.FoodName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredList(results);
  };

  const handleSelect = (food) => {
    if (!mealType) {
      console.warn('No mealType provided to CustomFoodScreen');
      return;
    }

    const updatedFood =
      customFoodsList.find((f) => f.FoodID === food.FoodID) || food;

    const originalAmount =
      parseFloat(updatedFood.FoodAmount) ||
      parseFloat(updatedFood.amount) ||
      100;
    const originalUnit = updatedFood.FoodUnit || 'g';
    const normalizedUnit = originalUnit.toLowerCase().trim();

    let standardAmount;
    if (normalizedUnit === 'g' || normalizedUnit === 'ml') {
      standardAmount = 100;
    } else if (
      normalizedUnit === 'tbsp' ||
      normalizedUnit === 'tsp' ||
      normalizedUnit === 'serving' ||
      normalizedUnit === 'servings'
    ) {
      standardAmount = 1;
    } else {
      standardAmount = originalAmount;
    }

    const ratio = standardAmount / originalAmount;

    const standardCalories = Math.round(updatedFood.FoodCalories * ratio);
    const standardProtein = Math.round(updatedFood.FoodProtein * ratio);
    const standardCarbs = Math.round(updatedFood.FoodCarbs * ratio);
    const standardFat = Math.round(updatedFood.FoodFat * ratio);
    const standardFibre = Math.round(updatedFood.FoodFibre * ratio);

    const newMeal = {
      id: generateUUID(),
      date: format(new Date(), 'yyyy-MM-dd'),
      mealType,
      FoodName: updatedFood.FoodName || 'Unnamed Food',
      amount: standardAmount,
      FoodAmount: standardAmount.toString(),
      FoodUnit: originalUnit,
      FoodCalories: standardCalories,
      FoodProtein: standardProtein,
      FoodCarbs: standardCarbs,
      FoodFat: standardFat,
      FoodFibre: standardFibre,
      Source: 'Custom',
      FoodID: updatedFood.FoodID || generateUUID()
    };

    addMeal(newMeal);
    navigation.goBack();
  };

  const handleDelete = async (foodToDelete) => {
    try {
      await deleteCustomFood(foodToDelete);
    } catch (error) {
      console.error('Error deleting custom food:', error);
      Alert.alert('Error', 'Failed to delete food.');
    }
  };

  const handleModifyFood = async (updatedFood) => {
    try {
      await updateCustomFood(updatedFood);
      navigation.goBack();
    } catch (error) {
      console.error('Error modifying food:', error);
      Alert.alert('Error', 'Failed to modify food.');
    }
  };

  const gotoAddScreen = () => {
    navigation.navigate('FoodAddScreen', {
      onAdd: (newFood) => {
        addCustomFood(newFood);
      }
    });
  };

  const gotoModifyScreen = (food) => {
    navigation.navigate('FoodModifyScreen', {
      food,
      onModify: handleModifyFood
    });
  };

  const handleFoodView = (food) => {
    navigation.navigate('FoodViewScreen', {
      food,
      onDelete: handleDelete,
      onModify: handleModifyFood
    });
  };

  return (
    <Screen>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='Search custom foods...'
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            debouncedSearch(text);
          }}
        />
        <TouchableOpacity style={styles.addButton} onPress={gotoAddScreen}>
          <Icons.Add />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#665679' />
        </View>
      ) : (
        <FoodOverview
          foods={filteredList}
          onSelect={handleSelect}
          onEdit={gotoModifyScreen}
          onDelete={handleDelete}
          onView={handleFoodView}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F0EFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CustomFoodScreen;
