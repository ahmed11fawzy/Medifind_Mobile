import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import {AddMedicine} from './AddMedicine';  
import {Donations} from './Donations';

import {Home} from './Home';
import Login from './Login';

const MainScreen = () => {
    const Stack = createStackNavigator();

    return (
        <PaperProvider>
    
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddMedicine" component={AddMedicine} />
            <Stack.Screen name="Donations" component={Donations} />
            <Stack.Screen name="Login" component={Login} />

        </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>

  )
}

export default MainScreen
