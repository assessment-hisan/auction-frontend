// src/utils/socket.js
import { io } from "socket.io-client"
const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000") // or your backend URL
export default socket
