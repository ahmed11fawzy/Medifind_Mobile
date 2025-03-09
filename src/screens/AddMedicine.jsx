
import Icon from 'react-native-vector-icons/FontAwesome5';
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { TextInput, Button, HelperText, PaperProvider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAddMedicineMutation } from "../redux/Slice/medicine"; 

const theme = {
  colors: {
    primary: "#66d5c1",
    onSurfaceVariant: "#2ab5a0",
    background: "#f0fdf9",
    text: "#333",
    error: "#D32F2F",
  },

};

export const AddMedicine = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [concentration, setConcentration] = useState("");
  const [img, setImg] = useState("");
  const [isUploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const [addMedicine, { isLoading, isError }] = useAddMedicineMutation();

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
        setUploading(false);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const validateInputs = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Medicine name is required.";
    if (!date.trim()) newErrors.date = "Expire date is required.";
    if (!concentration.trim()) newErrors.concentration = "Concentration is required.";
    if (!img) newErrors.img = "Medicine image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      await addMedicine({ name, expire_date: date, concentration, image_path: img }).unwrap();
      Alert.alert("Success", "Medicine added successfully!");
      setName("");
      setDate("");
      setConcentration("");
      setImg("");
      setErrors({});
    } catch (error) {
      Alert.alert("Error", "Failed to add medicine.");
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
            outlineColor="transparent"
        />
        {errors.name && <HelperText type="error">{errors.name}</HelperText>}

        {/* Expire Date Input */}
        <TextInput
          label="Expire Date "
          value={date}
          onFocus={() => setShowDatePicker(true)}
          mode="outlined"
          outlineColor="transparent"
          style={styles.input}
          right={<TextInput.Icon icon="calendar" color="#43a694" onPress={() => setShowDatePicker(true)} />}
        />
        {errors.date && <HelperText type="error">{errors.date}</HelperText>}

        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display="calendar"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate.toISOString().split("T")[0]);
              }
            }}
          />
        )}

        {/* Medicine Concentration Input */}
        <TextInput
          label="Medicine Concentration"
          labelStyle={{ fontSize: 38 }}
          value={concentration}
          onChangeText={setConcentration}
          mode="outlined"
          outlineColor="transparent"
          style={styles.input}
        />
        {errors.concentration && <HelperText type="error">{errors.concentration}</HelperText>}

        {/* Image Upload Section */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
            <Icon name="camera" size={20} color="#43a694" style={{ marginRight: 10 }} />
            <Button mode="text" color="#43a694">
              {img ? "Change Image" : "Upload Image"}
            </Button>
          </TouchableOpacity>

          {/* Show Image Preview if Selected */}
          {img ? <Image source={{ uri: img }} style={styles.imagePreview} /> : null}
        </View>

        {errors.img && <HelperText type="error">{errors.img}</HelperText>}

        {/* Submit Button */}
        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading || isUploading}
          disabled={isLoading || isUploading}
          textColor="white"
        >
          {isLoading || isUploading ? "Adding..." : "Add Medicine"}
        </Button>

        {isError && <HelperText type="error">Failed to add medicine</HelperText>}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f0fdf9",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 12,
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "transparent",
    elevation:5,
  },
  button: {
    backgroundColor: "#24d1b7",
    marginTop: 15,
    width: "60%",
    borderRadius: 12,
    alignSelf: "center",
    paddingVertical: 10,
    elevation: 3,
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
    elevation: 2,
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

