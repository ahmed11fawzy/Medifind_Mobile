import React from "react";
import { Alert, StyleSheet, Text, Touchable, TouchableHighlight, View, } from "react-native";
import { useUserLoginMutation, useGetAllUsersQuery, } from "../redux/Slice/user";
export function Home() {
  const { data: users, isLoading, isError, } = useGetAllUsersQuery();

  const [login, { isLoading: isLoginLoading }] =
    useUserLoginMutation();
  const userData = {
    email: "Ahmed11@gmail.com",
    password: "Ahmed11@",
  };
  const handleLogin = async () => {
    try {
      const response = await login(userData);
      console.log('Full response:', response);
      if (response.data) {
        // Try different ways to access the header
        const token = response.data.headers?.get('x-auth-token') ||
          response.data.headers?.['x-auth-token'] ||
          response.headers?.['x-auth-token'];

        if (token) {
          console.log('Token found:', token);
          Alert.alert("Success", "Login successful");
        } else {
          console.log('Headers:', response.data.headers);
          Alert.alert("Warning", "No token found in response");
        }
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert("Error", "Something went wrong");
    }
  };
  console.log(users)


  return (
    <View>
      <Text>Home</Text>
      <TouchableHighlight onPress={handleLogin}>
        <View style={styles.btn}>
          <Text>Login</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  btn: {
    backgroundColor: "#09c",
  },
});
