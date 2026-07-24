const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory");
const { generateToken } = require("../middleware/auth");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({ fullName, email, password });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved news for user
// @route   GET /api/auth/saved-news
// @access  Private
exports.getSavedNews = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "savedNews",
      "title image category createdAt",
    );

    res.status(200).json({
      success: true,
      count: user.savedNews.length,
      data: user.savedNews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle saved news (save/unsave)
// @route   POST /api/auth/saved-news/:newsId
// @access  Private
exports.toggleSavedNews = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const newsId = req.params.newsId;

    const isSaved = user.savedNews.includes(newsId);

    if (isSaved) {
      user.savedNews.pull(newsId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "News removed from saved",
        isSaved: false,
      });
    } else {
      user.savedNews.push(newsId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "News saved successfully",
        isSaved: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress || "Unknown";
    const userAgent = req.headers["user-agent"] || "Unknown";

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // Log failed login attempt - user not found
      await LoginHistory.create({
        email,
        ipAddress,
        userAgent,
        success: false,
        failureReason: "User not found",
      });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      // Log failed login attempt - inactive account
      await LoginHistory.create({
        user: user._id,
        email,
        ipAddress,
        userAgent,
        success: false,
        failureReason: "Account deactivated",
      });
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated. Contact admin.",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Log failed login attempt - wrong password
      await LoginHistory.create({
        user: user._id,
        email,
        ipAddress,
        userAgent,
        success: false,
        failureReason: "Wrong password",
      });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Log successful login
    await LoginHistory.create({
      user: user._id,
      email,
      ipAddress,
      userAgent,
      success: true,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("savedNews", "title image category")
      .populate("votedPolls.poll", "question");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, email } = req.body;
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};
