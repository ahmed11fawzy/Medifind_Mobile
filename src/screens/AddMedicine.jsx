import Icon from "react-native-vector-icons/FontAwesome5";
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  PaperProvider,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  useAddMedicineMutation,
  useUpdateMedicineMutation,
} from "../redux/Slice/medicine";
import { useAuth } from "../hooks/useAuth";
import { useNavigation, useRoute } from "@react-navigation/native";

const theme = {
  colors: {
    primary: "#66d5c1",
    onSurfaceVariant: "#2ab5a0",
    background: "#ffffff",
    text: "#333",
    error: "#D32F2F",
  },
};

export const AddMedicine = () => {
  // States
  const [name, setName] = useState("");
  // Change this line - initialize with a Date object instead of empty string
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [concentration, setConcentration] = useState("");
  const [img, setImg] = useState("");
  const [isUploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Hooks (Always at the top)
  const [addMedicine, { isLoading, isError }] = useAddMedicineMutation();
  const [updateMedicine] = useUpdateMedicineMutation();
  const auth = useAuth();
  const navigation = useNavigation();
  const route = useRoute();

  const isAuthenticated = auth.isAuthenticated;
  const userId = auth.userId;

  const med_id = route.params?.med_id || null;

  const handleImagePick = async () => {
    console.log("Image picker clicked!");

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "medicine.jpg",
        });
        formData.append("upload_preset", "medifined");
        formData.append("cloud_name", "doxyvufkz");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setImg(response.data.secure_url);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    } finally {
      setUploading(false);
    }
  };

  const validateInputs = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Medicine name is required.";
    if (!date.trim()) newErrors.date = "Expire date is required.";
    if (!concentration.trim())
      newErrors.concentration = "Concentration is required.";
    if (!img) newErrors.img = "Medicine image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      const requestData = {
        name,
        expire_date: formattedDate, // Use formattedDate here
        concentration,
        image_path: img,
        user_id: userId,
      };

      if (med_id) {
        await updateMedicine({ id: med_id, ...requestData }).unwrap();
        Alert.alert("Success", "Medicine updated successfully!");
      } else {
        await addMedicine(requestData).unwrap();
        Alert.alert("Success", "Medicine added successfully!");
      }

      // Reset the form
      setName("");
      setDate("");
      setConcentration("");
      setImg("");
      setErrors({});
      navigation.navigate("Donations");
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Failed to process the medicine.");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        {/* Donation Icon */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Icon name="hand-holding-heart" size={50} color="#24d1b7" />
        </View>

        {/* Medicine Name Input */}
        <TextInput
          label="Medicine Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        {errors.name && <HelperText type="error">{errors.name}</HelperText>}

        {/* Expire Date Input */}
        <TextInput
          label="Expire Date "
          value={formattedDate} // Use formattedDate here
          onFocus={() => setShowDatePicker(true)}
          mode="outlined"
          style={styles.input}
          right={
            <TextInput.Icon
              icon="calendar"
              color="#43a694"
              onPress={() => setShowDatePicker(true)}
            />
          }
        />
        {errors.date && <HelperText type="error">{errors.date}</HelperText>}

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date} // This should be a Date object
            mode="date"
            display="calendar"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Medicine Concentration Input */}
        <TextInput
          label="Medicine Concentration"
          value={concentration}
          onChangeText={setConcentration}
          mode="outlined"
          style={styles.input}
        />
        {errors.concentration && (
          <HelperText type="error">{errors.concentration}</HelperText>
        )}

        {/* Image Upload Section */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity
            onPress={handleImagePick}
            style={styles.imagePicker}
          >
            <Icon
              name="camera"
              size={20}
              color="#43a694"
              style={{ marginRight: 10 }}
            />
            <Button mode="text" color="#43a694">
              {img ? "Change Image" : "Upload Image"}
            </Button>
          </TouchableOpacity>

          {/* Show Image Preview if Selected */}
          {img ? (
            <Image source={{ uri: img }} style={styles.imagePreview} />
          ) : null}
        </View>

        {errors.img && <HelperText type="error">{errors.img}</HelperText>}

        {/* Submit Button */}
        <Button
          style={styles.button}
          mode="contained"
          loading={isLoading || isUploading}
          disabled={isLoading || isUploading}
          textColor="white"
          onPress={handleSubmit}
        >
          {isLoading || isUploading
            ? "Processing..."
            : med_id
            ? "Update Medicine"
            : "Add Medicine"}
        </Button>

        {isError && (
          <HelperText type="error">Failed to process medicine</HelperText>
        )}
      </View>
    </PaperProvider>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
  },
  input: {
    marginBottom: 12,
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: "#24d1b7",
    marginTop: 15,
    width: "60%",
    borderRadius: 12,
    alignSelf: "center",
    paddingVertical: 10,
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
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#66d5c1",
    padding: 10,
    width: "100%",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginVertical: 10,
    resizeMode: "cover",
  },
});

export default AddMedicine;
