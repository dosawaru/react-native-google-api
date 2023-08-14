import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Header from './Components/Header';
import GoogleMaps from './Components/GoogleMaps';

export default function Home() {
  return (
    <View style = {styles.container}>
      <Header/>
      <GoogleMaps/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
  },
});