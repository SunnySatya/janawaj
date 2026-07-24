import React, { useState, useRef } from "react";
import axios from "axios";
import {
  FaSpinner,
  FaCloudUploadAlt,
  FaTimes,
  FaImage,
  FaCheck,
} from "react-icons/fa";

const ImageUploader = ({
  value,
  onChange,
  label = "Image",
  folder = "news",
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [uploadError, setUploadError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Only image files (jpeg, jpg, png, gif, webp, svg) are allowed",
      );
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = res.data.data.url;
      setPreview(uploadedUrl);
      onChange(uploadedUrl);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to upload image";
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    setUploadError(null);
  };

  const handleUrlInput = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {!value && <span className="text-red-500">*</span>}
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-2">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              `;
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
            title="Remove image"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload Drop Zone */}
      {!preview && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
              <p className="text-sm text-gray-500">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <FaCloudUploadAlt className="w-10 h-10 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Click or drag & drop to upload
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPEG, PNG, GIF, WebP, SVG (max 5MB)
                </p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      {/* Or paste URL */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <div className="relative">
        <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={value || ""}
          onChange={handleUrlInput}
          placeholder="Paste image URL..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        />
        {value && (
          <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <FaTimes className="w-3 h-3 flex-shrink-0" />
          <span>{uploadError}</span>
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
