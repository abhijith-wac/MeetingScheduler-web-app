import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust based on your backend

// ✅ Fetch all meetings for a specific room
export const getMeetings = async (roomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}/meetings`);
    return response.data.meetings;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return [];
  }
};

// ✅ Add a new meeting to a specific room
export const addMeeting = async (roomId, meetingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rooms/${roomId}/meetings`, meetingData);
    return response.data;
  } catch (error) {
    console.error("Error adding meeting:", error);
    return null;
  }
};

// ✅ Update a specific meeting in a room
export const updateMeeting = async (roomId, meetingId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/rooms/${roomId}/meetings/${meetingId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating meeting:", error);
    return null;
  }
};

// ✅ Delete a specific meeting in a room
export const deleteMeeting = async (roomId, meetingId) => {
  try {
    await axios.delete(`${API_BASE_URL}/rooms/${roomId}/meetings/${meetingId}`);
    return true;
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return false;
  }
};
