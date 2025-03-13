
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { useGetAllRequestsQuery, useUpdateRequestMutation } from '../redux/Slice/request';
import { useGetAllOrdersQuery, useUpdateOrderMutation } from '../redux/Slice/order';
import { Colors } from '../constants/RootColor';

// Left Avatar Component
const LeftContent = ({profileImage}) => {
  return profileImage ? (
    <Avatar.Image size={40} source={{ uri: profileImage }} />
  ) : (
    <Avatar.Icon size={40} icon="account" style={{ backgroundColor: Colors.mainColor }} />
  );
};
// Medicine Request Icon Component
const MedicineRequestIcon = () => (
  <Avatar.Icon size={50} icon="pill" color="#e3f4eb" style={{ backgroundColor: Colors.mainColor }} />
);

export function RequestsReview() {
  const { data, isLoading, isError } = useGetAllRequestsQuery();
  const { data: data2, isLoading: isLoading2, isError: isError2 } = useGetAllOrdersQuery();

  const [updateOrder] = useUpdateOrderMutation();
  const [updateRequest] = useUpdateRequestMutation();

  const [combinedData, setCombinedData] = useState([]);

  // Update state when data is available
  useEffect(() => {
    if (data || data2) {
      const newData = [...(data?.data || []), ...(data2?.data || [])].filter((item) => !item.examined);
      setCombinedData(newData);  //set array of only not examind requests
    }
  }, [data, data2]);

  // Handle Accept Request
  const handleAccept = async (id, med_id) => {
    try {
      if (med_id === undefined) {
        await updateOrder({ id, body: { status: true, examined: true } }).unwrap();
      } else {
        await updateRequest({ id, body: { status: true, examined: true } }).unwrap();
      }
      // Remove the accepted request from the UI
      setCombinedData((prevData) => prevData.filter((item) => item._id !== id));
      Alert.alert("Accepted", "Request has been accepted!");
    } catch (error) {
      console.error("Error accepting request:", error);
      Alert.alert("Error", "Failed to accept request.");
    }
  };

  // Handle Reject Request
  const handleReject = async (id, med_id) => {
    try {
      if (med_id === undefined) {
        await updateOrder({ id, body: { status: false, examined: true } }).unwrap();
      } else {
        await updateRequest({ id, body: { status: false, examined: true } }).unwrap();
      }
      // Remove the rejected request from the UI
      setCombinedData((prevData) => prevData.filter((item) => item._id !== id));
      Alert.alert("Rejected", "Request has been rejected!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      Alert.alert("Error", "Failed to reject request.");
    }
  };

  // Show loading state
  if (isLoading || isLoading2) {
    return <ActivityIndicator size="large" color="#49d3ac" style={styles.loader} />;
  }

  // Show error message
  if (isError || isError2) {
    return <Text style={styles.errorText}>Error loading requests.</Text>;
  }

  // Check if there's no data
  if (combinedData.length === 0) {
    return <Text style={styles.errorText}>No pending requests available.</Text>;
  }

  // Render each request item
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
     <Card.Title
  title={item.user_id?.name || "Unknown User"}
  left={(props) => <LeftContent {...props} profileImage={item.user_id?.profileImage} />}
       />
      <Card.Content>
        <Text style={styles.label}>
          Name: <Text style={styles.value}>{item.req_name || item.order_name}</Text>
        </Text>
        <Text style={styles.label}>
          Description: <Text style={styles.description}>{item.req_description || item.order_description}</Text>
        </Text>
      </Card.Content>

      {item.prescription_img && (
        <Card.Cover source={{ uri: item.prescription_img }} style={styles.image} />
      )}

      <Card.Actions style={styles.actions}>
        <Button
          mode="contained"
          style={styles.acceptButton}
          labelStyle={styles.buttonLabel}
          onPress={() => handleAccept(item._id, item.medicine)}
        >
          Accept
        </Button>
        <Button
          mode="contained"
          style={styles.rejectButton}
          labelStyle={styles.buttonLabel}
          onPress={() => handleReject(item._id, item.medicine)}
        >
          Reject
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requests</Text>
      <View style={styles.iconContainer}>
        <MedicineRequestIcon />
      </View>

      <FlatList
        data={combinedData}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '90%',
    marginHorizontal: '5%',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    fontFamily: 'serif',
  },
  iconContainer: {
    marginBottom: 15,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
    padding: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 5,
  },
  value: {
    color: '#6b696a',
    fontWeight: 'bold',
  },
  description: {
    fontWeight: 'normal',
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  actions: {
    justifyContent: 'space-between',
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    paddingVertical: 5,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#e64e67',
    borderRadius: 10,
    paddingVertical: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RequestsReview;
