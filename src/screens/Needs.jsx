import React, { useState } from "react";
import { View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; 

export const Needs = () => {
  const navigation = useNavigation(); 

  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol", description: "Used for fever and pain relief.", image: "https://example.com/paracetamol.jpg" },
    { id: 2, name: "Aspirin", description: "Used for pain and inflammation.", image: "https://example.com/aspirin.jpg" },
  ]);

  const handleDelete = (id) => {
    setMedicines(medicines.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    navigation.navigate("RequestMedicine"); 
  };

  return (
    <ScrollView style={styles.container}>
      {medicines.map((item) => (
        <Card key={item.id} style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.textContainer}>
              <Text style={styles.medicineName}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button mode="contained" style={[styles.button, styles.updateButton]}>Update</Button>
            <Button mode="contained" style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item.id)}>Delete</Button>
            <Button mode="contained" style={[styles.button, styles.checkoutButton]} onPress={handleCheckout}>Checkout</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffffa0",
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: "30%",
    flexShrink: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 15,
    alignSelf: "center",
  },
  updateButton: {
    backgroundColor: "blue", 
  },
  deleteButton: {
    backgroundColor: "red", 
  },
  checkoutButton: {
    backgroundColor: "green", 
  },
});
