import Screen from '../../layout/Screen.js';
import FoodItemForm from '../../entity/fooditems/FoodItemForm.js';

const FoodModifyScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { food, onModify } = route.params;
  // State -----------------------------------
  // Handlers --------------------------------
  const handleCancel = navigation.goBack;

  // View ------------------------------------
  return (
    <Screen>
      <FoodItemForm
        originalFood={food}
        onSubmit={onModify}
        onCancel={handleCancel}
      />
    </Screen>
  );
};

export default FoodModifyScreen;
