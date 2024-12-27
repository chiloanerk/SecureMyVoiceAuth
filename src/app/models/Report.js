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
    unique_link: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);