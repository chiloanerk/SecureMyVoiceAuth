require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateAccessToken(user_id, sessionId) {
    return jwt.sign({id: user_id, sessionId: sessionId}, process.env.JWT_SECRET, {
        expiresIn: '5m',
    })
}

function generateRefreshToken(user_id) {
    return jwt.sign({id: user_id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};