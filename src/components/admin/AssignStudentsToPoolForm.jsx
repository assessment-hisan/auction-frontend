

import { useState, useMemo } from "react"
import  {useStore}  from "../../store/useStore"
import { Search, Users, CheckCircle, MapPin } from "lucide-react"

const AssignStudentsToPoolForm = ({ onClose }) => {
  const { students, assignStudentsToPool, setError } = useStore()
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedPool, setSelectedPool] = useState("")
  const [selectedStudents, setSelectedStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const sections = ["bidayah","ula", "thaniya","thanawiyyah","aliyah" ]
  //eng, arb, urd , mlm. song, art. it, academic, general
  const pools = ["Pool 1", "Pool 2", "Pool 3", "Pool 4", "Pool 5", "Pool 6", "Pool 7", "Pool 8" , "pool 9"]

  // Get available students (unassigned to any pool in the selected section)
  const availableStudents = useMemo(() => {
    if (!selectedSection) return []

    return students.filter((student) => {
      const sectionMatch = student.section === selectedSection
      const notAssignedToPool = !student.pool || student.pool === ""
      const searchMatch =
        !searchTerm ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())

      return sectionMatch && notAssignedToPool && searchMatch
    })
  }, [students, selectedSection, searchTerm])

  const handleStudentToggle = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === availableStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(availableStudents.map((student) => student._id))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedSection || !selectedPool) {
      setError("Please select both section and pool")
      return
    }

    if (selectedStudents.length === 0) {
      setError("Please select at least one student")
      return
    }

    setLoading(true)
    try {
      console.log(selectedPool)
      await assignStudentsToPool(selectedStudents, selectedPool)
      onClose()
    } catch (error) {
      setError("Failed to assign students to pool")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedSection("")
    setSelectedPool("")
    setSelectedStudents([])
    setSearchTerm("")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section and Pool Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Select Section *</span>
            </label>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value)
                setSelectedStudents([])
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a section...</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4" />
              <span>Select Pool *</span>
            </label>
            <select
              value={selectedPool}
              onChange={(e) => setSelectedPool(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a pool...</option>
              {pools.map((pool) => (
                <option key={pool} value={pool}>
                  {pool}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search and Filter */}
        {selectedSection && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students by name, admission number, or class..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                {selectedStudents.length === availableStudents.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            {/* Student Count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Available students in {selectedSection}: {availableStudents.length}
              </span>
              <span>Selected: {selectedStudents.length}</span>
            </div>
          </div>
        )}

        {/* Students List */}
        {selectedSection && (
          <div className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Students in {selectedSection} (Unassigned to any pool)</h4>
            </div>

            {availableStudents.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                  {availableStudents.map((student) => (
                    <StudentCard
                      key={student._id}
                      student={student}
                      isSelected={selectedStudents.includes(student._id)}
                      onToggle={() => handleStudentToggle(student._id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No unassigned students found in {selectedSection}</p>
                <p className="text-sm mt-1">All students in this section are already assigned to pools</p>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {selectedStudents.length > 0 && selectedPool && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Assignment Summary</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {selectedStudents.length} student{selectedStudents.length !== 1 ? "s" : ""} from{" "}
                  <strong>{selectedSection}</strong> will be assigned to <strong>{selectedPool}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Reset Form
          </button>

          <div className="flex space-x-3">
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
              disabled={loading || selectedStudents.length === 0 || !selectedSection || !selectedPool}
            >
              {loading ? "Assigning..." : `Assign ${selectedStudents.length} Students`}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

const StudentCard = ({ student, isSelected, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{student.name}</h4>
          <p className="text-sm text-gray-500">#{student.admissionNumber}</p>
          <p className="text-sm text-gray-500">{student.class}</p>
        </div>
        <div className="ml-2">
          {isSelected ? (
            <CheckCircle className="h-5 w-5 text-blue-600" />
          ) : (
            <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssignStudentsToPoolForm
