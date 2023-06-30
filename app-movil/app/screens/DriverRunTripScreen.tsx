import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen } from "app/components"
import { IViaje, useStores } from "app/models"
import ViajeService from "../services/api/viaje.service"
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps/lib"
import { colors, spacing } from "../theme"
import { getCurrentLocatiton } from "../utils/helpers"
// import socket from "../utils/socket"
import MapViewDirections from "react-native-maps-directions"
import { GOOGLE_MAP_SERVER_KEY } from "../services/googleMapsApi"
import * as Location from "expo-location"
import { useSocket } from "app/context/socketContext"

const carImage = require("../../assets/images/app/car.png")
const locationClient = require("../../assets/images/app/location-user.png")

interface DriverRunTripScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"DriverRunTrip">> {}

export const DriverRunTripScreen: FC<DriverRunTripScreenProps> = observer(
  function DriverRunTripScreen(_props) {
    // @ts-ignore
    // eslint-disable-next-line camelcase
    const { viaje_id } = _props.route.params
    const viajeService = new ViajeService()
    const [viaje, setViaje] = useState<IViaje>(null)
    const [loading, setLoading] = useState(false)
    const [goOrigin, setGoOrigin] = useState(true)
    const [goDestination, setGoDestination] = useState(false)
    const mapRef = useRef<MapView>()
    const [currentLocation, setCurrentLocation] = useState(null)
    const { socket } = useSocket()
    const {
      authenticationStore: { socioId },
    } = useStores()

    useEffect(() => {
      ;(async () => {
        setLoading(true)
        // llamando la posicion  actual del conductor
        const response = await getCurrentLocatiton()
        // console.log('getCurrentLocatiton',response.status)
        if (response.status) {
          setCurrentLocation(response.location)
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion(response.location)
            }
          }, 1000)
        }

        const res = await viajeService.getById(viaje_id)

        if (res.kind === "ok") {
          console.log(res.data)
          setViaje(res.data)
          setLoading(false)
        }
      })()

      // return () => {
      //
      // }
    }, [])

    // seguimiento del carro
    useEffect(() => {
      async function getlocationcurees() {
        try {
          const tempWatcher = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 2,
              distanceInterval: 1,
            },
            (location) => {
              socket.emit("viaje_change_event", "")
              console.log(
                "actualizando posision  =>",
                location.coords.latitude,
                location.coords.longitude,
              )

              // setGps({
              //   location: {
              //     lat: location.coords.latitude,
              //     lng: location.coords.longitude,
              //   },
              // })

              tempWatcher.remove()
            },
          )
        } catch (error) {
          console.log("eror location", error)
        }
      }
      getlocationcurees().then()

      // conectar a sockets

      // eslint-disable-next-line camelcase
      socket.emit("viaje_join", { viaje_id, socio_id: socioId })

      socket.on("viaje_change_event" + socioId, (res) => {
        console.log("viaje_change_event=>", res)
      })

      return () => {
        // eslint-disable-next-line camelcase
        socket.emit("viaje_leave", { viaje_id })
        socket.off("viaje_change_event" + socioId)
      }
    }, [])

    async function handlerClickInitaRoute(): Promise<void> {
      // notificar llegada  o comenzar viaje
      if (goOrigin) {
        console.log("Notificar llegada")

        socket.emit("", "llegue al lugar ")
        setGoOrigin(false)
      } else if (!goDestination) {
        console.log("Notificar ir al destino ")
        socket.emit("", "viaje en transcurso")
        setGoDestination(true)
      } else {
        // finalizado
        console.log("llegamos ")
        // eslint-disable-next-line camelcase
        const res = await viajeService.changeStatusViajeById({ estado: "FINALIZADO", viaje_id })
        //   .then((res: any) => {
        // console.log(res.kind)
        if (res.kind === "ok") {
          socket.emit("", res.data)
          console.log(res.data)
          setViaje(res.data)
          setLoading(false)
        }
        setGoDestination(false)
      }
    }

    return (
      <Screen style={$root} preset="scroll">
        {viaje && !loading ? (
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
          >
            {/* todo primero ir a recoger al cliente */}
            {viaje && (
              <Marker
                image={locationClient}
                coordinate={{
                  latitude: viaje ? viaje?.start_latitude : 0,
                  longitude: viaje ? viaje?.start_longitude : 0,
                }}
                title="Cliente"
              />
            )}
            {currentLocation && (
              <Marker
                draggable
                coordinate={{
                  latitude: currentLocation ? currentLocation.latitude : 0,
                  longitude: currentLocation ? currentLocation.longitude : 0,
                }}
                image={carImage}
              />
            )}
            {currentLocation && goOrigin && (
              <MapViewDirections
                origin={{
                  latitude: currentLocation ? currentLocation.latitude : 0,
                  longitude: currentLocation ? currentLocation.longitude : 0,
                }}
                destination={{
                  latitude: viaje ? viaje?.start_latitude : 0,
                  longitude: viaje ? viaje?.start_longitude : 0,
                }}
                apikey={GOOGLE_MAP_SERVER_KEY}
                strokeColor="black"
                strokeWidth={5}
              />
            )}

            {currentLocation && goDestination && (
              <MapViewDirections
                origin={{
                  latitude: viaje ? viaje?.start_latitude : 0,
                  longitude: viaje ? viaje?.start_longitude : 0,
                }}
                destination={{
                  latitude: viaje ? viaje?.end_latitude : 0,
                  longitude: viaje ? viaje?.end_longitude : 0,
                }}
                apikey={GOOGLE_MAP_SERVER_KEY}
                strokeColor="green"
                strokeWidth={5}
              />
            )}
          </MapView>
        ) : null}

        <View style={$buttonContainer}>
          <Button
            testID="register"
            text={
              goOrigin ? "Notificar LLegada" : goDestination ? "Finalizar Viaje" : "Comenzar Viaje"
            }
            style={$tapButtonInitRoute}
            preset="reversed"
            onPress={handlerClickInitaRoute}
          />
        </View>
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
  bottom: 50,
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
