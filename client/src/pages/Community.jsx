import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  FaComments,
  FaLightbulb,
  FaBullhorn,
  FaImage,
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaSpinner,
  FaUser,
  FaClock,
  FaPaperPlane,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";

const Community = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [formData, setFormData] = useState({
    content: "",
    category: "General",
  });
  const feedRef = useRef(null);
  const formRef = useRef(null);

  const categories = [
    "All",
    "General",
    "Suggestion",
    "Slider Idea",
    "Topic Suggestion",
  ];

  const categoryIcons = {
    General: <FaComments className="w-4 h-4" />,
    Suggestion: <FaLightbulb className="w-4 h-4" />,
    "Slider Idea": <FaImage className="w-4 h-4" />,
    "Topic Suggestion": <FaBullhorn className="w-4 h-4" />,
  };

  const categoryColors = {
    General: "bg-blue-100 text-blue-700 border-blue-200",
    Suggestion: "bg-amber-100 text-amber-700 border-amber-200",
    "Slider Idea": "bg-purple-100 text-purple-700 border-purple-200",
    "Topic Suggestion": "bg-green-100 text-green-700 border-green-200",
  };

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params =
        activeCategory !== "All" ? { category: activeCategory } : {};
      const res = await axios.get("/api/discussions", { params });
      setPosts(res.data.data || []);
    } catch (err) {
      setError("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!formData.content.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post("/api/discussions", formData);
      setFormData({ content: "", category: "General" });
      setSuccess("Your message has been posted!");
      setTimeout(() => setSuccess(null), 3000);
      fetchPosts();
      // Scroll to feed
      feedRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post message");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.put(`/api/discussions/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                isLiked: res.data.data.isLiked,
                likesCount: res.data.data.likesCount,
              }
            : p,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(`/api/discussions/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

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
    <div className="pt-16 md:pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-4 backdrop-blur-sm">
            <FaComments className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-[Playfair_Display] mb-3">
            Community Voices
          </h1>
          <p className="text-primary-100 text-sm md:text-lg max-w-2xl mx-auto">
            Share your thoughts, suggest slider ideas, propose topics — this is
            your space. Every voice matters in shaping what we discuss next.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Post Form */}
        <div
          ref={formRef}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6 mb-8"
        >
          {!isAuthenticated ? (
            <div className="text-center py-6">
              <FaComments className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">
                Sign in to share your thoughts with the community
              </p>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all duration-200 shadow-md"
              >
                <FaUser className="w-4 h-4" />
                <span>Sign In to Post</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2">
                  <FaExclamationCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {getInitials(user?.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="What's on your mind? Share a suggestion, idea, or topic..."
                    rows={3}
                    maxLength={1000}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-sm bg-gray-50/50"
                    required
                    disabled={submitting}
                  />
                  <div className="text-xs text-gray-400 text-right mt-1">
                    {formData.content.length}/1000
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 font-medium">
                    Category:
                  </span>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                    disabled={submitting}
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting || !formData.content.trim()}
                  className="inline-flex items-center space-x-2 px-5 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-4 h-4" />
                      <span>Post Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Category Filter */}
        <div
          className="flex flex-wrap items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-thin"
          ref={feedRef}
        >
          <span className="text-sm font-medium text-gray-600 mr-1">
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat !== "All" && categoryIcons[cat]}
              <span>{cat === "All" ? "All Posts" : cat}</span>
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <FaComments className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No messages yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Be the first to share your thoughts!
            </p>
            {isAuthenticated && (
              <button
                onClick={() =>
                  formRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Write a message →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  {/* Author Avatar */}
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-700">
                      {getInitials(post.author?.fullName)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {post.author?.fullName || "Anonymous"}
                      </span>
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${categoryColors[post.category] || categoryColors.General}`}
                      >
                        {categoryIcons[post.category]}
                        <span>{post.category}</span>
                      </span>
                      <span className="text-xs text-gray-400 flex items-center space-x-1 ml-auto">
                        <FaClock className="w-3 h-3" />
                        <span>{formatTime(post.createdAt)}</span>
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {post.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 mt-3 pt-2 border-t border-gray-50">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center space-x-1 text-xs transition-colors ${
                          post.isLiked
                            ? "text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      >
                        {post.isLiked ? (
                          <FaHeart className="w-3.5 h-3.5" />
                        ) : (
                          <FaRegHeart className="w-3.5 h-3.5" />
                        )}
                        <span>{post.likesCount || 0}</span>
                      </button>

                      {user &&
                        (post.author?._id === user._id ||
                          user.role === "admin") && (
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <FaTrash className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
