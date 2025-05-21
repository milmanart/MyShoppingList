import React, { useState, useContext } from 'react'
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native'
import { AuthContext } from '../AuthContext'
import styles from '../styles/styles'

export default function RegisterScreen({ navigation }) {
  const { signUp } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola')
      return
    }
    try {
      await signUp(email.trim(), password)
    } catch (e) {
      Alert.alert('Błąd rejestracji', e.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.loginTitle, { marginBottom: 20 }]}>Rejestracja</Text>
      <View style={styles.loginForm}>
        <TextInput
          style={styles.loginInput}
          placeholder="Email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Hasło"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={styles.loginButtonText}>Zarejestruj się</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>
            Masz już konto? <Text style={{ fontWeight: 'bold' }}>Zaloguj się</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
