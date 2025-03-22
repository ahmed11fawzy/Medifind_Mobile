import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Surface } from "react-native-paper";

const MedicineCard = ({ medicine, onAdd, onDelete }) => {
  // Format the date to match the example (ISO format)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (e) {
      return dateString.toString();
    }
  };

  return (
    <Surface style={styles.card}>
      <View style={styles.contentContainer}>
        <Image
          source={{
            uri: medicine.image_path,
          }}
          style={styles.image}
        />

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
              {medicine.name}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Expire date:</Text>
            <Text style={styles.value}>{formatDate(medicine.expire_date)}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={onAdd}
              style={styles.addButton}
              labelStyle={styles.buttonLabel}
            >
              Accept
            </Button>

            <Button
              mode="contained"
              onPress={onDelete}
              style={styles.deleteButton}
              labelStyle={styles.buttonLabel}
            >
              Reject
            </Button>
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#dff5f0",
    elevation: 2,
    overflow: 'hidden', // This ensures the image respects the card's border radius
  },
  contentContainer: {
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: '100%',
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
  },
  addButton: {
    backgroundColor: "#00bcd4", // Teal color to match image
    width: "48%",
  },
  deleteButton: {
    backgroundColor: "#e64e67", // Teal color to match image
    width: "48%",
  },
  buttonLabel: {
    fontSize: 14,
    color: "white",
  },
});

export default MedicineCard;
