import api from './axios';

export const tmdbApi = {
    getTrending: () => api.get('/tmdb/trending'),
    getPopular: (page = 1) => api.get(`/tmdb/popular?page=${page}`),
    getTopRated: (page = 1) => api.get(`/tmdb/toprated?page=${page}`),
    getTvShows: (page = 1) => api.get(`/tmdb/tvshows?page=${page}`),
    getUpcoming: () => api.get('/tmdb/upcoming'),
    getNowPlaying: () => api.get('/tmdb/nowplaying'),
    getGenres: () => api.get('/tmdb/genres'),
    search: (query, page = 1) => api.get(`/tmdb/search?q=${query}&page=${page}`),
    getMovie: (id) => api.get(`/tmdb/movie/${id}`),
    getTvShow: (id) => api.get(`/tmdb/tv/${id}`),
    getPerson: (id) => api.get(`/tmdb/person/${id}`),
    discover: (genreId, page = 1) => api.get(`/tmdb/discover?genre=${genreId}&page=${page}`),
};
