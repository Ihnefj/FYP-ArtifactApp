import { Pressable, StyleSheet, Text, View } from 'react-native';

const FoodItem = ({ food, onSelect }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <Pressable onPress={() => onSelect(food)}>
      <View style={styles.item}>
        <Text style={styles.text}>
          {food.FoodAmount} {food.FoodName}
        </Text>
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
    fontSize: 16
  }
});

export default FoodItem;
