const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");
const News = require("../models/News");
const Poll = require("../models/Poll");
const Contact = require("../models/Contact");

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const [
        totalUsers,
        totalNews,
        totalPolls,
        totalContacts,
        unreadContacts,
        recentNews,
        recentUsers,
        newsByCategory,
      ] = await Promise.all([
        User.countDocuments(),
        News.countDocuments(),
        Poll.countDocuments(),
        Contact.countDocuments(),
        Contact.countDocuments({ isRead: false }),
        News.find()
          .sort("-createdAt")
          .limit(5)
          .select("title category views publishedAt"),
        User.find()
          .sort("-createdAt")
          .limit(5)
          .select("fullName email role createdAt"),
        News.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);

      res.status(200).json({
        success: true,
        data: {
          stats: {
            totalUsers,
            totalNews,
            totalPolls,
            totalContacts,
            unreadContacts,
          },
          recentNews,
          recentUsers,
          newsByCategory,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
router.get("/users", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const query = {};
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
router.put(
  "/users/:id/role",
  protect,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const { role } = req.body;
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be "user" or "admin"',
        });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true },
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
);

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent deleting self
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      await user.deleteOne();

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
