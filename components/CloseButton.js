import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import styles from '../styles/styles'

export default function CloseButton({ onPress, style }) {
  return (
    <TouchableOpacity style={[styles.closeButton, style]} onPress={onPress}>
      <Text style={styles.closeButtonText}>✕</Text>
    </TouchableOpacity>
  )
}
