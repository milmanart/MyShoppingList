import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AddButton from '../components/AddButton'
import styles from '../styles/styles'

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('do zakupu')
  const [filterStore, setFilterStore] = useState('')
  const [filterPrice, setFilterPrice] = useState('')
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme')
        if (theme) setIsDarkMode(JSON.parse(theme))
      } catch (err) {
        console.error('Ошибка при загрузке темы:', err)
      }
    }
    loadTheme()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const j = await AsyncStorage.getItem('products')
      if (j) setProducts(JSON.parse(j))
      setLoading(false)
    } catch (err) {
      console.error('Ошибка при загрузке продуктов:', err)
      setError('Не удалось загрузить список продуктов. Пожалуйста, попробуйте снова.')
      setLoading(false)
    }
  }
  
  useEffect(() => { loadProducts() }, [])
  useFocusEffect(useCallback(() => { loadProducts() }, []))

  const saveProducts = async list => {
    setSaveError(null)
    try {
      await AsyncStorage.setItem('products', JSON.stringify(list))
      return true
    } catch (err) {
      console.error('Ошибка при сохранении продуктов:', err)
      setSaveError('Не удалось сохранить изменения. Пожалуйста, попробуйте снова.')
      return false
    }
  }

  const toggleProductStatus = async id => {
    const updated = products.map(p =>
      p.id === id ? { ...p, purchased: !p.purchased } : p
    )
    setProducts(updated)
    const success = await saveProducts(updated)
    if (!success) {
      // Восстанавливаем предыдущее состояние, если сохранение не удалось
      setProducts(products)
    }
  }

  const deleteProduct = async id => {
    try {
      const updated = products.filter(p => p.id !== id)
      setProducts(updated)
      const success = await saveProducts(updated)
      if (!success) {
        // Восстанавливаем предыдущее состояние, если сохранение не удалось
        setProducts(products)
      }
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось удалить продукт. Пожалуйста, попробуйте снова.')
    }
  }

  const filterFn = p => {
    const s = !filterStore.trim() || p.store.toLowerCase().includes(filterStore.toLowerCase())
    const pr = !filterPrice.trim() || p.price <= parseFloat(filterPrice)
    return s && pr
  }

  const sections =
    activeTab === 'do zakupu'
      ? [{ title: 'Produkty do zakupu', data: products.filter(p => !p.purchased).filter(filterFn) }]
      : [{ title: 'Produkty kupione', data: products.filter(p => p.purchased).filter(filterFn) }]

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#f2f2f2' }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.sidebarButton} onPress={() => setSidebarVisible(true)}>
          <Text style={styles.sidebarButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
          {activeTab === 'do zakupu' ? 'Produkty do zakupu' : 'Produkty kupione'}
        </Text>
        <View style={styles.headerPlaceholder}/>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0080ff" />
          <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>
            Загрузка продуктов...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {saveError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{saveError}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => setSaveError(null)}>
                <Text style={styles.retryButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          )}

          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() => navigation.navigate('Details', { product: item, theme: isDarkMode })}
                >
                  <Text
                    style={[
                      styles.itemText,
                      { color: isDarkMode ? '#fff' : '#000' },
                      item.purchased && styles.purchasedText
                    ]}
                  >
                    {item.name} – {item.price} zł – {item.store}
                  </Text>
                </TouchableOpacity>
                <View style={styles.cardButtons}>
                  <TouchableOpacity
                    style={[styles.actionIconButton, { backgroundColor: '#4caf50' }]}
                    onPress={() => toggleProductStatus(item.id)}
                  >
                    <FontAwesome name="check" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionIconButton, { backgroundColor: '#ff4d4d' }]}
                    onPress={() => deleteProduct(item.id)}
                  >
                    <FontAwesome name="trash" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            renderSectionHeader={() => null}
            style={styles.list}
          />
        </>
      )}

      <AddButton
        onPress={() => navigation.navigate('Add', { theme: isDarkMode })}
        style={[styles.fabPosition, { bottom: 15 }]}
      />

      <Modal visible={sidebarVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
          <View style={styles.sidebarOverlay}/>
        </TouchableWithoutFeedback>
        <View style={[styles.sidebarContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
          <View>
            <TouchableOpacity
              style={styles.themeToggleButton}
              onPress={async () => {
                try {
                  const next = !isDarkMode
                  setIsDarkMode(next)
                  await AsyncStorage.setItem('theme', JSON.stringify(next))
                } catch (err) {
                  Alert.alert('Ошибка', 'Не удалось сохранить настройки темы')
                }
              }}
            >
              <Text style={styles.themeToggleIcon}>{isDarkMode ? '☀' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
              <FontAwesome name="search" size={24} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={() => { setActiveTab('do zakupu'); setSidebarVisible(false) }}
            >
              <Text style={[styles.sidebarItemText, { color: isDarkMode ? '#fff' : '#000' }]}>
                Produkty do zakupu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={() => { setActiveTab('kupione'); setSidebarVisible(false) }}
            >
              <Text style={[styles.sidebarItemText, { color: isDarkMode ? '#fff' : '#000' }]}>
                Produkty kupione
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={async () => {
              try {
                await AsyncStorage.removeItem('isLoggedIn')
                navigation.replace('Login')
              } catch (err) {
                Alert.alert('Ошибка', 'Не удалось выйти из системы. Пожалуйста, попробуйте снова.')
              }
            }}
          >
            <Text style={[styles.sidebarItemText, { color: isDarkMode ? '#fff' : '#000' }]}>
              Wyloguj się
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={filterModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalOverlay}/>
        </TouchableWithoutFeedback>
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
          <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Filtruj</Text>
          <TextInput
            style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000', marginBottom: 15 }]}
            placeholder="Sklep"
            placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
            value={filterStore}
            onChangeText={setFilterStore}
          />
          <TextInput
            style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000', marginBottom: 30 }]}
            placeholder="Cena ≤"
            placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
            keyboardType="numeric"
            value={filterPrice}
            onChangeText={setFilterPrice}
          />
          <TouchableOpacity
            style={styles.modalApplyButton}
            onPress={() => setFilterModalVisible(false)}
          >
            <FontAwesome name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}