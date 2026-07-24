const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getLoginHistory,
  getLoginStats,
  clearLoginHistory,
} = require("../controllers/loginHistoryController");

// All routes are admin-only
router.get("/", protect, authorize("admin"), getLoginHistory);
router.get("/stats", protect, authorize("admin"), getLoginStats);
router.delete("/", protect, authorize("admin"), clearLoginHistory);

module.exports = router;
