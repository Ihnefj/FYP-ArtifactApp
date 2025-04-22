import { useState } from 'react';
import Screen from '../../../layout/Screen';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '../../../../FirebaseConfig';
import Form from '../../../UI/Form';
import { Button, ButtonTray } from '../../../UI/Button';

const ForgotScreen = () => {
  // Initialisations -------------------------

  // State -----------------------------------
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handlers --------------------------------
  const handleReset = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        setError('This email is not registered with us');
        setLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Check your email to reset your password.');
    } catch (error) {
      console.error('Reset failed:', error.message);

      if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // View ------------------------------------
  return (
    <Screen>
      <View style={styles.container}>
        {error ? (
          <View>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

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

        <ButtonTray>
          <Button
            label={loading ? 'Sending...' : 'Reset Password'}
            onClick={handleReset}
            disabled={loading}
          />
        </ButtonTray>
      </View>
    </Screen>
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
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});

export default ForgotScreen;
