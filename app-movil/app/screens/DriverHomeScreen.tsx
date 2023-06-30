/* eslint-disable camelcase */

import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Alert,
  RefreshControl,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
  SafeAreaView,
} from "react-native"
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

interface DriverHomeScreenProps
  extends NativeStackScreenProps<DriverTabScreenProps<"DriverHome">> {}

export const DriverHomeScreen: FC<DriverHomeScreenProps> = observer(function DriverHomeScreen() {
  const {
    authenticationStore: { socioId },
  } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const { socket } = useSocket()
  const [viajes, setViajes] = useState<IViaje[]>([])
  const [newViajeActive, setNewViajeActive] = useState<IViaje[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false)

  const viajeService = new ViajeService()

  const listLastTrip = async () => {
    console.log("listando ultimos viajes => de", socioId)
    const viajeRes = await viajeService.getLast(socioId)
    if (viajeRes.kind === "ok") {
      console.log(viajeRes.data)

      setViajes(viajeRes.data)
    }
  }
  useEffect(() => {
    console.log("socio_events_change")
    console.log("viajes=>  ", viajes.length)

    // socket.on("socio_events_change_" + socioId, (res) => {
    socket.on("socio_events_change", (res) => {
      console.log("socio_events_change" + socioId)
      if (socioId === res.socio_id) {
        // todo solo asigna un viaje
        setNewViajeActive([res.data])
      }
    })
    return () => {
      // socket.off("socio_events_" + socioId)
    }
  }, [socioId])
  // }, [socioId])

  useEffect(() => {
    if (socioId.length > 1) {
      listLastTrip()
    }
  }, [socioId])

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
              socket.emit("asignacion_event_socio", { socio_id: socioId, data: res.data })
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
              socket.emit("asignacion_event_socio", { socio_id: socioId, data: res.data })
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
      if (socioId.length > 1) {
        listLastTrip()
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
            // viajes.map((item, index) => (
            //   <ListItem key={index} topSeparator style={{ height: 100 }}>
            //     <View
            //       style={{
            //         flexDirection: "column",
            //         flex: 1,
            //         height: 50,
            //         backgroundColor: "red",
            //       }}
            //     >
            //       <Text
            //         size="xs"
            //         style={{ justifyContent: "center", alignItems: "flex-start", height: 30 }}
            //       >
            //         <Icon
            //           style={{ alignItems: "flex-start", justifyContent: "center" }}
            //           size={18}
            //           icon="BrandgoogleMaps"
            //         />{" "}
            //         {item.initial_address}
            //       </Text>

            //       <Text size="xs" style={{}}>
            //         <Icon size={20} icon="carService" />
            //         {item.final_address} {item.initial_address}
            //       </Text>
            //       {/* <Text size='xxs'  >Fecha: {item.createdAt}</Text> */}
            //     </View>
            //   </ListItem>
            // ))
            <FlatList
              data={viajes}
              renderItem={({ item, index }) => (
                <ListItem
                  key={index}
                  topSeparator
                  RightComponent={
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "flex-end",
                        alignSelf: "center",
                      }}
                    >
                      {item.estado === "COMPLETADO" && <Icon size={18} icon="checkedSuccess" />}
                    </View>
                  }
                >
                  {/* <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  > */}
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

                  {/* <View
                      style={{
                        // alignItems: "center",
                        flex: 1,
                      }}
                    >
                      {item.estado === "COMPLETADO" ? (
                        <Icon size={18} icon="carService" />
                      ) : (
                        <Icon size={18} icon="carService" />
                      )}
                    </View>
                  </View> */}
                </ListItem>
              )}
            />
          ) : (
            // <ListItem topSeparator>
            //   <View style={{ flex: 1, height: 20 }}>
            <Text size="xs">Sin historial.</Text>
            //  </View>
            // </ListItem>
          )}
        </SafeAreaView>
        {/*  )} */}
        {/* /> */}
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
  // fontSize: 14,
}
// const $flatListStyle: ViewStyle = {
//   paddingHorizontal: spacing.extraSmall,
//   backgroundColor: colors.palette.neutral200,
//   flex: 1,
//   overflow: "scroll",
// }

const $secctionTopLast: ViewStyle = {
  // flex: 1,
  // flexDirection:"column",
  paddingHorizontal: spacing.extraSmall,
  backgroundColor: colors.palette.neutral200,
}

const $secctionNewTrip: ViewStyle = {
  // flex:1,
  // flexDirection:"column",
  // height: 80,
  paddingHorizontal: spacing.extraSmall,
  backgroundColor: colors.palette.accent300,
  borderRadius: 20,
}
