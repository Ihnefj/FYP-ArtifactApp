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
import ProgressScreen from './src/components/screens/ProgressScreen.js';
import BarcodeScreen from './src/components/screens/BarcodeScreen.js';
import FoodScreen from './src/components/screens/FoodScreen.js';
import Icons from './src/components/UI/Icons';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { registerRootComponent } from 'expo';
import { GoalsProvider } from './src/contexts/GoalsContext';
import HelpScreen from './src/components/screens/drawerscreens/helpscreens/HelpScreen.js';
import FAQScreen from './src/components/screens/drawerscreens/helpscreens/FAQScreen.js';
import WalkthroughScreen from './src/components/screens/drawerscreens/helpscreens/WalkthroughScreen.js';

registerRootComponent(App);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <GoalsProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerLabelStyle: { color: '#C4C3D0' },
            drawerActiveTintColor: '#DCD6F7',
            drawerActiveBackgroundColor: '#F4F2FF'
          }}
        >
          <Drawer.Screen
            options={{
              drawerIcon: () => <Icons.Home />,
              headerTintColor: '#665679'
            }}
            name='Home'
            component={BottomTabNavigator}
          />
          <Drawer.Screen
            options={{
              drawerIcon: () => <Icons.Settings />,
              headerTintColor: '#665679'
            }}
            name='Settings'
            component={SettingsStack}
          />
          <Drawer.Screen
            options={{
              drawerIcon: () => <Icons.Signin />,
              headerTintColor: '#665679'
            }}
            name='Sign in'
            component={SettingsStack}
          />
          <Drawer.Screen
            options={{
              drawerIcon: () => <Icons.Book />,
              headerTintColor: '#665679'
            }}
            name='Learn nutrition'
            component={SettingsStack}
          />
          <Drawer.Screen
            options={{
              drawerIcon: () => <Icons.Help />,
              headerTintColor: '#665679'
            }}
            name='Help'
            component={HelpStack}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </GoalsProvider>
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
        headerStyle: { backgroundColor: '#665679' },
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
        headerStyle: { backgroundColor: '#665679' },
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

export const HelpStack = () => {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <Stack.Navigator
      initialRouteName='HelpScreen'
      screenOptions={{
        headerStyle: { backgroundColor: '#665679' },
        headerTintColor: 'white'
      }}
    >
      <Stack.Screen
        name='HelpScreen'
        component={HelpScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='FAQScreen'
        component={FAQScreen}
        options={{ title: 'FAQ' }}
      />

      <Stack.Screen
        name='WalkthroughScreen'
        component={WalkthroughScreen}
        options={{ title: 'Walkthrough' }}
      />
    </Stack.Navigator>
  );
};

function BottomTabNavigator() {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#DCD6F7',
        tabBarInactiveTintColor: '#665679',
        tabBarStyle: {
          backgroundColor: '#F4F2FF',
          borderTopWidth: 0,
          elevation: 0
        }
      }}
    >
      <Tab.Screen
        name='HomeTab'
        component={FoodStack}
        options={{
          tabBarIcon: () => <Icons.Home />,
          headerShown: false,
          title: 'Home'
        }}
      />
      <Tab.Screen
        name='Food'
        component={FoodScreen}
        options={{ tabBarIcon: () => <Icons.Food />, headerShown: false }}
      />
      <Tab.Screen
        name='Progress'
        component={ProgressScreen}
        options={{ tabBarIcon: () => <Icons.Progress />, headerShown: false }}
      />
      <Tab.Screen
        name='Scanner'
        component={BarcodeScreen}
        options={{ tabBarIcon: () => <Icons.Scanner />, headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default App;
