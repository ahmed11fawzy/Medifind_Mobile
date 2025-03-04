import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './Home';
import { RegisterPage } from './RegisterPage';
const MainScreen = () => {
    const Stack = createStackNavigator();

    return (
    
    <NavigationContainer>
        <Stack.Navigator initialRouteName="RegisterPage">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="RegisterPage" component={RegisterPage} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainScreen
