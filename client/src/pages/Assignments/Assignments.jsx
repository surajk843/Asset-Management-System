import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import {
  FiPlus,
  FiRotateCcw,
  FiX,
} from "react-icons/fi";

import DashboardLayout from "../../layouts/DashboardLayout";

const ASSIGNMENT_API = "http://localhost:5000/api/assignments";
const ASSET_API = "http://localhost:5000/api/assets";
const USER_API = "http://localhost:5000/api/users";

const emptyForm = {
  asset_id: "",
  user_id: "",
  assigned_date: "",
  expected_return_date: "",
  remarks: "",
};

function Assignments() {
  const [assignments, setAssignments] = useState([]);

  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ==========================================
  // GET ASSIGNMENTS
  // ==========================================

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const response = await axios.get(ASSIGNMENT_API, {
        headers,
      });

      setAssignments(response.data);
    } catch (error) {
      console.error("Get Assignments Error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to load assignments");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET AVAILABLE ASSETS
  // ==========================================

  const fetchAssets = async () => {
    try {
      const response = await axios.get(ASSET_API, {
        headers,
        params: {
          page: 1,
          limit: 100,
          sort: "asset_id",
          order: "ASC",
        },
      });

      const availableAssets = response.data.assets.filter(
        (asset) => asset.asset_status === "Available"
      );

      setAssets(availableAssets);
    } catch (error) {
      console.error("Get Assets Error:", error);

      toast.error("Failed to load available assets");
    }
  };

  // ==========================================
  // GET USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      const response = await axios.get(USER_API, {
        headers,
      });

      setUsers(response.data);
    } catch (error) {
      console.error("Get Users Error:", error);

      toast.error("Failed to load users");
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchAssignments();
    fetchAssets();
    fetchUsers();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openModal = () => {
    setFormData({
      ...emptyForm,
      assigned_date: new Date().toISOString().split("T")[0],
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyForm);
  };

  // ==========================================
  // ASSIGN ASSET
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormLoading(true);

      await axios.post(
        ASSIGNMENT_API,
        formData,
        {
          headers,
        }
      );

      toast.success("Asset assigned successfully");

      closeModal();

      await fetchAssignments();
      await fetchAssets();
    } catch (error) {
      console.error("Assign Asset Error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to assign asset");
      }
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // RETURN ASSET
  // ==========================================

  const handleReturn = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to return this asset?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.put(
        `${ASSIGNMENT_API}/return/${assignmentId}`,
        {},
        {
          headers,
        }
      );

      toast.success("Asset returned successfully");

      await fetchAssignments();
      await fetchAssets();
    } catch (error) {
      console.error("Return Asset Error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to return asset");
      }
    }
  };

  return (
    <DashboardLayout>

      <Toaster position="top-right" />

      <div className="space-y-6">

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Asset Assignments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Assign company assets to employees and manage returns.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <FiPlus />

            Assign Asset
          </button>

        </div>

        {/* =====================================
            ASSIGNMENT TABLE
        ====================================== */}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

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
                    Asset Tag
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Employee
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Assigned By
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Assigned Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Expected Return
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (

                  <tr>
                    <td
                      colSpan="9"
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      Loading assignments...
                    </td>
                  </tr>

                ) : assignments.length === 0 ? (

                  <tr>
                    <td
                      colSpan="9"
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No assignments found.
                    </td>
                  </tr>

                ) : (

                  assignments.map((assignment) => (

                    <tr
                      key={assignment.assignment_id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {assignment.assignment_id}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-800">
                        {assignment.asset_name}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {assignment.asset_tag}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {assignment.employee_name}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {assignment.assigned_by}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {assignment.assigned_date
                          ? assignment.assigned_date.substring(0, 10)
                          : "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {assignment.expected_return_date
                          ? assignment.expected_return_date.substring(0, 10)
                          : "-"}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            assignment.assignment_status === "Returned"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {assignment.assignment_status}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        {assignment.assignment_status !== "Returned" ? (

                          <button
                            type="button"
                            onClick={() =>
                              handleReturn(
                                assignment.assignment_id
                              )
                            }
                            className="flex items-center gap-2 rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50"
                          >
                            <FiRotateCcw />

                            Return
                          </button>

                        ) : (

                          <span className="text-xs text-slate-400">
                            Returned
                          </span>

                        )}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* =========================================
          ASSIGN ASSET MODAL
      ========================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Assign Asset
                </h2>

                <p className="text-sm text-slate-500">
                  Assign an available asset to an employee.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-slate-500 hover:text-slate-800"
              >
                <FiX size={22} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5"
            >

              {/* ASSET */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Asset *
                </label>

                <select
                  name="asset_id"
                  value={formData.asset_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
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

                {assets.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    No available assets found.
                  </p>
                )}

              </div>

              {/* USER */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Employee *
                </label>

                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >

                  <option value="">
                    Select employee
                  </option>

                  {users.map((user) => (

                    <option
                      key={user.user_id}
                      value={user.user_id}
                    >
                      {user.full_name} - {user.email}
                    </option>

                  ))}

                </select>

              </div>

              {/* ASSIGNED DATE */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Assigned Date *
                </label>

                <input
                  type="date"
                  name="assigned_date"
                  value={formData.assigned_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

              </div>

              {/* EXPECTED RETURN DATE */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Expected Return Date
                </label>

                <input
                  type="date"
                  name="expected_return_date"
                  value={formData.expected_return_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

              </div>

              {/* REMARKS */}

              <div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Optional remarks"
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading || assets.length === 0}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {formLoading
                    ? "Assigning..."
                    : "Assign Asset"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}

export default Assignments;