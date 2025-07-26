

import { useState, useMemo, useEffect } from "react"
import { useStore } from "../../store/useStore"
import { Plus, Upload, Filter, Users, UserCheck } from "lucide-react"
import Button from "../ui/Button"
import Modal from "../ui/Modal"
import StudentCard from "./StudentCard"
import AddStudentForm from "./AddStudentForm"
import ImportStudentsForm from "./ImportStudentsForm"
import AssignStudentsToPoolForm from "./AssignStudentsToPoolForm"
import StudentAuctionModal from "./StudentAuctionModal"

const StudentManagementPage = () => {
  const students = useStore((state) => state.students)

  // const students = useStore((state) => state.students)
  const [activeTab, setActiveTab] = useState("uncalled")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showAssignPoolModal, setShowAssignPoolModal] = useState(false)
  const [showAuctionModal, setShowAuctionModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [filters, setFilters] = useState({ section: "all", pool: "all" })

  const uncalledStudents = students.filter((s) => !s.teamId)
  const calledStudents = students.filter((s) => s.teamId)

  // Get unique sections and pools for filters
  const sections = [...new Set(students.map((s) => s.section))]
  const pools = [...new Set(students.map((s) => s.pool).filter(Boolean))]

  // Filter students based on current filters
  const filteredStudents = useMemo(() => {
    const studentsToFilter = activeTab === "uncalled" ? uncalledStudents : calledStudents

    return studentsToFilter.filter((student) => {
      const sectionMatch = filters.section === "all" || student.section === filters.section
      const poolMatch = filters.pool === "all" || student.pool === filters.pool
      return sectionMatch && poolMatch
    })
  }, [uncalledStudents, calledStudents, activeTab, filters])

  const handleStudentAction = (student, action) => {

    setSelectedStudent({ ...student, action })
    setShowAuctionModal(true)
  }
  useEffect(() => {
    console.log("from managment page", students)
    console.log("Students in store:", students)
    console.log("Uncalled:", uncalledStudents)
    console.log("Called:", calledStudents)
  }, [])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowAssignPoolModal(true)}
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Assign to Pool</span>
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)} className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import Students</span>
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("uncalled")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "uncalled"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Uncalled Students ({uncalledStudents.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("called")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "called"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Called Students ({calledStudents.length})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                value={filters.section}
                onChange={(e) => setFilters((prev) => ({ ...prev, section: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sections</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pool</label>
              <select
                value={filters.pool}
                onChange={(e) => setFilters((prev) => ({ ...prev, pool: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Pools</option>
                {pools.map((pool) => (
                  <option key={pool} value={pool}>
                    {pool}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <StudentCard key={student._id} student={student} onAction={handleStudentAction} />
        ))}
      </div> */}

      {/* table for students */}
      <div className="w-full rounded-xl">
        <table className="w-full rounded-xl">
          <thead className="bg-black bg-opacity-20">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">si no.</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Admission No.</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Student Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Class</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">pool</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Team</th>
            </tr>
          </thead>
          <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr
                        key={student._id}
                        className={`${
                          index % 2 === 0 ? " bg-opacity-10" : "bg-black bg-opacity-20"
                        } hover:bg-black hover:bg-opacity-30 transition-colors`}
                      >
                        <td className="px-4 py-2 text-sm font-medium">{index + 1}</td>
                        <td className="px-4 py-2 text-sm font-medium">{student.admissionNumber}</td>
                        <td className="px-4 py-2 text-sm">{student.name}</td>
                        <td className="px-4 py-2 text-sm">{student.class}</td>
                        <td className="px-4 py-2 text-sm">{student.pool || "not assinged"}</td>
                        <td className="px-4 py-2 text-sm">{student.teamId?.name || "not assinged"}</td>
                      </tr>
                    ))}
                  </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500">
            {activeTab === "uncalled"
              ? "No uncalled students match your current filters."
              : "No called students match your current filters."}
          </p>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Student">
        <AddStudentForm onClose={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={showImportModal} onClose={() => setShowImportModal(false)} title="Import Students" size="lg">
        <ImportStudentsForm onClose={() => setShowImportModal(false)} />
      </Modal>

      <Modal
        isOpen={showAssignPoolModal}
        onClose={() => setShowAssignPoolModal(false)}
        title="Assign Students to Pool"
        size="lg"
      >
        <AssignStudentsToPoolForm onClose={() => setShowAssignPoolModal(false)} />
      </Modal>

      <Modal isOpen={showAuctionModal} onClose={() => setShowAuctionModal(false)} title="Student Auction" size="lg">
        <StudentAuctionModal student={selectedStudent} onClose={() => setShowAuctionModal(false)} />
      </Modal>
    </div>
  )
}

export default StudentManagementPage
