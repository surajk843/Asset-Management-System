import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar({ setSidebarOpen }) {

  const {
    user,
    logout
  } = useAuth();

  const navigate = useNavigate();


  const handleLogout = () => {

    logout();

    navigate("/login", {
      replace: true
    });

  };


  return (

    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm sm:px-6">

      {/* Left Side */}

      <div className="flex min-w-0 items-center gap-3">

        {/* Hamburger */}

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Open menu"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />

          </svg>

        </button>


        {/* Title */}

        <h1 className="truncate text-lg font-bold text-slate-800 sm:text-xl">
          Asset Management System
        </h1>

      </div>


      {/* Right Side */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">

        {/* Welcome */}

        <span className="hidden text-sm font-medium text-gray-600 sm:block">

          Welcome, {user?.full_name || "User"}

        </span>


        {/* Profile */}

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 sm:px-4"
        >
          Profile
        </button>


        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:px-4"
        >
          Logout
        </button>

      </div>

    </header>

  );
}

export default Navbar;