import React, { useState, useEffect, useCallback, useContext } from 'react'
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
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { firestore, auth } from '../firebase'
import { AuthContext } from '../AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AddButton from '../components/AddButton'
import styles from '../styles/styles'

export default function HomeScreen({ navigation }) {
  const { signOut } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('do zakupu')
  const [filterStore, setFilterStore] = useState('')
  const [filterPrice, setFilterPrice] = useState('')
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    AsyncStorage.getItem('theme').then(v => v && setIsDarkMode(JSON.parse(v)))
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const q = query(
        collection(firestore, 'products'),
        where('ownerId', '==', auth.currentUser.uid)
      )
      const snap = await getDocs(q)
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch {
      setError('Nie udało się pobrać listy produktów')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, [])
  )

  const toggleProductStatus = async p => {
    try {
      await updateDoc(doc(firestore, 'products', p.id), {
        purchased: !p.purchased
      })
      fetchProducts()
    } catch {
      Alert.alert('Błąd', 'Nie udało się zmienić statusu')
    }
  }

  const deleteProduct = async p => {
    try {
      await deleteDoc(doc(firestore, 'products', p.id))
      fetchProducts()
    } catch {
      Alert.alert('Błąd', 'Nie udało się usunąć produktu')
    }
  }

  const filterFn = p =>
    (!filterStore.trim() || p.store.toLowerCase().includes(filterStore.toLowerCase())) &&
    (!filterPrice.trim() || p.price <= parseFloat(filterPrice))

  const sections =
    activeTab === 'do zakupu'
      ? [{ title: 'Do zakupu', data: products.filter(p => !p.purchased).filter(filterFn) }]
      : [{ title: 'Kupione', data: products.filter(p => p.purchased).filter(filterFn) }]

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
          <ActivityIndicator size="large" color="#0080ff"/>
          <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>Ładowanie...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
                  onPress={() => toggleProductStatus(item)}
                >
                  <FontAwesome name="check" size={16} color="#fff"/>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionIconButton, { backgroundColor: '#ff4d4d' }]}
                  onPress={() => deleteProduct(item)}
                >
                  <FontAwesome name="trash" size={16} color="#fff"/>
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderSectionHeader={() => null}
          style={styles.list}
        />
      )}
      <AddButton onPress={() => navigation.navigate('Add', { theme: isDarkMode })} style={[styles.fabPosition, { bottom: 15 }]}/>
      <Modal visible={sidebarVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
          <View style={styles.sidebarOverlay}/>
        </TouchableWithoutFeedback>
        <View style={[styles.sidebarContainer, { backgroundColor: isDarkMode ? '#444' : '#fff', justifyContent: 'space-between' }]}>
          <View>
            <TouchableOpacity
              style={styles.themeToggleButton}
              onPress={async () => {
                const next = !isDarkMode
                setIsDarkMode(next)
                await AsyncStorage.setItem('theme', JSON.stringify(next))
              }}
            >
              <Text style={styles.themeToggleIcon}>{isDarkMode ? '☀' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
              <FontAwesome name="search" size={24} color={isDarkMode ? '#fff' : '#000'}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={() => { setActiveTab('do zakupu'); setSidebarVisible(false) }}
            >
              <Text style={[styles.sidebarItemText, { color: isDarkMode ? '#fff' : '#000' }]}>Produkty do zakupu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={() => { setActiveTab('kupione'); setSidebarVisible(false) }}
            >
              <Text style={[styles.sidebarItemText, { color: isDarkMode ? '#fff' : '#000' }]}>Produkty kupione</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignSelf: 'flex-start', marginLeft: 16 }}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000', marginBottom: 8 }}>
              {auth.currentUser.email}
            </Text>
            <TouchableOpacity style={styles.sidebarItem} onPress={signOut}>
              <Text style={[styles.sidebarItemText, { color: isDarkMode ? '#fff' : '#000' }]}>Wyloguj się</Text>
            </TouchableOpacity>
          </View>
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
          <TouchableOpacity style={styles.modalApplyButton} onPress={() => setFilterModalVisible(false)}>
            <FontAwesome name="search" size={24} color="#fff"/>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
