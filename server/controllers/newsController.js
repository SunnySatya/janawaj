const News = require("../models/News");

// @desc    Get all news
// @route   GET /api/news
// @query   ?page=1&limit=10&category=Technology&search=keyword&featured=true
// @access  Public
exports.getNews = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      featured,
      sort = "-publishedAt",
    } = req.query;

    const query = { isPublished: true };

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Filter featured
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate("author", "fullName avatar")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-content");

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("author", "fullName avatar");

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // Get related news (same category, excluding current)
    const relatedNews = await News.find({
      category: news.category,
      _id: { $ne: news._id },
      isPublished: true,
    })
      .select("title image category publishedAt")
      .limit(3)
      .sort("-publishedAt");

    res.status(200).json({
      success: true,
      data: {
        news,
        relatedNews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create news (Admin only)
// @route   POST /api/news
// @access  Private/Admin
exports.createNews = async (req, res, next) => {
  try {
    req.body.author = req.user._id;

    const news = await News.create(req.body);

    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update news (Admin only)
// @route   PUT /api/news/:id
// @access  Private/Admin
exports.updateNews = async (req, res, next) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete news (Admin only)
// @route   DELETE /api/news/:id
// @access  Private/Admin
exports.deleteNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike news
// @route   PUT /api/news/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    const isLiked = news.likes.includes(req.user._id);

    if (isLiked) {
      news.likes.pull(req.user._id);
    } else {
      news.likes.push(req.user._id);
    }

    await news.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Like removed" : "News liked",
      data: {
        likes: news.likes.length,
        isLiked: !isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Unsave news
// @route   PUT /api/news/:id/save
// @access  Private
exports.toggleSave = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    const isSaved = news.saves.includes(req.user._id);

    if (isSaved) {
      news.saves.pull(req.user._id);
    } else {
      news.saves.push(req.user._id);
    }

    await news.save();

    res.status(200).json({
      success: true,
      message: isSaved ? "News unsaved" : "News saved",
      data: {
        saves: news.saves.length,
        isSaved: !isSaved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Share news (increment count)
// @route   PUT /api/news/:id/share
// @access  Public
exports.shareNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true },
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News shared",
      data: { shares: news.shares },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get news by category
// @route   GET /api/news/category/:category
// @access  Public
exports.getNewsByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const category = req.params.category;

    const query = { category, isPublished: true };
    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate("author", "fullName avatar")
      .sort("-publishedAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-content");

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: news,
    });
  } catch (error) {
    next(error);
  }
};
