// import 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Provider as PaperProvider } from 'react-native-paper';
// import {AddMedicine} from './AddMedicine';
// import {Donations} from './Donations';
// import { ProfilePage } from './Profile';

// import {Home} from './Home';
// import Login from './Login';
// import { RegisterPage } from './RegisterPage';

// import {RequestMedicine} from './RequestMedicine';
// import { Needs } from './Needs';
// import { Update} from './Update';
// import {RequestsReview} from './RequestsReview';
// import {DrawerContent} from '../components/MyDrawer';
// import {OffersReview} from './OffersReview';

// const Drawer = createDrawerNavigator();
// const Stack = createStackNavigator();
// const MainScreen = () => {

//   return (
//     <PaperProvider>
//       <NavigationContainer>
//         <Drawer.Navigator
//           drawerContent={(props) => <DrawerContent {...props} />}
//           screenOptions={{
//             headerShown: false,
//             drawerStyle: {
//               width: '80%',
//             },
//             drawerType: 'front',
//             overlayColor: 'rgba(0, 0, 0, 0.5)',
//             gestureEnabled: true,
//             swipeEnabled: true,
//             animationEnabled: true,
//             detachInactiveScreens: false,
//           }}
//         >
//           <Drawer.Screen
//             name="Main"
//             options={{
//               gestureEnabled: true,
//               swipeEnabled: true,
//             }}
//           >
//             {() => (
//               <Stack.Navigator
//                 initialRouteName="Login"
//                 screenOptions={{
//                   gestureEnabled: false,
//                   gestureDirection: 'horizontal',
//                 }}
//               >
//                 <Stack.Screen name="Home" component={Home} />
//                 <Stack.Screen name="AddMedicine" component={AddMedicine} />
//                 <Stack.Screen name="Donations" component={Donations} />
//                 <Stack.Screen name="Login" component={Login} />
//                 <Stack.Screen name="RegisterPage" component={RegisterPage} />
//                 <Stack.Screen name="ProfilePage" component={ProfilePage} />
//                 <Stack.Screen name="RequestMedicine" component={RequestMedicine} />
//                 <Stack.Screen name="Needs" component={Needs} />
//                 <Stack.Screen name="Update" component={Update} />
//                 <Stack.Screen name="RequestsReview" component={RequestsReview} />
//                 <Stack.Screen name="OffersReview" component={OffersReview} />
//               </Stack.Navigator>
//             )}
//           </Drawer.Screen>
//         </Drawer.Navigator>
//       </NavigationContainer>
//     </PaperProvider>
//   );
// };

// export default MainScreen;

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider as PaperProvider } from "react-native-paper";
import { useAuth } from "../hooks/useAuth";

// Import all screen components
import { Home } from "./Home";
import Login from "./Login";
import { RegisterPage } from "./RegisterPage";
import { AddMedicine } from "./AddMedicine";
import { Donations } from "./Donations";
import { ProfilePage } from "./Profile";
import { RequestMedicine } from "./RequestMedicine";
import { Needs } from "./Needs";
import { Update } from "./Update";
import { RequestsReview } from "./RequestsReview";
import { OffersReview } from "./OffersReview";
import { DrawerContent } from "../components/MyDrawer";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Authentication Stack (no drawer)
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="RegisterPage" component={RegisterPage} />
    </Stack.Navigator>
  );
};

// Main App Stack with Drawer
const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: { width: "80%" },
        drawerType: "front",
        overlayColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="AddMedicine" component={AddMedicine} />
      <Drawer.Screen name="Donations" component={Donations} />
      <Drawer.Screen name="ProfilePage" component={ProfilePage} />
      <Drawer.Screen name="RequestMedicine" component={RequestMedicine} />
      <Drawer.Screen name="Needs" component={Needs} />
      <Drawer.Screen name="Update" component={Update} />
      <Drawer.Screen name="RequestsReview" component={RequestsReview} />
      <Drawer.Screen name="OffersReview" component={OffersReview} />
    </Drawer.Navigator>
  );
};

const MainScreen = () => {
  const { user } = useAuth();

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="App" component={AppStack} />
          ) : (
            <Stack.Screen name="Auth" component={AuthStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default MainScreen;
