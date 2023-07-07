import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, Dimensions, ImageStyle, View, ViewStyle, Vibration } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Button, Icon, Screen } from "app/components"
import { ClientTabScreenProps } from "app/navigators"
import { useNavigation } from "@react-navigation/native"
import MapView, { Circle, PROVIDER_GOOGLE, Marker, MapMarker } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { GOOGLE_MAP_SERVER_KEY } from "../services/googleMapsApi"
import { colors, spacing } from "../theme"
import { useStores } from "app/models"
import ViajeService from "../services/api/viaje.service"
// import socket from "app/utils/socket"
import { useSocket } from "app/context/socketContext"
import { Rating, AirbnbRating } from "react-native-ratings"
const carYellow = require("../../assets/images/app/car-yellow.png")

interface ClientConfirmationScreenProps
  extends NativeStackScreenProps<ClientTabScreenProps<"ClientConfirmation">> {}

export const ClientConfirmationScreen: FC<ClientConfirmationScreenProps> = observer(
  function ClientConfirmationScreen(_props) {
    // const route = useRoute()
    // @ts-ignore
    const { origin, destination } = _props.route.params
    // @ts-ignore
    const viajeAddress = _props.route.params?.viaje
    const {
      authenticationStore: { authEmail },
    } = useStores()
    const viajeService = new ViajeService()
    const { socket } = useSocket()
    // console.log("Origen=>", origin)
    // console.log("Destination=>", destination)
    // console.log("Props=>", _props.route.params)
    const [loadingBtn, setLoadingBtn] = useState(false)
    const [confirmado, setConfirmado] = useState(false)
    const [viajeIdConfirmado, setViajeidConfirmado] = useState(null)
    // console.log("Prams=>", route.params)
    const mapRef = useRef<MapView>()
    const carRef = useRef<MapMarker>()
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    console.log("renders")
    const [carTrack, setCarTrack] = useState<any>()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const { navigation } = _props
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

    useEffect(() => {
      socket.on("socio-events-change", (res: { socio_id: string; data: any }) => {
        console.log("viaje confirmado... ", res?.data)
        console.log(viajeIdConfirmado, res?.data?.id)

        if (viajeIdConfirmado === res?.data?.id) {
          console.log("quitamos loader  ")
          // nos unimos a los eventos del socio
          socket.emit("socio_join", res.socio_id)
          // sacar socio data y mostrar en la pandatalla
          // sacar en pantalla datos del socio que acepto el viaje
          setConfirmado(true)
          setLoadingBtn(false)
          socket.emit("socio_join", res.socio_id)
        }

        // if (viajeIdConfirmado === res?.data?.id && res.data.estado === "FINALIZADO") {
        //   // navigation.navigate("ClientEndOfTrip", { viaje_id: viajeIdConfirmado })
        //   navigation.navigate("Client", {
        //     screen: "ClientEndOfTrip",
        //     params: { viaje_id: viajeIdConfirmado },
        //   })
        // }
      })

      socket.on("viaje_change_track", (res: { socio_id: string; position: any }) => {
        console.log("track socio ", res.position)
        setCarTrack(res.position)
      })
      socket.on(
        "change-notifications_event",
        (res: { socio_id: string; message: any; type?: string }) => {
          console.log("notifications=> ", res.message)
          Vibration.vibrate([500, 800, 400])
          if (res.message && !res.type) {
            Alert.alert("Alerta", res.message, [
              {
                text: "Aceptar",
                onPress: () => {
                  console.log("")
                },
              },
            ])
          }
          if (res.type === "COMENZAR") {
            // mandar las ultimas ubicaciones del viaje
            // fecha y hora de comienzo del viaje
          }

          if (res.type === "FINALIZADO") {
            console.log("notifications=> ", res.message)
            Alert.alert(res.type, res.message, [
              {
                text: "Aceptar",
                onPress: () => {
                  console.log("navegamos al calificacion ")
                  // mandar al screen de calificar
                  console.log({ viaje_id: viajeIdConfirmado })

                  navigation.navigate("ClientEndOfTrip", {
                    viaje_id: viajeIdConfirmado,
                  })
                  // navigation.navigate("ClientEndOfTrip", {

                  //   params: { viaje_id: viajeIdConfirmado },
                  // })
                },
              },
            ])
          }
        },
      )

      return () => {
        socket.off("viaje_change_track")
        socket.off("change-notifications_event")
      }
    }, [viajeIdConfirmado, socket.connected])

    useEffect(() => {
      // This effect will run after each state update
      console.log("Count has been updated:", viajeIdConfirmado)
    }, [viajeIdConfirmado])

    function handlerClickSolicitarTaxiOperador(): void {
      setLoadingBtn(true)

      viajeService
        .create({
          start_latitude: origin.latitude,
          start_longitude: origin.longitude,

          end_latitude: destination.latitude,
          end_longitude: destination.longitude,
          initial_address: viajeAddress.orgin,
          final_address: viajeAddress.destination,
          user_email: authEmail,
          estado: "pendiente_confirmacion",
        })
        .then((res) => {
          if (res.kind === "ok") {
            console.log("handlerClickSolicitarTaxiOperador", res?.data?.id)
            setViajeidConfirmado(() => res?.data?.id)
            console.log(viajeIdConfirmado)

            socket.emit("pendiente_confirmacion", res.data)
          }
        })
        .catch((error) => {
          console.log(error)
          setLoadingBtn(false)
        })
      console.log("Solocitando viaje....")
    }

    function handlerClickShowTaxiOperador(): void {
      console.log("mostrar ubicacion del veiculo.")
      const coordinates = [origin, destination, carTrack]
      setTimeout(() => {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 150, right: 50, bottom: 150, left: 50 },
          // edgePadding: DEFAULT_PADDING,
          animated: true,
        })
      }, 2000)
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

          {confirmado && (
            <Marker
              image={carYellow}
              // ref={carRef}
              coordinate={{
                latitude: carTrack ? carTrack.latitude : origin.latitude,
                longitude: carTrack ? carTrack.longitude : origin.longitude,
              }}
              title="Car" // podia ir placa
            />
          )}
        </MapView>

        {confirmado === false && origin && destination ? (
          <View style={$buttonContainer}>
            <Button
              LeftAccessory={(props) =>
                loadingBtn && (
                  <Icon containerStyle={props.style} style={$iconStyle} icon="loading" />
                )
              }
              testID="registeras"
              text={loadingBtn ? "Esperando..." : "Solicitar vehiculo"}
              style={$tapButtonInitRoute}
              preset="reversed"
              disabled={loadingBtn}
              onPress={handlerClickSolicitarTaxiOperador}
            />
          </View>
        ) : (
          <View style={$buttonContainer}>
            <Button
              LeftAccessory={(props) =>
                loadingBtn && (
                  <Icon containerStyle={props.style} style={$iconStyle} icon="loading" />
                )
              }
              testID="registeras"
              text={"Ver ubicacion del veiculo"}
              style={$tapButtonInitRoute}
              preset="reversed"
              disabled={loadingBtn}
              onPress={handlerClickShowTaxiOperador}
            />
          </View>
        )}
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
