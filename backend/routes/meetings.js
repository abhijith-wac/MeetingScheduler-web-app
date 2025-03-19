const express = require("express");
const mongoose = require("mongoose");
const Room = require("../models/Room"); // Import the Room model
const router = express.Router();

// 1. Initialize default rooms (Run once during setup)
router.post("/init-rooms", async (req, res) => {
  console.log("🚀 Received request at /init-rooms"); // Debugging log

  try {
    console.log("🔍 Checking if default rooms exist...");
    const existingRooms = await Room.find({
      roomId: { $in: ["private-room", "public-room", "chat-room"] },
    });

    if (existingRooms.length > 0) {
      console.log("⚠️ Default rooms already exist, skipping initialization.");
      return res.status(400).json({ message: "Default rooms already exist." });
    }

    console.log("✅ No default rooms found. Creating now...");
    const defaultRooms = [
      { roomId: "1", roomName: "private room", meetings: [] },
      { roomId: "2", roomName: "public room", meetings: [] },
      { roomId: "3", roomName: "chat room", meetings: [] },
    ];

    console.log("📦 Inserting rooms into database...");
    await Room.insertMany(defaultRooms);
    console.log("🎉 Rooms initialized successfully!");
    res.json({ message: "Rooms initialized successfully" });
  } catch (error) {
    console.error("❌ Error initializing rooms:", error); // Log error to console
    res.status(500).json({ error: error.message });
  }
});


// 2. Add a meeting to a specific room
router.post("/rooms/:roomId/meetings", async (req, res) => {
  try {
    const { roomId } = req.params;
    const meetingData = req.body;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    room.meetings.push(meetingData);
    await room.save();

    res.json({ message: "Meeting added successfully", meeting: meetingData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get all meetings from a specific room
router.get("/rooms/:roomId/meetings", async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) return res.status(404).json({ error: "Room not found" });

    res.json({ meetings: room.meetings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update a meeting using Room ID and MongoDB ID
router.put("/rooms/:roomId/meetings/:meetingId", async (req, res) => {
  try {
    const { roomId, meetingId } = req.params;
    const updatedData = req.body;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    const meeting = room.meetings.id(meetingId);
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    Object.assign(meeting, updatedData);
    await room.save();

    res.json({ message: "Meeting updated successfully", meeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Delete a meeting using Room ID and MongoDB ID
router.delete("/rooms/:roomId/meetings/:meetingId", async (req, res) => {
  try {
    const { roomId, meetingId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    room.meetings = room.meetings.filter((m) => m._id.toString() !== meetingId);
    await room.save();

    res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
