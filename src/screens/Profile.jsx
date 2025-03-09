import React, { useState } from "react";
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
import { useUpdateUserMutation } from "../redux/Slice/user";

export const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("Anna Avetisyan");
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  // Error State Variables
  const [idNumberError, setIdNumberError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [cityError, setCityError] = useState("");
  const [streetError, setStreetError] = useState("");
  const [profileImageError, setProfileImageError] = useState("");

  // Loading State
  const [uploading, setUploading] = useState(false);

  // Redux mutation hook
  const [updateUser, { isLoading: isUpdateLoading }] = useUpdateUserMutation();

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
    setIdNumberError("");
    setPhoneNumberError("");
    setCityError("");
    setStreetError("");
    setProfileImageError("");

    if (!profileImage) {
      setProfileImageError("Please select an image.");
      isValid = false;
    }

    if (!idNumber) {
      setIdNumberError("ID Number is required.");
      isValid = false;
    } else if (!/^\d{14}$/.test(idNumber)) {
      setIdNumberError("ID Number must be exactly 14 digits.");
      isValid = false;
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone Number is required.");
      isValid = false;
    } else if (!/^01(0|1|2|5)\d{8}$/.test(phoneNumber)) {
      setPhoneNumberError("Phone Number must be an Egyptian number ");
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
    setIdNumber("");
    setPhoneNumber("");
    setCity("");
    setStreet("");
    setProfileImage(null);

    setIdNumberError("");
    setPhoneNumberError("");
    setCityError("");
    setStreetError("");
    setProfileImageError("");
  };

  const handleUpdate = async () => {
    if (!validateInputs()) {
      return;
    }

    const imageUrl = await uploadImage();
    if (imageUrl) {
      try {
        // Assuming you have the user's ID available (e.g., from login)
        const userId = "65fc9efc344313d9a444485d"; // Replace with the actual user ID
        const updateData = {
          profileImage: imageUrl,
          idNumber,
          phoneNumber,
          city,
          street,
        };

        await updateUser({ id: userId, body: updateData }); // Use the mutation
        Alert.alert("Success", "Profile updated successfully!");
        clearInputs();
      } catch (error) {
        console.error("Update failed:", error);
        Alert.alert("Error", "Failed to update profile.");
      }
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
            alert("Navigate Back");
          }}
        />
        <Text style={styles.headerText}>{name}</Text>
      </View>

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
          value={idNumber}
          onChangeText={(text) => {
            setIdNumber(text);
            setIdNumberError(""); // Clear error on input change
          }}
          keyboardType="number-pad"
        />
        {idNumberError !== "" && (
          <Text style={styles.errorText}>{idNumberError}</Text>
        )}

        <MyTextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            setPhoneNumberError(""); // Clear error on input change
          }}
          keyboardType="phone-pad"
        />
        {phoneNumberError !== "" && (
          <Text style={styles.errorText}>{phoneNumberError}</Text>
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


