const {createReport, getReport} = require("../controllers/ReportController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/reports/:unique_link", authMiddleware, getReport);
router.post("/reports/:unique_link", createReport);

module.exports = router;