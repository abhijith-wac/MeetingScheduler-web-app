import { useEffect } from "react";
import { useAtom } from "jotai";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { meetingsAtom } from "../storage/meetingsAtom";
import { modalStateAtom } from "../storage/modalStateAtom";
import { calendarViewAtom } from "../storage/calendarViewAtom";

const useCalendarHandlers = () => {
    const [roomId] = useAtom(selectedRoomAtom); // ✅ Room ID from global state
    const [meetings, setMeetings] = useAtom(meetingsAtom); // ✅ Store meetings globally
    const [, setModalState] = useAtom(modalStateAtom);
    const [calendarView] = useAtom(calendarViewAtom);

    const fetchRoomMeetings = async () => {
        if (!roomId) return; // ✅ Prevent fetching when no room is selected

        try {
            const response = await axios.get("/api/meetings", { params: { roomId } });
            setMeetings(response.data || []); // ✅ Ensure an array is stored
        } catch (error) {
            console.error("Error fetching meetings for room:", error);
            toast.error("Failed to fetch meetings.");
        }
    };

    // 🔹 Fetch meetings when roomId changes
    useEffect(() => {
        fetchRoomMeetings();
    }, [roomId]);

    const handleSelectSlot = ({ start, end }) => {
      const now = dayjs();
      const selectedDate = dayjs(start);
  
  
      // 🛑 Prevent selecting past dates
      if (selectedDate.isBefore(now, "day")) {
          toast.error("You cannot book a past date.");
          return;
      }
  
      // 🛑 If NOT in "month" view, prevent selecting past time today
      if (calendarView !== "month" && selectedDate.isSame(now, "day") && selectedDate.isBefore(now, "minute")) {
          toast.error("You cannot select a past time for today.");
          return;
      }
  
      // ✅ Check for overlapping meetings
      const isSlotTaken =
          Array.isArray(meetings) &&
          meetings.some((meeting) => 
              dayjs(meeting.start).isBefore(end) && dayjs(meeting.end).isAfter(start)
          );
  
      if (isSlotTaken) {
          toast.error("This time slot is already booked.");
          return;
      }
  
      setModalState({
          isModalOpen: true,
          selectedItem: { start, end, date: selectedDate.format("YYYY-MM-DD") },
      });
  };
  
    const handleSelectEvent = (event) => {
        setModalState({ isModalOpen: true, selectedItem: event });
    };

    return { handleSelectSlot, handleSelectEvent };
};

export default useCalendarHandlers;
