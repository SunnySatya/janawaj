import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaChartBar,
} from "react-icons/fa";

const POLL_CATEGORIES = [
  "Politics",
  "Technology",
  "Education",
  "Health",
  "Sports",
  "Media",
  "Entertainment",
  "Business",
  "Environment",
  "Other",
];

const AdminPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    category: "Politics",
    expiresInDays: 7,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/polls?limit=50");
      setPolls(res.data.data);
    } catch (err) {
      setError("Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const options = [form.option1, form.option2];
    if (form.option3) options.push(form.option3);
    if (form.option4) options.push(form.option4);

    try {
      const payload = {
        question: form.question,
        options,
        category: form.category,
        expiresInDays: parseInt(form.expiresInDays),
      };

      if (editingId) {
        await axios.put(`/api/polls/${editingId}`, payload);
      } else {
        await axios.post("/api/polls", payload);
      }

      resetForm();
      fetchPolls();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save poll");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (poll) => {
    setForm({
      question: poll.question,
      option1: poll.options[0]?.text || "",
      option2: poll.options[1]?.text || "",
      option3: poll.options[2]?.text || "",
      option4: poll.options[3]?.text || "",
      category: poll.category,
      expiresInDays: 7,
    });
    setEditingId(poll._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;
    try {
      await axios.delete(`/api/polls/${id}`);
      fetchPolls();
    } catch (err) {
      alert("Failed to delete poll");
    }
  };

  const resetForm = () => {
    setForm({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      category: "Politics",
      expiresInDays: 7,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      "ending-soon": "bg-yellow-100 text-yellow-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status] || "bg-gray-100"}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Poll Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage polls for your readers
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {showForm ? <FaTimes /> : <FaPlus />}
          <span>{showForm ? "Cancel" : "Add Poll"}</span>
        </button>
      </div>

      {/* Poll Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Poll" : "Create New Poll"}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question *
              </label>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="What is your opinion on...?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option 1 *
                </label>
                <input
                  type="text"
                  value={form.option1}
                  onChange={(e) =>
                    setForm({ ...form, option1: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Option A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option 2 *
                </label>
                <input
                  type="text"
                  value={form.option2}
                  onChange={(e) =>
                    setForm({ ...form, option2: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Option B"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option 3 (optional)
                </label>
                <input
                  type="text"
                  value={form.option3}
                  onChange={(e) =>
                    setForm({ ...form, option3: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Option C"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option 4 (optional)
                </label>
                <input
                  type="text"
                  value={form.option4}
                  onChange={(e) =>
                    setForm({ ...form, option4: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Option D"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {POLL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires In (days)
                </label>
                <input
                  type="number"
                  value={form.expiresInDays}
                  onChange={(e) =>
                    setForm({ ...form, expiresInDays: e.target.value })
                  }
                  min={1}
                  max={365}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting && <FaSpinner className="animate-spin" />}
                <span>{editingId ? "Update Poll" : "Create Poll"}</span>
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

      {/* Polls List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {polls.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              No polls yet. Create your first one!
            </div>
          ) : (
            polls.map((poll) => (
              <div
                key={poll._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusBadge(poll.status)}
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                        {poll.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {poll.totalVotes || 0} vote
                        {(poll.totalVotes || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {poll.question}
                    </h3>
                    <div className="mt-2 space-y-1.5">
                      {poll.options?.map((opt, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600">{opt.text}</span>
                          <span className="text-gray-500 font-medium">
                            {typeof opt.votes === "number"
                              ? opt.votes
                              : opt.votes?.length || 0}{" "}
                            votes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(poll)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(poll._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPolls;
