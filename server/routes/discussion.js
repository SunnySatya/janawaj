const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const validate = require("../middleware/validate");
const { protect, optionalAuth } = require("../middleware/auth");
const {
  createPost,
  getPosts,
  toggleLike,
  deletePost,
} = require("../controllers/discussionController");

// Public route (with optional auth for isLiked detection)
router.get("/", optionalAuth, getPosts);

// Protected routes
router.post(
  "/",
  protect,
  [
    body("content")
      .trim()
      .isLength({ min: 2, max: 1000 })
      .withMessage("Content must be between 2 and 1000 characters")
      .escape(),
    body("category")
      .optional()
      .isIn(["General", "Suggestion", "Slider Idea", "Topic Suggestion"])
      .withMessage("Please select a valid category"),
  ],
  validate,
  createPost,
);

router.put("/:id/like", protect, toggleLike);
router.delete("/:id", protect, deletePost);

module.exports = router;
