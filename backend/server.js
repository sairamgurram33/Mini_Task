const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API v2 running", version: "2.0.0" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Initialize database and start server
async function startServer() {
  try {
    await database.initialize();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Only start server when run directly (not during tests)
if (require.main === module) {
  startServer();
}

module.exports = app;
