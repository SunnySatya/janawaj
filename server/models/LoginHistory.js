const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    ipAddress: {
      type: String,
      default: "Unknown",
    },
    userAgent: {
      type: String,
      default: "Unknown",
    },
    success: {
      type: Boolean,
      default: false,
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
loginHistorySchema.index({ createdAt: -1 });
loginHistorySchema.index({ email: 1 });
loginHistorySchema.index({ user: 1 });

module.exports = mongoose.model("LoginHistory", loginHistorySchema);
