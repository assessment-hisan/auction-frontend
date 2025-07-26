import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://auction-backend-cmco.onrender.com/api/", // ✅ Make sure this is exact

})

export default axiosInstance