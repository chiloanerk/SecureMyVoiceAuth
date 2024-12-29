const User = require("../models/User");
const LoginHistory = require("../models/Audit");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
require("jsonwebtoken");
const {createAccessToken, createRefreshToken} = require("../utils/jwtUtils");
require("user-agent");
const { v4: uuidv4 } = require('uuid');

class UserService {
    async signUp({ email, password, username, ipAddress, deviceInfo }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const user = await User.create({email, password, username});

        const mappedDeviceInfo = {
            userAgent: deviceInfo.full || '',  // Full user agent string
            browser: deviceInfo.name || '',    // Browser name (e.g., 'chrome')
            version: deviceInfo.version || '', // Browser version
            platform: deviceInfo.os || '',    // Operating system, if available
            device: deviceInfo.fullName || '', // Full device name and version
        };

        await LoginHistory.create({
            userId: user._id,
            ipAddress: ipAddress,
            deviceInfo: mappedDeviceInfo,
            status: 'success',  // Assuming login is successful
            loginTime: new Date(),
            sessionId: uuidv4(),
            isRevoked: false,
        });

        user.save();

        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        await this.manageRefreshTokens(user._id, null, refreshToken);

        return { user, accessToken, refreshToken, sessionId };
    }

    async login({ email, password, ipAddress, deviceInfo }) {
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

        console.log("Device info", deviceInfo);

        const mappedDeviceInfo = {
            userAgent: deviceInfo.full || '',  // Full user agent string
            browser: deviceInfo.name || '',    // Browser name (e.g., 'chrome')
            version: deviceInfo.version || '', // Browser version
            platform: deviceInfo.os || '',    // Operating system, if available
            device: deviceInfo.fullName || '', // Full device name and version
        };

        const sessionId = uuidv4();
        await LoginHistory.create({
            userId: user._id,
            ipAddress: ipAddress,
            deviceInfo: mappedDeviceInfo,
            status: 'success',  // Assuming login is successful
            loginTime: new Date(),
            sessionId: sessionId,
            isRevoked: false,
        });

        const accessToken = createAccessToken(user._id, sessionId);
        const refreshToken = createRefreshToken(user._id);

        await this.manageRefreshTokens(user._id, sessionId, refreshToken);

        return { user, accessToken, refreshToken, sessionId };
    }

    async logout(sessionId) {
        const sessionRevoked = await this.revokeAccessBySessionId(sessionId);
        return { message: "Logged out successfully", sessionRevoked };
    }


    async refreshToken( refreshToken, sessionId ) {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }

        // Find the refresh token
        const tokenRecord = await RefreshToken.findOne({ refreshToken: refreshToken} );
        if (!tokenRecord) {
            throw new Error("Invalid refresh token");
        }

        if (tokenRecord.isRevoked) {
            throw new Error("Refresh token is revoked");
        }

        const session = await LoginHistory.findOne({ sessionId: sessionId });
        if (session && session.isRevoked) {
            throw new Error("Session has been revoked");
        }

        // Verify user associated with the token
        const user = await User.findById(tokenRecord.user);
        if (!user) {
            throw new Error("User not found");
        }

        // const newRefreshToken = createRefreshToken(user._id);
        // manage refresh tokens
        // await this.manageRefreshTokens(user._id, tokenRecord.sessionId, newRefreshToken);

        const accessToken = createAccessToken(user._id, sessionId);
        return { accessToken, refreshToken, sessionId: tokenRecord.sessionId };

    }

    async revokeAccessBySessionId(sessionId) {
        const session = await LoginHistory.findOne({ sessionId });
        if (!session) {
            throw new Error("Session not found");
        }

        session.isRevoked = true;
        await session.save();

        const tokenRecord = await RefreshToken.findOne({sessionId});
        if (!tokenRecord) {
            throw new Error("Refresh token not found for sessionId", sessionId);
        }

        tokenRecord.isRevoked = true;
        await tokenRecord.save();

        return { message: "Access revoked for sessionId: ", sessionId };
    }


    async getProfile(userId) {
        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async getLoginHistory(userId) {
        const loginHistory = await LoginHistory.find({ userId }).sort({ loginTime: -1 }).limit(10);
        if (!loginHistory) {
            throw new Error("Login history not found");
        }

        return loginHistory;
    }

    async getActiveSessions(userId) {
        const activeSessions = await RefreshToken.find({ userId: userId._id, isRevoked: false });
        if (!activeSessions || activeSessions.length === 0) {
            throw new Error("Active sessions not found");
        }

        const sessionIds  = activeSessions.map(session => session.sessionId);

        const loginHistory = await LoginHistory.find({
            sessionId: { $in: sessionIds },
        }).select("deviceInfo ipAddress loginTime sessionId");

        if (!loginHistory || loginHistory.length === 0) {
            throw new Error("No login history found for active sessions.");
        }

        return activeSessions.map(session => {
            const history = loginHistory.find(history => history.sessionId === session.sessionId);
            return {
                sessionId: session.sessionId,
                isRevoked: session.isRevoked,
                createdAt: session.createdAt,
                deviceInfo: history?.deviceInfo || {},
                ipAddress: history?.ipAddress || "unknown",
                loginTime: history.loginTime || "unknown",
            };
        });
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

    async manageRefreshTokens(userId, sessionId, newRefreshToken = null) {
        const MAX_SESSIONS = 5;
        const userTokens = await RefreshToken.find({user: userId}).sort({createdAt: 1});

        const tokensToDelete = userTokens.length - MAX_SESSIONS + 1;
        if (tokensToDelete > 0 ) {
            const tokensToRemove = userTokens.slice(0, tokensToDelete);
            await RefreshToken.deleteMany({ _id: { $in: tokensToRemove.map(token => token._id) } });
        }

        if (newRefreshToken) {
            await RefreshToken.create({
                user: userId,
                refreshToken: newRefreshToken,
                sessionId: sessionId,
            });
        }
    }
}

module.exports = new UserService();