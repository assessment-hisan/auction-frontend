import { useEffect } from "react"
import { useStore } from "./store/useStore" // ✅ Use Zustand version
import AdminDashboard from "./components/AdminDashboard"
import PublicUncalledScreen from "./components/PublicUncalledScreen"
import PublicCalledScreen from "./components/PublicCalledScreen"
import LoadingSpinner from "./components/ui/LoadingSpinner"
import ErrorMessage from "./components/ui/ErrorMessage"

// Main App component that uses the Zustand store
const App = () => {
  const fetchInitialData = useStore((state) => state.fetchInitialData)
  const loading = useStore((state) => state.loading)
  const error = useStore((state) => state.error)

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  const urlParams = new URLSearchParams(window.location.search)
  const screen = urlParams.get("screen") || "admin"

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  switch (screen) {
    case "tv1":
      return <PublicUncalledScreen />
    case "tv2":
      return <PublicCalledScreen />
    case "admin":
    default:
      return <AdminDashboard />
  }
}

export default App
