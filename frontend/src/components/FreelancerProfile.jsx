import { div } from 'framer-motion/client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const FreelancerProfile = () => {
    const Navigate = useNavigate();
    const { id } = useParams();
    const [freelancer, setFreelancer] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/freelancer/${id}`)
            .then(res => res.json())
            .then(data => {
                setFreelancer(data.freelancer);
                setUser(data.user);
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!freelancer || !user) {
        return <div>loading...</div>
    }

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
           Work In Progress...
        </div>
    );
};

export default FreelancerProfile;
