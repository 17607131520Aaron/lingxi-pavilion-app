import {
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';

import routers from './router';
import { subscribeRouteRedirect } from './utils/request';
const RootStack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

const App: React.FC = () => {
  useEffect(() => {
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
    return unsubscribe;
  }, []);

  return (
    <RootSiblingParent>
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator>
          {routers.map((item) => (
            <RootStack.Screen
              key={item.name}
              component={item.component}
              name={item.name}
              options={item.options}
            />
          ))}
        </RootStack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
};

export default App;
