import api from './axios';

export const favoritesApi = {
    getFavorites: () => api.get('/favorites'),
    addFavorite: (movieData) => api.post('/favorites', movieData),
    removeFavorite: (id) => api.delete(`/favorites/${id}`),
};

export const historyApi = {
    getHistory: () => api.get('/history'),
    addToHistory: (movieData) => api.post('/history', movieData),
    clearHistory: () => api.delete('/history'),
};
