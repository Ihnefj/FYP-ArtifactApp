import Screen from '../../layout/Screen';
import { Text, StyleSheet } from 'react-native';

const BarcodeScreen = () => {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <Screen>
      <Text style={styles.featureText}>This feature is under development</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  featureText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#665679',
    textAlign: 'center'
  }
});

export default BarcodeScreen;
