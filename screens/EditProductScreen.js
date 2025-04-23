import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AddButton from '../components/AddButton'
import CloseButton from '../components/CloseButton'
import styles from '../styles/styles'

export default function EditProductScreen({ route, navigation }) {
  const { product, theme } = route.params
  const [name, setName] = useState(product.name)
  const [price, setPrice] = useState(product.price.toString())
  const [store, setStore] = useState(product.store)
  const [description, setDescription] = useState(product.description || 'Brak opisu')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    if (!name.trim()) errors.name = 'u041du0435u043eu0431u0445u043eu0434u0438u043cu043e u0443u043au0430u0437u0430u0442u044c u043du0430u0437u0432u0430u043du0438u0435 u043fu0440u043eu0434u0443u043au0442u0430'
    if (!price.trim()) {
      errors.price = 'u041du0435u043eu0431u0445u043eu0434u0438u043cu043e u0443u043au0430u0437u0430u0442u044c u0446u0435u043du0443'
    } else if (parseFloat(price) < 0) {
      errors.price = 'u0426u0435u043du0430 u0434u043eu043bu0436u043du0430 u0431u044bu0442u044c u043fu043eu043bu043eu0436u0438u0442u0435u043bu044cu043du044bu043c u0447u0438u0441u043bu043eu043c'
    }
    // u0420u0430u0437u0440u0435u0448u0430u0435u043c u0432u0432u043eu0434 NaN u0434u043bu044f u0446u0435u043du044b
    if (!store.trim()) errors.store = 'u041du0435u043eu0431u0445u043eu0434u0438u043cu043e u0443u043au0430u0437u0430u0442u044c u043cu0430u0433u0430u0437u0438u043d'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const saveEditedProduct = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const pr = parseFloat(price)
      const final = isNaN(pr) ? 'NaN' : pr  // Изменено с 0 на 'NaN'
      const all = JSON.parse((await AsyncStorage.getItem('products')) || '[]')
      const updated = all.map(p =>
        p.id === product.id ? { ...p, name, price: final, store, description: description.trim() || 'Brak opisu' } : p
      )
      await AsyncStorage.setItem('products', JSON.stringify(updated))
      navigation.goBack()
    } catch (err) {
      console.error('u041eu0448u0438u0431u043au0430 u043fu0440u0438 u0440u0435u0434u0430u043au0442u0438u0440u043eu0432u0430u043du0438u0438 u043fu0440u043eu0434u0443u043au0442u0430:', err)
      setError('u041du0435 u0443u0434u0430u043bu043eu0441u044c u0441u043eu0445u0440u0430u043du0438u0442u044c u0438u0437u043cu0435u043du0435u043du0438u044f. u041fu043eu0436u0430u043bu0443u0439u0441u0442u0430, u043fu043eu043fu0440u043eu0431u0443u0439u0442u0435 u0441u043du043eu0432u0430.')
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
            <Text style={[styles.modalTitle, { color: fg }]}>Edytuj produkt</Text>
            
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
                <AddButton onPress={saveEditedProduct} />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}