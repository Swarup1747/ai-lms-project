const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1. SAVE or UPDATE User Role
router.post('/role', async (req, res) => {
    try {
        const { clerkId, email, role } = req.body;
        
        // Find user and update, or create if doesn't exist (upsert)
        const user = await User.findOneAndUpdate(
            { clerkId },
            { clerkId, email, role },
            { new: true, upsert: true } // Create if new
        );
        
        res.json({ message: "Role Saved", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. GET User Role
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.id });
        if (!user) return res.json({ role: null }); // No role found (New User)
        res.json({ role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const Course = require('../models/Course'); // Import Course model

// ... existing code ...

// 3. ENROLL in a Course
router.post('/enroll', async (req, res) => {
    try {
        const { clerkId, courseId } = req.body;
        
        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if already enrolled
        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ error: "Already enrolled" });
        }
        if (user) {
            await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
        }
        user.enrolledCourses.push(courseId);
        await user.save();
        
        res.json({ message: "Enrolled successfully!", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. GET User's Enrolled Courses
router.get('/:id/enrolled', async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.id }).populate('enrolledCourses');
        if (!user) return res.status(404).json({ error: "User not found" });
        
        res.json({ courses: user.enrolledCourses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;