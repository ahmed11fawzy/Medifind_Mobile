import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import { TextInput } from 'react-native-paper';
import { useUserLoginMutation } from '../redux/Slice/user'
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/Slice/authSlice';
import { decodeToken } from '../utils/tokenUtils';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [userLogin, { isLoading: isLoginLoading }] = useUserLoginMutation()
    const dispatch = useDispatch();
    
    const validateForm = () => {
        let newErrors = {}

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required'
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            newErrors.email = 'Email is invalid'
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required'
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }
        else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one special character, and one number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                console.log('Sending login request...');
                console.log(email, password);
                
                const response = await userLogin({
                    email: email.trim(),
                    password: password
                }).unwrap();

                console.log('Server response:', response);
                console.log('Response headers:', response.headers);

                if (response?.data) {

                    const token = response.headers.token || response.headers.authorization;
                    console.log('User Token:', token);

                    if (token) {
                        // Decode token to get user data
                        const decodedToken = decodeToken(token);
                        console.log('Decoded token:', decodedToken);
                        
                        // Save token and decoded data to Redux store
                        dispatch(setCredentials({ 
                            token, 
                            user: decodedToken || response.data 
                        }));
                        
                        Alert.alert('Success', 'Login successful');
                        navigation.navigate('RequestMedicine');
                    } else {
                        console.error('No token found in response');
                        Alert.alert('Login Error', 'Authentication token not found');
                    }

                }
            } catch (error) {
                console.error('Login error details:', error);

                // More detailed error logging
                if (error.status === 'FETCH_ERROR') {
                    console.error('Network error details:', error.error);

                    Alert.alert(
                        'Connection Error',
                        'Unable to reach the server. Please check your internet connection and make sure the server is running.'
                    );
                } else {
                    Alert.alert(
                        'Login Failed',
                        error.data?.message || 'Invalid credentials'
                    );
                }
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                mode="outlined"
                label="Email"
                placeholder="Enter your email"
                activeOutlineColor="#00b2bc"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
                mode="outlined"
                activeOutlineColor="#00b2bc"
                label="password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#00b2bc',
        width: '100%',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})