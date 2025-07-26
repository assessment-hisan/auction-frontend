"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"

const AssignedStudentPopup = ({ studentData, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!studentData) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-lg shadow-2xl border-4 border-green-500 p-6 max-w-md w-full mx-4 pointer-events-auto animate-bounce">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-bold text-gray-900">Student Assigned!</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 mb-2">{studentData.studentName}</div>
          <div className="text-sm text-gray-600 mb-4">
            {studentData.studentClass} - {studentData.studentSection}
          </div>

          <div className="text-lg font-semibold mb-2">Assigned to:</div>
          <div
            className="inline-block px-4 py-2 rounded-lg text-white font-bold text-lg"
            style={{ backgroundColor: studentData.teamColor }}
          >
            {studentData.teamName}
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500">This popup will close automatically in 5 seconds</div>
        </div>
      </div>
    </div>
  )
}

export default AssignedStudentPopup
