import { View, Text, StyleSheet } from 'react-native';

const MacroProgScreen = () => {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Macro Goals Progress</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: '#665679'
  }
});

export default MacroProgScreen;
