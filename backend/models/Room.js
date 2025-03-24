const mongoose = require("mongoose");

// Meeting Schema
const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDateTime: { type: Date, required: true }, // ✅ Combined start date & time
  endDateTime: { type: Date, required: true }, // ✅ Combined end date & time
  teamLead: { type: String, required: true },
  description: { type: String },
  project: { type: String },
  name: { type: String, required: true }, // ✅ Name of the person scheduling
  email: { type: String, required: true }, // ✅ Email of the person scheduling
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
