import api from './axios';

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    getMe: () => api.get('/auth/me'),
};
