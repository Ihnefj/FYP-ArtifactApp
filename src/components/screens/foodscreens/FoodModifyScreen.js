import Screen from '../../layout/Screen.js';
import FoodItemForm from '../../entity/fooditems/FoodItemForm.js';
import Meals from '../../entity/fooditems/Meals.js';

const FoodModifyScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { food, onModify } = route.params;
  // State -----------------------------------
  const mealsInstance = Meals();
  // Handlers --------------------------------
  const handleCancel = navigation.goBack;

  const handleModifyFood = (updatedFood) => {
    mealsInstance.handleModifyFood(updatedFood);
    route.params.onModify(updatedFood);
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
