import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ShiftItem from './ShiftItem'; // Assuming you have ShiftItem component
import { useSelector } from 'react-redux';
import { shifturl } from '../Constants';

const Tampere = () => {
  const [shiftsByDate, setShiftsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);
  const counter = useSelector(state => state.counter.count);
  useEffect(() => {
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
         
            shiftsGroupedByDate[dateString].push(shift);
          
        });
  
     
        Object.keys(shiftsGroupedByDate).forEach(dateString => {
          shiftsGroupedByDate[dateString].forEach(shift => {
            const overlapping = checkForOverlapping(shift, shiftsGroupedByDate[dateString]);
            if(!shift.booked){
            shift.overlapping = overlapping;
            }
          });
        });

        const tampereShiftsGroupedByDate = {};
        Object.keys(shiftsGroupedByDate).forEach(dateString => {
          const tampereShifts = shiftsGroupedByDate[dateString].filter(shift => shift.area === 'Tampere');
          if (tampereShifts.length > 0) {
            tampereShiftsGroupedByDate[dateString] = tampereShifts;
          }
        });

        setShiftsByDate(tampereShiftsGroupedByDate);
       
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        setError(error);
        setLoading(false);
      });
  }, [reload,counter]);
 

  
  

  
const checkForOverlapping = (newShift, shifts) => {
  for (const shift of shifts) {
    if (
      shift.booked && 
      newShift.startTime < shift.endTime &&
      newShift.endTime > shift.startTime  
    ) {
      return true;
    }
  }
  return false;
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
  {formatDateString(item)}
</Text>
              <FlatList
                data={shiftsByDate[item]}
                renderItem={({ item }) => <ShiftItem shift={item} reloadData={reloadData} />}
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
    padding: 20,
    width: '100%', // Ensure the container takes 100% width
    backgroundColor:'white',
   
  },
  header: {
    fontSize: 14,
    fontWeight: 'normal',
    width: '100%',
    marginBottom: 10,
    fontWeight:'500',
    color:"#4F6C92"
    
  },
});

export default Tampere;
