import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './Home';
import Login from './Login';
const MainScreen = () => {
    const Stack = createStackNavigator();

    return (

        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainScreen
