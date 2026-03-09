const express = require('express');
const User = require('../models/User');
const CustomMovie = require('../models/CustomMovie');
const isAdmin = require('../middleware/admin');

const router = express.Router();

// GET /api/admin/users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/admin/users/:id/ban
router.patch('/users/:id/ban', isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/admin/users/:id/unban
router.patch('/users/:id/unban', isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/movies
router.get('/movies', isAdmin, async (req, res) => {
    try {
        const movies = await CustomMovie.find({}).sort({ createdAt: -1 });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/movies
router.post('/movies', isAdmin, async (req, res) => {
    try {
        const movie = new CustomMovie({ ...req.body, addedBy: req.user._id });
        await movie.save();
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/admin/movies/:id
router.put('/movies/:id', isAdmin, async (req, res) => {
    try {
        const movie = await CustomMovie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/movies/:id
router.delete('/movies/:id', isAdmin, async (req, res) => {
    try {
        await CustomMovie.findByIdAndDelete(req.params.id);
        res.json({ message: 'Movie deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
