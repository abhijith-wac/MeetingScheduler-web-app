const express = require('express');
const CommonRoom = require('../models/CommonRoom'); // Path to your CommonRoom model

const router = express.Router();

  

// Route to add a meeting and create a room if it doesn't exist
router.post('/add-meeting', async (req, res) => {
    const { roomId, roomName, title, date, startTime, endTime, teamLead, description, project } = req.body;
  
    try {
      // Check if the room already exists by roomId
      let room = await CommonRoom.findOne({ roomId });
  
      if (!room) {
        // If the room doesn't exist, create a new room with the provided roomId and roomName
        room = new CommonRoom({
          roomId,
          roomName,
          meetings: [] // Initialize with an empty meetings array
        });
  
        // Save the new room to the database
        await room.save();
        console.log('Room created:', room);
      }
  
      // Create the new meeting object
      const newMeeting = {
        title,
        date,
        startTime,
        endTime,
        teamLead,
        description,
        project
      };
  
      // Add the new meeting to the room's meetings array
      room.meetings.push(newMeeting);
  
      // Save the updated room with the new meeting
      await room.save();
  
      // Respond with the newly added meeting and room information
      res.status(201).json({ message: 'Meeting added successfully!', room, meeting: newMeeting });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add meeting.' });
    }
  });
  
  

// Route to update a meeting in a specific room
router.put('/update-meeting/:roomId/:meetingId', async (req, res) => {
    const { roomId, meetingId } = req.params;
    const { title, date, startTime, endTime, teamLead, description, project } = req.body;
  
    try {
      // Find the room by roomId
      const room = await CommonRoom.findOne({ roomId });
  
      if (!room) {
        return res.status(404).json({ message: 'Room not found.' });
      }
  
      // Find the meeting by its meetingId within the room's meetings array
      const meeting = room.meetings.id(meetingId); // Using Mongoose's .id method to find the meeting
  
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found.' });
      }
  
      // Update the meeting's fields with the new data from the request body
      meeting.title = title || meeting.title;
      meeting.date = date || meeting.date;
      meeting.startTime = startTime || meeting.startTime;
      meeting.endTime = endTime || meeting.endTime;
      meeting.teamLead = teamLead || meeting.teamLead;
      meeting.description = description || meeting.description;
      meeting.project = project || meeting.project;
  
      // Save the updated room document
      await room.save();
      res.status(200).json({ message: 'Meeting updated successfully!', meeting });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update meeting.' });
    }
  });
  

// Route to get all meetings from a specific room
router.get('/meetings/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    // Find the room by roomId
    const room = await CommonRoom.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    // Send the meetings in the room as the response
    res.status(200).json(room.meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve meetings.' });
  }
});

// Route to delete a meeting from a specific room by meeting _id
router.delete('/delete-meeting/:roomId/:meetingId', async (req, res) => {
  const { roomId, meetingId } = req.params;

  try {
    // Find the room by roomId
    const room = await CommonRoom.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    // Find the index of the meeting to delete by its _id
    const meetingIndex = room.meetings.findIndex(meeting => meeting._id.toString() === meetingId);

    if (meetingIndex === -1) {
      return res.status(404).json({ message: 'Meeting not found.' });
    }

    // Remove the meeting from the meetings array
    room.meetings.splice(meetingIndex, 1);

    // Save the updated room document
    await room.save();
    res.status(200).json({ message: 'Meeting deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete meeting.' });
  }
});

module.exports = router;
