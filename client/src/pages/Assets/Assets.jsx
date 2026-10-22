import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/assets`;

const emptyForm = {
  asset_name: "",
  asset_tag: "",
  serial_number: "",
  category_id: "",
  brand: "",
  model: "",
  purchase_date: "",
  purchase_price: "",
  vendor_name: "",
  invoice_number: "",
  warranty_start: "",
  warranty_end: "",
  asset_status: "Available",
};

function Assets() {
  const { user } = useAuth();

  const isAdmin = user?.role_id === 1;

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sort, setSort] = useState("asset_id");
  const [order, setOrder] = useState("ASC");

  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ==========================================
  // GET ASSETS
  // ==========================================

  const fetchAssets = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL, {
        headers,
        params: {
          page,
          limit: 5,
          sort,
          order,
        },
      });

      setAssets(response.data.assets);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Get Assets Error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to load assets");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL / PAGINATION / SORTING FETCH
  // ==========================================

  useEffect(() => {
    fetchAssets();
  }, [page, sort, order]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/search`, {
        headers,
        params: {
          name: searchName,
          brand: searchBrand,
          status: searchStatus,
          category: searchCategory,
        },
      });

      setAssets(response.data);
      setTotalPages(1);
      setPage(1);
    } catch (error) {
      console.error("Search Assets Error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to search assets");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const handleClearSearch = () => {
    setSearchName("");
    setSearchBrand("");
    setSearchStatus("");
    setSearchCategory("");

    setPage(1);

    fetchAssets();
  };

  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {
    setEditingAsset(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (asset) => {
    setEditingAsset(asset);

    setFormData({
      asset_name: asset.asset_name || "",
      asset_tag: asset.asset_tag || "",
      serial_number: asset.serial_number || "",
      category_id: asset.category_id || "",
      brand: asset.brand || "",
      model: asset.model || "",
      purchase_date: asset.purchase_date
        ? asset.purchase_date.substring(0, 10)
        : "",
      purchase_price: asset.purchase_price || "",
      vendor_name: asset.vendor_name || "",
      invoice_number: asset.invoice_number || "",
      warranty_start: asset.warranty_start
        ? asset.warranty_start.substring(0, 10)
        : "",
      warranty_end: asset.warranty_end
        ? asset.warranty_end.substring(0, 10)
        : "",
      asset_status: asset.asset_status || "Available",
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);
    setEditingAsset(null);
    setFormData(emptyForm);
  };

  // ==========================================
  // CREATE / UPDATE ASSET
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAsset) {
        await axios.put(
          `${API_URL}/${editingAsset.asset_id}`,
          formData,
          {
            headers,
          }
        );

        toast.success("Asset updated successfully");
      } else {
        await axios.post(API_URL, formData, {
          headers,
        });

        toast.success("Asset created successfully");
      }

      closeModal();
      fetchAssets();
    } catch (error) {
      console.error("Asset Save Error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to save asset");
      }
    }
  };

  // ==========================================
  // SOFT DELETE
  // ==========================================

  const handleDelete = async (assetId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this asset?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${assetId}`, {
        headers,
      });

      toast.success("Asset deleted successfully");

      fetchAssets();
    } catch (error) {
      console.error("Delete Asset Error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete asset");
      }
    }
  };

  // ==========================================
  // SORT
  // ==========================================

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setSort(field);
      setOrder("ASC");
    }

    setPage(1);
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" />

      <div className="space-y-6">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Assets
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage company assets
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <FiPlus />
              Add Asset
            </button>
          )}

        </div>

        {/* =====================================
            SEARCH
        ====================================== */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            <input
              type="text"
              placeholder="Asset name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Brand"
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />

            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Retired">Retired</option>
            </select>

            <input
              type="number"
              placeholder="Category ID"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />

          </div>

          <div className="mt-4 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <FiSearch />
              Search
            </button>

            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Clear
            </button>

          </div>

        </div>

        {/* =====================================
            TABLE
        ====================================== */}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th
                    onClick={() => handleSort("asset_id")}
                    className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500"
                  >
                    ID
                  </th>

                  <th
                    onClick={() => handleSort("asset_name")}
                    className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500"
                  >
                    Asset
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Tag
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Category
                  </th>

                  <th
                    onClick={() => handleSort("brand")}
                    className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500"
                  >
                    Brand
                  </th>

                  <th
                    onClick={() => handleSort("asset_status")}
                    className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500"
                  >
                    Status
                  </th>

                  {isAdmin && (
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Actions
                    </th>
                  )}

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (

                  <tr>
                    <td
                      colSpan={isAdmin ? 7 : 6}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      Loading assets...
                    </td>
                  </tr>

                ) : assets.length === 0 ? (

                  <tr>
                    <td
                      colSpan={isAdmin ? 7 : 6}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No assets found.
                    </td>
                  </tr>

                ) : (

                  assets.map((asset) => (

                    <tr
                      key={asset.asset_id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {asset.asset_id}
                      </td>

                      <td className="px-5 py-4">

                        <div className="text-sm font-medium text-slate-800">
                          {asset.asset_name}
                        </div>

                        <div className="text-xs text-slate-400">
                          {asset.model}
                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {asset.asset_tag}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {asset.category_name}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {asset.brand}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            asset.asset_status === "Available"
                              ? "bg-green-100 text-green-700"
                              : asset.asset_status === "Assigned"
                              ? "bg-blue-100 text-blue-700"
                              : asset.asset_status === "Maintenance"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {asset.asset_status}
                        </span>

                      </td>

                      {isAdmin && (
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <button
                              type="button"
                              onClick={() => openEditModal(asset)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <FiEdit2 size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(asset.asset_id)
                              }
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
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

          {/* =====================================
              PAGINATION
          ====================================== */}

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>

            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((previous) => previous - 1)}
                className="rounded-lg border border-slate-300 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft />
              </button>

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((previous) => previous + 1)}
                className="rounded-lg border border-slate-300 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronRight />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          CREATE / EDIT MODAL
      ========================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingAsset ? "Edit Asset" : "Add Asset"}
                </h2>

                <p className="text-sm text-slate-500">
                  {editingAsset
                    ? "Update asset information"
                    : "Enter asset information"}
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
              className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2"
            >

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Asset Name *
                </label>

                <input
                  type="text"
                  name="asset_name"
                  value={formData.asset_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Asset Tag *
                </label>

                <input
                  type="text"
                  name="asset_tag"
                  value={formData.asset_tag}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Serial Number *
                </label>

                <input
                  type="text"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Category ID *
                </label>

                <input
                  type="number"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Enter the existing category ID from MySQL.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Brand *
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Model *
                </label>

                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Purchase Date *
                </label>

                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Purchase Price *
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="purchase_price"
                  value={formData.purchase_price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Vendor Name
                </label>

                <input
                  type="text"
                  name="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Invoice Number
                </label>

                <input
                  type="text"
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Warranty Start
                </label>

                <input
                  type="date"
                  name="warranty_start"
                  value={formData.warranty_start}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Warranty End
                </label>

                <input
                  type="date"
                  name="warranty_end"
                  value={formData.warranty_end}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {editingAsset && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Asset Status
                  </label>

                  <select
                    name="asset_status"
                    value={formData.asset_status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              )}

              {/* FORM BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 md:col-span-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingAsset ? "Update Asset" : "Create Asset"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}

export default Assets;