import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { ImageStyle, TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { AuthService } from "../services/api"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>()
  const { navigation } = _props

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: {
      fetchUserByEmail,
      authEmail,
      setAuthEmail,
      setAuthToken,
      validationError,
      setRole,
      setListenLocation,
    },
  } = useStores()
  const service = new AuthService()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("admin@gmail.com")
    setAuthPassword("123456")
  }, [])

  const error = isSubmitted ? validationError : ""

  function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)
    if (validationError) return
    console.log("login click...")

    // Make a request to your server to get an authentication token.
    service
      .login({ email: authEmail, password: authPassword })
      .then(async (res: any) => {
        console.log("todo bien =>>>>", res)
        // If successful, reset the fields and set the token.
        setIsSubmitted(false)
        // // We'll mock this with a fake token.
        if (res.kind === "ok") {
          if (res.data.user && res.data.token) {
            // setIsSubmitted(false)
            setAuthPassword("")
            // console.log("todo bien =>>>>", res.data.user)
            setAuthEmail(res.data.user.email)
            setRole(res.data.user.role)
            setAuthToken(res.data.token.accessToken)
            await fetchUserByEmail()
          }
          if (res.data.user.role === "DRIVER") {
            // // setListenLocation()
            // // eslint-disable-next-line camelcase
            // const { socio_id } = await fetchUserByEmail()
            // setSocioId(socio_id)
          }
        }
      })
      .catch((error) => {
        console.log("aqui error ", error)
      })
      .finally(() => {
        setIsSubmitted(false)
      })
  }

  function handlerClikToRegister() {
    navigation.navigate("Register")
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

  useEffect(() => {
    return () => {
      setAuthPassword("")
      // setAuthEmail("")
    }
  }, [])

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      {/* <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails}/> */}
      <Text tx="loginScreen.enterDetails2" preset="subheading" style={$enterDetails} />
      {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
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
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={login}
        disabled={isSubmitted}
        LeftAccessory={(props) =>
          isSubmitted && <Icon containerStyle={props.style} style={$iconStyle} icon="loading" />
        }
      />
      <Button
        testID="login-register"
        tx="loginScreen.tapToRegister"
        style={$tapButtonRegister}
        preset="reversed"
        onPress={handlerClikToRegister}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $signIn: TextStyle = {
  marginBottom: spacing.small,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.large,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
}
const $tapButtonRegister: ViewStyle = {
  marginTop: spacing.extraSmall,
  backgroundColor: colors.palette.accent500,
}

const $iconStyle: ImageStyle = { width: 30, height: 30 }
// @demo remove-file
