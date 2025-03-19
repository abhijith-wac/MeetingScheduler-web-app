const mongoose = require("mongoose");

// Schema for meetings
const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  teamLead: { type: String, required: true },
  description: { type: String, required: true },
  project: { type: String, required: true }
}, { _id: true }); // Subdocuments will have an automatically generated _id

// Schema for common room
const commonRoomSchema = new mongoose.Schema({
  roomId: { type: Number, required: true, unique: true }, // Ensure unique roomId
  meetings: { type: [meetingSchema], default: [] } // Initialize meetings as an empty array by default
});

// Model for common room
const CommonRoom = mongoose.model("CommonRoom", commonRoomSchema);

module.exports = CommonRoom;
