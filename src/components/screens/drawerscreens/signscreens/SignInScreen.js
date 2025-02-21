import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '../../../layout/Screen';
import SignView from '../../../entity/signitems/SignView';

const SignInScreen = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <Screen>
      <SignView navigation={navigation} />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default SignInScreen;
