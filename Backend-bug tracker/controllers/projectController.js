const Project = require("../models/Project");
const { ObjectId } = require("mongoose");

// Create Project
exports.createProject = async (req, res) => {
  try {
    console.log("Creating project with data:", req.body);
    console.log("User from auth middleware:", req.user);
    
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    console.log("Project created successfully in MongoDB:", project);
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Projects
exports.getProjects = async (req, res) => {
  try {
    console.log("Getting projects for user:", req.user._id);
    
    const projects = await Project.find({
      members: req.user._id,
    }).populate("members", "name email")
      .populate("createdBy", "name email");

    console.log("Found projects:", projects);
    res.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Single Project
exports.getProject = async (req, res) => {
  try {
    console.log("Getting single project with ID:", req.params.id);
    
    const project = await Project.findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Found project:", project);
    res.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ message: error.message });
  }
};