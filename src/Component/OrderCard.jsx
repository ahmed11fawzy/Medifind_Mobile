import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";

export const CardComponent = ({
  image,
  name,
  quantity,
  onRemove,
  goToRequestMedicine,
  examined,
  status,
  requested,
}) => {
  const bgColor = requested
    ? !examined
      ? "#d9dedc"
      : status
      ? "#bef5be"
      : "#f9c8c1"
    : "#f4fcf9";

  return (
    <Card style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.container}>
        {/* صورة الدواء */}
        <Image source={{ uri: image }} style={styles.image} />

        {/* تفاصيل الدواء */}
        <View style={styles.details}>
          <Text style={styles.title}>Name: {name}</Text>
          <Text style={styles.quantity}>{quantity}</Text>

          {/* زر Check Out */}
          {!requested && !examined && !status && (
            <TouchableOpacity onPress={goToRequestMedicine} style={styles.buttonCheck}>
              <Text style={styles.buttonText}>Check Out</Text>
            </TouchableOpacity>
          )}

          {/* حالة الطلب */}
          {requested && !examined && !status && (
            <Text style={styles.statusText}>Status: <Text style={styles.waiting}>Waiting for approval</Text></Text>
          )}
          {requested && examined && status && (
            <Text style={styles.statusText}>Status: <Text style={styles.accepted}>Accepted</Text></Text>
          )}
          {requested && examined && !status && (
            <Text style={styles.statusText}>Status: <Text style={styles.rejected}>Rejected</Text></Text>
          )}

          {/* زر إزالة الطلب */}
          <TouchableOpacity onPress={onRemove} style={styles.buttonRemove}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

// **أنماط التصميم**
const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 5,
  },
  statusText: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  waiting: { color: "gray", fontWeight: "bold" },
  accepted: { color: "green", fontWeight: "bold" },
  rejected: { color: "red", fontWeight: "bold" },
  buttonCheck: {
    backgroundColor: "#109d89",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonRemove: {
    backgroundColor: "#ca1e0f",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

