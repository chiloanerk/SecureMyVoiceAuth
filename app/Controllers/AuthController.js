const User = require("../Models/UserModel");
const {createSecretToken} = require("../util/SecretToken");
const bcrypt = require("bcrypt");
const e = require("express");

module.exports.Signup = async (req, res, next) => {
    try {
        const {email, password, username} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create(
            {
                email,
                password,
                username
            });
        const token = createSecretToken(user._id);

        res.status(201).json({
            message: "User signed in successfully",
            success: true,
            token,
            user: { id: user._id, email: user.email, username: user.username }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.json({message: "All fields are required"})
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({message: "Incorrect password or email"})
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({message: "Incorrect password or email"})
        }

        const token = createSecretToken(user._id);

        res.status(201).json({
            message: "User logged in successfuly",
            success: true,
            token,
            user: { id: user._id, email: user.email, username: user.username }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.Profile = async (req, res) => {
    try {
        const userId = req.user.id; // Retrieved from middlewarer
        const user = await User.findById(userId).select('-password'); // Exclude the password from the response

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user); // Return user information
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};