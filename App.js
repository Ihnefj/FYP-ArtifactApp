import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodListScreen from './src/components/screens/foodscreens/FoodListScreen.js';
import FoodAddScreen from './src/components/screens/foodscreens/FoodAddScreen.js';
import FoodViewScreen from './src/components/screens/foodscreens/FoodViewScreen.js';
import FoodModifyScreen from './src/components/screens/foodscreens/FoodModifyScreen.js';
import FoodOverviewScreen from './src/components/screens/foodscreens/FoodOverviewScreen.js';
import SettingsScreen from './src/components/screens/drawerscreens/settingsscreens/SettingsScreen';
import ProfileScreen from './src/components/screens/drawerscreens/settingsscreens/ProfileScreen';
import GoalsScreen from './src/components/screens/drawerscreens/settingsscreens/GoalsScreen';
import Icons from './src/components/UI/Icons';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { registerRootComponent } from 'expo';

registerRootComponent(App);

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          options={{
            drawerIcon: () => <Icons.Home />
          }}
          name='Home'
          component={FoodStack}
        />
        <Drawer.Screen
          options={{
            drawerIcon: () => <Icons.Settings />
          }}
          name='Settings'
          component={SettingsStack}
        />
        <Drawer.Screen
          options={{
            drawerIcon: () => <Icons.Signin />
          }}
          name='Sign in'
          component={SettingsStack}
        />
        <Drawer.Screen
          options={{
            drawerIcon: () => <Icons.Book />
          }}
          name='Learn nutrition'
          component={SettingsStack}
        />
        <Drawer.Screen
          options={{
            drawerIcon: () => <Icons.Help />
          }}
          name='Help'
          component={SettingsStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export const FoodStack = () => {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <Stack.Navigator
      initialRouteName='FoodListScreen'
      screenOptions={{
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: 'white'
      }}
    >
      <Stack.Screen
        name='FoodListScreen'
        component={FoodListScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='FoodAddScreen'
        component={FoodAddScreen}
        options={{ title: 'Add food' }}
      />

      <Stack.Screen
        name='FoodViewScreen'
        component={FoodViewScreen}
        options={{ title: 'View food' }}
      />

      <Stack.Screen
        name='FoodModifyScreen'
        component={FoodModifyScreen}
        options={{ title: 'Modify food' }}
      />

      <Stack.Screen
        name='FoodOverviewScreen'
        component={FoodOverviewScreen}
        options={{ title: 'Add to meal' }}
      />
    </Stack.Navigator>
  );
};

export const SettingsStack = () => {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <Stack.Navigator
      initialRouteName='SettingsScreen'
      screenOptions={{
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: 'white'
      }}
    >
      <Stack.Screen
        name='SettingsScreen'
        component={SettingsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='ProfileScreen'
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />

      <Stack.Screen
        name='GoalsScreen'
        component={GoalsScreen}
        options={{ title: 'Goals' }}
      />
    </Stack.Navigator>
  );
};

export default App;
