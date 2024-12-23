const express = require("express");
const router = express.Router();
const { userVerification } = require("../Middlewares/AuthMiddleware");

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/dashboard", userVerification, (req, res) => {
    res.render("dashboard"); // Only accessible if user is verified
});

module.exports = router;
