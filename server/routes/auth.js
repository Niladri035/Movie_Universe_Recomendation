const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dbCheck = require('../middleware/dbCheck');

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Apply DB check to all auth routes
router.use(dbCheck);

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        const user = new User({ name, email, password });
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        if (user.isBanned) return res.status(403).json({ message: 'Account banned' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = generateToken(user._id);
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
