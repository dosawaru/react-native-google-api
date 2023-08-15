import * as React from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} from '@env'
import {CustomMapStyle} from './../../../CustomMapStyle'



// const screenHeight = Dimensions.get("window").height;
// const screenWidth = Dimensions.get("window").width;

// const navHeight = 8;

// const pixelsToSubtract = (screenHeight * navHeight) / 100;
// const componentHeight = screenHeight - (screenHeight * navHeight) / 100;


export default function GoogleMaps() {

	//Coordinates of a location 
    const cLatitude = 43.6436;
	const cLongitude = -79.3791;

	//Zoom of the map
    const delta = 0.058  

    const [ pinVisible ] = React.useState(true);
	
	const [ pin, setPin ] = React.useState({
		latitude: cLatitude,
		longitude: cLongitude
	});
	const [ region, setRegion ] = React.useState({
		latitude: cLatitude,
		longitude: cLongitude,
		latitudeDelta: delta,
		longitudeDelta: delta
	});

    const handlePinDragEnd = (e) => {
		setPin({
			latitude: e.nativeEvent.coordinate.latitude,
			longitude: e.nativeEvent.coordinate.longitude
		});
	};

	const handleRegionChange = (newRegion) => {
		setRegion(newRegion);
		setPin({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude
        });
	};

	const handleMapLongPress = (e) => {
		const newPin = {
		  latitude: e.nativeEvent.coordinate.latitude,
		  longitude: e.nativeEvent.coordinate.longitude,
		};
		setPin(newPin);
		setRegion(newPin);
	};

	const mapViewRef = React.createRef();
	const handlePlaceSelected = (data, details) => {
		const selectedRegion = {
			latitude: details.geometry.location.lat,
			longitude: details.geometry.location.lng,
			latitudeDelta: delta,
			longitudeDelta: delta,
		  };
		mapViewRef.current.animateToRegion(selectedRegion,4000);
		mapViewRef.current.animateCamera({ center: selectedRegion, altitude: 8000 }, { duration: 4000 });
		setRegion(selectedRegion);
		setPin({
		  latitude: details.geometry.location.lat,
		  longitude: details.geometry.location.lng,
		});
	}

	return (
		<View>
			<GooglePlacesAutocomplete 
				placeholder='What is your Destination...'
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
				query={{
					key: `${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
					language: 'en',
					components: "country:ca",
					types: "establishment",
					radius: 90000,
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "90%", zIndex: 1, marginTop: 20,  alignSelf: 'center' },
					listView: { backgroundColor: "white" },
					textInput: { backgroundColor: "rgba(255, 255, 255, 0.85)", color: 'black', top: 0 },
				}}
				style={styles.searchBar}
				onPress={handlePlaceSelected}

			/>
			<MapView
				ref={mapViewRef} // Assign the ref to the MapView
				style={styles.map}
				initialRegion={region} // Inital location on new load
				onRegionChange={handleRegionChange}
				onLongPress={handleMapLongPress} 
				provider={PROVIDER_GOOGLE}
				customMapStyle={CustomMapStyle}
				//provider="google"

			>
                {pinVisible && ( // Show the pin if pinVisible is true
					<Marker
						coordinate={pin}
						pinColor= "#FC0FC0"
						draggable={true}
						onDragEnd={handlePinDragEnd}
					>
						<Callout>
							<Text>Your Current Location</Text>
						</Callout>
					</Marker>
				)}
                {/* draw a circle on the map centered around pin */}
				{/* <Circle center={pin} radius={1000} fillColor="rgba(255, 192, 203, 0.3)" strokeColor="grey"/> */}

				{/* shows current coordinate */}
				<Text style={styles.text}>Current latitude: {region.latitude.toFixed(3)}{'\n'}</Text>
      			<Text style={styles.text}>Current longitude: {region.longitude.toFixed(3)}</Text>
			</MapView>
		</View>
	)
}

const styles = StyleSheet.create({
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height - 180,
		justifyContent: "flex-end",
    	alignItems: "center",
	},
	text: {
    	alignItems: 'center',
		justifyContent: 'center',
		position: "absolute",
		bottom: 0,
		marginBottom: 20,
		backgroundColor: 'lightgrey',
		fontSize: 20,
	}
})