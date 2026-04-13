const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  console.log("=== Auth Middleware Debug ===");
  console.log("Request URL:", req.url);
  console.log("Authorization header:", req.headers.authorization);
  console.log("Headers:", req.headers);

  // Check if token exists
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];
      console.log("Extracted token:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully:", decoded);

      // Get user from DB
      req.user = await User.findById(decoded.id).select("-password");
      console.log("User found:", req.user);

      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

module.exports = protect;