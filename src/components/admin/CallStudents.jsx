import React, { useEffect, useState } from 'react';
import TeamAssignmentForm from '../ui/TeamAssignmentForm';
import axiosInstance from '../../services/api/axiosInstance';

function CallStudents() {
  const [teams, setTeams] = useState([])

  const fetchTeams = async () => {
    try {
      const res = await axiosInstance.get("/teams")
      setTeams(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchTeams() }, [])


  return (
    <div className="row grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {teams.map((team) => (
        <TeamAssignmentForm
          key={team.id}
          teamId={team._id}
          teamName={team.name}
          color={team.color}
        />
      ))}
    </div>
  );
}

export default CallStudents;
