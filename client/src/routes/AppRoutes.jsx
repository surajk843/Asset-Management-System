import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import Assets from "../pages/Assets/Assets";
import Assignments from "../pages/Assignments/Assignments";
import Reports from "../pages/Reports/Reports";
import Search from "../pages/Search/Search";
import AuditLogs from "../pages/AuditLogs/AuditLogs";
import Profile from "../pages/Profile/Profile";

import AssetRequest from "../pages/AssetRequest/AssetRequest";
import RequestAsset from "../pages/AssetRequest/RequestAsset";
import ReturnAsset from "../pages/AssetRequest/ReturnAsset";


function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ========================= */}
        {/* DEFAULT ROUTE */}
        {/* ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* ========================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ========================= */}
        {/* DASHBOARD */}
        {/* ADMIN + EMPLOYEE */}
        {/* ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* USERS */}
        {/* ADMIN + EMPLOYEE */}
        {/* Employee = READ ONLY */}
        {/* ========================= */}

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Users />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* ASSETS */}
        {/* ADMIN + EMPLOYEE */}
        {/* Employee = READ ONLY */}
        {/* ========================= */}

        <Route
          path="/assets"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Assets />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* ADMIN ASSET REQUESTS */}
        {/* ========================= */}

        <Route
          path="/asset-request"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AssetRequest />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* ADMIN ASSIGNMENTS */}
        {/* ========================= */}

        <Route
          path="/assignments"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <Assignments />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* ADMIN REPORTS */}
        {/* ========================= */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <Reports />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* SEARCH */}
        {/* ADMIN + EMPLOYEE */}
        {/* ========================= */}

        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Search />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* ADMIN AUDIT LOGS */}
        {/* ========================= */}

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* EMPLOYEE REQUEST ASSET */}
        {/* ========================= */}

        <Route
          path="/request-asset"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <RequestAsset />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* EMPLOYEE RETURN ASSET */}
        {/* ========================= */}

        <Route
          path="/return-asset"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <ReturnAsset />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* PROFILE */}
        {/* ADMIN + EMPLOYEE */}
        {/* ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* 404 */}
        {/* ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}


export default AppRoutes;