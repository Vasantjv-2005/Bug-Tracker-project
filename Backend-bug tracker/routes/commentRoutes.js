const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addComment,
  getComments,
} = require("../controllers/commentController");

// Add comment
router.post("/", protect, addComment);

// Get comments by issue
router.get("/:issueId", protect, getComments);

module.exports = router;