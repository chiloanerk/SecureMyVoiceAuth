require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateAccessToken(user_id, sessionId) {
    return jwt.sign({id: user_id, sessionId: sessionId}, process.env.JWT_SECRET, {
        expiresIn: '5m',
    })
}
function generateRefreshToken(user_id, uniqueId = null) {
    const payload = { id: user_id };
    if (uniqueId) {
        payload.uuid = uniqueId; // Add a unique identifier for testing
    }
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};