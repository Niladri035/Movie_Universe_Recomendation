const mongoose = require('mongoose');

const dbCheck = (req, res, next) => {
    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    const state = mongoose.connection.readyState;

    if (state !== 1) {
        return res.status(503).json({
            message: 'Database connection is not established. Please check IP whitelisting in MongoDB Atlas.',
            status: 'Offline',
            tip: 'This usually means the server cannot reach MongoDB Atlas. Ensure 0.0.0.0/0 is whitelisted for testing.'
        });
    }

    next();
};

module.exports = dbCheck;
