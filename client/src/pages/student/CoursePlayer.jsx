import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CoursePlayer() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // AI & Tabs
    const [activeTab, setActiveTab] = useState('lessons');
    const [aiMode, setAiMode] = useState('summary');
    const [aiResponse, setAiResponse] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [userQuestion, setUserQuestion] = useState("");
    
    // Quiz State
    const [quizData, setQuizData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`https://ai-lms-project.onrender.com/api/courses/${courseId}`);
                const fetchedCourse = res.data.course;
                setCourse(fetchedCourse);
                if (fetchedCourse.lessons && fetchedCourse.lessons.length > 0) {
                    setCurrentLesson(fetchedCourse.lessons[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load course.");
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    useEffect(() => {
        setAiResponse("");
        setQuizData(null);
        setSelectedOption(null);
        setIsCorrect(null);
        setUserQuestion("");
    }, [currentLesson]);

    const getEmbedUrl = (url) => {
        if (!url) return "";
        if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
        if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
        return url;
    };

    const handleAI = async (type) => {
        setAiLoading(true);
        setAiResponse("");
        setQuizData(null);
        setSelectedOption(null);
        setIsCorrect(null);

        try {
            const res = await axios.post('https://ai-lms-project.onrender.com/api/ai/process', {
                type: type,
                content: currentLesson?.content || "",
                videoUrl: currentLesson?.videoUrl,
                courseTitle: course.title,
                question: userQuestion
            });

            const resultText = res.data.result;

            if (type === 'quiz') {
                const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
                setQuizData(JSON.parse(cleanJson));
            } else {
                setAiResponse(resultText);
            }
        } catch (error) {
            console.error(error);
            setAiResponse("AI Service is temporarily unavailable.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleQuizOptionClick = (option) => {
        if (selectedOption) return; 
        setSelectedOption(option);
        setIsCorrect(option === quizData.answer);
    };

    if (loading) return <div className="hero"><h2>Loading Player...</h2></div>;
    if (error) return <div className="hero"><h2>{error}</h2></div>;

    return (
        <div className="player-container">
            {/* LEFT: Video Player */}
            <div className="player-main">
                {currentLesson ? (
                    <div>
                        <div className="video-wrapper">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={getEmbedUrl(currentLesson.videoUrl)} 
                                title="Video" 
                                frameBorder="0" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h2 className="lesson-title">{currentLesson.title}</h2>
                        <p className="lesson-desc">{currentLesson.content}</p>
                    </div>
                ) : <div className="hero"><h3>No lessons available.</h3></div>}
            </div>

            {/* RIGHT: Sidebar */}
            <div className="player-sidebar">
                <div className="tab-header">
                    <button 
                        className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('lessons')}
                    >
                        📚 Lessons
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('ai')}
                    >
                        🤖 AI Tutor
                    </button>
                </div>

                <div className="sidebar-scroll-area">
                    {/* LESSONS LIST */}
                    {activeTab === 'lessons' && (
                        <div>
                            {course.lessons.map((lesson, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => setCurrentLesson(lesson)} 
                                    className={`lesson-item ${currentLesson === lesson ? 'active' : ''}`}
                                >
                                    <span className="lesson-number">{index + 1}</span>
                                    <span style={{fontWeight: '600', color: 'var(--text-main)'}}>{lesson.title}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* AI INTERFACE */}
                    {activeTab === 'ai' && (
                        <div>
                            {/* Mode Selectors */}
                            <div className="ai-mode-selector">
                                {['summary', 'quiz', 'chat'].map(mode => (
                                    <button 
                                        key={mode} 
                                        onClick={() => setAiMode(mode)} 
                                        className={`ai-mode-btn ${aiMode === mode ? 'active' : ''}`}
                                    >
                                        {mode.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            {/* Summary View */}
                            {aiMode === 'summary' && (
                                <button className="btn-primary" style={{width: '100%'}} onClick={() => handleAI('summarize')} disabled={aiLoading}>
                                    {aiLoading ? 'Generating...' : '📝 Generate Summary'}
                                </button>
                            )}

                            {/* Quiz View */}
                            {aiMode === 'quiz' && (
                                <>
                                    {!quizData && (
                                        <button className="btn-primary" style={{width: '100%'}} onClick={() => handleAI('quiz')} disabled={aiLoading}>
                                            {aiLoading ? 'Creating Quiz...' : '❓ Generate Question'}
                                        </button>
                                    )}
                                    {quizData && (
                                        <div className="ai-result-box" style={{background: 'white'}}>
                                            <p style={{fontWeight:'700', marginBottom:'1rem'}}>{quizData.question}</p>
                                            {quizData.options.map((opt, idx) => {
                                                let optionClass = "quiz-option";
                                                if (selectedOption) {
                                                    if (opt === quizData.answer) optionClass += " correct";
                                                    else if (opt === selectedOption) optionClass += " wrong";
                                                }
                                                return (
                                                    <div key={idx} onClick={() => handleQuizOptionClick(opt)} className={optionClass}>
                                                        {opt}
                                                    </div>
                                                );
                                            })}
                                            {selectedOption && (
                                                <button onClick={() => setQuizData(null)} style={{marginTop:'10px', textDecoration:'underline', background:'none', border:'none', cursor:'pointer', color:'#666'}}>
                                                    Try Another Question
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Chat View */}
                            {aiMode === 'chat' && (
                                <>
                                    <textarea 
                                        className="ai-textarea"
                                        value={userQuestion}
                                        onChange={(e) => setUserQuestion(e.target.value)}
                                        placeholder={`Ask anything about "${course?.title}"...`}
                                        rows="3"
                                    />
                                    <button className="btn-primary" style={{width: '100%'}} onClick={() => handleAI('chat')} disabled={aiLoading}>
                                        {aiLoading ? 'Thinking...' : '💬 Ask AI'}
                                    </button>
                                </>
                            )}

                            {/* AI Text Output */}
                            {aiResponse && aiMode !== 'quiz' && (
                                <div className="ai-result-box">
                                    <strong>AI Response:</strong>
                                    <p style={{marginTop: '10px'}}>{aiResponse}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CoursePlayer;