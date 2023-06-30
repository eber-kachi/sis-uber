import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { DriverTabScreenProps } from "app/navigators"
import { Button, Screen, Text, Toggle, ToggleProps } from "app/components"
import { useStores } from "../models"
import { useNavigation } from "@react-navigation/core"
import { spacing } from "../theme"
import SocioService from "../services/api/socio.service"
import { getCurrentLocatiton } from "app/utils/helpers"
import socket from "app/utils/socket"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

function ControlledToggle(props: ToggleProps) {
  // const [value, setValue] = React.useState(props.value ? props.value : false)
  // return <Toggle {...props} value={value} />
  return <Toggle {...props} value={props.value ? props.value : false} />
}

interface DriverSettingsScreenProps
  extends NativeStackScreenProps<DriverTabScreenProps<"DriverSettings">> {}

export const DriverSettingsScreen: FC<DriverSettingsScreenProps> = observer(
  function DriverSettingsScreen() {
    const {
      authenticationStore: { logout, listenLocationUser, authEmail, setListenLocation, socioId },
    } = useStores()
    // Pull in navigation via hook
    const navigation = useNavigation()
    const socioService = new SocioService()
    const [location, setLocation] = useState(null)

    async function handlerState(status: boolean) {
      // console.log(listenLocationUser)

      // if  (status){
      await socioService
        .changeStatus({
          state: status ? "LIBRE" : "SINSERVICO",
          socio_id: authEmail,
          location,
        })
        .then((res) => {
          // console.log("success =>>>>>", res)

          if (res.kind === "ok") {
            socket.emit("socios_conectados", { socio_id: socioId, location })

            setListenLocation(status)
          } else {
            setListenLocation(false)
          }
        })
        .catch((error) => {
          console.log("error =>>>>", error)
          setListenLocation(false)
        })
      // .finally()
      // const res =  await socioService.changeStatus({ state: status ? "LIBRE" : "SINSERVICO", socio_id: 'ffe981d1-1a0d-4cf2-8849-842bf9039dd4' })
      // }
    }
    const findSocio = async () => {
      const socioresponse = await socioService.getById(socioId)
      console.log({ socioresponse })
      if (socioresponse.kind === "ok") {
        console.log(socioresponse.data.estado)
        if (socioresponse.data.estado === "LIBRE") {
          setListenLocation(true)
        }
      }
    }

    useEffect(() => {
      console.log("listo para unirce", listenLocationUser)

      if (listenLocationUser) {
        console.log("socio_join", socioId)
        socket.emit("socio_join", socioId)
      } else {
        console.log("socio_leave", socioId)
        socket.emit("socio_leave", socioId)
      }

      return () => {
        console.log("salio ")
      }
    }, [listenLocationUser])

    useEffect(() => {
      ;(async () => {
        const res = await getCurrentLocatiton()
        if (res.status) {
          setLocation({ latitude: res.location.latitude, longitude: res.location.longitude })
        }
      })()
      findSocio()
    }, [])

    return (
      <Screen
        preset="scroll"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <Text preset="bold" style={$title} text="Configuraciones" />
        <View style={$container}>
          <View style={$toggleContainer}>
            <Text preset="bold" style={$titleEstado} text="Estado:" />
            <ControlledToggle
              variant="switch"
              value={listenLocationUser}
              onValueChange={handlerState}
              containerStyle={$centeredOneThirdCol}
            />
            {/* <Button style={$button} tx="common.logOut" onPress={logout}/> */}
          </View>
          <View style={$buttonContainer}>
            <Button style={$button} tx="common.logOut" onPress={logout} />
          </View>
        </View>
      </Screen>
    )
  },
)
const $screenContentContainer: ViewStyle = {
  flex: 1,
}
const $title: TextStyle = {
  marginBottom: spacing.huge,
  paddingHorizontal: spacing.large,
}
const $titleEstado: TextStyle = {
  // marginBottom: spacing.huge,
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
}

const $container: ViewStyle = {
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.huge,
  paddingHorizontal: spacing.large,
  // backgroundColor: "red",

  flex: 1,
}
const $button: ViewStyle = {
  marginBottom: spacing.extraSmall,
}
const $buttonContainer: ViewStyle = {
  marginBottom: spacing.medium,
}
const $toggleContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.huge,
}
const $centeredOneThirdCol: ViewStyle = {
  width: "33.33333%",
  alignItems: "center",
  justifyContent: "center",
}
