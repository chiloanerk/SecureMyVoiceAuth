const AuthService = require('../services/AuthService');
const {extractDeviceInfo} = require("../utils/DeviceInfo");
const EmailService = require("../mailtrap/EmailService");

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

            const { verificationToken } = await EmailService.verificationEmail({ email });

            res.status(201).json({
                message: "Sign up successful",
                success: true,
                accessToken,
                refreshToken,
                unique_link: user.unique_link,
                sessionId,
                email: user.email,
                verificationToken,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({message: error.message});
        }
    },

    VerifyEmail: async (req, res) => {
        try {
            const {email, verificationToken} = req.body;
            if (!email || !verificationToken) return res.status(400).json({message: "Email and verification token required"});

            const result = await EmailService.verifyEmail({ email, verificationToken });

            await EmailService.sendWelcomeEmail({ email })
            res.status(200).json({ success: true, message: result.message });

        } catch (error) {
            console.log(error);
            res.status(400).json({message: error.message});
        }
    },

    ResendVerificationEmail: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({message: "Email required"});

            const result = await EmailService.resendVerificationEmail({ email });
            res.status(200).json({
                success: true,
                ...result
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({message: error.message, success: false});
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

    ResetPasswordEmail: async (req, res) => {
        const { email } = req.body;
        if (!email) throw new Error("Email is required");
        try {
            const results = await EmailService.forgotPasswordEmail({ email });
            res.status(200).json({
                success: true,
                message: results.message,
                resetLink: results.resetLink,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({message: error.message});
        }
    },

    ResetPassword : async (req, res) => {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) return res.status(400).json({message: "Current and new password are required"});
        try {
            const results = await AuthService.changePassword({ userId, currentPassword, newPassword });
            res.status(200).json({
                success: true,
                message: results.message,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({message: error.message});
        }
    },

    ResetPasswordWithToken : async (req, res) => {
        const resetToken = req.query.token;
        const { newPassword } = req.body;

        if (!resetToken || !newPassword) return res.status(400).json({message: "Reset token and password are required"});
        try {
            const results = await AuthService.resetPasswordWithToken({ resetToken, newPassword});
            res.status(200).json({
                success: true,
                message: results.message,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({message: error.message});
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



