import * as Location from "expo-location"
import { Alert } from "react-native"
interface ICurrentLocation {
  status: boolean
  location: {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  }
}

export const getCurrentLocatiton = async (): Promise<ICurrentLocation> => {
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
    latitudeDelta: new Float32Array(0.0123),
    longitudeDelta: new Float32Array(0.0123),
  }
  resposnse.status = true
  resposnse.location = location
  return resposnse
  // }
}
