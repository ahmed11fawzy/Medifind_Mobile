import React, { useLayoutEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, ActivityIndicator, Platform } from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAddOrderMutation, useGetOrderQuery, useUpdateOrderMutation  } from "../redux/Slice/order";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth"
import { MyButton } from "../components/MyButton";
import {MyTextInput} from "../components/MyTextInput"
import Icon from 'react-native-vector-icons/FontAwesome5';

export const Update = () => {
  const navigation = useNavigation();
  const route = useRoute();  // للحصول على البيانات التي تم تمريرها من صفحة Needs
  const { orderId } = route.params; 
  const { userId } = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({ medicineName: false, description: false });
  const [addOrder, { isLoading }] =  useAddOrderMutation();
  const { data: orderData, error } = useGetOrderQuery(orderId);
  const [updateOrder] = useUpdateOrderMutation();  
  const [medicineName, setMedicineName] = useState(orderData?.req_name || "");
  const [description, setDescription] = useState(orderData?.req_description || "");

  useLayoutEffect(() => {
   
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ 
          flexDirection: "row-reverse", 
          alignItems: "center", 
          justifyContent: navigation.canGoBack() ? "flex-start" : "center" 
        }}>
          <Image
            source={require("../../assets/logo.jpg")} 
            style={{ width: 30, height: 30, borderRadius: 15, marginLeft: navigation.canGoBack() ? 80 : 110 }} 
            resizeMode="contain"
          />
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>RequestMedicine</Text>
        </View>
      ),
    });
  }, [navigation, orderId]);
  const handleSubmit = async () => {
    try {
      const updatedOrder = {
        req_name: medicineName,
        req_description: description,
        prescription_img: imageUri,
      };
      await updateOrder({ id: orderId, body: updatedOrder }).unwrap();
      navigation.navigate("Needs");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  
  const pickImage = async () => {
    try {
      const isWeb = Platform.OS === 'web';
      if (isWeb) {
        console.log("Using web file picker");
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        const filePromise = new Promise((resolve) => {
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve({
                  uri: file,
                  base64: base64,
                  width: 300, 
                  height: 300
                });
              };
              reader.readAsDataURL(file);
            } else {
              resolve(null);
            }
          };
        });
        input.click();
        const result = await filePromise;
        if (result) {
          await uploadImageToCloudinary(result);
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access media library is required.");
          return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: true,
        });

        if (!result.canceled) {
          await uploadImageToCloudinary(result.assets[0]);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image. Please try again.");
    }
  };
  const uploadImageToCloudinary = async (imageAsset) => {
    setUploading(true);
    try {
      const isWeb = Platform.OS === 'web';
      let formData = new FormData();
      
      if (isWeb) {
        if (imageAsset.base64) {
          const base64Response = await fetch(`data:image/jpeg;base64,${imageAsset.base64}`);
          const blob = await base64Response.blob();
          formData.append("file", blob);
        } else {
          formData.append("file", imageAsset.uri);
        }
      } else {
        formData.append("file", {
          uri: imageAsset.uri,
          type: "image/jpeg",
          name: "upload.jpg",
        });
      }
      formData.append("upload_preset", "medifined");
      formData.append("cloud_name", "doxyvufkz");

      console.log("Uploading to Cloudinary...");
      
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful:", response.data);
      setImageUri(response.data.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        if (error.response.data.error && error.response.data.error.message) {
          if (error.response.data.error.message.includes("upload preset")) {
            alert("Cloudinary Error: Upload preset 'medifined' not found or not properly configured. Please check your Cloudinary settings.");
          } else {
            alert(`Failed to upload image: ${error.response.data.error.message}`);
          }
        } else {
          alert(`Failed to upload image: ${error.response.status} ${error.response.statusText}`);
        }
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("Failed to upload image: No response from server");
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to upload image: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };
  const validateForm = async () => {
     let newErrors = {
       medicineName: medicineName.trim() === "",
       description: description.trim() === "",
     };
 
     setErrors(newErrors);
 
     if (!newErrors.medicineName && !newErrors.description) {
       try {
         if (!imageUri) {
           alert("Please upload a prescription image");
           return;
         }
         
         const orderData = {
           req_name: medicineName,
           req_description: description,
           prescription_img: imageUri,
           requested: true,
           status: false,
           examined: false,
           user_id: userId,        
       };
 
       console.log("🚀 Sending order data:", orderData);
 
         try {
           const result = await addOrder(orderData).unwrap();
           console.log('order added successfully:', result);
           alert("order submitted successfully!");
           resetForm();
           navigation.navigate("Needs");
         } catch (apiError) {
           console.error('API Error:', apiError);
           let errorMessage = 'Unknown error';
           try {
             if (typeof apiError.data === 'string') {
               const errorData = JSON.parse(apiError.data);
               errorMessage = errorData.data || 'Server error';
               console.log('Full error data:', errorData);
             } else if (apiError.data && apiError.data.data) {
               errorMessage = apiError.data.data;
             }
           } catch (e) {
             console.error('Error parsing error message:', e);
             errorMessage = apiError.message || 'Server error';
           }
           
           alert(`Request failed: ${errorMessage}`);
         }
       } catch (error) {
         console.error("Submission error:", error);
         alert("Failed to submit request. Please try again later.");
       }
     }
   };
  
  const resetForm = () => {
    setMedicineName("");
    setDescription("");
    setImageUri(null);
    setErrors({ medicineName: false, description: false });
  };

  return (
    <View style={styles.container}>
     <Icon name="hand-holding-medical" size={40} color="#01b3bd" style={{marginBottom: 60,marginTop: -30}} />
    <View style={styles.imagePickerContainer}>
  <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
    <Icon name="camera" size={20} color="#01b3bd" style={styles.cameraIcon } />
    <Button mode="text" color="#01b3bd">
      {imageUri ?imageUri.split('/').pop() : "Upload Medicine Image"}
    </Button>
  </TouchableOpacity>
</View>
      <MyTextInput
        label="Medicine Name"
        value={medicineName}
        onChangeText={setMedicineName}
        mode="outlined"
        style={[styles.input, styles.customInput]}
        theme={{ colors: { primary: errors.medicineName ? "red" : "#888" } }}
        error={errors.medicineName}
      />
      {errors.medicineName && <Text style={styles.errorText}>Medicine name is required.</Text>}
      <MyTextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.customInput, styles.descriptionInput]}
        theme={{ colors: { primary: errors.description ? "red" : "#888" } }}
        error={errors.description}
      />
      {errors.description && <Text style={styles.errorText}>Description is required.</Text>}
      <MyButton title="Add Request" onPress={handleSubmit}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  customInput: {
    backgroundColor: "#fff",
    fontSize: 12,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
   imagePickerContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFBFE",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#32323390",
    padding: 5,
    width: "100%",
    height: 55,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginVertical: 10,
    resizeMode: "cover",
  },
  cameraIcon: {
    backgroundColor: "#FFFBFE",
    padding: 3,
    borderRadius: 50,
  },
  
});
