

import { useEffect, useState } from "react"
import { useStore } from "../../store/useStore"
import { Plus, Users, Crown, Trash2, Edit } from "lucide-react"
import { useMemo } from "react"
const TeamManagementPage = () => {
  const {
    teams,
    students,
    createTeam,
    deleteTeam,
    getTeamsWithStudentCounts,
  } = useStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)

  const teamsWithCounts = Array.isArray(teams) ? getTeamsWithStudentCounts() : []

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team? All assigned students will be unassigned.")) {
      await deleteTeam(teamId)
    }
  }
  useEffect(() => {
    console.log("teams", teams,)
    console.log("stdutents", students)
  }, [])
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Create and manage auction teams</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamsWithCounts.map((team) => (
          <TeamCard
            key={team._id}
            team={team}
            onEdit={() => setEditingTeam(team)}
            onDelete={() => handleDeleteTeam(team._id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {teams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams created yet</h3>
          <p className="text-gray-600 mb-4">Create your first team to start the auction</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Team
          </button>
        </div>
      )}

      {/* Create/Edit Team Modal */}
      {(showCreateForm || editingTeam) && (
        <TeamFormModal
          team={editingTeam}
          onClose={() => {
            setShowCreateForm(false)
            setEditingTeam(null)
          }}
          onSave={(teamData) => {
            if (editingTeam) {
              // Update team logic would go here
            } else {
              createTeam(teamData)
            }
            setShowCreateForm(false)
            setEditingTeam(null)
          }}
        />
      )}
    </div>
  )
}

const TeamCard = ({ team, onEdit, onDelete }) => {
  const studentsBySection = team.students.reduce((acc, student) => {
    acc[student.section] = (acc[student.section] || 0) + 1
    return acc
  }, {})

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Team Header */}
      <div className="p-4 text-white" style={{ backgroundColor: team.color }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{team.name}</h3>
          <div className="flex space-x-2">
            <button onClick={onEdit} className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
              <Edit className="h-4 w-4" />
            </button>
            <button onClick={onDelete} className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <Crown className="h-4 w-4 mr-2" />
          <span className="text-sm">Leader: {team.leader?.name}</span>
        </div>
      </div>

      {/* Team Content */}
      <div className="p-4">
        {/* Sub-leaders */}
        {Object.keys(team.subLeaders).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sub-leaders:</h4>
            <div className="space-y-1">
              {Object.entries(team.subLeaders).map(([section, leader]) => (
                <div key={section} className="text-sm text-gray-600">
                  Section {section}: {typeof leader === "object" ? leader.name : leader}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Count */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Students</span>
            <span className="text-lg font-bold text-blue-600">{team.students.length}</span>
          </div>

          {/* Students by Section */}
          {Object.keys(studentsBySection).length > 0 && (
            <div className="space-y-1">
              {Object.entries(studentsBySection).map(([section, count]) => (
                <div key={section} className="flex justify-between text-sm text-gray-600">
                  <span>{section}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Students */}
        {team.students.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Students:</h4>
            <div className="space-y-1">
              {team.students.slice(0, 3).map((student) => (
                <div key={student._id} className="text-sm text-gray-600">
                  {student.name} ({student.class})
                </div>
              ))}
              {team.students.length > 3 && (
                <div className="text-sm text-gray-500">+{team.students.length - 3} more...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const TeamFormModal = ({ team, onClose, onSave }) => {
  const students = useStore((state) => state.students)

  const [formData, setFormData] = useState({
    name: team?.name || "",
    leader: typeof team?.leader === "object" ? team.leader._id : team?.leader || "",
    subLeaders: team?.subLeaders
      ? Object.fromEntries(
        Object.entries(team.subLeaders).map(([section, value]) => [
          section,
          typeof value === "object" ? value._id : value,
        ])
      )
      : {},
    color: team?.color || "#3B82F6",
  })

  const predefinedColors = [
    "#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16", "#22C55E", "#10B981", "#14B8A6",
    "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#EC4899",
  ]

  const availableStudents = useMemo(() => {
  if (team) {
    // Editing: allow previously assigned students
    return students
  }
  // Creating: show only unassigned students (no teamId)
  return students.filter((student) => !student.teamId)
}, [students, team])

  const sections = ["A", "B", "C"]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleSubLeaderChange = (section, leaderId) => {
    setFormData((prev) => ({
      ...prev,
      subLeaders: {
        ...prev.subLeaders,
        [section]: leaderId,
      },
    }))
  }

  const selectedLeader = useMemo(
    () => students.find((s) => s._id === formData.leader),
    [students, formData.leader]
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-50 p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{team ? "Edit Team" : "Create New Team"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Team Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Team Leader */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Leader</label>
            <select
              value={formData.leader}
              onChange={(e) => setFormData((prev) => ({ ...prev, leader: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a leader...</option>
              {availableStudents.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.class} - {student.section})
                </option>
              ))}
            </select>
          </div>

          {/* Sub-leaders */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub-leaders (Optional)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sections.map((section) => (
                <div key={section}>
                  <label className="block text-xs text-gray-600 mb-1">Section {section}</label>
                  <select
                    value={formData.subLeaders[section] || ""}
                    onChange={(e) => handleSubLeaderChange(section, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select sub-leader...</option>
                    {availableStudents.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.class})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Team Color */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Color</label>
            <div className="grid grid-cols-8 gap-2 mb-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? "border-gray-800" : "border-gray-300"
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>

          {/* Preview */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
            <div className="p-3 rounded text-white" style={{ backgroundColor: formData.color }}>
              <div className="font-bold">{formData.name || "Team Name"}</div>
              <div className="text-sm opacity-90">Leader: {selectedLeader?.name || "Not selected"}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {team ? "Update Team" : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TeamManagementPage
