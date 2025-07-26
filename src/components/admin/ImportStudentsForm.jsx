

import { useState } from "react"
import { useStore } from "../../store/useStore"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"

const ImportStudentsForm = ({ onClose }) => {
  const { addStudent, setError } = useStore()
  const [jsonData, setJsonData] = useState("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState([])
  const [validationErrors, setValidationErrors] = useState([])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/json") {
      const reader = new FileReader()
      reader.onload = (event) => {
        setJsonData(event.target.result)
        validateAndPreview(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const validateAndPreview = (data) => {
    try {
      const parsed = JSON.parse(data)
      const errors = []
      const validStudents = []

      if (!Array.isArray(parsed)) {
        errors.push("JSON must be an array of student objects")
        setValidationErrors(errors)
        return
      }

      parsed.forEach((student, index) => {
        const studentErrors = []

        if (!student.name || typeof student.name !== "string") {
          studentErrors.push(`Row ${index + 1}: Name is required`)
        }
        if (!student.admissionNumber || typeof student.admissionNumber !== "string") {
          studentErrors.push(`Row ${index + 1}: Admission number is required`)
        }
        if (!student.class || typeof student.class !== "string") {
          studentErrors.push(`Row ${index + 1}: Class is required`)
        }
        if (!student.section || typeof student.section !== "string") {
          studentErrors.push(`Row ${index + 1}: Section is required`)
        }

        if (studentErrors.length === 0) {
          validStudents.push({
            ...student,
            isCalled: false,
            teamId: null,
          })
        } else {
          errors.push(...studentErrors)
        }
      })

      setValidationErrors(errors)
      setPreview(validStudents)
    } catch (error) {
      setValidationErrors(["Invalid JSON format"])
      setPreview([])
    }
  }

  const handleTextareaChange = (e) => {
    const value = e.target.value
    setJsonData(value)
    if (value.trim()) {
      validateAndPreview(value)
    } else {
      setPreview([])
      setValidationErrors([])
    }
  }

  const handleImport = async () => {
    if (preview.length === 0) {
      setError("No valid students to import")
      return
    }

    setLoading(true)
    try {
      preview.forEach((student) => {
        addStudent(student)
      })
      onClose()
    } catch (error) {
      setError("Failed to import students")
    } finally {
      setLoading(false)
    }
  }

  const sampleData = [
    {
      name: "John Doe",
      admissionNumber: "2024001",
      class: "Class 10",
      section: "A",
      pool: "Pool 1",
    },
    {
      name: "Jane Smith",
      admissionNumber: "2024002",
      class: "Class 9",
      section: "B",
      pool: "Pool 2",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Import Instructions</h3>
              <p className="text-sm text-blue-700 mt-1">
                Upload a JSON file or paste JSON data containing an array of student objects. Each student must have:
                name, admissionNumber, class, and section. The pool field is optional.
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload JSON File</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <Upload className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Manual JSON Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Or Paste JSON Data</label>
          <textarea
            value={jsonData}
            onChange={handleTextareaChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder={`Paste your JSON data here...\n\nExample:\n${JSON.stringify(sampleData, null, 2)}`}
          />
        </div>

        {/* Sample Data */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Sample JSON Format:</h4>
          <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
            {JSON.stringify(sampleData, null, 2)}
          </pre>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Validation Errors</h4>
                <ul className="text-sm text-red-700 mt-1 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Preview ({preview.length} students)</h4>
                <p className="text-sm text-green-700">These students will be imported:</p>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-green-100">
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Admission #</th>
                    <th className="text-left p-2">Class</th>
                    <th className="text-left p-2">Section</th>
                    <th className="text-left p-2">Pool</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((student, index) => (
                    <tr key={index} className="border-t border-green-200">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.admissionNumber}</td>
                      <td className="p-2">{student.class}</td>
                      <td className="p-2">{student.section}</td>
                      <td className="p-2">{student.pool || "Unassigned"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
            onClick={handleImport}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading || preview.length === 0 || validationErrors.length > 0}
          >
            {loading ? "Importing..." : `Import ${preview.length} Students`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImportStudentsForm
