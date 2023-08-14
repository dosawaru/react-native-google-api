import * as React from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import MapView, { Callout, Circle, Marker } from "react-native-maps"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} from '@env'


export default function GoogleMaps() {

	//Coordinates of a location 
    const cLatitude = 43.6436;
	const cLongitude = -79.3791;

	//Zoom of the map
    const delta = 0.058;

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

	return (
		<View>
			<GooglePlacesAutocomplete 
				placeholder='What is your Destination...'
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
				onPress={(data, details = null) => {
					console.log(data, details);
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						latitudeDelta: delta,
						longitudeDelta: delta
					})
				}}
				query={{
					key: `${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
					language: 'en',
					components: "country:ca",
					types: "establishment",
					radius: 30000,
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "90%", zIndex: 1, marginTop: 20,  alignSelf: 'center' },
					listView: { backgroundColor: "white" },
					textInput: { backgroundColor: "rgba(255, 255, 255, 0.85)", color: 'black', top: 0 },
				}}
				style={styles.searchBar}

			/>
			<MapView
				style={styles.map}
                // Inital location on new load
				initialRegion={{
					latitude: cLatitude,
					longitude: cLongitude,
					latitudeDelta: delta,
					longitudeDelta: delta
				}}
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
				<Circle center={pin} radius={1000} fillColor="rgba(255, 192, 203, 0.3)" strokeColor="grey"/>
			</MapView>
		</View>
	)
}

const styles = StyleSheet.create({
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height - 180,
	},
})