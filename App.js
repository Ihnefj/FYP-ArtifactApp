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
import ProgressScreen from './src/components/screens/tabscreens/progscreens/ProgressScreen.js';
import BarcodeScreen from './src/components/screens/tabscreens/BarcodeScreen.js';
import FoodScreen from './src/components/screens/tabscreens/FoodScreen.js';
import Icons from './src/components/UI/Icons';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { registerRootComponent } from 'expo';
import { GoalsProvider } from './src/contexts/GoalsContext';
import HelpScreen from './src/components/screens/drawerscreens/helpscreens/HelpScreen.js';
import FAQScreen from './src/components/screens/drawerscreens/helpscreens/FAQScreen.js';
import WalkthroughScreen from './src/components/screens/drawerscreens/helpscreens/WalkthroughScreen.js';
import LearnScreen from './src/components/screens/drawerscreens/learnscreens/LearnScreen.js';
import SignInScreen from './src/components/screens/drawerscreens/signscreens/SignInScreen.js';
import RegisterScreen from './src/components/screens/drawerscreens/signscreens/RegisterScreen.js';
import ForgotScreen from './src/components/screens/drawerscreens/signscreens/ForgotScreen.js';
import { TouchableOpacity, View } from 'react-native';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { MealsProvider } from './src/contexts/MealsContext';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { WeightProvider } from './src/contexts/WeightContext';

registerRootComponent(App);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const DrawerButton = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, [])
  );

  return (
    <TouchableOpacity
      style={{
        padding: 15,
        marginLeft: 5,
        flexDirection: 'column',
        gap: 4
      }}
      activeOpacity={0.7}
      onPress={() => navigation.openDrawer()}
    >
      <View style={{ width: 20, height: 2, backgroundColor: '#665679' }} />
      <View style={{ width: 20, height: 2, backgroundColor: '#665679' }} />
      <View style={{ width: 20, height: 2, backgroundColor: '#665679' }} />
    </TouchableOpacity>
  );
};

function App() {
  return (
    <NavigationContainer>
      <MealsProvider>
        <GoalsProvider>
          <WeightProvider>
            <ProfileProvider>
              <Drawer.Navigator
                screenOptions={({ navigation }) => ({
                  drawerLabelStyle: { color: '#C4C3D0' },
                  drawerActiveTintColor: '#DCD6F7',
                  drawerActiveBackgroundColor: '#F4F2FF',
                  drawerType: 'front',
                  swipeEnabled: true,
                  swipeEdgeWidth: 100,
                  swipeMinDistance: 3,
                  overlayColor: 'rgba(0,0,0,0.5)',
                  drawerStyle: {
                    width: '70%'
                  },
                  gestureHandlerProps: {
                    hitSlop: { right: 15, left: 15 },
                    activeOffsetX: [-5, 5],
                    failOffsetY: [-20, 20],
                    minDist: 5,
                    minVelocity: 0.3
                  },
                  headerLeft: () => <DrawerButton navigation={navigation} />
                })}
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
                  component={SignStack}
                />
                <Drawer.Screen
                  options={{
                    drawerIcon: () => <Icons.Book />,
                    headerTintColor: '#665679'
                  }}
                  name='Learn nutrition'
                  component={LearnStack}
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
            </ProfileProvider>
          </WeightProvider>
        </GoalsProvider>
      </MealsProvider>
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

export const LearnStack = () => {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <Stack.Navigator
      initialRouteName='LearnScreen'
      screenOptions={{
        headerStyle: { backgroundColor: '#665679' },
        headerTintColor: 'white'
      }}
    >
      <Stack.Screen
        name='LearnScreen'
        component={LearnScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export const SignStack = () => {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <Stack.Navigator
      initialRouteName='SignInScreen'
      screenOptions={{
        headerStyle: { backgroundColor: '#665679' },
        headerTintColor: 'white'
      }}
    >
      <Stack.Screen
        name='SignInScreen'
        component={SignInScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='RegisterScreen'
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name='ForgotScreen' component={ForgotScreen} />
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
