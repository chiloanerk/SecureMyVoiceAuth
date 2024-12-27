const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true  // Ensure the token is unique
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d'  // Set expiry for refresh tokens (optional)
    }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
