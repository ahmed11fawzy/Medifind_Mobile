import React, { useEffect, useState } from 'react';
import { 
  Text, View, StyleSheet, FlatList, ActivityIndicator, Alert, 
  Modal, TouchableOpacity, Image 
} from 'react-native';
import { Avatar, Button, Card, IconButton } from 'react-native-paper';
import { useGetAllRequestsQuery, useUpdateRequestMutation } from '../redux/Slice/request';
import { useGetAllOrdersQuery, useUpdateOrderMutation } from '../redux/Slice/order';
import { Colors } from '../constants/RootColor';

// Left Avatar Component
const LeftContent = ({ profileImage }) => {
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
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image

  // Update state when data is available
  useEffect(() => {
    if (data || data2) {
      const newData = [...(data?.data || []), ...(data2?.data || [])].filter((item) => (!item.examined && item.req_name));
      setCombinedData(newData);  
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
      setCombinedData((prevData) => prevData.filter((item) => item._id !== id));
      Alert.alert("Accepted", "Request has been accepted!");
    } catch (error) {
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
      setCombinedData((prevData) => prevData.filter((item) => item._id !== id));
      Alert.alert("Rejected", "Request has been rejected!");
    } catch (error) {
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
   

      {item.prescription_img && (
        <TouchableOpacity onPress={() => setSelectedImage(item.prescription_img)}>
          <Card.Cover source={{ uri: item.prescription_img }} style={styles.image} />
        </TouchableOpacity>
      )}
         <Card.Content>
        <Text style={styles.label}>
          Name: <Text style={styles.value}>{item.req_name || item.order_name}</Text>
        </Text>
        <Text style={styles.label}>
          Description: <Text style={styles.description}>{item.req_description || item.order_description}</Text>
        </Text>
      </Card.Content>

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
    <View style={[styles.container, selectedImage ? styles.dimBackground : null]}>
      <Text style={styles.title}>Requests</Text>
      <View style={styles.iconContainer}>
        <MedicineRequestIcon />
      </View>

      <FlatList
        data={combinedData}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
      />

      {/* Modal for Image Preview */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.modalContainer}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
            <IconButton icon="close" size={30} color="white" />
          </TouchableOpacity>

          <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
        </View>
      </Modal>
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
  dimBackground: {
    opacity: 0.3, // Reduce opacity when modal is open
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#8989899',
    fontFamily: 'serif',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#8989899',
  },
  value: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: 'normal',
    color: '#8989899',
  },
  description: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: 'normal',
    color: '#8989899',
  },
  actions: {
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#49d3ac',
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: '#ff6b6b',
  },
  
  iconContainer: {
    marginBottom: 15,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    padding: 15,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    marginVertical: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.859)', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, 
  },
  fullscreenImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 20, 
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 97, 97, 0.5)',
    borderRadius: 50,

    top: 40,
    right: 20,
    zIndex: 10, 
  },
  actions: {
    justifyContent: 'space-between',
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#e64e67',
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
});

export default RequestsReview;
