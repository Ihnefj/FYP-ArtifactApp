import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Alert } from 'react-native';
import { customFoods } from '../data/customFoods';
import { localSettings } from '../data/localSettings';
import { userSettings } from '../data/userSettings';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
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

          const hasLocalData =
            localFoods.length > 0 || localProfile || localGoals;

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
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error in AuthProvider:', error);
      setLoading(false);
      return () => {};
    }
  }, [previousUser]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider');
    return { user: null, loading: false };
  }
  return context;
};

export default AuthContext;
