require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        req.user = jwt.verify(token, secret);

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}