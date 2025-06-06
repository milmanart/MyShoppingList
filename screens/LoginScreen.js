import React, { useState, useContext } from 'react'
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native'
import { AuthContext } from '../AuthContext'
import styles from '../styles/styles'

export default function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola')
      return
    }
    try {
      await signIn(email.trim(), password)
    } catch (e) {
      Alert.alert('Błąd logowania', e.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.loginTitle, { marginBottom: 20 }]}>Logowanie</Text>
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Zaloguj się</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Nie masz konta? <Text style={{ fontWeight: 'bold' }}>Zarejestruj się</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
