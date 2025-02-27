import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '../../../layout/Screen';
import HelpView from '../../../entity/helpitems/HelpView';

const SettingsScreen = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <Screen>
      <HelpView navigation={navigation} />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default SettingsScreen;
