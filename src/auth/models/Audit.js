const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    deviceInfo: {
        userAgent: { type: String, required: false },
        browser: { type: String, required: false },
        version: { type: String, required: false },
        platform: { type: String, required: false },
        device: { type: String, required: false },
    },
    sessionId: {
        type: String,
        required: true,
    },
    status: { type: String, required: true },
    loginTime: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Audit", auditSchema);