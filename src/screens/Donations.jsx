import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useGetUserOffersQuery, useDeleteMedicineMutation } from '../redux/Slice/medicine';
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/RootColor';

export function Donations() {
  const { userId } = useAuth();
  const navigation = useNavigation();
  const { data, isLoading, isError } = useGetUserOffersQuery(userId);
  const [deleteMedicine] = useDeleteMedicineMutation();
  const [medicines, setMedicines] = useState([]);

  // Load data into state when API call is successful
  useEffect(() => {
    if (data?.data) {
      setMedicines(data.data);
    }
  }, [data]);

  // Handle delete action 
  const handleDelete = async ({ user_id, medicine_id }) => {
    try {
      await deleteMedicine({ user_id, medicine_id }).unwrap();
      setMedicines(medicines.filter((med) => med._id !== medicine_id));
      Alert.alert("Success", "Medicine deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      Alert.alert("Error", "Failed to delete medicine.");
    }
  };

  // Handle update action
  const handleUpdate = (medicine) => {
    navigation.navigate("AddMedicine", { medicine });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error fetching data</Text>;
  if (medicines.length === 0) return <Text>No donations available</Text>;

  // Render each medicine card
  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      {/* Medicine Image */}
      <Image source={{ uri: item.image_path }} style={styles.img} />

      <View style={styles.infoContainer}>
        <Text style={styles.text}>
          <Text style={styles.boldText}>Name:</Text> {item.name}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>Expire date:</Text> {item.expire_date.split("T")[0]}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button mode="contained" style={[ styles.addBtn]} onPress={() => handleUpdate(item)}>Update</Button>
          <Button mode="contained" style={[ styles.deleteBtn]} onPress={() => handleDelete({ user_id: userId, medicine_id: item._id })}>Delete</Button>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={medicines}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
    />
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingVertical: 20,
    alignItems: "center",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F8F6", // Light cyan background
    borderRadius: 15,
    // padding: 15,
    marginBottom: 15,
    width: "90%",
    elevation: 3, // Shadow effect
  },
  img: {
    width: 100,
    height: '100%',
    borderRadius: 10,
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 6,
  },
  btn: {
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 2,
    marginHorizontal: 5,
    
  },
  addBtn: {
    backgroundColor: Colors.mainColor, // Blue button
    width: "50%",
  },
  deleteBtn: {
    backgroundColor: "#E64E67", // Red button
    width: "50%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 13,
  },
});

export default Donations;
