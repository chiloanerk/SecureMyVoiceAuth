const router = require("express").Router();
const {
    Signup, Login, RefreshToken, Profile, UpdateProfile, Logout, LoginHistory, RevokeAccess,
    getActiveSessions, VerifyEmail, ResendVerificationEmail, ResetPasswordEmail, ResetPassword, ResetPasswordWithToken
} = require("../controllers/AuthController")
const {userVerification} = require("../middlewares/authMiddleware");
const {
    validateSignup,
    validateLogin,
    validateVerifyEmail,
    validateResendVerificationEmail,
    validateForgotPassword,
    validateResetPasswordWithToken,
    validateResetPassword,
    validateRefreshToken,
    validateRevokeAccess
} = require("../middlewares/validationMiddleware");

router.post("/signup", validateSignup, Signup);
router.post("/login", validateLogin, Login);
router.post("/verify-email", validateVerifyEmail, VerifyEmail);
router.post("/resend-verification-email", validateResendVerificationEmail, ResendVerificationEmail);
router.post("/forgot-password", validateForgotPassword, ResetPasswordEmail);
router.post("/reset-password-with-token", validateResetPasswordWithToken, ResetPasswordWithToken);
router.post("/reset-password", userVerification, validateResetPassword, ResetPassword);

router.post("/refresh-token", validateRefreshToken, RefreshToken);
router.delete("/logout", userVerification, Logout);
router.delete("/revoke-token", userVerification, validateRevokeAccess, RevokeAccess);

router.get("/profile", userVerification, Profile);
router.put("/profile", userVerification, UpdateProfile);

router.get("/history", userVerification, LoginHistory);
router.get("/sessions", userVerification, getActiveSessions);

module.exports = router;