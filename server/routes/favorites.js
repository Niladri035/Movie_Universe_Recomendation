const express = require('express');
const Favorite = require('../models/Favorite');
const verifyToken = require('../middleware/auth');
const dbCheck = require('../middleware/dbCheck');

const router = express.Router();

// Apply DB check to all favorites routes
router.use(dbCheck);

// GET /api/favorites
router.get('/', verifyToken, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/favorites
router.post('/', verifyToken, async (req, res) => {
    try {
        const { tmdbId, mediaType, title, poster, backdrop, overview, voteAverage, releaseDate, genres } = req.body;
        const existing = await Favorite.findOne({ userId: req.user._id, tmdbId });
        if (existing) return res.status(409).json({ message: 'Already in favorites' });
        const fav = new Favorite({ userId: req.user._id, tmdbId, mediaType, title, poster, backdrop, overview, voteAverage, releaseDate, genres });
        await fav.save();
        res.status(201).json(fav);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/favorites/:tmdbId
router.delete('/:tmdbId', verifyToken, async (req, res) => {
    try {
        await Favorite.findOneAndDelete({ userId: req.user._id, tmdbId: Number(req.params.tmdbId) });
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
