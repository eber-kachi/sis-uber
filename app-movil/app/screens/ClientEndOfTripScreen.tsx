/* eslint-disable camelcase */

import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, TextStyle, Image, View, ViewStyle, ImageStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Button } from "app/components"
import { spacing } from "../theme"
import ViajeService from "app/services/api/viaje.service"
import { Rating } from "react-native-ratings"
import { isRTL } from "expo-localization"

const welcomeFace = require("../../assets/images/splash-logo-all.png")

interface ClientEndOfTripScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ClientEndOfTrip">> {}

export const ClientEndOfTripScreen: FC<ClientEndOfTripScreenProps> = observer(
  function ClientEndOfTripScreen(_props) {
    // @ts-ignore
    const viaje_id = _props.route.params?.viaje_id

    const viajeService = new ViajeService()
    // @ts-ignore
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const { navigation } = _props

    const [rating, setRating] = useState<number>(1)

    const handleRatingChange = (value) => {
      setRating(value)
    }

    useEffect(() => {
      // obtener viaje para poder alificar
    }, [])

    const handleSubmit = async () => {
      if (rating === 0) {
        Alert.alert("Error", "Por favor, seleccione una calificación.")
        return
      }

      // Aquí puedes realizar la lógica de envío de calificación y comentarios al backend
      const response = await viajeService.setRating({ viaje_id, calificacion: rating })
      if (response.kind === "ok") {
        // Mostrar un mensaje de confirmación
        Alert.alert("¡Gracias!", "Calificación y comentarios enviados exitosamente.")

        // Reiniciar los valores de calificación y comentarios
        setRating(1)
        navigation.navigate("ClientSearchLocation")
      }
    }

    return (
      <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
        <Text style={$title}>Viaje finalizado</Text>
        <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />

        <View style={{ flex: 1, height: 80 }}>
          <Text style={styles.ratingLabel}>
            Estamos comprometidos a proporcionar un excelente servicio al cliente, por lo que puede
            estar seguro de que está en buenas manos.
          </Text>
        </View>

        <View style={$ratingContainer}>
          <Text style={styles.ratingLabel}>Calificación:</Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={30}
            // showRating
            minValue={1}
            onFinishRating={handleRatingChange}
          />
          {/* Componente de selección de calificación (por ejemplo, estrellas) */}
          {/* Implementa la lógica para actualizar el estado de la calificación */}
        </View>
        <View style={$buttonContainer}>
          <Button style={$button} text="Enviar" onPress={handleSubmit} />
        </View>
      </Screen>
    )
  },
)

const $container: ViewStyle = {
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.huge,
  paddingHorizontal: spacing.large,
}
const $button: ViewStyle = {
  marginBottom: spacing.extraSmall,
}
const $title: TextStyle = {
  marginBottom: spacing.small,
  fontSize: 24,
  fontWeight: "bold",
}
const $ratingContainer: ViewStyle = {
  paddingVertical: spacing.micro,
  paddingHorizontal: spacing.medium,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
}
const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
const $submitButton: TextStyle = {
  marginBottom: spacing.small,
}
const $buttonContainer: ViewStyle = {
  marginBottom: spacing.medium,
  marginTop: spacing.medium,
}
const styles = {
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 5,
    marginBottom: 8,
  },
  commentContainer: {
    marginBottom: 16,
  },
  commentLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  commentInput: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "blue",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
}
