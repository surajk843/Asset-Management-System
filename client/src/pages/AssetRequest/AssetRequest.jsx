// src/pages/AssetRequest/AssetRequest.jsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

function AssetRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/asset-requests");

      setRequests(response.data);
    } catch (error) {
      console.error("Asset Request Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load asset requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      setProcessingId(requestId);

      await api.put(
        `/asset-requests/approve/${requestId}`
      );

      toast.success("Asset request approved successfully");

      await fetchRequests();
    } catch (error) {
      console.error("Approve Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to approve asset request"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);

      await api.put(
        `/asset-requests/reject/${requestId}`
      );

      toast.success("Asset request rejected");

      await fetchRequests();
    } catch (error) {
      console.error("Reject Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to reject asset request"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Asset Requests
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage employee asset requests.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading asset requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No asset requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b bg-slate-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Asset
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Requested Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {requests.map((request) => (

                    <tr
                      key={request.request_id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {request.request_id}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {request.employee_name ||
                            request.full_name ||
                            `User ${request.user_id}`}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {request.asset_name ||
                            `Asset ${request.asset_id}`}
                        </p>

                        {request.asset_tag && (
                          <p className="mt-1 text-xs text-slate-500">
                            {request.asset_tag}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {request.request_type}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatDate(request.requested_date)}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            request.request_status
                          )}`}
                        >
                          {request.request_status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        {request.request_status === "Pending" ? (

                          <div className="flex gap-2">

                            <button
                              type="button"
                              disabled={
                                processingId ===
                                request.request_id
                              }
                              onClick={() =>
                                handleApprove(
                                  request.request_id
                                )
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processingId ===
                              request.request_id
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                processingId ===
                                request.request_id
                              }
                              onClick={() =>
                                handleReject(
                                  request.request_id
                                )
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processingId ===
                              request.request_id
                                ? "Processing..."
                                : "Reject"}
                            </button>

                          </div>

                        ) : (

                          <span className="text-xs text-slate-400">
                            Processed
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}

export default AssetRequest;    