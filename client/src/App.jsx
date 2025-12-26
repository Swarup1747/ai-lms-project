import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import Footer
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import './index.css'; // Ensure global CSS is loaded

// Pages
import Home from './pages/student/Home'; // Updated Home path
import Dashboard from './pages/educator/Dashboard';
import CreateCourse from './pages/educator/CreateCourse';
import EditCourse from './pages/educator/EditCourse';
import CoursePlayer from './pages/student/CoursePlayer';
import Onboarding from './pages/Onboarding';
import CourseDetails from './pages/student/CourseDetails';
import MyCourses from './pages/student/MyCourses';
import PaymentSuccess from './pages/student/PaymentSuccess';

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setRoleLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/users/${user.id}`)
      .then(res => {
        if (!res.data.role) {
          navigate('/onboarding');
        } else {
          setUserRole(res.data.role);
        }
      })
      .catch(err => console.error("Error checking role:", err))
      .finally(() => setRoleLoading(false));

  }, [isLoaded, isSignedIn, user, navigate]);

  if (roleLoading) {
    return <div style={{textAlign:'center', marginTop:'50px'}}>Loading account...</div>;
  }

  return (
    // 1. The Outer Wrapper (Flex Column, Min-Height 100vh)
    <div className="app-container">
      
      <Navbar role={userRole} /> 
      
      {/* 2. The Content Wrapper (Flex: 1) - Pushes Footer down */}
      <div className="main-content">
        <Routes>
          {/* Public / Student Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/course-details/:courseId" element={<CourseDetails />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/course/:courseId" element={<CoursePlayer />} />

          {/* Educator Routes */}
          {userRole === 'educator' && (
             <>
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/create-course" element={<CreateCourse />} />
               <Route path="/edit-course/:courseId" element={<EditCourse />} />
             </>
          )}
        </Routes>
      </div>

      {/* 3. The Footer (Stays at bottom because main-content expands) */}
      <Footer />
      
    </div>
  );
}

export default App;