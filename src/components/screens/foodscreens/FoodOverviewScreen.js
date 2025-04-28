import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  LogBox,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import debounce from 'lodash/debounce';
import { useMeals } from '../../../contexts/MealsContext';
import { format } from 'date-fns';
import { useCustomFoods } from '../../../contexts/CustomFoodsContext';

import Screen from '../../layout/Screen.js';
import FoodOverview from '../../entity/fooditems/FoodOverview.js';
import Icons from '../../UI/Icons.js';
import initialFoods from '../../../data/foods.js';
import { foodSearch } from '../../../data/foodSearch.js';
import { useAuth } from '../../../contexts/AuthContext';

// Initialisations ---------------------
const generateUUID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const FoodOverviewScreen = () => {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);

  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { mealType } = route.params;
  const { addMeal } = useMeals();
  const { customFoodsList, deleteCustomFood, addCustomFood, updateCustomFood } =
    useCustomFoods();

  // State -------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(initialFoods);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = debounce((text) => {
    handleSearch(text);
  }, 500);

  // Handlers ----------------------------
  useEffect(() => {
    setFilteredFoods([...initialFoods]);
    setIsLoading(false);
  }, [customFoodsList]);

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredFoods([...initialFoods]);
      return;
    }

    const localResults = initialFoods.filter((food) =>
      food.FoodName.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredFoods(localResults);

    try {
      const remoteResults = await foodSearch(query);
      const existingIds = new Set(localResults.map((f) => f.FoodID));
      const uniqueRemoteResults = remoteResults.filter(
        (f) => !existingIds.has(f.FoodID)
      );

      setFilteredFoods((prev) => [...prev, ...uniqueRemoteResults]);
    } catch (error) {
      console.error('External food search failed:', error);
    }
  };

  const handleSelectFood = (food) => {
    const originalAmount =
      parseFloat(food.FoodAmount) || parseFloat(food.amount) || 100;
    const originalUnit = food.FoodUnit || 'g';
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

    const standardCalories = Number(
      parseFloat(food.FoodCalories * ratio || 0).toFixed(1)
    );
    const standardProtein = Number(
      parseFloat(food.FoodProtein * ratio || 0).toFixed(1)
    );
    const standardCarbs = Number(
      parseFloat(food.FoodCarbs * ratio || 0).toFixed(1)
    );
    const standardFat = Number(
      parseFloat(food.FoodFat * ratio || 0).toFixed(1)
    );
    const standardFibre = Number(
      parseFloat(food.FoodFibre * ratio || 0).toFixed(1)
    );

    const newMeal = {
      id: generateUUID(),
      date: format(new Date(), 'yyyy-MM-dd'),
      mealType,
      FoodName: food.FoodName || 'Unnamed Food',
      amount: standardAmount,
      FoodAmount: standardAmount.toString(),
      FoodUnit: originalUnit,
      FoodCalories: standardCalories,
      FoodProtein: standardProtein,
      FoodCarbs: standardCarbs,
      FoodFat: standardFat,
      FoodFibre: standardFibre,
      Source: food.Source || 'Custom',
      FoodID: food.FoodID || generateUUID()
    };

    addMeal(newMeal);
    navigation.goBack();
  };

  const handleDeleteFood = async (foodToDelete) => {
    try {
      await deleteCustomFood(foodToDelete);
    } catch (error) {
      console.error('Error deleting food:', error);
      Alert.alert('Error', 'Failed to delete food. Please try again.');
    }
  };

  const gotoAddScreen = () => {
    navigation.navigate('FoodAddScreen', {
      onAdd: (newFood) => {
        addCustomFood(newFood);
      }
    });
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

  const gotoModifyScreen = (food) => {
    navigation.navigate('FoodModifyScreen', {
      food,
      onModify: handleModifyFood
    });
  };

  const gotoFoodView = (food) => {
    navigation.navigate('FoodViewScreen', {
      food,
      mealType,
      onDelete: handleDeleteFood,
      onModify: handleModifyFood
    });
  };

  // View --------------------------------
  return (
    <Screen>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='Search foods...'
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
        <>
          {customFoodsList.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>Custom Items</Text>
              <FoodOverview
                foods={customFoodsList}
                onSelect={handleSelectFood}
                onView={gotoFoodView}
                onEdit={gotoModifyScreen}
                onDelete={handleDeleteFood}
              />
            </>
          )}
          <Text style={styles.sectionHeader}>Food Examples</Text>
          <FoodOverview
            foods={filteredFoods}
            onSelect={handleSelectFood}
            onView={gotoFoodView}
          />
        </>
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
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#665679'
  }
});

export default FoodOverviewScreen;
