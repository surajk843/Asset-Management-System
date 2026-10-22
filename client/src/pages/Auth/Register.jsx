import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role_id: 2,
      });

      toast.success("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);

      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-slate-800">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500">
            Register as an employee
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* FULL NAME */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>

          {/* EMAIL */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>

          {/* CONFIRM PASSWORD */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        {/* LOGIN LINK */}

        <div className="mt-6 text-center">

          <p className="text-sm text-slate-500">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;