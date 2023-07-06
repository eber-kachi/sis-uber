import React, { createContext, useState, useContext } from "react"
import { io, Socket } from "socket.io-client"
import { DEFAULT_API_CONFIG } from "../services/api/api"
import { useStores } from "app/models"
import { boolean } from "mobx-state-tree/dist/internal"
import { log } from "react-native-reanimated"

// export const socket = socketio.connect(SOCKET_URL)

// const SocketContext = createContext()
const SocketContext = createContext<{
  socket: Socket
  connect: () => void
  disconnect: () => void
  join: (status: boolean) => void
}>(null)

const SocketProvider = ({ children }) => {
  const {
    authenticationStore: { socioId },
  } = useStores()

  const [socket, setSocket] = useState(() => {
    console.log("conect with socket privider....")
    return io(DEFAULT_API_CONFIG.url, { query: {}, transports: ["websocket"] })
  })

  const connect = () => {
    // const socket = io(DEFAULT_API_CONFIG.url, { query: {} })
    // setSocket(socket.connect())
    console.log("conect with socket privider....")
  }

  const join = (status: boolean) => {
    // console.warn("socio join =>", { status, socioId })
    console.warn(`status=> ${status} socioId !== "" ${socioId !== ""} S=> ${socioId}`)

    if (status && socioId !== "") {
      socket.emit("socio_join", socioId)
      console.log("socio_join  socioId=> ", socioId)
    } else {
      socket.emit("socio_leave", socioId.length && socioId)
      console.log("socio_leave => socioId=> ", socioId)
    }
  }

  const disconnect = () => {
    if (socket !== null) {
      socket.disconnect()
    }
    setSocket(null)
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        join,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

const useSocket = () => useContext(SocketContext)

export { SocketProvider, useSocket }
