/* eslint-disable camelcase */
import React, { createContext, useState, useContext } from "react"
import { io, Socket } from "socket.io-client"
import { DEFAULT_API_CONFIG } from "../services/api/api"

// export const socket = socketio.connect(SOCKET_URL)

// const SocketContext = createContext()
const SocketContext = createContext<{
  socket: Socket
  connect: () => void
  disconnect: () => void
  join: (status: boolean, socio_id: string) => void
}>(null)

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(() => {
    if (!socket) {
      console.log("conect with socket privider....")
      return io(DEFAULT_API_CONFIG.url, { query: {}, transports: ["websocket"] })
    }
  })

  const connect = () => {
    // const socket = io(DEFAULT_API_CONFIG.url, { query: {} })
    // setSocket(socket.connect())
    // console.log("conect with socket privider....")
  }

  const join = (status: boolean, socio_id: string) => {
    // console.warn("socio join =>", { status, socioId })
    // console.warn(`status=> ${status} socioId !=="" ${socio_id !== ""} S=> ${socio_id}`)

    if (status && socio_id !== "") {
      socket.emit("socio_join", socio_id)
      console.log("socio_join  socioId=> ", socio_id)
    } else {
      socket.emit("socio_leave", socio_id)
      console.log("socio_leave => socioId=> ", socio_id)
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
