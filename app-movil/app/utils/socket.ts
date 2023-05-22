import { io } from "socket.io-client";

const socket = io("http://192.168.1.7:3001");

socket.on("connect", () => {
  console.log("Connected to Socket.IO");
});

socket.on("message", (message: string) => {
  console.log("Received message back: " + message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO");
});

export default socket;
