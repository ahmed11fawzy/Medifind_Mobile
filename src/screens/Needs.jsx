import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useGetOrderQuery, useDeleteOrderMutation, useUpdateOrderMutation } from "../redux/Slice/order";
import {useAddRequestMutation} from "../redux/Slice/request";
import { useAuth } from "../hooks/useAuth";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { MyButton } from "../components/MyButton";
import { useGetUserRequestsQuery } from "../redux/Slice/request";
import { useDeleteRequestMutation } from "../redux/Slice/request"; 


export const Needs = () => {
  const { userId } = useAuth();
  const { data: orders, isLoading: isOrdersLoading, error: ordersError, refetch: refetchOrders} = useGetOrderQuery(userId);
  const { data: requests, isLoading: isRequestsLoading, error: requestsError, refetch: refetchRequests } = useGetUserRequestsQuery(userId);
  console.log("✅ Requests Data:", requests);

  const [deleteOrderMutation] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [userOrders, setUserOrders] = useState([]);
  const navigation = useNavigation();
  const route = useRoute(); 
  const selectedMedicine = route.params?.selectedMedicine;
  const [addRequestMutation] = useAddRequestMutation(); 
  console.log("👤 Current User ID:", userId);
  const [deleteRequestMutation] = useDeleteRequestMutation();



  useEffect(() => {
    console.log("📢 Fetching Data...");
    console.log("📝 Orders Response:", orders);
    console.log("📝 Requests Response:", requests);
  
    if (orders && Array.isArray(orders.data)) {
      console.log("✅ Orders Data:", orders.data);
    } else {
      console.log("❌ Orders Data is invalid:", orders);
    }
  
    if (requests && Array.isArray(requests.data)) {
      console.log("✅ Requests Data:", requests.data);
    } else {
      console.log("❌ Requests Data is invalid:", requests);
    }
  
    // ✅ اجمع الطلبات مع الـ requests في نفس المصفوفة
    setUserOrders([
      ...(orders?.data || []), 
      ...(requests?.data || [])
    ]);
  
  }, [orders, requests]); // تحديث البيانات عند تغير الطلبات أو الـ requests
  
  useFocusEffect(
    useCallback(() => {
      refetchOrders();  
      refetchRequests();
    }, [refetchOrders, refetchRequests])
  );
  
  if (isRequestsLoading || isOrdersLoading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (requestsError || ordersError) {
    return <Text style={styles.errorText}>Error loading requests</Text>;
  }


const handleCheckout = (item) => {
  navigation.navigate("AddMedicine", { selectedRequest: item });
};

  const handleUpdate = (orderId) => {
    navigation.navigate("Update", { orderId });
  };

  const handleDelete = async (orderId) => {
    try {
      const response = await deleteOrderMutation({
        req_id: orderId,     
        user_id: userId       
      }).unwrap();
    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };

  return (
   <FlatList
  data={[...(userOrders || []), ...(requests?.data || [])]}
  keyExtractor={(item) => item._id?.toString() || item.id?.toString() || Math.random().toString()}
  renderItem={({ item }) => (
    <View style={styles.orderItem}>
      {item.prescription_img ? (
      <Image source={{ uri: item.prescription_img }} style={styles.orderImage} />
      ) : item.medicine?.image_path ? ( 
      <Image source={{ uri: item.medicine.image_path }} style={styles.orderImage} />
        ) : null}
      <View style={styles.textContainer}>
        <Text style={styles.orderTitle}>{item.req_name || item.medicine?.name}</Text>
        <Text style={styles.orderDescription}>
          {item.req_description || `Expire Date: ${item.medicine?.expire_date}`}
        </Text>
        <Text>Status: {item.status || "Pending"}</Text>
        <View style={styles.buttonContainer}>
          {item.prescription_img ? (
            <>
              <MyButton title="Update" onPress={() => handleUpdate(item._id)}/>
              <MyButton title="Delete" onPress={() => handleDelete(item._id)}/>
            </>
          ) : (
           <MyButton title="Checkout"onPress={() => handleCheckout(item)}/>
          )}
        </View>
      </View>
    </View>
  )}
/>

  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  noOrdersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDescription: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  selectedMedicineCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    },
    
});

export default Needs;
