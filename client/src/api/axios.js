import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // This is the http://localhost:5000/api you set earlier
});

export default API;