import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import {AddMedicine} from './AddMedicine';
import { Donations } from './Donations';
import { ProfilePage } from './Profile';
import {Home} from './Home';
import Login from './Login';
import { RegisterPage } from './RegisterPage';
import {DrawerContent} from '../components/MyDrawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainScreen = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator 
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              width: '80%',
            },
            drawerType: 'front',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            gestureEnabled: true,
            swipeEnabled: true,
            animationEnabled: true,
            detachInactiveScreens: false,
          }}
        >
          <Drawer.Screen 
            name="Main"
            options={{
              gestureEnabled: true,
              swipeEnabled: true,
            }}
          >
            {() => (
              <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={{
                  gestureEnabled: false,
                  gestureDirection: 'horizontal',
                }}
              >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="AddMedicine" component={AddMedicine} />
                <Stack.Screen name="Donations" component={Donations} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="RegisterPage" component={RegisterPage} />
                <Stack.Screen name="ProfilePage" component={ProfilePage} />
              </Stack.Navigator>
            )}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default MainScreen;
