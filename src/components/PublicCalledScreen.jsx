import { useEffect } from "react"
import { useStore } from "../store/useStore"
import { Users, Crown, User } from "lucide-react"

const PublicCalledScreen = () => {
  const {
    tv2Settings,
    initializeSocketListeners,
    fetchInitialData,
    getTeamsWithStudentCounts,
    getTopTeams,
    getTeamById,
  } = useStore()

  // Initialize WebSocket listeners + fetch data once
  useEffect(() => {
    initializeSocketListeners()
    fetchInitialData()
  }, [])

  // Decide which teams to display
  const displayTeams = (() => {
    switch (tv2Settings.displayMode) {
      case "Specific Team":
        const team = getTeamById(tv2Settings.specificTeamId)
        return team ? [team] : []
      case "Top Teams":
        return getTopTeams(tv2Settings.topTeamsCount)
      case "All Teams":
      default:
        return getTeamsWithStudentCounts()
    }
  })()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 text-white">
      {/* Header */}
      <div className="bg-black bg-opacity-30 p-6">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Team Assignments</h1>

        {/* Display Mode Info */}
        <div className="text-center mb-4">
          <div className="text-xl md:text-2xl font-semibold">
            Display Mode: <span className="text-yellow-300">{tv2Settings.displayMode}</span>
          </div>
          {tv2Settings.displayMode === "Top Teams" && (
            <div className="text-lg mt-2">
              Showing Top <span className="text-green-300">{tv2Settings.topTeamsCount}</span> Teams
            </div>
          )}
        </div>

        {/* Banner Message */}
        {tv2Settings.tv2BannerMessage && (
          <div className="text-center">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg inline-block text-lg md:text-xl font-semibold">
              {tv2Settings.tv2BannerMessage}
            </div>
          </div>
        )}
      </div>

      {/* Teams Grid */}
      <div className="p-6">
        {displayTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayTeams.map((team) => (
              <TeamDisplay key={team._id} team={team} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-3xl md:text-4xl font-bold mb-4">📋</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">No Teams to Display</h3>
            <p className="text-lg md:text-xl text-gray-300">
              {tv2Settings.displayMode === "Specific Team"
                ? "Selected team not found"
                : "No teams have been created yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const TeamDisplay = ({ team }) => {
  const studentsBySection = team.students.reduce((acc, student) => {
    if (!acc[student.section]) acc[student.section] = []
    acc[student.section].push(student)
    return acc
  }, {})

  const sortedSections = Object.keys(studentsBySection).sort()

  return (
    <div className="bg-white bg-opacity-10 rounded-lg overflow-hidden shadow-lg">
      {/* Team Header */}
      <div className="p-4 text-white" style={{ backgroundColor: team.color }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{team.name}</h2>
              <div className="text-sm opacity-90">Leader: {team.leader}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{team.students.length}</div>
            <div className="text-sm opacity-90">Students</div>
          </div>
        </div>

        {/* Sub-leaders */}
        {Object.keys(team.subLeaders || {}).length > 0 && (
          <div className="mt-3 pt-3 border-t border-white border-opacity-20">
            <div className="text-sm font-medium mb-1">Sub-leaders:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(team.subLeaders).map(([section, name]) => (
                <div key={section} className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                  Section {section}: {name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Students by Section */}
      {team.students.length > 0 ? (
        <div>
          {sortedSections.map((section) => (
            <div key={section} className="border-t border-gray-700">
              <div className="bg-black bg-opacity-30 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <h3 className="font-medium">Section: {section}</h3>
                  <span className="text-sm bg-blue-600 px-2 py-0.5 rounded-full">
                    {studentsBySection[section].length} students
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black bg-opacity-20">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Admission No.</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Student Name</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsBySection[section].map((student, index) => (
                      <tr
                        key={student._id}
                        className={`${
                          index % 2 === 0 ? "bg-black bg-opacity-10" : "bg-black bg-opacity-20"
                        } hover:bg-black hover:bg-opacity-30 transition-colors`}
                      >
                        <td className="px-4 py-2 text-sm font-medium">{student.admissionNumber}</td>
                        <td className="px-4 py-2 text-sm">{student.name}</td>
                        <td className="px-4 py-2 text-sm">{student.class}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No Students Assigned</h3>
          <p className="text-gray-300">This team doesn't have any students yet.</p>
        </div>
      )}

      {/* Team Summary */}
      {team.students.length > 0 && (
        <div className="bg-black bg-opacity-30 p-4">
          <div className="flex flex-wrap gap-3">
            {sortedSections.map((section) => (
              <div key={section} className="bg-white bg-opacity-10 px-3 py-1 rounded-lg text-sm">
                {section}: {studentsBySection[section].length} students
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicCalledScreen




// import { useEffect } from "react"
// import { useStore } from "../store/AppContext" // Make sure this path is correct
// import { Users, Crown, User } from "lucide-react"

// const PublicCalledScreen = () => {
//   const storeState = useStore()
  
//   // Debug: Check what's actually available in the store
//   console.log("Store state keys:", Object.keys(storeState))
//   console.log("initializeSocketListeners type:", typeof storeState.initializeSocketListeners)
  
//   const {
//     tv2Settings,
//     initializeSocketListeners,
//     fetchInitialData,
//     getTeamsWithStudentCounts,
//     getTopTeams,
//     getTeamById,
//   } = storeState

//   // Initialize WebSocket listeners + fetch data once
//   useEffect(() => {
//     // Add safety check
//     if (typeof initializeSocketListeners === 'function') {
//       initializeSocketListeners()
//     } else {
//       console.error("initializeSocketListeners is not a function:", initializeSocketListeners)
//     }
    
//     if (typeof fetchInitialData === 'function') {
//       fetchInitialData()
//     } else {
//       console.error("fetchInitialData is not a function:", fetchInitialData)
//     }
//   }, [initializeSocketListeners, fetchInitialData])

//   // Rest of your component remains the same...
//   const displayTeams = (() => {
//     switch (tv2Settings?.displayMode) {
//       case "Specific Team":
//         const team = getTeamById?.(tv2Settings.specificTeamId)
//         return team ? [team] : []
//       case "Top Teams":
//         return getTopTeams?.(tv2Settings.topTeamsCount) || []
//       case "All Teams":
//       default:
//         return getTeamsWithStudentCounts?.() || []
//     }
//   })()

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 text-white">
//       {/* Rest of your JSX remains the same */}
//       <div className="bg-black bg-opacity-30 p-6">
//         <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Team Assignments</h1>
        
//         <div className="text-center mb-4">
//           <div className="text-xl md:text-2xl font-semibold">
//             Display Mode: <span className="text-yellow-300">{tv2Settings?.displayMode || 'Loading...'}</span>
//           </div>
//           {tv2Settings?.displayMode === "Top Teams" && (
//             <div className="text-lg mt-2">
//               Showing Top <span className="text-green-300">{tv2Settings.topTeamsCount}</span> Teams
//             </div>
//           )}
//         </div>

//         {tv2Settings?.tv2BannerMessage && (
//           <div className="text-center">
//             <div className="bg-red-600 text-white px-6 py-3 rounded-lg inline-block text-lg md:text-xl font-semibold">
//               {tv2Settings.tv2BannerMessage}
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="p-6">
//         {displayTeams.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {displayTeams.map((team) => (
//               <TeamDisplay key={team._id} team={team} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <div className="text-3xl md:text-4xl font-bold mb-4">📋</div>
//             <h3 className="text-2xl md:text-3xl font-bold mb-2">No Teams to Display</h3>
//             <p className="text-lg md:text-xl text-gray-300">
//               {tv2Settings?.displayMode === "Specific Team"
//                 ? "Selected team not found"
//                 : "No teams have been created yet"}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // TeamDisplay component remains the same
// const TeamDisplay = ({ team }) => {
//   const studentsBySection = team.students.reduce((acc, student) => {
//     if (!acc[student.section]) acc[student.section] = []
//     acc[student.section].push(student)
//     return acc
//   }, {})

//   const sortedSections = Object.keys(studentsBySection).sort()

//   return (
//     <div className="bg-white bg-opacity-10 rounded-lg overflow-hidden shadow-lg">
//       <div className="p-4 text-white" style={{ backgroundColor: team.color }}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//               <Crown className="h-6 w-6" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold">{team.name}</h2>
//               <div className="text-sm opacity-90">Leader: {team.leader}</div>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-3xl font-bold">{team.students.length}</div>
//             <div className="text-sm opacity-90">Students</div>
//           </div>
//         </div>

//         {Object.keys(team.subLeaders || {}).length > 0 && (
//           <div className="mt-3 pt-3 border-t border-white border-opacity-20">
//             <div className="text-sm font-medium mb-1">Sub-leaders:</div>
//             <div className="flex flex-wrap gap-2">
//               {Object.entries(team.subLeaders).map(([section, name]) => (
//                 <div key={section} className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
//                   Section {section}: {name}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {team.students.length > 0 ? (
//         <div>
//           {sortedSections.map((section) => (
//             <div key={section} className="border-t border-gray-700">
//               <div className="bg-black bg-opacity-30 px-4 py-2">
//                 <div className="flex items-center space-x-2">
//                   <Users className="h-4 w-4" />
//                   <h3 className="font-medium">Section: {section}</h3>
//                   <span className="text-sm bg-blue-600 px-2 py-0.5 rounded-full">
//                     {studentsBySection[section].length} students
//                   </span>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-black bg-opacity-20">
//                     <tr>
//                       <th className="px-4 py-2 text-left text-sm font-semibold">Admission No.</th>
//                       <th className="px-4 py-2 text-left text-sm font-semibold">Student Name</th>
//                       <th className="px-4 py-2 text-left text-sm font-semibold">Class</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {studentsBySection[section].map((student, index) => (
//                       <tr
//                         key={student._id}
//                         className={`${
//                           index % 2 === 0 ? "bg-black bg-opacity-10" : "bg-black bg-opacity-20"
//                         } hover:bg-black hover:bg-opacity-30 transition-colors`}
//                       >
//                         <td className="px-4 py-2 text-sm font-medium">{student.admissionNumber}</td>
//                         <td className="px-4 py-2 text-sm">{student.name}</td>
//                         <td className="px-4 py-2 text-sm">{student.class}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="p-8 text-center">
//           <User className="h-12 w-12 mx-auto mb-3 text-gray-400" />
//           <h3 className="text-xl font-semibold mb-2">No Students Assigned</h3>
//           <p className="text-gray-300">This team doesn't have any students yet.</p>
//         </div>
//       )}

//       {team.students.length > 0 && (
//         <div className="bg-black bg-opacity-30 p-4">
//           <div className="flex flex-wrap gap-3">
//             {sortedSections.map((section) => (
//               <div key={section} className="bg-white bg-opacity-10 px-3 py-1 rounded-lg text-sm">
//                 {section}: {studentsBySection[section].length} students
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default PublicCalledScreen