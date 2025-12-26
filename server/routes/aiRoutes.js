const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { YoutubeTranscript } = require('youtube-transcript');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/process', async (req, res) => {
    try {
        const { type, content, videoUrl, question, courseTitle } = req.body;
        
        // Use the model that works for you (gemini-1.5-flash or gemini-pro)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 1. Get Context (Video Transcript OR Text Description)
        let aiContext = content || "";

        if (videoUrl && (type === 'summarize' || type === 'quiz' || type === 'chat')) {
            try {
                const transcriptItems = await YoutubeTranscript.fetchTranscript(videoUrl);
                const transcriptText = transcriptItems.map(item => item.text).join(' ');
                if (transcriptText.length > 0) {
                    aiContext = `TRANSCRIPT OF VIDEO LESSON:\n${transcriptText}`;
                }
            } catch (err) {
                console.log("Transcript unavailable, using description.");
            }
        }

        // 2. Generate Prompt based on Type
        let prompt = "";

        if (type === 'summarize') {
            prompt = `Summarize this lesson (${courseTitle}) using this content:\n\n${aiContext}`;
        } 
        else if (type === 'quiz') {
            prompt = `Create one multiple-choice question relevant to this lesson. 
            Return ONLY raw JSON. No markdown.
            Format: { "question": "...", "options": ["A","B","C","D"], "answer": "The correct option string" }
            Content: ${aiContext}`;
        } 
        else if (type === 'chat') {
            // UPDATED: More flexible prompt
            prompt = `You are an expert tutor for the course "${courseTitle}".
            
            Current Lesson Context:
            "${aiContext}"
            
            Student Question: "${question}"
            
            Instructions:
            1. If the question is about the current lesson, use the context to answer accurately.
            2. If the question is NOT in the text but is related to the general topic of "${courseTitle}", answer it using your general knowledge.
            3. Be helpful, encouraging, and concise.`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ result: text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI failed to process request." });
    }
});

module.exports = router;