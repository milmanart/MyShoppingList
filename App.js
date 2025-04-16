import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';

function MyApp() {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStore, setEditStore] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('do zakupu');
  const [filterStore, setFilterStore] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    loadProducts();
    loadTheme();
  }, []);
  useEffect(() => {
    saveProducts();
  }, [products]);
  useEffect(() => {
    saveTheme();
  }, [isDarkMode]);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) setProducts(JSON.parse(storedProducts));
    } catch (error) {
      console.error('Błąd podczas ładowania listy:', error);
    }
  };
  const saveProducts = async () => {
    try {
      await AsyncStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Błąd podczas zapisywania listy:', error);
    }
  };
  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) setIsDarkMode(JSON.parse(storedTheme));
    } catch (error) {
      console.error('Błąd podczas ładowania motywu:', error);
    }
  };
  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem('theme', JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Błąd podczas zapisywania motywu:', error);
    }
  };

  const addProduct = () => {
    if (!name.trim() || !price.trim() || !store.trim()) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola!');
      return;
    }
    const parsedPrice = parseFloat(price);
    const finalPrice = isNaN(parsedPrice) ? 'NaN' : parsedPrice;
    const newProduct = {
      id: Date.now().toString(),
      name,
      price: finalPrice,
      store,
      purchased: false,
    };
    setProducts([newProduct, ...products]);
    setName('');
    setPrice('');
    setStore('');
    setModalVisible(false);
  };
  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };
  const toggleProductStatus = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, purchased: !product.purchased } : product
      )
    );
  };
  const openEditModal = (product) => {
    setEditId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditStore(product.store);
    setEditModalVisible(true);
  };
  const saveEditedProduct = () => {
    if (!editName.trim() || !editPrice.trim() || !editStore.trim()) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola!');
      return;
    }
    const parsedEditPrice = parseFloat(editPrice);
    const finalEditPrice = isNaN(parsedEditPrice) ? 'NaN' : parsedEditPrice;
    setProducts(
      products.map((item) =>
        item.id === editId
          ? { ...item, name: editName, price: finalEditPrice, store: editStore }
          : item
      )
    );
    setEditId(null);
    setEditName('');
    setEditPrice('');
    setEditStore('');
    setEditModalVisible(false);
  };
  const filterProducts = (product) => {
    const storeMatch =
      filterStore.trim() === '' ||
      product.store.toLowerCase().includes(filterStore.toLowerCase());
    const priceMatch =
      filterPrice.trim() === '' ||
      parseFloat(product.price) <= parseFloat(filterPrice);
    return storeMatch && priceMatch;
  };
  const sections =
    activeTab === 'do zakupu'
      ? [{ title: 'Produkty do zakupu', data: products.filter((p) => !p.purchased).filter(filterProducts) }]
      : [{ title: 'Produkty kupione', data: products.filter((p) => p.purchased).filter(filterProducts) }];
  const headerTitle = activeTab === 'do zakupu' ? 'Produkty do zakupu' : 'Produkty kupione';
  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
      <TouchableOpacity onPress={() => toggleProductStatus(item.id)} style={styles.cardContent}>
        <Text style={[styles.itemText, { color: isDarkMode ? '#fff' : '#000' }, item.purchased && styles.purchasedText]}>
          {item.name} - {item.price} zł - {item.store}
        </Text>
      </TouchableOpacity>
      <View style={styles.cardButtons}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edytuj</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteProduct(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Usuń</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#f2f2f2' }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.sidebarButton} onPress={() => setSidebarVisible(true)}>
          <Text style={styles.sidebarButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>{headerTitle}</Text>
        <View style={styles.headerPlaceholder} />
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { color: isDarkMode ? '#fff' : '#000' }]}>{section.title}</Text>
        )}
        style={styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <Modal visible={sidebarVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
          <View style={styles.sidebarOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.sidebarContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
          <TouchableOpacity style={styles.themeToggleButton} onPress={() => setIsDarkMode(!isDarkMode)}>
            <Text style={styles.themeToggleIcon}>{isDarkMode ? '☀' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <Text style={styles.filterButtonText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => { setActiveTab('do zakupu'); setSidebarVisible(false); }}>
            <Text style={[styles.sidebarItemText, { color: isDarkMode ? '#fff' : '#000' }]}>Produkty do zakupu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => { setActiveTab('kupione'); setSidebarVisible(false); }}>
            <Text style={[styles.sidebarItemText, { color: isDarkMode ? '#fff' : '#000' }]}>Produkty kupione</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <TouchableOpacity style={styles.modalBackButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalBackButtonText}>✕</Text>
            </TouchableOpacity>
            <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Dodaj nowy produkt</Text>
              <TextInput style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000' }]} placeholder="Nazwa produktu" placeholderTextColor={isDarkMode ? '#ccc' : '#888'} value={name} onChangeText={setName} />
              <TextInput style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000' }]} placeholder="Cena" placeholderTextColor={isDarkMode ? '#ccc' : '#888'} value={price} onChangeText={setPrice} keyboardType="numeric" />
              <TextInput style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000' }]} placeholder="Sklep" placeholderTextColor={isDarkMode ? '#ccc' : '#888'} value={store} onChangeText={setStore} />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalApplyButton} onPress={addProduct}>
                  <Text style={styles.modalApplyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <TouchableOpacity style={styles.modalBackButton} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalBackButtonText}>✕</Text>
            </TouchableOpacity>
            <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Edytuj produkt</Text>
              <TextInput style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000' }]} placeholder="Nazwa produktu" placeholderTextColor={isDarkMode ? '#ccc' : '#888'} value={editName} onChangeText={setEditName} />
              <TextInput style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000' }]} placeholder="Cena" placeholderTextColor={isDarkMode ? '#ccc' : '#888'} value={editPrice} onChangeText={setEditPrice} keyboardType="numeric" />
              <TextInput style={[styles.modalInput, { color: isDarkMode ? '#fff' : '#000' }]} placeholder="Sklep" placeholderTextColor={isDarkMode ? '#ccc' : '#888'} value={editStore} onChangeText={setEditStore} />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalApplyButton} onPress={saveEditedProduct}>
                  <Text style={styles.modalApplyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <TouchableOpacity style={styles.modalBackButton} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.modalBackButtonText}>✕</Text>
            </TouchableOpacity>
            <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Filtruj</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput style={[styles.modalInput, { flex: 1, color: isDarkMode ? '#fff' : '#000' }]} placeholder="Sklep" placeholderTextColor={isDarkMode ? '#ccc' : '#888'} value={filterStore} onChangeText={setFilterStore} />
                <TouchableOpacity onPress={() => setFilterStore('')}>
                  <Text style={{ fontSize: 20, marginLeft: 6, marginBottom: 15, color: isDarkMode ? '#fff' : '#000', marginTop: -5 }}>X</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput style={[styles.modalInput, { flex: 1, color: isDarkMode ? '#fff' : '#000' }]} placeholder="Cena (≤)" placeholderTextColor={isDarkMode ? '#ccc' : '#888'} value={filterPrice} onChangeText={setFilterPrice} keyboardType="numeric" />
                <TouchableOpacity onPress={() => setFilterPrice('')}>
                  <Text style={{ fontSize: 20, marginLeft: 6, marginBottom: 15, color: isDarkMode ? '#fff' : '#000', marginTop: -5 }}>X</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalApplyButton} onPress={() => setFilterModalVisible(false)}>
                  <Text style={styles.modalApplyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default registerRootComponent(MyApp);

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sidebarButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0080ff', justifyContent: 'center', alignItems: 'center' },
  sidebarButtonText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  headerPlaceholder: { width: 50, height: 50 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  list: { flex: 1, marginBottom: 16 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', paddingHorizontal: 8, marginVertical: 8 },
  card: { borderRadius: 8, padding: 12, marginVertical: 8, marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, flexDirection: 'row', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardButtons: { flexDirection: 'row' },
  itemText: { fontSize: 18 },
  purchasedText: { textDecorationLine: 'line-through', color: 'gray' },
  editButton: { backgroundColor: '#ffa500', padding: 8, borderRadius: 4, marginRight: 8 },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#ff4d4d', padding: 8, borderRadius: 4 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 30, alignSelf: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: '#0080ff', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  fabText: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center', lineHeight: 60, marginTop: -5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalWrapper: { alignItems: 'center', width: '100%' },
  modalBackButton: { backgroundColor: 'red', borderRadius: 25, width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  modalBackButtonText: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: -5 },
  modalContainer: { width: '90%', minHeight: 300, borderRadius: 8, padding: 16, alignItems: 'stretch', backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, fontSize: 16, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 20 },
  modalApplyButton: { backgroundColor: '#0080ff', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  modalApplyButtonText: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, lineHeight: 36 },
  sidebarOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sidebarContainer: { position: 'absolute', top: 0, left: 0, width: '60%', height: '100%', padding: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.5, shadowRadius: 4 },
  themeToggleButton: { alignSelf: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: '#ccc', marginVertical: 10, marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
  themeToggleIcon: { fontSize: 24, marginBottom: 5 },
  filterButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0080ff', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  filterButtonText: { fontSize: 24, color: '#fff' },
  sidebarItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  sidebarItemText: { fontSize: 18 },
});
