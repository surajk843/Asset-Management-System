const db = require("../database/db");

const getDashboardStats = (req, res) => {

    const sql = `
        SELECT

        (SELECT COUNT(*) FROM assets) AS total_assets,

        (SELECT COUNT(*) FROM assets
        WHERE asset_status='Available') AS available_assets,

        (SELECT COUNT(*) FROM assets
        WHERE asset_status='Assigned') AS assigned_assets,

        (SELECT COUNT(*) FROM assets
        WHERE asset_status='Maintenance') AS maintenance_assets,

        (SELECT COUNT(*) FROM assets
        WHERE asset_status='Retired') AS retired_assets,

        (SELECT COUNT(*) FROM users) AS total_users,

        (SELECT COUNT(*) FROM categories) AS total_categories

    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result[0]);

    });

};

//This API is what you'll use in the React dashboard to display a "Recent Assignments" table.

const getRecentAssignments = (req, res) =>{
    const sql = `
    SELECT 
    aa.assignment_id,
    a.asset_name,
    a.asset_tag,
    u.full_name AS employee_name,
    admin.full_name AS assigned_by,
    aa.assigned_date,
    aa.assignment_status

    FROM asset_assignments aa 
    JOIN assets a
    ON aa.asset_id = a.asset_id
    JOIN users u
    ON aa.user_id = u.user_id
    JOIN users admin
    ON aa.assigned_by = admin.user_id
    ORDER BY aa.assigned_date DESC
    LIMIT 5
    
    `;

    db.query(sql, (err, result) =>{
        if(err){
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });
};
//This query counts how many assets belong to each category
const getCategorySummary = (req, res) => {

    const sql = `
        SELECT
            c.category_name,
            COUNT(a.asset_id) AS total_assets

        FROM categories c

        LEFT JOIN assets a
            ON c.category_id = a.category_id

        GROUP BY
            c.category_id,
            c.category_name

        ORDER BY
            total_assets DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

};


// this module checks the Current date and Warranty ends 
const getWarrantyAlerts = (req, res) => {

    const sql = `
        SELECT
            asset_id,
            asset_name,
            asset_tag,
            brand,
            model,
            warranty_end

        FROM assets

        WHERE warranty_end BETWEEN CURDATE()
        AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)

        ORDER BY warranty_end ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

};

// this method checks the number of aset purchase in each month

const getMonthlyPurchases = (req, res) => {

    const sql = `
        SELECT

            MONTHNAME(purchase_date) AS month,

            COUNT(asset_id) AS total_assets

        FROM assets

        GROUP BY
            MONTH(purchase_date),
            MONTHNAME(purchase_date)

        ORDER BY
            MONTH(purchase_date)
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

};
// 
const getAssetStatistics = (req, res) => {

    const sql = `
        SELECT
            c.category_name,
            COUNT(a.asset_id) AS total_assets

        FROM categories c

        LEFT JOIN assets a
            ON c.category_id = a.category_id
            AND a.is_deleted = FALSE

        GROUP BY
            c.category_id,
            c.category_name

        ORDER BY
            total_assets DESC;
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result);

    });

};
const getLowStockAssets = (req, res) => {

    const minimumStock = parseInt(req.query.minimumStock) || 2;

    const sql = `
        SELECT
            c.category_name,
            COUNT(a.asset_id) AS total_assets

        FROM categories c

        LEFT JOIN assets a
            ON c.category_id = a.category_id
            AND a.is_deleted = FALSE

        GROUP BY
            c.category_id,
            c.category_name

        HAVING
            COUNT(a.asset_id) <= ?

        ORDER BY
            total_assets ASC
    `;

    db.query(sql, [minimumStock], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result);

    });

};
const getWarrantyExpiryReport = (req, res) => {

    const days = parseInt(req.query.days) || 30;

    const sql = `
        SELECT
            asset_id,
            asset_name,
            asset_tag,
            brand,
            model,
            warranty_end

        FROM assets

        WHERE
            is_deleted = FALSE
            AND warranty_end IS NOT NULL
            AND warranty_end BETWEEN CURDATE()
            AND DATE_ADD(CURDATE(), INTERVAL ? DAY)

        ORDER BY warranty_end ASC
    `;

    db.query(sql, [days], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result);

    });

};

const getPurchaseHistory = (req, res) => {

    const {
        startDate,
        endDate
    } = req.query;

    let sql = `
        SELECT
            asset_id,
            asset_name,
            asset_tag,
            brand,
            model,
            vendor_name,
            purchase_date,
            purchase_price

        FROM assets

        WHERE is_deleted = FALSE
    `;

    const values = [];

    if (startDate && endDate) {

        sql += `
            AND purchase_date
            BETWEEN ? AND ?
        `;

        values.push(startDate);
        values.push(endDate);

    }

    sql += `
        ORDER BY purchase_date DESC
    `;

    db.query(sql, values, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result);

    });

};

const getPurchaseCostSummary = (req, res) => {

    const { startDate, endDate } = req.query;

    let sql = `
        SELECT
            COUNT(asset_id) AS total_assets,
            SUM(purchase_price) AS total_purchase_cost,
            AVG(purchase_price) AS average_purchase_cost,
            MAX(purchase_price) AS highest_purchase_cost,
            MIN(purchase_price) AS lowest_purchase_cost

        FROM assets

        WHERE is_deleted = FALSE
    `;

    const values = [];

    if (startDate && endDate) {

        sql += `
            AND purchase_date BETWEEN ? AND ?
        `;

        values.push(startDate);
        values.push(endDate);

    }

    db.query(sql, values, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result[0]);

    });

};

const getBrandWiseAssets = (req, res) => {

    const sql = `
        SELECT
            brand,
            COUNT(asset_id) AS total_assets

        FROM assets

        WHERE is_deleted = FALSE

        GROUP BY brand

        ORDER BY total_assets DESC, brand ASC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result);

    });

};

