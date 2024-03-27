import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import Bookeditem from './Bookeditem';
import { useSelector } from 'react-redux';
import { shifturl } from './Constants';



const Myshifts = () => {
  const [shiftsByDate, setShiftsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);
  const counter = useSelector(state => state.counter.count);
  const fetchShifts = () => {
    fetch(`${shifturl}/shifts`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
      
        const shiftsGroupedByDate = {};
        data.forEach(shift => {
          const date = new Date(shift.startTime);
          const dateString = date.toDateString();
          if (!shiftsGroupedByDate[dateString]) {
            shiftsGroupedByDate[dateString] = [];
          }
          if (shift.booked) {
            shiftsGroupedByDate[dateString].push(shift);
          }
        });
  
        setShiftsByDate(shiftsGroupedByDate);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShifts();
  }, [reload,counter]);

  

  
  
  const calculateWorkingHours = shifts => {
    let totalHours = 0;
    shifts.forEach(shift => {
      const startTime = new Date(shift.startTime);
      const endTime = new Date(shift.endTime);
      const duration = (endTime - startTime) / (1000 * 60 * 60); 
      totalHours += duration;
    });
    return totalHours;
  };

  

const formatDateString = dateString => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  }
};

  const reloadData = () => {
    
    setReload(reload => !reload);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
       <View style={{height:60, alignItems:'center',justifyContent:'center',backgroundColor: "#f1f4f8",marginBottom:20}}><Text style={{fontSize:23,fontWeight:'bold', color: "#4F6C92"}}>Your Shifts</Text></View>

      <FlatList
        style={{ width: '100%' }}
        data={Object.keys(shiftsByDate)}
        renderItem={({ item }) => {
          if (shiftsByDate[item].length === 0) {
            return null;
          }
          return (
            <View>
             <Text style={styles.header}>
  <Text style={{ fontWeight: 'bold' }}>{formatDateString(item)}</Text> - {shiftsByDate[item].length} shifts - {calculateWorkingHours(shiftsByDate[item])} hours
</Text>

              <FlatList
                data={shiftsByDate[item]}
                renderItem={({ item }) => <Bookeditem shift={item} reloadData={reloadData} />}
                keyExtractor={shift => shift.id}
              />
            </View>
          );
        }}
        keyExtractor={dateString => dateString}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: '100%', 
    backgroundColor:'white',
   
  },
  header: {
    fontSize: 14,
    fontWeight: 'normal',
    width: '100%',
    marginBottom: 10,
    fontWeight:'500',
    color:"#4F6C92",
    marginHorizontal:20
    
  },
});

export default Myshifts;
