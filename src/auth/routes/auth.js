const router = require("express").Router();
const { Signup, Login, RefreshToken, Profile, UpdateProfile, Logout} = require("../controllers/AuthController")
const {userVerification} = require("../middlewares/authMiddleware");


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/refresh-token", userVerification, RefreshToken);
router.delete("/logout", userVerification, Logout);

router.get("/profile", userVerification, Profile);
router.put("/profile", userVerification, UpdateProfile);

module.exports = router;