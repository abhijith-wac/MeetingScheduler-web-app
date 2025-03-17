const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/meetings")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, 
  time: { type: String, required: true },
  teamLead: { type: String, required: true },
  participants: { type: [String], default: [] }, 
  description: { type: String },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

// POST: Schedule a new meeting
app.post("/meetings", async (req, res) => {
  try {
    const { title, date, time, teamLead, participants, description } = req.body;
    if (!title || !date || !time || !teamLead) {
      return res.status(400).json({ error: "All required fields must be filled!" });
    }

    const newMeeting = new Meeting({ 
      title, 
      date, 
      time, 
      teamLead, 
      participants: Array.isArray(participants) ? participants : [], 
      description 
    });

    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (err) {
    console.error("Error scheduling meeting:", err);
    res.status(500).json({ error: "Failed to schedule meeting" });
  }
});

// GET: Retrieve all meetings
app.get("/meetings", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json(meetings);
  } catch (err) {
    console.error("Error retrieving meetings:", err);
    res.status(500).json({ error: "Failed to retrieve meetings" });
  }
});

// PUT: Update a meeting by ID
app.put("/meetings/:id", async (req, res) => {
  try {
    const { title, date, time, teamLead, participants, description } = req.body;
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { title, date, time, teamLead, participants: Array.isArray(participants) ? participants : [], description },
      { new: true, runValidators: true }
    );
    if (!updatedMeeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.status(200).json(updatedMeeting);
  } catch (err) {
    console.error("Error updating meeting:", err);
    res.status(500).json({ error: "Failed to update meeting" });
  }
});

// DELETE: Delete a meeting by ID
app.delete("/meetings/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (err) {
    console.error("Error deleting meeting:", err);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
