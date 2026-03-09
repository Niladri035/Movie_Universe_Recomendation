const express = require('express');
const axios = require('axios');

const tmdbMocks = require('../mocks/tmdbMocks');

const router = express.Router();

const tmdb = axios.create({
    baseURL: process.env.TMDB_BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    },
    timeout: 30000 // 30 seconds for unstable networks
});

// Helper for error handling with Mock Fallback
const handleError = (res, err, mockKey) => {
    const isNetworkError = !err.response || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED';
    const isAuthError = err.response?.status === 401;
    
    if ((isNetworkError || isAuthError) && mockKey && tmdbMocks[mockKey]) {
        if (isAuthError) {
            console.warn(`⚠️ Auth Error (401): Falling back to MOCK DATA [${mockKey}]. Please check your TMDB_API_KEY / TMDB_API_READ_ACCESS_TOKEN in .env`);
        } else {
            console.warn(`⚠️ Network Error: Falling back to MOCK DATA [${mockKey}]`);
        }
        
        return res.json({ 
            ...tmdbMocks[mockKey], 
            _offline: true, 
            _auth_error: isAuthError,
            _message: isAuthError 
                ? 'Invalid TMDB credentials. Displaying mock data for development.' 
                : 'Displaying mock data due to network connectivity issues.' 
        });
    }

    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || err.message || 'TMDB error';
    console.error('API Error:', message);
    res.status(status).json({ success: false, message, error: err.message });
};

// Add extra logging for debugging
tmdb.interceptors.response.use(
    response => response,
    error => {
        // Only log if it's NOT a network error we handle with fallback
        if (error.response) {
            console.error('TMDB API Error:', {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }
        return Promise.reject(error);
    }
);

// GET /api/tmdb/trending
router.get('/trending', async (req, res) => {
    try {
        const { data } = await tmdb.get('/trending/all/week');
        res.json(data);
    } catch (err) {
        handleError(res, err, 'trending');
    }
});

// GET /api/tmdb/popular
router.get('/popular', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const { data } = await tmdb.get('/movie/popular', { params: { page } });
        res.json(data);
    } catch (err) {
        handleError(res, err, 'popular');
    }
});

// GET /api/tmdb/toprated
router.get('/toprated', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const { data } = await tmdb.get('/movie/top_rated', { params: { page } });
        res.json(data);
    } catch (err) {
        handleError(res, err, 'toprated');
    }
});

// GET /api/tmdb/tvshows
router.get('/tvshows', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const { data } = await tmdb.get('/tv/popular', { params: { page } });
        res.json(data);
    } catch (err) {
        handleError(res, err, 'tvshows');
    }
});

// GET /api/tmdb/upcoming
router.get('/upcoming', async (req, res) => {
    try {
        const { data } = await tmdb.get('/movie/upcoming');
        res.json(data);
    } catch (err) {
        handleError(res, err, 'upcoming');
    }
});

// GET /api/tmdb/nowplaying
router.get('/nowplaying', async (req, res) => {
    try {
        const { data } = await tmdb.get('/movie/now_playing');
        res.json(data);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /api/tmdb/genres
router.get('/genres', async (req, res) => {
    try {
        const { data } = await tmdb.get('/genre/movie/list');
        res.json(data);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /api/tmdb/search?q=&page=
router.get('/search', async (req, res) => {
    try {
        const { q, page = 1 } = req.query;
        if (!q) return res.json({ results: [] });
        const { data } = await tmdb.get('/search/multi', { params: { query: q, page } });
        res.json(data);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /api/tmdb/movie/:id
router.get('/movie/:id', async (req, res) => {
    try {
        const { data } = await tmdb.get(`/movie/${req.params.id}`, {
            params: { append_to_response: 'credits,videos,similar,recommendations' }
        });
        res.json(data);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /api/tmdb/tv/:id
router.get('/tv/:id', async (req, res) => {
    try {
        const { data } = await tmdb.get(`/tv/${req.params.id}`, {
            params: { append_to_response: 'credits,videos,similar' }
        });
        res.json(data);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /api/tmdb/person/:id
router.get('/person/:id', async (req, res) => {
    try {
        const { data } = await tmdb.get(`/person/${req.params.id}`, {
            params: { append_to_response: 'movie_credits,tv_credits' }
        });
        res.json(data);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /api/tmdb/discover?genre=&page=
router.get('/discover', async (req, res) => {
    try {
        const { genre, page = 1 } = req.query;
        const params = { page, sort_by: 'popularity.desc' };
        if (genre) params.with_genres = genre;
        const { data } = await tmdb.get('/discover/movie', { params });
        res.json(data);
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;
