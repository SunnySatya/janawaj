const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toggleLike,
  toggleSave,
  shareNews,
  getNewsByCategory,
} = require("../controllers/newsController");

// Public routes
router.get("/", getNews);
router.get("/category/:category", getNewsByCategory);
router.get("/:id", getNewsById);
router.put("/:id/share", shareNews);

// Protected routes (authenticated users)
router.put("/:id/like", protect, toggleLike);
router.put("/:id/save", protect, toggleSave);

// Admin routes
router.post("/", protect, authorize("admin"), createNews);
router.put("/:id", protect, authorize("admin"), updateNews);
router.delete("/:id", protect, authorize("admin"), deleteNews);

module.exports = router;
