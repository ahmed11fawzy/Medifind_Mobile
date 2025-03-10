import * as React from "react";
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, HelperText } from "react-native-paper";
import { View, StyleSheet, Alert, Platform } from "react-native";
import  { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View>
      <Button title="Pick a Date" onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#28a985",
  },
};

export const AddMedicine = () => {
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState("");
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [concentration, setConcentration] = React.useState("");
  const [img, setImg] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      setDate(formattedDate);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!name) {
      newErrors.name = "Medicine name is required";
    } else if (/\d/.test(name)) {
      newErrors.name = "Medicine name should not contain numbers";
    }

    if (!date) {
      newErrors.date = "Expire date is required";
    } else {
      const enteredDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (enteredDate < today) {
        newErrors.date = "Expire date cannot be in the past";
      }
    }

    if (!concentration) {
      newErrors.concentration = "Medicine concentration is required";
    } else if (!/^\d+(mg|ml|%)$/.test(concentration)) {
      newErrors.concentration = "Invalid format (e.g., 500mg, 10ml, 2%)";
    }

    if (!img) {
      newErrors.img = "Image URL is required";
    // } else if (!/^https?:\/\/.*\.(jpeg|jpg|png|gif)$/.test(img)) {
    //   newErrors.img = "Invalid image URL (must end with .jpg, .png, .jpeg, .gif)";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert("Success", "Medicine added successfully!");
    setName("");
    setDate("");
    setConcentration("");
    setImg("");
    
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <TextInput
          label="Medicine Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        {errors.name && <HelperText type="error">{errors.name}</HelperText>}

        <TextInput
          label="Expire Date (YYYY-MM-DD)"
          value={date}
          onFocus={() => setShowDatePicker(true)} // Open picker when focused
          mode="outlined"
          style={styles.input}
          right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
        />
        {errors.date && <HelperText type="error">{errors.date}</HelperText>}

        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            minimumDate={new Date()} // Prevent past dates
            onChange={onChangeDate}
          />
        )}

        <TextInput
          label="Medicine Concentration"
          value={concentration}
          onChangeText={setConcentration}
          mode="outlined"
          style={styles.input}
        />
        {errors.concentration && <HelperText type="error">{errors.concentration}</HelperText>}

        <TextInput
          label="Medicine Image URL"
          value={img}
          onChangeText={setImg}
          mode="outlined"
          style={styles.input}
          right={<TextInput.Icon icon="camera" />}
        />
        {errors.img && <HelperText type="error">{errors.img}</HelperText>}

        <Button style={styles.button} mode="contained" onPress={handleSubmit}>
          Add
        </Button>
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
    paddingVertical: 10,
  },
  input: {
    backgroundColor: "#e5f8f7",
    marginBottom: 10,
    width: "100%",
    borderRadius: 10,
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#66d5c1",
    marginTop: 10,
    width: "40%",
    borderRadius: 10,
    alignSelf: "center",
  },
}
);

