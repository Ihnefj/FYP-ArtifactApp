import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import Icons from '../../UI/Icons';

const FoodItem = ({ food, onDelete, onUpdate }) => {
  // Initialisations ---------------------
  const baseCalories = food.BaseCalories || food.FoodCalories || 0;
  const baseAmount = food.BaseAmount || 100;

  // State -------------------------------
  const [amount, setAmount] = useState(food.FoodAmount.toString());
  const [displayFood, setDisplayFood] = useState(food);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDisplayFood(food);
      setAmount(food.FoodAmount.toString());
    }
  }, [food, isEditing]);

  // Handlers --------------------------
  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
    onUpdate(newAmount);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (amount === '') {
      setAmount('0');
      onUpdate('0');
    }
  };

  // View ------------------------------
  const numericAmount = parseFloat(amount) || 0;
  const calculatedCalories = (numericAmount / baseAmount) * baseCalories;

  return (
    <View>
      <Pressable>
        <View style={styles.container}>
          <Text style={[styles.text, styles.expand]}>
            {displayFood.FoodName}
          </Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            keyboardType='numeric'
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            onChangeText={handleAmountChange}
          />
          <Text style={styles.unitText}>{displayFood.FoodUnit || 'g'}</Text>
          <Text style={[styles.text, styles.caloriesText]}>
            {Math.round(calculatedCalories)} kcal
          </Text>
          <Pressable onPress={() => onDelete(displayFood)}>
            <Icons.Delete />
          </Pressable>
        </View>
      </Pressable>
    </View>
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
  caloriesText: {
    fontSize: 16,
    color: '#665679',
    marginLeft: 10,
    marginRight: 10
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
