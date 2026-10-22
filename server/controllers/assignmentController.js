const db = require("../database/db");
const { createAuditLog } = require("./auditController");

// ASSIGN ASSET
const assignAsset = (req, res) => {
    const {
        asset_id,
        user_id,
        assigned_date,
        expected_return_date,
        remarks
    } = req.body;

    const assigned_by = req.user.user_id;

    if (!asset_id || !user_id || !assigned_date) {
        return res.status(400).json({
            message: "Required fields are missing"
        });
    }

    // Check asset availability
    const assetSql = `
        SELECT *
        FROM assets
        WHERE asset_id = ?
        AND is_deleted = 0
    `;

    db.query(assetSql, [asset_id], (err, assetResult) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (assetResult.length === 0) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        if (assetResult[0].asset_status !== "Available") {
            return res.status(400).json({
                message: "Asset is not available"
            });
        }

        // Check user
        const userSql = `
            SELECT user_id
            FROM users
            WHERE user_id = ?
        `;

        db.query(userSql, [user_id], (err, userResult) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (userResult.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const sql = `
                INSERT INTO asset_assignments
                (
                    asset_id,
                    user_id,
                    assigned_by,
                    assigned_date,
                    expected_return_date,
                    remarks
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    asset_id,
                    user_id,
                    assigned_by,
                    assigned_date,
                    expected_return_date || null,
                    remarks || null
                ],
                (err, result) => {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    const assignmentId = result.insertId;

                    const updateSql = `
                        UPDATE assets
                        SET asset_status = 'Assigned'
                        WHERE asset_id = ?
                    `;

                    db.query(updateSql, [asset_id], (err) => {
                        if (err) {
                            return res.status(500).json(err);
                        }

                        // Log only after both operations succeed
                        createAuditLog(
                            assigned_by,
                            "ASSIGN",
                            "asset_assignments",
                            assignmentId
                        );

                        return res.status(201).json({
                            message: "Asset assigned successfully",
                            assignment_id: assignmentId
                        });
                    });
                }
            );
        });
    });
};

// GET ALL ASSIGNMENTS
const getAssignments = (req, res) => {
    const sql = `
        SELECT
            aa.assignment_id,
            a.asset_name,
            a.asset_tag,
            u.full_name AS employee_name,
            admin.full_name AS assigned_by,
            aa.assigned_date,
            aa.expected_return_date,
            aa.actual_return_date,
            aa.assignment_status,
            aa.remarks,
            aa.created_at
        FROM asset_assignments aa
        JOIN assets a
            ON aa.asset_id = a.asset_id
        JOIN users u
            ON aa.user_id = u.user_id
        JOIN users admin
            ON aa.assigned_by = admin.user_id
        ORDER BY aa.assignment_id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(result);
    });
};

// RETURN ASSET
const returnAsset = (req, res) => {
    const { id } = req.params;

    const assignmentSql = `
        SELECT *
        FROM asset_assignments
        WHERE assignment_id = ?
    `;

    db.query(assignmentSql, [id], (err, assignmentResult) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (assignmentResult.length === 0) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        const assignment = assignmentResult[0];

        if (assignment.assignment_status === "Returned") {
            return res.status(400).json({
                message: "Asset already returned"
            });
        }

        const updateAssignmentSql = `
            UPDATE asset_assignments
            SET
                assignment_status = 'Returned',
                actual_return_date = CURDATE()
            WHERE assignment_id = ?
        `;

        db.query(updateAssignmentSql, [id], (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            const updateAssetSql = `
                UPDATE assets
                SET asset_status = 'Available'
                WHERE asset_id = ?
            `;

            db.query(
                updateAssetSql,
                [assignment.asset_id],
                (err) => {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    // Log successful return
                    createAuditLog(
                        req.user.user_id,
                        "RETURN",
                        "asset_assignments",
                        id
                    );

                    return res.status(200).json({
                        message: "Asset returned successfully"
                    });
                }
            );
        });
    });
};

// GET CURRENT EMPLOYEE'S ASSIGNMENTS
const getMyAssignments = (req, res) => {
    const user_id = req.user.user_id;

    const sql = `
        SELECT
            aa.assignment_id,
            aa.asset_id,
            a.asset_name,
            a.asset_tag,
            a.serial_number,
            aa.assigned_date,
            aa.expected_return_date,
            aa.assignment_status,
            aa.remarks
        FROM asset_assignments aa
        JOIN assets a
            ON aa.asset_id = a.asset_id
        WHERE aa.user_id = ?
        AND aa.assignment_status = 'Assigned'
        ORDER BY aa.assignment_id DESC
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(result);
    });
};

module.exports = {
    assignAsset,
    getAssignments,
    returnAsset,
    getMyAssignments
};