import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RoleProtectedRoute({ children, allowedRoles }) {
    const {
        isAuthenticated,
        loading,
        user,
    } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user?.role_id)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default RoleProtectedRoute;