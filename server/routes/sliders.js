const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getSliders,
  getAllSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  reorderSliders,
} = require("../controllers/sliderController");

// Public routes
router.get("/", getSliders);

// Admin routes
router.get("/all", protect, authorize("admin"), getAllSliders);
router.post("/", protect, authorize("admin"), createSlider);
router.put("/reorder", protect, authorize("admin"), reorderSliders);
router.put("/:id", protect, authorize("admin"), updateSlider);
router.delete("/:id", protect, authorize("admin"), deleteSlider);

module.exports = router;
