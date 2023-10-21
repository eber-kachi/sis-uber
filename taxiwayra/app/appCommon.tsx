// import * as Permissions from 'expo-permissions';
import * as TaskManager from "expo-task-manager"
import * as Location from "expo-location"
import { useState, useEffect, useRef } from "react"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"

interface ILocation {
  lat: number | string
  lng: number | string
}

interface IGps {
  location?: ILocation
}

interface IGpsData {
  gps: IGps
}

const LOCATION_TASK_NAME = "background-location-task"

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }: any) => {
  console.log("TaskManager=> ", LOCATION_TASK_NAME)
  if (error) {
    console.log(error)
    return
  }
  if (locations.length > 0) {
    const location = locations[locations.length - 1]
    if (location.coords) {
      // guardar location
      // store.dispatch({
      //   type: 'UPDATE_GPS_LOCATION',
      //   payload: {
      //     lat: location.coords.latitude,
      //     lng: location.coords.longitude
      //   }
      // });
      console.log("LOCATION_TASK_NAME", location.coords)
    }
  }
})

const AppCommon = observer(function AppCommon({ children }: any) {
  const {
    authenticationStore: { role },
  } = useStores()
  // depurar
  // debugger;
  // socket.emit('message', 'Hola desde andorid ')
  const locationLoading = useRef(true)
  const watcher = useRef(undefined)
  const locationOn = useRef(false)
  const [gps, setGps] = useState<IGps>({ location: null })

  useEffect(() => {
    // llamar  al usuario authenticado y ver si es  conducto ro cliente y si  quiere que escuche su geolocalizacion
    console.log("ROLE=>>>> ", role)
    // StartBackgroundLocation().then(); // pueba
    // GetOneTimeLocation().then();
    StartForegroundGeolocation().then()
    // StopBackgroundLocation();
  }, [])

  // manda cuando la locatizacion  cambia
  useEffect(() => {
    // StartBackgroundLocation().then();
    if (gps.location && gps.location.lat && gps.location.lng) {
      console.log("Cambia location =>", gps.location.lat, gps.location.lng)

      locationLoading.current = false

      // todo  buscar si el usuario esta autheticado y mandar

      // if (auth.profile && auth.profile.usertype && auth.profile.usertype == 'driver' ) {
      //   api.saveUserLocation({
      //     lat: gps.location.lat,
      //     lng: gps.location.lng
      //   });
      // }
      /* if (activeBooking && auth.profile && auth.profile.usertype && auth.profile.usertype == 'driver') {
         if (lastLocation && (activeBooking.status == 'ACCEPTED' || activeBooking.status == 'STARTED')) {
           const diff = api.GetDistance(lastLocation.lat, lastLocation.lng, gps.location.lat, gps.location.lng);
           if (diff > 0.010 && activeBooking.driverDeviceId === deviceId) {
             api.saveTracking(activeBooking.id, {
               at: new Date().getTime(),
               status: activeBooking.status,
               lat: gps.location.lat,
               lng: gps.location.lng
             });
           }
         }
         if(!lastLocation && activeBooking.status == 'ACCEPTED'){
           api.saveTracking(activeBooking.id, {
             at: new Date().getTime(),
             status: activeBooking.status,
             lat: gps.location.lat,
             lng: gps.location.lng
           });
         }
         if (activeBooking.status == 'ACCEPTED') {
           const diff = api.GetDistance(activeBooking.pickup.lat, activeBooking.pickup.lng, gps.location.lat, gps.location.lng);
           if (diff < 0.02) {
             const bookingData = activeBooking;
             bookingData.status = 'ARRIVED';
             store.dispatch(api.updateBooking(bookingData));
             api.saveTracking(activeBooking.id, {
               at: new Date().getTime(),
               status: 'ARRIVED',
               lat: gps.location.lat,
               lng: gps.location.lng
             });
           }
         }
       } */
    }
  }, [gps])

  const GetOneTimeLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status === "granted") {
      try {
        const tempWatcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
          },
          (location) => {
            console.log(
              "GetOneTimeLocation =>",
              location.coords.latitude,
              location.coords.longitude,
            )
            setGps({
              location: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              },
            })
            // store.dispatch({
            //   type: 'UPDATE_GPS_LOCATION',
            //   payload: {
            //     lat: location.coords.latitude,
            //     lng: location.coords.longitude
            //   }
            // });
            tempWatcher.remove()
          },
        )
      } catch (error) {
        // store.dispatch({
        //   type: 'UPDATE_GPS_LOCATION',
        //   payload: {
        //     error:true
        //   }
        // });
        locationLoading.current = false
      }
    } else {
      alert("The request was denied")

      // store.dispatch({
      //   type: 'UPDATE_GPS_LOCATION',
      //   payload: {
      //     error:true
      //   }
      // });
      locationLoading.current = false
    }
  }

  const StartBackgroundLocation = async () => {
    const permResp = await Location.requestForegroundPermissionsAsync()
    console.log("Permisos", permResp)
    const tempWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
      },
      (location) => {
        setGps({
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        })
        // store.dispatch({
        //   type: 'UPDATE_GPS_LOCATION',
        //   payload: {
        //     lat: location.coords.latitude,
        //     lng: location.coords.longitude
        //   }
        // });
        setGps({
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        })

        console.log("Location=>>>>", location)

        tempWatcher.remove()
      },
    )

    if (permResp.status === "granted") {
      try {
        const { status } = await Location.requestBackgroundPermissionsAsync()
        if (status === "granted") {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.BestForNavigation,
            showsBackgroundLocationIndicator: true,
            activityType: Location.ActivityType.AutomotiveNavigation,
            foregroundService: {
              notificationTitle: "Location Update",
              notificationBody: "Background location is running...",
              notificationColor: "#1E81D3",
            },
          })
        } else {
          if (__DEV__) {
            StartForegroundGeolocation()
          } else {
            // store.dispatch({
            //   type: 'UPDATE_GPS_LOCATION',
            //   payload: {
            //     error:true
            //   }
            // });
            locationLoading.current = false
          }
        }
      } catch (error) {
        if (__DEV__) {
          StartForegroundGeolocation()
        } else {
          // store.dispatch({
          //   type: 'UPDATE_GPS_LOCATION',
          //   payload: {
          //     error:true
          //   }
          // });
          locationLoading.current = false
        }
      }
    } else {
      // store.dispatch({
      //   type: 'UPDATE_GPS_LOCATION',
      //   payload: {
      //     error:true
      //   }
      // });
      locationLoading.current = false
    }
  }
  // Iniciarando geolocalización en primer plano
  const StartForegroundGeolocation = async () => {
    watcher.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        // activityType: Location.ActivityType.AutomotiveNavigation,
      },
      (location) => {
        // mandar la actualizacion

        // setGps({
        //   location: {
        //     lat: location.coords.latitude,
        //     lng: location.coords.longitude,
        //   },
        // })
        setGps((value) => {
          return {
            location: {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            },
          }
        })
        console.log(
          "StartForegroundGeolocation=>",
          location.coords.latitude,
          location.coords.longitude,
        )
        // store.dispatch({
        //   type: 'UPDATE_GPS_LOCATION',
        //   payload: {
        //     lat: location.coords.latitude,
        //     lng: location.coords.longitude
        //   }
        // });
      },
    )
  }
  // Detener ubicación de segundo plano
  const StopBackgroundLocation = async () => {
    locationOn.current = false
    try {
      TaskManager.getRegisteredTasksAsync().then((res) => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].taskName === LOCATION_TASK_NAME) {
              Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
              break
            }
          }
        } else {
          if (watcher.current) {
            watcher.current.remove()
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return children
})

export default AppCommon
