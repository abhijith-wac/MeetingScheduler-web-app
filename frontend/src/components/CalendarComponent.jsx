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
  const [calendarView, setCalendarView] = useAtom(calendarViewAtom);

  const filteredMeetings = Array.isArray(meetings)
    ? meetings
        .filter((m) => m.roomId === selectedRoom) // ✅ Match selected roomId
        .map((m) => ({
          ...m,
          start: m.start ? new Date(m.start) : new Date(), // Convert only if exists
          end: m.end ? new Date(m.end) : new Date(),
        }))
    : [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Room {selectedRoom || "Not Selected"} - Meeting Calendar
      </h2>
      <Calendar
        localizer={localizer}
        events={filteredMeetings}
        startAccessor="start"
        endAccessor="end"
        selectable
        view={calendarView}
        onView={setCalendarView}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 500 }}
      />
      <EventModal />
    </div>
  );
};

export default CalendarComponent;
