const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const { getDashboardStats,
     getRecentAssignments,
      getCategorySummary,
       getWarrantyAlerts,
        getMonthlyPurchases,
        getAssetStatistics,
        getLowStockAssets,
        getWarrantyExpiryReport,
        getPurchaseHistory,
        getPurchaseCostSummary,
        getBrandWiseAssets,
        getAssetStatusReport,
        getEmployeeAssetHistory,
        getEmployeeAssetSummary,
        globalSearch,
        getActivityTimeline,
        getDatabaseHealth


    } = require("../controllers/dashboardController");

router.get(
    "/stats",
    verifyToken,
    getDashboardStats
);

router.get(
    "/recent-assignments",
    verifyToken,
    getRecentAssignments
);

router.get("/category-summary",
    verifyToken,
    getCategorySummary
)

router.get("/warranty-alerts",
    verifyToken,
    getWarrantyAlerts
);

router.get(
    "/monthly-purchases",
    verifyToken,
    getMonthlyPurchases
);

router.get(
    "/asset-statistics",
    verifyToken,
    getAssetStatistics
);

router.get(
    "/low-stock",
    verifyToken,
    getLowStockAssets
);

router.get(
    "/warranty-expiry",
    verifyToken,
    getWarrantyExpiryReport
);

router.get(
    "/purchase-history",
    verifyToken,
    getPurchaseHistory
);

router.get(
    "/purchase-summary",
    verifyToken,
    getPurchaseCostSummary
);

router.get(
    "/brand-wise-assets",
    verifyToken,
    getBrandWiseAssets
);

router.get(
    "/asset-status",
    verifyToken,
    getAssetStatusReport
);

router.get(
    "/employee-history/:user_id",
    verifyToken,
    getEmployeeAssetHistory
);

router.get(
    "/employee-summary",
    verifyToken,
    getEmployeeAssetSummary
);

router.get(
    "/global-search",
    verifyToken,
    globalSearch
);

router.get(
    "/activity-timeline",
    verifyToken,
    getActivityTimeline
);

router.get(
    "/database-health",
    verifyToken,
    getDatabaseHealth
);

module.exports = router;