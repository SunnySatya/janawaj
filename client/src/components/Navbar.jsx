import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaTimes,
  FaNewspaper,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaChevronDown,
  FaComments,
  FaShieldAlt,
} from "react-icons/fa";
import { HiHome, HiMail, HiAcademicCap } from "react-icons/hi";
import { MdPoll } from "react-icons/md";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <HiHome className="w-5 h-5" /> },
    {
      to: "/about",
      label: "About",
      icon: <HiAcademicCap className="w-5 h-5" />,
    },
    {
      to: "/community",
      label: "Community",
      icon: <FaComments className="w-5 h-5" />,
    },
    { to: "/polls", label: "Polls", icon: <MdPoll className="w-5 h-5" /> },
    { to: "/contact", label: "Contact", icon: <HiMail className="w-5 h-5" /> },
  ];

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-r from-primary-900 to-primary-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <FaNewspaper
                className={`w-5 h-5 md:w-6 md:h-6 ${scrolled ? "text-primary-600" : "text-primary-700"}`}
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-xl md:text-2xl font-bold font-[Playfair_Display] tracking-tight leading-tight ${
                  scrolled ? "text-gray-900" : "text-white"
                }`}
              >
                Janawaj
              </span>
              <span
                className={`text-[10px] md:text-xs font-medium uppercase tracking-widest leading-tight ${
                  scrolled ? "text-primary-500" : "text-primary-200"
                }`}
              >
                News Agency
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? scrolled
                      ? "bg-primary-50 text-primary-700"
                      : "bg-white/20 text-white"
                    : scrolled
                      ? "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    scrolled
                      ? "hover:bg-gray-50 text-gray-700"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user.fullName)}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border ${
                      scrolled
                        ? "bg-white border-gray-200"
                        : "bg-white border-gray-100"
                    } py-1.5`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                      >
                        <FaShieldAlt className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    scrolled
                      ? "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <FaSignInAlt className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-xl ${
                    scrolled
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-white text-primary-700 hover:bg-gray-100"
                  }`}
                >
                  <FaUserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
              scrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`${scrolled ? "bg-white border-t border-gray-100" : "bg-primary-800"} px-4 py-3 space-y-1`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? scrolled
                    ? "bg-primary-50 text-primary-700"
                    : "bg-white/20 text-white"
                  : scrolled
                    ? "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    scrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user.fullName)}
                  </div>
                  <span className="text-sm font-medium truncate">
                    {user.fullName}
                  </span>
                </div>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      scrolled
                        ? "text-purple-700 hover:bg-purple-50"
                        : "text-purple-300 hover:bg-white/10"
                    }`}
                  >
                    <FaShieldAlt className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-50/10 w-full transition-all duration-200"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    scrolled
                      ? "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <FaSignInAlt className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold ${
                    scrolled
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-white text-primary-700 hover:bg-gray-100"
                  } transition-all duration-200`}
                >
                  <FaUserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
