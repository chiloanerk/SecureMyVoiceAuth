const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Report description is required'],
    },
    category: {
        type: String,
    },
    evidence: {
        type: String,
    },
    contactInfo: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);