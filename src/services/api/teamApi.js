import axiosInstance from "./axiosInstance"

export const teamApi = {
  getAllTeams: () => axiosInstance.get("/teams"),                // Returns populated teams
  createTeam: (teamData) => axiosInstance.post("/teams", teamData),
  deleteTeam: (teamId) => axiosInstance.delete(`/teams/${teamId}`),
}