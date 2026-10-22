import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/axios";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Backend Response:", response.data);

      const { token, user } = response.data;

      console.log("JWT Token:", token);
      console.log("User Data:", user);

      login(user, token);

      toast.success("Login successful!");

      navigate("/dashboard", { replace: true });
    }  catch (error) {
  const message =
    error.response?.data?.message ||
    "Login failed. Please try again.";

  toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
} finally {
  setLoading(false);
}
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Asset Management System
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
        <div className="mt-6 text-center">

  <p className="text-sm text-slate-500">
    Don't have an account?{" "}

    <Link
      to="/register"
      className="font-semibold text-blue-600 hover:text-blue-700"
    >
      Register
    </Link>
  </p>

</div>
      </div>
    </div>
  );
}

export default Login;