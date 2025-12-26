import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    
    // Stats State
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalEarnings: 0
    });

    useEffect(() => {
        if (user) {
            fetchEducatorCourses();
        }
    }, [user]);

    const fetchEducatorCourses = async () => {
        try {
            const res = await axios.get(`https://ai-lms-project.onrender.com/api/courses/educator/${user.id}`);
            
            // SAFETY CHECK: Handle different response formats
            const fetchedCourses = res.data.courses || [];
            setCourses(fetchedCourses);

            // Calculate Stats
            let students = 0;
            let earnings = 0;

            fetchedCourses.forEach(course => {
                const count = course.enrolledCount || 0;
                students += count;
                earnings += (course.price * count);
            });

            setStats({ totalStudents: students, totalEarnings: earnings });

        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                <h1 className="text-gradient" style={{fontSize: '2.5rem'}}>Educator Dashboard</h1>
                <button className="btn-primary" onClick={() => navigate('/create-course')}>
                    + Create New Course
                </button>
            </div>

            {/* STATS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={styles.statCard}>
                    <h3>Total Courses</h3>
                    <p style={{fontSize:'1.5rem', fontWeight:'bold'}}>{courses.length}</p>
                </div>
                <div style={styles.statCard}>
                    <h3>Total Students</h3>
                    <p style={{fontSize:'1.5rem', fontWeight:'bold'}}>{stats.totalStudents}</p>
                </div>
                <div style={styles.statCard}>
                    <h3>Total Earnings</h3>
                    <p style={{color: '#10b981', fontSize:'1.5rem', fontWeight:'bold'}}>${stats.totalEarnings.toLocaleString()}</p>
                </div>
            </div>

            {/* COURSE LIST */}
            <h2 style={{marginBottom: '20px'}}>Your Courses</h2>
            <div className="card-grid" style={{padding: 0}}> 
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div key={course._id} className="course-card">
                            <div className="card-image" style={{height: '150px', fontSize: '3rem'}}>
                                📚
                            </div>
                            <div className="card-body">
                                <h4 style={{fontSize: '1.2rem', marginBottom: '10px'}}>{course.title}</h4>
                                <p style={{color: '#64748b', fontSize: '0.9rem'}}>
                                    Price: <strong>${course.price}</strong> <br/>
                                    Enrolled: <strong>{course.enrolledCount || 0}</strong>
                                </p>
                                <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                                    <button 
                                        className="btn" 
                                        style={{background: '#e2e8f0', color: '#333', flex: 1}}
                                        onClick={() => navigate(`/edit-course/${course._id}`)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You haven't created any courses yet.</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    statCard: {
        background: 'white',
        padding: '25px',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        textAlign: 'center',
        border: '1px solid #f1f5f9'
    }
};

export default Dashboard;