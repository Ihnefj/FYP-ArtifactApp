import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import Icons from '../../UI/Icons';
import { Button, ButtonTray } from '../../UI/Button';
import { useState } from 'react';
import Form from '../../UI/Form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../FirebaseConfig';

const SignView = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handlers ----------------------------
  const gotoRegisterScreen = () => navigation.navigate('RegisterScreen');
  const gotoForgotScreen = () => navigation.navigate('ForgotScreen');

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const gotoHomeScreen = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home', { screen: 'HomeTab', initial: false });
    } catch (error) {
      console.log('Sign in error code:', error.code);

      let errorMessage = 'An error occurred during sign in';

      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Incorrect email or password';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // View --------------------------------
  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.formContainer}>
        <Form.InputText
          label='Email'
          value={email}
          onChange={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          editable={!loading}
        />
      </View>

      <View style={styles.formContainer}>
        <Form.InputText
          label='Password'
          value={password}
          onChange={setPassword}
          secureTextEntry
          editable={!loading}
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
          label={loading ? 'Signing in...' : 'Sign in'}
          icon={loading ? <ActivityIndicator color='#fff' /> : <Icons.Signin />}
          onClick={gotoHomeScreen}
          disabled={loading}
        />
      </ButtonTray>

      <ButtonTray>
        <Button
          label='Register'
          onClick={gotoRegisterScreen}
          disabled={loading}
        />
      </ButtonTray>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
    padding: 20
  },
  formContainer: {
    padding: 5
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginRight: 10,
    color: '#C4C3D0',
    marginBottom: 20
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});

export default SignView;
