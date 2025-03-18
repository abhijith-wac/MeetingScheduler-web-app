const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },  // Replaced 'time' with 'startTime'
  endTime: { type: String, required: true },    // Added 'endTime'
  teamLead: { type: String, required: true },
  participants: { type: [String], default: [] },
  description: { type: String },
  project: { type: String, required: true },    // Added 'project' field
});

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;
