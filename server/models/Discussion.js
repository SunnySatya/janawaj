const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [2, "Content must be at least 2 characters"],
      maxlength: [1000, "Content cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["General", "Suggestion", "Slider Idea", "Topic Suggestion"],
        message: "Please select a valid category",
      },
      default: "General",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Index for sorting by newest
discussionSchema.index({ createdAt: -1 });
discussionSchema.index({ category: 1, createdAt: -1 });

// Strip HTML tags before saving
discussionSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.content = this.content.replace(/<[^>]*>/g, "");
  }
  next();
});

module.exports = mongoose.model("Discussion", discussionSchema);
