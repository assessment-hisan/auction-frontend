import axiosInstance from "./axiosInstance"

export const tvSettingsApi = {
  getTvSettings: (screenId) => axiosInstance.get(`/tv-settings/${screenId}`),
  updateTvSettings: (screenId, settings) => axiosInstance.put(`/tv-settings/${screenId}`, settings),
}
