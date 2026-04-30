import {
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';

import routers from './router';
import { setupRequestSubscribers, subscribeRouteRedirect } from './utils/request';
const RootStack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

const App: React.FC = () => {
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
          {routers.map((item) => (
            <RootStack.Screen
              key={item.name}
              component={item.component}
              name={item.name}
              options={{
                ...(item.options ?? {}),
                // 页面级别控制：默认关闭，只有显式开启的页面才显示顶部导航栏
                headerShown: item.showHeader ?? false,
              }}
            />
          ))}
        </RootStack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
};

export default App;
