import React, { createContext, useState, useContext } from "react"
import { io, Socket } from "socket.io-client"
import { DEFAULT_API_CONFIG } from "../services/api/api"

// export const socket = socketio.connect(SOCKET_URL)

// const SocketContext = createContext()
const SocketContext = createContext<{
  socket: Socket
  connect: () => void
  disconnect: () => void
}>(null)

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(() => {
    console.log("conect with socket privider....")
    return io(DEFAULT_API_CONFIG.url, { query: {} })
  })

  const connect = () => {
    // const socket = io(DEFAULT_API_CONFIG.url, { query: {} })
    // setSocket(socket.connect())
    console.log("conect with socket privider....")
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
