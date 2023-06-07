import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, TextStyle, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { DriverTabScreenProps } from "app/navigators"
import { Icon, ListItem, Screen, Text } from "app/components"
import { colors, spacing, typography } from "../theme"
import { IViaje, useStores } from "../models"
import ViajeService from "../services/api/viaje.service"
import socket from "../utils/socket"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
import { useNavigation } from "@react-navigation/native"

// import { useStores } from "app/models"

interface DriverHomeScreenProps
  extends NativeStackScreenProps<DriverTabScreenProps<"DriverHome">> {}

export const DriverHomeScreen: FC<DriverHomeScreenProps> = observer(function DriverHomeScreen() {
  const {
    authenticationStore: { socioId },
  } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()

  const [viajes, setViajes] = useState<IViaje[]>([])
  const [newViajeActive, setNewViajeActive] = useState<IViaje[]>([])
  const [loading, setLoading] = useState(false)

  const viajeService = new ViajeService()
  // console.log('socioID', socioId)
  // Pull in navigation via hook
  // const navigation = useNavigation()
  // listar los ultimos 5 viajes del socio
  const listLastTrip = async () => {
    console.log("socioID", socioId)
    const viajeRes = await viajeService.getLast(socioId)
    if (viajeRes.kind === "ok") {
      setViajes(viajeRes.data)
    }
  }
  useEffect(() => {
    console.log("escuchando sockets..", socioId)

    socket.on("socio_events_" + socioId, (res) => {
      console.log("socio_events_" + socioId, res)
      if (socioId === res.socio_id) {
        // todo solo asigna un viaje
        setNewViajeActive([res.data])
      }
    })
    return () => {
      socket.off("socio_events_" + socioId)
    }
  }, [socket])

  useEffect(() => {
    listLastTrip()
  }, [])

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
          onPress: () => {
            // todo hacer algi si no hacepta para mandar a otro veiculo
          },
          style: "cancel",
        },
      ],
      { cancelable: false },
      // clicking out side of alert will not cancel
    )
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text style={$title}>Lista Historial</Text>
      <DemoDivider size={30} />
      <View style={$secctionNewTrip}>
        {newViajeActive.map((viaje, index) => {
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
        })}
      </View>

      <DemoDivider size={20} />
      <View style={$secctionTopLast}>
        <Text style={$title}>Ultimos Viajes</Text>
        {/* <FlatList */}
        {/*  keyboardShouldPersistTaps='handled' */}
        {/*  data={viajes} */}
        {/*  style={$flatListStyle} */}
        {/*  renderItem={({ item, index }) => ( */}
        {viajes.map((item, index) => (
          <ListItem
            key={index}
            // rightIcon="caretRight"
            topSeparator
            // TextProps={{ numberOfLines: 1 }}
            // topSeparator={index !== 0}
          >
            <View style={{ flex: 1, height: 20 }}>
              <Text size="xs" style={{}}>
                <Icon size={20} icon="BrandgoogleMaps" /> {item.initial_address}
              </Text>
              <Text size="xs" style={{}}>
                <Icon size={20} icon="carService" />
                {item.final_address}
              </Text>
              {/* <Text size='xxs'  >Fecha: {item.createdAt}</Text> */}
            </View>
          </ListItem>
        ))}
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
  backgroundColor: "red",
}
const $title: TextStyle = {
  fontFamily: typography.primary.bold,
}
const $flatListStyle: ViewStyle = {
  paddingHorizontal: spacing.extraSmall,
  backgroundColor: colors.palette.neutral200,
  flex: 1,
  overflow: "scroll",
}

const $secctionTopLast: ViewStyle = {
  // flex: 1,
  // flexDirection:"column",
  paddingHorizontal: spacing.extraSmall,
  backgroundColor: colors.palette.neutral200,
}

const $secctionNewTrip: ViewStyle = {
  // flex:1,
  // flexDirection:"column",
  height: 80,
  paddingHorizontal: spacing.extraSmall,
  backgroundColor: colors.palette.accent300,
  borderRadius: 20,
}
