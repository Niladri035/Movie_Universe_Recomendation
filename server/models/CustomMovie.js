const mongoose = require('mongoose');

const customMovieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    poster: { type: String, default: '' },
    backdrop: { type: String, default: '' },
    description: { type: String, default: '' },
    releaseDate: { type: String, default: '' },
    genre: [{ type: String }],
    category: { type: String, default: 'movie' },
    trailerUrl: { type: String, default: '' },
    voteAverage: { type: Number, default: 0 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CustomMovie', customMovieSchema);
