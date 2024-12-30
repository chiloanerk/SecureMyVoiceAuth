const UserModel = require("../models/UserModel");
const LoginHistoryModel = require("../models/LoginHistoryModel");
const RefreshTokenModel = require("../models/RefreshTokenModel");
const bcrypt = require("bcryptjs");
require("jsonwebtoken");
const {generateAccessToken, generateRefreshToken} = require("../utils/JwtHelper");
require("user-agent");
const { v4: uuidv4 } = require('uuid');
const {mapDeviceInfo} = require("../utils/DeviceInfo");

class AuthService {
    async registerUser({ email, password, username, ipAddress, deviceDetails }) {
        const isExistingUser = await UserModel.findOne({ email });
        if (isExistingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({email, password: hashedPassword, username});

        const sessionId = uuidv4();
        await LoginHistoryModel.create({
            userId: user._id,
            ipAddress,
            deviceDetails: mapDeviceInfo(deviceDetails),
            status: 'success',  // Assuming login is successful
            loginTime: new Date(),
            sessionId: sessionId,
            isRevoked: false,
        });

        user.save();

        const accessToken = generateAccessToken(user._id, sessionId);
        const refreshToken = generateRefreshToken(user._id);

        await this.manageRefreshTokens(user._id, sessionId, refreshToken);

        return { user, accessToken, refreshToken, sessionId };
    }

    async authenticateUser({ email, password, ipAddress, deviceDetails }) {
        if (!email || !password) throw new Error("All fields are required");

        const user = await UserModel.findOne({ email });
        if (!user ) throw new Error("Incorrect email or password");

        const isPassValid = await bcrypt.compare(password, user.password)
        if (!isPassValid) throw new Error("Incorrect email or password");

        const sessionId = uuidv4();
        await LoginHistoryModel.create({
            userId: user._id,
            ipAddress: ipAddress,
            deviceDetails: mapDeviceInfo(deviceDetails),
            status: 'success',
            loginTime: new Date(),
            sessionId: sessionId,
            isRevoked: false,
        });

        const accessToken = generateAccessToken(user._id, sessionId);
        const refreshToken = generateRefreshToken(user._id);

        await this.manageRefreshTokens(user._id, sessionId, refreshToken);

        return { user, accessToken, refreshToken, sessionId };
    }

    async refreshAccessToken(refreshToken, sessionId ) {
        if (!refreshToken) throw new Error("Refresh token is required");

        const tokenRecord = await RefreshTokenModel.findOne({ refreshToken} );
        if (!tokenRecord || tokenRecord.isRevoked) throw new Error("Invalid refresh token");

        const session = await LoginHistoryModel.findOne({ sessionId });
        if (!session) throw new Error("Session not found");

        const user = await UserModel.findById(tokenRecord.user);
        if (!user) throw new Error("User not found");

        const accessToken = generateAccessToken(user._id, sessionId);
        return { accessToken, refreshToken, sessionId };

    }

    async revokeSession(sessionId) {
        const session = await LoginHistoryModel.findOne({ sessionId });
        if (!session) throw new Error("Session not found");

        session.isRevoked = true;
        await session.save();

        const refreshToken = await RefreshTokenModel.findOne({sessionId});
        if (!refreshToken) throw new Error("Refresh token not found for session");

        refreshToken.isRevoked = true;
        await refreshToken.save();

        return { message: "Session revoked", sessionId };
    }


    async getUserProfile(userId) {
        const user = await UserModel.findById(userId).select("-password -__v");
        if (!user) throw new Error("User not found");

        return user;
    }

    async getLoginHistory(userId) {
        const loginHistory = await LoginHistoryModel.find({ userId }).sort({ loginTime: -1 }).limit(10);
        if (!loginHistory.length) throw new Error("Login history not found");

        return loginHistory;
    }

    async getActiveSessions(userId) {
        const activeTokens = await RefreshTokenModel.find({ userId: userId._id, isRevoked: false });
        if (!activeTokens || activeTokens.length === 0) throw new Error("Active sessions not found");

        const sessionIds  = activeTokens.map(session => session.sessionId);
        const loginHistory = await LoginHistoryModel.find({ sessionId: { $in: sessionIds } }).select("deviceDetails ipAddress loginTime sessionId");

        return activeTokens.map(session => {
            const history = loginHistory.find(history => history.sessionId === session.sessionId);
            return {
                sessionId: session.sessionId,
                isRevoked: session.isRevoked,
                createdAt: session.createdAt,
                deviceDetails: history? history.deviceDetails : {},
                ipAddress: history? history.ipAddress : "unknown",
                loginTime: history? history.loginTime : "unknown",
            };
        });
    }

    async updateUserProfile(userId, updateData) {
        if (!updateData) throw new Error("Invalid update data");

        const filteredData = {};
        for (let key in updateData) {
            if (updateData[key] !== "" && updateData[key] !== null) {
                filteredData[key] = updateData[key];
            }
        }

        const updatedUser = await UserModel.findByIdAndUpdate( userId, filteredData, { new: true, runValidators: true }).select("-password -__v");
        if (!updatedUser) throw new Error("User not found");

        return updatedUser;
    }

    async manageRefreshTokens(userId, sessionId, newRefreshToken = null) {
        const MAX_SESSIONS = 5;
        const userTokens = await RefreshTokenModel.find({user: userId}).sort({createdAt: 1});

        if (userTokens.length >= MAX_SESSIONS ) {
            const tokensToRemove = userTokens.slice(0, userTokens.length - MAX_SESSIONS + 1);
            await RefreshTokenModel.deleteMany({ _id: { $in: tokensToRemove.map(token => token._id) } });
        }

        if (newRefreshToken) {
            await RefreshTokenModel.create({ user: userId, refreshToken: newRefreshToken, sessionId: sessionId });
        }
    }
}

module.exports = new AuthService();