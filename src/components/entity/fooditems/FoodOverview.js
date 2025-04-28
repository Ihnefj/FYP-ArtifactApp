import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert
} from 'react-native';
import Icons from '../../UI/Icons';

const FoodOverview = ({ foods, onSelect, onView, onEdit, onDelete }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  const handleDelete = (food) => {
    Alert.alert(
      'Delete Food',
      `Are you sure you want to delete ${food.FoodName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(food)
        }
      ]
    );
  };

  // View --------------------------------
  return (
    <FlatList
      data={foods}
      keyExtractor={(item, index) => `${item.FoodID}-${index}`}
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
            {item.Source !== 'USDA' && onEdit && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onEdit(item)}
              >
                <Icons.Edit />
              </TouchableOpacity>
            )}
            {item.Source !== 'USDA' && onDelete && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDelete(item)}
              >
                <Icons.Delete />
              </TouchableOpacity>
            )}
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
    borderBottomColor: '#DDDCE5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  foodText: {
    fontSize: 18,
    color: '#665679',
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10
  },
  iconButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#DDDCE5'
  },
  deleteButton: {
    backgroundColor: '#ffebee'
  }
});

export default FoodOverview;
