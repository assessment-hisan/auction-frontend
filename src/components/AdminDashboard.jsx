

import { useState } from "react"
import { Users, UserCheck, Monitor, Settings, Printer } from "lucide-react"
import StudentManagementPage from "./admin/StudentManagementPage"
import TeamManagementPage from "./admin/TeamManagementPage"
import TvControlPage from "./admin/TvControlPage"
import Print from "./admin/Print"
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("students")

  const tabs = [
    { id: "students", label: "Student Management", icon: Users, component: StudentManagementPage },
    { id: "teams", label: "Team Management", icon: UserCheck, component: TeamManagementPage },
    { id: "tv-control", label: "TV Screens Control", icon: Monitor, component: TvControlPage },
    { id: "print", label: "print", icon: Printer, component: Print },
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Student Auction Admin</h1>
            </div>
          </div>

          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{ActiveComponent && <ActiveComponent />}</div>
    </div>
  )
}

export default AdminDashboard
