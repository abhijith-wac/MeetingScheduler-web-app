const mongoose = require("mongoose");

// Meeting Schema
const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  teamLead: { type: String, required: true },
  description: { type: String },
  project: { type: String },
  name: { type: String, required: true }, // ✅ Added name field
  email: { type: String, required: true }, // ✅ Added email field
});

// Room Schema
const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true, required: true }, // Unique Room ID
  roomName: { type: String, required: true }, // "private room", "public room", "chat room"
  meetings: [MeetingSchema], // Array of meetings
});

// Export models
const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
