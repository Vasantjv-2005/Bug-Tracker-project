const express = require("express");
const router = express.Router();  

const protect = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  getProject,
} = require("../controllers/projectController");

// Create project
router.post("/", protect, createProject);

// Get projects
router.get("/", protect, getProjects);

// Get single project
router.get("/:id", protect, getProject);

module.exports = router;