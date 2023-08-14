import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TabNavigation from './app/Screens/Navigations/TabNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigation>
        
      </TabNavigation>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
