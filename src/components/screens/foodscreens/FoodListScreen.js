import { useState } from 'react';
import { LogBox, Text } from 'react-native';
import Screen from '../../layout/Screen.js';
import Icons from '../../UI/Icons.js';
import { Button, ButtonTray } from '../../UI/Button.js';
import FoodList from '../../entity/fooditems/FoodList.js';
import initialFoods from '../../../data/foods.js';

const FoodListScreen = ({ navigation }) => {
  // Initialisations -------------------------
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);

  // State -----------------------------------
  const [foods, setFoods] = useState(initialFoods);

  // Handlers --------------------------------
  const handleDelete = (food) =>
    setFoods(foods.filter((item) => item.FoodID !== food.FoodID));

  const handleAdd = (food) => setFoods([...foods, food]);

  const handleModify = (updatedFood) =>
    setFoods(
      foods.map((food) =>
        food.FoodID === updatedFood.FoodID ? updatedFood : food
      )
    );

  const onDelete = (food) => {
    handleDelete(food);
    navigation.goBack();
  };

  const onAdd = (food) => {
    handleAdd(food);
    navigation.goBack();
  };

  const onModify = (food) => {
    handleModify(food);
    navigation.goBack();
    navigation.goBack();
  };

  const gotoViewScreen = (food) =>
    navigation.navigate('FoodViewScreen', { food, onDelete, onModify });

  const gotoAddScreen = () => navigation.navigate('FoodAddScreen', { onAdd });

  // View ------------------------------------
  return (
    <Screen>
      <ButtonTray>
        <Button label='Add' icon={<Icons.Add />} onClick={gotoAddScreen} />
      </ButtonTray>
      <Text> </Text>
      <FoodList foods={foods} onSelect={gotoViewScreen} />
    </Screen>
  );
};

export default FoodListScreen;
