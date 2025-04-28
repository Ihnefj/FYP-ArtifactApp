import { Alert, StyleSheet, Text, View } from 'react-native';
import FullWidthImage from 'react-native-fullwidth-image';
import Icons from '../../UI/Icons.js';
import { Button, ButtonTray } from '../../UI/Button.js';

const FoodView = ({ food, onDelete, onModify }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  const handleDelete = () => onDelete(food);

  const requestDelete = () =>
    Alert.alert(
      'Delete warning',
      `Are you sure you sure that you want to delete food ${food.FoodName}`,
      [{ text: 'Cancel' }, { text: 'Delete', onPress: handleDelete }]
    );

  // View --------------------------------
  return (
    <View style={styles.container}>
      <FullWidthImage source={{ uri: food.FoodImage }} style={styles.image} />

      <View style={styles.infoTray}>
        <Text style={styles.boldText}>{food.FoodName}</Text>
        <Text style={styles.text}>
          Amount: {food.FoodAmount}{' '}
          <Text style={styles.dimText}>{food.FoodUnit}</Text>
        </Text>
        <Text style={styles.text}>
          Calories: {food.FoodCalories} <Text style={styles.dimText}>kcal</Text>
        </Text>
        <Text style={styles.text}>
          Protein: {food.FoodProtein} <Text style={styles.dimText}>g</Text>
        </Text>
        <Text style={styles.text}>
          Carbohydrates: {food.FoodCarbs} <Text style={styles.dimText}>g</Text>
        </Text>
        <Text style={styles.text}>
          Fat: {food.FoodFat} <Text style={styles.dimText}>g</Text>
        </Text>
        <Text style={styles.text}>
          Fibre: {food.FoodFibre} <Text style={styles.dimText}>g</Text>
        </Text>
      </View>

      <ButtonTray>
        <Button icon={<Icons.Edit />} label='Modify' onClick={onModify} />
        <Button
          icon={<Icons.Delete />}
          label='Delete'
          onClick={requestDelete}
          styleButton={{ backgroundColor: 'mistyrose' }}
          styleLabel={{ color: 'red' }}
        />
      </ButtonTray>
    </View>
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
    fontSize: 16,
    fontWeight: 'bold'
  },
  dimText: {
    color: 'grey'
  }
});

export default FoodView;
