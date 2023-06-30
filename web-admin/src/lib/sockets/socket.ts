import io from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string)

socket.on('connect', () => {
  console.log('Connected to Socket.IO webs')
})

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO')
})

export default socket
