const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    title: { type: String, required: true },
    poster: { type: String, default: '' },
    backdrop: { type: String, default: '' },
    overview: { type: String, default: '' },
    voteAverage: { type: Number, default: 0 },
    releaseDate: { type: String, default: '' },
    watchedAt: { type: Date, default: Date.now },
}, { timestamps: true });

watchHistorySchema.index({ userId: 1, tmdbId: 1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
