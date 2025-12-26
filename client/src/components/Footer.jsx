import React from 'react';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>🎓 AI-LMS</h3>
                    <p>Empowering educators and students with next-gen learning tools.</p>
                </div>
                
                <div className="footer-section">
                    <h4>Platform</h4>
                    <a href="/">Browse Courses</a>
                    <a href="/onboarding">Teach on AI-LMS</a>
                    <a href="#">Pricing</a>
                </div>

                <div className="footer-section">
                    <h4>Support</h4>
                    <a href="#">Help Center</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Privacy Policy</a>
                </div>

                <div className="footer-section">
                    <h4>Connect</h4>
                    <div className="social-links">
                        <span>🐦 Twitter</span>
                        <span>📷 Instagram</span>
                        <span>💼 LinkedIn</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} AI-LMS Inc. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;