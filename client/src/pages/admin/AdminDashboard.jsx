import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaNewspaper,
  FaPoll,
  FaUsers,
  FaEnvelope,
  FaEye,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
} from "react-icons/fa";

const StatCard = ({ icon, label, value, color, link, change }) => (
  <Link
    to={link}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {change !== undefined && (
          <p
            className={`text-xs mt-1 flex items-center ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change >= 0 ? (
              <FaArrowUp className="mr-1" />
            ) : (
              <FaArrowDown className="mr-1" />
            )}
            {Math.abs(change)}% from last month
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
      >
        <span className="text-white text-xl">{icon}</span>
      </div>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentNews, setRecentNews] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [newsByCategory, setNewsByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/dashboard");
      const { stats, recentNews, recentUsers, newsByCategory } = res.data.data;
      setStats(stats);
      setRecentNews(recentNews);
      setRecentUsers(recentUsers);
      setNewsByCategory(newsByCategory);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p className="font-medium">Error loading dashboard</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchDashboard}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const categoryColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-red-500",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your site.
          </p>
        </div>
        <div className="text-sm text-gray-500 flex items-center space-x-2">
          <FaCalendarAlt className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaNewspaper />}
          label="Total News"
          value={stats?.totalNews || 0}
          color="bg-blue-600"
          link="/admin/news"
        />
        <StatCard
          icon={<FaPoll />}
          label="Total Polls"
          value={stats?.totalPolls || 0}
          color="bg-green-600"
          link="/admin/polls"
        />
        <StatCard
          icon={<FaUsers />}
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="bg-purple-600"
          link="/admin/users"
        />
        <StatCard
          icon={<FaEnvelope />}
          label="Messages"
          value={stats?.totalContacts || 0}
          color="bg-orange-600"
          link="/admin/contacts"
          subtext={`${stats?.unreadContacts || 0} unread`}
        />
      </div>

      {/* Unread Messages Alert */}
      {stats?.unreadContacts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaEnvelope className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              You have <strong>{stats.unreadContacts}</strong> unread message
              {stats.unreadContacts > 1 ? "s" : ""} from your readers.
            </p>
          </div>
          <Link
            to="/admin/contacts"
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
          >
            View Messages
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent News */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent News
              </h2>
              <Link
                to="/admin/news"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentNews.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm">No news articles yet.</p>
            ) : (
              recentNews.map((news) => (
                <div
                  key={news._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {news.title}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full font-medium">
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <FaEye className="w-3 h-3 mr-1" />
                          {news.views || 0} views
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(news.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">
                  Recent Users
                </h2>
                <Link
                  to="/admin/users"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentUsers.length === 0 ? (
                <p className="p-4 text-gray-500 text-xs">No users yet.</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user._id} className="p-3 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* News by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                News by Category
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {newsByCategory.length === 0 ? (
                <p className="text-gray-500 text-xs">No categories yet.</p>
              ) : (
                newsByCategory.map((cat, idx) => (
                  <div key={cat._id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat._id}</span>
                      <span className="text-gray-900 font-medium">
                        {cat.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          categoryColors[idx % categoryColors.length]
                        }`}
                        style={{
                          width: `${
                            (cat.count /
                              Math.max(
                                ...newsByCategory.map((c) => c.count),
                                1,
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
