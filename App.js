import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Myshifts from './components/Myshifts';
import Availableshifts from './components/Availableshifts';

import rootReducer from './redux/rootreducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

export default function App() {
  const Tab = createBottomTabNavigator();


  const store = configureStore({reducer: rootReducer});

  return (
    <Provider store={store}>
    <NavigationContainer> 
      <StatusBar style="auto" hidden={true} />
      <Tab.Navigator screenOptions={{
          headerShown: false ,
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 15, 
          },
          tabBarStyle:{
              alignItems:"center",
              paddingBottom:10,
              height: 60,
          },
          tabBarActiveTintColor: "#004FB4",
          tabBarInactiveTintColor: "#4F6C92",
          
          tabBarIcon: () => null, // Remove icons
        }}>
        <Tab.Screen name="My shifts" component={Myshifts} />
        <Tab.Screen name="Available shifts" component={Availableshifts} />
      </Tab.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%'
  },
});
