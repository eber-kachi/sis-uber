import * as Location from "expo-location"
import { Alert } from "react-native"

export const getCurrentLocatiton = async (): Promise<{
  status: boolean
  location: {
    latitude: Float32Array
    longitude: Float32Array
    latitudeDelta: number
    longitudeDelta: number
  }
}> => {
  const resposnse = { status: false, location: null }
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status === "denied") {
    Alert.alert("Debes dar permisos para la localización.")
    return resposnse
  }

  // if (status === "granted") {
  const position = await Location.getCurrentPositionAsync()
  const location = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    latitudeDelta: 0.0123,
    longitudeDelta: 0.0123,
  }
  resposnse.status = true
  resposnse.location = location
  return resposnse
  // }
}
