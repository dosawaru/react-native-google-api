import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Fav() {
  return (
    <View style={styles.container}>
      <Text>This is the the Fav Page</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
  },
});