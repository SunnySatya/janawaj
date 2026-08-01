const path = require("path");
const fs = require("fs");

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
);

// Lazy-require cloudinary only when configured
const getCloudinary = () => {
  if (cloudinaryConfigured) {
    return require("../config/cloudinary");
  }
  return null;
};

// @desc    Upload file
// @route   POST /api/upload
// @access  Private/Admin
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const file = req.file;
    let fileUrl;
    let publicId = "";

    if (cloudinaryConfigured && file.path) {
      // Cloudinary storage - file.path is the secure URL
      fileUrl = file.path;
      publicId = file.filename || "";
    } else {
      // Local disk storage
      fileUrl = `/uploads/${file.filename}`;
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename: file.filename,
        url: fileUrl,
        size: file.size,
        mimetype: file.mimetype,
        publicId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private/Admin
exports.uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload files",
      });
    }

    const files = req.files.map((file) => {
      if (cloudinaryConfigured && file.path) {
        return {
          filename: file.filename,
          url: file.path,
          size: file.size,
          mimetype: file.mimetype,
          publicId: file.filename || "",
        };
      }
      return {
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
        publicId: "",
      };
    });

    res.status(200).json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
exports.deleteFile = async (req, res, next) => {
  try {
    const filename = req.params.filename;

    // If Cloudinary is configured and filename looks like a public_id
    // (contains "janawaj/" prefix), delete from Cloudinary.
    if (cloudinaryConfigured && filename && filename.includes("/")) {
      const cloudinary = getCloudinary();
      const result = await cloudinary.uploader.destroy(filename);
      return res.status(200).json({
        success: true,
        message: "File deleted successfully",
        data: result,
      });
    }

    // Fallback: local disk deletion
    const filePath = path.join(__dirname, "../uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    }

    res.status(404).json({
      success: false,
      message: "File not found",
    });
  } catch (error) {
    next(error);
  }
};
