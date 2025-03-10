import * as React from "react";
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, HelperText } from "react-native-paper";
import { View, StyleSheet, Alert, Platform } from "react-native";
import { useState } from "react";
// Use conditional import for DateTimePicker based on platform
import DateTimePickerComponent from "../components/DateTimePickerComponent";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#28a985",
  },
};

export const AddMedicine = () => {
  const [medicineName, setMedicineName] = useState("");
  const [medicineDescription, setMedicineDescription] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!medicineName.trim()) {
      newErrors.medicineName = "Medicine name is required";
    }

    if (!medicineDescription.trim()) {
      newErrors.medicineDescription = "Medicine description is required";
    }

    if (!medicineQuantity.trim()) {
      newErrors.medicineQuantity = "Medicine quantity is required";
    } else if (isNaN(medicineQuantity) || parseInt(medicineQuantity) <= 0) {
      newErrors.medicineQuantity = "Quantity must be a positive number";
    }

    // Check if expiry date is in the future
    const today = new Date();
    if (expiryDate < today) {
      newErrors.expiryDate = "Expiry date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Format the date as YYYY-MM-DD
      const formattedDate = expiryDate.toISOString().split("T")[0];

      const medicineData = {
        name: medicineName,
        description: medicineDescription,
        quantity: parseInt(medicineQuantity),
        expiryDate: formattedDate,
      };

      console.log("Medicine data:", medicineData);
      Alert.alert("Success", "Medicine added successfully!");

      // Reset form
      setMedicineName("");
      setMedicineDescription("");
      setMedicineQuantity("");
      setExpiryDate(new Date());
      setErrors({});
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <TextInput
          label="Medicine Name"
          value={medicineName}
          onChangeText={setMedicineName}
          mode="outlined"
          style={styles.input}
          error={!!errors.medicineName}
        />
        {errors.medicineName && <HelperText type="error">{errors.medicineName}</HelperText>}

        <TextInput
          label="Description"
          value={medicineDescription}
          onChangeText={setMedicineDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          error={!!errors.medicineDescription}
        />
        {errors.medicineDescription && <HelperText type="error">{errors.medicineDescription}</HelperText>}

        <TextInput
          label="Quantity"
          value={medicineQuantity}
          onChangeText={setMedicineQuantity}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          error={!!errors.medicineQuantity}
        />
        {errors.medicineQuantity && <HelperText type="error">{errors.medicineQuantity}</HelperText>}

        <View style={styles.dateContainer}>
          <TextInput
            label="Expiry Date"
            value={formatDate(expiryDate)}
            mode="outlined"
            style={styles.dateInput}
            editable={false}
            error={!!errors.expiryDate}
          />
          <Button mode="contained" onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            Select Date
          </Button>
        </View>
        {errors.expiryDate && <HelperText type="error">{errors.expiryDate}</HelperText>}

        {/* Use our custom DateTimePicker component */}
        <DateTimePickerComponent
          show={showDatePicker}
          date={expiryDate}
          onChange={onChangeDate}
          onClose={() => setShowDatePicker(false)}
        />

        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
          Add Medicine
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
  },
  dateButton: {
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});

