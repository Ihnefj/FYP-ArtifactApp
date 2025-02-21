import { StyleSheet, View, Text } from 'react-native';
import Icons from '../../UI/Icons';
import { Button, ButtonTray } from '../../UI/Button';
import { useState } from 'react';
import Form from '../../UI/Form';

const RegisterView = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  const gotoSignInScreen = () => navigation.navigate('SignInScreen');
  const gotoHomeScreen = () => {
    navigation.navigate('Home', {
      screen: 'HomeTab',
      initial: false
    });
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // View --------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Form.InputText
          label='Email'
          value={email}
          onChange={setEmail}
          keyboardType='default'
        />
      </View>
      <View style={styles.formContainer}>
        <Form.InputText
          label='Password'
          value={password}
          onChange={setPassword}
          keyboardType='default'
        />
      </View>
      <ButtonTray>
        <Button label='Register' onClick={gotoHomeScreen} />
      </ButtonTray>
      <Text style={styles.dimText}>Already have an account?</Text>
      <ButtonTray>
        <Button
          label='Sign in'
          icon={<Icons.Signin />}
          onClick={gotoSignInScreen}
        />
      </ButtonTray>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15
  },
  formContainer: {
    padding: 5
  },
  dimText: {
    marginTop: 10,
    color: '#C4C3D0'
  }
});

export default RegisterView;
