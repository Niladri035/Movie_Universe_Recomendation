import api from './axios';

export const favoritesApi = {
    getFavorites: () => api.get('/favorites'),
    addFavorite: (movieData) => api.post('/favorites', movieData),
    removeFavorite: (tmdbId) => api.delete(`/favorites/${tmdbId}`),
};
