import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/axios";

function RequestAsset() {
    const [assets, setAssets] = useState([]);
    const [requests, setRequests] = useState([]);

    const [assetId, setAssetId] = useState("");
    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // ==========================================
    // LOAD AVAILABLE ASSETS
    // ==========================================

    const fetchAssets = async () => {
        try {
            const response = await api.get("/assets/search", {
                params: {
                    status: "Available",
                },
            });

            setAssets(response.data);

        } catch (error) {
            console.error("Assets Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load available assets"
            );
        }
    };

    // ==========================================
    // LOAD MY REQUESTS
    // ==========================================

    const fetchRequests = async () => {
        try {
            const response = await api.get("/asset-requests/my");

            setRequests(response.data);

        } catch (error) {
            console.error("Requests Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load requests"
            );
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([
                fetchAssets(),
                fetchRequests(),
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    // ==========================================
    // SUBMIT REQUEST
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!assetId) {
            toast.error("Please select an asset");
            return;
        }

        try {
            setSubmitting(true);

            await api.post("/asset-requests/asset", {
                asset_id: Number(assetId),
                remarks,
            });

            toast.success("Asset request submitted successfully");

            setAssetId("");
            setRemarks("");

            await fetchRequests();
            await fetchAssets();

        } catch (error) {
            console.error("Request Asset Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to submit asset request"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>

            <div className="space-y-6">

                {/* PAGE HEADER */}

                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Request Asset
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Request an available company asset
                    </p>
                </div>


                {/* REQUEST FORM */}

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-slate-800">
                        Submit Asset Request
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Select Asset
                            </label>

                            <select
                                value={assetId}
                                onChange={(e) => setAssetId(e.target.value)}
                                disabled={loading || submitting}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >

                                <option value="">
                                    Select an available asset
                                </option>

                                {assets.map((asset) => (

                                    <option
                                        key={asset.asset_id}
                                        value={asset.asset_id}
                                    >
                                        {asset.asset_name} - {asset.asset_tag}
                                    </option>

                                ))}

                            </select>

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Remarks
                            </label>

                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Why do you need this asset?"
                                rows="3"
                                disabled={submitting}
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={submitting || loading}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
                                ? "Submitting..."
                                : "Request Asset"}
                        </button>

                    </form>

                </div>


                {/* MY REQUESTS */}

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-6 py-5">

                        <h2 className="text-lg font-semibold text-slate-800">
                            My Requests
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
                                        Type
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                        Requested
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
                                            No requests found.
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

                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                                    {request.request_type}
                                                </span>

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

export default RequestAsset;