import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore } from '../firebase'
import CloseButton from '../components/CloseButton'
import styles from '../styles/styles'

export default function ProductDetailsScreen({ route, navigation }) {
  const { product: initialProduct, theme } = route.params
  const [product, setProduct] = useState(initialProduct)
  const [loading, setLoading] = useState(false)

  const loadProductData = async () => {
    try {
      const ref = doc(firestore, 'products', initialProduct.id)
      const snap = await getDoc(ref)
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() })
    } catch {}
  }

  useFocusEffect(
    useCallback(() => {
      loadProductData()
    }, [initialProduct.id]),
  )

  const deleteProduct = () => {
    Alert.alert('Usuwanie', `Czy na pewno chcesz usunąć "${product.name}"?`, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          setLoading(true)
          try {
            await deleteDoc(doc(firestore, 'products', product.id))
            navigation.navigate('Home')
          } catch {
            Alert.alert('Błąd', 'Nie udało się usunąć produktu')
            setLoading(false)
          }
        },
      },
    ])
  }

  const togglePurchaseStatus = async () => {
    setLoading(true)
    try {
      const ref = doc(firestore, 'products', product.id)
      await updateDoc(ref, { purchased: !product.purchased })
      setProduct(prev => ({ ...prev, purchased: !prev.purchased }))
    } catch {
      Alert.alert('Błąd', 'Nie udało się zmienić statusu')
    } finally {
      setLoading(false)
    }
  }

  const bg = theme ? '#333' : '#f2f2f2'
  const fg = theme ? '#fff' : '#000'
  const cardBg = theme ? '#444' : '#fff'
  const statusColor = product.purchased ? '#4caf50' : '#ff9800'

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.headerContainer}>
        <CloseButton onPress={() => navigation.goBack()} />
        <Text style={[styles.title, { color: fg }]}>Szczegóły</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0080ff" />
          <Text style={[styles.loadingText, { color: fg }]}>Ładowanie...</Text>
        </View>
      ) : (
        <ScrollView style={styles.modalWrapper}>
          <View style={[styles.detailsContainer, { backgroundColor: cardBg }]}>
            <Text style={[styles.detailsTitle, { color: fg }]}>{product.name}</Text>

            <View style={styles.detailsRow}>
              <Text style={[styles.detailsLabel, { color: fg }]}>Cena:</Text>
              <Text style={[styles.detailsValue, { color: fg }]}>{product.price} zł</Text>
            </View>

            <View style={styles.detailsRow}>
              <Text style={[styles.detailsLabel, { color: fg }]}>Sklep:</Text>
              <Text style={[styles.detailsValue, { color: fg }]}>{product.store}</Text>
            </View>

            <View style={styles.detailsRow}>
              <Text style={[styles.detailsLabel, { color: fg }]}>Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{product.purchased ? 'Kupione' : 'Do kupienia'}</Text>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <Text style={[styles.detailsLabel, { color: fg }]}>Opis:</Text>
            </View>
            <View style={[styles.detailsDescription, { borderColor: theme ? '#555' : '#ddd' }]}>
              <Text style={[styles.detailsValue, { color: fg }]}>{product.description}</Text>
            </View>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#0080ff' }]} onPress={togglePurchaseStatus}>
              <Text style={styles.actionButtonText}>{product.purchased ? 'Oznacz niekupione' : 'Oznacz kupione'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ffa500' }]}
              onPress={() => navigation.navigate('Edit', { product, theme })}
            >
              <Text style={styles.actionButtonText}>Edytuj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ff4d4d' }]} onPress={deleteProduct}>
              <Text style={styles.actionButtonText}>Usuń</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  )
}
