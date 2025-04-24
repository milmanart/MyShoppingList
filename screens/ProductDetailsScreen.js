import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import CloseButton from '../components/CloseButton'
import styles from '../styles/styles'

export default function ProductDetailsScreen({ route, navigation }) {
  const { product: initialProduct, theme } = route.params
  const [product, setProduct] = useState(initialProduct)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const loadProductData = async () => {
    try {
      const allProducts = JSON.parse((await AsyncStorage.getItem('products')) || '[]')
      const currentProduct = allProducts.find(p => p.id === initialProduct.id)
      if (currentProduct) {
        setProduct(currentProduct)
      }
    } catch (err) {
      console.error('Ошибка при загрузке данных продукта:', err)
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      loadProductData()
      return () => {}
    }, [initialProduct.id])
  )


  const deleteProduct = async () => {
    Alert.alert(
      'Potwierdzenie usunięcia',
      `Czy na pewno chcesz usunąć ${product.name}?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        { 
          text: 'Usuń', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true)
            setError(null)
            
            try {
              const allProducts = JSON.parse((await AsyncStorage.getItem('products')) || '[]')
              const updatedProducts = allProducts.filter(p => p.id !== product.id)
              await AsyncStorage.setItem('products', JSON.stringify(updatedProducts))
              navigation.navigate('Home')
            } catch (err) {
              console.error('Błąd podczas usuwania produktu:', err)
              setError('Nie można usunąć produktu. Spróbuj ponownie.')
              setLoading(false)
            }
          } 
        }
      ]
    )
  }


  const togglePurchaseStatus = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const allProducts = JSON.parse((await AsyncStorage.getItem('products')) || '[]')
      const updatedProducts = allProducts.map(p =>
        p.id === product.id ? { ...p, purchased: !p.purchased } : p
      )
      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts))
      setProduct({ ...product, purchased: !product.purchased })
      setLoading(false)
    } catch (err) {
      console.error('Błąd podczas zmiany statusu produktu:', err)
      setError('Nie można zmienić statusu produktu. Spróbuj ponownie.')
      setLoading(false)
    }
  }


  const bg = theme ? '#333' : '#f2f2f2'
  const fg = theme ? '#fff' : '#000'
  const cardBg = theme ? '#444' : '#fff'
  const statusBgColor = product.purchased ? '#4caf50' : '#ff9800'

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      
      <View style={styles.headerContainer}>
        <CloseButton onPress={() => navigation.goBack()} />
        <Text style={[styles.title, { color: fg }]}>Szczegóły produktu</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0080ff" />
          <Text style={[styles.loadingText, { color: fg }]}>Ładowanie...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => setError(null)}>
            <Text style={styles.retryButtonText}>Zamknij</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.modalWrapper}>
          <ScrollView style={{width: '100%'}}>
            <View style={[styles.detailsContainer, theme && { backgroundColor: cardBg }]}>
              <Text style={[styles.detailsTitle, { color: fg }]}>{product.name}</Text>
              
              <View style={styles.detailsRow}>
                <Text style={[styles.detailsLabel, { color: fg }]}>Cena:</Text>
                <Text style={[styles.detailsValue, { color: fg }]}>
                  {product.price === 'NaN' ? 'Nie określono' : `${product.price} zł`}
                </Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Text style={[styles.detailsLabel, { color: fg }]}>Sklep:</Text>
                <Text style={[styles.detailsValue, { color: fg }]}>{product.store}</Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Text style={[styles.detailsLabel, { color: fg }]}>Status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
                  <Text style={styles.statusText}>
                    {product.purchased ? 'Kupione' : 'Do kupienia'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailsRow}>
                <Text style={[styles.detailsLabel, { color: fg }]}>Opis:</Text>
              </View>
              <View style={[styles.detailsDescription, { borderColor: theme ? '#555' : '#ddd' }]}>
                <Text style={[styles.detailsValue, { color: fg }]}>
                  {product.description || 'Brak opisu'}
                </Text>
              </View>
            </View>

          
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#0080ff' }]}
                onPress={togglePurchaseStatus}
              >
                <Text style={styles.actionButtonText}>
                  {product.purchased ? 'Oznacz jako niekupione' : 'Oznacz jako kupione'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#ffa500' }]}
                onPress={() => navigation.navigate('Edit', { product, theme })}
              >
                <Text style={styles.actionButtonText}>Edytuj</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#ff4d4d' }]}
                onPress={deleteProduct}
              >
                <Text style={styles.actionButtonText}>Usuń</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  )
}