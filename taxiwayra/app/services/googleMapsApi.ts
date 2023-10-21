/* eslint-disable camelcase */
import Config from "app/config"

export interface Location {
  lat: number
  lng: number
}
export interface IResponseGeocoord {
  coords: Location
}
export interface IResponseError {
  error: string
}

export const GOOGLE_MAP_SERVER_KEY = Config.GOOGLE_MAPS_KEY

export async function getcoords(place_id: string): Promise<IResponseGeocoord | IResponseError> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${GOOGLE_MAP_SERVER_KEY}`
  const res = await fetch(url)
  const json = await res.json()

  if (json.results && json.results.length > 0 && json.results[0].geometry) {
    return { coords: json.results[0].geometry.location }
  } else {
    return { error: "Geocode API : Place to Coordinate Error" }
  }
}
