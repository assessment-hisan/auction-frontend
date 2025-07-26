

import { useState } from "react"
import { useStore } from "../../store/useStore"
import { User, Hash, GraduationCap, MapPin, Users } from "lucide-react"

const AddStudentForm = ({ onClose }) => {
  const { addStudent, setError } = useStore()
console.log("addStudent function:", addStudent)

  const [formData, setFormData] = useState({
    name: "",
    admissionNumber: "",
    class: "",
    section: "",
    pool: "",
  })
  const [loading, setLoading] = useState(false)

  const sections = ["bidayah", "ula", "thaniya", "thanawiyyah", "aliyah"]
  const pools = ["Pool 1", "Pool 2", "Pool 3", "Pool 4", "Pool 5", "Pool 6", "Pool 7", "Pool 8", "pool 9"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.name.trim() || !formData.admissionNumber.trim() || !formData.class.trim() || !formData.section) {
        setError("Please fill in all required fields")
        return
      }

      const studentData = {
        ...formData,
        name: formData.name.trim(),
        admissionNumber: formData.admissionNumber.trim(),
        class: formData.class.trim(),
        isCalled: false,
        teamId: null,
      }

      addStudent(studentData)
      onClose()
    } catch (error) {
      console.log(error)
     
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Name */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4" />
            <span>Student Name *</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student name"
            required
          />
        </div>

        {/* Admission Number */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Hash className="h-4 w-4" />
            <span>Admission Number *</span>
          </label>
          <input
            type="text"
            value={formData.admissionNumber}
            onChange={(e) => handleChange("admissionNumber", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter admission number"
            required
          />
        </div>

        {/* Class */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <GraduationCap className="h-4 w-4" />
            <span>Class *</span>
          </label>
          <input
            type="text"
            value={formData.class}
            onChange={(e) => handleChange("class", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Class 10, Grade 9"
            required
          />
        </div>

        {/* Section */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4" />
            <span>Section *</span>
          </label>
          <select
            value={formData.section}
            onChange={(e) => handleChange("section", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        {/* Pool (Optional) */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4" />
            <span>Pool (Optional)</span>
          </label>
          <select
            value={formData.pool}
            onChange={(e) => handleChange("pool", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No pool assigned</option>
            {pools.map((pool) => (
              <option key={pool} value={pool}>
                {pool}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStudentForm
