"use client"

import { useState } from "react"
import { useStore } from "../../store/useStore"
import { Monitor, Settings, MessageSquare, Clock, Users, Eye } from "lucide-react"

const TvControlPage = () => {
  const { tv1Settings, tv2Settings, teams, loading, updateTv1Settings } = useStore()
  const [activeTab, setActiveTab] = useState("tv1")

  const handleTv1SettingsUpdate = (field, value) => {
    
    updateTv1Settings({
      ...tv1Settings,
      [field]: value,
    })
  }

  const handleTv2SettingsUpdate = (field, value) => {
    updateTv2Settings({
      ...tv2Settings,
      [field]: value,
    })
  }

  const sections = ["bidayah", "ula", "thaniya", "thanawiyyah", "aliyah"]
  const pools = ["Pool 1", "Pool 2", "Pool 3", "Pool 4", "Pool 5", "Pool 6", "Pool 7", "Pool 8"]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">TV Screens Control</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Monitor className="h-4 w-4" />
          <span>Real-time Display Management</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("tv1")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tv1"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>TV1 - Uncalled Students</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("tv2")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tv2"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>TV2 - Called Students</span>
            </div>
          </button>
        </nav>
      </div>

      {/* TV1 Settings */}
      {activeTab === "tv1" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Monitor className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">TV1 Display Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Section</label>
                <select
                  value={tv1Settings?.section || "Bidayay"}
                  onChange={(e) => handleTv1SettingsUpdate("section", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pool Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Pool</label>
                <select
                  value={tv1Settings?.pool || "Pool 1"}
                  onChange={(e) => handleTv1SettingsUpdate("pool", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {pools.map((pool) => (
                    <option key={pool} value={pool}>
                      {pool}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Auto-Advance Settings */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Auto-Advance Pool</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tv1Settings?.autoAdvancePool || false}
                    onChange={(e) => handleTv1SettingsUpdate("autoAdvancePool", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {tv1Settings?.autoAdvancePool && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Advance Delay (seconds)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={tv1Settings?.autoAdvanceDelaySeconds || 10}
                    onChange={(e) =>
                      handleTv1SettingsUpdate("autoAdvanceDelaySeconds", Number.parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Delay before automatically advancing to the next pool when current pool is completed
                  </p>
                </div>
              )}
            </div>

            {/* Banner Message */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="h-4 w-4 inline mr-1" />
                TV1 Banner Message
              </label>
              <textarea
                value={tv1Settings?.tv1BannerMessage || ""}
                onChange={(e) => handleTv1SettingsUpdate("tv1BannerMessage", e.target.value)}
                placeholder="Enter a custom message to display on TV1..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* TV1 Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              TV1 Preview
            </h4>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-blue-600 mb-2">Live Auction Board</div>
              <div className="text-sm text-gray-600 mb-2">
                Section: {tv1Settings?.section || "Bidayay"} | Pool: {tv1Settings?.pool || "Pool 1"}
              </div>
              {tv1Settings?.tv1BannerMessage && (
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-2 text-sm">
                  {tv1Settings.tv1BannerMessage}
                </div>
              )}
              <div className="text-xs text-gray-500">
                Auto-advance: {tv1Settings?.autoAdvancePool ? "Enabled" : "Disabled"}
                {tv1Settings?.autoAdvancePool && ` (${tv1Settings?.autoAdvanceDelaySeconds || 10}s delay)`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TV2 Settings */}
      {activeTab === "tv2" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">TV2 Display Settings</h3>
            </div>

            {/* Display Mode */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Mode</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="displayMode"
                    value="All Teams"
                    checked={tv2Settings?.displayMode === "All Teams"}
                    onChange={(e) => handleTv2SettingsUpdate("displayMode", e.target.value)}
                    className="mr-2"
                  />
                  <span>All Teams</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="displayMode"
                    value="Specific Team"
                    checked={tv2Settings?.displayMode === "Specific Team"}
                    onChange={(e) => handleTv2SettingsUpdate("displayMode", e.target.value)}
                    className="mr-2"
                  />
                  <span>Specific Team</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="displayMode"
                    value="Top Teams"
                    checked={tv2Settings?.displayMode === "Top Teams"}
                    onChange={(e) => handleTv2SettingsUpdate("displayMode", e.target.value)}
                    className="mr-2"
                  />
                  <span>Top Teams</span>
                </label>
              </div>
            </div>

            {/* Specific Team Selection */}
            {tv2Settings?.displayMode === "Specific Team" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Team</label>
                <select
                  value={tv2Settings?.specificTeamId || ""}
                  onChange={(e) => handleTv2SettingsUpdate("specificTeamId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a team...</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Top Teams Count */}
            {tv2Settings?.displayMode === "Top Teams" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Top Teams to Show</label>
                <input
                  type="number"
                  min="1"
                  max={teams.length}
                  value={tv2Settings?.topTeamsCount || 3}
                  onChange={(e) => handleTv2SettingsUpdate("topTeamsCount", Number.parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Banner Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="h-4 w-4 inline mr-1" />
                TV2 Banner Message
              </label>
              <textarea
                value={tv2Settings?.tv2BannerMessage || ""}
                onChange={(e) => handleTv2SettingsUpdate("tv2BannerMessage", e.target.value)}
                placeholder="Enter a custom message to display on TV2..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* TV2 Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              TV2 Preview
            </h4>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-green-600 mb-2">Assigned Students by Team</div>
              <div className="text-sm text-gray-600 mb-2">
                Mode: {tv2Settings?.displayMode || "All Teams"}
                {tv2Settings?.displayMode === "Top Teams" && ` (Top ${tv2Settings?.topTeamsCount || 3})`}
                {tv2Settings?.displayMode === "Specific Team" &&
                  tv2Settings?.specificTeamId &&
                  ` (${teams.find((t) => t._id === tv2Settings.specificTeamId)?.name || "Unknown Team"})`}
              </div>
              {tv2Settings?.tv2BannerMessage && (
                <div className="bg-blue-100 text-blue-800 p-2 rounded mb-2 text-sm">{tv2Settings.tv2BannerMessage}</div>
              )}
              <div className="text-xs text-gray-500">Displaying teams with assigned students</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              window.open("?screen=tv1", "_blank")
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Monitor className="h-4 w-4" />
            <span>Open TV1</span>
          </button>
          <button
            onClick={() => {
              window.open("?screen=tv2", "_blank")
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>Open TV2</span>
          </button>
          <button
            onClick={() => {
              // Reset to default settings
              handleTv1SettingsUpdate("section", "Bidayay")
              handleTv1SettingsUpdate("pool", "Pool 1")
              handleTv1SettingsUpdate("autoAdvancePool", false)
              handleTv1SettingsUpdate("autoAdvanceDelaySeconds", 10)
              handleTv1SettingsUpdate("tv1BannerMessage", "")
              handleTv2SettingsUpdate("displayMode", "All Teams")
              handleTv2SettingsUpdate("topTeamsCount", 3)
              handleTv2SettingsUpdate("tv2BannerMessage", "")
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Reset Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TvControlPage
