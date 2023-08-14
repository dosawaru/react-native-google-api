import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Search from '../Search';
import Home from '../Home';
import Fav from '../Fav';
import Profile from '../Profile';
import { FontAwesome } from '@expo/vector-icons';

export default function TabNavigation() {

    const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator screenOptions ={{headerShown:false}}>
      <Tab.Screen name="Home" component={Home} 
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({color, size}) => (
            <FontAwesome name="home" size={size} color={color}/>
        ),
      }}/>
      <Tab.Screen name="Search" component={Search} 
      options={{
        tabBarLabel: 'Search',
        tabBarIcon: ({color, size}) => (
            <FontAwesome name="search" size={size} color={color}/>
        ),
      }}/>
      <Tab.Screen name="Fav" component={Fav} 
      options={{
        tabBarLabel: 'Fav',
        tabBarIcon: ({color, size}) => (
            <FontAwesome name="heart" size={size} color={color}/>
        ),
      }}/>
      <Tab.Screen name="Profile" component={Profile} 
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({color, size}) => (
            <FontAwesome name="user" size={size} color={color}/>
        ),
      }}/>
    </Tab.Navigator>
  )
}