const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
} = require("../controllers/uploadController");

// Admin routes (protected)
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("file"),
  uploadFile,
);
router.post(
  "/multiple",
  protect,
  authorize("admin"),
  upload.array("files", 10),
  uploadMultipleFiles,
);
router.delete("/:filename", protect, authorize("admin"), deleteFile);

module.exports = router;
