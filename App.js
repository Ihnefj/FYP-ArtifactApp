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
import LogoutScreen from './src/components/screens/drawerscreens/signscreens/LogOutScreen.js';
import { TouchableOpacity, View } from 'react-native';
import { useCallback, useState } from 'react';
import { MealsProvider, useMeals } from './src/contexts/MealsContext';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { WeightProvider } from './src/contexts/WeightContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { CustomFoodsProvider } from './src/contexts/CustomFoodsContext';
import CustomFoodScreen from './src/components/screens/foodscreens/CustomFoodScreen.js';

registerRootComponent(App);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const DrawerButton = ({ navigation }) => {
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

const useMealSync = () => {
  const { syncLocalToFirebase } = useMeals();
  const [isSyncing, setIsSyncing] = useState(false);

  const syncMeals = useCallback(
    async (userId) => {
      if (!userId || isSyncing) return;
      try {
        setIsSyncing(true);
        await syncLocalToFirebase(userId);
      } catch (error) {
        console.error('Error syncing meals:', error);
      } finally {
        setIsSyncing(false);
      }
    },
    [isSyncing, syncLocalToFirebase]
  );

  return { syncMeals, isSyncing };
};

function InnerApp() {
  const { syncMeals } = useMealSync();

  const handleUserLogin = useCallback(
    async (user) => {
      if (user) {
        await syncMeals(user.uid);
      }
    },
    [syncMeals]
  );

  return (
    <AuthProvider onUserLogin={handleUserLogin}>
      <GoalsProvider>
        <WeightProvider>
          <ProfileProvider>
            <CustomFoodsProvider>
              <Drawer.Navigator
                screenOptions={({ navigation }) => ({
                  drawerLabelStyle: { color: '#C4C3D0' },
                  drawerActiveTintColor: '#DCD6F7',
                  drawerActiveBackgroundColor: '#F4F2FF',
                  drawerType: 'front',
                  swipeEnabled: true,
                  swipeEdgeWidth: 100,
                  swipeMinDistance: 3,
                  overlayColor: '#00000080',
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
                  name='Sign in / Register'
                  component={SignStack}
                />
                <Drawer.Screen
                  options={{
                    drawerIcon: () => <Icons.Signout />,
                    headerTintColor: '#665679',
                    headerShown: false
                  }}
                  name='Log out'
                  component={LogoutScreen}
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
            </CustomFoodsProvider>
          </ProfileProvider>
        </WeightProvider>
      </GoalsProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <NavigationContainer>
      <MealsProvider>
        <InnerApp />
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

      <Stack.Screen
        name='CustomFoodScreen'
        component={CustomFoodScreen}
        options={{ title: 'My Foods' }}
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

      <Stack.Screen
        options={{
          headerTitle: ' '
        }}
        name='ForgotScreen'
        component={ForgotScreen}
      />
    </Stack.Navigator>
  );
};

export const CustomFoodStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='CustomFoodScreen'
      screenOptions={{
        headerStyle: { backgroundColor: '#665679' },
        headerTintColor: 'white'
      }}
    >
      <Stack.Screen
        name='CustomFoodScreen'
        component={CustomFoodScreen}
        options={{ title: 'My Foods' }}
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
        component={CustomFoodStack}
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
