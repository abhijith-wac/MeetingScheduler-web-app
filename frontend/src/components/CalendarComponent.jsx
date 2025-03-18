import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { parse, startOfWeek, format, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventModal from "./EventModal";
import { useAtom } from "jotai";
import { meetingsAtom } from "../storage/meetingsAtom"; // Import meetings atom
import { modalStateAtom } from "../storage/modalStateAtom"; // Import modal state atom

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = () => {
  // Using Jotai atoms for meetings and modal state
  const [meetings, setMeetings] = useAtom(meetingsAtom);
  const [modalState, setModalState] = useAtom(modalStateAtom);

  // Open the modal and set the selected meeting item
  const openModal = (content) => {
    setModalState({
      isModalOpen: true,
      selectedItem: content, // Set the selected meeting for editing
    });
  };

  // Handle selecting an empty time slot to create a new meeting
  const handleSelect = (slot) => {
    const newEvent = {
      title: "",
      start: slot.start,
      end: slot.end,
      date: format(slot.start, "yyyy-MM-dd"),
      startTime: format(slot.start, "HH:mm"),
      endTime: format(slot.end, "HH:mm"),
      teamLead: "",
      participants: "",
      description: "",
      project: "",
    };
    openModal(newEvent); // Open modal for new event creation
  };

  // Handle selecting an existing event (meeting) to edit
  const handleEventSelect = (event) => {
    openModal(event); // Open modal with selected event for editing
  };

  // Convert meetings array to the format required by react-big-calendar
  const formattedMeetings = meetings.map((meeting) => ({
    title: meeting.title,
    start: new Date(meeting.start),
    end: new Date(meeting.end),
    allDay: false,
  }));

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Meeting Scheduler
      </h2>
      
      {/* Calendar component */}
      <Calendar
        localizer={localizer}
        events={formattedMeetings} // Use formatted meetings from atom
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect} // Handle slot selection
        onSelectEvent={handleEventSelect} // Handle event selection
        defaultView="month"
        style={{ height: '80vh' }}
      />

      {/* Display modal if it is open */}
      {modalState.isModalOpen && <EventModal />}
    </div>
  );
};

export default CalendarComponent;
