import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../FirebaseConfig';
import { useCallback } from 'react';

const LogOutScreen = ({ navigation }) => {
  // Initialisations -------------------------

  // State -----------------------------------
  useFocusEffect(
    useCallback(() => {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => navigation.goBack()
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut(auth);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Sign in' }]
                });
              } catch (error) {
                Alert.alert('Error', 'Failed to log out: ' + error.message);
                navigation.goBack();
              }
            }
          }
        ],
        { cancelable: false }
      );
    }, [])
  );

  // Handlers --------------------------------

  // View ------------------------------------
  return null;
};

export default LogOutScreen;
