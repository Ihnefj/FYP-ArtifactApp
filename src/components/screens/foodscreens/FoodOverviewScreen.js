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
import FoodOverview from '../../entity/fooditems/FoodOverview.js';
import initialFoods from '../../../data/foods.js';
import Meals from '../../entity/fooditems/Meals.js';
import Screen from '../../layout/Screen.js';
import { useAuth } from '../../../contexts/AuthContext';
import { customFoods, CUSTOM_FOODS_KEY } from '../../../data/customFoods';
import Icons from '../../UI/Icons.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash/debounce';
import { foodSearch } from '../../../data/foodSearch.js';

const FoodOverviewScreen = () => {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);
  const route = useRoute();
  const navigation = useNavigation();
  const { mealType } = route.params;
  const mealsInstance = Meals();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(initialFoods);
  const [personalFoods, setPersonalFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = debounce((text) => {
    handleSearch(text);
  }, 500);

  useEffect(() => {
    loadPersonalFoods();
  }, [user]);

  const loadPersonalFoods = async () => {
    try {
      setIsLoading(true);
      let foods = [];
      if (user) {
        foods = await customFoods.getFirebaseFoods(user.uid);
      } else {
        foods = await customFoods.getLocalFoods();
      }

      foods = foods.map((f) => ({ ...f, Source: 'Custom' }));

      setPersonalFoods(foods);
      setFilteredFoods([...initialFoods, ...foods]);
    } catch (error) {
      console.error('Error loading personal foods:', error);
      setFilteredFoods(initialFoods);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredFoods([...initialFoods, ...personalFoods]);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const localResults = [...initialFoods, ...personalFoods].filter((food) =>
      food.FoodName.toLowerCase().includes(lowercasedQuery)
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
    mealsInstance.addFood(food, mealType);
    route.params.onAddFood(food, mealType);
    navigation.goBack();
  };

  const handleModifyFood = async (updatedFood) => {
    try {
      if (user) {
        await customFoods.updateFirebaseFood(
          updatedFood.id,
          updatedFood,
          user.uid
        );
      }
      setPersonalFoods((prevFoods) =>
        prevFoods.map((food) =>
          food.FoodID === updatedFood.FoodID ? updatedFood : food
        )
      );
      setFilteredFoods((prevFoods) =>
        prevFoods.map((food) =>
          food.FoodID === updatedFood.FoodID ? updatedFood : food
        )
      );
    } catch (error) {
      console.error('Error modifying food:', error);
    }
  };

  const handleDeleteFood = async (foodToDelete) => {
    try {
      if (user && foodToDelete.id) {
        await customFoods.deleteFirebaseFood(foodToDelete.id, user.uid);
      } else {
        const foods = await customFoods.getLocalFoods();
        const updatedFoods = foods.filter(
          (food) => food.FoodID !== foodToDelete.FoodID
        );
        await AsyncStorage.setItem(
          CUSTOM_FOODS_KEY,
          JSON.stringify(updatedFoods)
        );
      }

      setPersonalFoods((prevFoods) =>
        prevFoods.filter((food) => food.FoodID !== foodToDelete.FoodID)
      );
      setFilteredFoods((prevFoods) =>
        prevFoods.filter((food) => food.FoodID !== foodToDelete.FoodID)
      );
    } catch (error) {
      console.error('Error deleting food:', error);
      Alert.alert('Error', 'Failed to delete food. Please try again.');
    }
  };

  const handleAddFood = async (newFood) => {
    setPersonalFoods((prevFoods) => {
      const updated = [...prevFoods, newFood];
      setFilteredFoods([...initialFoods, ...updated]);
      return updated;
    });
  };

  const gotoAddScreen = () => {
    navigation.navigate('FoodAddScreen', {
      onAdd: handleAddFood
    });
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
      onDelete: handleDeleteFood,
      onModify: handleModifyFood
    });
  };

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
          {personalFoods.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>Custom Items</Text>
              <FoodOverview
                foods={personalFoods}
                onSelect={handleSelectFood}
                onView={gotoFoodView}
                onEdit={gotoModifyScreen}
                onDelete={handleDeleteFood}
              />
            </>
          )}
          <FoodOverview
            foods={filteredFoods.filter((f) => f.Source !== 'Custom')}
            onSelect={handleSelectFood}
            onView={gotoFoodView}
            onEdit={null}
            onDelete={null}
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
