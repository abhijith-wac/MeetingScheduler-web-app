import dotenv from 'dotenv';
dotenv.config();  // Load environment variables

const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth"); // Authentication routes
const meetingRoutes = require("./routes/meetings"); // Meeting routes

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);  // Exit the process in case of error
  });

// Debug: Confirm routes are being loaded
console.log("Loading routes...");

app.use("/auth", authRoutes); 
app.use("/api", meetingRoutes);

console.log("Meeting routes should now be available!");

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
