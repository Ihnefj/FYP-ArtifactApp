import { StyleSheet, View, Text } from 'react-native';
import Icons from '../../UI/Icons';
import { Button, ButtonTray } from '../../UI/Button';
import { useState } from 'react';
import Form from '../../UI/Form';

const SignView = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  const gotoRegisterScreen = () => navigation.navigate('RegisterScreen');
  const gotoHomeScreen = () => {
    navigation.navigate('Home', {
      screen: 'HomeTab',
      initial: false
    });
  };
  const gotoForgotScreen = () => navigation.navigate('ForgotScreen');
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
      <Text
        style={[styles.forgotContainer, { textDecorationLine: 'underline' }]}
        onPress={gotoForgotScreen}
      >
        Forgot password?
      </Text>

      <ButtonTray>
        <Button
          label='Sign in'
          icon={<Icons.Signin />}
          onClick={gotoHomeScreen}
        />
      </ButtonTray>

      <ButtonTray>
        <Button label='Register' onClick={gotoRegisterScreen} />
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
  forgotContainer: {
    alignSelf: 'flex-end',
    marginRight: 10,
    color: '#C4C3D0',
    marginBottom: 20
  }
});

export default SignView;
