import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  Alert ,
} from "react-native";
import { Button, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useGetOrderQuery, useDeleteOrderMutation, useUpdateOrderMutation } from "../redux/Slice/order";
import { useGetUserRequestsQuery, useUpdateRequestMutation, useDeleteRequestMutation } from "../redux/Slice/request";
import { useAuth } from "../hooks/useAuth";
import { ScrollView } from "react-native-web";

export function Needs() {
  const { userId } = useAuth();
  const navigation = useNavigation();

  // Fetch orders and requests from API
  const { data: requestsData } = useGetUserRequestsQuery(userId);
  const { data: ordersData } = useGetOrderQuery(userId);

  // Mutation hooks
  const [updateRequest] = useUpdateRequestMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteRequest] = useDeleteRequestMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // Local state for orders and requests (renamed to avoid conflicts)
  const [requestsList, setRequestsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    if (requestsData) {
      setRequestsList(requestsData.data);
    }
    if (ordersData) {
      setOrdersList(ordersData.data);
    }
  }, [requestsData, ordersData]);

  // Handle update navigation for a request/order item
  const handleUpdateRequest = async (item) => {
    navigation.navigate("RequestMedicine", { item, itemId: item._id, medicineId: item.medicine });
  };

  // Handle delete for requests/orders
  const handleDelete = async ({ req_id, user_id, medicine }) => {
    try {
      if (medicine) {
        await deleteRequest({ req_id, user_id }).unwrap();
        setRequestsList((prev) => prev.filter((req) => req._id !== req_id));
        Alert.alert("Success", "Request deleted successfully!");
      } else {
        await deleteOrder({ req_id, user_id }).unwrap();
        setOrdersList((prev) => prev.filter((order) => order._id !== req_id));
        Alert.alert("Success", "Order deleted successfully!");
      }
    } catch (error) { 
      console.error("Delete Error:", error);
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  // Render each item with conditional styling based on examined and status
  const renderItem = ({ item }) => {
    let cardStyle = styles.card; // default style
    if (item.examined === true && item.status === true) {
      cardStyle = styles.cardAccepted;
    } else if (item.examined === true && item.status === false) {
      cardStyle = styles.cardRejected;
    }
     else if (item.requested === true ) {
      cardStyle = styles.cardWaiting;
    }

    return (
      <Surface style={cardStyle}>
    
        <View style={styles.contentContainer}>
          <Image
            source={{
              uri: item.prescription_img || (item.medicine && item.medicine.image_path),
            }}
            style={styles.image}
          />
          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
                {item.req_name || (item.medicine && item.medicine.name)}
              </Text>
            </View>

            {!item.requested && !item.examined && !item.status && (
              <Button
                mode="contained"
                onPress={() => handleUpdateRequest(item)}
                style={styles.checkoutButton}
                labelStyle={styles.buttonLabel}
              >
                CheckOut
              </Button>
            )}
            {item.requested && !item.examined && !item.status && (
              <Text>Waiting for approval</Text>
            )}
            {item.requested && item.examined && item.status && <Text >Accepted</Text>}
            {item.requested && item.examined && !item.status && <Text>Rejected</Text>}

            <View style={styles.buttonContainer}>
            {!item.examined &&  <Button
                mode="contained"
                onPress={() => handleUpdateRequest(item)}
                style={styles.addButton}
                labelStyle={styles.buttonLabel}
              >
                Update
              </Button>}
              <Button
                onPress={() =>
                  item.medicine
                    ? handleDelete({ req_id: item._id, user_id: userId, medicine: item.medicine })
                    : handleDelete({ req_id: item._id, user_id: userId })
                }
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
  };

  // Combine orders and requests for rendering
  const combinedData = [...ordersList, ...requestsList];

  return (
    <FlatList
      data={combinedData}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal:5
  },
  card: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#e8efed", // default color
    elevation: 2,
    marginHorizontal: 10,
    overflow: "hidden",
    
  },
  cardAccepted: {
    marginVertical: 10,
    borderRadius: 8,
    // backgroundColor: "#93f1d8",
    backgroundColor: "#a4ffc8e6",
    elevation: 2,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  cardRejected: {
    marginVertical: 10,
    borderRadius: 8,
    // backgroundColor: "#f19399",
    backgroundColor: "#efa6ab",
    elevation: 2,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  cardWaiting: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#c6cbc9",
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
    marginTop: 8,
    justifyContent: "space-between",
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
    marginLeft: 8,
  },
  buttonLabel: {
    fontSize: 14,
    color: "white",
  },
});

export default Needs;