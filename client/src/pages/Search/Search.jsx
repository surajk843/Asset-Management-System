import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import {
  FiSearch,
  FiPackage,
  FiUsers,
  FiFolder,
  FiClipboard,
} from "react-icons/fi";

import DashboardLayout from "../../layouts/DashboardLayout";

const SEARCH_API =
  "http://localhost:5000/api/dashboard/global-search";

function Search() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState({
    assets: [],
    users: [],
    categories: [],
    assignments: [],
  });

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const token = localStorage.getItem("token");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) {
      toast.error("Please enter something to search");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(SEARCH_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword: keyword.trim(),
        },
      });

      setResults(response.data);
      setSearched(true);
    } catch (error) {
      console.error("Global Search Error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Search failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalResults =
    results.assets.length +
    results.users.length +
    results.categories.length +
    results.assignments.length;

  return (
    <DashboardLayout>
      <Toaster position="top-right" />

      <div className="space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Global Search
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Search assets, users, categories and assignments.
          </p>
        </div>

        {/* SEARCH BOX */}

        <form
          onSubmit={handleSearch}
          className="rounded-xl bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">

              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search asset, employee, category..."
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSearch />

              {loading ? "Searching..." : "Search"}
            </button>

          </div>
        </form>

        {/* RESULT COUNT */}

        {searched && (
          <div className="text-sm text-slate-500">
            {totalResults} result
            {totalResults !== 1 ? "s" : ""} found for{" "}
            <span className="font-semibold text-slate-800">
              "{keyword}"
            </span>
          </div>
        )}

        {/* ==================================================
            ASSETS
        ================================================== */}

        {searched && (
          <ResultSection
            title="Assets"
            icon={<FiPackage />}
            count={results.assets.length}
          >
            {results.assets.length === 0 ? (
              <EmptyResult />
            ) : (
              results.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="font-semibold text-slate-800">
                        {asset.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Asset Tag: {asset.asset_tag}
                      </p>

                      <p className="text-sm text-slate-500">
                        Brand: {asset.brand}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {asset.asset_status}
                    </span>

                  </div>
                </div>
              ))
            )}
          </ResultSection>
        )}

        {/* ==================================================
            USERS
        ================================================== */}

        {searched && (
          <ResultSection
            title="Users"
            icon={<FiUsers />}
            count={results.users.length}
          >
            {results.users.length === 0 ? (
              <EmptyResult />
            ) : (
              results.users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <p className="font-semibold text-slate-800">
                    {user.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              ))
            )}
          </ResultSection>
        )}

        {/* ==================================================
            CATEGORIES
        ================================================== */}

        {searched && (
          <ResultSection
            title="Categories"
            icon={<FiFolder />}
            count={results.categories.length}
          >
            {results.categories.length === 0 ? (
              <EmptyResult />
            ) : (
              results.categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <p className="font-semibold text-slate-800">
                    {category.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Category ID: {category.id}
                  </p>
                </div>
              ))
            )}
          </ResultSection>
        )}

        {/* ==================================================
            ASSIGNMENTS
        ================================================== */}

        {searched && (
          <ResultSection
            title="Assignments"
            icon={<FiClipboard />}
            count={results.assignments.length}
          >
            {results.assignments.length === 0 ? (
              <EmptyResult />
            ) : (
              results.assignments.map((assignment) => (
                <div
                  key={assignment.assignment_id}
                  className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="font-semibold text-slate-800">
                        {assignment.asset_name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Employee: {assignment.full_name}
                      </p>

                      <p className="text-xs text-slate-400">
                        Assignment ID: {assignment.assignment_id}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {assignment.assignment_status}
                    </span>

                  </div>
                </div>
              ))
            )}
          </ResultSection>
        )}

        {/* INITIAL STATE */}

        {!searched && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">

            <FiSearch
              className="mx-auto text-slate-300"
              size={48}
            />

            <h2 className="mt-4 text-lg font-semibold text-slate-700">
              Search your Asset Management System
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Search by asset name, asset tag, brand, employee,
              email, category or assignment status.
            </p>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

/* ======================================================
   RESULT SECTION
====================================================== */

function ResultSection({ title, icon, count, children }) {
  return (
    <div className="rounded-xl bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-100 p-5">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
            {icon}
          </div>

          <h2 className="font-semibold text-slate-800">
            {title}
          </h2>

        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {count}
        </span>

      </div>

      <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2">
        {children}
      </div>

    </div>
  );
}

/* ======================================================
   EMPTY RESULT
====================================================== */

function EmptyResult() {
  return (
    <div className="col-span-full py-5 text-center text-sm text-slate-400">
      No results found.
    </div>
  );
}

export default Search;