import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AddButton from '../components/AddButton'
import CloseButton from '../components/CloseButton'
import styles from '../styles/styles'

export default function AddProductScreen({ route, navigation }) {
  const theme = route.params.theme
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [store, setStore] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    if (!name.trim()) errors.name = 'Product name is required'
    if (!price.trim()) {
      errors.price = 'Price is required'
    } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      errors.price = 'Price must be a positive number'
    }
    if (!store.trim()) errors.store = 'Store name is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const add = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const pr = parseFloat(price)
      const final = isNaN(pr) ? 'NaN' : pr  
      const all = JSON.parse((await AsyncStorage.getItem('products')) || '[]')
      const newP = { 
        id: Date.now().toString(), 
        name, 
        price: final, 
        store, 
        description: description.trim() || 'Brak opisu', 
        purchased: false 
      }
      await AsyncStorage.setItem('products', JSON.stringify([newP, ...all]))
      navigation.goBack()
    } catch (err) {
      console.error('Error adding product:', err)
      setError('Failed to add product. Please try again.')
      setLoading(false)
    }
  }

  const bg = theme ? '#333' : '#f2f2f2'
  const fg = theme ? '#fff' : '#000'
  const inpBg = theme ? '#444' : '#fff'
  const ph = theme ? '#ccc' : '#888'

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.modalWrapper}>
        <CloseButton onPress={() => navigation.goBack()} />
        <ScrollView style={{width: '100%'}}>
          <View style={[styles.modalContainer, { backgroundColor: inpBg }]}>
            <Text style={[styles.modalTitle, { color: fg }]}>Dodaj produkt</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => setError(null)}>
                  <Text style={styles.retryButtonText}>Zamknij</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.inputRow}>
              {formErrors.name && <Text style={styles.formError}>{formErrors.name}</Text>}
              <TextInput
                style={[styles.modalInput, { flex: 1, color: fg }]}
                placeholder="Nazwa produktu"
                placeholderTextColor={ph}
                value={name}
                onChangeText={setName}
              />
              <TouchableOpacity onPress={() => setName('')}>
                <Text style={{ fontSize: 20, marginLeft: 6, color: 'red' }}>X</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputRow}>
              {formErrors.price && <Text style={styles.formError}>{formErrors.price}</Text>}
              <TextInput
                style={[styles.modalInput, { flex: 1, color: fg }]}
                placeholder="Cena"
                placeholderTextColor={ph}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <TouchableOpacity onPress={() => setPrice('')}>
                <Text style={{ fontSize: 20, marginLeft: 6, color: 'red' }}>X</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputRow}>
              {formErrors.store && <Text style={styles.formError}>{formErrors.store}</Text>}
              <TextInput
                style={[styles.modalInput, { flex: 1, color: fg }]}
                placeholder="Sklep"
                placeholderTextColor={ph}
                value={store}
                onChangeText={setStore}
              />
              <TouchableOpacity onPress={() => setStore('')}>
                <Text style={{ fontSize: 20, marginLeft: 6, color: 'red' }}>X</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.modalInput, { flex: 1, color: fg, height: 100, textAlignVertical: 'top' }]}
                placeholder="Opis produktu"
                placeholderTextColor={ph}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity onPress={() => setDescription('')}>
                <Text style={{ fontSize: 20, marginLeft: 6, color: 'red' }}>X</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              {loading ? (
                <ActivityIndicator size="large" color="#0080ff" />
              ) : (
                <AddButton onPress={add} />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}