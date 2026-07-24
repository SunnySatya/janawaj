const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getSavedNews,
  toggleSavedNews,
} = require("../controllers/authController");

// @route   POST /api/auth/register
router.post(
  "/register",
  [
    body("fullName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])/)
      .withMessage(
        "Password must contain uppercase, lowercase, number, and special character",
      ),
  ],
  validate,
  register,
);

// @route   POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login,
);

// @route   GET /api/auth/me
router.get("/me", protect, getMe);

// @route   PUT /api/auth/profile
router.put("/profile", protect, updateProfile);

// @route   PUT /api/auth/change-password
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters"),
  ],
  validate,
  changePassword,
);

// @route   GET /api/auth/saved-news
router.get("/saved-news", protect, getSavedNews);

// @route   POST /api/auth/saved-news/:newsId
router.post("/saved-news/:newsId", protect, toggleSavedNews);

module.exports = router;
