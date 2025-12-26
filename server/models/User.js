const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['student', 'educator'], default: 'student' },
    // NEW: Store IDs of enrolled courses
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], 
    joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);