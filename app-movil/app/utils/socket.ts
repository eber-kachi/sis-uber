import { io } from "socket.io-client"
import { DEFAULT_API_CONFIG } from "../services/api"

const socket = io(DEFAULT_API_CONFIG.url, { query: {} })

socket.on("connect", () => {
  console.log("Connected to Socket.IO Utiliti")
})

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO")
})

export default socket
