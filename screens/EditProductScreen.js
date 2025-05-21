import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import { doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebase'
import AddButton from '../components/AddButton'
import CloseButton from '../components/CloseButton'
import styles from '../styles/styles'

export default function EditProductScreen({ route, navigation }) {
  const { product, theme } = route.params
  const [name, setName] = useState(product.name)
  const [price, setPrice] = useState(String(product.price))
  const [store, setStore] = useState(product.store)
  const [description, setDescription] = useState(product.description)
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    if (!name.trim()) errors.name = 'Nazwa wymagana'
    if (!price.trim()) errors.price = 'Cena wymagana'
    else if (isNaN(parseFloat(price)) || parseFloat(price) < 0)
      errors.price = 'Cena musi być liczbą dodatnią'
    if (!store.trim()) errors.store = 'Sklep wymagany'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const saveChanges = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      await updateDoc(doc(firestore, 'products', product.id), {
        name: name.trim(),
        price: parseFloat(price),
        store: store.trim(),
        description: description.trim() || 'Brak opisu',
      })
      navigation.goBack()
    } catch {
      Alert.alert('Błąd', 'Nie udało się zapisać zmian')
    } finally {
      setLoading(false)
    }
  }

  const bg = theme ? '#333' : '#f2f2f2'
  const inpBg = theme ? '#444' : '#fff'
  const fg = theme ? '#fff' : '#000'
  const ph = theme ? '#ccc' : '#888'

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <CloseButton onPress={() => navigation.goBack()} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: 'center',
          padding: 20,
          backgroundColor: inpBg,
          borderRadius: 8,
        }}
      >
        <Text style={[styles.modalTitle, { color: fg }]}>Edytuj produkt</Text>

        <View style={{ width: '100%', marginVertical: 8 }}>
          <TextInput
            style={[styles.modalInput, { color: fg }]}
            placeholder="Nazwa produktu"
            placeholderTextColor={ph}
            value={name}
            onChangeText={setName}
          />
          {formErrors.name && <Text style={styles.formError}>{formErrors.name}</Text>}
        </View>

        <View style={{ width: '100%', marginVertical: 8 }}>
          <TextInput
            style={[styles.modalInput, { color: fg }]}
            placeholder="Cena"
            placeholderTextColor={ph}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          {formErrors.price && <Text style={styles.formError}>{formErrors.price}</Text>}
        </View>

        <View style={{ width: '100%', marginVertical: 8 }}>
          <TextInput
            style={[styles.modalInput, { color: fg }]}
            placeholder="Sklep"
            placeholderTextColor={ph}
            value={store}
            onChangeText={setStore}
          />
          {formErrors.store && <Text style={styles.formError}>{formErrors.store}</Text>}
        </View>

        <View style={{ width: '100%', marginVertical: 8 }}>
          <TextInput
            style={[styles.modalInput, { color: fg, height: 100, textAlignVertical: 'top' }]}
            placeholder="Opis"
            placeholderTextColor={ph}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          {loading ? <ActivityIndicator size="large" color="#0080ff" /> : <AddButton onPress={saveChanges} />}
        </View>
      </ScrollView>
    </View>
  )
}
