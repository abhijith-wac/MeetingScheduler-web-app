const express = require("express");
const Meeting = require("../models/Meeting");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Schedule a new meeting
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, date, time, teamLead, participants, description } = req.body;

    if (!title || !date || !time || !teamLead) {
      return res.status(400).json({ error: "All required fields must be filled!" });
    }

    const newMeeting = new Meeting({ title, date, time, teamLead, participants, description });
    await newMeeting.save();

    res.status(201).json(newMeeting);
  } catch (err) {
    console.error("Error scheduling meeting:", err);
    res.status(500).json({ error: "Failed to schedule meeting" });
  }
});

// Retrieve meetings with optional date filter
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    const filter = date ? { date } : {}; // If a date is provided, filter by it

    const meetings = await Meeting.find(filter);
    res.status(200).json(meetings);
  } catch (err) {
    console.error("Error retrieving meetings:", err);
    res.status(500).json({ error: "Failed to retrieve meetings" });
  }
});


// Update a meeting
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedMeeting) return res.status(404).json({ error: "Meeting not found" });

    res.status(200).json(updatedMeeting);
  } catch (err) {
    console.error("Error updating meeting:", err);
    res.status(500).json({ error: "Failed to update meeting" });
  }
});

// Delete a meeting
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (err) {
    console.error("Error deleting meeting:", err);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
});

module.exports = router;
