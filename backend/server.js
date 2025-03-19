require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const meetingRoutes = require("./routes/commonRoute");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); 
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/", meetingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
