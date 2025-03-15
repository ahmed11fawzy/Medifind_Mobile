import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, FlatList, Alert } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useGetOrderQuery, useDeleteOrderMutation, useUpdateOrderMutation } from "../redux/Slice/order";
import { useAddRequestMutation } from "../redux/Slice/request";
import { useAuth } from "../hooks/useAuth";
import {
  useGetUserRequestsQuery,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
} from "../redux/Slice/request";

export function Needs() {
  const { userId } = useAuth();
  const navigation = useNavigation();
  const { data: requests } = useGetUserRequestsQuery(userId);
  const { data: orders } = useGetOrderQuery(userId);
  const [updateRequest] = useUpdateRequestMutation();
  const [updateOrder] = useUpdateOrderMutation(); 
  const [deleteRequest] = useDeleteRequestMutation();
  const [Requests, setRequests] = useState([]);
  const [Orders, setOrders] = useState([]);

  useEffect(() => {
    if (requests) {
      setRequests(requests.data);
    }
    if (orders) {
      setOrders(orders.data);
    }
  }, [requests, orders]);

  const handleUpdateRequest = async (item) => {
    navigation.navigate("RequestMedicine", { item });
  };

  const handleDeleteRequest = async (id) => {
    try {
      await deleteRequest({ id ,userId}).unwrap();
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== id));
      Alert.alert("Success", "Request deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      Alert.alert("Error", "Failed to delete request.");
    }
  };

  const renderItem = ({ item }) => (
    <Surface style={styles.card}>
      <View style={styles.contentContainer}>
        <Image
          source={{
            uri: item.prescription_img,
          }}
          style={styles.image}
        />

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
              {item.req_name|| "Unknown"}
            </Text>
          </View>

          {!item.requested && !item.examined && !item.status && <View>
            <Button
              mode="contained"
              onPress={() => console.log("checkout")}
              style={styles.checkoutButton}
              labelStyle={styles.buttonLabel}
            >
              CheckOut
            </Button>
          </View>}
          {item.requested && !item.examined && !item.status && <View>
            <Text>waiting for approval</Text></View>}

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => handleUpdateRequest(item)}
              style={styles.addButton}
              labelStyle={styles.buttonLabel}
            >
              Update
            </Button>

            <Button
              mode="contained"
              onPress={() => handleDeleteRequest(item._id)}
              style={styles.deleteButton}
              labelStyle={styles.buttonLabel}
            >
              Delete
            </Button>
          </View>
        
        </View>
      </View>
    </Surface>
  );

  return (
    <FlatList
      data={Orders}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#dff5f0",
    elevation: 2,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  contentContainer: {
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: "100%",
    resizeMode: "cover",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    justifyContent: "space-between",
    marginTop: 8,
  },
  addButton: {
    backgroundColor: "#0fd78a",
    width: "48%",
  },
  checkoutButton: {
    backgroundColor: "#00bcd4",
    width: "95%",
    marginTop: 5,
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: "#e64e67",
    width: "48%",
  },
  buttonLabel: {
    fontSize: 14,
    color: "white",
  },
});
