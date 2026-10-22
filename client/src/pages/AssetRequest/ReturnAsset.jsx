import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/axios";

function ReturnAsset() {

    const [assignments, setAssignments] = useState([]);
    const [requests, setRequests] = useState([]);

    const [selectedAssignment, setSelectedAssignment] = useState("");
    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);


    // ==========================================
    // LOAD MY ASSIGNED ASSETS
    // ==========================================

    const fetchAssignments = async () => {

        try {

            const response = await api.get("/assignments/my");

            setAssignments(response.data);

        } catch (error) {

            console.error("Assignments Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load assigned assets"
            );
        }
    };


    // ==========================================
    // LOAD MY RETURN REQUESTS
    // ==========================================

    const fetchRequests = async () => {

        try {

            const response = await api.get("/asset-requests/my");

            setRequests(
                response.data.filter(
                    (request) => request.request_type === "RETURN"
                )
            );

        } catch (error) {

            console.error("Requests Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load return requests"
            );
        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchAssignments(),
                fetchRequests(),
            ]);

            setLoading(false);
        };

        loadData();

    }, []);


    // ==========================================
    // SUBMIT RETURN REQUEST
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!selectedAssignment) {

            toast.error("Please select an asset");

            return;
        }

        try {

            setSubmitting(true);

            await api.post(
                "/asset-requests/return",
                {
                    assignment_id: Number(selectedAssignment),
                    remarks,
                }
            );

            toast.success(
                "Return request submitted successfully"
            );

            setSelectedAssignment("");
            setRemarks("");

            await fetchRequests();

        } catch (error) {

            console.error("Return Request Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to submit return request"
            );

        } finally {

            setSubmitting(false);

        }
    };


    return (
        <DashboardLayout>

            <div className="space-y-6">

                {/* HEADER */}

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Return Asset
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Request the return of an asset assigned to you
                    </p>

                </div>


                {/* RETURN FORM */}

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-slate-800">
                        Submit Return Request
                    </h2>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Select Assigned Asset
                            </label>

                            <select
                                value={selectedAssignment}
                                onChange={(e) =>
                                    setSelectedAssignment(e.target.value)
                                }
                                disabled={loading || submitting}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >

                                <option value="">
                                    Select an asset
                                </option>

                                {assignments.map((assignment) => (

                                    <option
                                        key={assignment.assignment_id}
                                        value={assignment.assignment_id}
                                    >
                                        {assignment.asset_name} -{" "}
                                        {assignment.asset_tag}
                                    </option>

                                ))}

                            </select>

                            {!loading && assignments.length === 0 && (
                                <p className="mt-2 text-xs text-slate-500">
                                    You currently have no assigned assets.
                                </p>
                            )}

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Remarks
                            </label>

                            <textarea
                                value={remarks}
                                onChange={(e) =>
                                    setRemarks(e.target.value)
                                }
                                placeholder="Add a reason or note..."
                                rows="3"
                                disabled={submitting}
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                loading ||
                                assignments.length === 0
                            }
                            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
                                ? "Submitting..."
                                : "Request Return"}
                        </button>

                    </form>

                </div>


                {/* RETURN REQUEST HISTORY */}

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-6 py-5">

                        <h2 className="text-lg font-semibold text-slate-800">
                            Return Requests
                        </h2>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                        ID
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                        Asset
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                        Requested
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                        Remarks
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {requests.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="px-5 py-10 text-center text-sm text-slate-500"
                                        >
                                            No return requests found.
                                        </td>

                                    </tr>

                                ) : (

                                    requests.map((request) => (

                                        <tr
                                            key={request.request_id}
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {request.request_id}
                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="text-sm font-medium text-slate-800">
                                                    {request.asset_name}
                                                </div>

                                                <div className="text-xs text-slate-400">
                                                    {request.asset_tag}
                                                </div>

                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        request.request_status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : request.request_status === "Approved"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {request.request_status}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">

                                                {new Date(
                                                    request.requested_date
                                                ).toLocaleDateString()}

                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {request.remarks || "-"}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default ReturnAsset;