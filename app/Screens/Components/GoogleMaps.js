import * as React from 'react'
import { Dimensions, StyleSheet, Text, View, ActivityIndicator, Image } from "react-native"
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} from '@env'
//import {CustomMapStyle} from '../../../DarkMapStyle'
import {CustomMapStyle} from '../../../NightMapStyle'
import * as Location from 'expo-location';
import LottieView from "lottie-react-native";
import Carousel from 'react-native-snap-carousel';

export default function GoogleMaps() {

	//animation stuff
	const animationRef = React.useRef(LottieView);

	const [location, setLocation] = React.useState({});
	const [lat, setLatitude] = React.useState({});
	const [long, setLongitude] = React.useState({});
	const [loading, setLoading] = React.useState(true);

	const [calloutVisible, setCalloutVisible] = React.useState(false);
	const [poiName, setPoiName] = React.useState('');
	const [poiAddress, setPoiAddress] = React.useState('');
	const [poiHours, setPoiHours] = React.useState('');

	const mapViewRef = React.createRef();

	//requst users loactions
	React.useEffect(() => {
		(async () => {
		  
		  let { status } = await Location.requestForegroundPermissionsAsync();
		  
		  if (status !== 'granted') {
			setErrorMsg('Permission to access location was denied');
			return;
		  }
	
		  const location = await Location.getCurrentPositionAsync({});
		  setLatitude(location.coords.latitude);
		  setLongitude(location.coords.longitude);
		  setLocation(location);
		  setLoading(false);

		  setPin({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
		  });

		})();
	}, []);

	//starting coordinates 
    const cLatitude = JSON.stringify(lat)
	const cLongitude = JSON.stringify(long)

	//zoom of the map
    const delta = 0.058;  

    //pin visibility
	const [ pinVisible ] = React.useState(true);
	
	//sets pin
	const [ pin, setPin ] = React.useState({
		latitude: cLatitude,
		longitude: cLongitude
	});

	//setPOI info
	const [poiData, setPoiData] = React.useState([
		{
		  poiName: 'Data Not Avaliable',
		  poiAddress: 'Data Not Avaliable',
		  poiHours: 'Data Not Avaliable',
		},
	]);

	//sets region
	const [ region, setRegion ] = React.useState({
		latitude: cLatitude,
		longitude: cLongitude,
		latitudeDelta: delta,
		longitudeDelta: delta
	});

	//moves pin after being dragged
    const handlePinDragEnd = (e) => {
		setPin({
			latitude: e.nativeEvent.coordinate.latitude,
			longitude: e.nativeEvent.coordinate.longitude
		});
	};

	//moves pin while scrolling through the maps
	const handleRegionChange = (newRegion) => {
		setRegion(newRegion);
		setPin({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude
        });
	};

	//moves pin on long press
	const handleMapLongPress = (e) => {
		const newPin = {
		  latitude: e.nativeEvent.coordinate.latitude,
		  longitude: e.nativeEvent.coordinate.longitude,
		};
		setPin(newPin);
		setRegion(newPin);
	};

	// const handlePoiClick = (event, details) => {

	// 	const { placeId, name } = event.nativeEvent;
	// 	const { coordinate } = event.nativeEvent;
 	// 	const { latitude, longitude } = coordinate;
		
	// 	// Log POI information to the console
	// 	console.log('Place ID:', placeId);
	// 	console.log('Name:', name);
	// 	console.log('-----------------');

	// 	//Updates region and pin
	// 	setRegion(selectedRegion);
	// 	setPin({
	// 		latitude: latitude,
	// 		longitude: longitude,
	// 	});

	// 	const selectedRegion = {
	// 		latitude: latitude,
	// 		longitude: longitude,
	// 		latitudeDelta: delta,
	// 		longitudeDelta: delta,
	// 	};
 
	// 	//animation to move mapview to new loaction
	// 	mapViewRef.current.animateToRegion(selectedRegion,4000);	

	// 	setPoiName(name);

	// 	// Shows callout
	// 	setCalloutVisible(true);
	// };

	const handlePlaceSelected = (data, details) => {
		//updates region with new coordinates
		const selectedRegion = {
			latitude: details.geometry.location.lat,
			longitude: details.geometry.location.lng,
			latitudeDelta: delta,
			longitudeDelta: delta,
		};

		//animation to move mapview to new loaction
		mapViewRef.current.animateToRegion(selectedRegion,4000);
		
		//Updates region and pin
		setRegion(selectedRegion);
		setPin({
		  latitude: details.geometry.location.lat,
		  longitude: details.geometry.location.lng,
		});

		// Extract and set POI information
		const poiName = details.name;
		const poiAddress = details.formatted_address;
		const poiHours = details.current_opening_hours.weekday_text.join('\n');
		const place_id = details.place_id;
		const poiLat = details.geometry.location.lat;
		const poiLong = details.geometry.location.lng;
		const rating = details.rating;
	
		// Update variablesr
		setPoiName(poiName);
		setPoiAddress(poiAddress);
		setPoiHours(poiHours);
	
		// Shows callout
		setCalloutVisible(true);

		//console.log('Place ID:', place_id);
		console.log('Name:', poiName);
		console.log('Place ID:', place_id);
		console.log('Lat:', poiLat);
		console.log('Long:', poiLong);
		console.log('Rating:', rating);
		console.log('Street Address:', poiAddress);
		console.log('Current Opening Hours:', poiHours);
		console.log('-----------------------------------------------------------------')
	}

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
					source={require("../../../loading.json")}/>
				</View>
				<Text style={styles.loadingText}>Fetching your location... &#127758;</Text>
			</View>
		);
	}

	//set the loaction of the user
	const initialRegion = {
		latitude: lat,
		longitude: long,
		latitudeDelta: delta,
		longitudeDelta: delta,
	};

	return (
		<View style={styles.container}>
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
					types: "bar",
					radius: 90000,
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "90%", zIndex: 1, marginTop: 60,  alignSelf: 'center' },
					listView: { backgroundColor: "white" },
					textInput: { backgroundColor: "rgba(255, 255, 255, 0.85)", color: 'black', top: 0 },
				}}
				style={styles.searchBar}
				onPress={handlePlaceSelected} //updates loaction based on google search
				

			/>
			<MapView
			 	//userInterfaceStyle={'dark'} 	//dark mode for iOS
				ref={mapViewRef} 				// Assign the ref to the MapView
				style={styles.map}
				initialRegion={initialRegion} 	// Inital location on new load
				//onLongPress={handleMapLongPress}
				onPress={() => {setCalloutVisible(true);}}
				//onRegionChange={handleRegionChange} 
				provider={PROVIDER_GOOGLE}
				customMapStyle={CustomMapStyle}
				//onPoiClick={handlePoiClick}

			>
                {pinVisible && ( 				// Show the pin if pinVisible is true
					<Marker
						coordinate={pin} 		//set pin to coordinates
						pinColor= "#FC0FC0" 	//pink
						draggable={false}		//ability to drag pin around
					>
					</Marker>
				)}
				<Circle center={pin} radius={2000} fillColor="rgba(255, 192, 203, 0.3)" strokeColor="grey"/> 

			</MapView>
			<Carousel
				data={poiData}
				renderItem={({}) => (
					<View style={styles.carouselItem}>
					<Text style={styles.carouselText}>Name: {poiName}{'\n'}</Text>
					<Text style={styles.carouselText}>Address: {poiAddress}{'\n'}</Text>
					<Text style={styles.carouselText}>Hours: {poiHours}{'\n'}</Text>
					</View>
				)}
				sliderWidth={Dimensions.get('window').width - 20}
				itemWidth={Dimensions.get('window').width - 20}
				containerCustomStyle={styles.carouselContainer}
			/>
			{/* shows current coordinate */}
			<Text style={styles.text}>Current latitude: {lat.toFixed(3)}{'\n'}</Text>
			<Text style={styles.text}>Current longitude: {long.toFixed(3)}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container:{
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
		fontSize: 25,
		fontWeight: '100',
		zIndex: 1,
	},
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
		backgroundColor: 'grey',
    },
	animationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
    },
    loadingAnimation: {
        width: '100%',
        height: '100%',
    },
	loadingText: {
		marginTop: 10,
		color: '#333',
		fontSize: 18,
	},
	calloutContent: {
        maxHeight: 1000, 
		maxWidth: 1000, 
    },
    calloutText: {
        fontSize: 16,
        marginVertical: 4,
		paddingLeft: 10,
    },
	carouselContainer: {
		position: 'absolute',
		bottom: 0,
		width: Dimensions.get('window').width, 
		height: Dimensions.get('window').height/4, 
		backgroundColor: 'rgba(186, 179, 179, 0.9)',
		borderRadius: 20, 
		margin: 10, 
	},
	carouselItem: {
		paddingHorizontal: 16, 
		paddingTop: 10,
		fontSize: 36, 
	},
})