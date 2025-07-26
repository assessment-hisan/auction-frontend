import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import axios from "axios";
import axiosInstance from "../../services/api/axiosInstance";

const TeamAssignmentForm = ({ teamId, teamName, color }) => {
    const students = useStore((state) => state.students);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [status, setStatus] = useState("");

    const unassignedStudents = students.filter((s) => !s.teamId);

    const filtered = searchTerm
        ? unassignedStudents.filter(
            (s) =>
                s.admissionNumber.includes(searchTerm) ||
                s.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleAssign = async () => {
        if (!selectedStudent) return;
        console.log(teamId);


        try {
            await axiosInstance.post(`/students/call-student`, {
                teamId,
                studentId: selectedStudent._id  
            });

            setStatus(`✅ Assigned ${selectedStudent.name} to ${teamName}`);
            setSelectedStudent(null);
            setSearchTerm("");
        } catch (err) {
            console.error(err);
            setStatus("❌ Failed to assign student.");
        }
    };

    return (
        <div className="p-4 border rounded shadow-md mb-6" style={{ borderColor: color }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color }}>
                Assign to {teamName}
            </h2>
            <input
                type="text"
                placeholder="Search by name or admission number"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedStudent(null);
                }}
                className="border px-2 py-1 w-full mb-2"
            />
            {filtered.length > 0 && (
                <ul className="border max-h-40 overflow-y-auto">
                    {filtered.map((student) => (
                        <li
                            key={student._id}
                            onClick={() => {
                                setSelectedStudent(student);
                                setSearchTerm(`${student.admissionNumber} - ${student.name}`);
                            }}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-100"
                        >
                            {student.admissionNumber} - {student.name}
                        </li>
                    ))}
                </ul>
            )}

            <button
                onClick={handleAssign}
                disabled={!selectedStudent}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
                Assign Student
            </button>

            {status && <p className="text-sm mt-2">{status}</p>}
        </div>
    );
};

export default TeamAssignmentForm;
