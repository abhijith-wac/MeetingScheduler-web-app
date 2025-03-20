import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const getMeetings = async (roomId) => {
  console.log(roomId);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/rooms/${roomId}/meetings`
    );
    return response.data.meetings;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return [];
  }
};

export const getAllRooms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
};

export const addMeeting = async (roomId, meetingData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/rooms/${roomId}/meetings`,
      meetingData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding meeting:", error);
    return null;
  }
};

export const updateMeeting = async (roomId, meetingId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/rooms/${roomId}/meetings/${meetingId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating meeting:", error);
    return null;
  }
};

export const deleteMeeting = async (roomId, meetingId) => {
  try {
    await axios.delete(`${API_BASE_URL}/rooms/${roomId}/meetings/${meetingId}`);
    return true;
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return false;
  }
};
