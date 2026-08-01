const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @desc    Google OAuth callback
// @route   POST /api/auth/google
// @access  Public
router.post("/google", async (req, res, next) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed: Missing required fields",
      });
    }

    // Check if user exists with this googleId or email
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // Update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        if (avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        fullName: name || email.split("@")[0],
        email,
        googleId,
        avatar: avatar || "",
        password: Math.random().toString(36).slice(-12) + "Aa1!",
        isActive: true,
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    });

    res.status(200).json({
      success: true,
      message: "Google login successful",
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
});

module.exports = router;
