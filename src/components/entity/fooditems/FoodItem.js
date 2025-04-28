import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import Icons from '../../UI/Icons';

const FoodItem = ({ food, onDelete, onUpdate }) => {
  // Initialisations ---------------------
  const baseAmount = parseInt(food.FoodAmount) || parseInt(food.amount) || 100;
  const baseCalories = food.FoodCalories || 0;
  const baseProtein = food.FoodProtein || 0;
  const baseCarbs = food.FoodCarbs || 0;
  const baseFat = food.FoodFat || 0;
  const baseFibre = food.FoodFibre || 0;

  // State -------------------------------
  const [amount, setAmount] = useState(baseAmount);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const newAmount = parseInt(food.FoodAmount) || parseInt(food.amount) || 100;
    setAmount(newAmount);
  }, [food.FoodAmount, food.amount]);

  // Handlers --------------------------
  const handleAmountChange = (newAmount) => {
    const parsedAmount = parseInt(newAmount) || 0;
    setAmount(parsedAmount);

    const ratio = parsedAmount / baseAmount;
    const updatedFood = {
      ...food,
      amount: parsedAmount,
      FoodAmount: parsedAmount.toString(),
      FoodCalories: Math.round(baseCalories * ratio),
      FoodProtein: Math.round(baseProtein * ratio),
      FoodCarbs: Math.round(baseCarbs * ratio),
      FoodFat: Math.round(baseFat * ratio),
      FoodFibre: Math.round(baseFibre * ratio)
    };

    onUpdate(parsedAmount);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (amount === '') {
      setAmount(0);
      handleAmountChange('0');
    }
  };

  // View ------------------------------
  return (
    <View>
      <Pressable>
        <View style={styles.container}>
          <Text style={[styles.text, styles.expand]}>{food.FoodName}</Text>
          <TextInput
            style={styles.amountInput}
            value={amount.toString()}
            keyboardType='numeric'
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            onChangeText={handleAmountChange}
          />
          <Text style={styles.unitText}>{food.FoodUnit || 'g'}</Text>
          <Text style={[styles.text, styles.caloriesText]}>
            {Math.round(baseCalories * (amount / baseAmount))} kcal
          </Text>
          <Pressable onPress={() => onDelete(food)}>
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
