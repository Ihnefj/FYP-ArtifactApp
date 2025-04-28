import { StyleSheet } from 'react-native';
import Screen from '../../../layout/Screen';
import SettingsView from '../../../entity/settings/SettingsView.js';

const SettingsScreen = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <Screen>
      <SettingsView navigation={navigation} />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default SettingsScreen;
