const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");
const pollRoutes = require("./routes/polls");
const sliderRoutes = require("./routes/sliders");
const contactRoutes = require("./routes/contact");
const uploadRoutes = require("./routes/upload");
const adminRoutes = require("./routes/admin");
const loginHistoryRoutes = require("./routes/loginHistory");
const socialAuthRoutes = require("./routes/socialAuth");
const discussionRoutes = require("./routes/discussion");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins in production (Render) since the frontend is served by same server
      if (!origin || process.env.NODE_ENV === "production") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/login-history", loginHistoryRoutes);
app.use("/api/auth", socialAuthRoutes);
app.use("/api/discussions", discussionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Janawaj API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Serve client build in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/dist");

  if (fs.existsSync(clientBuildPath)) {
    console.log("✅ Serving client build from:", clientBuildPath);
    app.use(express.static(clientBuildPath));

    // SPA fallback - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    });
  } else {
    console.warn("⚠️  Client build not found at:", clientBuildPath);
    console.warn(
      "   Run 'cd client && npm run build' before starting in production",
    );

    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      });
    });
  }
} else {
  // 404 handler for API routes only in development
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    });
  });
}

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║                                                      ║
  ║   🗞️  Janawaj News Agency - API Server              ║
  ║                                                      ║
  ║   Server running on: http://localhost:${PORT}         ║
  ║   Environment: ${process.env.NODE_ENV || "development"}                      ║
  ║   Health check: http://localhost:${PORT}/api/health   ║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
  `);
});
