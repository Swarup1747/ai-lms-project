import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EditCourse() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State for new lesson
    const [lessonData, setLessonData] = useState({
        title: '',
        description: '',
        videoUrl: ''
    });

    // 1. Fetch Course Data
    const fetchCourse = async () => {
        try {
            const res = await axios.get(`https://ai-lms-project.onrender.com/api/courses/${courseId}`);
            setCourse(res.data.course);
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => { fetchCourse(); }, [courseId]);

    // 2. Handle Input Change
    const handleChange = (e) => {
        setLessonData({ ...lessonData, [e.target.name]: e.target.value });
    };

    // 3. Submit New Lesson
    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`https://ai-lms-project.onrender.com/api/courses/${courseId}/lessons`, lessonData);
            alert("✅ Lesson Added!");
            setLessonData({ title: '', description: '', videoUrl: '' }); // Reset form
            fetchCourse(); // Refresh list
        } catch (error) {
            alert("❌ Failed to add lesson");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            <h1 style={{marginBottom: '10px'}}>Manage Course: {course.title}</h1>
            <p style={{marginBottom: '30px', color: '#666'}}>{course.description}</p>

            <div style={styles.grid}>
                
                {/* LEFT: Add Lesson Form */}
                <div style={styles.card}>
                    <h3>➕ Add New Lesson</h3>
                    <form onSubmit={handleAddLesson} style={styles.form}>
                        <input 
                            name="title" 
                            placeholder="Lesson Title" 
                            value={lessonData.title} onChange={handleChange} 
                            style={styles.input} required 
                        />
                        <input 
                            name="videoUrl" 
                            placeholder="Video URL (YouTube/MP4 link)" 
                            value={lessonData.videoUrl} onChange={handleChange} 
                            style={styles.input} required 
                        />
                        <textarea 
                            name="description" 
                            placeholder="Lesson Summary..." 
                            value={lessonData.description} onChange={handleChange} 
                            style={styles.textarea} required 
                        />
                        <button type="submit" style={styles.addBtn}>Add Lesson</button>
                    </form>
                </div>

                {/* RIGHT: Existing Lessons List */}
                <div style={styles.card}>
                    <h3>📚 Existing Lessons ({course.lessons.length})</h3>
                    {course.lessons.length === 0 ? (
                        <p style={{color: '#888'}}>No lessons yet.</p>
                    ) : (
                        <div style={styles.lessonList}>
                            {course.lessons.map((lesson, index) => (
                                <div key={index} style={styles.lessonItem}>
                                    <strong>{index + 1}. {lesson.title}</strong>
                                    <br/>
                                    <a href={lesson.videoUrl} target="_blank" rel="noreferrer" style={styles.link}>
                                        Watch Video
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '30px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
    card: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd' },
    textarea: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '80px' },
    addBtn: { padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    lessonList: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
    lessonItem: { padding: '10px', borderBottom: '1px solid #eee' },
    link: { fontSize: '12px', color: '#007bff' }
};

export default EditCourse;