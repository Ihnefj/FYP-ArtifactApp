import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';
import Icons from '../../UI/Icons';

const FoodOverview = ({ foods, onSelect, onView, onEdit }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <FlatList
      data={foods}
      keyExtractor={(item) => item.FoodID.toString()}
      renderItem={({ item }) => (
        <View style={styles.foodItem}>
          <Text style={styles.foodText}>{item.FoodName}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onSelect(item)}
            >
              <Icons.Add />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onView(item)}
            >
              <Icons.Eye />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onEdit(item)}
            >
              <Icons.Edit />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  foodItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  foodText: {
    fontSize: 18,
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10
  },
  iconButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#eee'
  }
});

export default FoodOverview;
