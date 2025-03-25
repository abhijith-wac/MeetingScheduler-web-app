import { useAtom } from "jotai";
import dayjs from "dayjs";
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
  const { meetings: roomMeetings, isError } = useMeetings(roomId);

  useEffect(() => {
    if (isError) return toast.error("Failed to fetch meetings.");
    setMeetings(roomMeetings);
  }, [roomMeetings, isError, setMeetings]);

  const handleSlotValidation = (start, end) => {
    const now = dayjs();
    if (dayjs(start).isBefore(now)) return "You cannot select a past date or time.";
    if (isTimeOverlapping(dayjs(start), dayjs(end), meetings)) return "This time slot is already taken.";
    return null;
  };

  const handleSelectSlot = ({ start, end }) => {
    const error = handleSlotValidation(start, end);
    if (error) return toast.error(error);

    setModalState({
      isModalOpen: true,
      selectedItem: {
        startDateTime: dayjs(start).toISOString(),
        endDateTime: dayjs(end).toISOString(),
        title: "",
        teamLead: "",
        description: "",
        project: "",
      },
    });
  };

  const handleSelectEvent = (event) => {
    setModalState({ isModalOpen: true, selectedItem: { ...event } });
  };

  return { handleSelectSlot, handleSelectEvent };
};

export default useCalendarHandlers;
