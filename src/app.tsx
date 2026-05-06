import {
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';

import MainTabs from './app/MainTabs';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import useAuthStore from './stores/useAuthStore';
import { setupRequestSubscribers, subscribeRouteRedirect } from './utils/request';

const RootStack = createNativeStackNavigator();

const navigationRef = createNavigationContainerRef();

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const teardownRequestSubscribers = setupRequestSubscribers();
    const unsubscribe = subscribeRouteRedirect(({ routeName, params }) => {
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.navigate({
            name: routeName,
            params,
          }),
        );
      }
    });
    return () => {
      unsubscribe();
      teardownRequestSubscribers();
    };
  }, []);

  return (
    <RootSiblingParent>
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <RootStack.Screen component={MainTabs} name='main' />
              <RootStack.Screen component={Profile} name='profile' />
            </>
          ) : (
            <>
              <RootStack.Screen component={Login} name='login' />
              <RootStack.Screen component={Register} name='register' />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
};

export default App;
