import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/axios";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/audit-logs");

      setLogs(response.data);

    } catch (error) {
      console.error("Audit Logs Error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to load audit logs.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Audit Logs
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track important actions performed in the system.
            </p>
          </div>

          <button
            onClick={fetchAuditLogs}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>

        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                    Log ID
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                    Action
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                    Table
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                    Record ID
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                    Date & Time
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      Loading audit logs...
                    </td>
                  </tr>

                ) : logs.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No audit logs found.
                    </td>
                  </tr>

                ) : (

                  logs.map((log) => (

                    <tr
                      key={log.log_id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >

                      <td className="px-5 py-4 text-sm font-medium text-slate-800">
                        #{log.log_id}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {log.full_name || "Unknown User"}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            log.action === "CREATE"
                              ? "bg-green-100 text-green-700"
                              : log.action === "UPDATE"
                              ? "bg-blue-100 text-blue-700"
                              : log.action === "DELETE"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {log.action}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {log.table_name}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {log.record_id}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(log.created_at)}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          {!loading && logs.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
              Showing {logs.length} audit log{logs.length !== 1 ? "s" : ""}
            </div>
          )}

        </div>

      </div>

    </DashboardLayout>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default AuditLogs;