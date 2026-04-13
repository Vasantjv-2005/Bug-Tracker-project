const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createIssue,
  getIssues,
  updateIssue,
  deleteIssue,
} = require("../controllers/issueController");

// Create issue
router.post("/", protect, createIssue);

// Get issues (with projectId query)
router.get("/", protect, getIssues);

// Update issue
router.put("/:id", protect, updateIssue);

// Delete issue
router.delete("/:id", protect, deleteIssue);

module.exports = router;