import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';
import AiChat from '~/pages/aiChat';
import Home from '~/pages/Home';
import Mine from '~/pages/Mine';

const Tab = createBottomTabNavigator();

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

const MainTabs = (): React.JSX.Element => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0.3,
          borderTopColor: colors.borderLight,
          backgroundColor: colors.white,
          height: 48,
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
};

const styles = StyleSheet.create({
  // 垂直居中
  tabalignItems: {
    alignItems: 'center',
  },
});

export default MainTabs;
