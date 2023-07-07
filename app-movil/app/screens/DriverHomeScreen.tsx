/* eslint-disable react-native/no-inline-styles */
/* eslint-disable camelcase */

import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, TextStyle, View, ViewStyle, FlatList, SafeAreaView, Vibration } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { DriverTabScreenProps } from "app/navigators"
import { Icon, ListItem, Screen, Text } from "app/components"
import { colors, spacing, typography } from "../theme"
import { IViaje, useStores } from "../models"
import ViajeService from "../services/api/viaje.service"
// import socket from "../utils/socket"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
import { useNavigation } from "@react-navigation/native"

// import { useStores } from "app/models"
import { useSocket } from "app/context/socketContext"
import SocioService from "app/services/api/socio.service"
import { socket } from "../context/socketContext"

interface DriverHomeScreenProps
  extends NativeStackScreenProps<DriverTabScreenProps<"DriverHome">> {}

export const DriverHomeScreen: FC<DriverHomeScreenProps> = observer(function DriverHomeScreen() {
  const {
    authenticationStore: { socio_id },
  } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const { socket } = useSocket()
  const [viajes, setViajes] = useState<IViaje[]>([])
  const [newViajeActive, setNewViajeActive] = useState<IViaje[]>([])
  const [loading, setLoading] = useState(false)

  const viajeService = new ViajeService()
  const socioService = new SocioService()

  const listLastTrip = async () => {
    // console.log(socio_id + "  listando ultimos viajes => de", socio_id)
    const viajeRes = await viajeService.getLast(socio_id)
    if (viajeRes.kind === "ok") {
      console.log(viajeRes.data)
      setViajes(viajeRes.data)
    }
  }
  const removeCompletions = (newTripActive: IViaje[], viajes: IViaje[]) => {
    const newTripActiveWithoutCompletions = []
    for (const trip of newTripActive) {
      if (!viajes.some((t) => t.id === trip.id && t.estado === "FINALIZADO")) {
        newTripActiveWithoutCompletions.push(trip)
      }
    }
    return newTripActiveWithoutCompletions
  }

  useEffect(() => {
    // console.log("socio_events_change")
    // console.log("viajes=>  ", viajes.length)

    // socket.on("socio_events_change_" + socioId, (res) => {
    socket.on("socio_events_change", (res) => {
      // console.log("socio_events_change" + socio_id)
      if (socio_id === res.socio_id) {
        Vibration.vibrate([500, 800, 400])
        // todo solo asigna un viaje
        setNewViajeActive((previusValue) => [...previusValue, res.data])
      }
    })
    return () => {
      // socket.off("socio_events_" + socioId)
    }
  }, [socio_id, socket.connected])
  // }, [socioId])

  useEffect(() => {
    if (socio_id.length > 1) {
      listLastTrip()
    }
  }, [socio_id])

  const apceptTrip = async (viaje_id: string) => {
    // console.log("apceptTrip", viaje_id)
    Alert.alert(
      // title
      "Nuevo Viaje",
      // body
      "Aceptar viaje?",
      [
        {
          text: "Si acepto",
          onPress: async () => {
            setLoading(true)
            const res = await viajeService.changeStatusViajeById({ viaje_id, estado: "CONFIRMADO" })
            if (res.kind === "ok") {
              console.log("apceptTrip", res.kind)
              // cambiamos al chofer como ocupado
              await socioService.changeStatus({ socio_id, state: "OCUPADO" })
              socket.emit("socios_conectados")
              socket.emit("asignacion_event_socio", { socio_id, data: res.data })
              setLoading(false)
              navigation.navigate("DriverRunTrip", {
                viaje_id,
              })
            }
          },
        },
        {
          text: "No acepto",
          onPress: async () => {
            setLoading(true)
            const res = await viajeService.changeStatusViajeById({
              viaje_id,
              estado: "pendiente_confirmacion",
            })
            if (res.kind === "ok") {
              console.log("apceptTrip", res.kind)
              socket.emit("asignacion_event_socio", { socio_id, data: res.data })
              setLoading(false)
              setNewViajeActive((viajes) => viajes.filter((item) => item.id !== res.data.id))
            }
          },
          style: "cancel",
        },
      ],
      { cancelable: false },
      // clicking out side of alert will not cancel
    )
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (socio_id.length > 1) {
        listLastTrip()
        // revisamos si hay duplicado en NewViajeActive y viajes
        setNewViajeActive((previusValue) => removeCompletions(previusValue, viajes))
      }
    })
    return unsubscribe
  }, [navigation])

  return (
    <Screen contentContainerStyle={$screenContentContainer} safeAreaEdges={["top", "bottom"]}>
      <Text style={$title}>Lista Historial</Text>
      <DemoDivider size={30} />
      <View style={$secctionNewTrip}>
        {newViajeActive.length !== 0 ? (
          newViajeActive.map((viaje, index) => {
            return (
              <ListItem
                key={index}
                disabled={loading}
                rightIcon={loading ? "loading" : "caretRight"}
                bottomSeparator
                onPress={() => apceptTrip(viaje.id)}
              >
                <Text size="xs" style={{}}>
                  <Icon size={20} icon="BrandgoogleMaps" /> {viaje.initial_address}
                </Text>
              </ListItem>
            )
          })
        ) : (
          <Text size="xs">Sin datos.</Text>
        )}
      </View>

      <DemoDivider size={20} />
      <View style={$secctionTopLast}>
        <Text style={$subTitle} size="xs">
          Ultimos Viajes
        </Text>
        <SafeAreaView style={{ marginTop: 10 }}>
          {viajes.length !== 0 ? (
            <FlatList
              data={viajes}
              renderItem={({ item, index }) => (
                <ListItem
                  key={index}
                  topSeparator
                  rightIcon={item.estado === "FINALIZADO" ? "checkedSuccess" : "info"}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Icon size={18} icon="BrandgoogleMaps" />
                      <Text size="xs">{item.initial_address}</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Icon size={18} icon="carService" />
                      <Text size="xs">{item.final_address}</Text>
                    </View>
                    {/* <Text size='xxs'  >Fecha: {item.createdAt}</Text> */}
                  </View>
                </ListItem>
              )}
            />
          ) : (
            <Text size="xs">Sin historial.</Text>
          )}
        </SafeAreaView>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  flex: 1,
  paddingVertical: spacing.micro,
  paddingHorizontal: spacing.medium,
  backgroundColor: colors.background,
}
const $title: TextStyle = {
  fontFamily: typography.primary.bold,
}
const $subTitle: TextStyle = {
  fontFamily: typography.primary.bold,
}

const $secctionTopLast: ViewStyle = {
  paddingHorizontal: spacing.extraSmall,
  backgroundColor: colors.palette.neutral200,
}

const $secctionNewTrip: ViewStyle = {
  paddingHorizontal: spacing.extraSmall,
  backgroundColor: colors.palette.accent300,
  borderRadius: 20,
}
