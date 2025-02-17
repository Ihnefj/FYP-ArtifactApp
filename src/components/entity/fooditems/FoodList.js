import { ScrollView } from 'react-native';
import FoodItem from './FoodItem.js';

const FoodList = ({ meals = {}, onSelect, onDelete, onUpdate }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <ScrollView>
      {Object.entries(meals).map(([mealType, foods]) => (
        <FoodSection
          key={mealType}
          mealType={mealType}
          foods={foods}
          onSelect={onSelect}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ScrollView>
  );
};

const FoodSection = ({ foods, mealType, onSelect, onDelete, onUpdate }) => {
  return (
    <>
      {foods.map((food) => (
        <FoodItem
          key={food.uniqueID}
          food={food}
          onSelect={() => onSelect(food, mealType)}
          onDelete={() => onDelete(food, mealType)}
          onUpdate={(newAmount) => onUpdate(food, newAmount, mealType)}
        />
      ))}
    </>
  );
};

export default FoodList;
