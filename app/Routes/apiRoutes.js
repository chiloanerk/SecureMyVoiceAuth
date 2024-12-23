const { Signup, Login, Profile} = require("../Controllers/AuthController");
const {userVerification} = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/profile", userVerification, Profile);

module.exports = router;