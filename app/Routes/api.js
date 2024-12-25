const { Signup, Login, Profile, UpdateProfile} = require("../Controllers/AuthController");
const {userVerification} = require("../Middlewares/AuthMiddleware");
const reportController = require("../Controllers/ReportController");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/profile", userVerification, Profile);
router.get("/reports/:unique_link", userVerification, reportController.getReport);
router.post("/reports/:unique_link", reportController.createReport);

router.put("/profile", userVerification, UpdateProfile);

module.exports = router;