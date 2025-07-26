import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/", // ✅ Make sure this is exact

})

export default axiosInstance