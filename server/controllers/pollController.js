const Poll = require("../models/Poll");

// @desc    Get all polls
// @route   GET /api/polls
// @query   ?page=1&limit=10&category=Technology&status=active
// @access  Public
exports.getPolls = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    const query = { isActive: true };

    if (category && category !== "All") {
      query.category = category;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const total = await Poll.countDocuments(query);
    const polls = await Poll.find(query)
      .populate("createdBy", "fullName")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Calculate time left for each poll
    const pollsWithTimeLeft = polls.map((poll) => {
      const pollObj = poll.toJSON();
      const now = new Date();
      const diff = poll.expiresAt - now;

      if (diff <= 0) {
        pollObj.expiresIn = "Ended";
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );

        if (days > 0) {
          pollObj.expiresIn = `${days} day${days > 1 ? "s" : ""} left`;
        } else if (hours > 0) {
          pollObj.expiresIn = `${hours} hour${hours > 1 ? "s" : ""} left`;
        } else {
          pollObj.expiresIn = "Less than an hour left";
        }
      }

      // Hide vote details from public (just show counts)
      pollObj.options = pollObj.options.map((opt) => ({
        ...opt,
        votes: opt.votes.length,
      }));

      return pollObj;
    });

    res.status(200).json({
      success: true,
      count: pollsWithTimeLeft.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: pollsWithTimeLeft,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single poll
// @route   GET /api/polls/:id
// @access  Public
exports.getPollById = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(
      "createdBy",
      "fullName",
    );

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    const pollObj = poll.toJSON();
    const now = new Date();
    const diff = poll.expiresAt - now;

    if (diff <= 0) {
      pollObj.expiresIn = "Ended";
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      if (days > 0) {
        pollObj.expiresIn = `${days} day${days > 1 ? "s" : ""} left`;
      } else if (hours > 0) {
        pollObj.expiresIn = `${hours} hour${hours > 1 ? "s" : ""} left`;
      } else {
        pollObj.expiresIn = "Less than an hour left";
      }
    }

    pollObj.options = pollObj.options.map((opt) => ({
      ...opt,
      votes: opt.votes.length,
    }));

    res.status(200).json({
      success: true,
      data: pollObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create poll (Admin only)
// @route   POST /api/polls
// @access  Private/Admin
exports.createPoll = async (req, res, next) => {
  try {
    const { question, options, category, expiresInDays } = req.body;

    if (!options || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 options are required",
      });
    }

    if (options.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 options allowed",
      });
    }

    // Set expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (parseInt(expiresInDays) || 7));

    const poll = await Poll.create({
      question,
      options: options.map((opt) => ({ text: opt })),
      category,
      expiresAt,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Poll created successfully",
      data: poll,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on a poll
// @route   POST /api/polls/:id/vote
// @access  Private
exports.voteOnPoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    if (poll.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "This poll has ended",
      });
    }

    // Check if user already voted
    const hasVoted = poll.options.some((opt) =>
      opt.votes.includes(req.user._id),
    );

    if (hasVoted) {
      return res.status(400).json({
        success: false,
        message: "You have already voted on this poll",
      });
    }

    const { optionIndex } = req.body;

    if (
      optionIndex === undefined ||
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid option selected",
      });
    }

    poll.options[optionIndex].votes.push(req.user._id);
    await poll.save();

    res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
      data: {
        totalVotes: poll.totalVotes,
        optionIndex,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update poll (Admin only)
// @route   PUT /api/polls/:id
// @access  Private/Admin
exports.updatePoll = async (req, res, next) => {
  try {
    let poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    const { question, category, expiresInDays, isActive } = req.body;

    if (question) poll.question = question;
    if (category) poll.category = category;
    if (isActive !== undefined) poll.isActive = isActive;

    if (expiresInDays) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
      poll.expiresAt = expiresAt;
    }

    await poll.save();

    res.status(200).json({
      success: true,
      message: "Poll updated successfully",
      data: poll,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete poll (Admin only)
// @route   DELETE /api/polls/:id
// @access  Private/Admin
exports.deletePoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    await poll.deleteOne();

    res.status(200).json({
      success: true,
      message: "Poll deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get poll results (with detailed vote data for admin)
// @route   GET /api/polls/:id/results
// @access  Private/Admin
exports.getPollResults = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(
      "options.votes",
      "fullName email",
    );

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    next(error);
  }
};
