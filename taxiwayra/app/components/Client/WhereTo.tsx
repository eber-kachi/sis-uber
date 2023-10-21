import * as React from "react"
import { Platform, StyleSheet, Text, View, Dimensions, ViewStyle } from "react-native"
import { colors, spacing } from "../../theme"
// import { colors, device, fonts } from '../constants';

// icons
// import SvgTruck from './icons/Svg.Truck';
import { Button, Screen, TextField } from "app/components"
import { useState } from "react"

const isIos = Platform.OS === "ios"

const WhereTo = () => {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.containerBanner}>
        <Text style={styles.bannerText}>Selecione ubicacion</Text>
        <Text style={styles.bannerMuted}>3 days</Text>
      </View>
      {/* main */}
      <View style={styles.containerInput}>
        {/* <View style={styles.containerSquare}>
        <View style={styles.square} />
      </View> */}
        <View style={{ flex: 1 }}>
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
          {/* <Text style={styles.text}>Donde quieres ir ?</Text> */}
          {/* <Text style={styles.text}>Poner Ubicacion </Text> */}
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
          <Button
            testID="login-register"
            tx="registerScreen.tapToRegister"
            style={$tapButtonRegister}
            preset="reversed"
            onPress={() => {
              console.log(Dimensions.get("window").height)
            }}
          />
        </View>
        {/* <View style={styles.containerIcon}>
        <SvgTruck />
      </View> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bannerMuted: {
    color: colors.palette.accent400,
    fontFamily: "sans-serif-condensed",
    fontSize: 12,
  },
  bannerText: {
    color: colors.palette.primary100,
    // fontFamily: fonts.ubermd, //"sans-serif-condensed",
    fontSize: 12,
  },
  container: {
    alignSelf: "center",
    height: Dimensions.get("window").height,
    position: "absolute",
    shadowColor: colors.palette.accent400,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    top: false ? 144 : 20,
    width: Dimensions.get("window").width,
    // width: Platform..width - 40
  },
  containerBanner: {
    backgroundColor: colors.palette.primary400,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  containerIcon: {
    alignItems: "center",
    borderLeftColor: colors.palette.accent200,
    borderLeftWidth: 1,
    flex: 2,
  },
  containerInput: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexDirection: "row",
    height: 270,
    padding: spacing.sm,
  },
  containerSquare: {
    alignItems: "center",
    flex: 2,
  },
  square: {
    backgroundColor: colors.background,
    height: 8,
    width: 8,
  },
  text: {
    color: colors.text,
    width: 800,
    flex: 8,
    // fontFamily: font,
    fontSize: 20,
    paddingTop: spacing.xxxs,
    // paddingEnd: spacing.xxxs
  },
})

const $tapButtonRegister: ViewStyle = {
  marginTop: spacing.xs,
  backgroundColor: colors.palette.accent500,
}
const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

export default WhereTo
