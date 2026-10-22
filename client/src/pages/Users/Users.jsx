import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService";

function Users() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "2",
  });

  const isAdmin = user?.role_id === 1;

  // -----------------------------------
  // GET USERS
  // -----------------------------------

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error("Users Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -----------------------------------
  // SEARCH
  // -----------------------------------

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return users;
    }

    return users.filter((item) => {
      return (
        item.full_name?.toLowerCase().includes(searchValue) ||
        item.email?.toLowerCase().includes(searchValue)
      );
    });
  }, [users, search]);

  // -----------------------------------
  // FORM INPUT
  // -----------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -----------------------------------
  // OPEN CREATE MODAL
  // -----------------------------------

  const openCreateModal = () => {
    setEditingUser(null);

    setFormData({
      full_name: "",
      email: "",
      password: "",
      role_id: "2",
    });

    setShowModal(true);
  };

  // -----------------------------------
  // OPEN EDIT MODAL
  // -----------------------------------

  const openEditModal = (item) => {
    setEditingUser(item);

    setFormData({
      full_name: item.full_name || "",
      email: item.email || "",
      password: "",
      role_id: String(item.role_id),
    });

    setShowModal(true);
  };

  // -----------------------------------
  // CLOSE MODAL
  // -----------------------------------

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingUser(null);

    setFormData({
      full_name: "",
      email: "",
      password: "",
      role_id: "2",
    });
  };

  // -----------------------------------
  // CREATE / UPDATE
  // -----------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    if (!editingUser && !formData.password) {
      toast.error("Password is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role_id: Number(formData.role_id),
      };

      if (editingUser) {
        await updateUser(editingUser.user_id, payload);

        toast.success("User updated successfully.");
      } else {
        await createUser(payload);

        toast.success("User created successfully.");
      }

      closeModal();

      await fetchUsers();
    } catch (error) {
      console.error("Save User Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------
  // DELETE USER
  // -----------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(id);

      toast.success("User deleted successfully.");

      await fetchUsers();
    } catch (error) {
      console.error("Delete User Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete user."
      );
    }
  };

  // -----------------------------------
  // ROLE NAME
  // -----------------------------------

  const getRoleName = (roleId) => {
    if (Number(roleId) === 1) {
      return "Admin";
    }

    if (Number(roleId) === 2) {
      return "Employee";
    }

    return "Unknown";
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" />

      <div className="space-y-6">

        {/* PAGE HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage system users and their roles.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <FiPlus size={18} />

              Add User
            </button>
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SEARCH */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="relative max-w-md">

            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>

        {/* USERS TABLE */}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px] text-left text-sm">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">

                  <th className="px-6 py-4 font-medium">
                    ID
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Full Name
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Email
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Role
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Created At
                  </th>

                  {isAdmin && (
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  )}

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan={isAdmin ? 6 : 5}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isAdmin ? 6 : 5}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item) => (
                    <tr
                      key={item.user_id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-4 font-medium text-slate-700">
                        {item.user_id}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-800">
                        {item.full_name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {item.email}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            Number(item.role_id) === 1
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {getRoleName(item.role_id)}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {item.created_at
                          ? new Date(
                              item.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {isAdmin && (
                        <td className="px-6 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(item)
                              }
                              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                              title="Edit User"
                            >
                              <FiEdit2 size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(item.user_id)
                              }
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                              title="Delete User"
                            >
                              <FiTrash2 size={17} />
                            </button>

                          </div>

                        </td>
                      )}

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

          {/* TABLE FOOTER */}

          {!loading && (
            <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          )}

        </div>

      </div>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingUser
                    ? "Edit User"
                    : "Create User"}
                </h2>

                <p className="text-sm text-slate-500">
                  {editingUser
                    ? "Update user information."
                    : "Add a new system user."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* FULL NAME */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editingUser
                      ? "Enter new password"
                      : "Enter password"
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {editingUser && (
                  <p className="mt-1 text-xs text-slate-400">
                    Enter the password required by the existing
                    update API.
                  </p>
                )}
              </div>

              {/* ROLE */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="2">
                    Employee
                  </option>

                  <option value="1">
                    Admin
                  </option>
                </select>
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingUser
                    ? "Update User"
                    : "Create User"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}

export default Users;