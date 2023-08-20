import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TabNavigation from './app/Screens/Navigations/TabNavigation';
import GoogleMaps from './app/Screens/Components/GoogleMaps';

export default function App() {
  return (
    // <NavigationContainer>
    //   <TabNavigation>
        
    //   </TabNavigation>
    // </NavigationContainer>
    <GoogleMaps/>
  );
}

const styles = StyleSheet.create({
  
});
