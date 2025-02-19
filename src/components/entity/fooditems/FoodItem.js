import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import Icons from '../../UI/Icons';

const FoodItem = ({ food, onSelect, onDelete, onUpdate }) => {
  // Initialisations ---------------------
  const baseCalories = food.BaseCalories || food.FoodCalories;
  const baseAmount = food.BaseAmount || 100;

  // State -------------------------------
  const [amount, setAmount] = useState(food.FoodAmount.toString());
  const [displayFood, setDisplayFood] = useState(food);

  useEffect(() => {
    setDisplayFood(food);
    setAmount(food.FoodAmount.toString());
  }, [food]);

  // Handlers ----------------------------
  const calculatedCalories = (parseFloat(amount) / baseAmount) * baseCalories;

  // View --------------------------------
  return (
    <Pressable onPress={() => onSelect(displayFood)}>
      <View style={styles.container}>
        <Text style={[styles.text, styles.expand]}>{displayFood.FoodName}</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          keyboardType='numeric'
          onChangeText={(newAmount) => {
            setAmount(newAmount);
            onUpdate(newAmount);
          }}
        />
        <Text style={styles.unitText}>{displayFood.FoodUnit}</Text>
        <Text style={[styles.text, styles.expand, styles.caloriesText]}>
          {Math.round(calculatedCalories)}
        </Text>
        <Text style={styles.kcalText}>kcal</Text>
        <Pressable onPress={() => onDelete(displayFood)}>
          <Icons.Delete />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#C4C3D0',
    borderRadius: 5,
    marginBottom: 5
  },
  text: {
    fontSize: 16,
    color: '#665679'
  },
  kcalText: {
    fontSize: 16,
    color: '#C4C3D0',
    marginLeft: 5,
    marginRight: 15
  },
  caloriesText: {
    textAlign: 'right'
  },
  unitText: {
    fontSize: 16,
    color: '#C4C3D0'
  },
  amountInput: {
    width: 50,
    fontSize: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#665679',
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#665679'
  },
  expand: {
    flex: 1
  }
});

export default FoodItem;
