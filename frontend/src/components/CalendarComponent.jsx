import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { parse, startOfWeek, format, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAtom } from "jotai";
import { meetingsAtom } from "../storage/meetingsAtom";
import { modalStateAtom } from "../storage/modalStateAtom";
import { selectedRoomAtom } from "../storage/selectedRoomAtom"; // Import room state
import EventModal from "./EventModal";
import RoomSelector from "./RoomSelector";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const CalendarComponent = () => {
  const [meetings, setMeetings] = useAtom(meetingsAtom);
  const [modalState, setModalState] = useAtom(modalStateAtom);
  const [selectedRoom] = useAtom(selectedRoomAtom);

  // Open the modal for adding/editing meetings
  const openModal = (meeting) => {
    setModalState({
      isModalOpen: true,
      selectedItem: meeting,
    });
  };

  // Handle selecting an empty slot to add a meeting
  const handleSelect = (slot) => {
    openModal({
      title: "",
      start: new Date(slot.start),
      end: new Date(slot.end),
      date: format(slot.start, "yyyy-MM-dd"),
      startTime: format(slot.start, "HH:mm"),
      endTime: format(slot.end, "HH:mm"),
      teamLead: "",
      participants: [],
      description: "",
      project: "",
      room: selectedRoom, // Assign selected room to the new meeting
    });
  };

  // Handle selecting an existing event
  const handleEventSelect = (event) => openModal(event);

  // Filter meetings to show only those belonging to the selected room
  const formattedMeetings = meetings
    .filter(meeting => meeting.room === selectedRoom) // Filter by room
    .map(meeting => ({
      title: meeting.title,
      start: new Date(meeting.start),
      end: new Date(meeting.end),
      allDay: false,
    }));

  return (
    <div>
      {/* Room Selector at the Top */}
      <RoomSelector />

      {/* Calendar Displaying Only Meetings for Selected Room */}
      <Calendar
        localizer={localizer}
        events={formattedMeetings}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventSelect}
        defaultView="week"
        style={{ height: "80vh", margin: "20px" }}
      />

      {/* Modal for Meeting Booking */}
      {modalState.isModalOpen && <EventModal />}
    </div>
  );
};

export default CalendarComponent;
