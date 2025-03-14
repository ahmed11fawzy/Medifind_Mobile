import 'react-native-gesture-handler';
import React, { lazy, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/RootColor';
import { DrawerContent } from '../components/MyDrawer';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ROLES } from '../hooks/useAuth';

// Loading component for Suspense
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={Colors.mainColor} />
  </View>
);

// Lazy loaded components
const Home = lazy(() => import('./Home').then(module => ({ default: module.Home })));
const AddMedicine = lazy(() => import('./AddMedicine').then(module => ({ default: module.AddMedicine })));
const Donations = lazy(() => import('./Donations').then(module => ({ default: module.Donations })));
const Login = lazy(() => import('./Login'));
const RegisterPage = lazy(() => import('./RegisterPage').then(module => ({ default: module.RegisterPage })));
const ProfilePage = lazy(() => import('./Profile').then(module => ({ default: module.ProfilePage })));
const RequestMedicine = lazy(() => import('./RequestMedicine').then(module => ({ default: module.RequestMedicine })));
const Needs = lazy(() => import('./Needs').then(module => ({ default: module.Needs })));
const Update = lazy(() => import('./Update').then(module => ({ default: module.Update })));
const RequestsReview = lazy(() => import('./RequestsReview').then(module => ({ default: module.RequestsReview })));
const OffersReview= lazy(() => import('./OffersReview').then(module => ({ default: module.OffersReview })));
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
                  swipeEnabled: true,
                  gestureDirection: 'horizontal',
                }}
              >
                {/* Public Routes */}
                <Stack.Screen
                  name="Login"
                  options={{ headerShown: false }}
                >
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <Login {...props} />
                    </Suspense>
                  )}
                </Stack.Screen>

                <Stack.Screen name="RegisterPage" options={{ headerShown: false }} >
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <RegisterPage {...props} />
                    </Suspense>
                  )}
                </Stack.Screen>

                {/* Protected Routes - All authenticated users */}
                <Stack.Screen name="Home">
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ProtectedRoute
                        component={Home}
                        allowedRoles={[ROLES.USER, ROLES.DOCTOR]}
                        {...props}
                      />
                    </Suspense>
                  )}
                </Stack.Screen>

                <Stack.Screen name="AddMedicine">
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ProtectedRoute
                        component={AddMedicine}
                        allowedRoles={[ROLES.USER]}
                        {...props}
                      />
                    </Suspense>
                  )}
                </Stack.Screen>

                <Stack.Screen name="Donations">
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ProtectedRoute
                        component={Donations}
                        allowedRoles={[ROLES.USER]}
                        {...props}
                      />
                    </Suspense>
                  )}
                </Stack.Screen>

                <Stack.Screen name="ProfilePage">
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ProtectedRoute
                        component={ProfilePage}
                        allowedRoles={[ROLES.USER]}
                        {...props}
                      />
                    </Suspense>
                  )}
                </Stack.Screen>

                <Stack.Screen name="RequestMedicine">
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ProtectedRoute
                        component={RequestMedicine}
                        allowedRoles={[ROLES.USER]}
                        {...props}
                      />
                    </Suspense>
                  )}
                </Stack.Screen>

                <Stack.Screen name="Needs">
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ProtectedRoute
                        component={Needs}
                        allowedRoles={[ROLES.USER]}
                        {...props}
                      />
                    </Suspense>
                  )}
                </Stack.Screen>

                <Stack.Screen name="Update">
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ProtectedRoute
                        component={Update}
                        allowedRoles={[ROLES.USER]}
                        {...props}
                      />
                    </Suspense>
                  )}
                </Stack.Screen>

                {/* Doctor-only routes */}
                <Stack.Screen name="RequestsReview">
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ProtectedRoute
                        component={RequestsReview}
                        allowedRoles={[ROLES.DOCTOR]}
                        {...props}
                      />
                    </Suspense>
                  )}
                </Stack.Screen>
                <Stack.Screen name="OffersReview">
                  {(props) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ProtectedRoute
                        component={OffersReview}
                        allowedRoles={[ROLES.DOCTOR]}
                        {...props}
                      />
                    </Suspense>
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            )}
          </Drawer.Screen>
        </Drawer.Navigator>

      </NavigationContainer>
    </PaperProvider>
  );
};

export default MainScreen;
