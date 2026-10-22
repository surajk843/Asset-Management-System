const db = require("../database/db");
const bcrypt = require("bcrypt");


// ==========================================
// GET MY PROFILE
// ==========================================

const getProfile = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT
            user_id,
            full_name,
            email,
            role_id,
            created_at
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(result[0]);
    });
};


// ==========================================
// UPDATE MY PROFILE
// ==========================================

const updateProfile = (req, res) => {

    const user_id = req.user.user_id;

    const { full_name, email } = req.body;

    if (!full_name || !email) {
        return res.status(400).json({
            message: "Full name and email are required"
        });
    }

    const checkEmailSql = `
        SELECT user_id
        FROM users
        WHERE email = ?
        AND user_id != ?
    `;

    db.query(
        checkEmailSql,
        [email, user_id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            const sql = `
                UPDATE users
                SET
                    full_name = ?,
                    email = ?
                WHERE user_id = ?
            `;

            db.query(
                sql,
                [full_name, email, user_id],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(200).json({
                        message: "Profile updated successfully"
                    });

                }
            );

        }
    );
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {

    const user_id = req.user.user_id;

    const {
        current_password,
        new_password
    } = req.body;

    if (!current_password || !new_password) {
        return res.status(400).json({
            message: "Current password and new password are required"
        });
    }

    if (new_password.length < 6) {
        return res.status(400).json({
            message: "New password must be at least 6 characters"
        });
    }

    const sql = `
        SELECT password
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        try {

            // Check current password
            const isMatch = await bcrypt.compare(
                current_password,
                result[0].password
            );

            if (!isMatch) {
                return res.status(401).json({
                    message: "Current password is incorrect"
                });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(
                new_password,
                10
            );

            const updateSql = `
                UPDATE users
                SET password = ?
                WHERE user_id = ?
            `;

            db.query(
                updateSql,
                [hashedPassword, user_id],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(200).json({
                        message: "Password changed successfully"
                    });

                }
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Error changing password"
            });
        }

    });
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword
};