const mongoose = require("mongoose");

const pollOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Option text is required"],
    trim: true,
    maxlength: [200, "Option cannot exceed 200 characters"],
  },
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      minlength: [10, "Question must be at least 10 characters"],
      maxlength: [300, "Question cannot exceed 300 characters"],
    },
    options: [pollOptionSchema],
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Politics",
        "Technology",
        "Education",
        "Health",
        "Sports",
        "Media",
        "Entertainment",
        "Business",
        "Environment",
        "Other",
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "ending-soon", "closed"],
      default: "active",
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Virtual for total votes
pollSchema.virtual("totalVotes").get(function () {
  return this.options.reduce((sum, option) => sum + option.votes.length, 0);
});

// Update status based on expiry
pollSchema.pre("save", function (next) {
  if (this.expiresAt) {
    const now = new Date();
    const timeDiff = this.expiresAt - now;
    const daysLeft = timeDiff / (1000 * 60 * 60 * 24);

    if (timeDiff <= 0) {
      this.status = "closed";
    } else if (daysLeft <= 1) {
      this.status = "ending-soon";
    } else {
      this.status = "active";
    }
  }
  next();
});

// Ensure JSON includes virtuals
pollSchema.set("toJSON", { virtuals: true });
pollSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Poll", pollSchema);
