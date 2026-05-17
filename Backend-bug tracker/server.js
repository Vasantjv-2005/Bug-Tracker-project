const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // parse JSON
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});