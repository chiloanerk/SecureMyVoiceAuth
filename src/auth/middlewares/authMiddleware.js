require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({status: false, message: 'Unauthorized. No token provided.'});
    }

    try {
        const secret = process.env.JWT_SECRET
        const data = jwt.verify(token, secret)
        const user = await User.findById(data.id)

        if (!user) {
            return res.status(404).json({status: false, message: 'User not found.'});
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({status: false, message: 'Invalid or expired token.'});
    }
}