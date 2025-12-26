import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

function CourseDetails() {
    const { courseId } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/courses/${courseId}`)
            .then(res => setCourse(res.data.course))
            .catch(err => console.error(err));
    }, [courseId]);

    const handleEnroll = async () => {
        if (!user) return alert("Please sign in to enroll.");

        // Check if already enrolled (Optional optimization: check local list or fetch from API)
        // For now, we proceed to payment.

        try {
            const response = await axios.post('http://localhost:5000/api/payment/create-checkout-session', {
                courseName: course.title,
                coursePrice: course.price,
                courseId: course._id,
                userId: user.id,
                userName: user.fullName
            });

            // Redirect to Stripe Checkout Page
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        }  catch (error) {
            console.error("Payment Error:", error);
            
            // Get the specific message from the server (if available)
            const serverMessage = error.response?.data?.error || error.message;
            
            alert(`❌ Payment Failed: ${serverMessage}`);
        }
    };

    if (!course) return <div>Loading details...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>{course.title}</h1>
                <p style={styles.category}>Category: {course.category}</p>
            </div>

            <div style={styles.content}>
                <div style={styles.main}>
                    <h3>About this Course</h3>
                    <p style={styles.desc}>{course.description}</p>
                    <h3>What you'll learn</h3>
                    <ul>
                        {course.lessons.map((l, i) => <li key={i}>{l.title}</li>)}
                    </ul>
                </div>

                <div style={styles.sidebar}>
                    <div style={styles.priceCard}>
                        <h2>${course.price}</h2>
                        <button onClick={handleEnroll} style={styles.enrollBtn}>
                            Enroll Now
                        </button>
                        <p style={{fontSize:'12px', marginTop:'10px', color:'#666'}}>Full Lifetime Access</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '40px' },
    header: { marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
    category: { color: '#007bff', fontWeight: 'bold' },
    content: { display: 'flex', gap: '40px' },
    main: { flex: 2 },
    desc: { lineHeight: '1.6', color: '#444', marginBottom: '30px' },
    sidebar: { flex: 1 },
    priceCard: { padding: '20px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center' },
    enrollBtn: { width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', marginTop: '15px' }
};

export default CourseDetails;