import Screen from '../../layout/Screen.js';
import FoodItemForm from '../../entity/fooditems/FoodItemForm.js';
import Meals from '../../entity/fooditems/Meals.js';
import initialFoods from '../../../data/foods.js';

const FoodModifyScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { food, onModify } = route.params;
  const mealsInstance = Meals();

  // State -----------------------------------

  // Handlers --------------------------------
  const handleCancel = navigation.goBack;

  const handleModifyFood = (updatedFood) => {
    mealsInstance.handleModifyFood(updatedFood);
    if (route.params.onModify) {
      route.params.onModify(updatedFood);
    }
    const foodIndex = initialFoods.findIndex(
      (food) => food.FoodID === updatedFood.FoodID
    );
    if (foodIndex !== -1) {
      initialFoods[foodIndex] = updatedFood;
    }
    navigation.goBack();
  };

  // View ------------------------------------
  return (
    <Screen>
      <FoodItemForm
        originalFood={food}
        onSubmit={handleModifyFood}
        onCancel={handleCancel}
      />
    </Screen>
  );
};

export default FoodModifyScreen;
