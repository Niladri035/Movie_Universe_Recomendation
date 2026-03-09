const express = require('express');
const WatchHistory = require('../models/WatchHistory');
const verifyToken = require('../middleware/auth');
const dbCheck = require('../middleware/dbCheck');

const router = express.Router();

// Apply DB check to all history routes
router.use(dbCheck);

// GET /api/history
router.get('/', verifyToken, async (req, res) => {
    try {
        const history = await WatchHistory.find({ userId: req.user._id })
            .sort({ watchedAt: -1 })
            .limit(50);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/history
router.post('/', verifyToken, async (req, res) => {
    try {
        const { tmdbId, mediaType, title, poster, backdrop, overview, voteAverage, releaseDate } = req.body;
        // Update existing or create new
        const entry = await WatchHistory.findOneAndUpdate(
            { userId: req.user._id, tmdbId },
            { userId: req.user._id, tmdbId, mediaType, title, poster, backdrop, overview, voteAverage, releaseDate, watchedAt: new Date() },
            { upsert: true, new: true }
        );
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/history/:tmdbId
router.delete('/:tmdbId', verifyToken, async (req, res) => {
    try {
        await WatchHistory.findOneAndDelete({ userId: req.user._id, tmdbId: Number(req.params.tmdbId) });
        res.json({ message: 'Removed from history' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/history - clear all
router.delete('/', verifyToken, async (req, res) => {
    try {
        await WatchHistory.deleteMany({ userId: req.user._id });
        res.json({ message: 'History cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
