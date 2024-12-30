const router = require("express").Router();
const { Signup, Login, RefreshToken, Profile, UpdateProfile, Logout, LoginHistory, RevokeAccess,
    getActiveSessions
} = require("../controllers/AuthController")
const {userVerification} = require("../middlewares/authMiddleware");


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/refresh-token", RefreshToken);
router.delete("/logout", userVerification, Logout);
router.delete("/revoke-token", userVerification, RevokeAccess);

router.get("/profile", userVerification, Profile);
router.put("/profile", userVerification, UpdateProfile);

router.get("/history", userVerification, LoginHistory);
router.get("/sessions", userVerification, getActiveSessions);

module.exports = router;