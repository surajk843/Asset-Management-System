const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const userRole = Number(req.user.role_id);
        const permittedRoles = allowedRoles.map(Number);

        if (!permittedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Access forbidden"
            });
        }

        next();
    };
};

module.exports = authorizeRole;

