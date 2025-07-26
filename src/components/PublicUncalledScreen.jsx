import { useEffect, useState, useMemo } from "react"
import { useStore } from "../store/useStore"

const PublicUncalledScreen = () => {
  const students = useStore((state) => state.students)
  const tv1settings = useStore((state) => state.tv1Settings)

  const unassignedStudents = useMemo(
    () => students.filter((s) => !s.teamId),
    [students]
  )

  const sections = useMemo(() => {
    const unique = new Set(unassignedStudents.map((s) => s.section))
    return Array.from(unique).filter(Boolean)
  }, [unassignedStudents])

  const [selectedSection, setSelectedSection] = useState(tv1settings?.data?.section || sections[0])
  const poolsInSection = useMemo(() => {
    return Array.from(
      new Set(unassignedStudents.filter(s => s.section === selectedSection).map(s => s.pool))
    ).filter(Boolean)
  }, [unassignedStudents, selectedSection])

  const [selectedPool, setSelectedPool] = useState("all")

  const filteredStudents = useMemo(() => {
    return unassignedStudents.filter((s) => {
      return s.section === selectedSection && (selectedPool === "all" || s.pool === selectedPool)
    })
  }, [unassignedStudents, selectedSection, selectedPool])

  const leftColumnStudents = filteredStudents.filter((_, i) => i % 2 === 0)
  const rightColumnStudents = filteredStudents.filter((_, i) => i % 2 === 1)

  useEffect(() => {
    if (!selectedSection && sections.length) {
      setSelectedSection(sections[0])
    }
    setTimeout(() => {
      location.reload()
    }, 2000);
  }, [sections, selectedSection])
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            {/* Section */}
            <div>
              <span className="text-sm text-gray-500">Current Section:</span>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">{selectedSection || "N/A"}</h2>
            </div>

            {/* Pools */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500 mr-2">Pools:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedPool("all")}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    selectedPool === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  All ({unassignedStudents.filter(s => s.section === selectedSection).length})
                </button>
                {poolsInSection.map((pool) => (
                  <button
                    key={pool}
                    onClick={() => setSelectedPool(pool)}
                    className={`px-3 py-1 rounded text-sm font-medium transition whitespace-nowrap ${
                      selectedPool === pool ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                    }`}
                  >
                    {pool}
                    {" "}
                    ({unassignedStudents.filter(s => s.section === selectedSection && s.pool === pool).length})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="mt-4 flex space-x-1 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => {
                  setSelectedSection(section)
                  setSelectedPool("all")
                }}
                className={`px-3 py-1 rounded text-xs font-medium capitalize ${
                  selectedSection === section
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Student Table */}
        <div className="grid grid-cols-2 gap-6">
          {[leftColumnStudents, rightColumnStudents].map((column, colIdx) => (
            <div key={colIdx} className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">
                  Column {colIdx + 1} ({column.length} students)
                </h3>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Adm No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Class
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {column.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.pool || "Unassigned"}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{student.admissionNumber}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700">
                            {student.class || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {column.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PublicUncalledScreen
