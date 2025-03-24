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
import { useEffect } from "react";

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
      toast.error("Failed to fetch meetings.");
    } else {
      setMeetings(roomMeetings);
    }
  }, [roomMeetings, isError, error]);

  const isTimeOverlapping = (start, end) => {
    return meetings.some((meeting) => {
      const meetingStart = dayjs(meeting.startDateTime);
      const meetingEnd = dayjs(meeting.endDateTime);

      return (
        (start.isBefore(meetingEnd) && end.isAfter(meetingStart)) ||
        (start.isBefore(meetingStart) && end.isAfter(meetingStart)) ||
        (start.isBefore(meetingEnd) && end.isAfter(meetingEnd))
      );
    });
  };

  const handleSelectSlot = ({ start, end }) => {
    const selectedStart = dayjs(start);
    const selectedEnd = dayjs(end);

    const now = dayjs();
    if (selectedStart.isBefore(now)) {
      toast.error("You cannot select a past date or time.");
      return;
    }

    if (isTimeOverlapping(selectedStart, selectedEnd)) {
      toast.error("This time slot is already taken.");
      return;
    }

    if (calendarView === "month") {
      const adjustedEnd = selectedStart.endOf("day");
      setModalState({
        isModalOpen: true,
        selectedItem: {
          startDateTime: selectedStart.toISOString(),
          endDateTime: adjustedEnd.toISOString(),
        },
      });
      return;
    }

    setModalState({
      isModalOpen: true,
      selectedItem: {
        title: "",
        startDateTime: selectedStart.toISOString(),
        endDateTime: selectedEnd.toISOString(),
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

  const handleSubmit = (formData) => {
    const { startDateTime, endDateTime } = formData;

    const start = dayjs(startDateTime);
    const end = dayjs(endDateTime);

    if (isTimeOverlapping(start, end)) {
      toast.error("This time slot is already taken.");
      return;
    }

    setModalState({
      isModalOpen: false,
      selectedItem: null,
    });

    setMeetings((prevMeetings) => [
      ...prevMeetings,
      {
        title: formData.title,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        teamLead: formData.teamLead,
        description: formData.description,
        project: formData.project,
      },
    ]);

    toast.success("Meeting saved successfully.");
  };

  return { handleSelectSlot, handleSelectEvent, handleSubmit };
};

export default useCalendarHandlers;
