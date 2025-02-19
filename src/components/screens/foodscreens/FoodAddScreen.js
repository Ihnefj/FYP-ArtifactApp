import Screen from '../../layout/Screen.js';
import FoodItemForm from '../../entity/fooditems/FoodItemForm.js';

const FoodAddScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { onAdd } = route.params;

  // State -----------------------------------

  // Handlers --------------------------------
  const handleCancel = navigation.goBack;

  // View ------------------------------------
  return (
    <Screen>
      <FoodItemForm onSubmit={onAdd} onCancel={handleCancel} />
    </Screen>
  );
};

export default FoodAddScreen;
