import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icons from '../../UI/Icons';
import { Button, ButtonTray } from '../../UI/Button';
import SettingsScreen from '../../screens/drawerscreens/settingsscreens/SettingsScreen';

const SettingsView = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  const gotoProfileScreen = () => navigation.navigate('ProfileScreen');
  const gotoGoalsScreen = () => navigation.navigate('GoalsScreen');

  // View --------------------------------
  return (
    <View style={styles.container}>
      <ButtonTray>
        <Button
          label='Profile'
          icon={<Icons.Profile />}
          onClick={gotoProfileScreen}
        />
      </ButtonTray>
      <ButtonTray>
        <Button label='Goals' icon={<Icons.Star />} onClick={gotoGoalsScreen} />
      </ButtonTray>
      <ButtonTray>
        <Button
          label='Theme'
          icon={<Icons.Paint onClick={gotoProfileScreen} />}
        />
      </ButtonTray>
      <ButtonTray>
        <Button label='Night mode' icon={<Icons.Moon />} />
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

export default SettingsView;
