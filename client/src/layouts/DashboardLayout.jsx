import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function DashboardLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex min-h-screen">

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="min-w-0 flex-1">

          <Navbar
            setSidebarOpen={setSidebarOpen}
          />

          <main className="p-4 sm:p-6">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;