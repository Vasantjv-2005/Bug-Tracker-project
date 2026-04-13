const Issue = require("../models/Issue");
const { ObjectId } = require("mongoose");

// Create Issue
exports.createIssue = async (req, res) => {
  try {
    console.log("=== Issue Creation Request ===");
    console.log("Request body:", req.body);
    console.log("User from auth middleware:", req.user);
    console.log("Headers:", req.headers);
    
    // Convert frontend status to MongoDB enum format
    const statusMap = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done'
    };
    
    const issue = await Issue.create({
      title: req.body.title,
      description: req.body.description,
      project: req.body.projectId,
      status: statusMap[req.body.status] || "To Do",
      priority: req.body.priority || "medium",
      createdBy: req.user._id,
    });

    console.log("Issue created successfully in MongoDB:", issue);
    res.status(201).json({ message: "Issue created successfully", issue });
  } catch (error) {
    console.error("=== Create Issue Error ===");
    console.error("Error details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Issues
exports.getIssues = async (req, res) => {
  try {
    console.log("=== Get Issues Request ===");
    console.log("Request query:", req.query);
    console.log("User from auth middleware:", req.user);
    console.log("Headers:", req.headers);
    
    const projectId = req.query.projectId;
    
    const issues = await Issue.find({ project: projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    console.log("Found issues:", issues);
    res.json({ issues });
  } catch (error) {
    console.error("Get issues error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Issue
exports.updateIssue = async (req, res) => {
  try {
    console.log("=== Update Issue Request ===");
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    
    // Simple direct update - let MongoDB handle it
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    console.log("Issue updated successfully:", issue);
    res.json(issue);
  } catch (error) {
    console.error("Update issue error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Issue
exports.deleteIssue = async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
