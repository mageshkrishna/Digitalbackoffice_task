import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { incrementCounter } from "../redux/actions";
import { shifturl } from "./Constants";

const Bookeditem = ({ shift, reloadData }) => {
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  
  const handleSetCounter = () => {
    dispatch(incrementCounter());
    
  };
 

  const handleCancel = async () => {
   
    try {
      setloading(true)
   
      const response = await fetch(
        `${shifturl}/shifts/${shift.id}/cancel`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
   
      reloadData();
      handleSetCounter()
      setloading(false)
    } catch (error) {
      setloading(false)
      console.error("Error cancelling shift:", error);
    }
  };



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
       <Text style={{ color: "#4F6C92" ,fontWeight:"500"}} >{shift.area}</Text>
      </View>
      <View style={styles.button}>
      <TouchableOpacity
              style={styles.toopfalse}
              onPress={() => {
                handleCancel();
              }}
            >
                        {loading ? <ActivityIndicator size={20} color="#E2006A"/>:<Text style={{ color: "#E2006A" }}>Cancel</Text>}
      </TouchableOpacity>
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
    marginHorizontal:20
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
 
});

export default Bookeditem;
