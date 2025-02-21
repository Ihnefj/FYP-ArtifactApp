import { StyleSheet, View } from 'react-native';
import Icons from '../../UI/Icons';
import { Button, ButtonTray } from '../../UI/Button';

const HelpView = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  const gotoFAQScreen = () => navigation.navigate('FAQScreen');
  const gotoWalkthroughScreen = () => navigation.navigate('WalkthroughScreen');

  // View --------------------------------
  return (
    <View style={styles.container}>
      <ButtonTray>
        <Button label='FAQ' icon={<Icons.Question />} onClick={gotoFAQScreen} />
      </ButtonTray>
      <ButtonTray>
        <Button
          label='Walkthrough'
          icon={<Icons.Map />}
          onClick={gotoWalkthroughScreen}
        />
      </ButtonTray>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15
  }
});

export default HelpView;
