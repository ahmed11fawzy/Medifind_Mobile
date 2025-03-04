import React, { useLayoutEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native"; 

export const RequestMedicine = () => {
    const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [medicineName, setMedicineName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ medicineName: false, description: false });

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
  }, [navigation]);
  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    let newErrors = {
      medicineName: medicineName.trim() === "",
      description: description.trim() === "",
    };

    setErrors(newErrors);

    if (!newErrors.medicineName && !newErrors.description) {
      console.log("Medicine Name:", medicineName);
      console.log("Description:", description);
      alert("Request submitted successfully!");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={styles.plusContainer}>
            <Text style={styles.plusText}>+</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        label="Medicine Name"
        value={medicineName}
        onChangeText={setMedicineName}
        mode="outlined"
        style={[styles.input, styles.customInput]}
        theme={{ colors: { primary: errors.medicineName ? "red" : "#888" } }}
        error={errors.medicineName}
      />
      {errors.medicineName && <Text style={styles.errorText}>Medicine name is required.</Text>}
      <TextInput
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
      <Button mode="contained" onPress={validateForm} style={styles.button}>
        Save
      </Button>
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
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  plusContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 50,
    color: "#888",
    fontWeight: "bold",
    position: "absolute",
    top: -12,
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
});
