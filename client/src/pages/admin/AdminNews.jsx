import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSpinner,
  FaSearch,
  FaTimes,
  FaCheck,
  FaStar,
  FaBolt,
  FaImage,
  FaTimesCircle,
} from "react-icons/fa";
import ImageUploader from "../../components/ImageUploader";

const CATEGORIES = [
  "National",
  "International",
  "Politics",
  "Technology",
  "Sports",
  "Entertainment",
  "Business",
  "Health",
  "Science",
  "Education",
  "Environment",
  "Other",
];

const INITIAL_FORM = {
  title: "",
  description: "",
  content: "",
  category: "National",
  tags: "",
  isFeatured: false,
  isBreaking: false,
  isPublished: true,
  image: "",
};

const AdminNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/news?page=${page}&limit=20`);
      setNewsList(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await axios.put(`/api/news/${editingId}`, payload);
      } else {
        await axios.post("/api/news", payload);
      }

      resetForm();
      fetchNews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save news");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (news) => {
    setForm({
      title: news.title,
      description: news.description,
      content: news.content,
      category: news.category,
      tags: news.tags?.join(", ") || "",
      isFeatured: news.isFeatured,
      isBreaking: news.isBreaking,
      isPublished: news.isPublished,
      image: news.image || "",
    });
    setEditingId(news._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news article?"))
      return;
    try {
      await axios.delete(`/api/news/${id}`);
      fetchNews();
    } catch (err) {
      alert("Failed to delete news");
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const filteredNews = newsList.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.category?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit and manage news articles
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? <FaTimes /> : <FaPlus />}
          <span>{showForm ? "Cancel" : "Add News"}</span>
        </button>
      </div>

      {/* News Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit News" : "Create New News"}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter news title"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief description"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                  placeholder="Full news content..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <ImageUploader
                  value={form.image}
                  onChange={(value) => setForm({ ...form, image: value })}
                  label="Image"
                  folder="news"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="politics, election, india"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <FaStar
                  className={`w-4 h-4 ${form.isFeatured ? "text-yellow-500" : "text-gray-300"}`}
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isBreaking}
                  onChange={(e) =>
                    setForm({ ...form, isBreaking: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <FaBolt
                  className={`w-4 h-4 ${form.isBreaking ? "text-red-500" : "text-gray-300"}`}
                />
                <span className="text-sm text-gray-700">Breaking News</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm({ ...form, isPublished: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <FaCheck
                  className={`w-4 h-4 ${form.isPublished ? "text-green-500" : "text-gray-300"}`}
                />
                <span className="text-sm text-gray-700">Published</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting && <FaSpinner className="animate-spin" />}
                <span>{editingId ? "Update News" : "Create News"}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search news by title or category..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* News Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Category
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Views
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Featured
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Published
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredNews.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {search
                        ? "No news matching your search"
                        : "No news articles yet. Create your first one!"}
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((news) => (
                    <tr key={news._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {news.title}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">
                          {news.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                          <FaEye className="w-3 h-3" />
                          <span>{news.views || 0}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {news.isFeatured ? (
                          <FaStar className="w-4 h-4 text-yellow-500 mx-auto" />
                        ) : (
                          <FaStar className="w-4 h-4 text-gray-200 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {news.isPublished ? (
                          <FaCheck className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <FaTimesCircle className="w-4 h-4 text-red-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(news)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(news._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNews;
