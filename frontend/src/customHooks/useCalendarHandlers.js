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
  const [roomId] = useAtom(selectedRoomAtom);
  const [meetings, setMeetings] = useAtom(meetingsAtom);
  const [, setModalState] = useAtom(modalStateAtom);
  const [calendarView] = useAtom(calendarViewAtom);

  const fetchRoomMeetings = async () => {
    if (!roomId) return;

    try {
      const response = await axios.get("/api/meetings", { params: { roomId } });
      setMeetings(response.data || []);
    } catch (error) {
      console.error("Error fetching meetings for room:", error);
      toast.error("Failed to fetch meetings.");
    }
  };

  useEffect(() => {
    fetchRoomMeetings();
  }, [roomId]);

  console.log(meetings);

  const handleSelectSlot = ({ start, end }) => {
    const now = dayjs();
    const today = now.startOf("day"); // Midnight today (00:00)
    const selectedStart = dayjs(start);
    const selectedEnd = dayjs(end);

    // ✅ Prevent selecting past dates
    if (selectedStart.isBefore(today, "day")) {
      toast.error("You cannot book a past date.");
      return;
    }

    // ✅ Handle month view separately (allow selecting today without time restriction)
    if (calendarView === "month") {
      setModalState({
        isModalOpen: true,
        selectedItem: { start, end, date: selectedStart.format("YYYY-MM-DD") },
      });
      return;
    }

    // ✅ Prevent selecting past time on today's date in week/day views
    if (
      selectedStart.isSame(today, "day") &&
      selectedStart.isBefore(now, "minute")
    ) {
      toast.error("You cannot select a past time for today.");
      return;
    }

    // ✅ Check if slot is already taken
    const isSlotTaken =
      Array.isArray(meetings) &&
      meetings.some((meeting) => {
        const meetingDate = dayjs(meeting.date).format("YYYY-MM-DD");
        const selectedDate = selectedStart.format("YYYY-MM-DD");

        console.log("Checking Meeting:", {
          meetingDate,
          meetingStartTime: meeting.startTime,
          meetingEndTime: meeting.endTime,
          selectedDate,
          selectedStartTime: selectedStart.format("HH:mm"),
          selectedEndTime: selectedEnd.format("HH:mm"),
        });

        if (meetingDate !== selectedDate) {
          console.log("Skipping meeting as date does not match.");
          return false; // Ignore meetings from different dates
        }

        // Convert meeting times to full date-time objects
        const meetingStart = dayjs(
          `${meetingDate} ${meeting.startTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const meetingEnd = dayjs(
          `${meetingDate} ${meeting.endTime}`,
          "YYYY-MM-DD HH:mm"
        );

        console.log("Parsed Meeting Times:", {
          meetingStart: meetingStart.format("YYYY-MM-DD HH:mm"),
          meetingEnd: meetingEnd.format("YYYY-MM-DD HH:mm"),
          selectedStart: selectedStart.format("YYYY-MM-DD HH:mm"),
          selectedEnd: selectedEnd.format("YYYY-MM-DD HH:mm"),
        });

        const isConflict =
          selectedStart.isSame(meetingStart, "minute") || // Exact start time match
          selectedEnd.isSame(meetingEnd, "minute") || // Exact end time match
          (selectedStart.isBefore(meetingEnd) &&
            selectedEnd.isAfter(meetingStart)) || // Overlapping period
          (selectedStart.isAfter(meetingStart) &&
            selectedEnd.isBefore(meetingEnd)); // Fully inside a booked slot

        if (isConflict) {
          console.log("Conflict detected! Slot is taken.");
        } else {
          console.log("No conflict, slot is free.");
        }

        return isConflict;
      });

    if (isSlotTaken) {
      toast.error("This time slot is already booked.");
      console.log("❌ Slot booking prevented due to conflict.");
      return;
    }

    console.log("✅ Slot is available, proceeding with booking.");

    // ✅ Open modal for valid selections
    setModalState({
      isModalOpen: true,
      selectedItem: { start, end, date: selectedStart.format("YYYY-MM-DD") },
    });
  };

  const handleSelectEvent = (event) => {
    setModalState({ isModalOpen: true, selectedItem: event });
  };

  return { handleSelectSlot, handleSelectEvent };
};

export default useCalendarHandlers;
