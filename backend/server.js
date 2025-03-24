require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth"); // Authentication routes
const meetingRoutes = require("./routes/meetings"); // Meeting routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://meeting-scheduler-web-app-eta.vercel.app',  // No trailing slash
  credentials: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Debug: Confirm routes are being loaded
console.log("✅ Loading routes...");

app.use("/auth", authRoutes); 
app.use("/api", meetingRoutes);

console.log("✅ Meeting routes should now be available!");

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
