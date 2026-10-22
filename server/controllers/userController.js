const db = require("../database/db");
const bcrypt = require("bcrypt");
const { createAuditLog } = require("./auditController");

// GET ALL USERS
const getUsers = (req, res) => {
    const sql = `
        SELECT
            user_id,
            full_name,
            email,
            role_id,
            created_at
        FROM users
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching users"
            });
        }

        return res.status(200).json(result);
    });
};

// CREATE USER
const createUser = async (req, res) => {
    const { full_name, email, password, role_id } = req.body;

    if (!full_name || !email || !password || !role_id) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const checkEmailSql = `
            SELECT user_id
            FROM users
            WHERE email = ?
        `;

        db.query(checkEmailSql, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error checking email"
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                const sql = `
                    INSERT INTO users
                    (full_name, email, password, role_id)
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    sql,
                    [full_name, email, hashedPassword, role_id],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                message: "Error creating user"
                            });
                        }

                        // Record successful user creation
                        createAuditLog(
                            req.user.user_id,
                            "CREATE",
                            "users",
                            result.insertId
                        );

                        return res.status(201).json({
                            message: "User created successfully",
                            user_id: result.insertId
                        });
                    }
                );
            } catch (error) {
                return res.status(500).json({
                    message: "Error hashing password"
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// UPDATE USER
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { full_name, email, password, role_id } = req.body;

    if (!full_name || !email || !role_id) {
        return res.status(400).json({
            message: "Full name, email and role are required"
        });
    }

    try {
        let sql;
        let values;

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);

            sql = `
                UPDATE users
                SET full_name = ?,
                    email = ?,
                    password = ?,
                    role_id = ?
                WHERE user_id = ?
            `;

            values = [
                full_name,
                email,
                hashedPassword,
                role_id,
                id
            ];
        } else {
            sql = `
                UPDATE users
                SET full_name = ?,
                    email = ?,
                    role_id = ?
                WHERE user_id = ?
            `;

            values = [
                full_name,
                email,
                role_id,
                id
            ];
        }

        db.query(sql, values, (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                }

                return res.status(500).json({
                    message: "Error updating user"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Record successful user update
            createAuditLog(
                req.user.user_id,
                "UPDATE",
                "users",
                id
            );

            return res.status(200).json({
                message: "User updated successfully"
            });
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating user"
        });
    }
};

// DELETE USER
const deleteUser = (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error deleting user"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Record successful user deletion
        createAuditLog(
            req.user.user_id,
            "DELETE",
            "users",
            id
        );

        return res.status(200).json({
            message: "User deleted successfully"
        });
    });
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};