import React from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import routers from './router';
const RootStack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <RootStack.Navigator>
          {routers.map(item => (
            <RootStack.Screen
              key={item.name}
              name={item.name}
              component={item.component}
              options={item.options}
            />
          ))}
        </RootStack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
};

export default App;
