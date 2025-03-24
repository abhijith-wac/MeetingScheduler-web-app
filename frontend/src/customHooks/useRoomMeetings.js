import useSWR, { mutate } from "swr";
import axios from "axios";

const API_BASE_URL = "https://meetingscheduler-web-app.onrender.com";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const useMeetings = (roomId) => {
  const { data, error } = useSWR(
    roomId ? `${API_BASE_URL}/rooms/${roomId}/meetings` : null,
    fetcher
  );

  return {
    meetings: data?.meetings || [],
    isLoading: !error && !data,
    isError: error,
  };
};

export const useRooms = () => {
  const { data, error } = useSWR(`${API_BASE_URL}/rooms`, fetcher);

  return {
    rooms: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};

export const addMeeting = async (roomId, meetingData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/rooms/${roomId}/meetings`,
      meetingData
    );
    mutate(`${API_BASE_URL}/rooms/${roomId}/meetings`);
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
    mutate(`${API_BASE_URL}/rooms/${roomId}/meetings`);
    return response.data;
  } catch (error) {
    console.error("Error updating meeting:", error);
    return null;
  }
};

export const deleteMeeting = async (roomId, meetingId) => {
  try {
    await axios.delete(`${API_BASE_URL}/rooms/${roomId}/meetings/${meetingId}`);
    mutate(`${API_BASE_URL}/rooms/${roomId}/meetings`);
    return true;
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return false;
  }
};
