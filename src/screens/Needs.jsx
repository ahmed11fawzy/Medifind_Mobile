import React from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useGetUserRequestsQuery, useDeleteRequestMutation } from "../redux/Slice/request";
import {CardComponent } from "../Component/OrderCard";
import { useNavigation } from "@react-navigation/native";

export const CardPage = () => {
  const { userId } = useAuth();
  const navigation = useNavigation();
  const { data: requests, isLoading, error } = useGetUserRequestsQuery(userId);
  const [deleteRequest] = useDeleteRequestMutation();

  const handleRemove = async (id) => {
    try {
      await deleteRequest(id).unwrap();
      Alert.alert("Success", "Request deleted successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to delete request!");
    }
  };

  const goToRequestMedicine = (name, medicine_id, request_id) => {
    navigation.navigate("RequestMedicine", {
      medicineName: name,
      medicine_id: medicine._id ,
      request_id,
      requested: true,
    });
  };

  if (isLoading) return <ActivityIndicator size="large" color="#109d89" />;
  if (error) return <Text style={styles.errorText}>Failed to fetch requests.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CardComponent
            requested={item.requested}
            medicine_id={item.medicine._id}
            examined={item.examined}
            status={item.status}
            request_id={item._id}
            prescription_img={item.prescription_img || ""}
            image={item.medicine?.image_path || ""}
            name={item.medicine?.name || "No name"}
            quantity={item.medicine?.concentration || ""}
            onRemove={() => handleRemove(item._id)}
            goToRequestMedicine={() =>
              goToRequestMedicine(item.medicine.name, item.medicine._id, item._id)
            }
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
  },
});

