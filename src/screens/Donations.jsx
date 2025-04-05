import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { Button, Card ,Avatar} from 'react-native-paper';
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

  const MedicineRequestIcon = () => (
    <Avatar.Icon
      size={50}
      icon="pill"
      color="#e3f4eb"
      style={{ backgroundColor: Colors.mainColor }}
    />
  );
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
  if (medicines.length === 0) return (
    <View style={styles.container}>
      <Text style={styles.title}> No Donations</Text>
      <MedicineRequestIcon />
    </View>
  );

  // Render each medicine card
  const renderItem = ({ item }) => (
    
      
    <View style={item.status?styles.cardAccepted:item.examine?styles.cardRejected:styles.cardWaiting}>
      {/* Medicine Image */}
      <Image source={{ uri: item.image_path }} style={styles.img} />

      <View style={styles.infoContainer}>
        <Text style={styles.text}>
          <Text style={styles.boldText}>Name:</Text> {item.name}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>Expire date:</Text> {item.expire_date.split("T")[0]}
        </Text>
       {item.status&&item.examine&& <Text style={styles.text}>status:
         <Text style={{...styles.boldText,color:'green'}}> Accepted</Text> 
        </Text>}
       {!item.status&& item.examine&& <Text style={styles.text}>status:
         <Text style={{...styles.boldText,color:'red'}}> Rejected</Text> 
        </Text>}
       {!item.status&& !item.examine&& <Text style={styles.text}>status:
         <Text style={{...styles.boldText,color:'grey'}}> waiting for approval</Text> 
        </Text>}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {!item.examine&& <Button mode="contained" style={[ styles.addBtn]} onPress={() => handleUpdate(item)}>Update</Button>}
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
    marginTop: 5,
    paddingVertical: 20,
    alignItems: "center",
    paddingBottom: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    marginHorizontal: 80,
    color: "#8989899",
    fontFamily: "serif",
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
  cardAccepted: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a4ffc8e6",
    borderRadius: 15,
    marginBottom: 15,
    width: "90%",
    // elevation: 3, // Shadow effect
  },
  cardRejected: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5b2b6",
    borderRadius: 15,
    marginBottom: 15,
    width: "90%",
    elevation: 3, // Shadow effect
  },
  cardWaiting: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c6cbc9",
    borderRadius: 15,

    marginBottom: 15,
    width: "90%",
    elevation: 3, // Shadow effect
  },
  img: {
    width: "30%",

    height: "100%",
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
    margin: 5,
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

    marginHorizontal: 6,
    marginBottom: 15,
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