const getAssetStatusReport = (req, res) => {

    const sql = `
        SELECT
            asset_status,
            COUNT(asset_id) AS total_assets

        FROM assets

        WHERE is_deleted = FALSE

        GROUP BY asset_status

        ORDER BY total_assets DESC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result);

    });

};

const getEmployeeAssetHistory = (req, res) => {

    const { user_id } = req.params;

    const sql = `
        SELECT
            aa.assignment_id,
            a.asset_name,
            a.asset_tag,
            a.brand,
            a.model,
            aa.assigned_date,
            aa.expected_return_date,
            aa.actual_return_date,
            aa.assignment_status

        FROM asset_assignments aa

        JOIN assets a
            ON aa.asset_id = a.asset_id

        WHERE aa.user_id = ?

        ORDER BY aa.assigned_date DESC
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result);

    });

};

const getEmployeeAssetSummary = (req, res) => {

    const sql = `
        SELECT
            u.user_id,
            u.full_name,
            u.email,
            COUNT(aa.assignment_id) AS assigned_assets

        FROM users u

        LEFT JOIN asset_assignments aa
            ON u.user_id = aa.user_id
            AND aa.assignment_status = 'Assigned'

        GROUP BY
            u.user_id,
            u.full_name,
            u.email

        ORDER BY
            assigned_assets DESC,
            u.full_name ASC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result);

    });

};

const globalSearch = (req, res) => {

    const { keyword } = req.query;

    if (!keyword) {

        return res.status(400).json({
            message: "Keyword is required"
        });

    }

    const value = `%${keyword}%`;

    // Assets
    const assetSql = `
        SELECT
            asset_id AS id,
            asset_name AS name,
            asset_tag,
            brand,
            asset_status,
            'Asset' AS type
        FROM assets
        WHERE
            is_deleted = FALSE
            AND (
                asset_name LIKE ?
                OR asset_tag LIKE ?
                OR brand LIKE ?
                OR model LIKE ?
                OR vendor_name LIKE ?
                OR asset_status LIKE ?
            )
    `;

    db.query(
        assetSql,
        [value, value, value, value, value, value],
        (err, assetResult) => {

            if (err)
                return res.status(500).json(err);

            // Users
            const userSql = `
                SELECT
                    user_id AS id,
                    full_name AS name,
                    email,
                    'User' AS type
                FROM users
                WHERE
                    full_name LIKE ?
                    OR email LIKE ?
            `;

            db.query(
                userSql,
                [value, value],
                (err, userResult) => {

                    if (err)
                        return res.status(500).json(err);

                    // Categories
                    const categorySql = `
                        SELECT
                            category_id AS id,
                            category_name AS name,
                            'Category' AS type
                        FROM categories
                        WHERE category_name LIKE ?
                    `;

                    db.query(
                        categorySql,
                        [value],
                        (err, categoryResult) => {

                            if (err)
                                return res.status(500).json(err);

                            // Assignments
                            const assignmentSql = `
                                SELECT
                                    aa.assignment_id,
                                    u.full_name,
                                    a.asset_name,
                                    aa.assignment_status
                                FROM asset_assignments aa
                                JOIN users u
                                    ON aa.user_id = u.user_id
                                JOIN assets a
                                    ON aa.asset_id = a.asset_id
                                WHERE
                                    u.full_name LIKE ?
                                    OR a.asset_name LIKE ?
                                    OR aa.assignment_status LIKE ?
                            `;

                            db.query(
                                assignmentSql,
                                [value, value, value],
                                (err, assignmentResult) => {

                                    if (err)
                                        return res.status(500).json(err);

                                    res.status(200).json({

                                        assets: assetResult,

                                        users: userResult,

                                        categories: categoryResult,

                                        assignments: assignmentResult

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};

const getActivityTimeline = (req, res) => {

    const sql = `
        SELECT
            al.log_id,
            u.full_name,
            al.action,
            al.table_name,
            al.record_id,
            al.created_at

        FROM audit_logs al

        LEFT JOIN users u
            ON al.user_id = u.user_id

        ORDER BY al.created_at DESC

        LIMIT 20
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result);

    });

};

const getDatabaseHealth = (req, res) => {

    const sql = `
        SELECT

        (SELECT COUNT(*) FROM users) AS total_users,

        (SELECT COUNT(*) FROM categories) AS total_categories,

        (SELECT COUNT(*)
         FROM assets
         WHERE is_deleted = FALSE) AS total_assets,

        (SELECT COUNT(*)
         FROM assets
         WHERE asset_status = 'Assigned'
         AND is_deleted = FALSE) AS assigned_assets,

        (SELECT COUNT(*)
         FROM assets
         WHERE asset_status = 'Available'
         AND is_deleted = FALSE) AS available_assets,

        (SELECT COUNT(*)
         FROM assets
         WHERE asset_status = 'Under Maintenance'
         AND is_deleted = FALSE) AS maintenance_assets,

        (SELECT COUNT(*)
         FROM assets
         WHERE asset_status = 'Retired'
         AND is_deleted = FALSE) AS retired_assets,

        (SELECT COUNT(*)
         FROM audit_logs) AS total_logs
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.status(200).json(result[0]);

    });

};

module.exports = {
    getDashboardStats,
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
    getDatabaseHealth,

};