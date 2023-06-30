import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, StatusBar, View, ViewStyle, Dimensions } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ClientTabScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useStores } from "../models"
import { spacing } from "../theme"
import * as Location from "expo-location"
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps"
import { useNavigation } from "@react-navigation/native"
import SelectRideType from "app/components/Client/SelectRideType"
import WhereTo from "../components/Client/WhereTo"
import MapViewDirections from "react-native-maps-directions"

const carImage = require("../../assets/images/app/car.png")

const GOOGLE_MAPS_KEY = "AIzaSyDL11CwUA9M76UsmwAMOEf3UsXR2sWnSRk"

interface ClientHomeScreenProps
  extends NativeStackScreenProps<ClientTabScreenProps<"ClientHome">> {}

export const ClientHomeScreen: FC<ClientHomeScreenProps> = observer(function ClientHomeScreen() {
  // Pull in one of our MST stores
  const {
    authenticationStore: { email, authToken, role },
  } = useStores()

  const latitudeDelta = 0.0922
  const longitudeDelta = 0.0421

  const mapRef = useRef()

  const [dragging, setDragging] = useState(0)

  const [region, setRegion] = useState({
    latitude: -17.394228156430533,
    longitude: -66.28467617356642,
    latitudeDelta,
    longitudeDelta,
  })

  const [gps, setGps] = useState({
    location: null,
  })
  const [selectType, setSelectType] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [locationRejected, setLocationRejected] = useState(false)

  const toggleTypeModal = () => {
    setSelectType(!selectType)
  }

  useEffect(() => {
    if (gps?.location) {
      if (gps.location.lat && gps.location.lng) {
        setDragging(0)
        if (region) {
          // mapRef.current.animateToRegion({
          //   latitude: gps.location.lat,
          //   longitude: gps.location.lng,
          //   latitudeDelta: latitudeDelta,
          //   longitudeDelta: longitudeDelta,
          // })
        } else {
          setRegion({
            latitude: gps.location.lat,
            longitude: gps.location.lng,
            latitudeDelta,
            longitudeDelta,
          })
        }
        // updateAddresses({
        //   latitude: gps.location.lat,
        //   longitude: gps.location.lng
        // }, region ? 'gps' : 'init');
      } else {
        setLocationRejected(true)
      }
    } else {
      locateUser()
    }
  }, [gps.location])

  useEffect(() => {
    if (!locationRejected) {
      setTimeout(() => {
        // poner de la base de datos
        // mapRef.current.animateToRegion({
        //   latitude: -17.394228156430533,
        //   longitude: -66.28467617356642,
        //   latitudeDelta: latitudeDelta,
        //   longitudeDelta: longitudeDelta
        // });
      }, 1000)
    } else {
      // -17.394228156430533, -66.28467617356642
      setRegion({
        latitude: -17.394228156430533,
        longitude: -66.28467617356642,
        latitudeDelta,
        longitudeDelta,
      })
    }
  }, [mapRef.current])

  const onRegionChangeComplete = (newregion, gesture) => {
    if (gesture && gesture.isGesture) {
      console.log("onRegionChangeComplete => ", newregion)
      const current = {
        latitude: newregion.latitude,
        longitude: newregion.longitude,
      }
      setOrigin(current)

      // setGps({
      //   location: {
      //     lat: newregion.latitude,
      //     lng: newregion.longitude,
      //   },
      // })

      // updateAddresses({
      //   latitude: newregion.latitude,
      //   longitude: newregion.longitude
      // }, 'region-change');
    }
  }

  const locateUser = async () => {
    // if (tripdata.selected == 'pickup') {
    const tempWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
      },
      (location) => {
        console.log("locateUser", location)
        setGps({
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        })
        // dispatch({
        //   type: 'UPDATE_GPS_LOCATION',
        //   payload: {
        //     lat: location.coords.latitude,
        //     lng: location.coords.longitude
        //   }
        // });
        tempWatcher.remove()
      },
    )
    // }
  }
  // -17.394004950618324, -66.28099618280778 //quilla
  const [origin, setOrigin] = React.useState({
    latitude: -17.394004950618324,
    longitude: -66.28099618280778,
  })
  // -17.392181367790972, -66.31690920594838  //vinto
  const [destination, setDestination] = React.useState({
    latitude: -17.392181367790972,
    longitude: -66.31690920594838,
  })

  React.useEffect(() => {
    getLocationPermission()
  }, [])

  async function getLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      alert("Permission denied")
      return
    }
    const location = await Location.getCurrentPositionAsync({})
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
    setOrigin(current)
  }

  // const onChangeMap = (newregion, gesture) => {
  //   if (gesture && gesture.isGesture) {
  //     console.log("onRegionChangeComplete => ", newregion)
  //     setGps({
  //       location: {
  //         lat: newregion.latitude,
  //         lng: newregion.longitude,
  //       },
  //     })
  //   }
  // }

  return (
    <View style={styles.container}>
      {/* <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}> */}
      {/* <View style={$mapcontainer}> */}
      {/*  <MapView */}
      {/*    ref={mapRef} */}
      {/*    provider={PROVIDER_GOOGLE} */}
      {/*    showsUserLocation={true} */}
      {/*    loadingEnabled */}
      {/*    style={$mapViewStyle} */}
      {/*    showsMyLocationButton={false} */}
      {/*    // initialRegion={region} */}
      {/*    initialRegion={region} */}
      {/*    onRegionChangeComplete={onRegionChangeComplete} */}
      {/*    onPanDrag={() => setDragging(30)} */}
      {/*    minZoomLevel={13} */}
      {/*  > */}

      {/*  </MapView> */}
      {/* </View> */}

      {/* <SelectRideType */}
      {/*  data={{}} */}
      {/*  onClose={toggleTypeModal} */}
      {/*  onSelect={(selectedType) => console.log("Select=>", selectedType)} */}
      {/*  visible={selectType} */}
      {/* /> */}

      {/* <WhereTo/> */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta,
          longitudeDelta,
        }}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        <Marker
          draggable
          coordinate={origin}
          image={carImage}
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
        />
        <Marker
          draggable
          coordinate={destination}
          onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)}
        />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_KEY}
          strokeColor="black"
          strokeWidth={5}
        />
        {/* <Polyline */}
        {/*  coordinates={[ origin, destination ]} */}
        {/*  strokeColor="pink" */}
        {/*  strokeWidth={8} */}
        {/* /> */}
      </MapView>

      {/* </Screen> */}
    </View>
  )
})

const $container: ViewStyle = {
  // paddingTop: spacing.large + spacing.extraLarge,
  paddingTop: spacing.micro,
  paddingBottom: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $mapcontainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $mapViewStyle: ViewStyle = {
  flex: 1,
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  map: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
})
