import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ClientTabScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useStores } from "../models"
import { spacing } from "../theme"
import { useNavigation } from "@react-navigation/native"


interface ClientHomeScreenProps extends NativeStackScreenProps<ClientTabScreenProps<"ClientHome">> {}

export const ClientHomeScreen: FC<ClientHomeScreenProps> = observer(function ClientHomeScreen() {
  // Pull in one of our MST stores
  const {
    authenticationStore: { email, authToken, role},
  } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text  >Email: {email}</Text>
      <Text  >Role: {role}</Text>
      <Text  >Token: {authToken}</Text>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
const $container: ViewStyle = {
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.huge,
  paddingHorizontal: spacing.large,
}
