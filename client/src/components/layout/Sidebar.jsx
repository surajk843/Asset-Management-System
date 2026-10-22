import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {

  const {
    isAdmin,
    isEmployee
  } = useAuth();


  const menuItems = [

    {
      name: "Dashboard",
      path: "/dashboard",
      roles: [1, 2],
    },

    {
      name: "Users",
      path: "/users",
      roles: [1, 2],
    },

    {
      name: "Assets",
      path: "/assets",
      roles: [1, 2],
    },

    {
      name: "Asset Requests",
      path: "/asset-request",
      roles: [1],
    },

    {
      name: "Assignments",
      path: "/assignments",
      roles: [1],
    },

    {
      name: "Reports",
      path: "/reports",
      roles: [1],
    },

    {
      name: "Search",
      path: "/search",
      roles: [1, 2],
    },

    {
      name: "Audit Logs",
      path: "/audit-logs",
      roles: [1],
    },

    {
      name: "Request Asset",
      path: "/request-asset",
      roles: [2],
    },

    {
      name: "Return Asset",
      path: "/return-asset",
      roles: [2],
    },

  ];


  const roleId = isAdmin
    ? 1
    : isEmployee
      ? 2
      : null;


  const visibleMenuItems = menuItems.filter(
    (item) =>
      item.roles.includes(roleId)
  );


  const handleNavigation = () => {

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

  };


  return (
    <>

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Sidebar */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          h-screen w-52 shrink-0
          bg-slate-800 text-white
          transition-transform duration-300
          md:sticky md:top-0 md:z-0
          md:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}

        <div className="flex h-16 items-center border-b border-slate-700 px-6">

          <h2 className="text-lg font-bold">
            AMS
          </h2>

          {/* Close button - mobile */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-2xl text-slate-300 hover:text-white md:hidden"
          >
            ×
          </button>

        </div>


        {/* Navigation */}

        <nav className="p-4">

          <ul className="space-y-2">

            {visibleMenuItems.map((item) => (

              <li key={item.path}>

                <NavLink
                  to={item.path}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2 transition ${
                      isActive
                        ? "bg-slate-700 font-semibold"
                        : "hover:bg-slate-700"
                    }`
                  }
                >
                  {item.name}
                </NavLink>

              </li>

            ))}

          </ul>

        </nav>

      </aside>

    </>
  );
}

export default Sidebar;