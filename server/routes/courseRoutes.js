const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); 

// 1. CREATE Course (Manual)
router.post('/create', async (req, res) => {
    try {
        const { title, description, price, category, lessons, educatorId } = req.body;

        const newCourse = new Course({
            title,
            description,
            price,
            category: category || 'General',
            educatorId: educatorId || "anonymous", 
            lessons: lessons || [] 
        });

        await newCourse.save();
        res.status(201).json({ message: "Course created!", course: newCourse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. GET All Courses
router.get('/all', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json({ courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. GET Single Course by ID
router.get('/:id', async (req, res) => {
    try {
        // Check if ID is valid MongoDB format to prevent crash
        if (req.params.id === 'educator') return res.status(400).json({ error: "Invalid ID flow" });
        
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.json({ course });
    } catch (error) {
        // If the ID is invalid format, just return 404
        res.status(404).json({ error: "Course not found or invalid ID" });
    }
});

// 4. ADD LESSON to a Course
router.post('/:id/lessons', async (req, res) => {
    try {
        const { title, description, videoUrl } = req.body;

        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });

        course.lessons.push({
            title,
            content: description, 
            videoUrl
        });

        await course.save();
        res.status(201).json({ message: "Lesson added!", course });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. GET Educator Courses (THIS WAS MISSING!)
router.get('/educator/:educatorId', async (req, res) => {
    try {
        const { educatorId } = req.params;
        const courses = await Course.find({ educatorId: educatorId });
        res.json({ courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;