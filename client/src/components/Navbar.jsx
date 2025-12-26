import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function Navbar({ role }) {
    return (
        <nav style={styles.nav}>
            {/* 1. LOGO (Always Visible) */}
            <div style={styles.logo}>
                <Link to="/" style={styles.link}>🎓 AI-LMS</Link>
            </div>

            <div style={styles.menu}>
                {/* Inside the menu div */}

                {/* Student Link (Show if student OR generic) */}
                {(role === 'student' || !role) && (
                    <Link to="/my-courses" style={styles.link}>My Courses</Link>
                )}
                {/* 2. EDUCATOR LINKS (Only if role is 'educator') */}
                {role === 'educator' && (
                    <>
                        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                        <Link to="/create-course" style={styles.link}>Create Course</Link>
                    </>
                )}

                {/* 3. STUDENT LINKS (Optional - you can add 'My Learning' later) */}
                {/* <Link to="/my-learning" style={styles.link}>My Learning</Link> */}

                {/* 4. AUTH BUTTONS (Clerk) */}

                {/* If NOT signed in, show "Sign In" */}
                <SignedOut>
                    <div style={styles.authBtn}>
                        <SignInButton mode="modal" />
                    </div>
                </SignedOut>

                {/* If SIGNED IN, show User Avatar */}
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 30px',
        backgroundColor: '#333',
        color: 'white',
        alignItems: 'center'
    },
    logo: { fontSize: '20px', fontWeight: 'bold' },
    menu: { display: 'flex', gap: '20px', alignItems: 'center' },
    link: { color: 'white', textDecoration: 'none', fontSize: '16px' },
    authBtn: { backgroundColor: 'white', color: '#333', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Navbar;