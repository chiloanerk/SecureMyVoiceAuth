const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Report description is required'],
    },
    category: {
        type: String,
        enum: ['Safety', 'Incident', 'Maintenance', 'Hazard', 'Crime', 'Complaint'],
        required: [true, 'Report category is required'],
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