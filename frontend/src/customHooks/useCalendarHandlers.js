import { useAtom } from "jotai";
import dayjs from 'dayjs';
import { toast } from "react-toastify";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { meetingsAtom } from "../storage/meetingsAtom";
import { modalStateAtom } from "../storage/modalStateAtom";
import { useMeetings } from "../customHooks/useRoomMeetings";
import { useEffect } from "react";
import { isTimeOverlapping } from "../../utils/formHandling";

const useCalendarHandlers = () => {
  const [roomId] = useAtom(selectedRoomAtom);
  const [meetings, setMeetings] = useAtom(meetingsAtom);
  const [, setModalState] = useAtom(modalStateAtom);

  const { meetings: roomMeetings, isError, error } = useMeetings(roomId);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch meetings.");
    } else {
      if (JSON.stringify(roomMeetings) !== JSON.stringify(meetings)) {
        setMeetings(roomMeetings);
      }
    }
  }, [roomMeetings, isError, error, meetings, setMeetings]);

  const handleSelectSlot = ({ start, end }) => {
    const selectedStart = dayjs(start);
    const selectedEnd = dayjs(end);

    const now = dayjs();
    if (selectedStart.isBefore(now)) {
      toast.error("You cannot select a past date or time.");
      return;
    }

    if (isTimeOverlapping(selectedStart, selectedEnd, meetings)) {
      toast.error("This time slot is already taken.");
      return;
    }

    setModalState({
      isModalOpen: true,
      selectedItem: {
        startDateTime: selectedStart.toISOString(),
        endDateTime: selectedEnd.toISOString(),
        title: "",
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
