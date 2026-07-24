const Discussion = require("../models/Discussion");

// @desc    Create a discussion post
// @route   POST /api/discussions
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { content, category } = req.body;

    const post = await Discussion.create({
      content,
      category: category || "General",
      author: req.user._id,
    });

    // Populate author info for response
    await post.populate("author", "fullName avatar");

    res.status(201).json({
      success: true,
      message: "Your message has been posted!",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all discussion posts (paginated)
// @route   GET /api/discussions
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    const total = await Discussion.countDocuments(query);
    const posts = await Discussion.find(query)
      .populate("author", "fullName avatar")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Add isLiked field for authenticated users
    const postsWithLiked = posts.map((post) => {
      const postObj = post.toObject();
      if (req.user) {
        postObj.isLiked = post.likes.includes(req.user._id);
      } else {
        postObj.isLiked = false;
      }
      postObj.likesCount = post.likes.length;
      return postObj;
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: postsWithLiked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike a discussion post
// @route   PUT /api/discussions/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Discussion.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Like removed" : "Post liked",
      data: {
        likesCount: post.likes.length,
        isLiked: !isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a discussion post (owner only)
// @route   DELETE /api/discussions/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Discussion.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
