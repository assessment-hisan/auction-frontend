

// src/store/useStore.js
import { create } from "zustand"
import { studentSlice } from "./slices/studentSlice"
import { teamSlice } from "./slices/teamSlice"
import { tvDisplaySlice } from "./slices/tvDisplaySlice"
import socket from "../utils/socket"

export const useStore = create((set, get) => ({
  // Global state
  loading: false,
  error: null,
  userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

  // Global actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Initial data fetch
  fetchInitialData: async () => {
    set({ loading: true, error: null })
    try {
      await Promise.all([
        get().fetchStudents(),
        get().fetchTeams(),
        get().fetchTvSettings(),
      ])
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  // ✅ Socket Listener Setup - Make sure this is properly defined
  initializeSocketListeners: () => {
    // Remove any existing listeners first to prevent duplicates
    socket.off("students_updated")
    socket.off("student_assigned")
    socket.off("student_unassigned")
    socket.off("teams_updated")
    socket.off("tv2_settings_updated")
    socket.off("tv1_settings_updated")

    // Add new listeners
    socket.on("students_updated", (students) => {
      get().updateStudentsFromSocket(students)
    })

    socket.on("student_assigned", (student) => {
      get().updateStudentFromSocket(student)
    })

    socket.on("student_unassigned", (student) => {
      get().updateStudentFromSocket(student)
    })

    socket.on("teams_updated", (teams) => {
      get().updateTeamsFromSocket(teams)
    })

    socket.on("tv2_settings_updated", (settings) => {
      get().updateTv2SettingsFromSocket(settings)
    })

    socket.on("tv1_settings_updated", (settings) => {
      get().updateTv1SettingsFromSocket(settings)
    })

    console.log("✅ Socket.IO listeners initialized.")
  },

  // Combine all slices
  ...studentSlice(set, get),
  ...teamSlice(set, get),
  ...tvDisplaySlice(set, get),
}))