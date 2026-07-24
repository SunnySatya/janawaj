const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");
const {
  submitContact,
  getContacts,
  getContactById,
  deleteContact,
  toggleReadStatus,
} = require("../controllers/contactController");

// Public route
router.post(
  "/",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("subject")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Subject must be at least 5 characters"),
    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters"),
  ],
  validate,
  submitContact,
);

// Admin routes
router.get("/", protect, authorize("admin"), getContacts);
router.get("/:id", protect, authorize("admin"), getContactById);
router.put("/:id/toggle-read", protect, authorize("admin"), toggleReadStatus);
router.delete("/:id", protect, authorize("admin"), deleteContact);

module.exports = router;
