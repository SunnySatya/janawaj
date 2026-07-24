import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaTachometerAlt,
  FaNewspaper,
  FaPoll,
  FaImages,
  FaUsers,
  FaEnvelope,
  FaHistory,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChevronLeft,
  FaHome,
  FaShieldAlt,
} from "react-icons/fa";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const sidebarLinks = [
    { to: "/admin", label: "Dashboard", icon: <FaTachometerAlt />, end: true },
    { to: "/admin/news", label: "News", icon: <FaNewspaper /> },
    { to: "/admin/polls", label: "Polls", icon: <FaPoll /> },
    { to: "/admin/sliders", label: "Sliders", icon: <FaImages /> },
    { to: "/admin/users", label: "Users", icon: <FaUsers /> },
    { to: "/admin/contacts", label: "Messages", icon: <FaEnvelope /> },
    { to: "/admin/login-history", label: "Login History", icon: <FaHistory /> },
  ];

  const isActive = (path, end = false) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-primary-900 to-primary-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-primary-700">
            <div className="flex items-center justify-between">
              <Link to="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <FaShieldAlt className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-[Playfair_Display]">
                    Janawaj
                  </h2>
                  <p className="text-xs text-primary-300 -mt-1">Admin Panel</p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-primary-700 rounded"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to, link.end)
                    ? "bg-white/20 text-white shadow-md"
                    : "text-primary-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-primary-700 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm text-primary-200 hover:text-white hover:bg-white/10 transition-all"
            >
              <FaHome className="text-lg" />
              <span>Back to Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 w-full transition-all"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <FaHome className="w-4 h-4" />
                <span>/</span>
                <span className="text-gray-900 font-medium capitalize">
                  {location.pathname === "/admin"
                    ? "Dashboard"
                    : location.pathname.split("/").pop()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.fullName
                    ? user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "A"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "admin"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
