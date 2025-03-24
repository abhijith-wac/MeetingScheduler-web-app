import { useEffect } from "react";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { meetingsAtom } from "../storage/meetingsAtom";
import { modalStateAtom } from "../storage/modalStateAtom";
import { calendarViewAtom } from "../storage/calendarViewAtom";
import { useMeetings } from "../customHooks/useRoomMeetings";

dayjs.extend(utc);
dayjs.extend(timezone);

const useCalendarHandlers = () => {
  const [roomId] = useAtom(selectedRoomAtom);
  const [meetings, setMeetings] = useAtom(meetingsAtom);
  const [, setModalState] = useAtom(modalStateAtom);
  const [calendarView] = useAtom(calendarViewAtom);

  const { meetings: roomMeetings, isError, error } = useMeetings(roomId);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to fetch meetings.");
    } else {
      console.log("Fetched meetings:", roomMeetings); // Ensure meetings are fetched properly
      setMeetings(roomMeetings);
    }
  }, [roomMeetings, isError, error]);

  const handleSelectSlot = ({ start, end }) => {
    const now = dayjs(); // Local time
    const today = now.startOf("day"); // Start of today in local time
    const selectedStart = dayjs(start);
    const selectedEnd = dayjs(end);

    console.log("🔍 Selected Start and End:", {
      selectedStart: selectedStart.format(),
      selectedEnd: selectedEnd.format(),
    });

    // Block any past date (in any view)
    if (selectedStart.isBefore(today, "day")) {
      toast.error("You cannot book a past date.");
      return;
    }

    // Block past times in ALL views
    if (selectedStart.isBefore(now)) {
      toast.error("You cannot book a past time.");
      return;
    }

    // For month view, ensure minimum duration
    if (calendarView === "month") {
      const adjustedEnd = selectedStart.endOf("day");
      // Open modal with full-day times
      setModalState({
        isModalOpen: true,
        selectedItem: {
          startDateTime: selectedStart.toISOString(),
          endDateTime: adjustedEnd.toISOString(),
          // other fields...
        },
      });
      return;
    }

    // Adjust end time for minimum duration (e.g., 1 hour) in all views
    const adjustedEnd = selectedEnd.isAfter(selectedStart)
      ? selectedEnd
      : selectedStart.add(1, "hour");

    console.log("📅 Checking for conflicts with existing meetings.");

    const isSlotTaken = meetings.some((meeting) => {
      const meetingStart = dayjs.utc(meeting.startDateTime).local();
      const meetingEnd = dayjs.utc(meeting.endDateTime).local();

      console.log("🔍 Checking against existing meeting:", {
        meetingStart: meetingStart.format(),
        meetingEnd: meetingEnd.format(),
      });

      return (
        selectedStart.isBefore(meetingEnd) && selectedEnd.isAfter(meetingStart)
      );
    });

    if (isSlotTaken) {
      toast.error("This time slot is already booked.");
      return;
    }

    console.log("✅ Slot is free, opening modal for booking.");
    setModalState({
      isModalOpen: true,
      selectedItem: {
        title: "",
        startDateTime: selectedStart.toISOString(),
        endDateTime: adjustedEnd.toISOString(),
        teamLead: "",
        description: "",
        project: "",
      },
    });
  };

  const handleSelectEvent = (event) => {
    setModalState({
      isModalOpen: true,
      selectedItem: { ...event },
    });
  };

  return { handleSelectSlot, handleSelectEvent };
};

export default useCalendarHandlers;
