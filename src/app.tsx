import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';

import colors from './common/colors';
import AiChat from './pages/aiChat';
import Home from './pages/Home';
import Login from './pages/Login';
import Mine from './pages/Mine';
import Profile from './pages/Profile';
import Register from './pages/Register';
import useAuthStore from './stores/useAuthStore';
import { setupRequestSubscribers, subscribeRouteRedirect } from './utils/request';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef();

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }): React.JSX.Element => (
  // eslint-disable-next-line react-native/no-inline-styles
  <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.6 }}>{icon}</Text>
);

const TabLabel = ({ label, focused }: { label: string; focused: boolean }): React.JSX.Element => (
  <Text
    // eslint-disable-next-line react-native/no-inline-styles
    style={{
      fontSize: 10,
      color: focused ? colors.brandPrimary : colors.textSecondary,
      marginTop: 2,
    }}
  >
    {label}
  </Text>
);

const MainTabs = (): React.JSX.Element => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        height: 56,
        borderTopWidth: 0.5,
        borderTopColor: colors.borderLight,
        backgroundColor: colors.white,
      },
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      component={Home}
      name='homeTab'
      options={{
        tabBarIcon: ({ focused }) => (
          <View style={styles.tabalignItems}>
            <TabIcon focused={focused} icon={focused ? '🏠' : '🏡'} />
            <TabLabel focused={focused} label='首页' />
          </View>
        ),
      }}
    />
    <Tab.Screen
      component={AiChat}
      name='aiTab'
      options={{
        tabBarIcon: ({ focused }) => (
          <View style={styles.tabalignItems}>
            <TabIcon focused={focused} icon={focused ? '💬' : '💭'} />
            <TabLabel focused={focused} label='AI对话' />
          </View>
        ),
      }}
    />
    <Tab.Screen
      component={Mine}
      name='mineTab'
      options={{
        tabBarIcon: ({ focused }) => (
          <View style={styles.tabalignItems}>
            <TabIcon focused={focused} icon={focused ? '👤' : '👤'} />
            <TabLabel focused={focused} label='我的' />
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

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

const styles = StyleSheet.create({
  // 垂直居中
  tabalignItems: {
    alignItems: 'center',
  },
});

export default App;
