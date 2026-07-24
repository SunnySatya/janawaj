const Slider = require("../models/Slider");

// @desc    Get all active sliders
// @route   GET /api/sliders
// @access  Public
exports.getSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.find({ isActive: true })
      .sort("order")
      .populate("createdBy", "fullName");

    res.status(200).json({
      success: true,
      count: sliders.length,
      data: sliders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sliders (Admin - including inactive)
// @route   GET /api/sliders/all
// @access  Private/Admin
exports.getAllSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.find()
      .sort("order")
      .populate("createdBy", "fullName");

    res.status(200).json({
      success: true,
      count: sliders.length,
      data: sliders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create slider (Admin only)
// @route   POST /api/sliders
// @access  Private/Admin
exports.createSlider = async (req, res, next) => {
  try {
    const { title, description, image, link, newsId, order } = req.body;

    const slider = await Slider.create({
      title,
      description,
      image,
      link,
      newsId,
      order: order || 0,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Slider created successfully",
      data: slider,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update slider (Admin only)
// @route   PUT /api/sliders/:id
// @access  Private/Admin
exports.updateSlider = async (req, res, next) => {
  try {
    let slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "Slider not found",
      });
    }

    slider = await Slider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Slider updated successfully",
      data: slider,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete slider (Admin only)
// @route   DELETE /api/sliders/:id
// @access  Private/Admin
exports.deleteSlider = async (req, res, next) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "Slider not found",
      });
    }

    await slider.deleteOne();

    res.status(200).json({
      success: true,
      message: "Slider deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder sliders (Admin only)
// @route   PUT /api/sliders/reorder
// @access  Private/Admin
exports.reorderSliders = async (req, res, next) => {
  try {
    const { items } = req.body; // array of { id, order }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Items array is required",
      });
    }

    const updatePromises = items.map((item) =>
      Slider.findByIdAndUpdate(item.id, { order: item.order }),
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Sliders reordered successfully",
    });
  } catch (error) {
    next(error);
  }
};
