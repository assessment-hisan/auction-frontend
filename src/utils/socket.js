// src/utils/socket.js
import { io } from "socket.io-client"
const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000", {
    path: "/socket.io",
    transports: ["websocket", "polling"],
}) // or your backend URL
export default socket
