import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, ImageStyle, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Button, Icon, Screen, Text } from "app/components"
import { ClientTabScreenProps } from "app/navigators"
import { useNavigation, useRoute } from "@react-navigation/native"
import MapView, { Circle, PROVIDER_GOOGLE, Marker } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { GOOGLE_MAP_SERVER_KEY } from "../services/googleMapsApi"
import { colors, spacing } from "../theme"
import { useStores } from "app/models"
import ViajeService from "../services/api/viaje.service"
import socket from "app/utils/socket"

interface ClientConfirmationScreenProps
  extends NativeStackScreenProps<ClientTabScreenProps<"ClientConfirmation">> {
}

export const ClientConfirmationScreen: FC<ClientConfirmationScreenProps> = observer(
  function ClientConfirmationScreen(_props) {
    const route = useRoute()
    // @ts-ignore
    const { origin, destination } = _props.route.params
    // @ts-ignore
    const viajeAddress = _props.route.params?.viaje
    const {
      authenticationStore: { authEmail },
    } = useStores()
    const viajeService = new ViajeService()

    // console.log("Origen=>", origin)
    // console.log("Destination=>", destination)
    // console.log("Props=>", _props.route.params)
    const [loadingBtn, setLoadingBtn] = useState(false)
    // console.log("Prams=>", route.params)
    const mapRef = useRef<MapView>()
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    const navigation = useNavigation()

    useEffect(() => {
      // setDestinoLocationInitial(null)
      // setDestinoLocationFinal(null)
      const coordinates = [origin, destination]
      // if (!locationRejected) {
      setTimeout(() => {
        // poner de la base de datos
        // mapRef.current.animateToRegion({
        //   latitude: origin?.latitude,
        //   longitude: origin?.longitude,
        //   latitudeDelta: 0.0123,
        //   longitudeDelta: 0.0023
        // });

        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 150, right: 50, bottom: 150, left: 50 },
          // edgePadding: DEFAULT_PADDING,
          animated: true,
        })


      }, 2000)
      // } else {
      // -17.394228156430533, -66.28467617356642
      // }
    }, [mapRef.current])


    function handlerClickSolicitarTaxiOperador(): void {
      setLoadingBtn(true)

      viajeService.create({
        start_latitude: origin.latitude,
        start_longitude: origin.longitude,

        end_latitude: destination.latitude,
        end_longitude: destination.longitude,
        initial_address: viajeAddress.orgin,
        final_address: viajeAddress.destination,
        user_email: authEmail,
        estado: "pendiente_confirmacion",
      }).then(res => {
        if (res.kind === "ok") {
          console.log("handlerClickSolicitarTaxiOperador", res.data)
          socket.emit("pendiente_confirmacion", res.data)

        }
      }).catch(error => {
        setLoadingBtn(false)
      })
      console.log("Solocitando viaje....")
    }

    return (
      <Screen style={$root} preset="scroll">
        <MapView
          ref={mapRef}
          loadingEnabled
          style={$mapViewStyle}
          provider={PROVIDER_GOOGLE}
          showsPointsOfInterest
          showsMyLocationButton
          // initialRegion={{
          //   latitude: origin ? origin.latitude : 0,
          //   longitude: origin ? origin.longitude : 0,
          //   latitudeDelta: 0.0123,
          //   longitudeDelta: 0.0023,
          // }}
          // region={{
          //   latitude: region.latitude,
          //   longitude: region.longitude,
          //   latitudeDelta: 0.0123,
          //   longitudeDelta: 0.0023,
          // }}
          // onRegionChangeComplete={region => onRegionChange(region)}
        >
          {origin && (
            <Marker
              coordinate={{
                latitude: origin.latitude,
                longitude: origin.longitude,
              }}
              title="Mi ubicación"
            />
          )}

          {destination && (
            <Marker
              pinColor="blue"
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title="Destino"
            />
          )}


          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAP_SERVER_KEY}
            strokeColor="black"
            strokeWidth={5}
          />

          {/* <Circle */}
          {/*  center={region} */}
          {/*  radius={10} */}
          {/*  strokeWidth={2.5} */}
          {/*  strokeColor="red" */}
          {/*  fillColor="#B9B9B9" */}
          {/* /> */}
        </MapView>

        {origin && destination ? (
          <View style={$buttonContainer}>
            <Button
              LeftAccessory={(props) => (
                loadingBtn &&
                <Icon containerStyle={props.style} style={$iconStyle} icon="loading"/>
              )}
              testID="registera"
              text={loadingBtn ? "Esperando..." : "Solicitar"}
              style={$tapButtonInitRoute}
              preset="reversed"
              onPress={handlerClickSolicitarTaxiOperador}
            />
          </View>
        ) : null}
      </Screen>
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
  padding: spacing.extraSmall,
  // backgroundColor: 'red'
  // backgroundColor: colors.palette.neutral100,
}

const $tapButtonInitRoute: ViewStyle = {
  alignContent: "center",
  flex: 1,
  marginTop: spacing.extraSmall,
  backgroundColor: colors.palette.accent500,
}
const $iconStyle: ImageStyle = { width: 30, height: 30 }
