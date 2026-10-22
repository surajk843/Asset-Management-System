const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizeRole = require("../middleware/roleMiddleware");

const {
    getAssets,
    searchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    restoreAsset,
} = require("../controllers/assetController");

router.get("/search", verifyToken, searchAssets);

router.get("/", verifyToken, getAssets);

router.post("/", verifyToken, authorizeRole(1), createAsset);

router.put("/:id", verifyToken, authorizeRole(1), updateAsset);

router.delete("/:id", verifyToken, authorizeRole(1), deleteAsset);

router.put("/restore/:id", verifyToken, authorizeRole(1), restoreAsset);

module.exports = router;