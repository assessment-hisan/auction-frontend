

import { useState } from "react"
import { useStore } from "../../store/useStore"
import { User, Crown, Users, AlertTriangle } from "lucide-react"

const StudentAuctionModal = ({ student, onClose }) => {
  const { teams, assignStudentToTeam, updateStudent, setError } = useStore()
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!student) return null

  const handleAssign = async () => {
    if (!selectedTeamId) {
      setError("Please select a team")
      return
    }

    setLoading(true)
    try {
      await assignStudentToTeam(student._id, selectedTeamId)

      // Trigger student assigned event for popup
      const selectedTeam = teams.find((team) => team._id === selectedTeamId)
      if (selectedTeam) {
        const event = new CustomEvent("studentAssigned", {
          detail: {
            studentName: student.name,
            studentClass: student.class,
            studentSection: student.section,
            teamName: selectedTeam.name,
            teamColor: selectedTeam.color,
          },
        })
        window.dispatchEvent(event)
      }

      onClose()
    } catch (error) {
      setError("Failed to assign student to team")
    } finally {
      setLoading(false)
    }
  }

  const handleUnassign = async () => {
    setLoading(true)
    try {
      await updateStudent({
        ...student,
        teamId: null,
        isCalled: false,
      })
      onClose()
    } catch (error) {
      setError("Failed to unassign student")
    } finally {
      setLoading(false)
    }
  }

  const currentTeam = student.teamId ? teams.find((team) => team._id === student.teamId) : null

  return (
    <div className="max-w-2xl mx-auto">
      {!showConfirmation ? (
        <div className="space-y-6">
          {/* Student Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">#{student.admissionNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Class:</span>
                <span className="ml-2 text-gray-600">{student.class}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Section:</span>
                <span className="ml-2 text-gray-600">{student.section}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Pool:</span>
                <span className="ml-2 text-gray-600">{student.pool || "Unassigned"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    student.isCalled ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {student.isCalled ? "Called" : "Uncalled"}
                </span>
              </div>
            </div>

            {/* Current Team */}
            {currentTeam && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${currentTeam.color}20` }}>
                <div className="flex items-center space-x-2">
                  <Crown className="h-4 w-4" style={{ color: currentTeam.color }} />
                  <span className="font-medium" style={{ color: currentTeam.color }}>
                    Currently assigned to: {currentTeam.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Team Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {student.isCalled ? "Re-assign to Team:" : "Assign to Team:"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teams.map((team) => (
                <TeamCard
                  key={team._id}
                  team={team}
                  isSelected={selectedTeamId === team._id}
                  onSelect={() => setSelectedTeamId(team._id)}
                  isCurrent={currentTeam?._id === team._id}
                />
              ))}
            </div>

            {teams.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No teams available</p>
                <p className="text-sm">Create teams first before assigning students</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            {student.isCalled && (
              <button
                onClick={() => setShowConfirmation(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Unassign Student</span>
              </button>
            )}

            <div className="flex space-x-3 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading || !selectedTeamId || teams.length === 0}
              >
                {loading ? "Assigning..." : student.isCalled ? "Re-assign" : "Assign Student"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Confirmation Dialog */
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Confirm Unassignment</h3>
          <p className="text-gray-600">
            Are you sure you want to unassign <strong>{student.name}</strong> from <strong>{currentTeam?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            This will move the student back to the uncalled list and they can be assigned to a different team later.
          </p>

          <div className="flex justify-center space-x-3 pt-4">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleUnassign}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Unassigning..." : "Yes, Unassign"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const TeamCard = ({ team, isSelected, onSelect, isCurrent }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : isCurrent
            ? "border-orange-300 bg-orange-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: team.color }}></div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{team.name}</h4>
          <p className="text-sm text-gray-600">Leader: {team.leader}</p>
          {isCurrent && <p className="text-xs text-orange-600 font-medium">Current Team</p>}
        </div>
        {isSelected && <div className="w-4 h-4 bg-blue-600 rounded-full"></div>}
      </div>
    </div>
  )
}

export default StudentAuctionModal
