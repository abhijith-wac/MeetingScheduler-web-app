const express = require("express");
const mongoose = require("mongoose");
const Room = require("../models/Room"); 
const router = express.Router();

router.post("/init-rooms", async (req, res) => {
  try {
    const existingRooms = await Room.find({ roomId: { $in: ["1", "2", "3"] } });

    if (existingRooms.length > 0) {
      return res.status(400).json({ message: "Default rooms already exist." });
    }

    const defaultRooms = [
      { roomId: "1", roomName: "private room", meetings: [] },
      { roomId: "2", roomName: "public room", meetings: [] },
      { roomId: "3", roomName: "chat room", meetings: [] },
    ];

    await Room.insertMany(defaultRooms);
    res.json({ message: "Rooms initialized successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/rooms/:roomId/meetings", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, startDateTime, endDateTime, teamLead, description, project, name, email } = req.body;

    if (!title || !startDateTime || !endDateTime || !teamLead || !name || !email) {
      return res.status(400).json({ error: "All fields (except description & project) are required." });
    }

    const newMeeting = {
      title,
      startDateTime: new Date(startDateTime), 
      endDateTime: new Date(endDateTime), 
      teamLead,
      description,
      project,
      name,
      email,
    };

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    room.meetings.push(newMeeting);
    await room.save();

    res.json({ message: "Meeting added successfully", meeting: newMeeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.put("/rooms/:roomId/meetings/:meetingId", async (req, res) => {
  try {
    const { roomId, meetingId } = req.params;
    const updatedData = req.body;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    const meeting = room.meetings.id(meetingId);
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    if (updatedData.startDateTime) {
      updatedData.startDateTime = new Date(updatedData.startDateTime);
    }
    if (updatedData.endDateTime) {
      updatedData.endDateTime = new Date(updatedData.endDateTime);
    }

    Object.assign(meeting, updatedData);
    await room.save();

    res.json({ message: "Meeting updated successfully", meeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
