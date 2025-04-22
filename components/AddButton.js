import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import styles from '../styles/styles'

export default function AddButton({ onPress, style }) {
  return (
    <TouchableOpacity style={[styles.addButton, style]} onPress={onPress}>
      <Text style={styles.addButtonText}>+</Text>
    </TouchableOpacity>
  )
}
