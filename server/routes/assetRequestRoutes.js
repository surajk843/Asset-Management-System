const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
    requestAsset,
    requestReturn,
    getRequests,
    getMyRequests,
    approveRequest,
    rejectRequest
} = require("../controllers/assetRequestController");


// Employee → request an asset
router.post(
    "/asset",
    verifyToken,
    authorizeRole(2),
    requestAsset
);


// Employee → request return
router.post(
    "/return",
    verifyToken,
    authorizeRole(2),
    requestReturn
);


// Employee → see own requests
router.get(
    "/my",
    verifyToken,
    authorizeRole(2),
    getMyRequests
);


// Admin → see all requests
router.get(
    "/",
    verifyToken,
    authorizeRole(1),
    getRequests
);


// Admin → approve
router.put(
    "/approve/:id",
    verifyToken,
    authorizeRole(1),
    approveRequest
);


// Admin → reject
router.put(
    "/reject/:id",
    verifyToken,
    authorizeRole(1),
    rejectRequest
);


module.exports = router;