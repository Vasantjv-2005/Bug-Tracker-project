const Comment = require("../models/Comment");

// Add Comment
exports.addComment = async (req, res) => {
  try {
    console.log("=== Add Comment Request ===");
    console.log("Request body:", req.body);
    console.log("User from auth middleware:", req.user);
    
    const comment = await Comment.create({
      content: req.body.content,
      issue: req.body.issueId,
      user: req.user._id,
    });

    console.log("Comment created successfully:", comment);
    res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Comments
exports.getComments = async (req, res) => {
  try {
    console.log("=== Get Comments Request ===");
    console.log("Request params:", req.params);
    console.log("Issue ID:", req.params.issueId);
    
    const comments = await Comment.find({
      issue: req.params.issueId,
    }).populate("user", "name email");

    console.log("Found comments:", comments);
    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: error.message });
  }
};