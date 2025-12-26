import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // This is the https://ai-lms-project.onrender.com/api you set earlier
});

export default API;