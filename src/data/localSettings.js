import AsyncStorage from '@react-native-async-storage/async-storage';
import { weightData } from './weightData';

// Initialisations ---------------------
const PROFILE_KEY = '@local_profile';
const GOALS_KEY = '@local_goals';

// State -------------------------------
// Handlers ----------------------------
export const localSettings = {
  async getProfile() {
    try {
      const profile = await AsyncStorage.getItem(PROFILE_KEY);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting local profile:', error);
      return null;
    }
  },

  async saveProfile(profile) {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving local profile:', error);
    }
  },

  async getGoals() {
    try {
      const goals = await AsyncStorage.getItem(GOALS_KEY);
      return goals ? JSON.parse(goals) : null;
    } catch (error) {
      console.error('Error getting local goals:', error);
      return null;
    }
  },

  async saveGoals(goals) {
    try {
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving local goals:', error);
    }
  },

  async clearLocalSettings() {
    try {
      await AsyncStorage.removeItem(PROFILE_KEY);
      await AsyncStorage.removeItem(GOALS_KEY);
      await weightData.clearLocalWeightEntries();
    } catch (error) {
      console.error('Error clearing local settings:', error);
    }
  }
};

// View --------------------------------
