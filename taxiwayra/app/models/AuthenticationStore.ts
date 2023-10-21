import { Instance, SnapshotOut, types } from "mobx-state-tree"
import UserService from "../services/api/user.service"
import { withSetPropAction } from "./helpers/withSetPropAction"
const userservice = new UserService()

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    authRole: "",
    listenLocationUser: false,
    socioId: "",
    clientId: "",
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
    get email() {
      return store.authEmail
    },
    get role() {
      return store.authRole
    },
    get listenLocation() {
      return store.listenLocationUser
    },
    get socio_id() {
      return store.socioId
    },
    get client_id() {
      return store.clientId
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      console.log("Emaial Store=>", value)
      store.authEmail = value.replace(/ /g, "")
    },
    logout() {
      store.authToken = undefined
      store.authRole = undefined
      store.authEmail = undefined
      store.clientId = undefined
      store.socioId = undefined
    },
    setRole(value: string) {
      store.authRole = value
    },
    setSocioId(value: string) {
      console.log("cambiando SocioId=>", value)

      store.socioId = value
    },
    setClientId(value: string) {
      store.clientId = value
    },
    setListenLocation(value: boolean) {
      store.listenLocationUser = value
    },
  }))
  .actions((store) => ({
    async fetchUserByEmail(): Promise<void> {
      try {
        const response = await userservice.getUserByEmail(store.authEmail)

        if (response.kind === "ok") {
          console.log("AuthenticationStoreModel => ", response.data)
          //= == "DRIVER"
          if (response?.data?.socio) {
            // store.setProp("socioId", response.data.socio.id)
            // store.setSocioId(response.data.socio.id)
            store.setProp("socioId", response?.data?.socio?.id)
            // console.log("entro socioId=>", store.socioId)
            // store.socioId = yield  response.data.socio.id
            // return { socio_id: response.data.socio.id, cliente_id: null }
          } else {
            store.setProp("clientId", response?.data?.cliente?.id)
            // store.setClientId(response.data.cliente.id)
            // return { socio_id: null, cliente_id: response?.data?.cliente?.id }
          }
        }
      } catch (error) {
        console.tron.error(`Error fetching user: ${JSON.stringify(error)}`, [])
      }
      // const response = await userservice.getUserByEmail(store.authEmail)
      // if (response.kind === "ok") {
      //   console.log("AuthenticationStoreModel => ", response.data)
      //   //= == "DRIVER"
      //   if (response?.data?.socio) {
      //     // store.setProp("socioId", response.data.socio.id)
      //     // store.setSocioId(response.data.socio.id)
      //     store.setProp("socioId", response?.data?.socio?.id)
      //     console.log("entro socioId=>", store.socioId)
      //     // store.socioId = yield  response.data.socio.id
      //     return { socio_id: response.data.socio.id, cliente_id: null }
      //   } else {
      //     store.setProp("clientId", response?.data?.cliente?.id)
      //     // store.setClientId(response.data.cliente.id)
      //     return { socio_id: null, cliente_id: response?.data?.cliente?.id }
      //   }
      // } else {
      //   console.tron.error(`Error fetching user: ${JSON.stringify(response)}`, [])
      // }
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
