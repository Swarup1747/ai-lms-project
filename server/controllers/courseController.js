const Course = require('../models/Course');

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { title, description, price, thumbnail, educatorId } = req.body;

        const newCourse = new Course({
            title,
            description,
            price,
            thumbnail,
            educatorId // For now, we will pass this manually until we link Clerk
        });

        await newCourse.save();
        res.status(201).json({ success: true, course: newCourse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all courses (for the homepage)
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('educatorId', 'name');
        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};