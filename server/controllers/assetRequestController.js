const db = require("../database/db");


// ======================================================
// EMPLOYEE → REQUEST ASSET
// ======================================================

const requestAsset = (req, res) => {

    const { asset_id, remarks } = req.body;

    const user_id = req.user.user_id;

    if (!asset_id) {
        return res.status(400).json({
            message: "Asset ID is required"
        });
    }

    // Check asset
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

        const asset = assetResult[0];

        if (asset.asset_status !== "Available") {
            return res.status(400).json({
                message: "Asset is not available"
            });
        }

        // Check existing pending request
        const checkSql = `
            SELECT *
            FROM asset_requests
            WHERE asset_id = ?
            AND user_id = ?
            AND request_type = 'ASSIGN'
            AND request_status = 'Pending'
        `;

        db.query(
            checkSql,
            [asset_id, user_id],
            (err, existingRequest) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (existingRequest.length > 0) {
                    return res.status(409).json({
                        message: "You already have a pending request for this asset"
                    });
                }

                const sql = `
                    INSERT INTO asset_requests
                    (
                        asset_id,
                        user_id,
                        request_type,
                        request_status,
                        remarks
                    )
                    VALUES (?, ?, 'ASSIGN', 'Pending', ?)
                `;

                db.query(
                    sql,
                    [asset_id, user_id, remarks || null],
                    (err, result) => {

                        if (err) {
                            return res.status(500).json(err);
                        }

                        res.status(201).json({
                            message: "Asset request submitted successfully",
                            request_id: result.insertId
                        });

                    }
                );

            }
        );

    });
};


// ======================================================
// EMPLOYEE → REQUEST RETURN
// ======================================================

const requestReturn = (req, res) => {

    const { assignment_id, remarks } = req.body;

    const user_id = req.user.user_id;

    if (!assignment_id) {
        return res.status(400).json({
            message: "Assignment ID is required"
        });
    }

    const assignmentSql = `
        SELECT *
        FROM asset_assignments
        WHERE assignment_id = ?
        AND user_id = ?
    `;

    db.query(
        assignmentSql,
        [assignment_id, user_id],
        (err, assignmentResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (assignmentResult.length === 0) {
                return res.status(404).json({
                    message: "Assignment not found"
                });
            }

            const assignment = assignmentResult[0];

            if (assignment.assignment_status !== "Assigned") {
                return res.status(400).json({
                    message: "This asset is not currently assigned to you"
                });
            }

            const checkSql = `
                SELECT *
                FROM asset_requests
                WHERE assignment_id = ?
                AND user_id = ?
                AND request_type = 'RETURN'
                AND request_status = 'Pending'
            `;

            db.query(
                checkSql,
                [assignment_id, user_id],
                (err, existingRequest) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    if (existingRequest.length > 0) {
                        return res.status(409).json({
                            message: "Return request already submitted"
                        });
                    }

                    const sql = `
                        INSERT INTO asset_requests
                        (
                            asset_id,
                            user_id,
                            assignment_id,
                            request_type,
                            request_status,
                            remarks
                        )
                        VALUES (?, ?, ?, 'RETURN', 'Pending', ?)
                    `;

                    db.query(
                        sql,
                        [
                            assignment.asset_id,
                            user_id,
                            assignment_id,
                            remarks || null
                        ],
                        (err, result) => {

                            if (err) {
                                return res.status(500).json(err);
                            }

                            res.status(201).json({
                                message: "Return request submitted successfully",
                                request_id: result.insertId
                            });

                        }
                    );

                }
            );

        }
    );
};


// ======================================================
// ADMIN → GET ALL REQUESTS
// ======================================================

