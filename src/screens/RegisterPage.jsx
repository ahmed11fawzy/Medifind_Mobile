import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MyButton } from "../components/MyButton";
import { MyTextInput } from "../components/MyTextInput";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateAndSubmit = () => {
    let newErrors = {};
    const nameRegex = /^[A-z][A-z0-9-_]{3,23}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!name.trim()) newErrors.name = "Name is required.";
    else if (!nameRegex.test(name))
      newErrors.name = "Name must be at least 3 letters.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

    if (!password.trim()) newErrors.password = "Password is required.";
    else if (!passwordRegex.test(password))
      newErrors.password =
        "Must have 8+ chars, 1 uppercase, 1 number, 1 special char.";

    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required.";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Create your new account</Text>
            <View style={styles.formContainer}>
              <MyTextInput
                label="Enter your name"
                value={name}
                onChangeText={setName}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <MyTextInput
                label="Enter your Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <MyTextInput
                label="Enter your Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <MyTextInput
                label="Confirm your Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <MyButton title="Sign Up" onPress={validateAndSubmit} />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#01b3bd",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 50,
  },
  subtitle: {
    color: "white",
    textAlign: "center",
  },
  formContainer: {
    paddingTop: 20,
    marginTop: 50,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20, 
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginLeft: 30,
  },
});
