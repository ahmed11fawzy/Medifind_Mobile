import React, { useState,useEffect, } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAddOrderMutation } from "../redux/Slice/order";
import { useUpdateRequestMutation } from "../redux/Slice/request";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

export const RequestMedicine = () => {
  const [medicineName, setMedicineName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [medicineName, setMedicineName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const route = useRoute();

  const item = route.params||{};

  // Get user_id from Redux state
  const userId = useSelector((state) => state.auth.user?.id);

  // Hook for adding an order
  const [addOrder, { isLoading: isAddingOrder }] = useAddOrderMutation();
  const [updateRequest, { isLoading: isUpdatingRequest }] = useUpdateRequestMutation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first.");
      return null;
    }


  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first.");
      return null;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        type: "image/jpeg",
        name: "medicine.jpg",
      });
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        type: "image/jpeg",
        name: "medicine.jpg",
      });
      formData.append("upload_preset", "medifined");
      formData.append("cloud_name", "doxyvufkz");


      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
        formData,
        {
          headers: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploading(false);
      return response.data.secure_url; // Return the uploaded image URL
      setUploading(false);
      return response.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      setUploading(false);
      console.error("Image upload failed:", error);
      Alert.alert(
        "Error", 
        "Failed to upload the image. Please try again or contact support if the issue persists."
      );
      return null;
    }
  };

  useEffect(() => {
    if (item?._id && item.req_name) {
      setMedicineName(item.req_name);
    }
  }, [item]);
  
  

  const handleRequestMedicine = async () => {
    if (!medicineName || !description || !image) {
      Alert.alert("Error", "Please fill all fields and upload an image.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not authenticated. Please login again.");
      return;
    }

    try {
      const uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) return;

      const orderData = {
        req_name: medicineName,
        req_description: description,
        prescription_img: uploadedImageUrl,
        user_id: userId,
      };
      if(item._id){

        const response = await updateOrder({id:item._id,body:orderData}).unwrap();
        console.log("Order updated successfully:", response.data);
        
      }
else
    {  const response = await addOrder(orderData).unwrap();
      console.log("Order added successfully:", response.data);  // Only log the data part

      Alert.alert(
        "Success",
        `Medicine Requested Successfully!\nName: ${medicineName}\nDescription: ${description}`
      );
    }

      // Reset fields after successful submission
      setMedicineName("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Failed to request medicine:", error);
      Alert.alert(
        "Error",
        error.data?.message || "Failed to request medicine. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Medicine</Text>
      <Icon name="favorite" size={50} color="#00bcd4" style={styles.icon} />

      {/* Medicine Name Input */}
      <View style={styles.inputContainer}>
                <TextInput
            style={styles.input}
            placeholder="Medicine Name"
            value={medicineName}
            onChangeText={(text) => setMedicineName(text)}
          />

      </View>

      {/* Description Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
        />
      </View>

      {/* Selected Image Preview */}
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      {/* Upload Image Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Icon name="photo-camera" size={24} color="#00bcd4" />
        <Text style={styles.uploadButtonText}>Select Image</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isAddingOrder && styles.disabledButton]}
        onPress={handleRequestMedicine}
        disabled={isAddingOrder}
      >
        <Text style={styles.submitButtonText}>
          {isAddingOrder ? "Submitting..." : "Request Medicine"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
    backgroundColor: "#e6e6e6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: "#00bcd4",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: "#00bcd4",
    marginBottom: 20,
    fontWeight: "bold",
  },
  icon: {
    marginBottom: 30,
  },
  icon: {
    marginBottom: 30,
  },
  inputContainer: {
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    marginBottom: 15,
  },
  input: {
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00bcd4",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#00bcd4",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00bcd4",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: "100%",
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: "#00bcd4",
    fontSize: 16,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#00bcd4",
    borderRadius: 8,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00bcd4",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: "100%",
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: "#00bcd4",
    fontSize: 16,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#00bcd4",
    borderRadius: 8,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 200,
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 200,
  },
});