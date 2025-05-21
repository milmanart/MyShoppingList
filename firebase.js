import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBvhXaFUuGxdXrlHhinEmUdw-1udKLH6Yg',
  authDomain: 'myshoppinglist-ee65a.firebaseapp.com',
  projectId: 'myshoppinglist-ee65a',
  storageBucket: 'myshoppinglist-ee65a.appspot.com',
  messagingSenderId: '835794613797',
  appId: '1:835794613797:web:7471892c198290dc43b1cc',
}

const app = initializeApp(firebaseConfig)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

export const firestore = getFirestore(app)
