import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '../../../layout/Screen';
import RegisterView from '../../../entity/signitems/RegisterView';

const RegisterScreen = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <Screen>
      <RegisterView navigation={navigation} />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default RegisterScreen;
