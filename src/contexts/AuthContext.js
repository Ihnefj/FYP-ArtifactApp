import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../FirebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { Alert } from 'react-native';
import { customFoods } from '../data/customFoods';
import { localSettings } from '../data/localSettings';
import { userSettings } from '../data/userSettings';
import { weightData } from '../data/weightData';

// Initialisations ---------------------
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// State -------------------------------

// Handlers ----------------------------
export const AuthProvider = ({ children, onUserLogin }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousUser, setPreviousUser] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (!previousUser && currentUser) {
          const localFoods = await customFoods.getLocalFoods();
          const localProfile = await localSettings.getProfile();
          const localGoals = await localSettings.getGoals();
          const localWeightEntries = await weightData.getLocalWeightEntries();

          const hasLocalData =
            localFoods.length > 0 ||
            localProfile ||
            localGoals ||
            localWeightEntries.length > 0;

          if (hasLocalData) {
            Alert.alert(
              'Sync Local Data',
              'You have data stored locally. Would you like to sync it with your account?',
              [
                {
                  text: 'No, keep it local',
                  style: 'cancel'
                },
                {
                  text: 'Yes, sync everything',
                  onPress: async () => {
                    try {
                      if (localFoods.length > 0) {
                        await customFoods.syncLocalToFirebase(currentUser.uid);
                      }
                      if (localProfile) {
                        await userSettings.saveProfile(
                          currentUser.uid,
                          localProfile
                        );
                      }
                      if (localGoals) {
                        await userSettings.saveGoals(
                          currentUser.uid,
                          localGoals
                        );
                      }
                      if (localWeightEntries.length > 0) {
                        await weightData.syncLocalToFirebase(currentUser.uid);
                      }
                      await localSettings.clearLocalSettings();

                      Alert.alert(
                        'Success',
                        'Your data has been synced to your account.'
                      );
                    } catch (error) {
                      console.error('Error syncing data:', error);
                      Alert.alert(
                        'Error',
                        'Failed to sync your data. Please try again later.'
                      );
                    }
                  }
                }
              ]
            );
          }
        }

        setPreviousUser(currentUser);
        setUser(currentUser);
        setLoading(false);

        if (currentUser && onUserLogin) {
          onUserLogin(currentUser);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error in AuthProvider:', error);
      setLoading(false);
      return () => {};
    }
  }, [previousUser, onUserLogin]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  // View --------------------------------
  const value = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
