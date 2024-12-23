const User = require("../Models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({status: false, message: 'Unauthorized. No token provided.'});
    }

    const token = authHeader.split(" ")[1];
    console.log('Token:', token);

    try {
        const data = jwt.verify(token, process.env.TOKEN_KEY)
        console.log('Decoded token data:', data);
        const user = await User.findById(data.id)

        if (!user) {
            return res.status(404).json({status: false, message: 'User not found.'});
        }

        req.user = user;
        next();
    } catch
        (err) {
        console.error(err);
        return res.status(401).json({status: false, message: 'Invalid or expired token.'});
    }
}