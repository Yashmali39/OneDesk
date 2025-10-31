import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const Department = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/client/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      })
      .catch(err => {
        console.error(err);
        setJobs([]);
      });
  }, [id]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f052c] via-[#1a0f45] to-[#2d1b69] text-white py-10 px-4">
      
      Work In Progress ...
    </div>
  );
};

export default Department;
