import React, { FC, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, Image, ImageStyle, TextInput, TextStyle, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Header, Icon, Screen, TextField, TextFieldAccessoryProps } from "app/components"
import { colors, spacing } from "../theme"
import { useStores } from "../models"
import { AuthService } from "../services/api"

const welcomeLogo = require("../../assets/images/logo-car.png")

interface RegisterScreenProps extends AppStackScreenProps<"Register"> {}

export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen(_props) {
  const authPasswordInput = useRef<TextInput>()

  const { navigation } = _props

  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)

  const authService = new AuthService()

  function handlerClickRegister() {
    // navigation.navigate()
    authService
      .registerClient({
        nombres: name,
        apellidos: lastName,
        email,
        password: authPassword,
        role: "CLIENT",
      })
      .then((res: any) => {
        console.log("Register Screen", res)
        if (res.kind === "ok") {
          Alert.alert(res.kind, res.message, [
            {
              text: "Aceptar",
              onPress: () => {
                navigation.navigate("Login")
              },
            },
          ])
        }
      })
      .catch((error) => {
        console.log("aqui error ", error)
      })
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header
        title="Registrar"
        titleMode="center"
        leftIcon="back"
        safeAreaEdges={[]}
        onLeftPress={() => {
          navigation.goBack()
        }}
      />
      {/* <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn}/> */}
      <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
      <TextField
        value={name}
        onChangeText={(val) => setName(val)}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="registerScreen.nameFieldLabel"
        placeholderTx="registerScreen.nameFieldPlaceholder"
      />
      <TextField
        value={lastName}
        onChangeText={(val) => setLastName(val)}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="registerScreen.lastNameFieldLabel"
        placeholderTx="registerScreen.lastNameFieldPlaceholder"
      />

      <TextField
        value={email}
        onChangeText={(val) => setEmail(val)}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="registerScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={handlerClickRegister}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-register"
        tx="registerScreen.tapToRegister"
        style={$tapButtonRegister}
        preset="reversed"
        onPress={handlerClickRegister}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxxs,
  paddingHorizontal: spacing.md,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $welcomeLogo: ImageStyle = {
  height: 120,
  width: "100%",
}

const $customLeftAction: ViewStyle = {
  backgroundColor: colors.error,
  flexGrow: 0,
  flexBasis: 100,
  height: "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  overflow: "hidden",
}
const $tapButtonRegister: ViewStyle = {
  marginTop: spacing.xs,
  backgroundColor: colors.palette.accent500,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}
