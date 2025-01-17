import Screen from '../../layout/Screen';
import FoodView from '../../entity/fooditems/FoodView';

const FoodViewScreen = ({ navigation, route }) => {
  // Initialisations -------------------------
  const { food, onDelete, onModify } = route.params;

  // State -----------------------------------
  // Handlers --------------------------------
  const gotoModifyScreen = () =>
    navigation.navigate('FoodModifyScreen', { food, onModify });

  // View ------------------------------------
  return (
    <Screen>
      <FoodView food={food} onDelete={onDelete} onModify={gotoModifyScreen} />
    </Screen>
  );
};

export default FoodViewScreen;
