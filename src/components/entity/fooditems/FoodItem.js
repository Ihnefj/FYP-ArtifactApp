import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import Icons from '../../UI/Icons';

const FoodItem = ({ food, onSelect, onDelete, onUpdate }) => {
  // Initialisations ---------------------
  // State -------------------------------
  const [amount, setAmount] = useState(food.FoodAmount.toString());
  // Handlers ----------------------------
  const baseCalories = food.BaseCalories || food.FoodCalories;
  const baseAmount = food.BaseAmount || 100;
  const calculatedCalories = (parseFloat(amount) / baseAmount) * baseCalories;

  // View --------------------------------
  return (
    <Pressable onPress={() => onSelect(food)}>
      <View style={styles.item}>
        <View style={styles.row}>
          <Text style={styles.text}>{food.FoodName}</Text>
          <Text style={styles.kcalSpace}>
            {Math.round(calculatedCalories)} kcal
          </Text>
        </View>

        <View style={styles.row}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            keyboardType='numeric'
            onChangeText={(newAmount) => {
              setAmount(newAmount);
              onUpdate(newAmount);
            }}
          />

          <Text style={styles.dimText}>{food.FoodUnit}</Text>

          <Pressable onPress={() => onDelete(food)}>
            <Icons.Delete />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColer: 'lightgray'
  },
  text: {
    fontSize: 16,
    flex: 1
  },
  dimText: {
    color: 'grey'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  kcalSpace: {
    textAlign: 'right',
    flex: 1,
    color: 'grey'
  },
  amountInput: {
    width: 50,
    fontSize: 16,
    borderBottomWidth: 1,
    textAlign: 'center',
    marginRight: 5
  }
});

export default FoodItem;
