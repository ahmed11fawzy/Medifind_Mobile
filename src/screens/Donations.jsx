import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Card, Avatar } from 'react-native-paper';
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

  if (isLoading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00BCD4" />
    </View>
  );
  if (isError) return <Text>Error fetching data</Text>;
  if (medicines.length === 0) return (
    <View style={styles.container}>
      <Text style={styles.title}> No Donations</Text>
      <MedicineRequestIcon />
    </View>
  );

  // Render each medicine card
  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image_path }} style={styles.img} />
        <View style={styles.statusBadge}>
          {item.status && item.examine && (
            <View style={styles.statusContainer}>
              <Avatar.Icon size={24} icon="check" color="#fff" style={[styles.statusIcon, { backgroundColor: '#4CAF50' }]} />
              <Text style={[styles.statusText, { color: '#fff' }]}>ACCEPTED</Text>
            </View>
          )}
          {!item.status && item.examine && (
            <View style={styles.statusContainer}>
              <Avatar.Icon size={24} icon="close" color="#fff" style={[styles.statusIcon, { backgroundColor: '#F44336' }]} />
              <Text style={[styles.statusText, { color: '#fff' }]}>REJECTED</Text>
            </View>
          )}
          {!item.status && !item.examine && (
            <View style={styles.statusContainer}>
              <Avatar.Icon size={24} icon="clock-outline" color="#fff" style={[styles.statusIcon, { backgroundColor: '#FFC107' }]} />
              <Text style={[styles.statusText, { color: '#fff' }]}>PENDING</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.medicineName}>{item.name}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Avatar.Icon size={20} icon="flask-outline" color={Colors.mainColor} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Concentration</Text>
              <Text style={styles.detailValue}>{item.concentration}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Avatar.Icon size={20} icon="calendar-clock" color={Colors.mainColor} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Expires</Text>
              <Text style={styles.detailValue}>{item.expire_date.split("T")[0]}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {!item.examine && (
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: Colors.mainColor }]}
              onPress={() => handleUpdate(item)}
            >
              <Avatar.Icon size={24} icon="pencil" color="#fff" style={styles.actionIcon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: '#E64E67' }]}
            onPress={() => handleDelete({ user_id: userId, medicine_id: item._id })}
          >
            <Avatar.Icon size={24} icon="delete" color="#fff" style={styles.actionIcon} />
          </TouchableOpacity>
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
      showsVerticalScrollIndicator={false}
      bounces={true}
      overScrollMode="always"
    />
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
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
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 40,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'rgba(78, 77, 77, 0.51)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 100,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusIcon: {
    backgroundColor: 'transparent',
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  medicineName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    backgroundColor: 'transparent',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#636E72",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  iconButton: {
    borderRadius: 20,
    padding: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionIcon: {
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Donations;
