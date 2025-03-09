import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import {AddMedicine} from './AddMedicine';  
import { Donations } from './Donations';
import { ProfilePage } from './Profile';
import {Home} from './Home';
import Login from './Login';
import { RegisterPage } from './RegisterPage';
import {RequestMedicine} from './RequestMedicine';
import { Needs } from './Needs';
const MainScreen = () => {
  const Stack = createStackNavigator();

    return (

        <PaperProvider>

    
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Home" component={Home} />

            <Stack.Screen name="AddMedicine" component={AddMedicine} />
            <Stack.Screen name="Donations" component={Donations} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="RegisterPage" component={RegisterPage} />
            <Stack.Screen name="ProfilePage" component={ProfilePage} />
            <Stack.Screen name="RequestMedicine" component={RequestMedicine} />
            <Stack.Screen name="Needs" component={Needs} />
        </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>


  )
}

export default MainScreen;
