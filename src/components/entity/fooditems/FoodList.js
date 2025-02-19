import { ScrollView } from 'react-native';
import FoodItem from './FoodItem.js';

const FoodList = ({ foods = [], mealType, onSelect, onDelete, onUpdate }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <ScrollView>
      {foods.map((food) => (
        <FoodItem
          key={food.uniqueID}
          food={food}
          onSelect={() => onSelect(food, mealType)}
          onDelete={() => onDelete(food, mealType)}
          onUpdate={(newAmount) => onUpdate(food, newAmount, mealType)}
        />
      ))}
    </ScrollView>
  );
};

export default FoodList;
