import { ScrollView, StyleSheet, Text } from 'react-native';
import FoodItemForm from './FoodItemForm.js';
import FoodItem from './FoodItem.js';

const FoodList = ({ foods, onSelect }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.boldText}>Breakfast</Text>
      {foods.map((food) => {
        return <FoodItem key={food.FoodID} food={food} onSelect={onSelect} />;
      })}
      <Text style={styles.boldText}>Lunch</Text>
      {foods.map((food) => {
        return <FoodItem key={food.FoodID} food={food} onSelect={onSelect} />;
      })}
      <Text style={styles.boldText}>Dinner</Text>
      {foods.map((food) => {
        return <FoodItem key={food.FoodID} food={food} onSelect={onSelect} />;
      })}
      <Text style={styles.boldText}>Snacks</Text>
      {foods.map((food) => {
        return <FoodItem key={food.FoodID} food={food} onSelect={onSelect} />;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15
  },
  image: {
    borderRadius: 3
  },
  infoTray: {
    gap: 5
  },
  text: {
    fontSize: 16
  },
  boldText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  dimText: {
    color: 'grey'
  }
});

export default FoodList;
