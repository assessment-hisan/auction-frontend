import { teamApi } from "../../services/api/teamApi"

export const teamSlice = (set, get) => ({
  teams: [],

  // Team actions
  fetchTeams: async () => {
    try {
      const response = await teamApi.getAllTeams()
      const teams = response.data
      set({ teams }) // Already populated with students
    } catch (error) {
      set({ error: error.message })
    }
  },

  createTeam: async (teamData) => {
    try {
      const response = await teamApi.createTeam(teamData)
      const newTeam = response.data // Includes populated `leader` and `subLeaders`
      set((state) => ({ teams: [...state.teams, newTeam] }))
      return newTeam
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  deleteTeam: async (teamId) => {
    try {
      await teamApi.deleteTeam(teamId)
      set((state) => ({
        teams: state.teams.filter((t) => t._id !== teamId),
      }))
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Selectors
  getTeamById: (teamId) => {
    return get().teams.find((t) => t._id === teamId)
  },

  getTeamsWithStudentCounts: () => {
    const students = get().students || []
    const teams = get().teams

    if (!Array.isArray(teams)) return []

    return teams.map((team) => ({
      ...team,
      studentCount: students.filter((s) => s.teamId === team._id).length,
      students: students.filter((s) => s.teamId === team._id),
    }))
  },

  getTopTeams: (count) => {
    const teamsWithCounts = get().getTeamsWithStudentCounts()
    return teamsWithCounts
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, count)
  },

  // WebSocket update handlers
  updateTeamsFromSocket: (teams) => {
    set({ teams })
  },

  updateTeamFromSocket: (updatedTeam) => {
    set((state) => ({
      teams: state.teams.map((t) => (t._id === updatedTeam._id ? updatedTeam : t)),
    }))
  },
})
