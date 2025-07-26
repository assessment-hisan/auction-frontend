import { useState, useEffect } from "react"
import { useStore } from "../store/useStore"
import AssignedStudentPopup from "./AssignedStudentPopup"

const PublicUncalledScreen = () => {
  const students = useStore((state) => state.students)
  const getTeamById = useStore((state) => state.getTeamById) // Assume this exists in the store

  const [showPopup, setShowPopup] = useState(false)
  const [assignedStudentData, setAssignedStudentData] = useState(null)

  // Filter students where teamId is null
  const unassignedStudents = students.filter((student) => !student.teamId)

  // Debug: Log all students and unassigned students
  useEffect(() => {
    console.log("All Students:", students)
    console.log("Unassigned Students (teamId is null):", unassignedStudents)
  }, [students, unassignedStudents])

  // Listen for student assignment events
  useEffect(() => {
    const handleStudentAssigned = (event) => {
      const student = event.detail
      // Fetch team details if teamId exists
      const team = student.teamId ? getTeamById(student.teamId) : null
      setAssignedStudentData({
        ...student,
        teamName: team ? team.name : "No Team Assigned" // Assume team has a name property
      })
      setShowPopup(true)

      // Auto-hide popup after 5 seconds
      setTimeout(() => {
        setShowPopup(false)
      }, 5000)
    }

    window.addEventListener("studentAssigned", handleStudentAssigned)
    return () => window.removeEventListener("studentAssigned", handleStudentAssigned)
  }, [getTeamById])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-200 to-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-10 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-pulse">
              Student Pool
            </h1>
            <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-full transform scale-x-0 animate-pulse" style={{animation: 'scaleIn 2s ease-out forwards'}}></div>
          </div>
          <p className="text-lg text-gray-600 mt-4 font-medium">
            Available students awaiting team assignment
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-semibold text-gray-700">
              {unassignedStudents.length} Students Available
            </span>
          </div>
        </div>

        {/* Students Table */}
        <div className="max-w-7xl mx-auto">
          {unassignedStudents.length > 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-6 py-4">
                <div className="grid grid-cols-6 gap-4 text-white font-bold text-sm uppercase tracking-wider">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Student Name
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    </div>
                    Class
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Section
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Admission No.
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Pool
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Status
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {unassignedStudents.map((student, index) => (
                  <div
                    key={student._id}
                    className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-indigo-50/50 transition-all duration-300 group animate-fadeInUp"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {/* Student Name with Avatar */}
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {(student.name || "N").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                          {student.name || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Class */}
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium group-hover:bg-blue-200 transition-colors duration-300">
                        {student.class || "N/A"}
                      </span>
                    </div>

                    {/* Section */}
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium group-hover:bg-purple-200 transition-colors duration-300">
                        {student.section || "N/A"}
                      </span>
                    </div>

                    {/* Admission Number */}
                    <div className="flex items-center">
                      <span className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
                        {student.admissionNumber || "N/A"}
                      </span>
                    </div>

                    {/* Pool */}
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium group-hover:bg-indigo-200 transition-colors duration-300">
                        {student.pool || "Unassigned"}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
                          student.isCalled 
                            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200 group-hover:shadow-green-300" 
                            : "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg shadow-orange-200 group-hover:shadow-orange-300"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${student.isCalled ? 'bg-green-200' : 'bg-orange-200'} animate-pulse`}></div>
                        {student.isCalled ? "Called" : "Awaiting"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Footer */}
              <div className="bg-gray-50/80 px-6 py-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Total: <strong className="text-indigo-600">{unassignedStudents.length}</strong> students</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    Live updates enabled
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">All Students Assigned!</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Every student has been successfully assigned to a team. The pool is currently empty.
                </p>
                <div className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-semibold shadow-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Assignment Complete
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student Assignment Popup */}
        {showPopup && assignedStudentData && (
          <AssignedStudentPopup studentData={assignedStudentData} onClose={() => setShowPopup(false)} />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

export default PublicUncalledScreen