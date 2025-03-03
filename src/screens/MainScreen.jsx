import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

import {Home} from './Home';
import {AddMedicine} from './AddMedicine';  
import {Donations} from './Donations';
const MainScreen = () => {
    const Stack = createStackNavigator();

    return (
        <PaperProvider>

    <NavigationContainer>
        <Stack.Navigator initialRouteName="Donations">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddMedicine" component={AddMedicine} />
            <Stack.Screen name="Donations" component={Donations} />
        </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>

  )
}

export default MainScreen
