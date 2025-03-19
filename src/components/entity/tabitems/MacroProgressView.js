import { StyleSheet, View, Text } from 'react-native';

const MacroProgressView = () => {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Macro Goals Progress</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#665679',
    textAlign: 'center',
    marginBottom: 10
  }
});

export default MacroProgressView;
