import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('movieplatform_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for auto-logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("🌐 API ERROR:", {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
            localStorage.removeItem('movieplatform_token');
            localStorage.removeItem('movieplatform_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
