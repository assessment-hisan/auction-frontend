import { tvSettingsApi } from "../../services/api/tvSettingsApi"

export const tvDisplaySlice = (set, get) => ({
  tv1Settings: {
    section: "Bidayay",
    pool: "Pool 1",
    autoAdvancePool: false,
    autoAdvanceDelaySeconds: 10,
    tv1BannerMessage: "",
  },
  tv2Settings: {
    displayMode: "All Teams",
    specificTeamId: null,
    topTeamsCount: 3,
    tv2BannerMessage: "",
  },

  // TV Settings actions
  fetchTvSettings: async () => {
    try {
      const [tv1Settings, tv2Settings] = await Promise.all([
        tvSettingsApi.getTvSettings("tv1Display"),
        tvSettingsApi.getTvSettings("tv2Display"),
      ])
      set({ tv1Settings, tv2Settings })
    } catch (error) {
      set({ error: error.message })
    }
  },

  updateTv1Settings: async (settings) => {
    try {
      const updatedSettings = await tvSettingsApi.updateTvSettings("tv1Display", settings)
      set({ tv1Settings: updatedSettings })
      return updatedSettings
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  updateTv2Settings: async (settings) => {
    try {
      const updatedSettings = await tvSettingsApi.updateTvSettings("tv2Display", settings)
      set({ tv2Settings: updatedSettings })
      return updatedSettings
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // WebSocket update handlers
  updateTv1SettingsFromSocket: (settings) => {
    set({ tv1Settings: settings })
  },

  updateTv2SettingsFromSocket: (settings) => {
    set({ tv2Settings: settings })
  },
})
