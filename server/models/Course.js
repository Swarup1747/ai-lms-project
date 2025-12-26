const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String }, // This can be text or a video URL
    videoUrl: { type: String },
    freePreview: { type: Boolean, default: false }
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    thumbnail: { type: String },
    educatorId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    enrolledCount: { type: Number, default: 0 },
    lessons: [lessonSchema], // Nested lessons inside the course
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);