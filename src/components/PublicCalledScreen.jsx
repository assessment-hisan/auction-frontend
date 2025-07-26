import React, { useMemo } from 'react'
import { useStore } from '../store/useStore'
import { Crown, Users } from 'lucide-react'

const PublicCalledScreen = () => {
  const students = useStore((state) => state.students)
  const teams = useStore((state) => state.teams)
  const tv2Settings = useStore((state) => state.tv2Settings)

  // Group students by teamId._id
  const studentsGroupedByTeam = useMemo(() => {
    const map = {}
    for (const student of students) {
      if (!student.teamId || !student.teamId._id) continue
      const teamId = student.teamId._id
      if (!map[teamId]) map[teamId] = []
      map[teamId].push(student)
    }
    return map
  }, [students])

  // Combine teams with students
  const teamsWithStudents = useMemo(() => {
    return teams
      .map((team) => ({
        ...team,
        students: studentsGroupedByTeam[team._id] || [],
      }))
      .filter((team) => team.students.length > 0)
  }, [teams, studentsGroupedByTeam])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-3 tracking-wide">
          TEAM ASSIGNMENTS
        </h1>
        <div className="text-xl text-blue-200">
          {tv2Settings?.tv2BannerMessage || "Live Team Distribution Display"}
        </div>
      </div>

      {/* Teams Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1800px] mx-auto">
        {teamsWithStudents.map((team) => (
          <div
            key={team._id}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl overflow-hidden border border-white border-opacity-20 shadow-2xl"
          >
            {/* Team Header */}
            <div
              className="p-4 text-white relative overflow-hidden"
              style={{ backgroundColor: team.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-25 rounded-full flex items-center justify-center">
                      <Crown className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-wide">{team.name}</h2>
                      <div className="text-sm opacity-90">Leader: {team.leader}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{team.students.length}</div>
                    <div className="text-xs opacity-90 flex items-center justify-center">
                      <Users className="h-3 w-3 mr-1" />
                      STUDENTS
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-slate-800 bg-opacity-50 max-h-[500px] overflow-y-auto">
              {team.students.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-slate-900 bg-opacity-70 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-bold text-white">Adm No.</th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-white">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-white">Class</th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-white">Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.students.map((student, index) => (
                      <tr
                        key={student._id}
                        className={`${
                          index % 2 === 0
                            ? 'bg-slate-700 bg-opacity-40'
                            : 'bg-slate-800 bg-opacity-60'
                        } hover:bg-slate-600 hover:bg-opacity-50 transition-all duration-200`}
                      >
                        <td className="px-4 py-1 text-sm font-semibold text-white">
                          {student.admissionNumber}
                        </td>
                        <td className="px-4 py-1 text-sm text-white font-medium">
                          {student.name}
                        </td>
                        <td className="px-4 py-1 text-sm text-white">{student.class}</td>
                        <td className="px-4 py-1 text-sm text-white">{student.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">👥</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Students Assigned</h3>
                  <p className="text-base text-gray-300">Waiting for team assignments...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-900 bg-opacity-70 px-4 py-2">
              <div className="flex justify-between items-center text-white text-sm">
                <div>
                  <span className="font-semibold">Team ID:</span>{' '}
                  <span className="text-blue-300 font-mono">{team._id.slice(-8)}</span>
                </div>
                <div>
                  <span className="font-semibold">Total:</span>{' '}
                  <span className="text-green-300 font-bold">{team.students.length} students</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="text-center text-white">
          <div className="text-2xl font-semibold">
            Total Students Assigned:{' '}
            {teamsWithStudents.reduce((sum, team) => sum + team.students.length, 0)}
          </div>
          <div className="text-lg text-blue-200 mt-1">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicCalledScreen
