import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ClientTabScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { useStores } from "../models"
import { useNavigation } from "@react-navigation/native"
import { spacing } from "../theme"

interface ClientSettingsScreenProps extends NativeStackScreenProps<ClientTabScreenProps<"ClientSettings">> {}

export const ClientSettingsScreen: FC<ClientSettingsScreenProps> = observer(function ClientSettingsScreen() {
  // Pull in one of our MST stores
  const {
    authenticationStore: { logout },
  } = useStores()
  // Pull in navigation via hook
  const navigation = useNavigation()
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text text="clientSettings" />

      <View style={$buttonContainer}>
        <Button style={$button} tx="common.logOut" onPress={logout} />
      </View>
    </Screen>
  )
})

const $container: ViewStyle = {
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.huge,
  paddingHorizontal: spacing.large,
}
const $button: ViewStyle = {
  marginBottom: spacing.extraSmall,
}
const $buttonContainer: ViewStyle = {
  marginBottom: spacing.medium,
}
