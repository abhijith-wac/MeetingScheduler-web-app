import React from "react";
import { useAtom } from "jotai";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { parseISO, startOfWeek, format, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { meetingsAtom } from "../storage/meetingsAtom";
import useCalendarHandlers from "../customHooks/useCalendarHandlers";
import EventModal from "./EventModal";
import { calendarViewAtom } from "../storage/calendarViewAtom";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = () => {
  const [selectedRoom] = useAtom(selectedRoomAtom);
  const [meetings] = useAtom(meetingsAtom);
  const { handleSelectSlot, handleSelectEvent } = useCalendarHandlers();
  const [calendarView, setCalendarView] = useAtom(calendarViewAtom); // Jotai Atom for tracking view

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {selectedRoom} - Meeting Calendar
      </h2>
      <Calendar
        localizer={localizer}
        events={meetings.filter((m) => m.room === selectedRoom)}
        startAccessor="start"
        endAccessor="end"
        selectable
        view={calendarView}
        onView={(newView) => setCalendarView(newView)} // Store the selected view in state
        onSelectSlot={handleSelectSlot} // No need to pass view manually anymore
        onSelectEvent={handleSelectEvent}
        style={{ height: 500 }}
      />
      <EventModal />
    </div>
  );
};

export default CalendarComponent;
