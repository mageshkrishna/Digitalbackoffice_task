import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCounter, incrementCounter } from "../../redux/actions";
import { shifturl } from "../Constants";

const ShiftItem = ({ shift, reloadData }) => {
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  
  const handleSetCounter = () => {
    dispatch(incrementCounter());
    
  };
 
  const handleBook = async () => {
   
    try {
     setloading(true);
      const response = await fetch(
        `${shifturl}/shifts/${shift.id}/book`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
     handleSetCounter();
   
    
      setloading(false)
      reloadData();
    } catch (error) {
      setloading(false)
      console.error("Error booking shift:", error);
    }
  };

  const handleCancel = async () => {

    try {
      setloading(true)
      // Make a POST request to cancel the shift
      const response = await fetch(
        `${shifturl}/shifts/${shift.id}/cancel`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      handleSetCounter()
    
      reloadData();
      setloading(false)
    } catch (error) {
      setloading(false)
      console.error("Error cancelling shift:", error);
    }
  };

  const isBookable = shift.startTime >= Date.now() && !shift.overlapping;

  return (
    <View style={styles.shiftContainer}>
      <View style={styles.time}>
        <Text style={{ color: "#4F6C92" }}>
          {new Date(shift.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          -
          {new Date(shift.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <View style={styles.status}>
        {shift.overlapping && (
          <Text style={styles.overlapping}>Overlapping</Text>
        )}
         {shift.booked && (
          <Text style={styles.Booked}>Booked</Text>
        )}
      </View>
      <View style={styles.button}>
        {isBookable ? (
          shift.booked ? (
            <TouchableOpacity
              style={styles.toopfalse}
              onPress={() => {
                handleCancel();
              }}
            >
              {loading ? <ActivityIndicator size={20} color="#E2006A"/>:<Text style={{ color: "#E2006A" }}>Cancel</Text>}
             
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.tooptrue}
              onPress={() => {
                handleBook();
              }}
            >
              {loading ? <ActivityIndicator size={20} color="#16A64D"/>:<Text style={{ color: "#16A64D" }}>Book</Text>}
              
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity style={styles.toopcant} disabled>
            <Text style={{ color: "#acacac" }}>Book</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shiftContainer: {
    height: 50,
    flex: 1,
    marginBottom: 10,
    borderBottomWidth: 0.2,
    borderRadius: 8,
    flexDirection: "row",
    backgroundColor: "#f1f4f8",
  },
  time: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  tooptrue: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#55CB82",
    height: 30,
    width: 70,
    borderRadius: 15,
    backgroundColor: "#F7F8FB",
  },
  toopfalse: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FE93B3",
    height: 30,
    width: 70,
    borderRadius: 15,
    backgroundColor: "#F7F8FB",
  },
  toopcant: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#acacac",
    height: 30,
    width: 70,
    borderRadius: 15,
    backgroundColor: "#F7F8FB",
  },
  overlapping: {
    color: "#E2006A",
    fontWeight: "500",
    fontSize: 14,
  },
  Booked: {
    color: "#4F6C92",
    fontWeight: "500", 
    fontSize: 14,
  },
});

export default ShiftItem;
