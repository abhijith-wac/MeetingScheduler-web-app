import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Custom hook to manage meetings for a specific room.
 * Includes fetch, post, update, and delete functionality.
 *
 * @param {string} roomId - The ID of the room to manage meetings for.
 */
const useRoomMeetings = (roomId) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all meetings for the specific room
  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/meetings`, { params: { roomId } });
      setMeetings(response.data); // Assuming backend returns the meetings array
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to fetch meetings.");
    } finally {
      setLoading(false);
    }
  };

  // Post a new meeting to the specific room
  const postMeeting = async (meetingData) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/meetings`, {
        roomId,
        ...meetingData,
      });
      setMeetings((prevMeetings) => [...prevMeetings, response.data]);
      toast.success("Meeting added successfully.");
    } catch (error) {
      console.error("Error posting meeting:", error);
      toast.error("Failed to post meeting.");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing meeting in the specific room
  const updateMeeting = async (meetingId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/meetings/${meetingId}`, {
        roomId,
        ...updatedData,
      });
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting.id === meetingId ? response.data : meeting
        )
      );
      toast.success("Meeting updated successfully.");
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast.error("Failed to update meeting.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a specific meeting in the room
  const deleteMeeting = async (meetingId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/meetings/${meetingId}`, {
        data: { roomId },
      });
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.id !== meetingId)
      );
      toast.success("Meeting deleted successfully.");
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error("Failed to delete meeting.");
    } finally {
      setLoading(false);
    }
  };

  return {
    meetings,
    loading,
    fetchMeetings,
    postMeeting,
    updateMeeting,
    deleteMeeting,
  };
};

export default useRoomMeetings;
