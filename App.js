import React, { useContext } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider, AuthContext } from './AuthContext'
import AuthStack from './navigation/AuthStack'
import AppStack from './navigation/AppStack'

function RootNavigator() {
  const { user, loading } = useContext(AuthContext)
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  return user ? <AppStack /> : <AuthStack />
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}
