import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get('http://localhost:5000/api/courses/all')
            .then(res => setCourses(res.data.courses))
            .catch(err => console.error(err));
    }, []);

    const filteredCourses = courses.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* New Modern Hero Section */}
            <div className="hero">
                <h1>
                    Master New Skills <br />
                    <span className="text-gradient">With AI-LMS</span>
                </h1>
                <p>Unlock your potential with courses taught by industry experts.</p>
                
                <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '600px' }}>
                    <input 
                        type="text" 
                        placeholder="Search for Python, React, Design..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Course Grid */}
            <div className="card-grid">
                {filteredCourses.map(course => (
                    <div key={course._id} className="course-card" onClick={() => navigate(`/course-details/${course._id}`)}>
                        <div className="card-image">
                            {/* You can replace this with a real <img> tag later */}
                            <span>🎓</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">{course.title}</h3>
                            <p style={{color: '#64748b', fontSize: '0.9rem'}}>{course.category}</p>
                            
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px'}}>
                                <span className="card-price">${course.price}</span>
                                <button className="btn-primary" style={{padding: '8px 20px', fontSize: '0.85rem'}}>
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;