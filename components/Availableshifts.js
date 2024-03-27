import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Helsinki from './Availableshifts/Helsinki';
import Tampere from './Availableshifts/Tampere';
import Turku from './Availableshifts/Turke';
import { shifturl } from './Constants';
const Availableshifts = () => {
    const Tab = createMaterialTopTabNavigator();
    const [cityShiftCounts, setCityShiftCounts] = useState({});
  
    useEffect(() => {
      fetch(`${shifturl}/shifts`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const shiftsByCity = {
            Helsinki: 0,
            Tampere: 0,
            Turku: 0,
          };

          data.forEach(shift => {
            if (shift.area === 'Helsinki') {
              shiftsByCity.Helsinki++;
            } else if (shift.area === 'Tampere') {
              shiftsByCity.Tampere++;
            } else if (shift.area === 'Turku') {
              shiftsByCity.Turku++;
            }
          });

          setCityShiftCounts(shiftsByCity);
        })
        .catch(error => {
          console.error('Fetch Error:', error);
        });
    }, []);
  return (
    <Tab.Navigator screenOptions={{
        headerShown: false ,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 15, 
        },
        tabBarStyle:{
            
            height: 50,
        },
        tabBarActiveTintColor: "#004FB4",
        tabBarInactiveTintColor: "#A4B8D3",
       
       
      }}>
      <Tab.Screen name="Helsinki" component={Helsinki}  options={{ tabBarLabel: `Helsinki(${cityShiftCounts.Helsinki})` }} />
      <Tab.Screen name="Tampere" component={Tampere} options={{ tabBarLabel: `Helsinki(${cityShiftCounts.Tampere})` }} />
      <Tab.Screen name="Turku" component={Turku} options={{ tabBarLabel: `Turku(${cityShiftCounts.Turku})` }} />
    </Tab.Navigator>
  )
}

export default Availableshifts