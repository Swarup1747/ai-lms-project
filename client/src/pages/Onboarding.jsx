import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Onboarding() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const selectRole = async (role) => {
        setIsLoading(true);
        try {
            await axios.post('http://localhost:5000/api/users/role', {
                clerkId: user.id,
                email: user.primaryEmailAddress.emailAddress,
                role: role
            });
            
            // Redirect based on role
            if (role === 'educator') navigate('/dashboard');
            else navigate('/'); // Students go to Home for now
            
        } catch (error) {
            console.error("Error saving role:", error);
            alert("Failed to save role. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>👋 Welcome, {user?.firstName}!</h2>
            <p>Tell us how you want to use AI-LMS:</p>
            
            <div style={styles.grid}>
                {/* Student Option */}
                <div style={styles.card} onClick={() => selectRole('student')}>
                    <div style={styles.icon}>🎓</div>
                    <h3>I am a Student</h3>
                    <p>I want to learn and watch courses.</p>
                </div>

                {/* Educator Option */}
                <div style={styles.card} onClick={() => selectRole('educator')}>
                    <div style={styles.icon}>🚀</div>
                    <h3>I am an Educator</h3>
                    <p>I want to create and publish courses.</p>
                </div>
            </div>
            {isLoading && <p>Saving...</p>}
        </div>
    );
}

const styles = {
    container: { textAlign: 'center', marginTop: '50px' },
    grid: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' },
    card: { border: '2px solid #ddd', borderRadius: '10px', padding: '30px', width: '200px', cursor: 'pointer', transition: '0.3s' },
    icon: { fontSize: '40px', marginBottom: '10px' }
};

export default Onboarding;