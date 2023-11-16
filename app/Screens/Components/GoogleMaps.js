import * as React from "react";
import { Dimensions, StyleSheet, Text, View} from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY } from "@env";
import { CustomMapStyle } from "../../../NightMapStyle";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import Carousel from "react-native-snap-carousel";
//import {CustomMapStyle} from '../../../DarkMapStyle'

export default function App() {
	const animationRef = React.useRef(LottieView);
	const mapViewRef = React.createRef();

	const [location, setLocation] = React.useState({});
	const [lat, setLatitude] = React.useState({});
	const [long, setLongitude] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [poiName, setPoiName] = React.useState("");
	const [locationArray, setLocationArray] = React.useState({});
	const [pinVisible, setPinVisible] = React.useState(false);
	const [poiData, setPoiData] = React.useState([]);
	const [searchedData, setSearchedData] = React.useState([]);
	const [key, setKey] = React.useState(0); 

	let userSearchedData = [];

	const radius = 6000;
	const delta = 0.1;
	const searched = false;

	//sets pins
	const [pin, setPin] = React.useState({
		latitude: cLatitude,
		longitude: cLongitude,
	});

	//sets regions
	const [region, setRegion] = React.useState({
		latitude: cLatitude,
		longitude: cLongitude,
		latitudeDelta: delta,
		longitudeDelta: delta,
	});

	//set the loaction of the user
	const initialRegion = {
		latitude: lat,
		longitude: long,
		latitudeDelta: delta,
		longitudeDelta: delta,
	};

	const cLatitude = JSON.stringify(lat);
	const cLongitude = JSON.stringify(long);

	//fetch nearby resturants
	const fetchNearbyLocations = async (latitude, longitude, radius, searched) => {
		try {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=bar&key=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const local_bars = await response.json();
		let locations = local_bars.results.map((item) => ({
			latitude: item.geometry.location.lat,
			longitude: item.geometry.location.lng,
			poiPlace_id: item.place_id,
			poiName: item.name,
			poiRating: item.rating,
			poiAddress: item.vicinity,
			poiHours: item.opening_hours.open_now,
		}));
		if(searched){
			locations = [
			{}, // Empty object as the first element
			...local_bars.results.map((item) => ({
				latitude: item.geometry.location.lat,
				longitude: item.geometry.location.lng,
				poiPlace_id: item.place_id,
				poiName: item.name,
				poiRating: item.rating,
				poiAddress: item.vicinity,
				poiHours: item.opening_hours.open_now,
			}))
			];
			locations[0] = userSearchedData; 
		} 

		setPoiData(locations);
		setKey((prevKey) => prevKey + 1); // Increment key to force re-render of Carousel when poiData is updated

		setLocationArray(locations); // Store the fetched locations in state
		setPinVisible(true); 
		} catch (error) {
		console.error("Error fetching nearby locations:", error);
		}
	};
	
	//requst users loactions
	React.useEffect(() => {
		(async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();

		if (status !== "granted") {
			setErrorMsg("Permission to access location was denied");
			return;
		}

		const location = await Location.getCurrentPositionAsync({});
		setLatitude(location.coords.latitude);
		setLongitude(location.coords.longitude);
		setLocation(location);

		setPin({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
		});

		// Call the separate fetchNearbyLocations function with the required parameters
		await fetchNearbyLocations(location.coords.latitude, location.coords.longitude, radius, searched);

		setLoading(false);
		})();
	}, []);

	//gets poi details on map click
	const handlePoiClick = (event, details) => {
		const { placeId, name } = event.nativeEvent;
		const { coordinate } = event.nativeEvent;
		const { latitude, longitude } = coordinate;

		//Updates region and pin
		setPin({
		latitude: latitude,
		longitude: longitude,
		});

		const selectedRegion = {
		latitude: latitude,
		longitude: longitude,
		latitudeDelta: delta,
		longitudeDelta: delta,
		};

		//animation to move mapview to new loaction
		mapViewRef.current.animateToRegion(selectedRegion, 4000);
		setPoiName(name);
	};

	//updates poi info on search
	const handlePlaceSelected = (data, details) => {
		//updates region with new coordinates
		const selectedRegion = {
		latitude: details.geometry.location.lat,
		longitude: details.geometry.location.lng,
		latitudeDelta: delta,
		longitudeDelta: delta,
		};

		mapViewRef.current.animateToRegion(selectedRegion, 4000);   //animation to move mapview to new loaction

		//Updates region and pin
		setRegion(selectedRegion);
		setPin({
		latitude: details.geometry.location.lat,
		longitude: details.geometry.location.lng,
		});

		const locations = [
		{
			latitude: details.geometry.location.lat,
			longitude: details.geometry.location.lng,
			poiPlace_id: details.place_id,
			poiName: details.name,
			poiRating: details.rating,
			poiAddress: details.vicinity,
		},
		];

		setSearchedData([locations[0]]);
		userSearchedData = locations[0];
	};

	//update mapview and region on carousel chnage
	const handleCarouselItemChange = (index) => {
		const selectedPlace = poiData[index]; // Get the lat and lng from the selected item in poiData

		console.log("Current carousel item index:", index);
		console.log(selectedPlace);

		const selectedRegion = {
		latitude: selectedPlace.latitude,
		longitude: selectedPlace.longitude,
		latitudeDelta: 0.06,
		longitudeDelta: 0.06,
		};

		// Animate the map view to the selected region
		if (mapViewRef.current) {
		mapViewRef.current.animateToRegion(selectedRegion, 800);
		}
	};

	//starts animation
	React.useEffect(() => {
		if (animationRef.current) {
		setTimeout(() => {
			animationRef.current?.reset();
			animationRef.current?.play();
		}, 100);
		}
	}, [animationRef.current]);

	//loading screen added to update map with users loaction
	if (loading) {
		return (
		<View style={styles.loadingContainer}>
			<View style={styles.animationContainer}>
			<LottieView
				style={styles.loadingAnimation}
				ref={animationRef}
				loop={true}
				speed={1}
				source={require("../../../loading.json")}
			/>
			</View>
			<Text style={styles.loadingText}>
			Fetching your location... &#127758;
			</Text>
		</View>
		);
	}

	return (
		<View style={styles.container}>
		<GooglePlacesAutocomplete
			placeholder="What is your Destination..."
			fetchDetails={true}
			GooglePlacesSearchQuery={{
			rankby: "distance",
			}}
			query={{
			key: `${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
			language: "en",
			components: "country:ca",
			types: "bar",
			radius: 30000,
			location: `${region.latitude}, ${region.longitude}`,
			}}
			styles={{
			container: styles.mapContainer,
			listView: styles.listView,
			textInput: styles.textInput,
			searchBar: styles.searchBar,
			}}
			onPress={(data, details) => {
			handlePlaceSelected(data, details); // You can also update other state or perform actions related to the selected place here
			fetchNearbyLocations(details.geometry.location.lat, details.geometry.location.lng, radius, true);
			}}
		/>
		<MapView
			//userInterfaceStyle={'dark'} 	//dark mode for iOS
			ref={mapViewRef} // Assign the ref to the MapView
			style={styles.map}
			initialRegion={initialRegion} // Inital location on new load
			provider={PROVIDER_GOOGLE}
			customMapStyle={CustomMapStyle}
			onPoiClick={handlePoiClick}
		>
			{/*users location*/}
			{pinVisible && (
			<Marker coordinate={pin} pinColor="#FC0FC0" draggable={false} />
			)}

			{/*local bar locations*/}
			{pinVisible &&
			locationArray.map((location, index) => (
				<Marker key={index} coordinate={location} />
			))}

			<Circle
			center={pin}
			radius={6000}
			fillColor="rgba(255, 192, 203, 0.3)"
			strokeColor="grey"
			/>
		</MapView>

		<Carousel
			key={key}
			data={poiData}
			renderItem={({ item }) => (
			<View style={styles.carouselItem}>
				<Text style={styles.carouselText}>
				Name: {item.poiName}
				{"\n"}
				</Text>
				<Text style={styles.carouselText}>
				Address: {item.poiAddress}
				{"\n"}
				</Text>
				<Text style={styles.carouselText}>
				Currently Open: {item.poiHours ? "Yes" : "No"}
				{"\n"}
				</Text>
			</View>
			)}
			sliderWidth={Dimensions.get("window").width - 20}
			itemWidth={Dimensions.get("window").width - 20}
			containerCustomStyle={styles.carouselContainer}
			onSnapToItem={handleCarouselItemChange}
			activeSlideAlignment="start" 
		/>

		{/* shows current coordinate */}
		<Text style={styles.text}>
			Current latitude: {lat.toFixed(3)}
			{"\n"}
		</Text>
		<Text style={styles.text}>Current longitude: {long.toFixed(3)}</Text>
		</View>
	);
	}

	const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	text: {
		position: "absolute",
		right: 20,
		bottom: 0,
		marginBottom: 20,
		fontSize: 12,
		fontWeight: "100",
		zIndex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "grey",
	},
	animationContainer: {
		justifyContent: "center",
		alignItems: "center",
		width: 200,
		height: 200,
	},
	loadingAnimation: {
		width: "100%",
		height: "100%",
	},
	loadingText: {
		marginTop: 10,
		color: "#333",
		fontSize: 18,
	},
	mapContainer: {
		flex: 0,
		position: "absolute",
		width: "90%",
		zIndex: 1,
		marginTop: 60,
		alignSelf: "center",
	},
	listView: {
		backgroundColor: "white",
	},
	textInput: {
		backgroundColor: "rgba(255, 255, 255, 0.85)",
		color: "black",
		top: 0,
	},
	carouselContainer: {
		position: "absolute",
		bottom: 0,
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height / 4,
		backgroundColor: "rgba(186, 179, 179, 0.95)",
		borderRadius: 20,
		margin: 10,
	},
	carouselItem: {
		paddingHorizontal: 16,
		paddingTop: 10,
		fontSize: 24,
	},
});