const getRequests = (req, res) => {

    const sql = `
        SELECT
            ar.request_id,
            ar.request_type,
            ar.request_status,
            ar.requested_date,
            ar.reviewed_at,
            ar.remarks,

            a.asset_id,
            a.asset_name,
            a.asset_tag,

            u.user_id,
            u.full_name AS employee_name,
            u.email AS employee_email,

            ar.assignment_id,

            reviewer.full_name AS reviewed_by_name

        FROM asset_requests ar

        JOIN assets a
            ON ar.asset_id = a.asset_id

        JOIN users u
            ON ar.user_id = u.user_id

        LEFT JOIN users reviewer
            ON ar.reviewed_by = reviewer.user_id

        ORDER BY ar.request_id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });
};


// ======================================================
// EMPLOYEE → GET OWN REQUESTS
// ======================================================

const getMyRequests = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT
            ar.request_id,
            ar.request_type,
            ar.request_status,
            ar.requested_date,
            ar.reviewed_at,
            ar.remarks,

            a.asset_name,
            a.asset_tag,

            ar.assignment_id

        FROM asset_requests ar

        JOIN assets a
            ON ar.asset_id = a.asset_id

        WHERE ar.user_id = ?

        ORDER BY ar.request_id DESC
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });
};


// ======================================================
// ADMIN → APPROVE REQUEST
// ======================================================

const approveRequest = (req, res) => {

    const { id } = req.params;

    const admin_id = req.user.user_id;

    const requestSql = `
        SELECT *
        FROM asset_requests
        WHERE request_id = ?
    `;

    db.query(
        requestSql,
        [id],
        (err, requestResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (requestResult.length === 0) {
                return res.status(404).json({
                    message: "Request not found"
                });
            }

            const request = requestResult[0];

            if (request.request_status !== "Pending") {
                return res.status(400).json({
                    message: "Request has already been processed"
                });
            }


            // ==========================================
            // ASSIGN REQUEST
            // ==========================================

            if (request.request_type === "ASSIGN") {

                const assetSql = `
                    SELECT *
                    FROM assets
                    WHERE asset_id = ?
                    AND is_deleted = 0
                `;

                db.query(
                    assetSql,
                    [request.asset_id],
                    (err, assetResult) => {

                        if (err) {
                            return res.status(500).json(err);
                        }

                        if (assetResult.length === 0) {
                            return res.status(404).json({
                                message: "Asset not found"
                            });
                        }

                        if (
                            assetResult[0].asset_status !== "Available"
                        ) {
                            return res.status(400).json({
                                message: "Asset is no longer available"
                            });
                        }


                        const assignmentSql = `
                            INSERT INTO asset_assignments
                            (
                                asset_id,
                                user_id,
                                assigned_by,
                                assigned_date,
                                assignment_status,
                                remarks
                            )
                            VALUES (?, ?, ?, CURDATE(), 'Assigned', ?)
                        `;

                        db.query(
                            assignmentSql,
                            [
                                request.asset_id,
                                request.user_id,
                                admin_id,
                                request.remarks
                            ],
                            (err, assignmentResult) => {

                                if (err) {
                                    return res.status(500).json(err);
                                }

                                const assignment_id =
                                    assignmentResult.insertId;


                                const updateAssetSql = `
                                    UPDATE assets
                                    SET asset_status = 'Assigned'
                                    WHERE asset_id = ?
                                `;

                                db.query(
                                    updateAssetSql,
                                    [request.asset_id],
                                    (err) => {

                                        if (err) {
                                            return res.status(500).json(err);
                                        }

                                        const updateRequestSql = `
                                            UPDATE asset_requests
                                            SET
                                                request_status = 'Approved',
                                                reviewed_by = ?,
                                                reviewed_at = NOW(),
                                                assignment_id = ?
                                            WHERE request_id = ?
                                        `;

                                        db.query(
                                            updateRequestSql,
                                            [
                                                admin_id,
                                                assignment_id,
                                                id
                                            ],
                                            (err) => {

                                                if (err) {
                                                    return res.status(500).json(err);
                                                }

                                                res.status(200).json({
                                                    message: "Asset request approved"
                                                });

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

            }


            // ==========================================
            // RETURN REQUEST
            // ==========================================

            else if (request.request_type === "RETURN") {

                const assignmentSql = `
                    SELECT *
                    FROM asset_assignments
                    WHERE assignment_id = ?
                    AND user_id = ?
                `;

                db.query(
                    assignmentSql,
                    [
                        request.assignment_id,
                        request.user_id
                    ],
                    (err, assignmentResult) => {

                        if (err) {
                            return res.status(500).json(err);
                        }

                        if (assignmentResult.length === 0) {
                            return res.status(404).json({
                                message: "Assignment not found"
                            });
                        }

                        const assignment = assignmentResult[0];

                        if (
                            assignment.assignment_status !== "Assigned"
                        ) {
                            return res.status(400).json({
                                message: "Asset is already returned"
                            });
                        }


                        const updateAssignmentSql = `
                            UPDATE asset_assignments
                            SET
                                assignment_status = 'Returned',
                                actual_return_date = CURDATE()
                            WHERE assignment_id = ?
                        `;

                        db.query(
                            updateAssignmentSql,
                            [request.assignment_id],
                            (err) => {

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
                                    [request.asset_id],
                                    (err) => {

                                        if (err) {
                                            return res.status(500).json(err);
                                        }


                                        const updateRequestSql = `
                                            UPDATE asset_requests
                                            SET
                                                request_status = 'Approved',
                                                reviewed_by = ?,
                                                reviewed_at = NOW()
                                            WHERE request_id = ?
                                        `;

                                        db.query(
                                            updateRequestSql,
                                            [
                                                admin_id,
                                                id
                                            ],
                                            (err) => {

                                                if (err) {
                                                    return res.status(500).json(err);
                                                }

                                                res.status(200).json({
                                                    message: "Return request approved"
                                                });

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

            }

        }
    );
};


// ======================================================
// ADMIN → REJECT REQUEST
// ======================================================

const rejectRequest = (req, res) => {

    const { id } = req.params;

    const admin_id = req.user.user_id;

    const sql = `
        UPDATE asset_requests

        SET
            request_status = 'Rejected',
            reviewed_by = ?,
            reviewed_at = NOW()

        WHERE request_id = ?
        AND request_status = 'Pending'
    `;

    db.query(
        sql,
        [admin_id, id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Pending request not found"
                });
            }

            res.status(200).json({
                message: "Request rejected successfully"
            });

        }
    );
};


module.exports = {
    requestAsset,
    requestReturn,
    getRequests,
    getMyRequests,
    approveRequest,
    rejectRequest
};