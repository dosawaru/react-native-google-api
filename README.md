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
![IMG_4380](https://github.com/dosawaru/react-native-google-api/assets/35234154/8fbaf9f8-440b-4679-bbea-dace924e3a6f)

![RPReplay_Final1706984319](https://github.com/dosawaru/react-native-google-api/assets/35234154/e5eb40ad-073d-46cd-bd65-55b2cdac5997)

![RPReplay_Final1706984319 (1)](https://github.com/dosawaru/react-native-google-api/assets/35234154/c98d3e05-fbe7-4cc9-8568-1f0946fc668a)

## Technologies Used

- React Native
- React Navigation
- React Native Maps
- Expo Location
- Lottie for animations
- Google Places Autocomplete API

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
