import Screen from '../../layout/Screen.js';
import FoodItemForm from '../../entity/fooditems/FoodItemForm.js';

const FoodModifyScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { food, onModify } = route.params;

  // Handlers -------------------------------
  const handleCancel = () => navigation.goBack();

  const handleSubmit = (updatedFood) => {
    console.log('Submitting food modification');
    onModify(updatedFood);
    navigation.goBack();
  };

  return (
    <Screen>
      <FoodItemForm
        originalFood={food}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Screen>
  );
};

export default FoodModifyScreen;
