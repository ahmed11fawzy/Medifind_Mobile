import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useGetOrderQuery, useDeleteOrderMutation, useUpdateOrderMutation } from "../redux/Slice/order";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

export const Needs = () => {
  const { userId } = useAuth();
  console.log("User ID:", userId);
  const { data: orders, error, isLoading, refetch } = useGetOrderQuery(userId);
  const [deleteOrderMutation] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [userOrders, setUserOrders] = useState([]);
  const navigation = useNavigation();  // للحصول على الدالة الخاصة بالتوجيه
  console.log("User ID:", userId);


  useEffect(() => {
    if (orders) {
      console.log("Orders object:", orders);
      console.log("Extracted orders array:", orders?.data);
      setUserOrders(orders?.data || []);
    }
  }, [orders]);

  const handleUpdate = (orderId) => {
    navigation.navigate("Update", { orderId });
  };
  
  useEffect(() => {
    if (orders) {
      setUserOrders(orders?.data || []);
    }
  }, [orders]);
  
  useEffect(() => {
    // لما نرجع من صفحة RequestMedicine، نعمل refetch أو invalidate للـ data
    refetch();
  }, [navigation]);
  
  
  
  const handleDelete = async (orderId) => {
    console.log(`🟡 Attempting to delete order ID: ${orderId}`);
  
    try {
      // إرسال الـ req_id و user_id عبر الـ headers
      const response = await deleteOrderMutation({
        req_id: orderId,       // الـ req_id
        user_id: userId        // الـ user_id
      }).unwrap();
  
      console.log("✅ Delete response:", response);
    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };

  
  

  if (isLoading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error loading orders</Text>;
  }

  return (
    <View style={styles.container}>
      {userOrders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found</Text>
      ) : (
        <FlatList
          data={userOrders}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Image source={{ uri: item.prescription_img }} style={styles.orderImage} />
              <View style={styles.textContainer}>
                <Text style={styles.orderTitle}>{item.req_name}</Text>
                <Text style={styles.orderDescription}>{item.req_description}</Text>

                {/* أزرار التحديث والحذف */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdate(item._id)}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

// ✅✅✅ تصميم الأزرار والتنسيقات ✅✅✅
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
});

export default Needs;
