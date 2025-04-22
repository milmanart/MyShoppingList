import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '../styles/styles'

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem('theme').then(v => v && setIsDarkMode(JSON.parse(v)))
    AsyncStorage.getItem('isLoggedIn').then(v => {
      if (v === 'true') navigation.replace('Home')
    })
  }, [])

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return
    await AsyncStorage.setItem('isLoggedIn', 'true')
    navigation.replace('Home')
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#f2f2f2' }]}>
      <Text style={[styles.loginTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Lista zakupów</Text>
      <View style={[styles.loginForm, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
        <TextInput
          style={[styles.loginInput, { color: isDarkMode ? '#fff' : '#000' }]}
          placeholder="Nazwa użytkownika"
          placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.loginInput, { color: isDarkMode ? '#fff' : '#000' }]}
          placeholder="Hasło"
          placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Zaloguj się</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
