# React Native Google Maps App

A mobile application built with React Native that utilizes the Google Maps API to display maps, search for locations, and provide information about Points of Interest (POI).

## Features

- Display a Google Map with customizable styles.
- Search for locations using the Google Places API.
- View details of selected Points of Interest (POI).
- Automatically fetch the user's current location and nearby bars/restaurants.
- Animated transitions when moving the map or selecting a location.
- Loading screen with a fun animation during location fetching.

## Demo

https://github.com/dosawaru/react-native-google-api/assets/35234154/515892d4-1715-4547-8127-1b43792eccfc

## Technologies Used

- React Native
- React Navigation
- React Native Maps
- Expo Location
- Lottie for animations
- React Native Google Places Autocomplete

## Getting Started

1. Clone this repository.
2. Install dependencies using npm or yarn:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Add your Google Maps API Key to the @env file as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
4. Start the development server:
    ```bash
    npx expo start -- --reset-cache (for the first run)
    npx expo start 
    ```
5. Run project using Expo Go

## Usage

- Launch the app on your device or emulator.
- The app will automatically fetch your location and display it on the map.
- You can search for locations by typing in the search bar.
- Select a location from the search results to view details and move the map to that location.
