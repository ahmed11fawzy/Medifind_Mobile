import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install this:  `expo install @expo/vector-icons`
import { useAuth } from "../hooks/useAuth";
import { useGetUserByIdQuery } from "../redux/Slice/user";
import { CommonActions, useRoute } from '@react-navigation/native';

export const DrawerContent = (props) => {
  const { user, userId, logout } = useAuth();
  const currentRoute = props.state?.routeNames[props.state?.index] || '';

  const {
    data: userData,
    isLoading: isLoadingUser,
  } = useGetUserByIdQuery(userId);

  const userDisplayData = Array.isArray(userData) ? userData[0] : userData;

  const handleLogout = async () => {
    try {
      await logout();
      // Simply navigate to the Login screen
      props.navigation.navigate('Main', { screen: 'Login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image
              source={
                user?.profileImage
                  ? { uri: user.profileImage }
                  : { uri: userDisplayData?.profileImage }
              }
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.name}>
                {userDisplayData?.name}
              </Text>
              <Text style={styles.email}>
                {userDisplayData?.email}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <Ionicons name="close" size={24} color="#01b3bd" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <DrawerItem
          icon="home-outline"
          label="Home"
          onPress={() => props.navigation.navigate("Main", { screen: "Home" })}
          isActive={currentRoute === "Home"}
        />
        <DrawerItem
          icon="person-outline"
          label="Profile"
          onPress={() => props.navigation.navigate("Main", { screen: "ProfilePage" })}
          isActive={currentRoute === "ProfilePage"}
        />
        <DrawerItem
          icon="medkit-outline"
          label="Add Medicine"
          onPress={() => props.navigation.navigate("Main", { screen: "AddMedicine" })}
          isActive={currentRoute === "AddMedicine"}
        />
        <DrawerItem
          icon="cash-outline"
          label="Donations"
          onPress={() => props.navigation.navigate("Main", { screen: "Donations" })}
          isActive={currentRoute === "Donations"}
        />
        <DrawerItem
          icon="medkit-outline"
          label="Request Medicine"
          onPress={() => props.navigation.navigate("Main", { screen: "RequestMedicine" })}
          isActive={currentRoute === "RequestMedicine"}
        />
        <DrawerItem
          icon="help-circle-outline"
          label="Needs"
          onPress={() => props.navigation.navigate("Main", { screen: "Needs" })}
          isActive={currentRoute === "Needs"}
        />
        <DrawerItem
          icon="document-text-outline"
          label="Requests Review"
          onPress={() => props.navigation.navigate("Main", { screen: "RequestsReview" })}
          isActive={currentRoute === "RequestsReview"}
        />
        <DrawerItem
          icon="medkit-outline"
          label="Offers Review"
          onPress={() => props.navigation.navigate("Main", { screen: "OffersReview" })}
          isActive={currentRoute === "OffersReview"}
        />
        <DrawerItem
          icon="log-out-outline"
          label="Logout"
          onPress={handleLogout}
          isActive={false}
        />
      </View>
    </SafeAreaView>
  );
};

// Reusable Drawer Item Component
const DrawerItem = ({ icon, label, onPress, isActive }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.drawerItem, 
        isActive && styles.activeDrawerItem
      ]} 
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color={isActive ? "#fff" : "black"} />
      <Text style={[styles.drawerLabel, isActive && styles.activeDrawerLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileContainer: {
    backgroundColor: "#fff",
    paddingInline: 16,
  },
  profileHeader: {
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "gray",
    paddingBottom: 10,
    marginBottom: 10,
    paddingTop: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "white",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  menuContainer: {
    // marginTop: 16,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  activeDrawerItem: {
    backgroundColor: "#4dd3da",
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: 16,
  },
  activeDrawerLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
});
