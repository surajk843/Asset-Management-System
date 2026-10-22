const db = require("../database/db");

const createAuditLog = (
    user_id,
    action,
    table_name,
    record_id
) => {

    const sql = `
        INSERT INTO audit_logs
        (user_id, action, table_name, record_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [user_id, action, table_name, record_id],
        (err) => {
            if (err) {
                console.log("Audit Log Error:", err);
            }
        }
    );
};


const getAuditLogs = (req, res) => {

    const sql = `
        SELECT
            al.log_id,
            al.user_id,
            u.full_name,
            al.action,
            al.table_name,
            al.record_id,
            al.created_at
        FROM audit_logs al
        LEFT JOIN users u
            ON al.user_id = u.user_id
        ORDER BY al.log_id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });
};


module.exports = {
    createAuditLog,
    getAuditLogs
};