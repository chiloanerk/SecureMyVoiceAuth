const router = require("express").Router();
const { Signup, Login, RefreshToken, Profile, UpdateProfile, Logout, LoginHistory, RevokeAccess,
    getActiveSessions, VerifyEmail, ResendVerificationEmail, ResetPasswordEmail, ResetPassword, ResetPasswordWithToken
} = require("../controllers/AuthController")
const {userVerification} = require("../middlewares/authMiddleware");


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/verify-email", VerifyEmail);
router.post("/resend-verification-email", ResendVerificationEmail);
router.post("/forgot-password", ResetPasswordEmail);
router.post("/reset-password-with-token", ResetPasswordWithToken);
router.post("/reset-password", userVerification, ResetPassword);

router.post("/refresh-token", RefreshToken);
router.delete("/logout", userVerification, Logout);
router.delete("/revoke-token", userVerification, RevokeAccess);

router.get("/profile", userVerification, Profile);
router.put("/profile", userVerification, UpdateProfile);

router.get("/history", userVerification, LoginHistory);
router.get("/sessions", userVerification, getActiveSessions);

module.exports = router;