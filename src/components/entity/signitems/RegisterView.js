import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import Icons from '../../UI/Icons';
import { Button, ButtonTray } from '../../UI/Button';
import { useState, useEffect } from 'react';
import Form from '../../UI/Form';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '../../../FirebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const RegisterView = ({ navigation }) => {
  // Initialisations ---------------------
  // State -------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    let timeoutId;
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);

  // Handlers ----------------------------
  const gotoSignInScreen = () => navigation.navigate('SignInScreen');

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name
      });

      let hasNavigated = false;

      try {
        await Promise.race([
          setDoc(doc(db, 'users', userCredential.user.uid), {
            name: name,
            email: email,
            createdAt: serverTimestamp(),
            role: 'user'
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout')), 8000)
          )
        ]);
      } catch (firestoreError) {}

      try {
        await auth.signOut();
      } catch (signOutError) {}

      setTimeout(() => {
        if (!hasNavigated) {
          hasNavigated = true;

          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Sign in',
                state: {
                  routes: [{ name: 'SignInScreen' }]
                }
              }
            ]
          });
        }
      }, 500);
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage =
            'This email is already registered. Please use a different email or sign in.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Please choose a stronger password.';
          break;
      }

      Alert.alert('Registration Error', errorMessage);
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

      <View style={styles.formContainer}>
        <Form.InputText
          label='Confirm Password'
          value={confirmPassword}
          onChange={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <ButtonTray>
        <Button
          label={loading ? 'Creating Account...' : 'Register'}
          icon={loading ? <ActivityIndicator color='#fff' /> : <Icons.Signin />}
          onClick={handleRegister}
          disabled={loading}
        />
      </ButtonTray>

      <Text style={styles.dimText}>Already have an account?</Text>

      <ButtonTray>
        <Button
          label='Sign in'
          icon={<Icons.Signin />}
          onClick={gotoSignInScreen}
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
  dimText: {
    marginTop: 10,
    color: '#C4C3D0',
    textAlign: 'center'
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});

export default RegisterView;
