import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const courseId = searchParams.get("courseId");
    const userId = searchParams.get("userId"); // Clerk ID

    useEffect(() => {
        const enrollStudent = async () => {
            if (courseId && userId) {
                try {
                    // Call the enrollment API we built earlier
                    await axios.post('http://localhost:5000/api/users/enroll', {
                        clerkId: userId,
                        courseId: courseId
                    });
                    
                    // Wait a moment then redirect
                    setTimeout(() => navigate('/my-courses'), 2000);
                } catch (error) {
                    console.error("Enrollment failed:", error);
                }
            }
        };

        enrollStudent();
    }, [courseId, userId, navigate]);

    return (
        <div style={{textAlign: 'center', marginTop: '100px'}}>
            <h1 style={{color: 'green', fontSize: '50px'}}>✅</h1>
            <h2>Payment Successful!</h2>
            <p>Enrolling you in the course...</p>
        </div>
    );
}

export default PaymentSuccess;