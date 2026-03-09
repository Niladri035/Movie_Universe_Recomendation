const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    title: { type: String, required: true },
    poster: { type: String, default: '' },
    backdrop: { type: String, default: '' },
    overview: { type: String, default: '' },
    voteAverage: { type: Number, default: 0 },
    releaseDate: { type: String, default: '' },
    genres: [{ type: String }],
}, { timestamps: true });

favoriteSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
