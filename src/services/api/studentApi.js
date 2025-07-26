import axiosInstance from "./axiosInstance"

export const studentApi = {
  getAllStudents: () => axiosInstance.get("/students"),

  // This matches: POST /students/single
  createStudent: (studentData) => axiosInstance.post("/students/single", studentData),

  // This matches: POST /students/bulk
  importStudents: (studentsData) => axiosInstance.post("/students/bulk", studentsData),

  // This matches: DELETE /students/:id
  deleteStudent: (studentId) => axiosInstance.delete(`/students/${studentId}`),

  // This matches: PUT /students/:id
  assignToTeam: (studentId, teamId) => axiosInstance.put(`/students/${studentId}`, { teamId }),

  // This matches: PUT /students/unassign/:id
  unassignFromTeam: (studentId) => axiosInstance.put(`/students/unassign/${studentId}`),

  // This matches: POST /students/assign-to-pool
 assignToPool: (studentIds, poolName) =>
  axiosInstance.post("/students/assign-to-pool", { studentIds, poolName }),
}