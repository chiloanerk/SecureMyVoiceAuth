const UserService = require('../services/UserService');
const {extractDeviceInfo} = require("../utils/deviceInfo");
require("jsonwebtoken/lib/JsonWebTokenError");
module.exports.Signup = async (req, res) => {
    try {
        const {email, password, username} = req.body;

        const ipAddress =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket?.remoteAddress;

        const deviceInfo = extractDeviceInfo(req.headers);

        const { user, accessToken, refreshToken, sessionId } = await UserService.signUp({ email, password, username, ipAddress, deviceInfo });

        res.status(201).json({
            message: "Sign up successful",
            success: true,
            accessToken,
            refreshToken,
            user,
            sessionId,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.Login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const ipAddress =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket?.remoteAddress;


        const deviceInfo = extractDeviceInfo(req.headers);

        const { user, accessToken, refreshToken, sessionId } = await UserService.login({ email, password, ipAddress, deviceInfo });


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
};

module.exports.Logout = async (req, res) => {
    try {
        const sessionId = req.sessionId;
        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        await UserService.logout(sessionId);

        res.status(200).json({ message: "User logged out successfuly." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.RevokeAccessBySessionId = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({message: "SessionId is required"});
        }

        const loginHistory = await UserService.getLoginHistory(req.user._id);
        const session = loginHistory.find(session => session.sessionId === sessionId);

        console.log("Session Id: ", sessionId);
        console.log("Session is: ", session);
        if (!session) {
            res.status(401).json({ message: "Session not found." });
        }

        await UserService.revokeAccessBySessionId(sessionId);

        res.status(200).json({
                message: "Access for the specific session revoked successfully",
                success: true,
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
}

module.exports.RefreshToken = async (req, res) => {
    try {
        const {refreshToken, sessionId} = req.body;

        if (!refreshToken || !sessionId) {
            res.status(400).json({message: 'Refresh token and or sessionId is required.'});
        }

        const { accessToken, refreshToken: newRefreshToken } = await UserService.refreshToken(refreshToken, sessionId);

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

module.exports.Profile = async (req, res) => {
    try {
        const userId = req.user.id; // Retrieved from middlewarer
        const user = await UserService.getProfile(userId);

        res.status(200).json({success: true, user});
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message });
    }
};

module.exports.LoginHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await UserService.getLoginHistory(userId);
        res.status(200).json({success: true, history});
    } catch (error) {
        console.error(error);
        res.status(400).json({ "Failed to get login history": error.message });
    }
}

module.exports.getActiveSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const activeSessions  = await UserService.getActiveSessions(userId);

        res.status(200).json({success: true, activeSessions});
    } catch (error) {
        console.error(error);
        res.status(400).json({ "Failed to get active sessions": error.message });
    }
}

module.exports.UpdateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        console.log("Request body:", updateData);
        console.log("User id:", userId);

        const updatedUser = await UserService.updateProfile(userId, updateData);

        res.status(200).json({
            message: "Updated profile successfully.",
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message });
    }
}