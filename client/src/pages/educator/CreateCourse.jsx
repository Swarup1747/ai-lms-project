import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react"; 

function CreateCourse() {
    const navigate = useNavigate();
    const { user } = useUser(); 
    
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Development',
    });

    const handleChange = (e) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert("Please sign in to create a course.");
            return;
        }

        try {
            const response = await axios.post('https://ai-lms-project.onrender.com/api/courses/create', {
                ...courseData,
                educatorId: user.id, // Sends the correct ID
                lessons: [] 
            });

            if (response.status === 201) {
                alert("✅ Course Published Successfully!");
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Detailed Error:", error);
            const serverMessage = error.response?.data?.error || error.message;
            alert(`❌ Failed to publish: ${serverMessage}`);
        }
    };

    return (
        <div style={styles.container}>
            <h2 className="text-gradient" style={{textAlign:'center', marginBottom:'20px'}}>Create New Course</h2>
            <form onSubmit={handlePublish} style={styles.form}>
                
                <div style={styles.inputGroup}>
                    <label>Course Title</label>
                    <input 
                        type="text" name="title" 
                        value={courseData.title} onChange={handleChange} 
                        placeholder="e.g. Advanced React Patterns" 
                        required style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Description</label>
                    <textarea 
                        name="description" 
                        value={courseData.description} onChange={handleChange} 
                        placeholder="What will students learn?" 
                        required style={styles.textarea}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Price ($)</label>
                    <input 
                        type="number" name="price" 
                        value={courseData.price} onChange={handleChange} 
                        placeholder="e.g. 49" 
                        required style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Category</label>
                    <select name="category" value={courseData.category} onChange={handleChange} style={styles.input}>
                        <option value="Development">Development</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                    </select>
                </div>

                <button type="submit" className="btn-primary" style={{marginTop:'20px'}}>
                    🚀 Publish Course
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: { maxWidth: '700px', margin: '3rem auto', padding: '3rem', background: 'white', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '600' },
    input: { padding: '15px', fontSize: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' },
    textarea: { padding: '15px', fontSize: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '120px', background: '#f8fafc' },
};

export default CreateCourse;