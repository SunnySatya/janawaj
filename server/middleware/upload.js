const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Determine if Cloudinary is configured
const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
);

let storage;
let upload;

if (cloudinaryConfigured) {
  // ===== Cloudinary storage (production) =====
  const { CloudinaryStorage } = require("multer-storage-cloudinary");
  const cloudinary = require("../config/cloudinary");

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "janawaj",
      allowed_formats: ["jpeg", "jpg", "png", "gif", "webp", "svg"],
      transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
    },
  });

  upload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
      const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase(),
      );
      const mimetype = allowedTypes.test(file.mimetype);
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Only image files (jpeg, jpg, png, gif, webp, svg) are allowed",
          ),
          false,
        );
      }
    },
  });
} else {
  // ===== Local disk storage (development fallback) =====
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files (jpeg, jpg, png, gif, webp, svg) are allowed",
        ),
        false,
      );
    }
  };

  upload = multer({
    storage: diskStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter,
  });
}

module.exports = upload;
