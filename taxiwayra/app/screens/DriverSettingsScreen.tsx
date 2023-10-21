import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { DriverTabScreenProps } from "app/navigators"
import { Button, Screen, Text, Toggle, ToggleProps, Icon, AutoImage, Card } from "app/components"
import { useStores } from "../models"
import { colors, spacing } from "../theme"
import SocioService from "../services/api/socio.service"
// import socket from "app/utils/socket"
import { useSocket } from "app/context/socketContext"
import { urlImgServer } from "app/services/image"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"
import { getCurrentLocatiton } from "app/utils/helpers"

const userNotFound = require("../../assets/images/app/user-notfound.png")

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
      authenticationStore: { logout, listenLocationUser, authEmail, setListenLocation, socio_id },
    } = useStores()
    // Pull in navigation via hook
    // const navigation = useNavigation()
    const socioService = new SocioService()
    const [location, setLocation] = useState(null)
    const { socket } = useSocket()
    const [Loading, setLoading] = useState<boolean>(false)
    const [socio, setSocio] = useState(null)

    async function handlerState(status: boolean) {
      console.log("handlerState => ", { listenLocationUser, status })
      setLoading(true)
      // if  (status){
      await socioService
        .changeStatus({
          state: status ? "LIBRE" : "SINSERVICO",
          socio_id: authEmail,
          location,
        })
        .then((res) => {
          if (res.kind === "ok") {
            console.log("success =>>>>>", res.data.estado)
            setListenLocation(status)
            // socket.emit("socios_conectados", { socio_id, location })
            setLoading(false)
          } else {
            setListenLocation(false)
            setLoading(false)
          }
        })
        .catch((error) => {
          console.log("error =>>>>", error)
          setListenLocation(false)
          setLoading(false)
        })
      // .finally()
      // const res =  await socioService.changeStatus({ state: status ? "LIBRE" : "SINSERVICO", socio_id: 'ffe981d1-1a0d-4cf2-8849-842bf9039dd4' })
      // }
    }

    const findSocio = async () => {
      const socioresponse = await socioService.getById(socio_id)
      console.log({ socioresponse })
      if (socioresponse.kind === "ok") {
        console.log(socioresponse.data.estado)
        setSocio(socioresponse.data)
        if (socioresponse.data.estado === "LIBRE") {
          setListenLocation(true)
        }
      }
    }
    const handlerLogout = async () => {
      const response = await socioService.changeStatus({
        state: "SINSERVICO",
        socio_id: authEmail,
        location,
      })
      if (response.kind === "ok") {
        setListenLocation(false)
        logout()
      }
    }
    // useEffect(() => {
    //   console.log("listo para unirce", listenLocationUser)

    //   join()

    //   return () => {
    //     console.log("salio ")
    //   }
    // }, [listenLocationUser, socket])

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
          {/* <Text>{JSON.stringify(socio)}</Text> */}
          <View style={{ marginBottom: spacing.md }}>
            <Card
              HeadingComponent={<Text preset="bold" style={$text} text="Datos:" />}
              ContentComponent={
                <View style={{ flexDirection: "row" }}>
                  {socio && socio?.foto ? (
                    <AutoImage
                      maxWidth={60}
                      style={$aspectRatioBox}
                      source={{
                        uri: urlImgServer(`public/socios-files/${socio && socio?.foto}`),
                      }}
                    />
                  ) : (
                    <AutoImage maxWidth={60} style={$aspectRatioBox} source={userNotFound} />
                  )}

                  <View style={{ marginLeft: spacing.md }}>
                    <Text preset="default" style={$text}>
                      <Icon icon="user" color={colors.tint} size={20} />{" "}
                      {`${socio?.nombres} ${socio?.apellidos}`}
                    </Text>
                    <Text preset="default" style={$text}>
                      <Icon icon="userTeam" color={colors.tint} size={20} />{" "}
                      {`${socio?.grupotrabajo ? socio.grupotrabajo.nombre : "Sin grupo"} `}
                    </Text>
                  </View>
                </View>
              }
            />
          </View>

          <View style={$toggleContainer}>
            <Text preset="bold" style={$titleEstado} text="Estado:" />
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              {Loading && <Icon size={25} icon="loading" />}
              <ControlledToggle
                variant="switch"
                value={listenLocationUser}
                onValueChange={handlerState}
                containerStyle={$centeredOneThirdCol}
              />
            </View>
            {/* <Button style={$button} tx="common.logOut" onPress={logout}/> */}
          </View>
          <View style={$buttonContainer}>
            <Button style={$button} tx="common.logOut" onPress={handlerLogout} />
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
  marginBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
}
const $titleEstado: TextStyle = {
  // marginBottom: spacing.xxl,
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
}

const $text: TextStyle = {
  // marginBottom: spacing.xxl,
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
  fontWeight: "200",
}
const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
  // backgroundColor: "red",

  flex: 1,
}
const $button: ViewStyle = {
  marginBottom: spacing.xs,
}
const $buttonContainer: ViewStyle = {
  marginBottom: spacing.md,
}
const $toggleContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.xxl,
}
const $centeredOneThirdCol: ViewStyle = {
  width: "33.33333%",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 6,
}

const $aspectRatioBox: ViewStyle & ImageStyle = {
  width: 60,
  height: 60,
  borderRadius: 30,
  borderWidth: 2,
  borderColor: colors.palette.secondary300,
  backgroundColor: colors.palette.accent100,
}
