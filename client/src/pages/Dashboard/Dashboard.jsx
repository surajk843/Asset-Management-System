import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getDashboardStats,
  getRecentAssignments,
  getCategorySummary,
  getWarrantyAlerts,
  getMonthlyPurchases,
  getActivityTimeline,
  getAssetStatusReport,
  getBrandWiseAssets,
  getLowStockAssets,
  getPurchaseCostSummary,
} from "../../services/dashboardService";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total_assets: 0,
    available_assets: 0,
    assigned_assets: 0,
    maintenance_assets: 0,
    retired_assets: 0,
    total_users: 0,
    total_categories: 0,
  });

  const [recentAssignments, setRecentAssignments] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [warrantyAlerts, setWarrantyAlerts] = useState([]);
  const [monthlyPurchases, setMonthlyPurchases] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [brandWiseAssets, setBrandWiseAssets] = useState([]);
  const [lowStockAssets, setLowStockAssets] = useState([]);
  const [purchaseSummary, setPurchaseSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          statsData,
          assignmentsData,
          categoryData,
          warrantyData,
          monthlyData,
          activityData,
          statusData,
          brandData,
          lowStockData,
          purchaseData,
        ] = await Promise.all([
          getDashboardStats(),
          getRecentAssignments(),
          getCategorySummary(),
          getWarrantyAlerts(),
          getMonthlyPurchases(),
          getActivityTimeline(),
          getAssetStatusReport(),
          getBrandWiseAssets(),
          getLowStockAssets(),
          getPurchaseCostSummary(),
        ]);

        setStats(statsData);
        setRecentAssignments(assignmentsData);
        setCategorySummary(categoryData);
        setWarrantyAlerts(warrantyData);
        setMonthlyPurchases(monthlyData);
        setActivityTimeline(activityData);
        setAssetStatus(statusData);
        setBrandWiseAssets(brandData);
        setLowStockAssets(lowStockData);
        setPurchaseSummary(purchaseData);
      } catch (error) {
        console.error("Dashboard Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return "0";
    }

    return Number(value).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {user?.full_name || "User"}
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* MAIN STATISTICS */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Assets
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {loading ? "..." : stats.total_assets}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Users
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {loading ? "..." : stats.total_users}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {loading ? "..." : stats.total_categories}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Assigned Assets
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {loading ? "..." : stats.assigned_assets}
            </h2>
          </div>

        </div>

        {/* ASSET STATUS CARDS */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Available Assets
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {loading ? "..." : stats.available_assets}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Maintenance Assets
            </p>

            <h2 className="mt-2 text-2xl font-bold text-orange-500">
              {loading ? "..." : stats.maintenance_assets}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Retired Assets
            </p>

            <h2 className="mt-2 text-2xl font-bold text-red-500">
              {loading ? "..." : stats.retired_assets}
            </h2>
          </div>

        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* CATEGORY CHART */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-800">
              Assets by Category
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Number of assets in each category
            </p>

            <div className="h-80">

              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Loading chart...
                </div>
              ) : categorySummary.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No category data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categorySummary}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="category_name"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="total_assets"
                      name="Assets"
                    />

                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>
          </div>

          {/* MONTHLY PURCHASES */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-800">
              Monthly Purchases
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Assets purchased by month
            </p>

            <div className="h-80">

              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Loading chart...
                </div>
              ) : monthlyPurchases.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No purchase data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPurchases}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="total_assets"
                      name="Purchased Assets"
                    />

                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>
          </div>

        </div>

        {/* ASSET STATUS + BRAND */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* STATUS */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-800">
              Asset Status
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Current asset distribution
            </p>

            <div className="h-80">

              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Loading chart...
                </div>
              ) : assetStatus.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No status data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>

                    <Pie
                      data={assetStatus}
                      dataKey="total_assets"
                      nameKey="asset_status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {assetStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} />
                      ))}
                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>
                </ResponsiveContainer>
              )}

            </div>
          </div>

          {/* BRAND */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-800">
              Assets by Brand
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Number of assets grouped by brand
            </p>

            <div className="h-80">

              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Loading chart...
                </div>
              ) : brandWiseAssets.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No brand data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brandWiseAssets}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="brand"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="total_assets"
                      name="Assets"
                    />

                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>
          </div>

        </div>

        {/* PURCHASE SUMMARY */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-800">
            Purchase Cost Summary
          </h2>

          <p className="mb-5 text-sm text-slate-500">
            Overall asset purchase cost statistics
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Total Cost
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {loading
                  ? "..."
                  : formatCurrency(
                      purchaseSummary?.total_purchase_cost
                    )}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Average Cost
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {loading
                  ? "..."
                  : formatCurrency(
                      purchaseSummary?.average_purchase_cost
                    )}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Highest Cost
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {loading
                  ? "..."
                  : formatCurrency(
                      purchaseSummary?.highest_purchase_cost
                    )}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Lowest Cost
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {loading
                  ? "..."
                  : formatCurrency(
                      purchaseSummary?.lowest_purchase_cost
                    )}
              </p>
            </div>

          </div>
        </div>

        {/* LOW STOCK */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-800">
            Low Stock Categories
          </h2>

          <p className="mb-5 text-sm text-slate-500">
            Categories containing fewer than the minimum stock quantity
          </p>

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-4 py-3 font-medium">
                    Category
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Total Assets
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Loading low stock data...
                    </td>
                  </tr>
                ) : lowStockAssets.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No low stock categories found.
                    </td>
                  </tr>
                ) : (
                  lowStockAssets.map((category, index) => (
                    <tr
                      key={`${category.category_name}-${index}`}
                      className="border-b border-slate-100"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {category.category_name}
                      </td>

                      <td className="px-4 py-3 font-semibold text-red-600">
                        {category.total_assets}
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>
        </div>

        {/* RECENT ASSIGNMENTS */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-800">
            Recent Assignments
          </h2>

          <p className="mb-5 text-sm text-slate-500">
            Latest asset assignments
          </p>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px] text-left text-sm">

              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-4 py-3 font-medium">
                    Asset
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Asset Tag
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Employee
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Assigned By
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Date
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Loading assignments...
                    </td>
                  </tr>
                ) : recentAssignments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No recent assignments found.
                    </td>
                  </tr>
                ) : (
                  recentAssignments.map((assignment) => (
                    <tr
                      key={assignment.assignment_id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {assignment.asset_name}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {assignment.asset_tag}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {assignment.employee_name}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {assignment.assigned_by}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(assignment.assigned_date)}
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {assignment.assignment_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>
        </div>

        {/* WARRANTY ALERTS */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-800">
            Warranty Alerts
          </h2>

          <p className="mb-5 text-sm text-slate-500">
            Assets whose warranty expires within 30 days
          </p>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px] text-left text-sm">

              <thead>
                <tr className="border-b border-slate-200 text-slate-500">

                  <th className="px-4 py-3 font-medium">
                    Asset
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Asset Tag
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Brand
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Model
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Warranty End
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Loading warranty alerts...
                    </td>
                  </tr>
                ) : warrantyAlerts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No warranty alerts.
                    </td>
                  </tr>
                ) : (
                  warrantyAlerts.map((asset) => (
                    <tr
                      key={asset.asset_id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      <td className="px-4 py-3 font-medium text-slate-800">
                        {asset.asset_name}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {asset.asset_tag}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {asset.brand}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {asset.model}
                      </td>

                      <td className="px-4 py-3 font-medium text-red-600">
                        {formatDate(asset.warranty_end)}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>
        </div>

        {/* ACTIVITY TIMELINE */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-800">
            Activity Timeline
          </h2>

          <p className="mb-5 text-sm text-slate-500">
            Latest system activities
          </p>

          <div className="space-y-4">

            {loading ? (
              <div className="py-6 text-center text-sm text-slate-500">
                Loading activities...
              </div>
            ) : activityTimeline.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No activities found.
              </div>
            ) : (
              activityTimeline.map((activity) => (
                <div
                  key={activity.log_id}
                  className="flex items-start gap-4 border-b border-slate-100 pb-4 last:border-0"
                >

                  <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />

                  <div className="flex-1">

                    <p className="font-medium text-slate-800">
                      {activity.full_name || "System"}
                    </p>

                    <p className="text-sm text-slate-600">
                      {activity.action} on {activity.table_name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Record ID: {activity.record_id}
                    </p>

                  </div>

                  <span className="text-xs text-slate-400">
                    {formatDate(activity.created_at)}
                  </span>

                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;