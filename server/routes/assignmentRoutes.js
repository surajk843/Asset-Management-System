const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizeRole = require("../middleware/roleMiddleware");

const {

    assignAsset,
    getAssignments,
    returnAsset,
    getMyAssignments,

} = require("../controllers/assignmentController");

router.get(
    "/",
    verifyToken,
    getAssignments
);

router.post(
    "/",
    verifyToken,
    authorizeRole(1),
    assignAsset
);

router.put(
    "/return/:id",
    verifyToken,
    authorizeRole(1),
    returnAsset
);

router.get(
    "/my",
    verifyToken,
    authorizeRole(2),
    getMyAssignments
);

module.exports = router;