import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useUserLoginMutation } from '../redux/Slice/user'
export default function Login({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [userLogin, { isLoading: isLoginLoading }] = useUserLoginMutation()
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
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            console.log('Form submitted:', { email, password })
            const userData = {
                'email': email,
                'password': password
            }
            try {
                const response = await userLogin(userData)
                console.log(response.data)
                if (response.data) {
                    const token = response?.data.headers?.get('x-auth-token')
                    console.log(token)
                    console.log('Login successful');
                    navigation.navigate('Home')
                }
                else { throw new Error('Login failed') }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
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
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#09c',
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
