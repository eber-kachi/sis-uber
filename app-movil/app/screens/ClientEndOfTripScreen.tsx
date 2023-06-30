/* eslint-disable camelcase */

import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { spacing } from "../theme"
import ViajeService from "app/services/api/viaje.service"

interface ClientEndOfTripScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ClientEndOfTrip">> {}

export const ClientEndOfTripScreen: FC<ClientEndOfTripScreenProps> = observer(
  function ClientEndOfTripScreen(_props) {
    // @ts-ignore
    const { viaje_id } = _props.route.params

    const viajeService = new ViajeService()
    // @ts-ignore
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [viaje, setViaje] = useState(null)

    const handleRatingChange = (value) => {
      setRating(value)
    }

    const handleCommentChange = (value) => {
      setComment(value)
    }
    const getviaje = async () => {
      const viajeres = await viajeService.getById(viaje_id)
      if (viajeres.kind === "ok") {
        setViaje(viajeres.data)
      }
    }

    useEffect(() => {
      // obtener viaje para poder alificar
      getviaje()
    }, [])

    const handleSubmit = () => {
      if (rating === 0) {
        Alert.alert("Error", "Por favor, seleccione una calificación.")
        return
      }

      // Aquí puedes realizar la lógica de envío de calificación y comentarios al backend

      // Mostrar un mensaje de confirmación
      Alert.alert("¡Gracias!", "Calificación y comentarios enviados exitosamente.")

      // Reiniciar los valores de calificación y comentarios
      setRating(0)
      setComment("")
    }

    return (
      <Screen style={$root} preset="scroll">
        <Text style={$title}>Finalización de Viaje</Text>
        <View style={{ flex: 1, height: 80 }}>
          <Text style={styles.ratingLabel}>detalles del viaje:</Text>
        </View>

        <View style={$ratingContainer}>
          <Text style={styles.ratingLabel}>Calificación:</Text>
          {/* Componente de selección de calificación (por ejemplo, estrellas) */}
          {/* Implementa la lógica para actualizar el estado de la calificación */}
        </View>
        <View style={styles.commentContainer}>
          <Text style={styles.commentLabel}>Comentarios:</Text>
          {/* <TextInput */}
          {/*  style={styles.commentInput} */}
          {/*  multiline */}
          {/*  placeholder="Escribe tus comentarios aquí" */}
          {/*  value={comment} */}
          {/*  onChangeText={handleCommentChange} */}
          {/* /> */}
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={$submitButton}>Enviar</Text>
        </TouchableOpacity>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $title: TextStyle = {
  marginBottom: spacing.small,
  fontSize: 24,
  fontWeight: "bold",
}
const $ratingContainer: ViewStyle = {
  paddingVertical: spacing.micro,
  paddingHorizontal: spacing.medium,
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 16,
}

const $submitButton: TextStyle = {
  marginBottom: spacing.small,
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
    fontSize: 16,
    marginRight: 8,
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
