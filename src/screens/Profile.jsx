import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MyTextInput } from "../components/MyTextInput";
import { MyButton } from "../components/MyButton";
import axios from "axios";
import { useUpdateUserMutation, useGetUserByIdQuery } from "../redux/Slice/user";
import { useAuth } from "../hooks/useAuth";

export const ProfilePage = ({ navigation }) => {
  const { user, userId, tokenData, userName } = useAuth();
  
  // Fetch user details using the ID from token
  const { data: userData, isLoading: isLoadingUser, error: userError, refetch: refetchUser } = useGetUserByIdQuery(userId);
  console.log('User Data in Profile:', userData);
  console.log('User Name:', userData?.name);

  const [profileImage, setProfileImage] = useState(null);
 
  const [ssn, setssn] = useState("");
  const [phone, setphone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  // Error State Variables
  const [ssnError, setssnError] = useState("");
  const [phoneError, setphoneError] = useState("");
  const [cityError, setCityError] = useState("");
  const [streetError, setStreetError] = useState("");
  const [profileImageError, setProfileImageError] = useState("");

  // Loading State
  const [uploading, setUploading] = useState(false);

  // Redux mutation hook
  const [updateUser, { isLoading: isUpdateLoading }] = useUpdateUserMutation();

  // Use effect to update fields when user data changes
  useEffect(() => {
    if (userData) {
      console.log('Setting user data from API:', userData);
      // Handle array response
      const user = Array.isArray(userData) ? userData[0] : userData;
      console.log('Processed user data:', user);
      
      setssn(user.ssn || "");
      setphone(user.phone || "");
      setCity(user.city || "");
      setStreet(user.street || "");
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [userData]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setProfileImageError(""); // Clear image error when a new image is selected
    }
  };

  const uploadImage = async () => {
    if (!profileImage) {
      setProfileImageError("Please select an image.");
      return null;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: profileImage,
        type: "image/jpeg", // Adjust the type if necessary
        name: "profile.jpg", // You can change the name if needed
      });
      formData.append("upload_preset", "medifined"); // Replace with your upload preset
      formData.append("cloud_name", "doxyvufkz"); // Replace with your cloud name

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploading(false);
      setProfileImageError("");
      console.log("Image URL on Cloudinary:", response.data.secure_url); // ADDED CONSOLE LOG
      return response.data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      setProfileImageError("Image upload failed. Please try again.");
      Alert.alert("Error", "Image upload failed. Please try again.");
      return null;
    }
  };

  const validateInputs = () => {
    let isValid = true;

    // Reset Errors
    setssnError("");
    setphoneError("");
    setCityError("");
    setStreetError("");
    setProfileImageError("");

    if (!profileImage) {
      setProfileImageError("Please select an image.");
      isValid = false;
    }

    if (!ssn) {
      setssnError("ID Number is required.");
      isValid = false;
    } else if (!/^\d{14}$/.test(ssn)) {
      setssnError("ID Number must be exactly 14 digits.");
      isValid = false;
    }

    if (!phone) {
      setphoneError("Phone Number is required.");
      isValid = false;
    } else if (!/^01(0|1|2|5)\d{8}$/.test(phone)) {
      setphoneError("Phone Number must be an Egyptian number ");
      isValid = false;
    }

    if (!city) {
      setCityError("City is required.");
      isValid = false;
    }

    if (!street) {
      setStreetError("Street is required.");
      isValid = false;
    }

    return isValid;
  };

  const clearInputs = () => {
    setssn("");
    setphone("");
    setCity("");
    setStreet("");
    setProfileImage(null);

    setssnError("");
    setphoneError("");
    setCityError("");
    setStreetError("");
    setProfileImageError("");
  };

  const handleUpdate = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      let updateData = {
       
        ssn,
        phone,
        location: `${street}, ${city}`,
      };

      // Only upload and add image if a new one is selected
      if (profileImage && !profileImage.startsWith('http')) {
        const imageUrl = await uploadImage();
        if (imageUrl) {
          updateData.profileImage = imageUrl;
        } else {
          return; // Stop if image upload failed
        }
      }

      const result = await updateUser({ 
        id: userId, 
        body: updateData 
      }).unwrap();
      
      console.log('Update result:', result);

      // Refetch user data after successful update
      refetchUser();

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert(
        "Error",
        error.data?.message || "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={30}
          iconColor="white"
          style={{ position: "absolute", left: 10, top: 10, zIndex: 1 }}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={styles.headerText}>
          {isLoadingUser 
            ? "Loading..." 
            : (Array.isArray(userData) ? userData[0]?.name : userData?.name) || "User"}
        </Text>
      </View>

      {userError ? (
        <View style={[styles.content, { alignItems: 'center' }]}>
          <Text style={{ color: 'red' }}>Error loading user data</Text>
        </View>
      ) : isLoadingUser ? (
        <View style={[styles.content, { alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#01b3bd" />
        </View>
      ) : (
        <>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Avatar.Image
                size={100}
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/profile.jpeg")
                }
              />
            </TouchableOpacity>
            {profileImageError !== "" && (
              <Text style={styles.errorText}>{profileImageError}</Text>
            )}
          </View>

          <View style={styles.content}>
           
            
            <MyTextInput
              label="ID Number"
              value={ssn}
              onChangeText={(text) => {
                setssn(text);
                setssnError("");
              }}
              keyboardType="number-pad"
            />
            {ssnError !== "" && (
              <Text style={styles.errorText}>{ssnError}</Text>
            )}

            <MyTextInput
              label="Phone Number"
              value={phone}
              onChangeText={(text) => {
                setphone(text);
                setphoneError(""); // Clear error on input change
              }}
              keyboardType="phone-pad"
            />
            {phoneError !== "" && (
              <Text style={styles.errorText}>{phoneError}</Text>
            )}

            <MyTextInput
              label="City"
              value={city}
              onChangeText={(text) => {
                setCity(text);
                setCityError(""); // Clear error on input change
              }}
            />
            {cityError !== "" && <Text style={styles.errorText}>{cityError}</Text>}

            <MyTextInput
              label="Street"
              value={street}
              onChangeText={(text) => {
                setStreet(text);
                setStreetError(""); // Clear error on input change
              }}
            />
            {streetError !== "" && (
              <Text style={styles.errorText}>{streetError}</Text>
            )}

            <MyButton
              title="Update"
              onPress={handleUpdate}
              disabled={uploading || isUpdateLoading} // Disable the button while uploading
            />

            {uploading && (
              <ActivityIndicator
                size="small"
                color="#01b3bd"
                style={{ marginTop: 10 }}
              />
            )}
            {isUpdateLoading && (
              <ActivityIndicator
                size="small"
                color="#01b3bd"
                style={{ marginTop: 10 }}
              />
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#01b3bd",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -60,
  },
  content: {
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 17,
  },
});













