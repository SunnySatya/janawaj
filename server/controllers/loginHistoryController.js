const LoginHistory = require("../models/LoginHistory");

// @desc    Get all login history (Admin only)
// @route   GET /api/login-history
// @access  Private/Admin
exports.getLoginHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, email, success } = req.query;
    const query = {};

    if (email) query.email = { $regex: email, $options: "i" };
    if (success !== undefined) query.success = success === "true";

    const total = await LoginHistory.countDocuments(query);
    const loginHistory = await LoginHistory.find(query)
      .populate("user", "fullName email avatar")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: loginHistory.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: loginHistory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get login history stats (Admin only)
// @route   GET /api/login-history/stats
// @access  Private/Admin
exports.getLoginStats = async (req, res, next) => {
  try {
    const [totalAttempts, successfulLogins, failedLogins, uniqueUsers] =
      await Promise.all([
        LoginHistory.countDocuments(),
        LoginHistory.countDocuments({ success: true }),
        LoginHistory.countDocuments({ success: false }),
        LoginHistory.distinct("email").then((emails) => emails.length),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        successfulLogins,
        failedLogins,
        uniqueUsers,
        successRate:
          totalAttempts > 0
            ? ((successfulLogins / totalAttempts) * 100).toFixed(1)
            : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all login history (Admin only)
// @route   DELETE /api/login-history
// @access  Private/Admin
exports.clearLoginHistory = async (req, res, next) => {
  try {
    await LoginHistory.deleteMany({});
    res.status(200).json({
      success: true,
      message: "Login history cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};
