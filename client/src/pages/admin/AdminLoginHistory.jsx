import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaTrash,
  FaUser,
  FaGlobe,
  FaCalendarAlt,
  FaQuestionCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const AdminLoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterSuccess, setFilterSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchLoginHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (searchEmail) params.email = searchEmail;
      if (filterSuccess) params.success = filterSuccess;

      const [historyRes, statsRes] = await Promise.all([
        axios.get("/api/login-history", { params }),
        axios.get("/api/login-history/stats"),
      ]);

      setLoginHistory(historyRes.data.data);
      setTotalPages(historyRes.data.totalPages);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load login history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
  }, [page, filterSuccess]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLoginHistory();
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all login history?"))
      return;
    try {
      await axios.delete("/api/login-history");
      setLoginHistory([]);
      setStats({
        totalAttempts: 0,
        successfulLogins: 0,
        failedLogins: 0,
        uniqueUsers: 0,
        successRate: 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear history");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !loginHistory.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Playfair_Display]">
            Login History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all login attempts on the platform
          </p>
        </div>
        <button
          onClick={handleClearHistory}
          className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
        >
          <FaTrash className="w-4 h-4" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
          <FaExclamationTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Total Attempts</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalAttempts}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Successful</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.successfulLogins}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.failedLogins}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Unique Users</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.uniqueUsers}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-primary-600">
              {stats.successRate}%
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
              />
            </div>
          </div>
          <select
            value={filterSuccess}
            onChange={(e) => {
              setFilterSuccess(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Successful</option>
            <option value="false">Failed</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Login History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User / Email
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User Agent
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loginHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <FaHistory className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No login history found</p>
                  </td>
                </tr>
              ) : (
                loginHistory.map((entry) => (
                  <tr
                    key={entry._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {entry.user ? (
                            <img
                              src={entry.user.avatar || "/default-avatar.png"}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML = `<FaUser class="w-4 h-4 text-gray-400" />`;
                              }}
                            />
                          ) : (
                            <FaUser className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {entry.user?.fullName || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">{entry.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {entry.success ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                          <FaCheckCircle className="w-3 h-3" />
                          <span>Success</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                          <FaTimesCircle className="w-3 h-3" />
                          <span>{entry.failureReason || "Failed"}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 font-mono text-xs">
                        {entry.ipAddress}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p
                        className="text-xs text-gray-500 truncate"
                        title={entry.userAgent}
                      >
                        {entry.userAgent}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(entry.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginHistory;
