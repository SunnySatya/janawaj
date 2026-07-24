import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaImage,
} from "react-icons/fa";
import ImageUploader from "../../components/ImageUploader";

const INITIAL_FORM = {
  title: "",
  description: "",
  image: "",
  link: "",
  order: 0,
};

const AdminSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/sliders/all");
      setSliders(res.data.data);
    } catch (err) {
      setError("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await axios.put(`/api/sliders/${editingId}`, form);
      } else {
        await axios.post("/api/sliders", form);
      }
      resetForm();
      fetchSliders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save slider");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (slider) => {
    setForm({
      title: slider.title,
      description: slider.description || "",
      image: slider.image,
      link: slider.link || "",
      order: slider.order || 0,
    });
    setEditingId(slider._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;
    try {
      await axios.delete(`/api/sliders/${id}`);
      fetchSliders();
    } catch (err) {
      alert("Failed to delete slider");
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const items = sliders.map((s, i) => ({
      id:
        i === index
          ? sliders[index - 1]._id
          : i === index - 1
            ? sliders[index]._id
            : s._id,
      order: i,
    }));
    try {
      await axios.put("/api/sliders/reorder", { items });
      fetchSliders();
    } catch (err) {
      alert("Failed to reorder");
    }
  };

  const handleMoveDown = async (index) => {
    if (index === sliders.length - 1) return;
    const items = sliders.map((s, i) => ({
      id:
        i === index
          ? sliders[index + 1]._id
          : i === index + 1
            ? sliders[index]._id
            : s._id,
      order: i,
    }));
    try {
      await axios.put("/api/sliders/reorder", { items });
      fetchSliders();
    } catch (err) {
      alert("Failed to reorder");
    }
  };

  const toggleActive = async (slider) => {
    try {
      await axios.put(`/api/sliders/${slider._id}`, {
        isActive: !slider.isActive,
      });
      fetchSliders();
    } catch (err) {
      alert("Failed to update slider");
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Slider Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the hero slider images on the homepage
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
          <span>{showForm ? "Cancel" : "Add Slider"}</span>
        </button>
      </div>

      {/* Slider Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Slider" : "Create New Slider"}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Slider title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Brief description"
              />
            </div>
            <div>
              <ImageUploader
                value={form.image}
                onChange={(value) => setForm({ ...form, image: value })}
                label="Image"
                folder="sliders"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL
                </label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="/news/123 or https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: parseInt(e.target.value) || 0 })
                  }
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
                <span>{editingId ? "Update Slider" : "Create Slider"}</span>
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

      {/* Sliders List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {sliders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              No sliders yet. Add your first hero image!
            </div>
          ) : (
            sliders.map((slider, index) => (
              <div
                key={slider._id}
                className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all ${
                  slider.isActive
                    ? "border-green-200"
                    : "border-gray-200 opacity-60"
                }`}
              >
                <div className="flex">
                  {slider.image && (
                    <div className="w-48 h-32 flex-shrink-0 hidden sm:block">
                      <img
                        src={slider.image}
                        alt={slider.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "";
                          e.target.parentElement.innerHTML =
                            '<div class="w-full h-full bg-gray-100 flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900">
                          {slider.title}
                        </h3>
                        {slider.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {slider.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs text-gray-500">
                            Order: {slider.order}
                          </span>
                          <button
                            onClick={() => toggleActive(slider)}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              slider.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {slider.isActive ? "Active" : "Inactive"}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
                          title="Move up"
                        >
                          <FaArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === sliders.length - 1}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
                          title="Move down"
                        >
                          <FaArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleEdit(slider)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(slider._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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

export default AdminSliders;
