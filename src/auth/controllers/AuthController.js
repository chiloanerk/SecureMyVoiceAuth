const AuthService = require('../services/AuthService');
const {extractDeviceInfo} = require("../utils/DeviceInfo");

const getIpAddress = (req) => {
    return (
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket?.remoteAddress
    );
};

module.exports = {
    Signup: async (req, res) => {
        try {
            const {email, password, username} = req.body;
            const ipAddress = getIpAddress(req);
            const deviceDetails = extractDeviceInfo(req.headers);

            const {user, accessToken, refreshToken, sessionId} = await AuthService.registerUser(
                { email, password, username, ipAddress, deviceDetails });

            res.status(201).json({
                message: "Sign up successful",
                success: true,
                accessToken,
                refreshToken,
                unique_link: user.unique_link,
                sessionId,
            });
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    },

    Login: async (req, res) => {
        try {
            const {email, password} = req.body;
            const ipAddress = getIpAddress(req);
            const deviceDetails = extractDeviceInfo(req.headers);

            const { user, accessToken, refreshToken, sessionId } = await AuthService.authenticateUser(
                { email, password, ipAddress, deviceDetails });

            res.status(201).json({
                message: "User logged in successfuly",
                success: true,
                accessToken,
                refreshToken,
                user,
                sessionId
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    },

    Logout: async (req, res) => {
        try {
            const { sessionId } = req;
            if (!sessionId) return res.status(400).json({ message: "Session id not found" });

            await AuthService.revokeSession(sessionId);
            res.status(200).json({ message: "User logged out successfuly" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    RevokeAccess: async (req, res) => {
        try {
            const { sessionId } = req.body;
            if (!sessionId) return res.status(400).json({message: "SessionId is required"});

            const loginHistory = await AuthService.getLoginHistory(req.user._id);
            const session = loginHistory.find(session => session.sessionId === sessionId);

            if (!session) res.status(401).json({ message: "Session not found." });

            await AuthService.revokeSession(sessionId);

            res.status(200).json({
                message: "Access for the specific session revoked successfully",
                success: true,
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    },

    RefreshToken: async (req, res) => {
        try {
            const {refreshToken, sessionId} = req.body;
            if (!refreshToken || !sessionId) res.status(400).json({message: 'Refresh token and or sessionId is required.'});

            const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshAccessToken(refreshToken, sessionId);

            res.status(200).json({
                success: true,
                accessToken,
                refreshToken: newRefreshToken,
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    },

    Profile: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await AuthService.getUserProfile(userId);

            res.status(200).json({success: true, user});
        } catch (error) {
            console.error(error);
            res.status(400).json({message: error.message });
        }
    },

    LoginHistory: async (req, res) => {
        try {
            const userId = req.user.id;
            const history = await AuthService.getLoginHistory(userId);

            res.status(200).json({success: true, history});
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    },

    getActiveSessions: async (req, res) => {
        try {
            const userId = req.user.id;
            const activeSessions  = await AuthService.getActiveSessions(userId);

            res.status(200).json({success: true, activeSessions});
        } catch (error) {
            console.error(error);
            res.status(400).json({ "Failed to get active sessions": error.message });
        }
    },

    UpdateProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            const updateData = req.body;

            const updatedUser = await AuthService.updateUserProfile(userId, updateData);

            res.status(200).json({
                message: "Updated profile successfully.",
                success: true,
                user: updatedUser,
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({message: error.message });
        }
    },
}



