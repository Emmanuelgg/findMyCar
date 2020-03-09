import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, Button } from 'react-native'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import {AsyncStorage} from 'react-native'

const styles = StyleSheet.create({
  map: {
      width: '100%',
      height: '100%'
  },
  makerImage: {
    width: 25,
    height: 25
  }
})

const logo = require('../assets/findMyCarLogo2.png')
const makerImage = require('../assets/car.png')

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      watcher: null,
      mapRegion: null,
      hasLocationPermissions: false,
      locationResult: null,
      lastLong: 0,
      lastLat: 0,
      lastHeading: 0,
      location: null, 
      user: false,
      saveButton: false,
      removeButton: false
    } 
    this.handleMapRegionChange = this.handleMapRegionChange.bind(this)
    this.saveCurrentLocation = this.saveCurrentLocation.bind(this)
    this.getCurrentLocationSaved = this.getCurrentLocationSaved.bind(this)
    this.removeCurrentLocationSaved = this.removeCurrentLocationSaved.bind(this)
    this.watchLocation = this.watchLocation.bind(this)
  }

  componentWillUnmount() {
  }

  componentDidMount() {
    this.getCurrentLocationSaved()
  }

  handleMapRegionChange = (mapRegion) => {
    this.setState({ mapRegion })
    this.setState({lastLat: mapRegion.latitude, lastLong: mapRegion.longitude})
  }

  watchLocation = async () => {
    if (this.state.watcher == null) {
      let watcher = await Location.watchPositionAsync({
        enableHighAccuracy:true,
        timeInterval: 100,
        distanceInterval: 0
            }, location => {
              console.log(location)
              this.setState({location})
              this.setState({lastLat: location.coords.latitude, lastLong: location.coords.longitude, lastHeading: location.coords.heading})
      })  
      this.setState({watcher: watcher})
    }
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }
 
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });
    
    // Center the map on the location we just fetched.
     this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }})
     this.setState({lastLat: location.coords.latitude,lastLong: location.coords.longitude})
  }

  saveCurrentLocation = async () => {
    try {
      this.state.watcher.remove()
      this.setState({watcher: null})
      this.setState({user: true})
      this.setState({saveButton: true, removeButton: false})
      await AsyncStorage.setItem('currentLocation', JSON.stringify({ latitude: this.state.lastLat, longitude: this.state.lastLong, heading: this.state.lastHeading }))
    } catch (error) {
      console.log(error)
      // Error saving data
    }
  }

  removeCurrentLocationSaved = async () => {
    try {
      await AsyncStorage.removeItem('currentLocation')
      this.getLocationAsync()
      this.watchLocation()
      this.setState({user: false})
      this.setState({saveButton: false, removeButton: true})
    } catch (error) {
      // Error saving data
    }
  }

  getCurrentLocationSaved = async () => {
    try {
      const currentLocation = JSON.parse(await AsyncStorage.getItem('currentLocation'))
      if ( currentLocation == null) {
        this.getLocationAsync()
        this.watchLocation()
        this.setState({user: false})
        this.setState({saveButton: false, removeButton: true})
      } else {
        this.setState({mapRegion: { latitude: currentLocation.latitude, longitude: currentLocation.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }})
        this.setState({lastLat: currentLocation.latitude, lastLong: currentLocation.longitude, lastHeading: currentLocation.latitude})
        this.setState({user: true})
        this.setState({saveButton: true, removeButton: false})
      }
    } catch (error) {
        this.getLocationAsync()
        this.watchLocation()
        this.setState({user: false})
        this.setState({saveButton: false, removeButton: true})
    }
  }

  render() {
    return (
      <>
        <View style={{width: '100%', height: "65%", flexDirection: 'row', alignContent: "center", justifyContent: "center", paddingTop: 0}}>
            {/* <MapView
              style={{ alignSelf: 'stretch', height: 400 }}
              region={this.state.mapRegion}
              onRegionChange={this.handleMapRegionChange.bind(this)}
            /> */}
            <MapView
                style={styles.map}
                region={this.state.mapRegion}
                showsUserLocation={this.state.user}
                followUserLocation={true}
                minZoomLevel={16}
                // onRegionChange={this.handleMapRegionChange}
                >
                <MapView.Marker
                    coordinate={{
                    latitude: (this.state.lastLat ) || 0,
                    longitude: (this.state.lastLong ) || 0,
                    }}
                    rotation={this.state.lastHeading}
                >
                    <Image
                      style={styles.makerImage}
                      source={makerImage} 
                    />
                </MapView.Marker>
            </MapView>
        </View>
        <View style={{marginTop:40, width: '100%', height: 40, flexDirection: 'row', justifyContent: 'center'}}>
          <Button 
            title="Guardar ubicación"
            color="#4CAF50"
            disabled={this.state.saveButton}
            onPress={this.saveCurrentLocation}
          />
        </View>
        {/* <View style={{marginTop:25, width: '100%', height: 40, flexDirection: 'row', justifyContent: 'center'}}>
          <Button 
            title="Obtener ubicación"
            color="#f132ff"
            onPress={this.getCurrentLocationSaved}
          />
        </View> */}
        <View style={{marginTop:25, width: '100%', height: 40, flexDirection: 'row', justifyContent: 'center'}}>
          <Button 
            title="Remover ubicación"
            color="#f44336"
            disabled={this.state.removeButton}
            onPress={this.removeCurrentLocationSaved}
          />
        </View>
      </>
    )
  }
}


export default Map

// import React, { Component } from 'react';
// import { Platform, Text, View, StyleSheet } from 'react-native';
// import Constants from 'expo-constants';
// import * as Location from 'expo-location';
// import * as Permissions from 'expo-permissions';

// export default class Map extends Component {
//   state = {
//     location: null,
//     errorMessage: null,
//   };

//   constructor(props) {
//     super(props);
//     if (Platform.OS === 'android' && !Constants.isDevice) {
//       this.setState({
//         errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
//       });
//     } else {
//       this._getLocationAsync();
//     }
//   }

//   _getLocationAsync = async () => {
//     let { status } = await Permissions.askAsync(Permissions.LOCATION);
//     if (status !== 'granted') {
//       this.setState({
//         errorMessage: 'Permission to access location was denied',
//       });
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     this.setState({ location });
//   };

//   render() {
//     let text = 'Waiting..';
//     if (this.state.errorMessage) {
//       text = this.state.errorMessage;
//     } else if (this.state.location) {
//       text = JSON.stringify(this.state.location);
//     }

//     return (
//       <View style={styles.container}>
//         <Text style={styles.paragraph}>{text}</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: Constants.statusBarHeight,
//     backgroundColor: '#ecf0f1',
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });