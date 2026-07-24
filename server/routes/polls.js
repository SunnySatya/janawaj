const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getPolls,
  getPollById,
  createPoll,
  voteOnPoll,
  updatePoll,
  deletePoll,
  getPollResults,
} = require("../controllers/pollController");

// Public routes
router.get("/", getPolls);
router.get("/:id", getPollById);

// Protected routes (authenticated users)
router.post("/:id/vote", protect, voteOnPoll);

// Admin routes
router.post("/", protect, authorize("admin"), createPoll);
router.put("/:id", protect, authorize("admin"), updatePoll);
router.delete("/:id", protect, authorize("admin"), deletePoll);
router.get("/:id/results", protect, authorize("admin"), getPollResults);

module.exports = router;
