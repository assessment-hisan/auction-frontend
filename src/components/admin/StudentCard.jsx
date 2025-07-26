

import { User, Calendar, MapPin, UserCheck, UserX } from "lucide-react"

const StudentCard = ({ student, onAction }) => {
  const handleAction = () => {
    const action = student.isCalled ? "reassign" : "call"
    onAction(student, action)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Student Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-500">#{student.admissionNumber}</p>
          </div>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            student.isCalled ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {student.isCalled ? "Called" : "Uncalled"}
        </div>
      </div>

      {/* Student Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{student.class}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>Section: {student.section}</span>
        </div>
        {student.pool && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>{student.pool}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleAction}
        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          student.isCalled ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {student.isCalled ? (
          <>
            <UserX className="h-4 w-4" />
            <span>Re-assign</span>
          </>
        ) : (
          <>
            <UserCheck className="h-4 w-4" />
            <span>Call Student</span>
          </>
        )}
      </button>
    </div>
  )
}

export default StudentCard
