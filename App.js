import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import MainScreen from './src/screens/MainScreen';
import { store } from './src/redux/Store';

export default function App() {
  return (
    <Provider store={store}>
      <MainScreen />
    </Provider>
  );
}


