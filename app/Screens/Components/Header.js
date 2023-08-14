import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import * as React from 'react';

export default function Header() {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('./../../../assets/logo.png')}/>
      <View style={styles.container2}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 44, // Adjust this value as needed for iPhone 12 notch
    paddingLeft: 10, // Adjust this value as needed
  },
  container2: {
    paddingTop: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  searchBar:{
    borderRadius: 50,
    borderWidth:1,
    borderColor: '#000',
    padding: 10,
    height: 35,
    width: 350,
  }
});
