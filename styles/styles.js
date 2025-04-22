import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ef5350'
  },
  errorText: {
    color: '#c62828',
    fontSize: 16
  },
  retryButton: {
    backgroundColor: '#ef5350',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 10
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  formError: {
    color: '#c62828',
    fontSize: 14,
    marginBottom: 8
  },
  darkContainer: {
    backgroundColor: '#333'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  sidebarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0080ff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sidebarButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold'
  },
  headerPlaceholder: {
    width: 50,
    height: 50
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  list: {
    flex: 1,
    marginBottom: 16
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    marginVertical: 8
  },
  card: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5
  },
  cardDark: {
    backgroundColor: '#444'
  },
  cardContent: {
    flex: 1
  },
  itemText: {
    fontSize: 18
  },
  purchasedText: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },
  cardButtons: {
    flexDirection: 'row'
  },
  editButton: {
    backgroundColor: '#ffa500',
    padding: 8,
    borderRadius: 4,
    marginRight: 8
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 4
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  fabPosition: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0080ff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 36,
    textAlign: 'center',
    marginTop: 5
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold'
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  loginForm: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  loginInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    marginBottom: 12
  },
  loginButton: {
    backgroundColor: '#0080ff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  themeToggleButton: {
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  themeToggleIcon: {
    fontSize: 24
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0080ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  filterButtonText: {
    fontSize: 24,
    color: '#fff'
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  sidebarContainer: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '100%',
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4
  },
  sidebarItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  sidebarItemText: {
    fontSize: 18
  },
  modalWrapper: {
    alignItems: 'center',
    width: '100%'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: '#fff'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16
  },
  clearText: {
    fontSize: 20,
    marginLeft: 6,
    marginTop: -7
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20
  },
  modalApplyButton: {
    alignSelf: 'center',
    backgroundColor: '#0080ff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Стили для экрана деталей продукта
  detailsContainer: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center'
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '30%'
  },
  detailsValue: {
    fontSize: 16,
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start'
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 120,
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
})