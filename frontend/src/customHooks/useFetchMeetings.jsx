import { useEffect } from "react";
import { useAtom } from "jotai";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { meetingsAtom } from "../storage/meetingsAtom";
import { getMeetings } from "../customHooks/useRoomMeetings";

const useFetchMeetings = () => {
  const [selectedRoom] = useAtom(selectedRoomAtom);
  const [meetings, setMeetings] = useAtom(meetingsAtom);

  useEffect(() => {
    if (selectedRoom) {
      fetchMeetings(selectedRoom);
    }
  }, [selectedRoom]);

  const fetchMeetings = async (roomId) => {
    try {
      const data = await getMeetings(roomId);
      console.log(`Fetched Meetings for Room ${roomId}:`, data);
      setMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  return meetings;
};

export default useFetchMeetings;
