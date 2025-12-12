import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/v1',
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('google_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
