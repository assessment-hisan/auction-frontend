import { studentApi } from "../../services/api/studentApi"

export const studentSlice = (set, get) => ({
  students: [],

  // Student actions
  fetchStudents: async () => {
    try {
      const response = await studentApi.getAllStudents()
const students = response.data
console.log(students)
set({ students })
    } catch (error) {
      set({ error: error.message })
    }
  },

  addStudent: async (studentData) => {
    try {
      const response = await studentApi.createStudent(studentData)
const newStudent = response.data
set((state) => ({ students: [...state.students, newStudent] }))
      return newStudent
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  importStudents: async (studentsData) => {
    try {
      const importedStudents = await studentApi.importStudents(studentsData)
      set((state) => ({ students: [...state.students, ...importedStudents] }))
      return importedStudents
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  deleteStudent: async (studentId) => {
    try {
      await studentApi.deleteStudent(studentId)
      set((state) => ({
        students: state.students.filter((s) => s._id !== studentId),
      }))
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  assignStudentToTeam: async (studentId, teamId) => {
    try {
      const updatedStudent = await studentApi.assignToTeam(studentId, teamId)
      set((state) => ({
        students: state.students.map((s) => (s._id === studentId ? updatedStudent : s)),
      }))
      return updatedStudent
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  unassignStudent: async (studentId) => {
    try {
      const updatedStudent = await studentApi.unassignFromTeam(studentId)
      set((state) => ({
        students: state.students.map((s) => (s._id === studentId ? updatedStudent : s)),
      }))
      return updatedStudent
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  assignStudentsToPool: async (studentIds, poolName) => {
  try {
    if (!Array.isArray(studentIds) || studentIds.length === 0 || !poolName) {
      console.warn("[ZUSTAND] Invalid pool assignment", { studentIds, poolName })
      throw new Error("Missing pool or student IDs")
    }

    const updatedStudents = await studentApi.assignToPool(studentIds, poolName)
    set((state) => ({
      students: state.students.map((student) => {
        const updated = updatedStudents.find((u) => u._id === student._id)
        return updated || student
      }),
    }))
    return updatedStudents
  } catch (error) {
    set({ error: error.message })
    throw error
  }
},

  // Selectors
 getUncalledStudents: () => {
  const students = get().students
  return Array.isArray(students) ? students.filter((s) => !s.isCalled) : []
},
  getCalledStudents: () => {
  const students = get().students
  return Array.isArray(students) ? students.filter((s) => s.isCalled) : []
},

getStudentsBySection: (section) => {
  const students = get().students
  return Array.isArray(students) ? students.filter((s) => s.section === section) : []
},

  getStudentsByPool: (section, pool) => {
    return get().students.filter((s) => s.section === section && s.pool === pool)
  },

  getUnassignedStudentsBySection: (section) => {
    return get().students.filter((s) => s.section === section && !s.pool && !s.isCalled)
  },

  // WebSocket update handlers
  updateStudentsFromSocket: (students) => {
    set({ students })
  },

  updateStudentFromSocket: (updatedStudent) => {
    set((state) => ({
      students: state.students.map((s) => (s._id === updatedStudent._id ? updatedStudent : s)),
    }))
  },
})


// // Example: src/store/slices/studentSlice.js
// export const studentSlice = (set, get) => ({
//   // Student state
//   students: [],
  
//   // Student actions
//   fetchStudents: async () => {
//     // Implementation
//   },
  
//   updateStudentsFromSocket: (students) => {
//     set({ students })
//   },
  
//   updateStudentFromSocket: (updatedStudent) => {
//     set((state) => ({
//       students: state.students.map(student => 
//         student._id === updatedStudent._id ? updatedStudent : student
//       )
//     }))
//   },
  
//   // Make sure you're not accidentally defining initializeSocketListeners here
// })

// // Example: src/store/slices/teamSlice.js
// export const teamSlice = (set, get) => ({
//   // Team state
//   teams: [],
  
//   // Team actions
//   fetchTeams: async () => {
//     // Implementation
//   },
  
//   updateTeamsFromSocket: (teams) => {
//     set({ teams })
//   },
  
//   getTeamsWithStudentCounts: () => {
//     return get().teams
//   },
  
//   getTopTeams: (count) => {
//     return get().teams.slice(0, count)
//   },
  
//   getTeamById: (id) => {
//     return get().teams.find(team => team._id === id)
//   },
// })

// // Example: src/store/slices/tvDisplaySlice.js
// export const tvDisplaySlice = (set, get) => ({
//   // TV settings state
//   tv2Settings: {
//     displayMode: "All Teams",
//     topTeamsCount: 5,
//     specificTeamId: null,
//     tv2BannerMessage: ""
//   },
  
//   // TV settings actions
//   fetchTvSettings: async () => {
//     // Implementation
//   },
  
//   updateTv2SettingsFromSocket: (settings) => {
//     set((state) => ({
//       tv2Settings: { ...state.tv2Settings, ...settings }
//     }))
//   },
  
//   updateTv1SettingsFromSocket: (settings) => {
//     // Implementation for TV1 settings
//   },
// })