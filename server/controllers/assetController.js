const db = require("../database/db");

const { createAuditLog } = require("./auditController");

// Get All Assets
const getAssets = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const allowedSortFields = [
        "asset_id",
        "asset_name",
        "brand",
        "model",
        "asset_status",
        "created_at"
    ];

    const sort = allowedSortFields.includes(req.query.sort)
        ? req.query.sort
        : "asset_id";

    const order =
        req.query.order &&
            req.query.order.toUpperCase() === "DESC"
            ? "DESC"
            : "ASC";

    const countSql = `
        SELECT COUNT(*) AS total
        FROM assets
    `;

    db.query(countSql, (err, countResult) => {

        if (err) {
            return res.status(500).json(err);
        }

        const totalRecords = countResult[0].total;

        const totalPages = Math.ceil(totalRecords / limit);

        const sql = `
            SELECT
                a.asset_id,
                a.asset_name,
                a.asset_tag,
                a.serial_number,
                c.category_name,
                a.brand,
                a.model,
                a.asset_status,
                a.created_at

           FROM assets a

            JOIN categories c
            ON a.category_id = c.category_id

            WHERE a.is_deleted = FALSE
            ORDER BY ${sort} ${order}

            LIMIT ?
            OFFSET ?
        `;

        db.query(sql, [limit, offset], (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json({

                current_page: page,
                total_pages: totalPages,
                total_records: totalRecords,
                sort_by: sort,
                order_by: order,
                assets: result

            });

        });

    });

};

// Search Asset by name, brand, status, or category
const searchAssets = (req, res) => {

    const {
        name,
        brand,
        status,
        category
    } = req.query;

    let sql = `
        SELECT
            a.asset_id,
            a.asset_name,
            a.asset_tag,
            a.serial_number,
            c.category_name,
            a.brand,
            a.model,
            a.asset_status,
            a.created_at

        FROM assets a

        JOIN categories c
        ON a.category_id = c.category_id

        WHERE a.is_deleted = FALSE
    `;

    sql += " AND 1 = 1";

    const values = [];

    if (name) {
        sql += " AND a.asset_name LIKE ?";
        values.push(`%${name}%`);
    }

    if (brand) {
        sql += " AND a.brand LIKE ?";
        values.push(`%${brand}%`);
    }

    if (status) {
        sql += " AND a.asset_status = ?";
        values.push(status);
    }

    if (category) {
        sql += " AND a.category_id = ?";
        values.push(category);
    }

    sql += " ORDER BY a.asset_id ASC";

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

};
// Create Asset
const createAsset = (req, res) => {

    const {
        asset_name,
        asset_tag,
        serial_number,
        category_id,
        brand,
        model,
        purchase_date,
        purchase_price,
        vendor_name,
        invoice_number,
        warranty_start,
        warranty_end
    } = req.body;

    // Validation
    if (
        !asset_name ||
        !asset_tag ||
        !serial_number ||
        !category_id ||
        !brand ||
        !model ||
        !purchase_date ||
        !purchase_price
    ) {
        return res.status(400).json({
            message: "All required fields are mandatory"
        });
    }

    // Duplicate Asset Tag
    const checkTagSql =
        "SELECT * FROM assets WHERE asset_tag = ?";

    db.query(checkTagSql, [asset_tag], (err, tagResult) => {

        if (err)
            return res.status(500).json(err);

        if (tagResult.length > 0) {
            return res.status(409).json({
                message: "Asset Tag already exists"
            });
        }

        // Duplicate Serial Number

        const checkSerialSql =
            "SELECT * FROM assets WHERE serial_number = ?";

        db.query(
            checkSerialSql,
            [serial_number],
            (err, serialResult) => {

                if (err)
                    return res.status(500).json(err);

                if (serialResult.length > 0) {
                    return res.status(409).json({
                        message:
                            "Serial Number already exists"
                    });
                }

                const sql = `
                INSERT INTO assets
                (
                    asset_name,
                    asset_tag,
                    serial_number,
                    category_id,
                    brand,
                    model,
                    purchase_date,
                    purchase_price,
                    vendor_name,
                    invoice_number,
                    warranty_start,
                    warranty_end
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    sql,
                    [
                        asset_name,
                        asset_tag,
                        serial_number,
                        category_id,
                        brand,
                        model,
                        purchase_date,
                        purchase_price,
                        vendor_name,
                        invoice_number,
                        warranty_start,
                        warranty_end
                    ],
                    (err, result) => {

                        if (err)
                            return res.status(500).json(err);

                        createAuditLog(
                            req.user.user_id,
                            "CREATE",
                            "assets",
                            result.insertId
                        );
                        res.status(201).json({
                            message: "Asset created successfully"
                        });

                    }
                );

            }
        );

    });

};
// Update Asset
const updateAsset = (req, res) => {

    const { id } = req.params;

    // Check if request body exists
    if (!req.body) {
        return res.status(400).json({
            message: "Request body is required"
        });
    }

    const {
        asset_name,
        asset_tag,
        serial_number,
        category_id,
        brand,
        model,
        purchase_date,
        purchase_price,
        vendor_name,
        invoice_number,
        warranty_start,
        warranty_end,
        asset_status
    } = req.body;

    if (
        !asset_name ||
        !asset_tag ||
        !serial_number ||
        !category_id ||
        !brand ||
        !model ||
        !purchase_date ||
        !purchase_price
    ) {
        return res.status(400).json({
            message: "All required fields are mandatory"
        });
    }

    const sql = `
        UPDATE assets
        SET
            asset_name = ?,
            asset_tag = ?,
            serial_number = ?,
            category_id = ?,
            brand = ?,
            model = ?,
            purchase_date = ?,
            purchase_price = ?,
            vendor_name = ?,
            invoice_number = ?,
            warranty_start = ?,
            warranty_end = ?,
            asset_status = ?
        WHERE asset_id = ?
    `;

    db.query(
        sql,
        [
            asset_name,
            asset_tag,
            serial_number,
            category_id,
            brand,
            model,
            purchase_date,
            purchase_price,
            vendor_name,
            invoice_number,
            warranty_start,
            warranty_end,
            asset_status,
            id
        ],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Asset not found"
                });
            }

            createAuditLog(
                req.user.user_id,
                "UPDATE",
                "assets",
                id
            );
            res.status(200).json({
                message: "Asset updated successfully"
            });
        }
    );

};

// Delete Asset
const deleteAsset = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE assets
        SET is_deleted = TRUE
        WHERE asset_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        createAuditLog(
            req.user.user_id,
            "DELETE",
            "assets",
            id
        );
        res.status(200).json({
            message: "Asset deleted successfully"
        });
    });

};

// for restoring the deleted asset 
const restoreAsset = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE assets
        SET is_deleted = FALSE
        WHERE asset_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        createAuditLog(
            req.user.user_id,
            "RESTORE",
            "assets",
            id
        );
        res.status(200).json({
            message: "Asset restored successfully"
        });
    });

};
module.exports = {
    getAssets,
    searchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    restoreAsset,
};