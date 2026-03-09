import api from './axios';

export const historyApi = {
    getHistory: () => api.get('/history'),
    addToHistory: (movieData) => api.post('/history', movieData),
    removeFromHistory: (tmdbId) => api.delete(`/history/${tmdbId}`),
    clearHistory: () => api.delete('/history'),
};
