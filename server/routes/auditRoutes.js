const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getAuditLogs
} = require("../controllers/auditController");


router.get(
    "/",
    verifyToken,
    getAuditLogs
);


module.exports = router;