import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  TextInput,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  ViewStyle,
  Dimensions,
  TextStyle,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ClientTabScreenProps } from "app/navigators"
import { Icon, Screen, Text, Button } from "app/components"
import * as Location from "expo-location"
import Geocoder from "react-native-geocoding"
import MapView, { Circle, PROVIDER_GOOGLE, Marker } from "react-native-maps"
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete"
import { colors, spacing, typography } from "../theme"
import { getcoords, IResponseGeocoord, GOOGLE_MAP_SERVER_KEY } from "../services/googleMapsApi"
import { useNavigation } from "@react-navigation/native"
import { useSocket } from "app/context/socketContext"
import Config from "app/config"

const GOOGLE_MAPS_KEY = Config.GOOGLE_MAPS_KEY

Geocoder.init(GOOGLE_MAPS_KEY)

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ClientSearchLocationScreenProps
  extends NativeStackScreenProps<ClientTabScreenProps<"ClientSearchLocation">> {}

export const ClientSearchLocationScreen: FC<ClientSearchLocationScreenProps> = observer(
  function ClientSearchLocationScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const latitudeDelta = 0.0123
    const longitudeDelta = 0.0023

    // Pull in navigation via hook
    const navigation = useNavigation()

    const mapRef = useRef<MapView>()

    const [addressInitial, setAddressInitial] = useState("")
    const [currentLocation, setCurrentLocation] = useState(null)
    const [destinoLocationInitial, setDestinoLocationInitial] = useState(null)

    const [addressFinal, setAddressFinal] = useState("")
    const [destinoLocationFinal, setDestinoLocationFinal] = useState(null)

    const [locationRejected, setLocationRejected] = useState(false)

    const [loader, setLoader] = useState<boolean>(false)

    // pedir permisos a la aplicacion para usar geolocation
    const hasLocationPermission = async () => {
      console.log("permiso gps", Platform.OS === "android" && Platform.Version <= 28)

      // if (Platform.OS === "android" && Platform.Version <= 28) {
      //   return true
      // }
      //
      const { status: estado } = await Location.requestForegroundPermissionsAsync()
      if (estado !== "granted") {
        alert("Permiso denegado")
        return false
      }

      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )

      if (hasPermission) return true

      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )

      if (status === PermissionsAndroid.RESULTS.GRANTED) return true

      if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show("Permiso de ubicación denegado por la usuaria.", ToastAndroid.LONG)
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show("Permiso de ubicación revocado por el usuario.", ToastAndroid.LONG)
      }
      return false
    }

    const geolocation = async () => {
      if (await hasLocationPermission()) {
        setLoader(true)
        // console.log("aquiiiii click")
        // const respon: Location.LocationObject = await Location.getCurrentPositionAsync()
        // console.log("getCurrentPositionAsync=> ", respon.coords)
        // const respon: Location.LocationObject = await Location.()
        // console.log("getCurrentPositionAsync=> ", respon.coords)

        const tempWatcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
          },
          (position) => {
            // console.log("geolocation")
            // console.log(
            //   "watchPositionAsync=> ",
            //   position.coords.latitude,
            //   position.coords.longitude,
            // )

            // setInitialRegion({...initialRegion,
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude,
            // })
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })

            mapRef.current.animateToRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta,
              longitudeDelta,
            })
            setDestinoLocationInitial({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
            setTimeout(() => {
              Geocoder.from(position.coords.latitude, position.coords.longitude)
                .then((json) => {
                  const formatted_address = json.results[0].formatted_address
                  const city_address = json.results[5].formatted_address.split(",")[0]
                  setAddressInitial(formatted_address)
                  // console.log("formatted_address => " + formatted_address, "city_address=> " + city_address)
                })
                .catch((error) => {
                  Alert.alert("Error Google Maps", `${error?.message}`, [
                    { text: "Aceptar", onPress: () => console.log("OK Pressed") },
                  ])
                })
                .finally(() => {
                  console.log("")
                  setLoader(false)
                })
            }, 150)
            tempWatcher.remove()
          },
        )
      }
    }

    const handleMapPress = (event) => {
      const { coordinate } = event.nativeEvent
      console.log("handleMapPress", coordinate)

      setCurrentLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      })
      setDestinoLocationInitial({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      })
      mapRef.current.animateToRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta,
        longitudeDelta,
      })

      setTimeout(() => {
        Geocoder.from(coordinate.latitude, coordinate.longitude)
          .then((json) => {
            const formatted_address = json.results[0].formatted_address
            const city_address = json.results[5].formatted_address.split(",")[0]
            setAddressInitial(formatted_address)
            // console.log("formatted_address => " + formatted_address, "city_address=> " + city_address)
          })
          .catch((error) => console.warn(error))
      }, 150)
      // setSelectedLocation(coordinate);
    }

    // const onRegionChange = (region) => {
    //   console.log("onRegionChange", region)
    //   // setRegion({
    //   //   latitude: region.latitude,
    //   //   longitude: region.longitude,
    //   // })

    //   setTimeout(() => {
    //     Geocoder.from(region.latitude, region.longitude)
    //       .then((json) => {
    //         const formatted_address = json.results[0].formatted_address
    //         const city_address = json.results[5].formatted_address.split(",")[0]
    //         setAddress(formatted_address)
    //         setCity(city_address)
    //         // console.log("formatted_address => " + formatted_address, "city_address=> " + city_address)
    //       })
    //       .catch((error) => console.warn(error))
    //   }, 150)
    //   // this.setState({ region });
    // }

    // cuando carga la app localizar
    useEffect(() => {
      geolocation()
    }, [])

    // GooglePlaceData
    async function onPressDestinationChange(data: GooglePlaceData, details: GooglePlaceDetail) {
      const res: any = await getcoords(data.place_id)

      if (res) {
        const coordinates = [destinoLocationInitial, destinoLocationFinal]
        setDestinoLocationFinal({
          latitude: res.coords.lat,
          longitude: res.coords.lng,
        })

        setTimeout(() => {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 150, right: 50, bottom: 150, left: 50 },
            // edgePadding: DEFAULT_PADDING,
            animated: true,
          })
          // sacamos el texto de la direcion final
          Geocoder.from(res.coords.lat, res.coords.lng)
            .then((json) => {
              const formatted_address = json.results[0].formatted_address
              const city_address = json.results[5].formatted_address.split(",")[0]
              console.log("setAddressFinal", formatted_address)

              setAddressFinal(formatted_address)
            })
            .catch((error) => console.warn(error))
        }, 1000)
      }
    }

    function handlerClickInitaRoute(): void {
      navigation.navigate("ClientConfirmation", {
        origin: destinoLocationInitial,
        destination: destinoLocationFinal,
        viaje: {
          origin: addressInitial,
          destination: addressFinal,
        },
      })

      // navigation.navigate("ClientConfirmation", {
      //   origin: destinoLocationInitial,
      //   destino: destinoLocationFinal,
      // })
    }

    return (
      <View style={$root}>
        {loader && (
          <View
            style={{
              flex: 1,
              zIndex: 4,
              justifyContent: "center",
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
        <View style={$containerForm}>
          <View style={$conatinerUbication}>
            {/* <TextField
            value={address}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="name"
            autoCorrect={false}
            keyboardType="default"
            placeholderTx="registerScreen.nameFieldPlaceholder"
          /> */}
            <View style={$inputWrapperStyle}>
              <TextInput
                style={$myUbications}
                placeholder="Mi Ubicacion"
                // onChangeText={handleChange("nombresyapellidos")}
                // onBlur={handleBlur("nombresyapellidos")}
                value={addressInitial}
                keyboardType="default"
              />
            </View>
            <View style={$containerIcon}>
              <Icon
                icon={"BrandgoogleMaps"}
                color={colors.palette.neutral800}
                containerStyle={{}}
                size={30}
                onPress={geolocation}
              />
            </View>
          </View>

          {/* {(errors.nombresyapellidos && touched.nombresyapellidos) && */}
          {/* <Text style={styles.errorText}>{errors.nombresyapellidos}</Text> */}
          {/* } */}
          {/* <GooglePlacesAutocomplete
          placeholder="Busca el Destino"
          onPress={(data, details = null) => console.log(data, details)}
          query={{ key: "" }}
          fetchDetails={true}
          onFail={error => console.log(error)}
          onNotFound={() => console.log("no results")}
          listEmptyComponent={() => (
            <View style={{ flex: 1 }}>
              <Text>No results were found</Text>
            </View>
          )}
        /> */}

          <GooglePlacesAutocomplete
            placeholder="Busca el Destino"
            onPress={(data, details) => onPressDestinationChange(data, details)}
            query={{ key: GOOGLE_MAPS_KEY }}
            fetchDetails={true}
            onFail={(error) => console.log(error)}
            onNotFound={() => console.log("no results")}
            listEmptyComponent={() => (
              <View style={{ flex: 1 }}>
                <Text>No se encontraron resultados-</Text>
              </View>
            )}
          />
        </View>

        <MapView
          ref={mapRef}
          loadingEnabled
          style={$mapViewStyle}
          provider={PROVIDER_GOOGLE}
          showsPointsOfInterest
          showsMyLocationButton
          initialRegion={{
            latitude: currentLocation ? currentLocation.latitude : 0,
            longitude: currentLocation ? currentLocation.longitude : 0,
            latitudeDelta: 0.0123,
            longitudeDelta: 0.00123,
          }}
          onPress={handleMapPress}
          // region={{
          //   latitude: region.latitude,
          //   longitude: region.longitude,
          //   latitudeDelta: 0.0123,
          //   longitudeDelta: 0.0023,
          // }}
          // onRegionChangeComplete={region => onRegionChange(region)}
        >
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Mi ubicación"
            />
          )}

          {destinoLocationFinal && (
            <Marker
              pinColor="blue"
              coordinate={{
                latitude: destinoLocationFinal.latitude,
                longitude: destinoLocationFinal.longitude,
              }}
              title="Destino"
            />
          )}

          {/* <Marker */}
          {/*  coordinate={region} */}
          {/*  tracksViewChanges={tracksViewChanges} */}
          {/* /> */}

          {/* <Circle */}
          {/*  center={region} */}
          {/*  radius={10} */}
          {/*  strokeWidth={2.5} */}
          {/*  strokeColor="red" */}
          {/*  fillColor="#B9B9B9" */}
          {/* /> */}
        </MapView>

        {destinoLocationInitial && destinoLocationFinal ? (
          <View style={$buttonContainer}>
            <Button
              testID="register"
              text={"Confirmar destino"}
              style={$tapButtonInitRoute}
              preset="reversed"
              onPress={handlerClickInitaRoute}
            />
          </View>
        ) : null}
      </View>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
const $mapViewStyle: ViewStyle = {
  flex: 1,
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
}
const $containerForm: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  width: Dimensions.get("window").width,
  zIndex: 4,
  position: "absolute",
  top: 10,
  padding: spacing.sm,
  marginTop: spacing.sm,
  // backgroundColor: colors.palette.neutral100,
}
const $conatinerUbication: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  width: Dimensions.get("window").width - 27,
  backgroundColor: colors.palette.neutral100,
  borderRadius: 5,
  marginBottom: spacing.xs,
}

const $myUbications: TextStyle = {
  flex: 1,
  alignSelf: "stretch",
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 16,
  height: 24,
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginVertical: spacing.xs,
  marginHorizontal: spacing.sm,
  marginTop: spacing.sm,
}
const $inputWrapperStyle: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignItems: "flex-start",
  // borderWidth: 1,

  // backgroundColor: colors.palette.neutral100,
  // borderColor: colors.palette.neutral400,
  overflow: "hidden",
}

const $containerIcon: ViewStyle = {
  marginEnd: spacing.xs,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
}

const $buttonContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  width: Dimensions.get("window").width,
  alignContent: "center",
  alignItems: "center",
  alignSelf: "center",
  zIndex: 4,
  position: "absolute",
  bottom: 20,
  padding: spacing.xs,
  // backgroundColor: 'red'
  // backgroundColor: colors.palette.neutral100,
}

const $tapButtonInitRoute: ViewStyle = {
  alignContent: "center",
  flex: 1,
  marginTop: spacing.xs,
  backgroundColor: colors.palette.accent500,
}
