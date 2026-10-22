const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


// ======================================================
// EMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});


// ======================================================
// REGISTER
// ======================================================

const register = async (req, res) => {

    const { full_name, email, password } = req.body;
    const role_id = 2;

    if (!full_name || !email || !password || !role_id) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const checkEmailSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkEmailSql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        try {

            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `
                INSERT INTO users (full_name, email, password, role_id)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                sql,
                [full_name, email, hashedPassword, role_id],
                (err, result) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        message: "User registered successfully"
                    });

                }
            );

        } catch (error) {

            res.status(500).json({
                message: "Error registering user"
            });

        }

    });

};


// ======================================================
// LOGIN
// ======================================================

const login = (req, res) => {

    console.log("Login API called");

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                role_id: user.role_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Login successful",

            token: token,

            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role_id: user.role_id
            }
        });

    });

};


// ======================================================
// FORGOT PASSWORD
// ======================================================

const forgotPassword = async (req, res) => {

    const { email } = req.body;


    // Generic response prevents account enumeration

    const genericResponse = {
        message:
            "If an account with that email exists, a password reset link has been sent."
    };


    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }


    const sql = `
        SELECT user_id, full_name, email
        FROM users
        WHERE email = ?
    `;


    db.query(sql, [email], async (err, result) => {

        if (err) {

            console.error("Forgot password database error:", err);

            return res.status(500).json({
                message: "Unable to process password reset request"
            });

        }


        // Do not reveal whether email exists

        if (result.length === 0) {

            return res.status(200).json(genericResponse);

        }


        const user = result[0];


        try {

            // ==========================================
            // REMOVE OLD RESET TOKENS
            // ==========================================

            const deleteOldTokensSql = `
                DELETE FROM password_reset_tokens
                WHERE user_id = ?
            `;


            db.query(
                deleteOldTokensSql,
                [user.user_id],
                async (deleteErr) => {

                    if (deleteErr) {

                        console.error(
                            "Delete old token error:",
                            deleteErr
                        );

                        return res.status(500).json({
                            message:
                                "Unable to process password reset request"
                        });

                    }


                    // ==========================================
                    // GENERATE SECURE TOKEN
                    // ==========================================

                    const rawToken =
                        crypto.randomBytes(32).toString("hex");


                    // ==========================================
                    // HASH TOKEN FOR DATABASE
                    // ==========================================

                    const tokenHash =
                        crypto
                            .createHash("sha256")
                            .update(rawToken)
                            .digest("hex");


                    // Token valid for 15 minutes

                    const expiresAt =
                        new Date(Date.now() + 15 * 60 * 1000);


                    // ==========================================
                    // SAVE TOKEN
                    // ==========================================

                    const insertTokenSql = `
                        INSERT INTO password_reset_tokens
                        (
                            user_id,
                            token_hash,
                            expires_at,
                            used
                        )
                        VALUES (?, ?, ?, FALSE)
                    `;


                    db.query(
                        insertTokenSql,
                        [
                            user.user_id,
                            tokenHash,
                            expiresAt
                        ],
                        async (insertErr) => {

                            if (insertErr) {

                                console.error(
                                    "Token insert error:",
                                    insertErr
                                );

                                return res.status(500).json({
                                    message:
                                        "Unable to process password reset request"
                                });

                            }


                            // ==========================================
                            // RESET LINK
                            // ==========================================

                            const resetLink =
                                `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;


                            // ==========================================
                            // SEND EMAIL
                            // ==========================================

                            try {

                                await transporter.sendMail({

                                    from: process.env.SMTP_FROM,

                                    to: user.email,

                                    subject:
                                        "Asset Management System - Password Reset",

                                    html: `
                                        <div style="
                                            font-family: Arial, sans-serif;
                                            max-width: 600px;
                                            margin: auto;
                                            padding: 30px;
                                            border: 1px solid #e5e7eb;
                                            border-radius: 10px;
                                        ">

                                            <h2 style="color: #1e293b;">
                                                Password Reset
                                            </h2>

                                            <p>
                                                Hello ${user.full_name},
                                            </p>

                                            <p>
                                                We received a request to
                                                reset your Asset Management
                                                System password.
                                            </p>

                                            <p>
                                                Click the button below to
                                                create a new password.
                                            </p>

                                            <a
                                                href="${resetLink}"
                                                style="
                                                    display: inline-block;
                                                    padding: 12px 20px;
                                                    background: #2563eb;
                                                    color: white;
                                                    text-decoration: none;
                                                    border-radius: 6px;
                                                    font-weight: bold;
                                                "
                                            >
                                                Reset Password
                                            </a>

                                            <p style="
                                                margin-top: 20px;
                                                color: #64748b;
                                            ">
                                                This link will expire in
                                                15 minutes.
                                            </p>

                                            <p style="
                                                color: #64748b;
                                            ">
                                                If you did not request a
                                                password reset, you can
                                                safely ignore this email.
                                            </p>

                                        </div>
                                    `

                                });


                                console.log(
                                    `Password reset email sent to ${user.email}`
                                );


                                return res.status(200).json(
                                    genericResponse
                                );


                            } catch (emailError) {

                                console.error(
                                    "Password reset email error:",
                                    emailError
                                );


                                // Remove token if email failed

                                db.query(
                                    `
                                    DELETE FROM password_reset_tokens
                                    WHERE token_hash = ?
                                    `,
                                    [tokenHash]
                                );


                                return res.status(500).json({
                                    message:
                                        "Unable to send password reset email"
                                });

                            }

                        }
                    );

                }
            );

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to process password reset request"
            });

        }

    });

};


module.exports = {
    register,
    login,
    forgotPassword
};