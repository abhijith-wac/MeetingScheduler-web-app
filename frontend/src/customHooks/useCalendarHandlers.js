import { useEffect } from "react";
import { useAtom } from "jotai";
import axios from "axios";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { modalStateAtom } from "../storage/modalStateAtom";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const useCalendarHandlers = () => {
  const [roomId] = useAtom(selectedRoomAtom); // Get the selected room ID
  const [, setModalState] = useAtom(modalStateAtom);

  // Fetch meetings for the selected room
  const fetchRoomMeetings = async (roomId) => {
    if (!roomId) return; // No room selected, don't fetch
    try {
      const response = await axios.get(`/api/meetings`, {
        params: { roomId },
      });
      setMeetings(response.data); // Assuming backend returns the array of meetings
    } catch (error) {
      console.error("Error fetching meetings for room:", error);
      toast.error("Failed to fetch meetings.");
    }
  };

  // Automatically fetch meetings when roomId changes
  useEffect(() => {
    fetchRoomMeetings(roomId); // Fetch room meetings when roomId is set
  }, [roomId]);

  const handleSelectSlot = ({ start, end }) => {
    const now = dayjs();
    const selectedDate = dayjs(start);

    if (selectedDate.isBefore(now, "day")) {
      toast.error("You cannot book a past date.");
      return;
    }

    const isSlotTaken = meetings.some(
      (meeting) =>
        dayjs(meeting.start).isBefore(end) && dayjs(meeting.end).isAfter(start)
    );

    if (isSlotTaken) {
      toast.error("This time slot is already booked.");
      return;
    }

    setModalState({ isModalOpen: true, selectedItem: { start, end, date: dayjs(start).format("YYYY-MM-DD") } });
  };

  const handleSelectEvent = (event) => {
    setModalState({ isModalOpen: true, selectedItem: event });
  };

  return { handleSelectSlot, handleSelectEvent, meetings };
};

export default useCalendarHandlers;
