import { StyleSheet, View } from 'react-native';
import Icons from '../../UI/Icons';
import { Button, ButtonTray } from '../../UI/Button';

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
  }
});

export default SettingsView;
