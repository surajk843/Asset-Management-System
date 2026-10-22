require("dotenv").config();
require("./database/db");

const express = require("express");
const cors = require("cors");

const assetRoutes = require("./routes/assetRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const auditRoutes = require("./routes/auditRoutes");
const assetRequestRoutes = require("./routes/assetRequestRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://asset-management-system-rosy.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    }
}));

app.use(express.json());

app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/asset-requests", assetRequestRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
    res.send("Asset Management API is running...");
});

module.exports = app;