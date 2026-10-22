import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import {
  FiRefreshCw,
  FiShoppingCart,
  FiShield,
  FiPackage,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/axios";

function Reports() {
  const [loading, setLoading] = useState(true);

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [purchaseSummary, setPurchaseSummary] = useState(null);

  const [warrantyExpiry, setWarrantyExpiry] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const [brandWise, setBrandWise] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);

  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [employeeHistory, setEmployeeHistory] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [warrantyDays, setWarrantyDays] = useState(30);
  const [minimumStock, setMinimumStock] = useState(2);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const params = {};

      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const [
        purchaseHistoryResponse,
        purchaseSummaryResponse,
        warrantyResponse,
        lowStockResponse,
        brandResponse,
        statusResponse,
        employeeSummaryResponse,
      ] = await Promise.all([
        api.get("/dashboard/purchase-history", {
          params,
        }),

        api.get("/dashboard/purchase-summary", {
          params,
        }),

        api.get("/dashboard/warranty-expiry", {
          params: {
            days: warrantyDays,
          },
        }),

        api.get("/dashboard/low-stock", {
          params: {
            minimumStock,
          },
        }),

        api.get("/dashboard/brand-wise-assets"),

        api.get("/dashboard/asset-status"),

        api.get("/dashboard/employee-summary"),
      ]);

      setPurchaseHistory(purchaseHistoryResponse.data);
      setPurchaseSummary(purchaseSummaryResponse.data);

      setWarrantyExpiry(warrantyResponse.data);
      setLowStock(lowStockResponse.data);

      setBrandWise(brandResponse.data);
      setAssetStatus(statusResponse.data);

      setEmployeeSummary(employeeSummaryResponse.data);

    } catch (error) {
      console.error("Reports Error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to load reports.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeHistory = async (userId) => {
    if (!userId) {
      setEmployeeHistory([]);
      return;
    }

    try {
      const response = await api.get(
        `/dashboard/employee-history/${userId}`
      );

      setEmployeeHistory(response.data);

    } catch (error) {
      console.error("Employee History Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load employee history."
      );
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleEmployeeChange = (e) => {
    const userId = e.target.value;

    setSelectedEmployee(userId);

    fetchEmployeeHistory(userId);
  };

  const handleApplyFilters = () => {
    if (
      (startDate && !endDate) ||
      (!startDate && endDate)
    ) {
      toast.error(
        "Please select both start and end dates."
      );
      return;
    }

    fetchReports();
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" />

      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Reports
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View asset, purchase, warranty and employee reports.
            </p>
          </div>

          <button
            onClick={fetchReports}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <FiRefreshCw />

            {loading ? "Loading..." : "Refresh"}
          </button>

        </div>

        {/* PURCHASE DATE FILTER */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-3">

            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <FiShoppingCart />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Purchase Report Filter
              </h2>

              <p className="text-sm text-slate-500">
                Filter purchase reports by date.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">

              <button
                onClick={handleApplyFilters}
                className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-900"
              >
                Apply Filter
              </button>

            </div>

          </div>

        </div>

        {/* PURCHASE SUMMARY */}

        <div>

          <ReportTitle
            icon={<FiShoppingCart />}
            title="Purchase Cost Summary"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Total Assets"
              value={purchaseSummary?.total_assets ?? 0}
            />

            <StatCard
              title="Total Purchase Cost"
              value={formatMoney(
                purchaseSummary?.total_purchase_cost
              )}
            />

            <StatCard
              title="Average Cost"
              value={formatMoney(
                purchaseSummary?.average_purchase_cost
              )}
            />

            <StatCard
              title="Highest Cost"
              value={formatMoney(
                purchaseSummary?.highest_purchase_cost
              )}
            />

          </div>

        </div>

        {/* PURCHASE HISTORY */}

        <ReportSection
          icon={<FiShoppingCart />}
          title="Purchase History"
        >

          <Table>

            <TableHead>
              <th>Asset</th>
              <th>Tag</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Vendor</th>
              <th>Purchase Date</th>
              <th>Price</th>
            </TableHead>

            <tbody>

              {purchaseHistory.length === 0 ? (

                <EmptyTable columns={7} />

              ) : (

                purchaseHistory.map((item) => (

                  <tr
                    key={item.asset_id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                      {item.asset_name}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {item.asset_tag}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {item.brand}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {item.model}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {item.vendor_name || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(item.purchase_date)}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                      {formatMoney(item.purchase_price)}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </Table>

        </ReportSection>

        {/* WARRANTY */}

        <ReportSection
          icon={<FiShield />}
          title="Warranty Expiry"
        >

          <div className="mb-4 flex items-end gap-3">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Days
              </label>

              <input
                type="number"
                min="1"
                value={warrantyDays}
                onChange={(e) =>
                  setWarrantyDays(e.target.value)
                }
                className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={fetchReports}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              Check
            </button>

          </div>

          <Table>

            <TableHead>
              <th>Asset</th>
              <th>Tag</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Warranty End</th>
            </TableHead>

            <tbody>

              {warrantyExpiry.length === 0 ? (

                <EmptyTable columns={5} />

              ) : (

                warrantyExpiry.map((item) => (

                  <tr
                    key={item.asset_id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-4 py-3 text-sm font-medium">
                      {item.asset_name}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.asset_tag}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.brand}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.model}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-orange-600">
                      {formatDate(item.warranty_end)}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </Table>

        </ReportSection>

        {/* LOW STOCK */}

        <ReportSection
          icon={<FiPackage />}
          title="Low Stock Assets"
        >

          <div className="mb-4 flex items-end gap-3">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Maximum Stock
              </label>

              <input
                type="number"
                min="0"
                value={minimumStock}
                onChange={(e) =>
                  setMinimumStock(e.target.value)
                }
                className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={fetchReports}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Check
            </button>

          </div>

          <Table>

            <TableHead>
              <th>Category</th>
              <th>Total Assets</th>
            </TableHead>

            <tbody>

              {lowStock.length === 0 ? (

                <EmptyTable columns={2} />

              ) : (

                lowStock.map((item) => (

                  <tr
                    key={item.category_name}
                    className="border-t border-slate-100"
                  >

                    <td className="px-4 py-3 text-sm font-medium">
                      {item.category_name}
                    </td>

                    <td className="px-4 py-3 text-sm font-bold text-red-600">
                      {item.total_assets}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </Table>

        </ReportSection>

        {/* ASSET ANALYTICS */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <ReportSection
            icon={<FiBarChart2 />}
            title="Assets by Brand"
          >

            <Table>

              <TableHead>
                <th>Brand</th>
                <th>Total Assets</th>
              </TableHead>

              <tbody>

                {brandWise.length === 0 ? (

                  <EmptyTable columns={2} />

                ) : (

                  brandWise.map((item) => (

                    <tr
                      key={item.brand}
                      className="border-t border-slate-100"
                    >

                      <td className="px-4 py-3 text-sm font-medium">
                        {item.brand || "Unknown"}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {item.total_assets}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </Table>

          </ReportSection>

          <ReportSection
            icon={<FiPackage />}
            title="Asset Status"
          >

            <Table>

              <TableHead>
                <th>Status</th>
                <th>Total Assets</th>
              </TableHead>

              <tbody>

                {assetStatus.length === 0 ? (

                  <EmptyTable columns={2} />

                ) : (

                  assetStatus.map((item) => (

                    <tr
                      key={item.asset_status}
                      className="border-t border-slate-100"
                    >

                      <td className="px-4 py-3 text-sm font-medium">
                        {item.asset_status}
                      </td>

                      <td className="px-4 py-3 text-sm font-bold">
                        {item.total_assets}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </Table>

          </ReportSection>

        </div>

        {/* EMPLOYEE SUMMARY */}

        <ReportSection
          icon={<FiUsers />}
          title="Employee Asset Summary"
        >

          <Table>

            <TableHead>
              <th>Employee</th>
              <th>Email</th>
              <th>Assigned Assets</th>
              <th>History</th>
            </TableHead>

            <tbody>

              {employeeSummary.length === 0 ? (

                <EmptyTable columns={4} />

              ) : (

                employeeSummary.map((employee) => (

                  <tr
                    key={employee.user_id}
                    className="border-t border-slate-100"
                  >

                    <td className="px-4 py-3 text-sm font-medium">
                      {employee.full_name}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {employee.email}
                    </td>

                    <td className="px-4 py-3 text-sm font-bold">
                      {employee.assigned_assets}
                    </td>

                    <td className="px-4 py-3">

                      <button
                        onClick={() => {
                          setSelectedEmployee(
                            String(employee.user_id)
                          );

                          fetchEmployeeHistory(
                            employee.user_id
                          );
                        }}
                        className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
                      >
                        View History
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </Table>

        </ReportSection>

        {/* EMPLOYEE HISTORY */}

        <ReportSection
          icon={<FiUsers />}
          title="Employee Asset History"
        >

          <div className="mb-5 max-w-md">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Select Employee
            </label>

            <select
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >

              <option value="">
                Select an employee
              </option>

              {employeeSummary.map((employee) => (

                <option
                  key={employee.user_id}
                  value={employee.user_id}
                >
                  {employee.full_name}
                </option>

              ))}

            </select>

          </div>

          <Table>

            <TableHead>
              <th>Asset</th>
              <th>Tag</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Assigned Date</th>
              <th>Expected Return</th>
              <th>Actual Return</th>
              <th>Status</th>
            </TableHead>

            <tbody>

              {employeeHistory.length === 0 ? (

                <EmptyTable columns={8} />

              ) : (

                employeeHistory.map((item) => (

                  <tr
                    key={item.assignment_id}
                    className="border-t border-slate-100"
                  >

                    <td className="px-4 py-3 text-sm font-medium">
                      {item.asset_name}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.asset_tag}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.brand}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.model}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {formatDate(item.assigned_date)}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {formatDate(item.expected_return_date)}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {formatDate(item.actual_return_date)}
                    </td>

                    <td className="px-4 py-3">

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {item.assignment_status}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </Table>

        </ReportSection>

      </div>
    </DashboardLayout>
  );
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function ReportTitle({ icon, title }) {
  return (
    <div className="mb-4 flex items-center gap-3">

      <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
        {icon}
      </div>

      <h2 className="text-lg font-semibold text-slate-800">
        {title}
      </h2>

    </div>
  );
}

function ReportSection({ icon, title, children }) {
  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">

      <ReportTitle
        icon={icon}
        title={title}
      />

      {children}

    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}

function Table({ children }) {
  return (
    <div className="overflow-x-auto">

      <table className="min-w-full">

        {children}

      </table>

    </div>
  );
}

function TableHead({ children }) {
  return (
    <thead className="bg-slate-50">

      <tr>
        {children}
      </tr>

    </thead>
  );
}

function EmptyTable({ columns }) {
  return (
    <tr>

      <td
        colSpan={columns}
        className="px-4 py-8 text-center text-sm text-slate-400"
      >
        No data available.
      </td>

    </tr>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}

function formatMoney(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "₹0";
  }

  return `₹${Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export default Reports;