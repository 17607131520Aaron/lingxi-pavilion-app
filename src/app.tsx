import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';

import routers from './router';
const RootStack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <RootSiblingParent>
      <NavigationContainer>
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
