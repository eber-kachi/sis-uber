import { ApiResponse } from "apisauce"
import { ToastAndroid } from "react-native"

export type GeneralApiProblem =
  /**
   * Times up.
   */
  | { kind: "timeout"; temporary: true }
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: "cannot-connect"; temporary: true }
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | { kind: "server" }
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | { kind: "unauthorized" }
  /**
   * We don't have access to perform that request. This is 403.
   */
  | { kind: "forbidden" }
  /**
   * Unable to find that resource.  This is a 404.
   */
  | { kind: "not-found" }
  /**
   * All other 4xx series errors.
   */
  | { kind: "rejected" }
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: "unknown"; temporary: true }
  /**
   * The data we received is not in the expected format.
   */
  | { kind: "bad-data" }
/**
 * indica que el servidor no puede o no quiere procesar
 * la solicitud debido a algo que se percibe como un error del cliente
 */
// | { kind: "bad-request" }

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: ApiResponse<any>): GeneralApiProblem | null {
  switch (response.problem) {
    case "CONNECTION_ERROR":
      ToastAndroid.show("ERROR DE CONEXIÓN", ToastAndroid.SHORT)
      return { kind: "cannot-connect", temporary: true }
    case "NETWORK_ERROR":
      ToastAndroid.show("ERROR DE RED", ToastAndroid.SHORT)
      return { kind: "cannot-connect", temporary: true }
    case "TIMEOUT_ERROR":
      ToastAndroid.show("ERROR DE TIEMPO DE ESPERA", ToastAndroid.SHORT)
      return { kind: "timeout", temporary: true }
    case "SERVER_ERROR":
      return { kind: "server" }
    case "UNKNOWN_ERROR":
      return { kind: "unknown", temporary: true }
    case "CLIENT_ERROR":
      switch (response?.status) {
        case 400: // nest no proceso la solisitud
          return { kind: "bad-data" }
        case 401:
          return { kind: "unauthorized" }
        case 403:
          ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT)
          return { kind: "forbidden" }
        case 404:
          ToastAndroid.show(response?.data?.message || "Recurso no encotrado", ToastAndroid.SHORT)
          return { kind: "not-found" }
        default:
          return { kind: "rejected" }
      }
    case "CANCEL_ERROR":
      return null
  }
}
