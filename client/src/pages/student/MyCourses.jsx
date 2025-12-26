import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

function MyCourses() {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (isLoaded && user) {
            axios.get(`http://localhost:5000/api/users/${user.id}/enrolled`)
                .then(res => setCourses(res.data.courses))
                .catch(err => console.error(err));
        }
    }, [isLoaded, user]);

    return (
        <div style={{maxWidth:'1200px', margin:'0 auto', padding:'30px'}}>
            <h1>My Learning</h1>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px', marginTop:'20px'}}>
                {courses.length === 0 ? <p>No courses yet. Go enroll in one!</p> : courses.map(course => (
                    <div key={course._id} style={{border:'1px solid #ddd', borderRadius:'10px', padding:'20px'}}>
                        <h3>{course.title}</h3>
                        <button 
                            onClick={() => navigate(`/course/${course._id}`)} 
                            style={{marginTop:'10px', padding:'10px', width:'100%', backgroundColor:'#007bff', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}
                        >
                            ▶ Start Learning
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyCourses;