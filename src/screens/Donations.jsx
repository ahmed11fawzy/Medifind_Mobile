import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Alert } from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { useGetUserOffersQuery, useDeleteMedicineMutation } from '../redux/Slice/medicine';
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from '@react-navigation/native';

const LeftContent = props => <Avatar.Icon {...props} icon="account" style={{ backgroundColor: '#66d5c1' }} />;

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
  const handleDelete = async ({user_id, medicine_id}) => {
    try {
      await deleteMedicine({user_id,medicine_id}).unwrap();
      // Remove item from local state
      setMedicines(medicines.filter((med) => med._id !== medicine_id));
      Alert.alert("Success", "Medicine deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      Alert.alert("Error", "Failed to delete medicine.");
    }
  };

  // Handle update action
  const handleUpdate = (med_id) => {
    navigation.navigate("AddMedicine", { med_id });
  };

  // Loading state
  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error fetching data</Text>;
  if (medicines.length === 0) return <Text>No donations available</Text>;

  // Render each medicine card
  const renderItem = ({ item }) => (
    <Card style={styles.Card}>
      <Card.Title title={item?.user_id?.name || "Unknown User"} left={LeftContent} />
      <Card.Content>
        <Text style={styles.text}>Name: <Text style={styles.boldText}>{item.name}</Text></Text>
        <Text style={styles.text}>Expire Date: <Text style={styles.expireText}>
          {item.expire_date.split("-").slice(0, 2).join("-")}
        </Text></Text>
      </Card.Content>
      <Card.Cover source={{ uri: item.image_path }} style={styles.img} />
      <Card.Actions>
        <Button style={[styles.btn, styles.deleteBtn]} labelStyle={{ color: 'white' }} onPress={() => handleDelete({ user_id: userId , medicine_id:item._id})}>Delete</Button>
        <Button style={[styles.btn, styles.updateBtn]} onPress={() => handleUpdate(item._id)}>Update</Button>
      </Card.Actions>
    </Card>
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
    paddingVertical: 20,
  },
  Card: {
    width: '90%',
    marginVertical: 10,
    marginHorizontal: '5%',
    padding: 15,
    backgroundColor: '#fafafa',
  },
  img: {
    width: 250,
    height: 290,
    resizeMode: 'contain',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
  },
  boldText: {
    color: '#6b696a',
    fontWeight: 'bold',
  },
  expireText: {
    color: '#e96776',
    fontWeight: 'bold',
  },
  btn: {
    flex: 1,
    borderRadius: 15,
    paddingVertical: 3,
    marginHorizontal: 2,
    marginVertical: 10,
  },
  deleteBtn: {
    backgroundColor: '#e64e67',
  },
  updateBtn: {
    backgroundColor: '#66d5c1',
  },
});

export default Donations;
