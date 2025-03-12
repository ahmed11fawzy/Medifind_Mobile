import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Text, ActivityIndicator, Snackbar, Button } from "react-native-paper";
import {
  useGetAllMedicinesQuery,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} from "../redux/Slice/medicine";
import MedicineCard from "../components/MedicineCard";

export const OffersReview = () => {
  // Get medicines data using the query from your slice
  const {
    data: medicines,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllMedicinesQuery();

  // Add debugging logs
  console.log('Medicines data:', medicines);
  console.log('Is loading:', isLoading);
  console.log('Is error:', isError);
  console.log('Error:', error);

  // Mutations for adding/accepting and deleting medicines
  const [updateMedicine] = useUpdateMedicineMutation();
  const [deleteMedicine] = useDeleteMedicineMutation();

  // State for handling refresh and feedback
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Handle refresh action
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Handle add/accept medicine
  const handleAdd = async (medicine) => {
    try {
      await updateMedicine({
        medicine_id: medicine.id,
        status: "accepted",
      });

      showSnackbar("Medicine added successfully");
      refetch();
    } catch (err) {
      showSnackbar(`Error adding medicine: ${err.message}`);
    }
  };

  // Handle delete medicine
  const handleDelete = async (medicine) => {
    try {
      await deleteMedicine({
        user_id: medicine.userId,
        medicine_id: medicine.id,
      });

      showSnackbar("Medicine deleted successfully");
      refetch();
    } catch (err) {
      showSnackbar(`Error deleting medicine: ${err.message}`);
    }
  };

  // Snackbar control functions
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#66d5c1" />
        <Text>Loading medicines...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error loading medicines: {error?.data?.message || error?.error || 'Unknown error'}</Text>
        <Button onPress={refetch}>Retry</Button>
      </View>
    );
  }

  // No data state
  if (!medicines || !Array.isArray(medicines?.data || medicines)) {
    return (
      <View style={styles.centerContainer}>
        <Text>No medicines available</Text>
      </View>
    );
  }

  const medicineData = medicines?.data || medicines;

  return (
    <SafeAreaView style={styles.container}>
     

      <FlatList
        data={medicineData}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => {
          if (!item.examine) {
            return (
              <MedicineCard
            medicine={item}
            onAdd={() => handleAdd(item)}
            onDelete={() => handleDelete(item)}
          />
            )
          }
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={hideSnackbar}
        duration={3000}
        action={{
          label: "Dismiss",
          onPress: hideSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
