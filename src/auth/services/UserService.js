const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
require("jsonwebtoken");
const {createAccessToken, createRefreshToken} = require("../utils/jwtUtils");

class UserService {
    async signUp({ email, password, username }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const user = await User.create({email, password, username});

        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        await RefreshToken.create({
            user: user._id,
            refreshToken
        });

        return { user, accessToken, refreshToken };
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new Error("All fields are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Incorrect email or password");
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            throw new Error("Incorrect email or password");
        }

        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        await RefreshToken.findOneAndDelete({ user: user._id});
        await RefreshToken.create({
            user: user._id,
            refreshToken
        });

        return { user, accessToken, refreshToken };
    }

    async logout(userId) {
        await RefreshToken.findOneAndDelete({ user: userId})
        return { message: "Logged out successfully" };
    }

    async refreshToken( refreshToken ) {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }

        // Find the refresh token
        const tokenRecord = await RefreshToken.findOne(refreshToken);
        if (!tokenRecord) {
            throw new Error("Invalid refresh token");
        }

        // Verify user associated with the token
        const user = await User.findById(tokenRecord.user);
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = createAccessToken(user._id);
        const newRefreshToken = createRefreshToken(user._id);

        await RefreshToken.findOneAndDelete({ user: user._id });
        await RefreshToken.create({
            user: user._id,
            refreshToken: newRefreshToken
        })

        return { accessToken, refreshToken: newRefreshToken };

    }


    async getProfile(userId) {
        console.log("User data: ", userId);
        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async updateProfile(userId, updateData) {
        if (!updateData) {
            throw new Error("Invalid update data");
        }

        const filteredData = {};
        for (let key in updateData) {
            if (updateData[key] !== "" && updateData[key] !== null) {
                filteredData[key] = updateData[key];
            }
        }

        const user = await User.findByIdAndUpdate( userId, filteredData, {
            new: true,
            runValidators: true,
        }).select("-password -__v");

        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}

module.exports = new UserService();